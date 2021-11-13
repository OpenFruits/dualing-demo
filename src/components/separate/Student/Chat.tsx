import {
  VFC,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import cc from "classcat";
import { AuthContext } from "src/firebase/Auth";
import { FirebaseTimestamp, db } from "src/firebase";
import { FromTimeStampToDate } from "src/libs/util";
import { sendMail } from "src/libs/sendMail";
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

type Props = {
  companyId: string;
  companyName: string;
};

type Message = {
  role: string;
  message: string;
  timestamp: any;
};

export const Chat: VFC<Props> = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [relationId, setRelationId] = useState("");
  const [comment, setComment] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [toEmail, setToEmail] = useState("");

  const getRelation = async () => {
    if (currentUser) {
      const ref = collection(db, "relations");
      const q = query(
        ref,
        where("studentId", "==", currentUser.uid),
        where("companyId", "==", props.companyId),
        where("condition", "==", "matching")
      );
      const snapShot = await getDocs(q);
      setRelationId(snapShot.docs[0].id);
    }
  };

  useEffect(() => {
    getRelation();
  }, [currentUser]);

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

  const inputComment = useCallback(
    (event) => {
      setComment(event.target.value);
    },
    [setComment]
  );

  const getCompanyEmail = async () => {
    const ref = doc(db, "companies", props.companyId);
    const snapShot = await getDoc(ref);
    snapShot.exists() && setToEmail(snapShot.data().email);
  };

  useEffect(() => {
    getCompanyEmail();
  }, []);

  const templateParams = {
    to_email: toEmail,
    title: "学生から新着メッセージがあります",
    to_name: `${props.companyName} 採用担当者`,
    message:
      "学生から新着メッセージが届いています。チャット画面よりご確認ください。",
  };

  const noticeBody = `
          <p>${currentUser?.firstName} ${currentUser?.lastName}さんがメッセージを送信しました。</p>
          <a class="text-blue-600" href="${process.env.NEXT_PUBLIC_ROOT_PATH}/company/${props.companyId}/${currentUser?.uid}">チャット画面へ</a>
        `;

  const submit = async () => {
    const messagesRef = collection(db, "relations", relationId, "messages");
    await setDoc(doc(messagesRef), {
      role: "student",
      message: comment,
      timestamp: FirebaseTimestamp,
    }).then(() => setComment(""));
    const noticesRef = collection(db, "companies", props.companyId, "notices");
    await setDoc(doc(noticesRef), {
      created_at: FirebaseTimestamp,
      title: "学生から新着メッセージがあります",
      body: noticeBody,
      isRead: false,
    }).then(() => sendMail(templateParams));
  };

  useEffect(() => {
    getChatData();
  }, [relationId, submit]);

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
    <div>
      <div className="bg-gray-100 h-[calc(100vh-470px)] rounded-t overflow-y-scroll">
        {messages.length === 0 && (
          <p className="p-4 text-sm">
            企業からの最初のメッセージをお待ちください
          </p>
        )}
        {messages.map((item, index) => (
          <div
            key={item.timestamp}
            className={cc([
              {
                ["text-right"]: item.role === "student",
                ["text-left"]: item.role === "company",
              },
            ])}
          >
            {index === messages.length - 1 && (
              <p className="text-red-500 text-center text-xs">
                - 最新のメッセージ -
              </p>
            )}
            <div className="text-left inline-block m-2">
              <div>
                <small className="text-gray-500">
                  {FromTimeStampToDate(item.timestamp)}
                </small>
                <p className="text-xs">
                  {item.role === "company"
                    ? props.companyName
                    : `${currentUser?.firstName} ${currentUser?.lastName}`}
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
        <div ref={messageEndRef} />
      </div>
      <div className="flex justify-center items-center rounded-b h-20 p-2 bg-gray-100 border-gray-400 border-t">
        <textarea
          name="comment"
          id="comment"
          value={comment}
          placeholder="メッセージを入力してください"
          className="resize-none h-14 w-5/6 border border-gray-300 p-1 rounded leading-none"
          onChange={inputComment}
        />
        <button
          onClick={submit}
          disabled={messages.length === 0 || !comment}
          className="bg-blue-500 text-white font-bold w-14 h-14 mx-3 rounded"
        >
          送信
        </button>
      </div>
    </div>
  );
};
