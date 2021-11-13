import { forwardRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import cc from "classcat";

type Props = UseFormRegisterReturn & {
  label: string;
  type?: string;
  error?: string;
  placeholder?: string;
  defaultValue?: string;
  option?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <div className="border border-gray-200 my-2 pb-2 bg-white">
      <label
        className="text-sm font-bold bg-gray-200 p-2 block"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <div className="mx-4 mt-2">
        <input
          ref={ref}
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          className={cc([
            "border border-gray-200 rounded p-1 w-full h-10",
            {
              [`${props.option}`]: props.option,
            },
          ])}
          name={props.name}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
      </div>
      <p className="text-red-500 ml-4 text-sm">{props.error ?? null}</p>
    </div>
  );
});
