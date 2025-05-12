import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { 
  db, 
  collection, 
  addDoc, 
  doc, 
  serverTimestamp 
} from '~/lib/firebase';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ZEN SPACE | 宇宙チャットルーム" },
    { name: "description", content: "宇宙と和の融合、チャットルームに参加したり新しいルームを作成できます" },
  ];
}

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"join" | "create">("join");
  const navigate = useNavigate();
  
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomId.trim()) {
      setError("ルームIDを入力してください");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error('Error joining room:', err);
      setError('ルームの参加に失敗しました。IDを確認してもう一度お試しください。');
      setIsLoading(false);
    }
  };
  
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError("ルーム名を入力してください");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add the room to Firestore collection with auto-generated ID
      const roomDocRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        createdAt: serverTimestamp(),
        createdBy: '宇宙飛行士',
      });
      
      // Navigate to the newly created room
      navigate(`/room/${roomDocRef.id}`);
    } catch (err) {
      console.error('Error creating room:', err);
      setError('ルームの作成に失敗しました。もう一度お試しください。');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* 宇宙の背景 - 星と銀河のアニメーション */}
      <div className="absolute inset-0 z-0">
        <div className="stars-container absolute inset-0 overflow-hidden">
          {/* 星のエフェクト */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
              }}
            />
          ))}
          
          {/* 日本の山と月 - シルエット */}
          <div className="absolute bottom-0 w-full">
            <svg viewBox="0 0 1200 200" className="w-full h-auto">
              <path d="M0,200 L0,150 Q200,100 400,130 Q600,150 800,110 Q1000,90 1200,120 L1200,200 Z" fill="#0d0d15" />
              <circle cx="900" cy="80" r="40" fill="#f0f0f0" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* 日本の紙の質感をイメージしたオーバーレイ */}
      <div className="absolute inset-0 z-0 opacity-10" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}>
      </div>
      
      {/* 和風の装飾的な円形 - 太陽/月をイメージ */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-900 to-purple-800 opacity-50 blur-md animate-float"></div>
      
      {/* メインコンテンツ */}
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="backdrop-blur-xl bg-gray-900 bg-opacity-60 p-8 rounded-lg border border-indigo-800 shadow-lg relative overflow-hidden transform transition-all hover:scale-[1.01]">
          {/* 和柄の装飾 */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
          
          {/* ヘッダー */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-2 tracking-wider">
              禅スペース
            </div>
            <h1 className="text-2xl font-bold text-white mt-2">
              {mode === "join" ? "チャットルームに参加" : "新しいルームを作成"}
            </h1>
            <p className="mt-2 text-gray-300 text-sm">
              {mode === "join" 
                ? "宇宙と調和するルームIDを入力してください" 
                : "新しい宇宙の扉を開きましょう"}
            </p>
            
            {/* タブ切り替え */}
            <div className="flex justify-center mt-4 mb-2 border-b border-indigo-800/30">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  mode === "join"
                    ? "text-cyan-300 border-b-2 border-cyan-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setMode("join")}
              >
                参加する
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  mode === "create"
                    ? "text-purple-300 border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setMode("create")}
              >
                新規作成
              </button>
            </div>
            
            {/* 和風の装飾線 */}
            <div className="flex items-center justify-center my-4">
              <div className="h-px w-16 bg-indigo-700"></div>
              <div className="mx-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-400 fill-current">
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="h-px w-16 bg-indigo-700"></div>
            </div>
          </div>
          
          {/* フォーム */}
          <form onSubmit={mode === "join" ? handleJoinRoom : handleCreateRoom} className="space-y-6">
            {mode === "create" && (
              <div>
                <label htmlFor="room-name" className="block text-sm font-medium text-purple-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  ルーム名
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="room-name"
                    name="roomName"
                    type="text"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="block w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-purple-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 backdrop-blur-sm"
                    placeholder="例: 銀河の哲学カフェ"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-xs text-purple-300/70">宇宙の仲間と共有するユニークな名前をつけてください</p>
              </div>
            )}
            
            {mode === "join" && (
              <div>
                <label htmlFor="room-id" className="block text-sm font-medium text-cyan-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  ルーム ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="room-id"
                    name="roomId"
                    type="text"
                    required
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="block w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-cyan-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 backdrop-blur-sm"
                    placeholder="例: AZ81nL9pQbXyF5sRmD2V"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-xs text-cyan-300/70">共有されたIDを入力して既存の部屋に参加します</p>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-700 hover:from-indigo-800 hover:via-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{mode === "join" ? "接続中..." : "部屋を作成中..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>{mode === "join" ? "宇宙の旅へ" : "新しい宇宙を創造"}</span>
                    <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setMode(mode === "join" ? "create" : "join")}
              className="text-indigo-400 text-xs underline"
            >
              {mode === "join" ? "新しいルームを作成する" : "既存のルームに参加する"}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-300 text-sm text-center animate-pulse">
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {/* フッター装飾 */}
          <div className="mt-6 flex justify-center">
            <div className="text-indigo-400 text-xs">宇宙 ✧ 調和 ✧ 静寂</div>
          </div>
        </div>
      </div>
      
      {/* CSSアニメーション */}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}