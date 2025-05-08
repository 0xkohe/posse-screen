import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

// Message component to display individual forum posts
const ForumPost = ({ post }) => {
  return (
    <div className="mb-6 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="px-4 py-3 bg-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-sm font-medium">{post.username.charAt(0).toUpperCase()}</span>
          </div>
          <span className="ml-2 font-medium text-white">{post.username}</span>
        </div>
        <span className="text-xs text-gray-300">
          {new Date(post.timestamp).toLocaleString([], { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </span>
      </div>
      <div className="p-4">
        <p className="text-gray-100">{post.text}</p>
      </div>
      <div className="px-4 py-2 bg-gray-700 bg-opacity-50 flex gap-4">
        <button className="flex items-center text-gray-400 text-xs hover:text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905V9" />
          </svg>
          {post.likes || 0}
        </button>
        <button className="flex items-center text-gray-400 text-xs hover:text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Reply
        </button>
        <button className="flex items-center text-gray-400 text-xs hover:text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

// Main Forum Page Component
const ForumPage = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      username: "TechEnthusiast", 
      text: "Just discovered this amazing new forum! What topics are you all interested in discussing here?", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), 
      likes: 12 
    },
    { 
      id: 2, 
      username: "CodeNinja", 
      text: "I'm working on a React project with the new Router v7. Anyone else tried the new features yet?", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), 
      likes: 8 
    },
    { 
      id: 3, 
      username: "DesignGuru", 
      text: "Dark mode interfaces are becoming standard these days. What do you think about color schemes that work well in dark mode?", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), 
      likes: 15 
    },
    { 
      id: 4, 
      username: "WebDev2025", 
      text: "Just deployed my first full-stack application! The learning curve was steep but totally worth it.", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), 
      likes: 22 
    },
  ]);
  
  const [newPost, setNewPost] = useState('');
  const [username, setUsername] = useState('');
  const postsEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new posts are added
  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  useEffect(() => {
    // Focus the input field when component mounts
    inputRef.current?.focus();
  }, []);

  const handleCreatePost = () => {
    if (newPost.trim() === '' || username.trim() === '') return;
    
    // Add new post to the posts array
    const newPostObj = {
      id: posts.length + 1,
      username: username,
      text: newPost,
      timestamp: new Date(),
      likes: 0
    };
    
    setPosts([...posts, newPostObj]);
    setNewPost('');
    // Keep the username for convenience, let the user change it if they want
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'post-content') {
      e.preventDefault();
      handleCreatePost();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-lg font-medium">F</span>
            </div>
            <div className="ml-3">
              <h2 className="font-semibold">Forum #{forumId || '1'}</h2>
              <p className="text-xs text-gray-400">{posts.length} posts • 12 users online</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded hover:bg-gray-700 transition bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 rounded hover:bg-gray-700 transition bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button className="p-2 rounded hover:bg-gray-700 transition bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Forum Posts Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
        <div className="max-w-3xl mx-auto">
          {posts.map((post) => (
            <ForumPost key={post.id} post={post} />
          ))}
          <div ref={postsEndRef} />
        </div>
      </div>
      
      {/* New Post Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="max-w-3xl mx-auto bg-gray-700 rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="mb-3">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
              <input
                id="username"
                type="text"
                className="w-full bg-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Choose a name for this post"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="post-content" className="block text-sm font-medium text-gray-300 mb-1">Your Message</label>
              <textarea
                id="post-content"
                ref={inputRef}
                rows={3}
                className="w-full bg-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button type="button" className="p-2 rounded hover:bg-gray-600 transition text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button type="button" className="p-2 rounded hover:bg-gray-600 transition text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button type="button" className="p-2 rounded hover:bg-gray-600 transition text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <button 
                onClick={handleCreatePost}
                className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newPost.trim() || !username.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;