import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Header } from "src/layout/application/Header";
import { Chat } from "src/components/separate/Student/Chat";
import { auth, db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { Button } from "src/components/shared/Button";
import { Layout } from "src/components/shared/Layout";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Loading } from "src/layout/application/Loading";
import { NotFound } from "src/layout/application/NotFound";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Company } from "src/constants/types";

const CompanyId: NextPage = () => {
  const router = useRouter();
  const companyId = router.query.companyId;
  const studentId = router.query.studentId;
  const { currentUser } = useContext(AuthContext);
  const [company, setCompany] = useState<Company>();
  const [isMatch, setIsMatch] = useState(true);

  // マッチしているかチェック
  const checkMatching = async () => {
    if (companyId && studentId) {
      const ref = collection(db, "relations");
      const q = query(
        ref,
        where("companyId", "==", companyId),
        where("studentId", "==", studentId),
        where("condition", "==", "matching")
      );
      const snapShot = await getDocs(q);
      snapShot.docs.length ? setIsMatch(true) : setIsMatch(false);
    }
  };

  useEffect(() => {
    checkMatching();
  }, [companyId, studentId]);

  // 企業データを取得
  const getCompanyData = async () => {
    if (typeof companyId === "string" && isMatch) {
      const ref = doc(db, "companies", companyId);
      const snapShot = await getDoc(ref);
      snapShot.exists() &&
        setCompany({
          id: companyId,
          name: snapShot.data().name,
          email: snapShot.data().email,
          industry: snapShot.data().industry,
          occupations: snapShot.data().occupations,
          corporateUrl: snapShot.data().corporateUrl,
          recruitUrl: snapShot.data().recruitUrl,
        });
    }
  };

  useEffect(() => {
    getCompanyData();
  }, [companyId, isMatch]);

  // 未ログイン
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) router.push("/signin");
    });
  }, []);

  // ローディング
  if (!currentUser || isMatch === undefined) {
    return <Loading />;
  }

  // ログインユーザーとrouter.queryの学生が異なる
  if (currentUser.uid !== router.query.studentId) {
    return <NotFound />;
  }

  // router.queryの学生と企業がマッチしていない
  if (isMatch === false) return <NotFound />;

  return (
    <>
      <Header pageTitle="" href={`/${currentUser?.uid}`} />
      <Layout>
        {company && (
          <div className="lg:w-[800px] sm:w-[600px] w-full m-auto">
            <div className="sm:flex sm:justify-between sm:flex-row-reverse">
              <div className="flex justify-end mx-2 my-2">
                <Button
                  className="rounded sm:shadow-md h-10"
                  onClick={() => router.push(`/${currentUser?.uid}`)}
                >
                  戻る
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{company.name}</h1>
                <p className="text-sm font-normal">{company.industry}</p>
              </div>
            </div>
            <div className="border-t-2 py-2 my-2">
              <p>【求める職種】</p>
              <p>{company.occupations.join(", ")}</p>
              <div className="py-1.5" />
              <p>【企業サイト】</p>
              <div className="inline-block">
                <Link href={company.corporateUrl}>
                  <a className="flex items-center hover:text-gray-500">
                    <p className="mr-1">{company.corporateUrl}</p>
                    <ExternalLinkIcon className="h-5 w-5" />
                  </a>
                </Link>
              </div>
              <div className="py-1.5" />
              <p>【採用サイト】</p>
              <div className="inline-block">
                <Link href={company.recruitUrl}>
                  <a className="flex items-center hover:text-gray-500">
                    <p className="mr-1">{company.recruitUrl}</p>
                    <ExternalLinkIcon className="h-5 w-5" />
                  </a>
                </Link>
              </div>
            </div>
            <Chat companyId={companyId as string} companyName={company.name} />
          </div>
        )}
      </Layout>
    </>
  );
};

export default CompanyId;
