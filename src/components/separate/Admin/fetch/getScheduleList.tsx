import { db } from "src/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export const getScheduleList = async () => {
  const schedulesRef = collection(db, "schedules");
  const schedulesQuery = query(schedulesRef, orderBy("date"));
  const snapShot = await getDocs(schedulesQuery);
  const schedules = snapShot.docs.map((s) => {
    return {
      studentId: s.id,
      studentName: s.get("username"),
      date: s.get("date"),
      staff: s.get("staff"),
    };
  });
  return schedules;
};
