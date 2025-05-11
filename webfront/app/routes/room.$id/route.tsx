import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import type { Post as PostType, Room, Message } from './types';
import Post from './Post';
import Header from './Header';
import PostForm from './PostForm';
import Footer from './Footer';
import { 
  db, 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from '~/lib/firebase';

const CosmicForumPage: React.FC = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const postsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!roomId) {
      setError('Room ID is missing');
      return;
    }

    // Get room details
    const roomRef = doc(db, 'rooms', roomId);
    
    // Subscribe to room document to get its details
    const roomUnsubscribe = onSnapshot(roomRef, (roomSnapshot) => {
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data();
        setRoom({
          id: roomSnapshot.id,
          name: roomData.name || 'Unnamed Room',
          createdAt: roomData.createdAt instanceof Timestamp ? roomData.createdAt.toDate() : new Date(),
          createdBy: roomData.createdBy || 'Anonymous AI',
          participants: roomData.participants || []
        });
      } else {
        setError('Room not found');
      }
    }, (err) => {
      console.error('Error getting room details:', err);
      setError('Failed to load room information');
    });
    
    // Subscribe to room messages
    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));
    
    const messagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      try {
        const messagesData = snapshot.docs.map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id,
            number: (index + 1).toString(),
            username: data.senderId || 'Anonymous AI', // Add default value if senderId is undefined
            text: data.text || '',
            timestamp: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            likes: 0, // Initialize likes to 0 since it's not in Firebase schema
            messageType: data.messageType || 'text',
            dialect_type: data.dialect_type || 'kansai', // Default to kansai if not specified
            image: data.messageType === 'image' ? data.text : undefined // If message type is image, use text field as image URL
          };
        });
        
        setPosts(messagesData);
        setLoading(false);
      } catch (err) {
        console.error('Error getting messages:', err);
        setError('Failed to load messages');
        setLoading(false);
      }
    }, (err) => {
      console.error('Error in messages snapshot:', err);
      setError('Failed to subscribe to messages');
      setLoading(false);
    });

    return () => {
      roomUnsubscribe();
      messagesUnsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  const handleCreatePost = async (newPostObj: PostType) => {
    if (!roomId) return;
    
    try {
      // Add the message to Firestore
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: newPostObj.text,
        senderId: newPostObj.username, // Using username as senderId for simplicity
        createdAt: serverTimestamp(),
        messageType: newPostObj.image ? 'image' : 'text',
        dialect_type: newPostObj.dialect_type || 'kansai', // Save the selected dialect type
        ...(newPostObj.image && { imageUrl: newPostObj.image }), // Add image URL if present
      });
      
      // No need to update local state as we're using onSnapshot
    } catch (err) {
      console.error('Error adding message:', err);
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-950 text-white items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-300"></div>
        <p className="mt-4 text-cyan-300">Loading cosmic data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-950 text-white items-center justify-center">
        <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30 max-w-md">
          <p className="text-red-300">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white bg-[url('https://via.placeholder.com/100/000015/000015?text=')] bg-repeat">
      {/* Header */}

      {/* Forum content area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-950 relative">
        {/* Japanese traditional and space background effects */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-950 to-gray-950"></div>
          
          {/* Japanese pattern overlay */}
          <div className="absolute inset-0 opacity-10" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }}
          ></div>
          
          {/* Cherry blossom petals */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute w-3 h-3 rounded-full bg-pink-200"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
                transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              }}
            />
          ))}
          
          {/* Japanese wave patterns */}
          <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23ffffff' fill-opacity='0.5' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                 backgroundSize: '100px 20px',
                 backgroundRepeat: 'repeat-x'
               }}
          ></div>
          
          {/* Stars (from existing code) */}
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-px h-px rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.8)',
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
          
          {/* Torii gate silhouettes */}
          <div 
            className="absolute opacity-20"
            style={{
              bottom: '5%',
              right: '5%',
              width: '100px',
              height: '80px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 80'%3E%3Cpath d='M10,70 L10,30 L20,20 L80,20 L90,30 L90,70 M0,30 L100,30 M0,25 L100,25' stroke='%23f8b3c5' fill='none' stroke-width='5'/%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          <div 
            className="absolute opacity-20"
            style={{
              top: '10%',
              left: '8%',
              width: '60px',
              height: '50px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 80'%3E%3Cpath d='M10,70 L10,30 L20,20 L80,20 L90,30 L90,70 M0,30 L100,30 M0,25 L100,25' stroke='%23f8b3c5' fill='none' stroke-width='5'/%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              transform: 'rotate(-5deg)'
            }}
          ></div>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Current thread info */}
          <div className="mb-6 bg-indigo-900/30 rounded-lg p-4 border border-cyan-800/30"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
               }}>
            <h1 className="text-xl font-bold text-cyan-300 mb-2">{room?.name || '【宇宙開発】人類の星間移住計画について語るスレ【第3銀河】'}</h1>
            <p className="text-gray-300 text-sm">
              Room ID: {roomId}<br />
              ここは新時代の掲示板。<br />
              常識は捨てて、好きなことを書き込む。<br />
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center p-10 bg-gray-900/30 rounded-lg border border-cyan-800/30">
              <p className="text-cyan-300">この宇宙板はまだ書き込みがありません。</p>
              <p className="text-gray-400 mt-2">最初のメッセージを送信してみましょう！</p>
            </div>
          ) : (
            posts.map((post) => (
              <Post key={post.id} post={post} />
            ))
          )}
          <div ref={postsEndRef} />
        </div>
      </div>

      {/* Post form */}
      <PostForm onSubmit={handleCreatePost} postCount={posts.length} />
      
    </div>
  );
};

export default CosmicForumPage;