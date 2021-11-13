import React, { useState, useEffect, useCallback, useContext } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Header } from "src/layout/application/Header";
import cc from "classcat";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import { AuthContext } from "src/firebase/Auth";
import { InitInput } from "src/components/separate/Company/InitInput";
import { Inform } from "src/components/separate/Company/Inform";
import { Card } from "src/components/separate/Company/Card";
import { Footer } from "src/components/separate/Company/Footer";
import { advantageOptions } from "src/constants/options/advantage";
import { importantOptions } from "src/constants/options/important";
import { industryOptions } from "src/constants/options/industry";
import { locationOptions } from "src/constants/options/location";
import { occupationOptions } from "src/constants/options/occupation";
import { Loading } from "src/layout/application/Loading";
import { NotFound } from "src/layout/application/NotFound";
import { auth, db } from "src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { Student } from "src/constants/types";

const CompanyId: NextPage = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [result, setResult] = useState("全学生");
  const [showOption, setShowOption] = useState<string>("");
  const [isBookmark, setIsBookmark] = useState(false);
  const [isScout, setIsScout] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [important, setImportant] = useState(undefined);
  const [industries, setIndustries] = useState(undefined);
  const [occupations, setOccupations] = useState(undefined);
  const [locations, setLocations] = useState(undefined);
  const [advantages, setAdvantages] = useState(undefined);
  const [students, setStudents] = useState<Student[]>([]);
  const [optionUsers, setOptionUsers] = useState<string[]>([]);
  const [searchOptions, setSearchOptions] = useState([
    important,
    industries,
    occupations,
    locations,
    advantages,
  ]);
  const canSearch: boolean =
    important !== searchOptions[0] ||
    industries !== searchOptions[1] ||
    occupations !== searchOptions[2] ||
    locations !== searchOptions[3] ||
    advantages !== searchOptions[4];

  const OPTION_ITEMS = [
    { type: "bookmark", label: "保存済みの学生を表示" },
    { type: "scout", label: "スカウトした学生を表示" },
    { type: "match", label: "マッチした学生を表示" },
  ];

  const changeOption = (option: string) => {
    showOption === option ? setShowOption("") : setShowOption(option);
    if (option === "bookmark") setIsBookmark(!isBookmark);
    if (option === "scout") setIsScout(!isScout);
    if (option === "match") setIsMatch(!isMatch);
  };

  const inputImportant = useCallback(
    (e) => setImportant(e?.value),
    [setImportant]
  );

  const inputIndustries = useCallback(
    (e) => setIndustries(e?.value),
    [setIndustries]
  );

  const inputOccupations = useCallback(
    (e) => setOccupations(e?.value),
    [setOccupations]
  );

  const inputLocations = useCallback(
    (e) => setLocations(e?.value),
    [setLocations]
  );

  const inputAdvantages = useCallback(
    (e) => setAdvantages(e?.value),
    [setAdvantages]
  );

  const studentsRef = collection(db, "users");
  const studentsQuery = query(studentsRef, where("condition", "==", "normal"));

  // 初期値セット（normalの学生取得）
  const getStudentList = async () => {
    const snapShot = await getDocs(studentsQuery);
    const _students = snapShot.docs.map((s) => {
      return {
        uid: s.get("uid"),
        firstName: s.get("firstName"),
        lastName: s.get("lastName"),
        firstKana: s.get("firstKana"),
        lastKana: s.get("lastKana"),
        university: s.get("university"),
        department: s.get("department"),
        club: s.get("club"),
        important: s.get("important"),
        industries: s.get("industries"),
        occupations: s.get("occupations"),
        locations: s.get("locations"),
        advantages: s.get("advantages"),
        comment: s.get("comment"),
        vimeoUrl: s.get("vimeoUrl"),
        thumbnailUrl: s.get("thumbnailUrl"),
      };
    });
    setStudents(_students);
  };

  useEffect(() => {
    getStudentList();
  }, []);

  // 検索
  const search = async () => {
    setSearchOptions([
      important,
      industries,
      occupations,
      locations,
      advantages,
    ]);
    const importantResult = important ? `【${important}】` : "";
    const industriesResult = industries ? `【${industries}】` : "";
    const occupationsResult = occupations ? `【${occupations}】` : "";
    const locationsResult = locations ? `【${locations}】` : "";
    const advantagesResult = advantages ? `【${advantages}】` : "";
    const result = `${importantResult}${industriesResult}${occupationsResult}${locationsResult}${advantagesResult}`;
    setResult(result === "" ? "全学生" : result);

    const importantFilter = important
      ? query(
          studentsQuery,
          where(`importantForSearch.${important}`, "==", true)
        )
      : studentsQuery;
    (await getDocs(importantFilter)).docs.length === 0 && setStudents([]);

    const industriesFilter = industries
      ? query(
          importantFilter,
          where(`industriesForSearch.${industries}`, "==", true)
        )
      : importantFilter;
    (await getDocs(industriesFilter)).docs.length === 0 && setStudents([]);

    const occupationsFilter = occupations
      ? query(
          industriesFilter,
          where(`occupationsForSearch.${occupations}`, "==", true)
        )
      : industriesFilter;
    (await getDocs(occupationsFilter)).docs.length === 0 && setStudents([]);

    const locationsFilter = locations
      ? query(
          occupationsFilter,
          where(`locationsForSearch.${locations}`, "==", true)
        )
      : occupationsFilter;
    (await getDocs(locationsFilter)).docs.length === 0 && setStudents([]);

    const advantagesFilter = advantages
      ? query(
          locationsFilter,
          where(`advantagesForSearch.${advantages}`, "==", true)
        )
      : locationsFilter;
    (await getDocs(advantagesFilter)).docs.length === 0 && setStudents([]);

    // const q = query(advantagesFilter, orderBy("created_at", "desc"));
    const snapShot = await getDocs(advantagesFilter);
    snapShot.docs.map((s) => {
      const _students = snapShot.docs.map((doc) => {
        return {
          uid: doc.get("uid"),
          firstName: doc.get("firstName"),
          firstKana: doc.get("firstKana"),
          lastName: doc.get("lastName"),
          lastKana: doc.get("lastKana"),
          university: doc.get("university"),
          department: doc.get("department"),
          club: doc.get("club"),
          important: doc.get("important"),
          industries: doc.get("industries"),
          occupations: doc.get("occupations"),
          locations: doc.get("locations"),
          advantages: doc.get("advantages"),
          comment: doc.get("comment"),
          vimeoUrl: doc.get("vimeoUrl"),
          thumbnailUrl: doc.get("thumbnailUrl"),
        };
      });
      setStudents(_students);
    });
    setShowOption("");
  };

  // 表示オプション
  const getOptionUserIdList = async () => {
    const ID = currentUser?.companyId;
    if (showOption === "bookmark") {
      const ref = collection(db, "companies", ID, "bookmarks");
      const q = query(ref);
      const snapShot = await getDocs(q);
      snapShot.docs.length === 0 && setOptionUsers([""]);
      if (snapShot.docs.length > 0) {
        const students = snapShot.docs.map((doc) => {
          return doc.get("studentId");
        });
        setOptionUsers(students);
      }
    }
    if (showOption === "scout") {
      const ref = collection(db, "relations");
      const q = query(
        ref,
        where("companyId", "==", ID),
        where("condition", "==", "scout")
      );
      const snapShot = await getDocs(q);
      snapShot.docs.length === 0 && setOptionUsers([""]);
      if (snapShot.docs.length > 0) {
        const students = snapShot.docs.map((doc) => {
          return doc.get("studentId");
        });
        setOptionUsers(students);
      }
    }
    if (showOption === "match") {
      const ref = collection(db, "relations");
      const q = query(
        ref,
        where("companyId", "==", ID),
        where("condition", "==", "matching")
      );
      const snapShot = await getDocs(q);
      snapShot.docs.length === 0 && setOptionUsers([""]);
      if (snapShot.docs.length > 0) {
        const students = snapShot.docs.map((doc) => {
          return doc.get("studentId");
        });
        setOptionUsers(students);
      }
    }
    if (showOption === "") search();
  };

  useEffect(() => {
    // 検索条件の表示切り替え
    showOption === "bookmark" && setResult("【保存済みの学生】");
    showOption === "scout" && setResult("【スカウト済みの学生】");
    showOption === "match" && setResult("【マッチしている学生】");
    showOption === "" && setResult("全学生");
    getOptionUserIdList();
  }, [showOption]);

  const getOptionUserList = async () => {
    if (optionUsers?.length > 0 && showOption !== "") {
      const ref = collection(db, "users");
      const q = query(ref, where("uid", "in", optionUsers));
      const snapShot = await getDocs(q);
      const _students = snapShot.docs.map((doc) => {
        return {
          uid: doc.get("uid"),
          firstName: doc.get("firstName"),
          firstKana: doc.get("firstKana"),
          lastName: doc.get("lastName"),
          lastKana: doc.get("lastKana"),
          university: doc.get("university"),
          department: doc.get("department"),
          club: doc.get("club"),
          important: doc.get("important"),
          industries: doc.get("industries"),
          occupations: doc.get("occupations"),
          locations: doc.get("locations"),
          advantages: doc.get("advantages"),
          comment: doc.get("comment"),
          vimeoUrl: doc.get("vimeoUrl"),
          thumbnailUrl: doc.get("thumbnailUrl"),
        };
      });
      setStudents(_students);
    }
  };

  useEffect(() => {
    getOptionUserList();
  }, [optionUsers]);

  onAuthStateChanged(auth, (user) => {
    if (!user) router.push("/company/signin");
  });

  if (!currentUser) return <Loading />;

  if (currentUser.companyId !== router.query.companyId) {
    return <NotFound />;
  }

  if (currentUser.condition === "init") {
    return (
      <div className="bg-first-view bg-cover relative min-h-screen box-border">
        <Header
          href={`/company/${currentUser.companyId}`}
          pageTitle="企業アカウントページ"
        />
        <div className="pt-[calc((100vh-56px-44px-528px)/2)] m-auto sm:w-2/3">
          <InitInput />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header
        href={`/company/${currentUser?.companyId}`}
        pageTitle="学生一覧ページ"
      />
      <div className="flex">
        <aside className="fixed left-0 top-14 p-4 border-r h-screen w-72">
          <h2 className="text-2xl border-b pb-2 mb-2">{`${currentUser?.name} 様`}</h2>
          <Inform />
          <div className="border-b pb-2 mb-4">
            <div>
              <span className="text-gray-700">条件を指定して検索</span>
              <Select
                id={"important"}
                instanceId={"important"}
                inputId={"important"}
                isClearable
                placeholder="会社選びの軸を指定"
                options={importantOptions}
                onChange={inputImportant}
                className="mb-2"
              />
              <Select
                id={"industry"}
                instanceId={"industry"}
                inputId={"industry"}
                isClearable
                placeholder="興味のある業界を指定"
                options={industryOptions}
                onChange={inputIndustries}
                className="my-2"
              />
              <Select
                id={"occupation"}
                instanceId={"occupation"}
                inputId={"occupation"}
                isClearable
                placeholder="興味のある職種を指定"
                options={occupationOptions}
                onChange={inputOccupations}
                className="my-2"
              />
              <Select
                id={"locations"}
                instanceId={"locations"}
                inputId={"locations"}
                isClearable
                placeholder="希望勤務地を指定"
                options={locationOptions}
                onChange={inputLocations}
                className="my-2"
              />
              <Select
                id={"advantage"}
                instanceId={"advantage"}
                inputId={"advantage"}
                isClearable
                placeholder="強みを指定"
                options={advantageOptions}
                onChange={inputAdvantages}
                className="my-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                disabled={!canSearch}
                onClick={search}
                className={cc([
                  "text-white font-bold text-sm p-2 ml-2 rounded",
                  {
                    ["bg-theme hover:bg-theme-light focus:outline-none"]:
                      canSearch,
                    ["bg-theme-light cursor-default"]: !canSearch,
                  },
                ])}
              >
                検索
              </button>
            </div>
          </div>
          <div className="pb-2 mb-4">
            <p>表示オプション</p>
            {OPTION_ITEMS.map((option) => (
              <div
                key={option.type}
                className={cc([
                  "border p-2 mb-1",
                  {
                    ["bg-theme-light"]: showOption === option.type,
                  },
                ])}
              >
                <Switch.Group>
                  <Switch
                    checked={showOption === option.type}
                    onChange={() => changeOption(option.type)}
                    className={`${
                      showOption === option.type ? "bg-theme" : "bg-gray-500"
                    }
          relative translate-y-0.5 inline-flex flex-shrink-0 h-5 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      className={`${
                        showOption === option.type
                          ? "translate-x-3"
                          : "translate-x-0"
                      }
                    pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2">{option.label}</Switch.Label>
                </Switch.Group>
              </div>
            ))}
          </div>
        </aside>
        <main className="bg-theme-light bg-cover w-screen min-h-[calc(100vh-56px)] ml-72">
          <div className="pt-10 px-14 pb-20">
            <h1 className="text-3xl font-bold pb-4 border-b border-gray-500">
              学生一覧
            </h1>
            <p className="my-4 text-lg bg-gray-50 rounded p-2">{`検索条件：${result}`}</p>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {students.map((student) => (
                <Card key={student.uid} student={student} />
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default CompanyId;
