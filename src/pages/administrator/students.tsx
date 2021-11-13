import React, { VFC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "src/firebase";
import { Header } from "src/layout/application/Header";
import { Button } from "src/components/shared/Button";
import { Layout } from "src/components/shared/Layout";
import { Loading } from "src/layout/application/Loading";
import { FromTimeStampToDate } from "src/libs/util";
import Vimeo from "@u-wave/react-vimeo";
import { getDocs } from "@firebase/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { AdminStudent } from "src/constants/types";

const Students: VFC = () => {
  const router = useRouter();
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [showID, setShowID] = useState("");

  const getStudentList = async () => {
    const ref = collection(db, "users");
    const q = query(ref, orderBy("created_at", "desc"));
    const snapShot = await getDocs(q);
    const students = snapShot.docs.map((doc) => {
      return {
        uid: doc.id,
        firstName: doc.get("firstName"),
        firstKana: doc.get("firstKana"),
        lastName: doc.get("lastName"),
        lastKana: doc.get("lastKana"),
        email: doc.get("email"),
        phoneNumber: doc.get("phoneNumber"),
        university: doc.get("university"),
        department: doc.get("department"),
        club: doc.get("club"),
        important: doc.get("important"),
        industries: doc.get("industries"),
        occupations: doc.get("occupations"),
        locations: doc.get("locations"),
        advantages: doc.get("advantages"),
        comment: doc.get("comment"),
        condition: doc.get("condition"),
        vimeoUrl: doc.get("vimeoUrl"),
        thumbnailUrl: doc.get("thumbnailUrl"),
        created_at: doc.get("created_at"),
      };
    });
    setStudents(students);
  };

  useEffect(() => {
    getStudentList();
  }, []);

  const conditionToStatus = (condition: string): string => {
    if (condition === "init") return "登録のみ";
    if (condition === "reserved") return "ZOOM予定";
    if (condition === "waiting") return "動画登録待ち";
    if (condition === "normal") return "通常";
    if (condition === "unsubscribed") return "退会済み";
    return "";
  };

  if (students.length === 0) return <Loading />;

  return (
    <>
      <Header pageTitle="管理者用ページ" href="/administrator" />
      <div className="m-auto sm:w-2/3">
        <Layout>
          <Button
            className="shadow-md"
            onClick={() => router.push("/administrator")}
          >
            管理者ページTOPに戻る
          </Button>
          <div className="py-4">
            <p className="text-xl font-bold py-2">学生一覧</p>
            <div className="w-full bg-gray-100 flex space-x-2 py-2">
              <p className="w-1/4">ID</p>
              <p className="w-1/4 pl-3">氏名</p>
              <p className="w-1/4">ステータス</p>
              <p className="w-1/4">登録日時</p>
            </div>
            {students?.map((student) => (
              <div key={student.uid}>
                <div
                  onClick={() =>
                    setShowID(showID === student.uid ? "" : student.uid)
                  }
                  className={
                    showID === student.uid
                      ? `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer bg-gray-200`
                      : `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer`
                  }
                >
                  <p className="text-xs truncate w-1/4">{student.uid}</p>
                  <p
                    className={
                      showID === student.uid
                        ? `w-1/4 pl-3 bg-gray-200`
                        : `w-1/4 pl-3`
                    }
                  >{`${student.firstName} ${student.lastName}`}</p>
                  <p className="w-1/4">
                    {conditionToStatus(student.condition)}
                  </p>
                  <p className="text-sm">
                    {FromTimeStampToDate(student.created_at)}
                  </p>
                </div>
                {showID === student.uid && (
                  <div className="space-y-2 p-2 border">
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">
                        メールアドレス
                      </p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.email}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">電話番号</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.phoneNumber}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">大学・学部</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {`${student.university} ${student.department}`}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">部活</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.club}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">
                        企業選びの軸
                      </p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.important.join(", ")}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">
                        興味のある業界
                      </p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.industries.join(", ")}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">
                        興味のある職種
                      </p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.occupations.join(", ")}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">希望勤務地</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.locations.join(", ")}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">強み、長所</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.advantages.join(", ")}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs">
                      <p className="bg-gray-100 px-2 py-1">ひとことアピール</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {student.comment}
                      </p>
                    </div>
                    <div className="flex">
                      <div
                        className="w-1/2 my-1 mx-2 bg-cover"
                        style={{
                          backgroundImage: `url(${student.thumbnailUrl})`,
                        }}
                      />
                      <div className="w-1/2 my-1 mx-2">
                        {student.vimeoUrl && (
                          <Vimeo video={student.vimeoUrl} responsive />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Layout>
      </div>
    </>
  );
};
export default Students;
