import { VFC } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const InputSection: VFC<Props> = (props) => {
  return (
    <div>
      <p className="text-sm font-bold bg-gray-200 p-3">{props.title}</p>
      <div className="border border-gray-200 p-4">{props.children}</div>
    </div>
  );
};
