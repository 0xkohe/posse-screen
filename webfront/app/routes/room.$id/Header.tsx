import React from 'react';

interface HeaderProps {
  postCount: number;
  activeUsers?: number;
}

const Header: React.FC<HeaderProps> = ({ postCount, activeUsers = 42 }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 border-b border-cyan-700 shadow-lg relative overflow-hidden">
      {/* Space stars effect */}
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
                <span className="text-cyan-400 font-mono">{postCount}</span> レス •{' '}
                <span className="text-cyan-400 font-mono ml-1">{activeUsers}</span> 人の宇宙人が観測中
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
  );
};

export default Header;