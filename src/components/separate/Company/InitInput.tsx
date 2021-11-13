import React, { useContext, useState, VFC } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import {
  useForm,
  SubmitHandler,
  Controller,
  FieldError,
} from "react-hook-form";
import { db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { Input } from "src/components/shared/Input";
import { Button } from "src/components/shared/Button";
import { filterValue } from "src/libs/util";
import { industryOptions } from "src/constants/options/industry";
import { occupationOptions } from "src/constants/options/occupation";
import { CompanyInit as Inputs } from "src/constants/types";
import { doc, updateDoc } from "firebase/firestore";

export const InitInput: VFC = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);

  const submit: SubmitHandler<Inputs> = async (data) => {
    if (confirm("企業情報を登録します。よろしいですか？")) {
      setLoading(true);
      if (currentUser) {
        const ref = doc(db, "companies", currentUser.companyId);
        await updateDoc(ref, {
          industry: data.industry.value,
          occupations: filterValue(data.occupations),
          corporateUrl: data.corporateUrl,
          recruitUrl: data.recruitUrl,
          condition: "normal",
        }).then(() => {
          setCurrentUser({
            ...currentUser,
            industry: data.industry.value,
            occupations: filterValue(data.occupations),
            corporateUrl: data.corporateUrl,
            recruitUrl: data.recruitUrl,
            condition: "normal",
          });
          toast.success("入力が完了しました");
          setLoading(false);
        });
      }
    }
  };

  const industryError = errors.industry as unknown as FieldError;
  const occupationsError = errors.occupations as unknown as FieldError;

  return (
    <div className="">
      <form onSubmit={handleSubmit(submit)}>
        <div className="bg-white p-2 rounded mb-2">
          <p className="text-lg font-bold">{currentUser?.name} 様</p>
          <div className="pt-1" />
          <p className="text-sm">
            利用開始前に、スカウト時に学生に送る企業情報を登録してください。
          </p>
        </div>
        <p className="text-sm font-bold bg-gray-200 p-2">業界</p>
        <div className="border border-gray-200 bg-white px-4 py-2">
          <Controller
            name="industry"
            rules={{
              required: "業界種別は入力必須です",
            }}
            control={control}
            render={({ field }) => (
              <Select
                id="industry"
                instanceId={"industry"}
                inputId={"industry"}
                {...field}
                placeholder="業界種別を選択してください"
                options={industryOptions}
              />
            )}
          />
          <p className="text-red-500 text-sm">{industryError?.message}</p>
        </div>
        <p className="text-sm font-bold bg-gray-200 p-2 mt-2">
          募集している職種
        </p>
        <div className="border border-gray-200 bg-white px-4 py-2">
          <Controller
            name="occupations"
            rules={{
              required: "１つ以上選択してください",
              validate: (value) => value.length <= 3 || "３つまで選択可能です",
            }}
            control={control}
            render={({ field }) => (
              <Select
                id="occupations"
                instanceId={"occupations"}
                inputId={"occupations"}
                {...field}
                placeholder="３つまで選択"
                isMulti
                options={occupationOptions}
              />
            )}
          />
          <p className="text-red-500 text-sm">{occupationsError?.message}</p>
        </div>
        <Input
          label="企業サイト"
          placeholder="企業サイトのURLを入力してください"
          {...register("corporateUrl", {
            required: "企業サイトのURLは必須です",
          })}
          error={errors.corporateUrl?.message}
        />
        <Input
          label="採用サイト"
          placeholder="採用サイトのURLを記入してください"
          {...register("recruitUrl", {
            required: "採用サイトのURLは必須です",
          })}
          error={errors.recruitUrl?.message}
        />
        <div className="py-1" />
        <Button
          className="w-full shadow-md"
          disabled={loading}
          onClick={handleSubmit(submit)}
        >
          {loading ? "登録処理中" : "入力を完了し、学生閲覧を開始する"}
        </Button>
      </form>
    </div>
  );
};
