import React, { VFC } from "react";
import { ContentTitle } from "src/components/shared/ContentTitle";

export const Merit: VFC = () => {
  const ITMES = [
    {
      title: "自分らしさを伝える",
      text: "書類では伝わりにくい「自分らしさ」を動画で企業に伝えることができます",
    },
    {
      title: "スカウトが来る",
      text: "学生は。企業からのスカウトをもとに選考に進みたい企業を選びます。",
    },
    {
      title: "ブラッシュアップ",
      text: "体育会出身のアドバイザーが、あなたの「ガクチカ」をブラッシュアップします。",
    },
  ];

  return (
    <div id="merit">
      <div className="w-full h-20 bg-theme-light transform skew-y-3">
        <div className="transform -skew-y-3 translate-y-10 bg-theme-light">
          <ContentTitle title="Dualingの３つの強み" enTitle="merit" />
        </div>
      </div>
      <div className="px-4 pb-10 lg:pb-20 pt-8 tracking-wider text-center bg-theme-light">
        <div className="lg:max-w-3xl lg:mx-auto sm:flex sm:justify-center">
          {ITMES.map((item, index) => {
            return (
              <div
                key={item.title}
                className="flex flex-col bg-white border border-gray-300 my-5 sm:mx-2 p-5 items-center w-60 mx-auto"
              >
                <div className="w-12 h-12 text-3xl font-semibold bg-theme-dark text-white rounded-full flex justify-center items-center">
                  {index + 1}
                </div>
                <h1 className="font-bold my-4">{item.title}</h1>
                <p className="text-xs px-4 text-left">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
