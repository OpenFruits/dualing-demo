import React, { VFC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "src/firebase";
import { Header } from "src/layout/application/Header";
import { Button } from "src/components/shared/Button";
import { Layout } from "src/components/shared/Layout";
import { Loading } from "src/layout/application/Loading";
import { Chat } from "src/components/separate/Admin/Chat";
import { collection, getDocs, where, query } from "firebase/firestore";

type Chat = {
  id: string;
  companyId: string;
  studentId: string;
};

const Chatrooms: VFC = () => {
  const router = useRouter();
  const [chatrooms, setChatrooms] = useState<Chat[]>([]);

  const getChatList = async () => {
    const ref = collection(db, "relations");
    const q = query(ref, where("condition", "==", "matching"));
    const snapShot = await getDocs(q);
    const chatrooms = snapShot.docs.map((doc) => {
      const companyId = doc.get("companyId");
      const studentId = doc.get("studentId");
      return {
        id: doc.id,
        companyId: companyId,
        studentId: studentId,
      };
    });
    setChatrooms(chatrooms);
  };

  useEffect(() => {
    getChatList();
  }, []);

  if (chatrooms.length === 0) return <Loading />;

  return (
    <>
      <Header pageTitle="管理者用ページ" href="/administrator" />
      <div className="m-auto sm:w-2/3">
        <Layout>
          <Button
            className="shadow-md"
            onClick={() => router.push("/administrator")}
          >
            管理者ページTOPに戻る
          </Button>
          <div className="py-4">
            <p className="text-xl font-bold py-2">チャットルーム一覧</p>
            <div className="w-full bg-gray-100 flex space-x-2 py-2">
              <p className="w-2/5 pl-3">企業</p>
              <p className="w-1/5 pl-3">学生</p>
              <p className="w-2/5 pl-3">最新メッセージ</p>
            </div>
            {chatrooms.map((chat) => (
              <div key={chat.id}>
                <Chat chat={chat} />
              </div>
            ))}
          </div>
        </Layout>
      </div>
    </>
  );
};
export default Chatrooms;
