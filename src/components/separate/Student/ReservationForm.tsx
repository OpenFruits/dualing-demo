import { VFC, useState, useContext } from "react";
import { Button } from "src/components/shared/Button";
import { DatePicker } from "src/components/shared/DatePicker";
import { SelectTimeZone } from "src/components/shared/SelectTimeZone";
import { OpeningMessage } from "src/components/separate/Student/OpeningMessage";
import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import { db, FirebaseTimestamp } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import toast from "react-hot-toast";
import { collection, doc, setDoc, updateDoc } from "@firebase/firestore";

export type Reservations = {
  date: string;
  timeZone: string;
};

export const ReservationForm: VFC = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const [firstChoice, setFirstChoice] = useState<Reservations>({
    date: "",
    timeZone: "",
  });
  const [secondChoice, setSecondChoice] = useState<Reservations>({
    date: "",
    timeZone: "",
  });
  const [thirdChoice, setThirdChoice] = useState<Reservations>({
    date: "",
    timeZone: "",
  });

  const reserve = async () => {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { condition: "reserved" }).then(() => {
      setCurrentUser({ ...currentUser, condition: "reserved" });
      toast.success("予約を送信しました。");
    });

    const newReservationRef = collection(db, "reservations");
    await setDoc(doc(newReservationRef, currentUser.uid), {
      username: `${currentUser.firstName} ${currentUser.lastName}`,
      firstChoice: `${firstChoice.date} ${firstChoice.timeZone}`,
      secondChoice: `${secondChoice.date} ${secondChoice.timeZone}`,
      thirdChoice: `${thirdChoice.date} ${thirdChoice.timeZone}`,
      created_at: FirebaseTimestamp,
    });
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthNum = tomorrow.getMonth() + 1;
  const dayNum = tomorrow.getDate();

  return (
    <div className="md:w-2/3 m-auto">
      <OpeningMessage />
      <div className="divide-gray-500 divide-y bg-gray-100 pb-4">
        <div className="p-4">
          <span className="text-sm font-bold text-gray-700 block">
            第１希望
          </span>
          <DatePicker
            reservations={firstChoice}
            setReservations={setFirstChoice}
          />
          <div className="px-2">
            <SelectTimeZone
              reservations={firstChoice}
              setReservations={setFirstChoice}
            />
          </div>
        </div>
        <div className="p-4">
          <span className="text-sm font-bold text-gray-700 block">
            第２希望
          </span>
          <DatePicker
            reservations={secondChoice}
            setReservations={setSecondChoice}
          />
          <div className="px-2">
            <SelectTimeZone
              reservations={secondChoice}
              setReservations={setSecondChoice}
            />
          </div>
        </div>
        <div className="p-4">
          <span className="text-sm font-bold text-gray-700 block">
            第３希望
          </span>
          <DatePicker
            reservations={thirdChoice}
            setReservations={setThirdChoice}
          />
          <div className="px-2">
            <SelectTimeZone
              reservations={thirdChoice}
              setReservations={setThirdChoice}
            />
          </div>
        </div>
        <Button onClick={onOpen} className="mx-4 rounded shadow-md">
          予約確定
        </Button>
      </div>
      <div>
        <p className="mx-2 my-4 font-bold">
          遅くとも明日(
          {`${monthNum}月${dayNum}日`}
          )に日時を確定し、ご登録のメールアドレスにご連絡させていただきます。
          <br />
          また、ご希望に沿わない場合もありますのでご了承ください。
        </p>
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
                  予約内容の確認
                </Dialog.Title>
                <div>
                  <p className="text-sm mb-2">
                    以下で予約します。 よろしいですか？
                  </p>
                  <div className="mb-2">
                    {`第１希望：${firstChoice.date} ${firstChoice.timeZone}`}
                  </div>
                  <div className="mb-2">
                    {`第２希望：${secondChoice.date} ${secondChoice.timeZone}`}
                  </div>
                  <div className="mb-2">
                    {`第３希望：${thirdChoice.date} ${thirdChoice.timeZone}`}
                  </div>
                  <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                    <Button
                      variant="solid-blue"
                      className="rounded-lg"
                      onClick={reserve}
                    >
                      予約送信
                    </Button>
                    <Button
                      variant="solid-gray"
                      className="rounded-lg"
                      onClick={onClose}
                    >
                      変更
                    </Button>
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
