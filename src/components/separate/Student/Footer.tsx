import React, { VFC, useState, useContext, useCallback } from "react";
import Link from "next/link";
import router from "next/router";
import { db, auth } from "src/firebase";
import { deleteUser } from "firebase/auth";
import { AuthContext, noCurrentUser } from "src/firebase/Auth";
import toast from "react-hot-toast";
import { corporateURL, googleFormUrl } from "src/constants/externalLink";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "src/components/shared/Button";
import { sendMail } from "src/libs/sendMail";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export const Footer: VFC = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const logout = () => {
    if (confirm("ログアウトします。よろしいですか？")) {
      auth.signOut().then(() => {
        setCurrentUser(noCurrentUser);
        router.push("/signin");
        toast.success("ログアウトしました");
      });
    }
  };

  const deleteAccount = () => {
    if (confirm("退会し会員情報を削除します。よろしいですか？")) {
      // auth情報の削除
      auth.currentUser &&
        deleteUser(auth.currentUser)
          .then(async () => {
            const ref = doc(db, "users", currentUser.uid);
            await updateDoc(ref, { condition: "unsubscribed" });
            // 紐づいている予約情報の削除
            await deleteDoc(doc(db, "reservations", currentUser.uid));
            await deleteDoc(doc(db, "schedules", currentUser.uid));
            router.push("/thanks");
            sendMail({
              to_email: process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "",
              title: "ユーザーが退会しました",
              to_name: "ーー",
              message: `退会ユーザーID：${currentUser.uid}`,
            });
          })
          .catch((error) => {
            if (error.code === "auth/requires-recent-login") {
              alert(
                "もう一度ログインする必要があります。ログアウトして再度ログインしてからお試しください。"
              );
            } else {
              alert("退会処理に失敗しました。お問い合わせください。");
            }
          });
    }
  };

  const ConfirmModalBody: VFC = () => {
    const [email, setEmail] = useState("");

    const inputEmail = useCallback(
      (event) => {
        setEmail(event.target.value);
      },
      [setEmail]
    );

    return (
      <div className="pb-2">
        <p className="font-bold">⚠️ 以下の処理を行います</p>
        <ul>
          <li>・アカウントの削除</li>
          <li>・ログイン機能の停止</li>
        </ul>
        <p className="py-1">
          再入会を希望の際は再度新規登録を行う必要があります
        </p>
        <div className="border border-gray-300 my-2">
          <p className="text-xs px-2 pt-2">
            ご登録のメールアドレスを入力し、退会処理を続行してください。
          </p>
          <div className="m-2">
            <input
              type="text"
              id="email"
              value={email}
              className="bg-white text-xs rounded border border-gray-300 p-1 w-full h-8"
              onChange={inputEmail}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="solid-red"
            className="rounded mt-2 text-sm"
            disabled={email !== currentUser.email}
            onClick={deleteAccount}
          >
            退会処理を続行
          </Button>
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-theme-dark text-white flex justify-around sm:justify-end py-3 font-bold w-full absolute bottom-0">
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
                  退会処理
                </Dialog.Title>
                {<ConfirmModalBody />}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <ul className="text-sm">
        <li className="mb-1 sm:mx-3">
          <Link href={googleFormUrl}>
            <a>お問い合わせ</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3 cursor-pointer" onClick={logout}>
          ログアウト
        </li>
        <li className="mb-1 sm:mx-3 cursor-pointer" onClick={onOpen}>
          退会
        </li>
      </ul>
      <ul className="text-sm">
        <li className="mb-1 sm:mx-3">
          <Link href="/support/terms">
            <a>利用規約</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3">
          <Link href="/support/privacy-policy">
            <a>プライバシーポリシー</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3">
          <Link href={corporateURL}>
            <a>運営会社</a>
          </Link>
        </li>
      </ul>
    </footer>
  );
};
