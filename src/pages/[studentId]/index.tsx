import React, { useContext, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Header } from "src/layout/application/Header";
import { ReservationForm } from "src/components/separate/Student/ReservationForm";
import { Booking } from "src/components/separate/Student/Booking";
import { GrayBox } from "src/components/separate/Student/GrayBox";
import { Inform } from "src/components/separate/Student/Inform";
import { ScoutList } from "src/components/separate/Student/ScoutList";
import { MatchingList } from "src/components/separate/Student/MatchingList";
import { Profile } from "src/components/separate/Student/Profile";
import { auth } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { Footer } from "src/components/separate/Student/Footer";
import { Loading } from "src/layout/application/Loading";
import { NotFound } from "src/layout/application/NotFound";
import Vimeo from "@u-wave/react-vimeo";

const StudentId: NextPage = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const condition = currentUser?.condition;

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  // 未ログイン
  auth.onAuthStateChanged((user) => {
    if (!user) router.push("/signin");
  });

  // ローディング
  if (!currentUser) return <Loading />;

  // 別ユーザーでログイン中
  if (currentUser.uid !== router.query.studentId) {
    return <NotFound />;
  }

  return (
    <div className="relative min-h-screen pb-[140px] box-border">
      <Header pageTitle="マイページ" href={`/${router.query.studentId}`} />
      {condition === "init" ? (
        <ReservationForm />
      ) : (
        <div className="m-auto sm:w-2/3">
          <Inform />
          <Profile />
          {condition === "reserved" && <Booking />}
          {condition === "shooting" && <Booking />}
          {condition === "waiting" && <GrayBox />}
          {condition === "normal" && (
            <div>
              {currentUser.vimeoUrl && (
                <Vimeo
                  video={currentUser.vimeoUrl}
                  responsive
                  className="m-2"
                />
              )}
              <ScoutList />
              <MatchingList />
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default StudentId;
