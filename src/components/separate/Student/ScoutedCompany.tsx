import React, { useState, useEffect, VFC, useContext } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { db, FirebaseTimestamp } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { toast } from "react-hot-toast";
import { sendMail } from "src/libs/sendMail";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { Button } from "src/components/shared/Button";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { Company } from "src/constants/types";

type Props = {
  company: Company;
};

export const ScoutedCompany: VFC<Props> = (props) => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const [relationId, setRelationId] = useState("");

  const getRelation = async () => {
    const ref = collection(db, "relations");
    const q = query(
      ref,
      where("studentId", "==", currentUser?.uid),
      where("companyId", "==", props.company.id),
      where("condition", "==", "scout")
    );
    const snapShot = await getDocs(q);
    setRelationId(snapShot.docs[0].id);
  };

  useEffect(() => {
    getRelation();
  }, [currentUser]);

  const noticeBody = `
          <p>${currentUser?.firstName} ${currentUser?.lastName}さんがスカウトを承認しました。</p>
          <p>チャット画面からメッセージを送信してください。</p>
          <a class="text-blue-600" href="${process.env.NEXT_PUBLIC_ROOT_PATH}/company/${props.company.id}/${currentUser?.uid}">
          ${currentUser?.firstName} ${currentUser?.lastName}さんの詳細画面
          </a>
          `;

  const templateParams = {
    to_email: props.company.email,
    title: "学生とマッチしました",
    to_name: `${props.company.name} 採用担当者`,
    message:
      "スカウトを送った学生とマッチしました。学生詳細画面にて学生とのチャットが可能となりましたので、ご確認ください。",
  };

  const matching = async () => {
    if (confirm(`${props.company.name}とマッチングします。よろしいですか？`)) {
      const relationsRef = doc(db, "relations", relationId);
      await updateDoc(relationsRef, { condition: "matching" });
      const companiesRef = collection(
        db,
        "companies",
        props.company.id,
        "notices"
      );
      await setDoc(doc(companiesRef), {
        created_at: FirebaseTimestamp,
        title: "学生とマッチングしました",
        body: noticeBody,
        isRead: false,
      }).then(() => {
        router.push(`/${currentUser?.uid}/${props.company.id}`);

        toast.success(
          () => (
            <span>
              <b>企業とマッチングしました！</b>
              <div className="py-1.5" />
              企業から最初のメッセージが来るのをお待ちください。
            </span>
          ),
          { duration: 5000 }
        );

        sendMail(templateParams);
      });
    }
  };

  const passScout = async () => {
    if (confirm("スカウトを見送ります。よろしいですか？")) {
      const relationsRef = doc(db, "relations", relationId);
      await updateDoc(relationsRef, { condition: "block" }).then(() => {
        toast.success("スカウトを見送りました");
      });
    }
    onClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-sm">{props.company.name}</p>
        <button
          onClick={onOpen}
          className="w-32 text-xs lg:text-md font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer"
        >
          詳細・マッチング
        </button>
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
                  {props.company.name}
                </Dialog.Title>
                <div>
                  <div className="text-sm space-y-2">
                    <div className="border border-gray-300">
                      <p className="bg-gray-100 px-2 py-1">業界</p>
                      <p className="px-2 py-1">{props.company.industry}</p>
                    </div>
                    <div className="border border-gray-300">
                      <p className="bg-gray-100 px-2 py-1">求める職種</p>
                      <p className="px-2 py-1">
                        {props.company.occupations.join(", ")}
                      </p>
                    </div>
                    <div className="border border-gray-300">
                      <p className="bg-gray-100 px-2 py-1">企業サイト</p>
                      <p className="px-2 py-1">
                        <Link href={props.company.corporateUrl}>
                          <a className="flex items-center hover:text-gray-500">
                            <p className="ml-2 mr-1">
                              {props.company.corporateUrl}
                            </p>
                            <ExternalLinkIcon className="h-5 w-5" />
                          </a>
                        </Link>
                      </p>
                    </div>
                    <div className="border border-gray-300">
                      <p className="bg-gray-100 px-2 py-1">採用サイト</p>
                      <p className="px-2 py-1">
                        <Link href={props.company.recruitUrl}>
                          <a className="flex items-center hover:text-gray-500">
                            <p className="ml-2 mr-1">
                              {props.company.recruitUrl}
                            </p>
                            <ExternalLinkIcon className="h-5 w-5" />
                          </a>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 text-right">
                    <p className="text-sm">
                      企業からのスカウトに返答してください
                    </p>
                    <div className="flex justify-end my-2 space-x-3 sm:space-x-4">
                      <Button
                        variant="solid-blue"
                        className="rounded-lg"
                        onClick={matching}
                      >
                        マッチング
                      </Button>
                      <Button
                        variant="solid-gray"
                        className="rounded-lg"
                        onClick={passScout}
                      >
                        見送る
                      </Button>
                    </div>
                    <p className="text-xs m-2">
                      ※ マッチングすると、選考に進みます
                    </p>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
