import { forwardRef, useMemo } from "react";
import cc from "classcat";

type Common = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
};

type ButtonVariant =
  | "outline"
  | "ghost"
  | "solid-blue"
  | "solid-red"
  | "solid-gray"
  | "solid-white"
  | "solid-black";

type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> & Common;

const useButtonClass = (
  className?: string,
  variant?: ButtonVariant,
  disabled?: boolean
) => {
  const classes = useMemo(() => {
    return cc([
      "grid place-items-center px-4 py-2 font-bold tracking-wider focus-visible:ring-2 transition duration-200 ease-in-out focus:outline-none cursor-pointer",
      {
        "bg-gray-400 hover:bg-gray-400 cursor-default text-white": disabled,
        "border dark:border-gray-500 focus:ring-2 focus:ring-blue-400":
          variant === "outline" && !disabled,
        "hover:text-blue-400 focus-visible:text-blue-400 hover:bg-blue-50 focus-visible:bg-blue-50 dark:hover:bg-opacity-10 dark:focus-visible:bg-opacity-10 focus-visible:ring-blue-400":
          variant === "ghost" && !disabled,
        "text-white bg-blue-500 hover:bg-blue-600 focus-visible:bg-blue-600 focus-visible:ring-blue-400":
          variant === "solid-blue" && !disabled,
        "text-white bg-red-500 hover:bg-red-600 focus-visible:bg-red-600 focus-visible:ring-red-400":
          variant === "solid-red" && !disabled,
        "bg-gray-100 hover:bg-gray-200 focus-visible:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 focus-visible:ring-blue-400":
          variant === "solid-gray" && !disabled,
        "dark:text-black bg-white hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-200 dark:focus:bg-gray-200":
          variant === "solid-white" && !disabled,
        "text-white bg-black hover:bg-gray-800 focus:bg-gray-800 dark:hover:bg-gray-900 dark:focus:bg-gray-900":
          variant === "solid-black" && !disabled,
      },
      className,
    ]);
  }, [className, variant, disabled]);

  return classes;
};

export const Button = forwardRef<HTMLButtonElement, ButtonType>(
  (props, ref) => {
    const {
      children,
      className,
      variant = "solid-blue",
      disabled,
      ...rest
    } = props;
    const classes = useButtonClass(className, variant, disabled);
    return (
      <button
        type="button"
        disabled={disabled}
        ref={ref}
        {...rest}
        className={classes}
      >
        {children}
      </button>
    );
  }
);
