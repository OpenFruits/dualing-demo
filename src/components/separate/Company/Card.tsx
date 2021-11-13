import { useContext, useEffect, useState, VFC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "src/firebase/Auth";
import { db, FirebaseTimestamp } from "src/firebase";
import { BookmarkIcon } from "@heroicons/react/outline";
import type { Student } from "src/constants/types";
import toast from "react-hot-toast";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

type Props = {
  student: Student;
};

export const Card: VFC<Props> = (props) => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [relation, setRelation] = useState("no");
  const [isBookmark, setIsBookmark] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // 学生と企業の関係性を判定する関数
  const checkRelation = async (condition: string) => {
    if (currentUser) {
      const ref = collection(db, "relations");
      const q = query(
        ref,
        where("companyId", "==", currentUser.companyId),
        where("studentId", "==", props.student.uid),
        where("condition", "==", condition)
      );
      const snapShot = await getDocs(q);
      snapShot.docs.length === 1 && setRelation(condition);
    }
  };

  const bookmarkRef = doc(
    db,
    "companies",
    currentUser?.companyId,
    "bookmarks",
    props.student.uid
  );

  // 保存されているかどうかチェック
  const checkBookmark = async () => {
    const docSnap = await getDoc(bookmarkRef);
    docSnap.data()?.studentId && setIsBookmark(true);
  };

  // サムネイルをセット
  const getThumbnail = async () => {
    const ref = doc(db, "users", props.student.uid);
    const docSnap = await getDoc(ref);
    setThumbnailUrl(docSnap.data()?.thumbnailUrl);
  };

  useEffect(() => {
    checkRelation("scout");
    checkRelation("matching");
    checkRelation("block");
    checkBookmark();
    getThumbnail();
  }, [currentUser]);

  const setUser = async () => {
    const usersRef = collection(db, "users");
    await setDoc(doc(usersRef), {
      firstName: "荒川",
      lastName: "テスト君",
    });
  };

  // 保存or保存の削除
  const bookmark = async () => {
    if (currentUser) {
      isBookmark
        ? await deleteDoc(bookmarkRef)
        : await setDoc(bookmarkRef, {
            studentId: props.student.uid,
            created_at: FirebaseTimestamp,
          });
    }
    setIsBookmark(!isBookmark);
    if (!isBookmark) toast.success("保存しました");
    if (isBookmark) toast.success("保存済みから削除しました");
  };

  return relation === "block" ? null : ( // block関係にある学生は非表示
    <div className="bg-white rounded overflow-hidden shadow-lg border">
      <div
        className="relative w-full h-52 bg-cover cursor-pointer"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
        onClick={() =>
          router.push(`/company/${currentUser?.companyId}/${props.student.uid}`)
        }
      >
        {relation === "scout" && (
          <div className="bg-green-500 text-white font-bold text-sm p-2 m-2 absolute top-0 right-0 rounded-full">
            スカウト中
          </div>
        )}
        {relation === "matching" && (
          <div className="bg-yellow-300 font-bold text-sm p-2 m-2 absolute top-0 right-0 rounded-full">
            マッチング
          </div>
        )}
        {relation === "matching" && (
          <div className="bg-gray-200 font-bold text-sm p-2 m-2 absolute top-0 left-0 rounded">
            {`${props.student.firstName} ${props.student.lastName}`}
          </div>
        )}
        <div className="border-b bg-white font-bold text-xl p-2 absolute bottom-0 right-0">
          {`${props.student.university} ${props.student.department}`}
        </div>
      </div>
      <div className="px-2 py-1 border-b">
        <span className="text-xs font-bold">会社選びの軸：</span>
        {props.student.important.map((item: string, index: number) => (
          <span
            key={`important_${index}`}
            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="px-2 py-1 border-b">
        <span className="text-xs font-bold">業界：</span>
        {props.student.industries.map((item: string, index: number) => (
          <span
            key={`industry_${index}`}
            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="px-2 py-1 border-b">
        <span className="text-xs font-bold">職種：</span>
        {props.student.occupations.map((item: string, index: number) => (
          <span
            key={`occupation_${index}`}
            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="px-2 py-1 border-b">
        <span className="text-xs font-bold">希望勤務地：</span>
        {props.student.locations.map((item: string, index: number) => (
          <span
            key={`occupation_${index}`}
            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="px-2 py-1 border-b">
        <span className="text-xs font-bold">強み：</span>
        {props.student.advantages.map((item: string, index: number) => (
          <span
            key={`advantage_${index}`}
            className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="flex justify-start p-2">
        <Link href={`/company/${currentUser?.companyId}/${props.student.uid}`}>
          <a className="mr-2">
            {relation === "no" && (
              <button className="m-auto lg:mx-0 text-xs lg:text-md font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer">
                詳細・スカウト画面へ
              </button>
            )}
            {relation === "scout" && (
              <button className="m-auto lg:mx-0 text-xs lg:text-md font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer">
                詳細画面へ
              </button>
            )}
            {relation === "matching" && (
              <button className="m-auto lg:mx-0 text-xs lg:text-md font-bold rounded tracking-wider text-center bg-blue-500 p-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer">
                詳細・チャット画面へ
              </button>
            )}
          </a>
        </Link>
        <button
          onClick={bookmark}
          className="flex m-auto lg:mx-0 text-xs lg:text-md font-bold rounded tracking-wider text-center bg-blue-500 pr-2 text-white hover:bg-blue-400 focus:outline-none cursor-pointer"
        >
          <BookmarkIcon className="h-6 w-6 m-1" />
          {isBookmark ? (
            <p className="py-2">保存済み</p>
          ) : (
            <p className="py-2">保存して後で見る</p>
          )}
        </button>
      </div>
    </div>
  );
};
