import { VFC } from "react";
import cc from "classcat";

type Props = {
  children: React.ReactNode;
  option?: string;
};

export const Layout: VFC<Props> = (props) => {
  return (
    <div
      className={cc([
        "m-4",
        {
          [`${props.option}`]: props.option,
        },
      ])}
    >
      {props.children}
    </div>
  );
};
