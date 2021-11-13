import React, { useState, VFC } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { auth } from "src/firebase";
import { Header } from "src/layout/application/Header";
import { Button } from "src/components/shared/Button";
import { Input } from "src/components/shared/Input";
import { ResetPasswordForm } from "src/components/separate/Student/ResetPasswordForm";
import { signInWithEmailAndPassword } from "@firebase/auth";

type Inputs = {
  email: string;
  password: string;
};

const SignIn: VFC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
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
        const user = userCredential.user;
        router.push(`/${user.uid}`).then(() => setLoading(false));
      })
      .catch(() => {
        alert("メールアドレスまたはパスワードが間違っています");
        setLoading(false);
      });
  };

  return (
    <div className="bg-first-view bg-cover w-screen h-screen">
      <Header href="/" pageTitle="学生ログインページ" />
      <div className="m-auto my-20 p-4 sm:w-2/3">
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
              className="w-2/3 sm:w-full my-4 m-auto shadow-md"
              disabled={loading}
              onClick={handleSubmit(signIn)}
            >
              {loading ? "ログイン中" : "ログイン"}
            </Button>
            <div className="py-1" />
            <Link href="/signup">
              <a>
                <span className="text-sm lg:mx-4 lg:mb-0 border-b border-black m-auto">
                  学生アカウント作成はこちら
                </span>
              </a>
            </Link>
            <div className="py-1" />
            <span
              onClick={onOpen}
              className="text-xs lg:mx-4 lg:mb-0 border-b border-black m-auto cursor-pointer hover:text-gray-500"
            >
              パスワードをお忘れの場合
            </span>
          </div>
        </form>
      </div>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-sm px-6 my-20 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold py-4 leading-6 text-gray-900"
                >
                  パスワード再設定
                </Dialog.Title>
                {<ResetPasswordForm onClose={onClose} />}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SignIn;
