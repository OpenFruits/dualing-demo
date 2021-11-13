import React, { VFC, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "src/components/shared/Button";
import { AuthContext } from "src/firebase/Auth";
import { Layout } from "src/components/shared/Layout";
import { Dialog, Transition } from "@headlessui/react";

export const Profile: VFC = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const profileItems: { head: string; data: string }[] = [
    {
      head: "大学・学部",
      data: `${currentUser?.university} ${currentUser?.department}`,
    },
    { head: "部活", data: currentUser?.club },
    { head: "企業選びの軸", data: currentUser?.important.join(", ") },
    { head: "興味のある業界", data: currentUser?.industries.join(", ") },
    { head: "興味のある職種", data: currentUser?.occupations.join(", ") },
    { head: "希望勤務地", data: currentUser?.locations?.join(", ") },
    { head: "強み、長所", data: currentUser?.advantages.join(", ") },
    { head: "ひとことアピール", data: currentUser?.comment },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center">
        {currentUser && (
          <div>
            <p className="text-sm">{`${currentUser?.firstKana} ${currentUser?.lastKana}`}</p>
            <h2 className="text-3xl font-bold pb-2">{`${currentUser?.firstName} ${currentUser?.lastName}`}</h2>
            <p>{`${currentUser?.university} ${currentUser?.department}`}</p>
          </div>
        )}
        <div className="m-2 space-y-2">
          <div>
            <button
              onClick={onOpen}
              className="w-40 m-auto lg:mx-0 text-base font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer"
            >
              プレビュー表示
            </button>
          </div>
          <div>
            <Link href={`/${currentUser?.uid}/edit`}>
              <a>
                <button className="w-40 m-auto lg:mx-0 text-base font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer">
                  プロフィール編集
                </button>
              </a>
            </Link>
          </div>
        </div>
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
                  プロフィール
                </Dialog.Title>
                <div>
                  <div className="space-y-2 text-sm">
                    {profileItems.map((item) => (
                      <div key={item.head} className="border border-gray-300">
                        <p className="bg-gray-100 px-2 py-1">{item.head}</p>
                        <p className="px-2 py-1 whitespace-pre-wrap">
                          {item.data}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                    <Button
                      variant="solid-blue"
                      className="rounded-lg"
                      onClick={() => router.push(`/${currentUser?.uid}/edit`)}
                    >
                      編集する
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
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Layout>
  );
};
