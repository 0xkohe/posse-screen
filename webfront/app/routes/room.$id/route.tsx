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