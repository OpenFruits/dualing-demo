import { VFC, useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { Reservations } from "src/components/separate/Student/ReservationForm";
import { CheckCircleIcon } from "@heroicons/react/solid";

type Props = {
  reservations: Reservations;
  setReservations: React.Dispatch<React.SetStateAction<Reservations>>;
};

export const SelectTimeZone: VFC<Props> = ({
  reservations,
  setReservations,
}) => {
  const [value, setValue] = useState("午前");
  useEffect(() => {
    setReservations({ ...reservations, timeZone: value });
  }, [value]);

  return (
    <RadioGroup value={value} onChange={setValue} className="flex gap-4">
      <RadioGroup.Option value="午前">
        {({ checked }) => (
          <div className="flex cursor-pointer">
            {checked && <CheckCircleIcon className="h-6 w-6 text-blue-500" />}
            {!checked && <CheckCircleIcon className="h-6 w-6 text-gray-300" />}
            <span>午前</span>
          </div>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="午後">
        {({ checked }) => (
          <div className="flex cursor-pointer">
            {checked && <CheckCircleIcon className="h-6 w-6 text-blue-500" />}
            {!checked && <CheckCircleIcon className="h-6 w-6 text-gray-300" />}
            <span>午後</span>
          </div>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
};
