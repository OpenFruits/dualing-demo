import React, { useState, useEffect, useContext } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Header } from "src/layout/application/Header";
import { Button } from "src/components/shared/Button";
import { Chat } from "src/components/separate/Company/Chat";
import { auth, db, FirebaseTimestamp } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import Vimeo from "@u-wave/react-vimeo";
import { BookmarkIcon } from "@heroicons/react/solid";
import { sendMail } from "src/libs/sendMail";
import toast from "react-hot-toast";
import { Loading } from "src/layout/application/Loading";
import { NotFound } from "src/layout/application/NotFound";
import type { Student } from "src/constants/types";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";

const StudentId: NextPage = () => {
  const router = useRouter();
  const studentId = router.query.studentId;
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const [student, setStudent] = useState<Student>();
  const [relation, setRelation] = useState<string | undefined>(undefined);
  const [relationId, setRelationId] = useState<string | undefined>(undefined);
  const [isBookmark, setIsBookmark] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [notFound, setNotFound] = useState(false);

  const getUserData = async () => {
    if (typeof studentId === "string") {
      const snapShot = await getDoc(doc(db, "users", studentId));
      if (!snapShot.exists()) return setNotFound(true);
      setStudent({
        uid: studentId,
        firstName: snapShot.data().firstName,
        lastName: snapShot.data().lastName,
        firstKana: snapShot.data().firstKana,
        lastKana: snapShot.data().lastKana,
        university: snapShot.data().university,
        department: snapShot.data().department,
        club: snapShot.data().club,
        important: snapShot.data().important,
        industries: snapShot.data().industries,
        occupations: snapShot.data().occupations,
        locations: snapShot.data().locations,
        advantages: snapShot.data().advantages,
        comment: snapShot.data().comment,
        vimeoUrl: snapShot.data().vimeoUrl,
        thumbnailUrl: snapShot.data().thumbnailUrl,
      });
      setToEmail(snapShot.data().email);
    }
  };

  useEffect(() => {
    getUserData();
  }, [studentId]);

  const getRelationData = async () => {
    if (currentUser && student) {
      const ref = collection(db, "relations");
      const q = query(
        ref,
        where("companyId", "==", currentUser.companyId),
        where("studentId", "==", student.uid)
      );
      const snapShot = await getDocs(q);
      if (snapShot.docs.length === 1) {
        setRelation(snapShot.docs[0].data().condition);
        setRelationId(snapShot.docs[0].id);
      } else {
        setRelation("no");
      }
    }
  };

  const checkBookmark = async () => {
    if (currentUser) {
      const ref = doc(
        db,
        "companies",
        currentUser?.companyId,
        "bookmarks",
        studentId as string
      );
      const bookmarkSnap = await getDoc(ref);
      if (bookmarkSnap.exists()) {
        setIsBookmark(true);
      }
    }
  };

  useEffect(() => {
    getRelationData();
    checkBookmark();
  }, [currentUser, student]);

  const noticeBody = `
    <p>${currentUser?.name}からスカウトが届いています。</p>
    <p>スカウト一覧から詳細を確認し、</p>
    <p>「マッチング」または「見送る」を選択してください。</p>
  `;

  const templateParams = {
    to_email: toEmail,
    title: "マイページに新着メッセージが届いています",
    to_name: `${student?.firstName} ${student?.lastName}`,
    message: "企業からスカウトされました。マイページより詳細をご確認ください。",
  };

  const scout = async () => {
    onClose();
    if (currentUser && student) {
      const relaitonsRef = collection(db, "relations");
      const noticesRef = collection(db, "users", student.uid, "notices");
      await setDoc(doc(relaitonsRef), {
        studentId: student.uid,
        companyId: currentUser.companyId,
        condition: "scout",
      });
      await setDoc(doc(noticesRef), {
        created_at: FirebaseTimestamp,
        title: "企業からスカウトされました",
        body: noticeBody,
        isRead: false,
      }).then(() => {
        toast.success("スカウトを送信しました");
        sendMail(templateParams);
      });
    }
  };

  const deleteScout = async () => {
    onClose();
    setRelation("no");
    const ref = doc(db, "relations", relationId as string);
    await deleteDoc(ref).then(() => {
      toast.success("スカウトを取り消しました");
      setRelationId(undefined);
    });
  };

  const bookmark = async () => {
    if (currentUser && student) {
      const ref = doc(
        db,
        "companies",
        currentUser?.companyId,
        "bookmarks",
        studentId as string
      );
      isBookmark
        ? deleteDoc(ref)
        : setDoc(ref, {
            studentId: student.uid,
            created_at: FirebaseTimestamp,
          });
    }
    setIsBookmark(!isBookmark);
    if (!isBookmark) toast.success("保存しました");
    if (isBookmark) toast.success("保存済みから削除しました");
  };

  useEffect(() => {
    relation === "block" && setNotFound(true);
  }, [relation]);

  onAuthStateChanged(auth, (user) => {
    if (!user) router.push("/company/signin");
  });

  if (!currentUser || !relation) return <Loading />;

  if (currentUser.companyId !== router.query.companyId || notFound) {
    return <NotFound />;
  }

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-sm px-6 my-20 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold py-4 leading-6 text-gray-900"
                >
                  {relation === "scout"
                    ? `${student?.firstName}${student?.lastName}さんへのスカウトは送信済みです。`
                    : `${student?.firstName}${student?.lastName}さんにスカウトを送信します。`}
                </Dialog.Title>
                {relation === "scout" ? (
                  <div>
                    学生がスカウトを「承認」した場合、チャットが可能となり、
                    「見送り」した場合その学生が一覧に表示されなくなります。
                    <div className="py-2" />
                    スカウトを取り消したい場合は、以下のボタンで取消を行います。
                    <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                      <Button
                        variant="solid-blue"
                        className="rounded-lg"
                        onClick={deleteScout}
                      >
                        スカウト取消
                      </Button>
                      <Button
                        variant="solid-gray"
                        className="rounded-lg"
                        onClick={onClose}
                      >
                        閉じる
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    学生がスカウトを「承認」した場合、チャットが可能となり、
                    「見送り」した場合その学生が一覧に表示されなくなります。
                    <div className="py-2" />
                    以下のボタンからスカウトを送信してください。
                    <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                      <Button
                        variant="solid-blue"
                        className="rounded-lg"
                        onClick={scout}
                      >
                        スカウト送信
                      </Button>
                      <Button
                        variant="solid-gray"
                        className="rounded-lg"
                        onClick={onClose}
                      >
                        キャンセル
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Header
        href={`/company/${currentUser?.companyId}`}
        pageTitle="学生詳細ページ"
      />
      <div className="flex">
        <aside className="fixed left-0 top-14 p-4 border-r h-screen w-72">
          {currentUser ? (
            <h2 className="text-2xl border-b pb-2 mb-4">{`${currentUser?.name} 様`}</h2>
          ) : (
            <h2 className="text-2xl border-b pb-2 mb-4 text-white">{` - `}</h2>
          )}
          <Link href={`/company/${currentUser?.companyId}`}>
            <a>
              <button className="m-auto lg:mx-0 text-sm lg:text-md font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer">
                一覧に戻る
              </button>
            </a>
          </Link>
        </aside>
        <main className="bg-theme-light w-screen ml-72">
          <div className="py-10 px-14 divide-y divide-gray-500">
            <h1 className="text-3xl font-bold mb-4">学生詳細</h1>
            <div className="py-10 xl:w-[800px] w-[600px]">
              <div className="flex justify-between items-center">
                <div>
                  {student ? (
                    <div>
                      <p className="text-sm">{`${student.firstKana} ${student.lastKana}`}</p>
                      <h2 className="text-2xl font-bold mb-2">
                        {`${student.firstName} ${student.lastName}`}
                      </h2>
                      <h2 className="text-2xl font-bold mb-4">
                        {`(${student.university} ${student.department})`}
                      </h2>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-theme-light">{` - `}</p>
                      <h2 className="text-2xl font-bold mb-4 text-theme-light">
                        {` - `}
                      </h2>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  {relation === "scout" && (
                    <button
                      onClick={onOpen}
                      className="w-44 h-10 ml-2 my-1 text-sm lg:text-md font-bold rounded tracking-wider text-center bg-gray-500 p-2 text-white hover:bg-gray-300 focus:outline-none cursor-pointer"
                    >
                      スカウト済み
                    </button>
                  )}
                  {relation === "no" && (
                    <button
                      onClick={onOpen}
                      className="w-44 h-10 ml-2 my-1 text-sm lg:text-md font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer"
                    >
                      スカウトを送る
                    </button>
                  )}
                  <button
                    onClick={bookmark}
                    className="flex justify-center h-10 items-center w-44 ml-2 my-1 text-sm lg:text-md font-bold rounded tracking-wider bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer"
                  >
                    <BookmarkIcon className="h-6 w-6 m-1" />
                    {isBookmark ? (
                      <p className="py-2 mr-4">保存済み</p>
                    ) : (
                      <p className="py-2 mr-2">保存して後で見る</p>
                    )}
                  </button>
                </div>
              </div>
              {relation === "matching" && (
                <Chat
                  studentId={studentId as string}
                  studentName={`${student?.firstName} ${student?.lastName}`}
                />
              )}
              {student && (
                <Vimeo video={student.vimeoUrl} responsive className="my-4" />
              )}
              <table className="xl:text-lg text-sm my-4 xl:w-[800px] w-[600px] bg-white border border-gray-300">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="w-1/4 bg-gray-100 p-3">強み、長所</td>
                    <td className="p-3">{student?.advantages.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="bg-gray-100 p-3">企業選びの軸</td>
                    <td className="p-3">{student?.important.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="bg-gray-100 p-3">部活、サークル</td>
                    <td className="p-3">{student?.club}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="bg-gray-100 p-3">興味のある業界</td>
                    <td className="p-3">{student?.industries.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="bg-gray-100 p-3">興味のある職種</td>
                    <td className="p-3">{student?.occupations.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="bg-gray-100 p-3">希望勤務地</td>
                    <td className="p-3">{student?.locations?.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="bg-gray-100 p-3">ひとことPR</td>
                    <td className="p-3 whitespace-pre-wrap">
                      {student?.comment}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Link href={`/company/${currentUser?.companyId}`}>
                <a>
                  <button className="m-auto lg:mx-0 text-sm lg:text-md font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer">
                    一覧に戻る
                  </button>
                </a>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StudentId;
