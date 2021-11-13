import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import React, { useContext, useEffect, useState, VFC } from "react";
import { Layout } from "src/components/shared/Layout";
import { googleFormUrl } from "src/constants/externalLink";
import { db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

export const Booking: VFC = () => {
  const { currentUser } = useContext(AuthContext);
  const [schedule, setSchedule] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [staff, setStaff] = useState("");

  const setScheduleTrue = async () => {
    if (currentUser) {
      const docRef = doc(db, "schedules", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSchedule(true);
        console.log(docSnap.data());

        setStartTime(docSnap.data().startTime);
        setStaff(docSnap.data().staff);
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    setScheduleTrue();
  }, [currentUser]);

  return (
    <Layout option="p-2 bg-gray-200">
      <p>ZOOM予約日時</p>
      <p className="text-2xl font-bold">
        {schedule
          ? `${startTime}（担当者：${staff}）`
          : "確定次第通知いたします"}
      </p>
      <ul className="space-y-4 py-2">
        <li>・60分程度を予定しております</li>
        <li>
          ・開始5分前を目安に、マイページ及びご登録のメールアドレス宛にZOOMのURLをお送りいたします
        </li>
        <li>
          ・日程変更をご希望の場合、２日前までに
          <Link href={googleFormUrl}>
            <a>
              <span className="border-b mx-1 border-black">こちらから</span>
            </a>
          </Link>
          お問い合わせください
        </li>
      </ul>
    </Layout>
  );
};
