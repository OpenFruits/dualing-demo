import { VFC } from "react";

export const GrayBox: VFC = () => {
  return (
    <div className="bg-gray-400 rounded w-11/12 h-52 mx-auto my-2 items-center grid place-items-center">
      <p className="text-xl tracking-wider text-center leading-relaxed">
        動画登録中
        <br />
        少々お待ちください
      </p>
    </div>
  );
};
