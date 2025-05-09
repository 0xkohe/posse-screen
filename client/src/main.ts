"use strict";
 import OpenAI from "openai";
import config from "./config";

 
 const client = new OpenAI({
   apiKey: config.apiKey,
   dangerouslyAllowBrowser: true,
   baseURL: "https://openrouter.ai/api/v1"
 });
 
 (async () => {
   alert("start");
   // const response = await client.responses.create({
   //   model: 'gpt-4o',
   //   instructions: 'You are a coding assistant that talks like a pirate',
   //   input: 'Are semicolons optional in JavaScript?',
   // });
   const completion = await client.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });

   alert("get");
   alert(completion.choices[0].message.content);
   //alert(response.output_text);
 })();

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
} from "firebase/firestore";

module POSSEscreen {
  export class Main {
    private ctx: CanvasRenderingContext2D;
    private myCanvas: HTMLCanvasElement;
    private comments: Comment[] = [];
    private roomId: string; // roomIdをroomIdに変更
    private db: Firestore;
    private screenWidth: number;
    private screenHeight: number;
    private workAreaHeight: number;
    private fontHeight: number;

    constructor(
      roomId: string, // roomIdをroomIdに変更
      screenWidth: number,
      screenHeight: number,
      workAreaHeight: number
    ) {
      this.myCanvas = <HTMLCanvasElement>document.getElementById("fullscreen");
      this.ctx = <CanvasRenderingContext2D>this.myCanvas.getContext("2d");

      this.myCanvas.width = document.documentElement.clientWidth;
      this.myCanvas.height = document.documentElement.clientHeight;

      this.roomId = roomId; // roomIdをroomIdに変更
      this.screenWidth = screenWidth;
      this.screenHeight = screenHeight;
      this.workAreaHeight = workAreaHeight;

      this.ctx.font = config.font;
      const mesure = this.ctx.measureText("ABC");
      this.fontHeight =
        mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent;

      console.log("const");

      this.db = getFirestore(app);

      // Firestoreのパスを修正: '/rooms/{roomId}/messages'
      // テキストメッセージのみを取得するためのフィルターを追加
      const q = query(
        collection(this.db, "rooms", this.roomId, "messages"),
        orderBy("createdAt", "desc")
      );
      
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          console.log(data);
          if (change.type === "added") {
            // テキストフィールドを使用
            this.addMessage(data.text);
          }
        });
      });
    }

    private addMessage = (message: string) => {
      const rate =
        Math.random() * (config.speedRate - 100) * 2 - (config.speedRate - 100);
      const speed = config.speed + (config.speed * rate) / 100;
      //      console.log("rate: " + rate);
      //      console.log("speed: " + speed);
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
      //      console.log(commentsLength);
      for (let i = commentsLength - 1; i >= 0; i--) {
        let c: Comment = this.comments[i];
        //        console.log(c);
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
        //        console.log(c.comment, c.x, this.getTopFromLane(c.lane), c.lane);
        this.ctx.fillStyle = c.fillStyle;
        this.ctx.fillText(c.comment, c.x, this.getTopFromLane(c.lane));
        this.ctx.strokeText(c.comment, c.x, this.getTopFromLane(c.lane));
      }
    };
  }
}

function start(
  roomId: string, // roomIdをroomIdに変更
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
  sp.get("roomId") + "", // roomIdをroomIdに変更
  Number(sp.get("width")),
  Number(sp.get("height")),
  Number(sp.get("workAreaHeight"))
);