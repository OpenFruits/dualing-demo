import { VFC } from "react";
import Link from "next/link";
import { corporateURL, googleFormUrl } from "src/constants/externalLink";

export const Footer: VFC = () => {
  return (
    <footer className="bg-theme-dark text-white text-center py-3 font-bold w-full fixed bottom-0">
      <ul className="text-sm sm:flex sm:justify-center">
        <li className="mb-1 sm:mx-3">
          <Link href="/support/terms">
            <a>利用規約</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3">
          <Link href="/support/privacy-policy">
            <a>プライバシーポリシー</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3">
          <Link href={corporateURL}>
            <a>運営会社</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3">
          <Link href={googleFormUrl}>
            <a>お問い合わせ</a>
          </Link>
        </li>
      </ul>
      <small>©︎ 2021 Dualing</small>
    </footer>
  );
};
