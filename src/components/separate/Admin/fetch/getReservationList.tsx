import { db, FirebaseTimestamp } from "src/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export const getReservationList = async () => {
  const reservationsRef = collection(db, "reservations");
  const reservationsQuery = query(reservationsRef, orderBy("created_at"));
  const snapShot = await getDocs(reservationsQuery);
  const reservations = snapShot.docs.map((s) => {
    return {
      studentId: s.id,
      studentName: s.get("username"),
      firstChoice: s.get("firstChoice"),
      secondChoice: s.get("secondChoice"),
      thirdChoice: s.get("thirdChoice"),
      created_at: FirebaseTimestamp,
    };
  });
  return reservations;
};
