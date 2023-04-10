// react
import { useState, useEffect, FormEvent, useRef } from "react";

// toast
import toast from "react-hot-toast";

// framer motion
import { AnimatePresence, motion } from "framer-motion";

// variants
import { container } from "../constants/variants";

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
import { decryptString, encryptString } from "../until";

const Home = () => {
  const dummy = useRef<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { start, stop } = useTopLoader();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesCollectionRef = collection(firestore, "message");
  const { user, logout } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.length > 0) {
      try {
        setIsLoading(true);
        start();
        const payload = JSON.stringify({
          message: message.trim(),
          user: {
            avatar: user?.photoURL,
            email: user?.email,
            id: user?.uid,
            name: user?.displayName,
          },
        });
        const newDoc = await addDoc(messagesCollectionRef, {
          payload: encryptString(payload),
          timestamp: serverTimestamp(),
        });
        console.log(newDoc.id);
        setMessage("");
      } catch (error: any) {
        console.log(error);
        toast.error("Something is wrong nigga");
      } finally {
        stop();
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const messageQuery = query(
      messagesCollectionRef,
      orderBy("timestamp", "asc"),
      limit(30)
    );
    try {
      start();
      const unsubscribe = onSnapshot(messageQuery, (snap) => {
        setMessages(
          snap.docs?.map((doc: any) => ({
            id: doc.id,
            ...JSON.parse(decryptString(doc.data()?.payload)),
          }))
        );
      });
      return () => unsubscribe();
    } catch (error) {
      console.error(error);
      toast.error("Something is wrong nigga");
    } finally {
      stop();
    }
  }, []);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Page className="min-h-screen w-full flex items-center justify-center">
      <div className="bg-slate-100 w-full max-w-5xl h-screen flex flex-col justify-between">
        <div className="p-2 border-b">
          <div className="flex items-center gap-2 px-2">
            <div className="w-full font-bold text-lg">
              End to End Encrypted Chat
            </div>
            <button
              type="button"
              onClick={logout}
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Logout
            </button>
          </div>
        </div>
        <motion.div
          layout
          variants={container}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="p-3 flex flex-col gap-3 overflow-y-scroll"
          style={{
            height: "calc(100vh - 125px)",
          }}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <Message
                key={message.id}
                id={message.id}
                isSent={user?.uid === message.user.id}
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
