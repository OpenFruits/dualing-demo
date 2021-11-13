import React, { VFC, useState, useEffect, useContext } from "react";
import { Disclosure } from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/solid";
import { MatchingCompany } from "src/components/separate/Student/MatchingCompany";
import { AuthContext } from "src/firebase/Auth";
import { db } from "src/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Company } from "src/constants/types";

export const MatchingList: VFC = () => {
  const { currentUser } = useContext(AuthContext);
  const [companyIDs, setCompanyIDs] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const getCompanyIdList = async () => {
    const ref = collection(db, "relations");
    const q = query(
      ref,
      where("studentId", "==", currentUser?.uid),
      where("condition", "==", "matching")
    );
    const snapShot = await getDocs(q);
    const _companyIDs = snapShot.docs.map((s) => s.get("companyId"));
    setCompanyIDs(_companyIDs);
  };

  const getCompanyList = async () => {
    const ref = collection(db, "companies");
    const q = query(ref, where("companyId", "in", companyIDs));
    const snapShot = await getDocs(q);
    const _companies = snapShot.docs.map((s) => {
      return {
        name: s.get("name"),
        industry: s.get("industry"),
        occupations: s.get("occupations"),
        corporateUrl: s.get("corporateUrl"),
        recruitUrl: s.get("recruitUrl"),
        email: s.get("email"),
        id: s.id,
      };
    });
    setCompanies(_companies);
  };

  useEffect(() => {
    getCompanyIdList();
  }, [currentUser]);

  useEffect(() => {
    if (companyIDs.length === 0) setCompanies([]);
    if (companyIDs.length) {
      getCompanyList();
    }
  }, [companyIDs]);

  return (
    <div className="mx-1 my-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full p-3 text-lg font-bold text-theme-dark text-left bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <span>マッチング一覧</span>
              {!open && <PlusIcon className="h-6 w-6 text-theme-dark" />}
              {open && <MinusIcon className="h-6 w-6 text-theme-dark" />}
            </Disclosure.Button>
            <Disclosure.Panel className="px-1 py-2 text-sm text-theme-dark">
              {companies.length ? (
                companies.map((company) => (
                  <div key={company.id} className="border-t py-1">
                    <MatchingCompany company={company} />
                  </div>
                ))
              ) : (
                <div>マッチしている企業がありません</div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
