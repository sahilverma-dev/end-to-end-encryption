// react
import { useState, useEffect, FormEvent, useRef } from "react";

// framer motion
import { AnimatePresence, motion } from "framer-motion";

// variants
import { container } from "../../constants/variants";

// icons
import { FiSend as SendIcon } from "react-icons/fi";

// components
import Message from "../components/Message";
import Page from "../components/Page";

// firebase
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../firebase/config";

// context
import { useAuth } from "../context/AuthContext";

// types
import { MessageType } from "../interfaces";
import { useTopLoader } from "../context/TopLoaderContext";

const Home = () => {
  const dummy = useRef<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { start, stop } = useTopLoader();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesCollectionRef = collection(firestore, "message");
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.length > 0) {
      try {
        setIsLoading(true);
        start();
        const newDoc = await addDoc(messagesCollectionRef, {
          message,
          user,
          timestamp: serverTimestamp(),
        });
        setIsLoading(false);
        stop();
        console.log(newDoc.id);
        setMessage("");
      } catch (error: any) {
        stop();
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const messageQuery = query(
      messagesCollectionRef,
      orderBy("timestamp", "asc"),
      limit(30)
    );
    start();
    onSnapshot(messageQuery, (snap) => {
      setMessages(
        snap.docs?.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      );
      stop();
    });
  }, []);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Page className="min-h-screen w-full flex items-center justify-center">
      <div className="bg-slate-100 w-full max-w-5xl h-screen flex flex-col justify-between">
        <motion.div
          layout
          variants={container}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-3 flex flex-col gap-3 overflow-y-scroll"
          style={{
            height: "calc(100vh - 60px)",
          }}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <Message
                key={message.id}
                id={message.id}
                isSent={user?.id === message.user.id}
                message={message.message}
                user={message.user}
              />
            ))}
            <span ref={dummy}></span>
          </AnimatePresence>
        </motion.div>
        <div className="p-2 border-t">
          <form action="" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <div className="border p-2 bg-white focus-within:outline outline-blue-500 rounded w-full">
                <input
                  autoFocus
                  type="search"
                  placeholder="Type your message"
                  className="outline-none w-full px-2 disabled:opacity-50"
                  value={message}
                  disabled={isLoading}
                  onChange={({ target }) => setMessage(target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={message.length === 0 || isLoading}
                className="bg-blue-600 h-10 flex items-center justify-center rounded text-white font-bold border aspect-square disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default Home;
