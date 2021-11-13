import { useContext, VFC } from "react";
import { useRouter } from "next/router";
import { Button } from "src/components/shared/Button";
import { Footer } from "src/layout/application/Footer";
import { Header } from "src/layout/application/Header";
import { auth } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

export const NotFound: VFC = () => {
  const router = useRouter();
  const { setCurrentUser } = useContext(AuthContext);

  const logout = () => {
    if (auth.currentUser) {
      auth.signOut().then(() => {
        setCurrentUser(undefined);
      });
    }
  };

  const studentSignin = () => {
    logout();
    router.push("/signin");
  };

  const companySignin = () => {
    logout();
    router.push("/company/signin");
  };

  return (
    <div>
      <Header pageTitle="" href="/" />
      <div className="h-[calc(100vh-128px)] w-screen bg-first-view bg-cover grid place-items-center">
        <div className=" text-gray-600 bg-white p-8 rounded-lg">
          <p className="text-lg">ページが見つかりません。</p>
          <p className="text-lg">
            ページを更新しても表示が変わらない場合、
            <br />
            URLが間違っている可能性があります。お確かめください。
          </p>
          <div className="my-1.5 border-t" />
          <p>
            ログインは済んでいますか？
            <br />
            ログイン状態でなければアクセスできないページの可能性があります。
          </p>
          <div className="flex space-x-4 mt-2">
            <Button
              onClick={studentSignin}
              className="rounded shadow-md text-sm"
            >
              学生ログイン画面へ
            </Button>
            <Button
              onClick={companySignin}
              className="rounded shadow-md text-sm"
            >
              企業ログイン画面へ
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
