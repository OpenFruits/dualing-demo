import React, { VFC, useState, useEffect } from "react";
import cc from "classcat";
import { Button } from "src/components/shared/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { db, FirebaseTimestamp } from "src/firebase";
import { Input } from "src/components/shared/Input";
import { getJapaneseDate } from "src/components/shared/DatePicker";
import { sendMail } from "src/libs/sendMail";
import { resetDate } from "src/libs/util";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import type { Schedule, VimeoUser } from "src/constants/types";
import { getScheduleList } from "src/components/separate/Admin/fetch/getScheduleList";
import { getVimeoUserList } from "src/components/separate/Admin/fetch/getVimeoUserList";

type Props = {
  schedule: Schedule;
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  setVimeoUsers: React.Dispatch<React.SetStateAction<VimeoUser[]>>;
};

export const ScheduleItem: VFC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const [toEmail, setToEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ zoomUrl: string }>();

  const studentId = props.schedule.studentId;
  const username = props.schedule.studentName;
  const staff = props.schedule.staff;
  const date: Date = props.schedule.date.toDate();
  const hour = `0${date.getHours()}`.slice(-2);
  const min = `0${date.getMinutes()}`.slice(-2);
  const startTime = `${getJapaneseDate(date)} ${hour}:${min}~`;
  const today = new Date(); // 本日の日付
  const daysLeft =
    (resetDate(date).getTime() - resetDate(today).getTime()) / 86400000; // 残日数

  const fetchScheduleList = async () => {
    const data = await getScheduleList();
    props.setSchedules(data);
  };

  const fetchVimeoUserList = async () => {
    const data = await getVimeoUserList();
    props.setVimeoUsers(data);
  };

  const setEmail = async () => {
    const docRef = doc(db, "users", props.schedule.studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setToEmail(docSnap.data().email);
    }
  };

  useEffect(() => {
    setEmail();
  }, []);

  const sendUrl: SubmitHandler<{ zoomUrl: string }> = async (data) => {
    if (confirm(`${username}さんに招待リンクを送信します。よろしいですか？`)) {
      // 1. ZOOMスケジュールリストから削除
      await deleteDoc(doc(db, "schedules", studentId));
      const userRef = doc(db, "users", studentId);
      await updateDoc(userRef, { condition: "shooting" });
      // 3. 学生に通知+メール送信
      const newNoticeRef = collection(db, "users", studentId, "notices");
      await setDoc(doc(newNoticeRef), {
        created_at: FirebaseTimestamp,
        title: "ZOOMのURLをお送りします",
        body: `
             <h2>ZOOMのURL</h2>
             <a href="${data.zoomUrl}">${data.zoomUrl}</a>
            `,
        isRead: false,
      }).then(() => {
        sendMail({
          to_email: toEmail,
          title: "まもなくZOOM面談が始まります",
          to_name: username,
          message: `予定していたZoom面談の時間となりましたので、招待リンク（${data.zoomUrl}）よりお越しください`,
        });
        toast.success(`${username}さんにZOOMのURLを送信しました。`);
      });
      fetchScheduleList();
      fetchVimeoUserList();
      onClose();
    }
  };

  return (
    <div>
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
                  {`ZOOM招待：${username}`}
                </Dialog.Title>
                <form onSubmit={handleSubmit(sendUrl)}>
                  <div>
                    <p>{`・${startTime}`}</p>
                    <p className="pt-2">{`・担当者：${staff}`}</p>
                    <div className="pt-4">
                      <Input
                        label="ZOOMの招待リンクを貼り付け"
                        placeholder=""
                        {...register("zoomUrl", {
                          required: "招待リンクを入力してください",
                        })}
                        error={errors.zoomUrl?.message}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                    <Button
                      variant="solid-blue"
                      className="rounded-lg"
                      onClick={handleSubmit(sendUrl)}
                    >
                      招待リンクを送信
                    </Button>
                    <Button
                      variant="solid-gray"
                      className="rounded-lg"
                      onClick={onClose}
                    >
                      閉じる
                    </Button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <div
        className="py-1 px-2 my-2 bg-white hover:bg-gray-100 cursor-pointer flex justify-between"
        onClick={onOpen}
      >
        <div>
          <p>{startTime}</p>
          <p>{username}</p>
        </div>
        <div className="space-y-1">
          {daysLeft === 0 ? (
            <p className="text-xs text-white bg-red-700 px-2 py-1 font-bold rounded-full">
              本日中！
            </p>
          ) : (
            <p className="text-xs text-white bg-yellow-500 px-2 py-1 font-bold rounded-full">
              {`${daysLeft}日後`}
            </p>
          )}
          <p
            className={cc([
              "text-xs text-white font-bold px-2 py-1 rounded-full text-center",
              {
                ["bg-red-400"]: staff === "川北",
                ["bg-blue-400"]: staff === "溝口",
              },
            ])}
          >
            {staff}
          </p>
        </div>
      </div>
    </div>
  );
};
