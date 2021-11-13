import { NextPage } from "next";
import Link from "next/link";
import { Button } from "src/components/shared/Button";
import { Footer } from "src/layout/application/Footer";
import { Header } from "src/layout/application/Header";

const Thanks: NextPage = () => {
  return (
    <>
      <Header pageTitle="" href="/" />
      <div className="h-[calc(100vh-128px)] w-screen bg-first-view bg-cover grid place-items-center">
        <div className=" text-gray-600 bg-white p-8 rounded-lg">
          <p className="text-lg">ご利用ありがとうございました。</p>
          <p className="text-lg">
            再入会の際は、改めて会員登録をしていただく必要があります。
          </p>
          <div className="flex justify-end mt-4">
            <Link href="/">
              <a>
                <Button className="rounded shadow-md text-sm">
                  トップページへ
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Thanks;
