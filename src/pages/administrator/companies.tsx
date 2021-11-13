import React, { VFC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "src/firebase";
import { Header } from "src/layout/application/Header";
import { Button } from "src/components/shared/Button";
import { Layout } from "src/components/shared/Layout";
import { Loading } from "src/layout/application/Loading";
import { FromTimeStampToDate } from "src/libs/util";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { AdminCompany } from "src/constants/types";

const Companies: VFC = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [showID, setShowID] = useState("");

  const getCompanyList = async () => {
    const ref = collection(db, "companies");
    const q = query(ref, orderBy("created_at", "desc"));
    const snapShot = await getDocs(q);
    const companies = snapShot.docs.map((doc) => {
      return {
        id: doc.id,
        email: doc.get("email"),
        password: doc.get("password"),
        name: doc.get("name"),
        industry: doc.get("industry"),
        occupations: doc.get("occupations"),
        corporateUrl: doc.get("corporateUrl"),
        recruitUrl: doc.get("recruitUrl"),
        condition: doc.get("condition"),
        created_at: doc.get("created_at"),
      };
    });
    setCompanies(companies);
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  if (companies.length === 0) return <Loading />;

  return (
    <>
      <Header pageTitle="管理者用ページ" href="/administrator" />
      <div className="m-auto sm:w-2/3">
        <Layout>
          <Button
            className="shadow-md"
            onClick={() => router.push("/administrator")}
          >
            管理者ページTOPに戻る
          </Button>
          <div className="py-4">
            <p className="text-xl font-bold py-2">企業一覧</p>
            <div className="w-full bg-gray-100 flex space-x-2 py-2">
              <p className="w-1/4">ID</p>
              <p className="w-2/4 pl-3">企業名</p>
              <p className="w-1/4">登録日時</p>
            </div>
            {companies?.map((company) => (
              <div key={company.id}>
                <div
                  onClick={() =>
                    setShowID(showID === company.id ? "" : company.id)
                  }
                  className={
                    showID === company.id
                      ? `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer bg-gray-200`
                      : `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer`
                  }
                >
                  <p className="text-xs truncate w-1/4">{company.id}</p>
                  <p
                    className={
                      showID === company.id
                        ? `w-2/4 pl-3 bg-gray-200`
                        : `w-2/4 pl-3`
                    }
                  >
                    {company.name}
                  </p>
                  <p className="text-sm">
                    {FromTimeStampToDate(company.created_at)}
                  </p>
                </div>
                {showID === company.id && (
                  <div className="space-y-2 p-2 border">
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">
                        メールアドレス
                      </p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {company.email}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">パスワード</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {company.password}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">企業サイト</p>
                      {company.condition === "normal" && (
                        <div className="inline-block">
                          <Link href={company.corporateUrl}>
                            <a className="flex items-center px-2 py-1 whitespace-pre-wrap hover:text-gray-500">
                              <p className="mr-1">{company.corporateUrl}</p>
                              <ExternalLinkIcon className="h-4 w-4" />
                            </a>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">採用サイト</p>
                      {company.condition === "normal" && (
                        <div className="inline-block">
                          <Link href={company.recruitUrl}>
                            <a className="flex items-center px-2 py-1 whitespace-pre-wrap hover:text-gray-500">
                              <p className="mr-1">{company.recruitUrl}</p>
                              <ExternalLinkIcon className="h-4 w-4" />
                            </a>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">業界</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {company.industry}
                      </p>
                    </div>
                    <div className="border border-gray-300 text-xs flex">
                      <p className="bg-gray-100 px-2 py-1 w-1/4">求める職種</p>
                      <p className="px-2 py-1 whitespace-pre-wrap">
                        {company.occupations?.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Layout>
      </div>
    </>
  );
};
export default Companies;
