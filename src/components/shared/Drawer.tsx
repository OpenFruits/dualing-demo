import React, { VFC } from "react";
import { Dialog, Transition } from "@headlessui/react";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
  fromLeft?: boolean;
};

export const Drawer: VFC<Props> = (props) => {
  const { isOpen, setIsOpen, title, children, fromLeft } = props;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        </Transition.Child>
        <Transition.Child
          className={
            fromLeft
              ? "bg-white absolute inset-0 z-50 w-96"
              : "bg-white absolute right-0 h-full z-50 w-96"
          }
          enter="transition ease duration-300 transform"
          enterFrom={fromLeft ? "-translate-x-full" : "translate-x-full"}
          enterTo="translate-x-0"
          leave="transition ease duration-200 transform"
          leaveFrom="translate-x-0"
          leaveTo={fromLeft ? "-translate-x-full" : "translate-x-full"}
        >
          <Dialog.Title
            as="h3"
            className="text-lg font-bold p-4 leading-6 text-gray-900"
          >
            {title}
          </Dialog.Title>
          <div className="py-2 px-4">{children}</div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
