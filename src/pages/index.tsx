import type { NextPage } from "next";
import Head from "next/head";
import { db } from "src/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";

const Home: NextPage = () => {
  const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().firstName}`);
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <Head>
        <title>Dualing</title>
      </Head>

      <main>
        <h1 className="">Dualing</h1>
      </main>
    </div>
  );
};

export default Home;
