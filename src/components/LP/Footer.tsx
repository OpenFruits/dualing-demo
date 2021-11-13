import { VFC } from "react";
import Link from "next/link";
import { corporateURL, googleFormUrl } from "src/constants/externalLink";

export const Footer: VFC = () => {
  return (
    <div className="text-center font-bold my-6">
      <ul className="text-sm my-4 sm:flex sm:justify-center">
        <li className="mb-2 sm:mx-3">
          <Link href="/support/terms">
            <a>利用規約</a>
          </Link>
        </li>
        <li className="mb-2 sm:mx-3">
          <Link href="/support/privacy-policy">
            <a>プライバシーポリシー</a>
          </Link>
        </li>
        <li className="mb-2 sm:mx-3">
          <Link href={corporateURL}>
            <a target="_blank">運営会社</a>
          </Link>
        </li>
        <li className="mb-2 sm:mx-3">
          <Link href={googleFormUrl}>
            <a>お問い合わせ</a>
          </Link>
        </li>
      </ul>
      <small>©︎ 2021 Dualing</small>
    </div>
  );
};
