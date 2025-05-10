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
  const [dialectType, setDialectType] = useState<'kansai' | 'space' | 'normal'>('kansai');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();

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

    const newPostObj: Post = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      number: `${postCount + 1}`,
      username: currentUsername,
      text: newPost,
      timestamp: new Date(),
      likes: 0,
      dialect_type: dialectType,
      ...(previewImage && { image: previewImage })
    };

    onSubmit(newPostObj);
    setNewPost('');
    setPreviewImage(null);
    setSelectedFile(null);

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
    <div className="p-2 bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border-t border-cyan-900/50 shadow-lg">
      <div className="max-w-full mx-auto bg-gray-900 rounded-lg overflow-hidden border border-cyan-800/30 shadow-lg relative">
        <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

        <div className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div className="md:col-span-1 flex md:flex-col justify-between items-start space-y-0 md:space-y-2">
              <div className="flex items-center">
                <div
                  className="relative w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center mr-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowAnonymousOptions(!showAnonymousOptions)}
                >
                  <span className="text-xs font-bold text-white">{username.charAt(0).toUpperCase() || '？'}</span>
                  {showAnonymousOptions && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 border border-cyan-900/50 rounded-lg shadow-lg z-20">
                      <div className="p-2">
                        <p className="text-xs text-gray-400 mb-1">匿名ハンドルネーム:</p>
                        <input
                          type="text"
                          className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-gray-600"
                          placeholder="宇宙の名無しさん"
                          value={username}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        />
                        <div className="mt-2 grid grid-cols-2 gap-1">
                          {["宇宙飛行士", "銀河系住民", "火星移住者", "異星人", "ブラックホーラー", "地球脱出民"].map((name) => (
                            <button
                              key={name}
                              className="text-xs py-1 px-1 bg-indigo-900/50 hover:bg-indigo-800 rounded text-cyan-300 truncate"
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
                <input
                  id="username"
                  type="text"
                  className="bg-gray-800 border-b border-cyan-900/30 text-cyan-300 rounded px-2 py-1 focus:outline-none focus:border-cyan-500 text-xs w-24 md:w-full"
                  placeholder="匿名ハンドル"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                />
              </div>

              <div className="md:mt-1 flex md:flex-col items-center md:items-start space-x-1 md:space-x-0 md:space-y-1">
                <div className="hidden md:block text-xs text-gray-400">スタイル:</div>
                <div className="flex md:grid md:grid-cols-3 space-x-1 md:space-x-0 md:gap-1">
                  <button
                    className={`px-2 py-0.5 text-xs rounded-full transition ${
                      dialectType === 'kansai' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setDialectType('kansai')}
                  >
                    関西弁
                  </button>
                  <button
                    className={`px-2 py-0.5 text-xs rounded-full transition ${
                      dialectType === 'space' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setDialectType('space')}
                  >
                    宇宙語
                  </button>
                  <button
                    className={`px-2 py-0.5 text-xs rounded-full transition ${
                      dialectType === 'normal' 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-800 text-cyan-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setDialectType('normal')}
                  >
                    通常
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col">
              <textarea
                id="post-content"
                ref={inputRef}
                rows={3}
                className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-gray-700 font-mono text-sm"
                placeholder={
                  dialectType === 'kansai' ? "なんか書いてみようやぁ～（Ctrl+Enterで送信やで）" :
                  dialectType === 'space' ? "✧✧✧っぽ✧彡✧宇宙語でっぽ✧彡✧✧（Ctrl+Enter✧彡）" :
                  "投稿内容をご入力ください（Ctrl+Enterで送信）"
                }
                value={newPost}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewPost(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              <div className="flex justify-between items-center mt-1 space-x-2">
                <div className="flex items-center space-x-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-700 transition text-cyan-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-700 transition text-cyan-300"
                    onClick={insertAA}
                  >
                    <span className="text-xs font-mono">AA</span>
                  </button>
                  <button
                    type="button" 
                    className="p-1 rounded hover:bg-gray-700 transition text-cyan-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                
                  <span className="text-xs text-gray-400 ml-1">
                    <span className="text-cyan-400">{newPost.length}</span>/1000
                    {newPost.length > 900 && <span className="ml-1 text-orange-400">（残り{1000 - newPost.length}字）</span>}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    <span className="text-cyan-400">{postCount}</span>レス
                  </span>
                  <button
                    onClick={handleCreatePost}
                    className={`px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${(!newPost.trim()) ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
                    disabled={!newPost.trim()}
                  >
                    {dialectType === 'kansai' ? '書き込むでぇ～' :
                     dialectType === 'space' ? '✧彡送信っぽ✧彡' :
                     '書き込む'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {previewImage && (
            <div className="mt-2 relative inline-block">
              <img src={previewImage} alt="プレビュー" className="max-h-24 rounded border border-gray-700" />
              <button
                className="absolute top-1 right-1 bg-gray-900/80 rounded-full p-1 hover:bg-red-900/80"
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedFile(null);
                  if(fileInputRef.current) fileInputRef.current.value = ""; 
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;