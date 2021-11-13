import React, { VFC, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { db, FirebaseTimestamp } from "src/firebase";
import { toast } from "react-hot-toast";
import { Header } from "src/layout/application/Header";
import { Button } from "src/components/shared/Button";
import { sendMail } from "src/libs/sendMail";
import { Layout } from "src/components/shared/Layout";
import { TextInput } from "src/components/shared/TextInput";
import { InputSection } from "src/components/shared/InputSection";
import {
  collection,
  getDocs,
  query,
  setDoc,
  doc,
  where,
} from "firebase/firestore";

const NewEvent: VFC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("【運営】就活イベント開催のお知らせ");
  const [body, setBody] = useState("");

  const inputTitle = useCallback(
    (event) => {
      setTitle(event.target.value);
    },
    [setTitle]
  );

  const inputBody = useCallback(
    (event) => {
      setBody(event.target.value);
    },
    [setBody]
  );

  const AddElementButton: VFC<{ tag: string }> = (props) => {
    const addElement = (tag: string) => {
      setBody(`${body}<${tag}></${tag}>`);
    };

    return (
      <button
        onClick={() => addElement(props.tag)}
        className="px-1 m-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        {`<${props.tag}>`}
      </button>
    );
  };

  const submitEvent = async () => {
    if (confirm("全学生に通知を送信します。")) {
      const ref = collection(db, "users");
      const q = query(ref, where("condition", "!=", "deleted"));
      const snapShot = await getDocs(q);
      snapShot.docs.map(async (s) => {
        const newNoticeRef = collection(db, "users", s.id, "Notice");
        await setDoc(doc(newNoticeRef), {
          created_at: FirebaseTimestamp,
          title: title,
          body: body,
          isRead: false,
        });
        const templateParams = {
          to_email: s.data().email,
          title: "マイページに新着メッセージが届いています",
          to_name: `${s.data().firstName} ${s.data().lastName}`,
          message:
            "運営から新着のメッセージが届いています。マイページより通知をご確認ください。",
        };
        sendMail(templateParams);
      });
      setTitle("【運営】就活イベント開催のお知らせ");
      setBody("");
      toast.success("学生全員に通知を送信しました");
    }
  };

  return (
    <>
      <Header pageTitle="管理者用ページ" href="/administrator" />
      <Layout>
        <Button
          className="shadow-md"
          onClick={() => router.push("/administrator")}
        >
          管理者ページTOPに戻る
        </Button>
        <p className="pt-4 font-bold text-2xl">新規イベント作成</p>
        <div className="flex">
          <div className="w-1/2 max-w-[400px] p-4">
            <h2 className="text-lg font-bold mb-2">＜ エディタ ＞</h2>
            <InputSection title="タイトル">
              <TextInput type="text" value={title} inputValue={inputTitle} />
            </InputSection>
            <InputSection title="内容：HTML形式">
              {["h1", "h2", "h3", "h4", "ul", "ol", "li", "p"].map(
                (tag, index) => (
                  <span key={tag}>
                    {index === 4 && <br />}
                    <AddElementButton tag={tag} />
                  </span>
                )
              )}
              <div className="py-1" />
              <textarea
                id="body"
                value={body}
                placeholder=""
                rows={20}
                className="resize-none bg-white rounded border border-gray-300 p-1 w-full"
                onChange={inputBody}
              />
            </InputSection>
          </div>
          <div className="w-1/2 max-w-[400px] p-4">
            <h2 className="text-lg font-bold mb-2">＜ プレビュー ＞</h2>
            <p className="text-xl">{title}</p>
            <article
              className="prose lg:prose-xl p-4"
              dangerouslySetInnerHTML={{
                __html: `${body}`,
              }}
            />
            <Button className="shadow-md my-4" onClick={submitEvent}>
              内容を確定して送信
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default NewEvent;
