import { VFC } from "react";
import { MinusIcon } from "@heroicons/react/solid";

type Props = {
  title: string;
  enTitle: string;
};

export const ContentTitle: VFC<Props> = (props) => {
  return (
    <div className="my-6">
      <div className="flex justify-center items-center">
        <MinusIcon className="mx-4 w-16 h-0.5 bg-black" />
        <span className="text-2xl font-bold">{props.enTitle}</span>
        <MinusIcon className="mx-4 w-16 h-0.5 bg-black" />
      </div>
      <h1 className="text-3xl font-bold text-center">{props.title}</h1>
    </div>
  );
};
