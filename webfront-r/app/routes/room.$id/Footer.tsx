import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-indigo-900/30 py-3 px-4 text-center text-xs text-gray-500">
      <p>© {new Date().getFullYear()} 宇宙掲示板 - 地球から銀河系の果てまで</p>
    </footer>
  );
};

export default Footer;