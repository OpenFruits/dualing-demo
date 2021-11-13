import type { NextPage } from "next";
import Head from "next/head";
import { db } from "src/firebase";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Header } from "src/components/LP/Header";
import { FirstView } from "src/components/LP/FirstView";
import { Whatis } from "src/components/LP/Whatis";
import { Merit } from "src/components/LP/Merit";
import { Flow } from "src/components/LP/Flow";
import { FAQ } from "src/components/LP/FAQ";
import { Footer } from "src/components/LP/Footer";

const Home: NextPage = () => {
  // 書き込み
  const setUser = async () => {
    const usersRef = collection(db, "users");
    await setDoc(doc(usersRef), {
      firstName: "荒川",
      lastName: "テスト君",
    });
  };

  // 一覧取得
  const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().firstName}`);
    });
  };

  // 個別取得
  const getUser = async () => {
    const docRef = doc(db, "users", "012345");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.id);
      console.log(docSnap.data());
      console.log(docSnap.data().firstName);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    // setUser();
    // getUsers();
    // getUser();
  }, []);

  return (
    <>
      <Head>
        <title>Dualing</title>
      </Head>

      <main className="font-sans">
        <Header />
        <FirstView />
        <Whatis />
        <Merit />
        <Flow />
        <FAQ />
        <Footer />
      </main>
    </>
  );
};

export default Home;
