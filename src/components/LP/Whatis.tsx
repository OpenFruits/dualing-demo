import { VFC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContentTitle } from "src/components/shared/ContentTitle";
import { Button } from "src/components/shared/Button";

export const Whatis: VFC = () => {
  return (
    <div id="whatis">
      <div className="w-full h-20 bg-white transform -skew-y-3 sm:-skew-y-3 -translate-y-16">
        <div className="transform skew-y-3 sm:skew-y-3 translate-y-10">
          <ContentTitle title="Dualingとは？" enTitle="What is" />
        </div>
      </div>
      <div className="px-4 flex flex-col tracking-wider sm:max-w-3xl sm:mx-auto">
        <p className="m-auto text-lg">
          Dualingは、企業が興味をもった体育会学生にスカウトを送る
          <br />
          就活支援サービスです。
          <br />
          学生は体育会出身のアドバイザーとともに自己PR動画を作成し、
          <br />
          企業が気に入った学生に対してスカウトを送ります。
          <br />
          学生と企業がマッチングすると、選考が始まります。
        </p>
        <div className="border border-gray-300 mt-6">
          <Image src="/scout.png" alt="スカウト" width={770} height={300} />
        </div>
        <Link href="/signup">
          <a className="m-auto">
            <Button className="sm:w-60 sm:mx-auto sm:font-bold rounded-full shadow-md mt-4 mb-2">
              登録して利用開始する
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};
