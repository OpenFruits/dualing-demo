import { VFC } from "react";
import cc from "classcat";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const Section: VFC<Props> = (props) => {
  return (
    <div className="bg-gray-200 py-4 px-8 m-2 w-[400px]">
      <p>{`＜ ${props.title} ＞`}</p>
      {props.children}
    </div>
  );
};
