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

// Function to generate AI response using OpenAI
async function generateAIResponse(message: string): Promise<string> {
  // Check if client is initialized (API key is configured)
  if (!client) {
    return "AI response is not available. API key is not configured.";
  }
  
  try {
    const completion = await client.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: "次の質問を関西弁で答えてください。" + message.replace('@ai', '').trim(),
        },
      ],
    });
    return completion.choices[0].message.content || "AI couldn't generate a response";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Error generating AI response. Please try again.";
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

      console.log("const");

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
            this.addMessage(data.text);
            
            // Check if message contains @ai, is not already an AI response, and process it
            if (data.text.includes("@ai") && !data.isAIResponse) {
              this.handleAIRequest(data.text, change.doc.id);
            }
          }
        });
      });
    }

    // Handle AI request and post response back to Firestore
    private handleAIRequest = async (message: string, messageId: string) => {
      // Don't proceed if API key is not configured
      if (!isApiKeyConfigured) {
        console.warn("Skipping AI request: API key not configured");
        // Optionally, you could send a message to Firestore indicating the AI is not available
        await addDoc(collection(this.db, "rooms", this.roomId, "messages"), {
          text: `>> ${message}\nAI response is not available. API key is not configured.`,
          createdAt: serverTimestamp(),
          isAIResponse: true,
          originalMessageId: messageId // Store reference to original message
        });
        return;
      }
      
      try {
        // Check if we've already responded to this message
        const checkQuery = query(
          collection(this.db, "rooms", this.roomId, "messages"),
          where("originalMessageId", "==", messageId)
        );
        
        const checkSnapshot = await getDocs(checkQuery);
        if (!checkSnapshot.empty) {
          console.log("Already responded to this message, skipping");
          return;
        }
        
        // Generate AI response
        const aiResponse = await generateAIResponse(message);
        
        // Format response with original message
        const formattedResponse = `>> ${message} << \n${aiResponse}`;
        
        // Add AI response to Firestore
        await addDoc(collection(this.db, "rooms", this.roomId, "messages"), {
          text: formattedResponse,
          createdAt: serverTimestamp(),
          isAIResponse: true,
          originalMessageId: messageId // Store reference to original message
        });
        
        console.log("AI response added to Firestore");
      } catch (error) {
        console.error("Error handling AI request:", error);
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
  console.log("main");

  function loop() {
    main.update();
    main.draw();

    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
}

console.log("start 0");
const sp = new URLSearchParams(window.location.search);
console.log(sp.get("roomId"));
start(
  sp.get("roomId") + "",
  Number(sp.get("width")),
  Number(sp.get("height")),
  Number(sp.get("workAreaHeight"))
);