import { useState, VFC } from "react";
import { auth, db, FirebaseTimestamp } from "src/firebase";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "src/components/shared/Button";
import { Input } from "src/components/shared/Input";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc } from "@firebase/firestore";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const CompanySignup: VFC<{ onClose: () => void }> = ({ onClose }) => {
  const router = useRouter();
  const { register, handleSubmit, formState, getValues } = useForm<Inputs>({
    defaultValues: {
      name: "株式会社",
      email: "company@dualing.com",
      password: "",
      confirmPassword: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const createCompany: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    const { name, email, password } = data;

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const company = userCredential.user;

        if (company) {
          const ref = collection(db, "companies");
          await setDoc(doc(ref, company.uid), {
            created_at: FirebaseTimestamp,
            companyId: company.uid,
            name: name,
            email: email,
            password: password,
            condition: "init",
            role: "company",
          }).then(() => {
            toast.success("企業を新規登録しました");
            onClose();
            auth.signOut();
            router.push("/administrator");
          });
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("メールアドレスがすでに使用されています");
        } else {
          alert("アカウント登録ができません。");
        }
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(createCompany)}>
      <Input
        label="企業名"
        {...register("name", { required: "企業名は必須です" })}
        error={formState.errors.name?.message}
      />
      <Input
        label="メールアドレス"
        {...register("email", {
          required: "メールアドレスは必須です",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "正しいメールアドレスを入力してください",
          },
        })}
        error={formState.errors.email?.message}
      />
      <Input
        label="パスワード"
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
        error={formState.errors.password?.message}
      />
      <Input
        label="確認用パスワード"
        {...register("confirmPassword", {
          required: "確認用パスワードは必須です",
          validate: (value) =>
            value === getValues("password") || "パスワードが一致しません",
        })}
        error={formState.errors.confirmPassword?.message}
      />
      <Button
        className="shadow-md w-full my-4"
        disabled={loading}
        onClick={handleSubmit(createCompany)}
      >
        {loading ? "登録中" : "企業アカウント登録"}
      </Button>
    </form>
  );
};
