import React, { useState, VFC } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { Footer } from "src/layout/application/Footer";
import { Header } from "src/layout/application/Header";
import { auth, db } from "src/firebase";
import { Button } from "src/components/shared/Button";
import { Input } from "src/components/shared/Input";
import { googleFormUrl } from "src/constants/externalLink";
import { signInWithEmailAndPassword } from "@firebase/auth";

type Inputs = {
  email: string;
  password: string;
};

const SignIn: VFC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);

  const signIn: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const company = userCredential.user;
        router.push(`/company/${company.uid}`).then(() => setLoading(false));
      })
      .catch(() => {
        alert("メールアドレスまたはパスワードが間違っています");
        setLoading(false);
      });
  };

  return (
    <div className="bg-first-view bg-cover w-screen h-screen py-14">
      <Header href="/" pageTitle="企業ログインページ" />
      <div className="bg-white w-96 m-auto my-20 p-4">
        <form onSubmit={handleSubmit(signIn)}>
          <Input
            label="メールアドレス"
            placeholder="sample@dualing.jp"
            {...register("email", {
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "正しいメールアドレスを入力してください",
              },
            })}
            error={errors.email?.message}
          />
          <Input
            label="パスワード"
            type="password"
            placeholder="半角英数字8文字以上"
            {...register("password", {
              required: "パスワードは必須です",
              pattern: {
                value: /^[a-z\d]{8,50}$/i,
                message: "半角英数字8文字以上で入力してください",
              },
              maxLength: {
                value: 50,
                message: "パスワードは50字以内で設定してください",
              },
            })}
            error={errors.password?.message}
          />
          <div className="text-center">
            <Button
              className="w-2/3 m-auto shadow-md"
              disabled={loading}
              onClick={handleSubmit(signIn)}
            >
              {loading ? "ログイン中" : "ログイン"}
            </Button>
            <div className="py-1" />
            <Link href={googleFormUrl}>
              <a>
                <span className="text-xs lg:mx-4 lg:mb-0 border-b border-black m-auto">
                  パスワードをお忘れの場合はお問い合わせください
                </span>
              </a>
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
