import { db } from "src/firebase";
import { collection, getDocs, query, where } from "@firebase/firestore";

export const getVimeoUserList = async () => {
  const usersRef = collection(db, "users");
  const usersQuery = query(
    usersRef,
    where("condition", "in", ["shooting", "waiting"])
  );
  const snapShot = await getDocs(usersQuery);
  console.log(usersRef);
  console.log(usersQuery);
  console.log(snapShot);
  const vimeoUsers = snapShot.docs.map((s) => {
    return {
      studentId: s.id,
      studentName: `${s.get("firstName")} ${s.get("lastName")}`,
      condition: s.get("condition"),
    };
  });
  return vimeoUsers;
};
