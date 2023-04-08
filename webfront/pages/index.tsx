import React, {
  useState,
  useEffect,
  KeyboardEvent,
  useRef,
  RefObject,
} from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import {
  Container,
  Button,
  InputBase,
  Box,
  Avatar,
  Paper,
  Typography,
} from "@material-ui/core";
import { CachedTwoTone, Send } from "@material-ui/icons";
import {
  getFirestore,
  addDoc,
  setDoc,
  collection,
  onSnapshot,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import app from "../lib/firebase";
import { useRouter } from "next/router";

const db = getFirestore(app);

type ContainerProps = {};

type ChatType = {
  userName: string;
  message: string;
  datetime: string;
};

const Home = (props: ContainerProps) => {
  const CHAT_LIMIT = 50;

  const router = useRouter();
  const [roomname, setRoomname] = useState<string>("");
  const [chats, setChats] = useState<ChatType[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const chatListRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    const datetime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const chat: ChatType = { userName, message, datetime };
    setDoc(doc(db, "rooms", roomname, "chats", datetime), chat);
    setMessage("");
  };

  const enterPost = (keyEvent: KeyboardEvent) => {
    if (!message.trim()) return;
    if (keyEvent.key == "Enter" && (keyEvent.ctrlKey || keyEvent.metaKey)) {
      handleSubmit();
    }
  };

  let cnt = 0;
  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.roomname) {
      router.push("/?roomname=" + prompt("ルーム名を入力してください。") || "");
      return;
    }
    setRoomname(router.query.roomname as string);
    const q = query(
      collection(db, "rooms", router.query.roomname as string, "chats"),
      orderBy("datetime", "desc"),
      limit(CHAT_LIMIT)
    );
    onSnapshot(q, (querySnapshot) => {
      const chats: ChatType[] = [];
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          chats.unshift(change.doc.data() as ChatType);
        }
      });
      setChats((prevChats) => [...prevChats, ...chats]);
      if (chatListRef.current) {
        const isScrolled =
          Math.abs(
            chatListRef.current.scrollHeight -
              chatListRef.current.clientHeight -
              chatListRef.current.scrollTop
          ) < 100;
        if (cnt === 0 || isScrolled) {
          chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
      }
      cnt++;
    });
  }, [router]);

  return (
    <StyledComponent
      {...props}
      chats={chats}
      userName={userName}
      message={message}
      chatListRef={chatListRef}
      setUserName={setUserName}
      setMessage={setMessage}
      handleSubmit={handleSubmit}
      enterPost={enterPost}
    />
  );
};

type Props = ContainerProps & {
  className?: string;
  chats: ChatType[];
  userName: string;
  message: string;
  chatListRef: RefObject<HTMLDivElement>;
  setUserName: (value: string) => void;
  setMessage: (value: string) => void;
  handleSubmit: () => void;
  enterPost: (value: KeyboardEvent) => void;
};

const Component = (props: Props) => (
  <Container maxWidth="sm" className={props.className}>
    <Box height="100dvh" display="flex" flexDirection="column">
      <div className="scroll" ref={props.chatListRef}>
        {props.chats.map((chat, index) => (
          <Paper key={index} variant="outlined">
            <Box display="flex" p={1}>
              <Box pl={1.5}>
                <Box display="flex" alignItems="center">
                  <Typography className="name">
                    {chat.userName || ""}
                  </Typography>
                  <Typography variant="caption">
                    {dayjs(chat.datetime).format("MM/DD HH:mm")}
                  </Typography>
                </Box>
                <Box sx={{ whiteSpace: "pre-wrap" }}>
                  <Typography>{chat.message}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </div>
      <Box border={1} borderRadius={5} borderColor="grey.500" mb={1}>
        <Box px={2}>
          <InputBase
            placeholder="name"
            value={props.userName}
            onChange={(e) => props.setUserName(e.target.value)}
            fullWidth
          />
          <InputBase
            required
            placeholder="message"
            value={props.message}
            onChange={(e) => props.setMessage(e.target.value)}
            fullWidth
            multiline
            rows={3}
            onKeyDown={props.enterPost}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            disabled={!props.message.trim()}
            onClick={() => props.handleSubmit()}
          >
            <Send />
          </Button>
        </Box>
      </Box>
    </Box>
  </Container>
);

const StyledComponent = styled(Component)`
  .name {
    font-weight: 700;
    padding-right: 5px;
  }
  .scroll {
    overflow: scroll;
    padding: 10px 0;
    margin-top: auto;
  }
`;

export default Home;
