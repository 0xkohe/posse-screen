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
  addDoc,
  serverTimestamp,
  getDocs
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
            // Get dialect type from the message data
            const messageDialectType = data.dialect_type || "normal";
            
            // Convert the message based on dialect type if not an AI response already
            if (!data.isAIResponse) {
              this.handleDialectConversion(data.text, change.doc.id, messageDialectType);
            } else {
              // Add AI responses directly without conversion
              this.addMessage(data.text);
            }
          }
        });
      });
    }

    // Handle dialect conversion and post response back to Firestore
    private handleDialectConversion = async (messageText: string, messageId: string, dialectType: string) => {
      // Skip conversion if dialect is normal
      if (dialectType === "normal") {
        this.addMessage(messageText);
        return;
      }
      
      // Don't proceed if API key is not configured
      if (!isApiKeyConfigured) {
        console.warn("Skipping dialect conversion: API key not configured");
        this.addMessage(messageText);
        return;
      }
      
      try {
        // Check if we've already converted this message
        const checkQuery = query(
          collection(this.db, "rooms", this.roomId, "messages"),
          where("originalMessageId", "==", messageId)
        );
        
        const checkSnapshot = await getDocs(checkQuery);
        if (!checkSnapshot.empty) {
          console.log("Already converted this message, skipping");
          return;
        }
        
        // Display original message
        this.addMessage(messageText);
        
        // Generate converted message based on dialect type
        const convertedMessage = await convertToDialect(messageText, dialectType);
        
        // Add the converted message to Firestore
        await addDoc(collection(this.db, "rooms", this.roomId, "messages"), {
          text: convertedMessage,
          createdAt: serverTimestamp(),
          isAIResponse: true,
          originalMessageId: messageId,
          dialect_type: dialectType // Store the dialect type with the AI response
        });
        
        console.log("Dialect-converted message added to Firestore");
      } catch (error) {
        console.error("Error handling dialect conversion:", error);
        this.addMessage(messageText); // Display original if conversion fails
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