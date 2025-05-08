import React, { useState, useRef, useEffect } from 'react';
import type { Post as PostType } from './types';
import Post from './Post';
import Header from './Header';
import PostForm from './PostForm';
import Footer from './Footer';

const CosmicForumPage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([
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

  const postsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  const handleCreatePost = (newPostObj: PostType) => {
    setPosts([...posts, newPostObj]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white bg-[url('https://via.placeholder.com/100/000015/000015?text=')] bg-repeat">
      {/* Header */}
      <Header postCount={posts.length} activeUsers={42} />

      {/* Forum content area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-950 relative">
        {/* Space background effects */}
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
          {/* Current thread info */}
          <div className="mb-6 bg-indigo-900/30 rounded-lg p-4 border border-cyan-800/30">
            <h1 className="text-xl font-bold text-cyan-300 mb-2">【宇宙開発】人類の星間移住計画について語るスレ【第3銀河】</h1>
            <p className="text-gray-300 text-sm">
              ここは宇宙と2chが融合した新時代の掲示板。<br />
              地球の常識は捨てて、銀河の彼方から好きなことを書き込め。<br />
              <span className="text-cyan-400">※荒らしは虚空に消去されます</span>
            </p>
          </div>

          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
          <div ref={postsEndRef} />
        </div>
      </div>

      {/* Post form */}
      <PostForm onSubmit={handleCreatePost} postCount={posts.length} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CosmicForumPage;