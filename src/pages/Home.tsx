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
// import { encryptMessage, generateKeyPair } from "../until";

const Home = () => {
  const dummy = useRef<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { start, stop } = useTopLoader();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesCollectionRef = collection(firestore, "message");
  const { user, logout } = useAuth();

  const keys = {
    privateKey: {
      alg: "RSA-OAEP-256",
      d: "A9lU5w_DXpBrYrldvKmZeikS_xtkV-8LRs8jDJ98svpQR0me-x5JtMCggVCOeD4FYGUq7fGZgn-t8SY2Hnk8gcIVDBCfoXSgX6WXTgMu0p1VBV6R8sj_TJgTwEFo_PsWk05P-HK9aCPKyVHSHgWA2Q9-YsoSYTZn46OeabziApouFHej9e-4lMFe_e3mApl7sgoumwsvCyEyKqMOX9MEue3AZyyw_rbv7XG6Y1CzV3hihOcW9VEK8NFWBr2oqH7IttjVTQv-VWiSpBh14HYkyclSVrKorfP1EDTw8c1I5ldbl0211B-x1cbvXf6pEE66639qsVkzVkWhPOsPOv7VQQ",
      dp: "nONAReTa192qqw6NGJSIezOEjpVEMCUc1VKeVaVWXKFf6SCTd2e3t7x9Vb6eSfLtR46lx5pg4rt2nkEkqDlwgdGizIG-Mg5E0heUKcjhWxX0UzgbRpKOe4_7G-5eTjSxYCrzn0eQxTLFjlHphtLr1I-sQ4AEXYgSSNCeL2rr0z0",
      dq: "kYJBq5usGbvj-6uQy_yCy_U1aDk-IJKDBnsgNMOZ6jBHSdQfkGm8LtSDa_9aLPZ5k84_7n5rKrINGdbKLFD3MthsX41NKsdhcqfNluwOSs-mZQcyMQ3rrlsj8C2VL7m32sl5xpyv2stXSnW-IwF2UIj6jv_Sy4CaAIO_mnqqIkE",
      e: "AQAB",
      ext: true,
      key_ops: ["decrypt"],
      kty: "RSA",
      n: "lIb4xhEl_AyNw4R3SWiundp9ikiSaezjY2W5uIgQDE_g42UvMPq_fba7GtceN6UzD88PSpf1w8jL64Xk3sqJOBzC36SB8kWDiILhvibQlo7xe_59hCMVfl-eX4ppkvqoR-JYv1dBGY37ccv2IM2ibXxfz252-Twb17rFENOYasF2vIm5JfwjicGpAf7FgJq6fOk0C3aE76_NgqeCYhfgfqF_K1t-MaZ2gnGPv1nnJTvrCg8ax6aybXoWqbdKreEfoNzOLAK0BodbJEJkTtRukxoFsz-CGX5TXbqvrWMRRg1Sgwy-RAa4R2yCzy4fRZ-iF0wSnPa4E2la8oCqmJC4dQ",
      p: "ybzFFSWZjCAO_eleJiv-2nv5FDnlt6rWW5Beyu6OP0bR6vToUS904lniaBA2xafTKxxe7FiqezuIXTkZcpjUQyLgdlI3uPqnsegXrK-ijfj-w-dXGtOEkaKUBe80apmghREzxZHt6Vg4Yc1rRuE6baWAlgYtbKlj0t5_XqveTCU",
      q: "vHpCFsaADsY08T5g0ecZpRZpRN2bI6TIKpKvEI3oTzm_psOs4dShoSorMSyJR_O6WYkONhwuRXxduaEZvTpduYbYzCL0ujg0REq5BChC0pgUgVqa3kM3dKFGJOH4-9hzi6yjsQVGSVyFmumjolVAl4tRqcuCfv7AuBSQLAKx4hE",
      qi: "ucRh6gase391-LcYi6ErCor3npSxZVSUAWZstI8ywwXg_aPjxtuZcXkBbr46HzvI-oD5CIFvx7wtkLhHwUWO2MN4QsVcuj3lJsmzZBvxdSndgW5MZ1NvtVUqbTvznVCwdmsj5TcShIuFYxfskMXN8JU78MMEngbzV1NKOpDhtLA",
    },
    publicKey: {
      alg: "RSA-OAEP-256",
      e: "AQAB",
      ext: true,
      key_ops: ["encrypt"],
      kty: "RSA",
      n: "lIb4xhEl_AyNw4R3SWiundp9ikiSaezjY2W5uIgQDE_g42UvMPq_fba7GtceN6UzD88PSpf1w8jL64Xk3sqJOBzC36SB8kWDiILhvibQlo7xe_59hCMVfl-eX4ppkvqoR-JYv1dBGY37ccv2IM2ibXxfz252-Twb17rFENOYasF2vIm5JfwjicGpAf7FgJq6fOk0C3aE76_NgqeCYhfgfqF_K1t-MaZ2gnGPv1nnJTvrCg8ax6aybXoWqbdKreEfoNzOLAK0BodbJEJkTtRukxoFsz-CGX5TXbqvrWMRRg1Sgwy-RAa4R2yCzy4fRZ-iF0wSnPa4E2la8oCqmJC4dQ",
    },
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.length > 0) {
      // try {
      //   const data = await generateKeyPair();
      //   const encrypted = await encryptMessage(data.publicKey, message);
      //   console.clear();
      //   // console.log(data);
      //   console.log(encrypted);
      // } catch (error) {
      //   console.log(error);
      // }
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
