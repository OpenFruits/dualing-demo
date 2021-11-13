import { useContext, useEffect, useState, VFC } from "react";
import { BellIcon } from "@heroicons/react/outline";
import { MailIcon } from "@heroicons/react/outline";
import { MailOpenIcon } from "@heroicons/react/outline";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Drawer } from "src/components/shared/Drawer";
import { Button } from "src/components/shared/Button";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { Notice } from "src/constants/types";

const defalutNoticeState: Notice = {
  id: "",
  title: "",
  body: "",
  isRead: false,
};

export const Inform: VFC = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [notice, setNotice] = useState<Notice>(defalutNoticeState);
  const [numberOfUnread, setNumberOfUnread] = useState(0);
  const [drawerBody, setDrawerBody] = useState("index");

  // ログインユーザーのnoticeリストを取得しセット
  const getNoticeList = async () => {
    if (currentUser) {
      const ref = collection(db, "companies", currentUser.companyId, "notices");
      const q = query(ref, orderBy("created_at", "desc"));
      const snapShot = await getDocs(q);
      const _notices = snapShot.docs.map((s) => {
        return {
          id: s.id,
          title: s.get("title"),
          body: s.get("body"),
          isRead: s.get("isRead"),
        };
      });
      setNotices(_notices);
    }
  };

  // ログインユーザーの未読数を取得しセット
  const getNumberOfUnread = async () => {
    if (currentUser) {
      const ref = collection(db, "companies", currentUser.companyId, "notices");
      const q = query(ref, where("isRead", "==", false));
      const snapShot = await getDocs(q);
      setNumberOfUnread(snapShot.docs.length);
    }
  };

  // ドロワーの表示を切り替え（一覧or詳細）
  const getDrawerBody = async () => {
    if (drawerBody === "index") return;

    if (currentUser) {
      const ref = doc(
        db,
        "companies",
        currentUser.companyId,
        "notices",
        drawerBody
      );
      const docSnap = await getDoc(ref);
      setNotice({
        id: docSnap.id,
        title: String(docSnap.data()?.title),
        body: String(docSnap.data()?.body),
        isRead: docSnap.data()?.isRead,
      });
      if (!docSnap.data()?.isRead) {
        await updateDoc(ref, { isRead: true }).then(() => {
          getNoticeList();
          getNumberOfUnread();
        });
      }
    }
  };

  useEffect(() => {
    getNoticeList();
  }, [currentUser]);

  useEffect(() => {
    getNumberOfUnread();
  }, [currentUser, notices]);

  useEffect(() => {
    getDrawerBody();
  }, [drawerBody]);

  useEffect(() => {
    !isOpen && setDrawerBody("index");
  }, [isOpen]);

  return (
    <div>
      <Drawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={drawerBody === "index" ? "通知一覧" : "通知詳細"}
        fromLeft
      >
        <div>
          {drawerBody === "index" ? (
            <div>
              {notices.length === 0 ? (
                <p>通知がありません。</p>
              ) : (
                <ul className="border-b border-gray-300">
                  {notices.map((notice) => (
                    <li
                      key={notice.id}
                      onClick={() => setDrawerBody(notice.id)}
                      className="flex items-center p-2 border-t border-gray-300 hover:bg-gray-100 cursor-pointer"
                    >
                      {notice.isRead ? (
                        <MailOpenIcon className="h-5 w-5 mr-2" />
                      ) : (
                        <div className="relative">
                          <MailIcon className="h-5 w-5 mr-2" />
                          <div className="rounded-full bg-red-600 h-2 w-2 animate-ping absolute top-0 right-2" />
                        </div>
                      )}
                      <p className="truncate">{notice.title}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <div className="text-right">
                <Button className="my-3" onClick={() => setDrawerBody("index")}>
                  一覧に戻る
                </Button>
              </div>
              {notice?.id === drawerBody ? (
                <article
                  className="prose pt-10"
                  dangerouslySetInnerHTML={{
                    __html: `${notice?.body}`,
                  }}
                />
              ) : (
                <div />
              )}
            </div>
          )}
        </div>
      </Drawer>
      通知
      <div
        onClick={onOpen}
        className="flex justify-center items-center py-2 mb-4 border cursor-pointer hover:bg-gray-100"
      >
        {numberOfUnread ? (
          <div className="flex items-center">
            <ExclamationIcon className="h-4 w-4 m-1 text-red-500" />
            <span className="mr-2">{`${numberOfUnread}件の未読があります`}</span>
          </div>
        ) : (
          <span className="mr-2">通知一覧</span>
        )}
        <div className="relative">
          <BellIcon
            onClick={onOpen}
            className="h-8 w-8 text-theme-dark border rounded-full p-1 cursor-pointer hover:bg-gray-100"
          />
          {numberOfUnread > 0 && (
            <div className="rounded-full bg-red-600 h-2 w-2 animate-ping absolute top-0 right-0" />
          )}
        </div>
      </div>
    </div>
  );
};
