import { VFC } from "react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";

export const Loading: VFC = () => {
  return (
    <div className="h-screen w-screen grid place-items-center">
      <div className="relative text-center">
        <DotsHorizontalIcon className="w-36 h-36 text-theme animate-pulse" />
        <p className="w-36 absolute top-24 text-gray-400">Loading</p>
      </div>
    </div>
  );
};
