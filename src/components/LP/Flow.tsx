import React, { VFC } from "react";
import { ContentTitle } from "src/components/shared/ContentTitle";
import Image from "next/image";

export const Flow: VFC = () => {
  const ITMES = [
    {
      title: "アカウント作成",
      text: "基本情報でアカウントを登録後、ZOOMで自己PR動画を録画し、準備完了です。",
    },
    {
      title: "企業とマッチング",
      text: "あなたの基本情報と自己PR動画を気に入った企業からスカウトが届きます。スカウトに対して学生は「マッチング」または「見送る」を選択します。",
    },
    {
      title: "選考〜内定",
      text: "マッチング後、企業の採用担当者とチャットを通して選考を行なっていきます。",
    },
  ];

  return (
    <div id="flow">
      <div className="w-full h-20 bg-white transform -skew-y-3 -translate-y-12 lg:-translate-y-16">
        <div className="transform skew-y-3 translate-y-10">
          <ContentTitle title="サービス利用の流れ" enTitle="Flow" />
        </div>
      </div>
      <div className="px-4 tracking-wider sm:max-w-3xl sm:mx-auto sm:flex sm:justify-cente">
        <div className="hidden sm:block">
          <Image
            src="/application.png"
            alt="アプリケーション"
            width={450}
            height={450}
          />
        </div>
        <div>
          {ITMES.map((item, index) => {
            return (
              <div
                key={item.title}
                className="flex flex-col bg-white mx-5 mb-3 lg:mb-5"
              >
                <div className="w-16 font-bold bg-theme text-white rounded-full flex justify-center items-center">
                  {`step.${index + 1}`}
                </div>
                <h1 className="text-2xl font-bold">{item.title}</h1>
                <p className="text-xs">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
