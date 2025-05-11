import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "チャットルーム | 参加" },
    { name: "description", content: "チャットルームに参加するためのページです" },
  ];
}

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 transition-colors duration-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            チャットルームに参加
          </h1>
          <p className="mt-2 text-gray-300">
            Firestore のルーム ID を入力してください
          </p>
        </div>
        
        <form onSubmit={handleJoinRoom} className="mt-8 space-y-6">
          <div>
            <label htmlFor="room-id" className="block text-sm font-medium text-gray-300">
              ルーム ID
            </label>
            <input
              id="room-id"
              name="roomId"
              type="text"
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
              placeholder="ルーム ID を入力"
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              参加する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}