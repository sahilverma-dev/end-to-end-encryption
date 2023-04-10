import { useState, FormEvent } from "react";

import { item } from "../constants/variants";
import { UserType } from "../interfaces";

import { motion } from "framer-motion";

// icons
import { AiFillEdit as EditIcon } from "react-icons/ai";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { FiSend as SendIcon } from "react-icons/fi";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/config";

// prop type
interface Props {
  id: string;
  isSent: boolean;
  user: UserType;
  message: string;
}

const Message = ({ id, isSent, message, user }: Props) => {
  const oldMessage = message;
  const [editMessageInput, setEditMessageInput] = useState<string>(message);
  const [deleteMessage, setDeleteMessage] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<boolean>(false);

  const updateMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(editMessageInput);
    const messageDocRef = doc(firestore, `message/${id}`);
    if (editMessageInput.length > 0 && editMessageInput !== oldMessage) {
      await setDoc(
        messageDocRef,
        {
          message: editMessageInput,
        },
        {
          merge: true,
        }
      );
    }
    setEditMessage(false);
  };

  const deleteMessageFun = async (id: string) => {
    const messageDocRef = doc(firestore, `message/${id}`);
    await deleteDoc(messageDocRef);
  };

  return (
    <motion.div
      layout
      variants={item}
      className={`w-full group flex ${
        isSent ? "justify-end" : "justify-start"
      }`}
    >
      <form
        onSubmit={updateMessage}
        className={`flex gap-2 justify-between ${
          isSent ? " flex-row-reverse bg-blue-700" : "flex-row bg-blue-500"
        }  w-[70%] text-white p-3 rounded-lg`}
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="h-10 aspect-square rounded-full object-cover border border-blue-800 shadow"
        />
        {deleteMessage ? (
          <div className="flex items-center gap-2 p-4 w-full border rounded-md">
            <h2 className="w-full text-sm font-bold">
              Do you really want to delete?
            </h2>
            <button
              type="button"
              onClick={() => deleteMessageFun(id)}
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setDeleteMessage(false)}
              className="py-2 px-5 text-sm font-medium text-white focus:outline-none bg-slate-700 rounded-lg border border-slate-500 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            {editMessage ? (
              <div className="flex flex-col w-full border rounded-md">
                <input
                  type="text"
                  value={editMessageInput}
                  onChange={(e) => setEditMessageInput(e.target.value)}
                  className="h-full w-full outline-none bg-transparent px-3"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <p
                  className={`font-bold w-full ${
                    isSent ? "text-right" : "text-left"
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={` text-gray-100 ${
                    isSent ? "text-right" : "text-left"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}
          </>
        )}

        {isSent && (
          <div className="flex flex-col justify-between h-full gap-2">
            <button
              type="button"
              className=" p-2 aspect-square bg-black rounded-md text-xs disabled:bg-black/50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
              onClick={() => setEditMessage(!editMessage)}
              disabled={deleteMessage}
            >
              {editMessage ? <CloseIcon /> : <EditIcon />}
            </button>

            {editMessage ? (
              <button
                type="submit"
                disabled={editMessageInput === oldMessage}
                title={
                  editMessageInput === oldMessage
                    ? "Message should be different."
                    : message
                }
                className=" p-2 aspect-square bg-black rounded-md text-xs disabled:bg-black/50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
              >
                <SendIcon />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteMessage(!deleteMessage)}
                className=" p-2 aspect-square bg-red-600  rounded-md text-xs disabled:bg-black/50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
              >
                {deleteMessage ? <CloseIcon /> : <DeleteIcon />}
              </button>
            )}
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default Message;
