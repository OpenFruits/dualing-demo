import "tailwindcss/tailwind.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { AuthProvider } from "src/firebase/Auth";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Toaster />
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
