import React, { useEffect, useContext, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Select from "react-select";
import {
  useForm,
  SubmitHandler,
  Controller,
  FieldError,
} from "react-hook-form";
import { auth, db, FirebaseTimestamp } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { Header } from "src/layout/application/Header";
import { Button } from "src/components/shared/Button";
import { Input } from "src/components/shared/Input";
import { filterValue, arrayForSearch } from "src/libs/util";
import { advantageOptions } from "src/constants/options/advantage";
import { importantOptions } from "src/constants/options/important";
import { industryOptions } from "src/constants/options/industry";
import { locationOptions } from "src/constants/options/location";
import { occupationOptions } from "src/constants/options/occupation";
import { EditForms as Inputs } from "src/constants/types";
import { Loading } from "src/layout/application/Loading";
import { NotFound } from "src/layout/application/NotFound";
import { doc, updateDoc } from "firebase/firestore";

const Edit: NextPage = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>();

  const [loading, setLoading] = useState(false);

  const update: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const uid = currentUser.uid;
    const timestamp = FirebaseTimestamp;
    const userUpdateData = {
      updated_at: timestamp,
      firstName: data.firstName,
      firstKana: data.firstKana,
      lastName: data.lastName,
      lastKana: data.lastKana,
      university: data.university,
      department: data.department,
      club: data.club,
      important: filterValue(data.important),
      importantForSearch: arrayForSearch(data.important),
      industries: filterValue(data.industries),
      industriesForSearch: arrayForSearch(data.industries),
      occupations: filterValue(data.occupations),
      occupationsForSearch: arrayForSearch(data.occupations),
      locations: filterValue(data.locations),
      locationsForSearch: arrayForSearch(data.locations),
      advantages: filterValue(data.advantages),
      advantagesForSearch: arrayForSearch(data.advantages),
      comment: data.comment,
    };

    const ref = doc(db, "users", uid);
    await updateDoc(ref, userUpdateData).then(() => {
      setCurrentUser({
        ...currentUser,
        firstName: data.firstName,
        firstKana: data.firstKana,
        lastName: data.lastName,
        lastKana: data.lastKana,
        university: data.university,
        department: data.department,
        club: data.club,
        important: filterValue(data.important),
        industries: filterValue(data.industries),
        occupations: filterValue(data.occupations),
        locations: filterValue(data.locations),
        advantages: filterValue(data.advantages),
        comment: data.comment,
      });
      router.push(`/${uid}`).then(() => setLoading(false));
      toast.success("プロフィールを更新しました");
    });
  };

  const importantError = errors.important as unknown as FieldError;
  const industriesError = errors.industries as unknown as FieldError;
  const occupationsError = errors.occupations as unknown as FieldError;
  const locationsError = errors.locations as unknown as FieldError;
  const advantagesError = errors.advantages as unknown as FieldError;

  useEffect(() => {
    register("important");
  }, [register]);

  // 未ログイン
  auth.onAuthStateChanged((user) => {
    if (!user) router.push("/signin");
  });

  // ローディング
  if (!currentUser) return <Loading />;

  // 別ユーザーでログイン中
  if (currentUser.uid !== router.query.studentId) {
    return <NotFound />;
  }

  return (
    <>
      <Header pageTitle="" href={`/${currentUser?.uid}`} />
      <div className="m-auto sm:w-2/3">
        <div className="flex justify-between pt-4 pr-4">
          <h1 className="p-2 font-bold text-lg">プロフィール編集</h1>
          <Button
            className="w-[100px] h-10 rounded shadow-md"
            onClick={() => router.push(`/${currentUser?.uid}`)}
          >
            戻る
          </Button>
        </div>
        <form className="p-2" onSubmit={handleSubmit(update)}>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-bold bg-gray-200 p-3">姓名</p>
              <div className="border border-gray-200 bg-white">
                <div className="flex justify-center sm:justify-start sm: mx-4">
                  <input
                    placeholder="姓"
                    defaultValue={currentUser.firstName}
                    className="bg-white rounded border border-gray-300 p-1 mx-1 mt-2 w-40 h-10"
                    {...register("firstName", { required: "姓名は必須です" })}
                  />
                  <input
                    placeholder="名"
                    defaultValue={currentUser.lastName}
                    className="bg-white rounded border border-gray-300 p-1 mx-1 mt-2 w-40 h-10"
                    {...register("lastName", { required: "姓名は必須です" })}
                  />
                </div>
                <p className="text-red-500 ml-4 mb-2 text-sm">
                  {errors.firstName?.message ??
                    errors.lastName?.message ??
                    null}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold bg-gray-200 p-3">姓名（かな）</p>
              <div className="border border-gray-200 bg-white">
                <div className="flex justify-center sm:justify-start sm: mx-4">
                  <input
                    placeholder="姓（かな）"
                    defaultValue={currentUser.firstKana}
                    className="bg-white rounded border border-gray-300 p-1 mx-1 mt-2 w-40 h-10"
                    {...register("firstKana", {
                      required: "姓名（かな）は必須です",
                    })}
                  />
                  <input
                    placeholder="名（かな）"
                    defaultValue={currentUser.lastKana}
                    className="bg-white rounded border border-gray-300 p-1 mx-1 mt-2 w-40 h-10"
                    {...register("lastKana", {
                      required: "姓名は必須です（かな）",
                    })}
                  />
                </div>
                <p className="text-red-500 ml-4 mb-2 text-sm">
                  {errors.firstKana?.message ??
                    errors.lastKana?.message ??
                    null}
                </p>
              </div>
            </div>
            <Input
              label="大学名"
              placeholder="〇〇大学"
              defaultValue={currentUser.university}
              {...register("university", {
                required: "大学名は必須です",
              })}
              error={errors.university?.message}
            />
            <Input
              label="学部"
              placeholder="〇〇学部"
              defaultValue={currentUser.department}
              {...register("department", {
                required: "学部は必須です",
              })}
              error={errors.department?.message}
            />
            <Input
              label="部活、サークル"
              placeholder="〇〇部"
              defaultValue={currentUser.club}
              {...register("club", {
                required: "部活、サークルは必須です",
              })}
              error={errors.club?.message}
            />
            <div>
              <p className="text-sm font-bold bg-gray-200 p-3">企業選びの軸</p>
              <div className="border border-gray-200 bg-white px-4 py-2">
                <Controller
                  name="important"
                  defaultValue={currentUser.important.map((label: string) => ({
                    label: label,
                    value: label,
                  }))}
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) =>
                      value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="important"
                      instanceId={"important"}
                      inputId={"important"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={importantOptions}
                    />
                  )}
                />
                <p className="text-red-500 text-sm">
                  {importantError?.message}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold bg-gray-200 p-3">
                興味のある業界
              </p>
              <div className="border border-gray-200 bg-white px-4 py-2">
                <Controller
                  name="industries"
                  defaultValue={currentUser.industries.map((label: string) => ({
                    label: label,
                    value: label,
                  }))}
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) =>
                      value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="industries"
                      instanceId={"industries"}
                      inputId={"industries"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={industryOptions}
                    />
                  )}
                />
                <p className="text-red-500 text-sm">
                  {industriesError?.message}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold bg-gray-200 p-3">
                興味のある職種
              </p>
              <div className="border border-gray-200 bg-white px-4 py-2">
                <Controller
                  name="occupations"
                  defaultValue={currentUser.occupations.map(
                    (label: string) => ({
                      label: label,
                      value: label,
                    })
                  )}
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) =>
                      value.length <= 3 || "３つまで選択可能です",
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
                <p className="text-red-500 text-sm">
                  {occupationsError?.message}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold bg-gray-200 p-3">希望勤務地</p>
              <div className="border border-gray-200 bg-white px-4 py-2">
                <Controller
                  name="locations"
                  defaultValue={currentUser.locations?.map((label: string) => ({
                    label: label,
                    value: label,
                  }))}
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) =>
                      value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="locations"
                      instanceId={"locations"}
                      inputId={"locations"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={locationOptions}
                    />
                  )}
                />
                <p className="text-red-500 text-sm">
                  {locationsError?.message}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold bg-gray-200 p-3">強み</p>
              <div className="border border-gray-200 bg-white px-4 py-2">
                <Controller
                  name="advantages"
                  defaultValue={currentUser.advantages.map((label: string) => ({
                    label: label,
                    value: label,
                  }))}
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) =>
                      value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="advantages"
                      instanceId={"advantages"}
                      inputId={"advantages"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={advantageOptions}
                    />
                  )}
                />
                <p className="text-red-500 text-sm">
                  {advantagesError?.message}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold bg-gray-200 p-3">
                ひとことアピール（任意）
              </p>
              <div className="border border-gray-200 bg-white px-4 py-2">
                <textarea
                  {...register("comment")}
                  defaultValue={currentUser.comment}
                  placeholder="(例)誰にも負けない執着心を営業職で発揮したいです。趣味は登山です。"
                  className="resize-none h-14 w-full border border-gray-300 p-1 rounded leading-none"
                />
              </div>
            </div>
          </div>
          <br />
          <Button
            className="w-full mb-4 shadow-md"
            disabled={loading}
            onClick={handleSubmit(update)}
          >
            {loading ? "更新中" : "プロフィール情報を更新する"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Edit;
