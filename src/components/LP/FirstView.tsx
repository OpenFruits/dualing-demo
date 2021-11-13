import { VFC } from "react";
import Link from "next/link";
import { Button } from "src/components/shared/Button";

export const FirstView: VFC = () => {
  return (
    <div className="pt-14 bg-first-view bg-cover lg:flex lg:justify-center lg:pb-10">
      <div className="text-center lg:text-left font-bold flex flex-col px-4 pt-20 lg:pb-12 lg:pl-20 tracking-wider lg:w-1/2 lg:max-w-lg">
        <div className="lg:flex items-center">
          <h2 className="text-2xl tracking-wider">体育会の就活は</h2>
          <div>
            <h1 className="text-6xl">Dualing</h1>
            <p className="text-xs tracking-wider text-center">
              - デュアリング -
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end">
          <Link href="/signin">
            <a className="sm:mx-auto lg:mx-0 mt-6 mb-2 lg:mb-0">
              <Button
                variant="solid-white"
                className="sm:w-40 w-full text-lg font-bold rounded-full shadow-md"
              >
                学生ログイン
              </Button>
            </a>
          </Link>
          <Link href="/signup">
            <a className="lg:mx-4 lg:mb-0 m-auto">
              <span className="text-sm border-b border-black m-auto hover:text-gray-600">
                学生アカウント作成はこちら
              </span>
            </a>
          </Link>
        </div>
        <Link href="/company/signin">
          <a className="m-auto my-8 lg:my-4 lg:mx-0">
            <Button className="lg:w-60 text-xs lg:text-lg rounded-full shadow-md">
              採用担当者様はこちら
            </Button>
          </a>
        </Link>
        <div className="mx-6 sm:mx-20 lg:mt-4 lg:ml-0 lg:mr-8">
          体育会の学生が
          <div className="py-1" />
          部活動に全力で取り組みながら
          <div className="py-1" />
          満足のいく就職活動を行えるように。
          <div className="py-1" />
          そんな想いを込めて「Dualing」は生まれました。
          <div className="py-1" />
          時間と場所に縛られない、新しい採用方式で
          <div className="py-1" />
          企業と学生のベストマッチをサポートします。
        </div>
      </div>
      <div className="w-1/2 pt-24 pb-8 pr-8 lg:max-w-lg">
        <div className="bg-persons hidden lg:block h-full w-11/12 bg-cover"></div>
      </div>
    </div>
  );
};
