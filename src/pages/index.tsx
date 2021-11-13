import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "src/components/LP/Header";
import { FirstView } from "src/components/LP/FirstView";
import { Whatis } from "src/components/LP/Whatis";
import { Merit } from "src/components/LP/Merit";
import { Flow } from "src/components/LP/Flow";
import { FAQ } from "src/components/LP/FAQ";
import { Footer } from "src/components/LP/Footer";

const Home: NextPage = () => {
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
