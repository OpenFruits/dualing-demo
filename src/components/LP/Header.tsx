import { useState, useContext, VFC } from "react";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { MenuIcon } from "@heroicons/react/solid";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { AuthContext } from "src/firebase/Auth";
import { googleFormUrl } from "src/constants/externalLink";
import { Button } from "src/components/shared/Button";
import { Drawer } from "src/components/shared/Drawer";

export const Header: VFC = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const MENU = [
    { title: "Dualingとは", href: "#whatis", offset: 100 },
    { title: "Dualingの強み", href: "#merit", offset: 40 },
    { title: "サービスの流れ", href: "#flow", offset: 100 },
    { title: "よくある質問", href: "#faq", offset: 0 },
  ];

  return (
    <div className="fixed top-0 bg-white w-full h-14 z-30">
      <header className="px-2 md:pr-0 border-b">
        <div className="flex justify-between items-center">
          <Image
            src="/dualing_logo.webp"
            alt="logo"
            loading="eager"
            width={185}
            height={56}
            onClick={() => Router.push("/")}
            className="cursor-pointer"
          />
          {currentUser ? null : (
            <MenuIcon
              className="w-12 h-12 text-black cursor-pointer lg:invisible"
              onClick={onOpen}
            />
          )}
          <nav className="lg:flex font-sans font-bold hidden text-base">
            <ul className="flex items-center pr-3">
              {MENU.map((menu) => (
                <li
                  key={menu.title}
                  className="pr-3 text-gray-500 hover:text-black cursor-pointer"
                >
                  <AnchorLink offset={menu.offset} href={menu.href}>
                    {menu.title}
                  </AnchorLink>
                </li>
              ))}
              <li className="pr-3 text-gray-500 hover:text-black cursor-pointer">
                <Link href={googleFormUrl}>
                  <a>お問い合わせ</a>
                </Link>
              </li>
            </ul>
            <div className="w-48 border-l border-gray-200">
              <Link href="/signin">
                <a>
                  <Button
                    variant="solid-white"
                    className="w-full text-sm h-[28px] px-2 pt-1"
                  >
                    学生ログイン(新規登録)
                  </Button>
                </a>
              </Link>
              <Link href="/company/signin">
                <a>
                  <Button className="w-full text-sm h-[28px] px-2 pt-1">
                    採用担当者様はこちら
                  </Button>
                </a>
              </Link>
            </div>
          </nav>
        </div>
        <Drawer isOpen={isOpen} setIsOpen={setIsOpen} title="メニュー">
          {MENU.map((menu) => {
            return (
              <div
                key={menu.title}
                onClick={onClose}
                className="text-xl py-3 px-2 font-bold"
              >
                <AnchorLink
                  href={menu.href}
                  offset={menu.offset}
                >{`→ ${menu.title}`}</AnchorLink>
              </div>
            );
          })}
          <div className="flex flex-col space-y-4 my-3">
            <Link href="/signin">
              <a className="flex flex-col">
                <Button variant="solid-red" className="rounded">
                  ログイン・会員登録（学生）
                </Button>
              </a>
            </Link>
            <Link href={googleFormUrl}>
              <a className="flex flex-col">
                <Button variant="solid-gray" className="rounded">
                  お問い合わせはこちら
                </Button>
              </a>
            </Link>
            <Link href="/company/signin">
              <a className="flex flex-col">
                <Button className="rounded">採用担当企業の方はこちら</Button>
              </a>
            </Link>
          </div>
        </Drawer>
      </header>
    </div>
  );
};
