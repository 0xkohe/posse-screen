import React, { useState, useEffect, KeyboardEvent } from "react";
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
  const [newChat, setNewChat] = useState<ChatType>({
    userName: "",
    message: "",
    datetime: "",
  });
  const [chats, setChats] = useState<ChatType[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (newChat.message) {
      setChats([...chats, newChat]);
    }
  }, [newChat]);

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
        const data = change.doc.data();
        if (change.type === "added") {
          chats.unshift(change.doc.data() as ChatType);
        }
        console.log("newChat displayed!");
      });
    });
  }, [router]);

  return (
    <StyledComponent
      {...props}
      chats={chats}
      userName={userName}
      message={message}
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
  setUserName: (value: string) => void;
  setMessage: (value: string) => void;
  handleSubmit: () => void;
  enterPost: (value: KeyboardEvent) => void;
};

const Component = (props: Props) => (
  <Container maxWidth="sm" className={props.className}>
    <Box height="100dvh" display="flex" flexDirection="column">
      <Box flexGrow={1} py={1} overflow={"scroll"}>
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
                <Typography>{chat.message}</Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
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
`;

export default Home;
