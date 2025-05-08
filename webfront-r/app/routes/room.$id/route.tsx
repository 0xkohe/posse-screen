import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';

// Type for post object
interface Post {
  id: number;
  number: string;
  username: string;
  text: string;
  timestamp: Date;
  likes: number;
  image?: string; // Optional property
  avatar?: string; // Optional property for user avatar
}

// Props for the post component
interface PostProps {
  post: Post;
}

// 投稿コンポーネント - 宇宙×2ch風
const CosmicPost: React.FC<PostProps> = ({ post }) => {
  const [showActions, setShowActions] = useState<boolean>(false);

  return (
    <div
      className="mb-4 bg-gray-900 border border-indigo-900 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-[1.01] hover:shadow-indigo-900/20"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="px-4 py-2 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 flex justify-between items-center border-b border-indigo-900/40">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center overflow-hidden border border-purple-300/20">
            {post.avatar ? (
              <img src={post.avatar} alt={post.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">{post.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="ml-2">
            <span className="font-medium text-cyan-300">{post.username}</span>
            <span className="ml-2 text-xs text-gray-400">ID:{post.id.toString(16).padStart(8, '0')}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs font-mono text-gray-400 mr-2">
            {post.number}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(post.timestamp).toLocaleString([], {
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
      </div>
      <div className="p-4 bg-gray-900 bg-opacity-80 relative overflow-hidden">
        {/* 宇宙のきらめき効果 */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-px rounded-full bg-white animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.8)'
              }}
            />
          ))}
        </div>

        <p className="text-gray-100 whitespace-pre-line break-words">{post.text}</p>

        {post.image && (
          <div className="mt-3 rounded overflow-hidden inline-block">
            <img src={post.image} alt="投稿画像" className="max-h-60 max-w-full" />
          </div>
        )}
      </div>

      <div className={`px-4 py-2 bg-gray-800/60 flex gap-4 ${showActions ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
        <button className="flex items-center text-gray-400 text-xs hover:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905V9" />
          </svg>
          {post.likes || 0}
        </button>
        <button className="flex items-center text-gray-400 text-xs hover:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          レス
        </button>
        <button className="flex items-center text-gray-400 text-xs hover:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          共有
        </button>
      </div>
    </div>
  );
};

// We don't need this anymore since we added avatar to the Post interface

// メイン掲示板コンポーネント
const CosmicForumPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1001,
      number: "1",
      username: "宇宙飛行士774号",
      text: "ここが俺たちの新たな星間掲示板か…地球じゃ言えないことをどんどん書き込んでくれ",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      likes: 42,
      image: "https://via.placeholder.com/400x200/000020/ffffff?text=宇宙の風景"
    },
    {
      id: 1002,
      number: "2",
      username: "惑星開拓者",
      text: ">>1\n火星移住計画の進捗どうなってる？\n2030年には実現するって噂だけどマジ？",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      likes: 15,
    },
    {
      id: 1003,
      number: "3",
      username: "銀河系住民",
      text: "ダークマターって実際どうなん？見えないけど宇宙の8割を占めるとか言われてるけど、お前ら詳しいやついる？\n\n俺の考察だと…",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      likes: 38
    },
    {
      id: 1004,
      number: "4",
      username: "人工知能2025",
      text: "量子もつれを利用した星間通信システム開発したわ\nこれで地球に帰らなくても2chできるぞ",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: 87,
      image: "https://via.placeholder.com/400x200/000040/00ffff?text=量子通信システム"
    },
    {
      id: 1005,
      number: "5",
      username: "ブラックホーラー",
      text: ">>4\nマジかよ、特許取った？\n\nってかお前らさ、この前ケプラー186fからの電波キャッチしたの知ってる？\nついに宇宙人の痕跡見つかったかもしれんぞ",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 63
    },
  ]);

  const [newPost, setNewPost] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [showAnonymousOptions, setShowAnonymousOptions] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const postsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自動スクロール
  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  useEffect(() => {
    // 入力フィールドにフォーカス
    inputRef.current?.focus();

    // ランダムな匿名名を提案
    const anonymousNames = [
      "宇宙飛行士774号",
      "銀河系住民",
      "星間旅行者",
      "ブラックホーラー",
      "惑星開拓者",
      "地球脱出民",
      "宇宙猫",
      "小惑星マイナー"
    ];
    setUsername(anonymousNames[Math.floor(Math.random() * anonymousNames.length)]);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // プレビュー用URLを作成
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setPreviewImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (newPost.trim() === '') return;
    const currentUsername = username.trim() === '' ? "宇宙の名無しさん" : username.trim();

    // 新しい投稿を追加
    const newPostObj: Post = {
      id: Math.floor(1000 + Math.random() * 9000),
      number: `${posts.length + 1}`,
      username: currentUsername,
      text: newPost,
      timestamp: new Date(),
      likes: 0,
      // Only add image if previewImage exists
      ...(previewImage && { image: previewImage })
    };

    setPosts([...posts, newPostObj]);
    setNewPost('');
    setPreviewImage(null);
    setSelectedFile(null);
    // 新しい匿名名を提案 (任意)
    const anonymousNames = [
        "宇宙飛行士774号", "銀河系住民", "星間旅行者", "ブラックホーラー", 
        "惑星開拓者", "地球脱出民", "宇宙猫", "小惑星マイナー"
    ];
    setUsername(anonymousNames[Math.floor(Math.random() * anonymousNames.length)]);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.ctrlKey && e.currentTarget.id === 'post-content') {
      e.preventDefault();
      handleCreatePost();
    }
  };

  // AAの例を表示
  const insertAA = () => {
    const asciiArts = [ // 簡略化したAA
      "(^_^)",
      "(>_<)",
      "(^-^)/",
      "(T_T)",
      "m(_ _)m",
      "orz"
    ];

    setNewPost(newPost + "\n" + asciiArts[Math.floor(Math.random() * asciiArts.length)]);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white bg-[url('https://via.placeholder.com/100/000015/000015?text=')] bg-repeat">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 border-b border-cyan-700 shadow-lg relative overflow-hidden">
        {/* 宇宙の星のエフェクト */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-px rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.8)',
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>

        <div className="flex items-center space-x-3 z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center overflow-hidden border-2 border-cyan-300/30 animate-pulse">
              <span className="text-lg font-bold">宇</span>
            </div>
            <div className="ml-3">
              <h2 className="font-bold text-cyan-300 text-lg tracking-wider">宇宙板</h2>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                <p className="text-xs text-gray-300">
                  <span className="text-cyan-400 font-mono">{posts.length}</span> レス •{' '}
                  <span className="text-cyan-400 font-mono ml-1">42</span> 人の宇宙人が観測中
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 z-10">
          <button className="p-2 rounded bg-indigo-800/50 hover:bg-indigo-700/70 transition text-cyan-300 border border-cyan-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 rounded bg-indigo-800/50 hover:bg-indigo-700/70 transition text-cyan-300 border border-cyan-800/50 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-cyan-500 text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
          </button>
          <button className="p-2 rounded bg-indigo-800/50 hover:bg-indigo-700/70 transition text-cyan-300 border border-cyan-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      {/* 宇宙掲示板エリア */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-950 relative">
        {/* 背景の宇宙効果 */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-950 to-gray-950"></div>
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-px rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.8)',
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* 現在のスレッド情報 */}
          <div className="mb-6 bg-indigo-900/30 rounded-lg p-4 border border-cyan-800/30">
            <h1 className="text-xl font-bold text-cyan-300 mb-2">【宇宙開発】人類の星間移住計画について語るスレ【第3銀河】</h1>
            <p className="text-gray-300 text-sm">
              ここは宇宙と2chが融合した新時代の掲示板。<br />
              地球の常識は捨てて、銀河の彼方から好きなことを書き込め。<br />
              <span className="text-cyan-400">※荒らしは虚空に消去されます</span>
            </p>
          </div>

          {posts.map((post) => (
            <CosmicPost key={post.id} post={post} />
          ))}
          <div ref={postsEndRef} />
        </div>
      </div>

      {/* 新規投稿エリア */}
      <div className="p-4 bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border-t border-cyan-900/50 shadow-lg">
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-cyan-800/30 shadow-lg relative">
          {/* 入力欄の上部の光るライン */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

          <div className="p-4">
            <div className="flex items-center mb-3">
              <div
                className="relative w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center mr-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowAnonymousOptions(!showAnonymousOptions)}
              >
                <span className="text-sm font-bold text-white">{username.charAt(0).toUpperCase() || '？'}</span>
                {showAnonymousOptions && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 border border-cyan-900/50 rounded-lg shadow-lg z-20">
                    <div className="p-2">
                      <p className="text-xs text-gray-400 mb-2">匿名ハンドルネーム:</p>
                      <input
                        type="text"
                        className="w-full bg-gray-700 text-white text-sm rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-gray-600"
                        placeholder="宇宙の名無しさん"
                        value={username}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                      />
                      <div className="mt-2 grid grid-cols-2 gap-1">
                        {["宇宙飛行士", "銀河系住民", "火星移住者", "異星人", "ブラックホーラー", "地球脱出民"].map((name) => (
                          <button
                            key={name}
                            className="text-xs py-1 px-2 bg-indigo-900/50 hover:bg-indigo-800 rounded text-cyan-300 truncate"
                            onClick={() => {
                              setUsername(name);
                              setShowAnonymousOptions(false);
                              inputRef.current?.focus();
                            }}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <input
                  id="username"
                  type="text"
                  className="w-full bg-gray-800 border-b border-cyan-900/30 text-cyan-300 rounded px-3 py-1 focus:outline-none focus:border-cyan-500 text-sm"
                  placeholder="匿名ハンドルネーム"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">※任意のハンドルネームを入力（空白で「宇宙の名無しさん」）</p>
              </div>
            </div>

            <div className="mb-3">
              <textarea
                id="post-content"
                ref={inputRef}
                rows={4}
                className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-gray-700 font-mono"
                placeholder=">>1に反応してください（Ctrl+Enterで送信）"
                value={newPost}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewPost(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>

            {/* プレビュー表示 */}
            {previewImage && (
              <div className="mb-3 relative inline-block">
                <img src={previewImage} alt="プレビュー" className="max-h-32 rounded border border-gray-700" />
                <button
                  className="absolute top-1 right-1 bg-gray-900/80 rounded-full p-1 hover:bg-red-900/80"
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                    if(fileInputRef.current) fileInputRef.current.value = ""; // ファイル選択をリセット
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-700 transition text-cyan-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-700 transition text-cyan-300"
                  onClick={insertAA}
                >
                  {/* AA挿入アイコンを文字に変更 */}
                  <span className="text-sm font-mono">AA</span>
                  <span className="sr-only">AA挿入</span>
                </button>
                <button type="button" className="p-2 rounded hover:bg-gray-700 transition text-cyan-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded font-medium hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${(!newPost.trim()) ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
                disabled={!newPost.trim()}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  書き込む
                </span>
              </button>
            </div>
          </div>

          {/* 入力欄下部のステータス表示 */}
          <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 flex justify-between items-center">
            <div>
              <span className="text-cyan-400">{posts.length}</span> レス中
            </div>
            <div>
              <span className="text-cyan-400">{newPost.length}</span> / 1000 文字
              {newPost.length > 500 && <span className="ml-2 text-yellow-400">（長文注意）</span>}
              {newPost.length > 900 && newPost.length <= 1000 && <span className="ml-2 text-orange-400">（残り {1000 - newPost.length} 文字）</span>}
              {newPost.length > 1000 && <span className="ml-2 text-red-500">（文字数超過！）</span>}
            </div>
          </div>
        </div>
      </div>
       {/* フッター */}
      <footer className="bg-gray-900 border-t border-indigo-900/30 py-3 px-4 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} 宇宙掲示板 - 地球から銀河系の果てまで</p>
      </footer>
    </div>
  );
};

export default CosmicForumPage;