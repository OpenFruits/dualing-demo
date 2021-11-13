import { NextPage } from "next";
import { Header } from "src/layout/application/Header";
import { TopMenu } from "src/components/separate/Admin/TopMenu";
import { UserFlow } from "src/components/separate/Admin/UserFlow";

const Admin: NextPage = () => {
  return (
    <>
      <Header pageTitle="管理者用ページ" href="/" />
      <TopMenu />
      <UserFlow />
    </>
  );
};

export default Admin;
