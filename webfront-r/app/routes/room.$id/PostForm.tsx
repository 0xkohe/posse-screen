import React, { useState, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { Post } from './types';

interface PostFormProps {
  onSubmit: (post: Post) => void;
  postCount: number;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, postCount }) => {
  const [newPost, setNewPost] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [showAnonymousOptions, setShowAnonymousOptions] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Set random username on first render
  React.useEffect(() => {
    // Focus input field
    inputRef.current?.focus();

    // Suggest random anonymous name
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

      // Create preview URL
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

    // Create new post object
    const newPostObj: Post = {
      id: Math.floor(1000 + Math.random() * 9000),
      number: `${postCount + 1}`,
      username: currentUsername,
      text: newPost,
      timestamp: new Date(),
      likes: 0,
      ...(previewImage && { image: previewImage })
    };

    onSubmit(newPostObj);
    setNewPost('');
    setPreviewImage(null);
    setSelectedFile(null);
    
    // Suggest a new random name
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

  // Insert ASCII Art examples
  const insertAA = () => {
    const asciiArts = [
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
    <div className="p-4 bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border-t border-cyan-900/50 shadow-lg">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-cyan-800/30 shadow-lg relative">
        {/* Glowing line at top of input */}
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

          {/* Preview display */}
          {previewImage && (
            <div className="mb-3 relative inline-block">
              <img src={previewImage} alt="プレビュー" className="max-h-32 rounded border border-gray-700" />
              <button
                className="absolute top-1 right-1 bg-gray-900/80 rounded-full p-1 hover:bg-red-900/80"
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedFile(null);
                  if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file selection
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

        {/* Status display at bottom of input */}
        <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 flex justify-between items-center">
          <div>
            <span className="text-cyan-400">{postCount}</span> レス中
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
  );
};

export default PostForm;