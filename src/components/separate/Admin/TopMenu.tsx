import React, { useState, VFC } from "react";
import { useRouter } from "next/router";
import { Layout } from "src/components/shared/Layout";
import { Button } from "src/components/shared/Button";
import { CompanySignup } from "src/components/separate/Admin/CompanySignup";
import { Dialog, Transition } from "@headlessui/react";

export const TopMenu: VFC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const testFunction = () => {};

  return (
    <Layout>
      <div className="flex my-4 space-x-3 sm:space-x-4">
        <Button
          variant="ghost"
          className="shadow-md"
          onClick={() => router.push("/administrator/students")}
        >
          学生一覧
        </Button>
        <Button
          variant="ghost"
          className="shadow-md"
          onClick={() => router.push("/administrator/companies")}
        >
          企業一覧
        </Button>
        <Button
          variant="ghost"
          className="shadow-md"
          onClick={() => router.push("/administrator/chatrooms")}
        >
          チャットルーム一覧
        </Button>
      </div>
      <div className="flex my-4 space-x-3 sm:space-x-4">
        <Button
          className="shadow-md"
          onClick={() => router.push("/administrator/newevent")}
        >
          イベント作成
        </Button>
        <Button className="shadow-md" onClick={onOpen}>
          企業アカウント登録
        </Button>
        <Button
          variant="solid-blue"
          className="shadow-md"
          disabled
          onClick={testFunction}
        >
          機能テスト実行
        </Button>
      </div>
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
                  企業アカウント登録
                </Dialog.Title>
                <CompanySignup onClose={onClose} />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Layout>
  );
};
