import { VFC, useState, useEffect } from "react";
import { Section } from "src/components/separate/Admin/Section";
import { ReservationItem } from "src/components/separate/Admin/ReservationItem";
import { ScheduleItem } from "src/components/separate/Admin/ScheduleItem";
import { VimeoUserItem } from "src/components/separate/Admin/VimeoUserItem";
import { getReservationList } from "src/components/separate/Admin/fetch/getReservationList";
import { getScheduleList } from "src/components/separate/Admin/fetch/getScheduleList";
import { getVimeoUserList } from "src/components/separate/Admin/fetch/getVimeoUserList";
import type { Reservation, Schedule, VimeoUser } from "src/constants/types";

export const UserFlow: VFC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vimeoUsers, setVimeoUsers] = useState<VimeoUser[]>([]);

  const fetchReservationList = async () => {
    const data = await getReservationList();
    setReservations(data);
  };

  const fetchScheduleList = async () => {
    const data = await getScheduleList();
    setSchedules(data);
  };

  const fetchVimeoUserList = async () => {
    const data = await getVimeoUserList();
    setVimeoUsers(data);
  };

  useEffect(() => {
    fetchReservationList();
    fetchScheduleList();
    fetchVimeoUserList();
  }, []);

  return (
    <div className="flex flex-wrap p-2">
      <Section title="ZOOM日程調整">
        {reservations.map((reservation) => (
          <ReservationItem
            key={reservation.studentId}
            reservation={reservation}
            setReservations={setReservations}
            setSchedules={setSchedules}
          />
        ))}
      </Section>
      <Section title="ZOOMスケジュール">
        {schedules.map((schedule) => (
          <ScheduleItem
            key={schedule.studentId}
            schedule={schedule}
            setSchedules={setSchedules}
            setVimeoUsers={setVimeoUsers}
          />
        ))}
      </Section>
      <Section title="動画処理中">
        {vimeoUsers.map((vimeoUser) => (
          <VimeoUserItem
            key={vimeoUser.studentId}
            vimeoUser={vimeoUser}
            setVimeoUsers={setVimeoUsers}
          />
        ))}
      </Section>
    </div>
  );
};
