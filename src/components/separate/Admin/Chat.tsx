import { useState, useEffect, useCallback, useRef, VFC } from "react";
import { db } from "src/firebase";
import cc from "classcat";
import { FromTimeStampToDate } from "src/libs/util";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

type Chat = {
  id: string;
  companyId: string;
  studentId: string;
};

type Props = {
  chat: Chat;
};

type Message = {
  role: string;
  message: string;
  timestamp: any;
};

export const Chat: VFC<Props> = (props) => {
  const [companyName, setCompanyName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [relationId, setRelationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [latest, setLatest] = useState("");
  const [selected, setSelected] = useState(false);

  const getCompanyName = async () => {
    const ref = doc(db, "companies", props.chat.companyId);
    const snapShot = await getDoc(ref);
    snapShot.exists() && setCompanyName(snapShot.data().name);
  };

  const getStudentName = async () => {
    const ref = doc(db, "users", props.chat.studentId);
    const snapShot = await getDoc(ref);
    snapShot.exists() &&
      setStudentName(
        `${snapShot.data().firstName} ${snapShot.data().lastName}`
      );
  };

  const getRelation = async () => {
    const ref = collection(db, "relations");
    const q = query(
      ref,
      where("studentId", "==", props.chat.studentId),
      where("companyId", "==", props.chat.companyId),
      where("condition", "==", "matching")
    );
    const snapShot = await getDocs(q);
    setRelationId(snapShot.docs[0].id);
  };

  useEffect(() => {
    getCompanyName();
    getStudentName();
    getRelation();
  }, []);

  const getChatData = async () => {
    if (relationId !== "") {
      const ref = collection(db, "relations", relationId, "messages");
      const q = query(ref, orderBy("timestamp"));
      const snapShot = await getDocs(q);
      const _messages = snapShot.docs.map((doc) => {
        return {
          role: doc.get("role"),
          message: doc.get("message"),
          timestamp: doc.get("timestamp"),
        };
      });
      setMessages(_messages);
    }
  };

  useEffect(() => {
    getChatData();
  }, [relationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setLatest(FromTimeStampToDate(messages[messages.length - 1]?.timestamp));
    }
  }, [messages]);

  // 自動スクロール
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottomOfList = useCallback(() => {
    messageEndRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messageEndRef]);

  useEffect(() => {
    scrollToBottomOfList();
  }, [messages]);

  return (
    <div className="border my-1">
      <div
        onClick={() => setSelected(!selected)}
        className={
          selected
            ? `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer bg-gray-200`
            : `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer`
        }
      >
        <p className="w-2/5 pl-3 text-sm truncate">{companyName}</p>
        <p className="w-1/5 pl-3">{studentName}</p>
        <p className="w-2/5 pl-3 text-sm">{latest}</p>
      </div>
      {selected && (
        <div
          className="bg-gray-100 w-[calc(100%- 8px)] h-80 overflow-y-scroll m-2"
          id="chat"
        >
          {messages.length === 0 && (
            <p className="p-4 m-2 bg-white rounded">メッセージがありません</p>
          )}
          {messages.map((item) => (
            <div
              key={item.timestamp}
              className={cc([
                {
                  ["text-left"]: item.role === "company",
                  ["text-right"]: item.role === "student",
                },
              ])}
            >
              <div className="text-left inline-block m-2">
                <div>
                  <small className="text-gray-500">
                    {FromTimeStampToDate(item.timestamp)}
                  </small>
                  <p className="text-xs">
                    {item.role === "company" ? companyName : studentName}
                  </p>
                </div>
                <p
                  className={cc([
                    "text-sm bg-white inline-block p-2 border rounded-2xl whitespace-pre-wrap",
                    {
                      ["border-theme-dark"]: item.role === "company",
                      ["border-theme"]: item.role === "student",
                    },
                  ])}
                >
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div ref={messageEndRef} />
    </div>
  );
};
