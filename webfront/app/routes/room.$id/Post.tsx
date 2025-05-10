import React, { useState } from 'react';
import type { PostProps } from './types';

// Post component - Cosmic 2ch style
const Post: React.FC<PostProps> = ({ post }) => {
  const [showActions, setShowActions] = useState<boolean>(false);

  // Function to render text based on dialect type
  const renderDialectText = () => {
    if (!post.text) return '';

    switch (post.dialect_type) {
      case 'kansai':
        return (
          <p className="text-gray-100 whitespace-pre-line break-words">
            <span className="text-yellow-400 text-xs font-bold mr-1">[関西弁]</span>
            {post.text}
          </p>
        );
      case 'space':
        return (
          <p className="text-gray-100 whitespace-pre-line break-words">
            <span className="text-purple-400 text-xs font-bold mr-1">[宇宙語]</span>
            <span className="font-mono">{post.text}</span>
          </p>
        );
      case 'normal':
      default:
        return (
          <p className="text-gray-100 whitespace-pre-line break-words">
            {post.dialect_type === 'normal' && <span className="text-cyan-400 text-xs font-bold mr-1">[通常]</span>}
            {post.text}
          </p>
        );
    }
  };

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
            <span className="ml-2 text-xs text-gray-400">ID:{post.id}</span>
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
        {/* Space shimmer effect */}
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

        {renderDialectText()}

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

export default Post;