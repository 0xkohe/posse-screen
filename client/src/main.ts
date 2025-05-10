"use strict";
import OpenAI from "openai";
import config from "./config";
import app from "./firebase";
import { Comment } from "./comment";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  Firestore,
  where,
  updateDoc,
  serverTimestamp,
  doc
} from "firebase/firestore";

// Check if API key is configured
const isApiKeyConfigured = config.apiKey && config.apiKey !== "" && config.apiKey !== "YOUR_API_KEY_HERE";

// Initialize OpenAI client only if API key is configured
let client: OpenAI | null = null;
if (isApiKeyConfigured) {
  client = new OpenAI({
    apiKey: config.apiKey,
    dangerouslyAllowBrowser: true,
    baseURL: "https://openrouter.ai/api/v1"
  });
  console.log("OpenAI client initialized");
} else {
  console.warn("OpenAI API key not configured. AI response feature will be disabled.");
}

// Function to generate dialect conversion for a message
async function convertToDialect(messageText: string, dialectType: string): Promise<string> {
  // Check if client is initialized (API key is configured)
  if (!client) {
    return messageText; // Return original if API not available
  }
  
  let promptPrefix = "";
  
  // Set prompt prefix based on dialect type
  switch(dialectType) {
    case "kansai":
      promptPrefix = "次の文章を関西弁に変換してください。※変換した関西弁のみ出力してください。: ";
      break;
    case "space":
      promptPrefix = "次の文章を宇宙人が話すような宇宙語に変換してください。文末に「ビーム」や「ズガガ」などをつけたり、単語をロボットっぽく変換してください。※変換した宇宙語のみ出力するように。: ";
      break;
    default:
      // No special prompt for default case - just return the original message
      return messageText;
  }
  
  try {
    if (client) {
      const completion = await client.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'user',
            content: promptPrefix + messageText,
          },
        ],
      });
      return completion.choices[0]?.message?.content || messageText;
    } else {
      return messageText;
    }
  } catch (error) {
    console.error("Error generating dialect conversion:", error);
    return messageText; // Return original message if conversion fails
  }
}

module POSSEscreen {
  export class Main {
    private ctx: CanvasRenderingContext2D;
    private myCanvas: HTMLCanvasElement;
    private comments: Comment[] = [];
    private roomId: string;
    private db: Firestore;
    private screenWidth: number;
    private screenHeight: number;
    private workAreaHeight: number;
    private fontHeight: number;
    // Map to keep track of messages being processed to avoid double processing
    private processingMessages: Map<string, boolean> = new Map();

    constructor(
      roomId: string,
      screenWidth: number,
      screenHeight: number,
      workAreaHeight: number
    ) {
      this.myCanvas = <HTMLCanvasElement>document.getElementById("fullscreen");
      this.ctx = <CanvasRenderingContext2D>this.myCanvas.getContext("2d");

      this.myCanvas.width = document.documentElement.clientWidth;
      this.myCanvas.height = document.documentElement.clientHeight;

      this.roomId = roomId;
      this.screenWidth = screenWidth;
      this.screenHeight = screenHeight;
      this.workAreaHeight = workAreaHeight;

      this.ctx.font = config.font;
      const mesure = this.ctx.measureText("ABC");
      this.fontHeight =
        mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent;

      console.log("constructor initialized");

      this.db = getFirestore(app);

      const q = query(
        collection(this.db, "rooms", this.roomId, "messages"),
        orderBy("createdAt", "desc")
      );
      
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          console.log(data);
          
          if (change.type === "added") {
            const messageId = change.doc.id;
            const messageText = data.text;
            const dialectType = data.dialect_type || "normal";
            const isConverted = data.isConverted || false;
            
            // Skip if we've already processed this message or it's already converted
            if (this.processingMessages.get(messageId) || isConverted) {
              // If it's already converted, just display it
              this.addMessage(messageText);
              return;
            }
            
            // Handle dialect conversion
            if (dialectType !== "normal") {
              // Mark message as being processed
              this.processingMessages.set(messageId, true);
              this.handleDialectConversion(messageText, messageId, dialectType);
            } else {
              // For normal messages, just display directly
              this.addMessage(messageText);
            }
          } else if (change.type === "modified") {
            // If a message was modified, update the display
            // const messageText = data.text;
            // Check if this message is in our comments list, if so update it
            // For simplicity, we'll just add the updated message
            // this.addMessage(messageText);
          }
        });
      });
    }

    // Handle dialect conversion and update the original message document
    private handleDialectConversion = async (messageText: string, messageId: string, dialectType: string) => {
      // Skip conversion if dialect is normal or API key is not configured
      if (dialectType === "normal" || !isApiKeyConfigured) {
        // Still display the original message
        this.addMessage(messageText);
        this.processingMessages.delete(messageId);
        return;
      }
      
      try {
        // Display original message first
        // this.addMessage(messageText);
        
        // Generate converted message based on dialect type
        const convertedMessage = await convertToDialect(messageText, dialectType);
        this.addMessage(convertedMessage);
        
        // Only update if conversion actually changed the message
        if (convertedMessage !== messageText) {
          // Update the original document with the converted text
          const messageRef = doc(this.db, "rooms", this.roomId, "messages", messageId);
          await updateDoc(messageRef, {
            text: convertedMessage,
            originalText: messageText, // Store the original for reference
            isConverted: true,
            convertedAt: serverTimestamp()
          });
          
          console.log("Message updated with dialect conversion");
          
          // Display the converted message (will be handled by the onSnapshot)
          // No need to call addMessage here as the update will trigger the snapshot
        }
      } catch (error) {
        console.error("Error handling dialect conversion:", error);
      } finally {
        // Make sure to clear the processing flag
        this.processingMessages.delete(messageId);
      }
    };

    private addMessage = (message: string) => {
      const rate =
        Math.random() * (config.speedRate - 100) * 2 - (config.speedRate - 100);
      const speed = config.speed + (config.speed * rate) / 100;
      let comment = new Comment(
        this.screenWidth,
        speed,
        this.getAvailableLane(),
        message,
        this.ctx.measureText(message).width,
        config.fillStyle[Math.floor(Math.random() * config.fillStyle.length)]
      );
      this.comments.push(comment);
    };

    private getAvailableLane = () => {
      let lane: number = 0;
      while (true) {
        let laneUsed = false;
        for (const c of this.comments) {
          if (c.lane == lane) {
            laneUsed = true;
            break;
          }
        }
        if (!laneUsed) {
          return lane;
        }
        lane++;
      }
    };

    private getTopFromLane = (lane: number) => {
      const workAreaTop = this.screenHeight - this.workAreaHeight;
      return (
        ((this.fontHeight * 1.5 * lane) %
          (this.screenHeight - this.fontHeight * 2)) +
        workAreaTop +
        this.fontHeight
      );
    };

    public update = () => {
      let commentsLength = this.comments.length;
      for (let i = commentsLength - 1; i >= 0; i--) {
        let c: Comment = this.comments[i];
        c.move();
        if (!c.isShowing()) {
          this.comments.splice(i, 1);
        }
      }
    };

    public draw = () => {
      this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
      this.ctx.strokeStyle = config.strokeStyle;
      this.ctx.font = config.font;

      for (const c of this.comments) {
        this.ctx.fillStyle = c.fillStyle;
        this.ctx.fillText(c.comment, c.x, this.getTopFromLane(c.lane));
        this.ctx.strokeText(c.comment, c.x, this.getTopFromLane(c.lane));
      }
    };
  }
}

function start(
  roomId: string,
  width: number,
  height: number,
  workAreaHeight: number
) {
  console.log("start");
  const main = new POSSEscreen.Main(roomId, width, height, workAreaHeight);
  console.log("main initialized");

  function loop() {
    main.update();
    main.draw();

    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
  
  return main; // Return the main instance for external access
}

console.log("starting application");
const sp = new URLSearchParams(window.location.search);
console.log("Room ID:", sp.get("roomId"));

const main = start(
  sp.get("roomId") + "",
  Number(sp.get("width")),
  Number(sp.get("height")),
  Number(sp.get("workAreaHeight"))
);