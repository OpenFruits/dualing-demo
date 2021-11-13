import { useReducer, useRef, useEffect, VFC } from "react";
import { Reservations } from "src/components/separate/Student/ReservationForm";

type japaneseCalendarDay = {
  name: string;
  shortName: string;
  weekdayNumber: number;
};

const japaneseDays: { [id: number]: japaneseCalendarDay } = {
  0: {
    name: "日曜日",
    shortName: "(日)",
    weekdayNumber: 6,
  },
  1: {
    name: "月曜日",
    shortName: "(月)",
    weekdayNumber: 0,
  },
  2: {
    name: "火曜日",
    shortName: "(火)",
    weekdayNumber: 1,
  },
  3: {
    name: "水曜日",
    shortName: "(水)",
    weekdayNumber: 2,
  },
  4: {
    name: "木曜日",
    shortName: "(木)",
    weekdayNumber: 3,
  },
  5: {
    name: "金曜日",
    shortName: "(金)",
    weekdayNumber: 4,
  },
  6: {
    name: "土曜日",
    shortName: "(土)",
    weekdayNumber: 5,
  },
};

const days = ["月", "火", "水", "木", "金", "土", "日"];

type DatePickeReducerAction =
  | { type: "SET_INIT_STATE" } //初期値
  | { type: "IS_OPEN"; isOpen: boolean } // カレンダー開閉
  | { type: "SET_DATE"; dayNumber: number } // 日時選択
  | { type: "ADD_MONTH" } // 次月表示
  | { type: "SUBTRACT_MONTH" }; // 前月表示

type DatePickerReducerState = {
  isOpen: boolean;
  date: string;
  displayDate: string;
  month: number;
  year: number;
  daysInMonthArr: number[];
  blankDaysArr: number[];
};

const initState: DatePickerReducerState = {
  isOpen: false,
  date: "",
  displayDate: "",
  month: null,
  year: null,
  daysInMonthArr: [],
  blankDaysArr: [],
};

const datePickerReducer: React.Reducer<
  DatePickerReducerState,
  DatePickeReducerAction
> = (state, action) => {
  switch (action.type) {
    case "SET_INIT_STATE": {
      const today = new Date();
      const month = today.getMonth();
      const year = today.getFullYear();

      const dayOfWeek = new Date(year, month).getDay(); // 月初の曜日
      const japaneseWeekday = japaneseDays[dayOfWeek].weekdayNumber;
      const displayDate = getJapaneseDate(today); // 20xx年0月0日() -> これを管理側に渡す
      const date = formatYearsMonthDay(today); // 20xx-00-00
      const daysInMonth = new Date(year, month, 0).getDate(); // 前月の最終日

      // Get the number (0-6) on which the actual month starts
      let blankDaysArr: number[] = [];
      for (let i = 1; i <= japaneseWeekday; i++) {
        blankDaysArr.push(i);
      }

      let daysInMonthArr: number[] = [];
      for (let i = 1; i < daysInMonth; i++) {
        daysInMonthArr.push(i);
      }

      return {
        ...state,
        date,
        displayDate,
        month,
        year,
        daysInMonthArr,
        blankDaysArr,
      };
    }

    case "IS_OPEN": {
      return {
        ...state,
        isOpen: action.isOpen,
      };
    }

    case "SET_DATE": {
      const dateToFormat = new Date(state.year, state.month, action.dayNumber);
      const date = formatYearsMonthDay(dateToFormat);
      const displayDate = getJapaneseDate(dateToFormat);

      return {
        ...state,
        date,
        displayDate,
        isOpen: false,
      };
    }

    case "ADD_MONTH": {
      let newYear: number;
      let newMonth: number;
      if (state.month === 11) {
        newMonth = 0;
        newYear = state.year + 1;
      } else {
        newMonth = state.month + 1;
        newYear = state.year;
      }

      const newMonthFirstWeekdayNumber = new Date(
        newYear,
        newMonth,
        1
      ).getDay();
      const japaneseFirstWeekdayNumber =
        japaneseDays[newMonthFirstWeekdayNumber].weekdayNumber;
      const daysInMonth = new Date(newYear, newMonth + 1, 0).getDate();

      let blankDaysArr = [];
      for (let i = 1; i <= japaneseFirstWeekdayNumber; i++) {
        blankDaysArr.push(i);
      }

      let daysInMonthArr = [];
      for (let i = 1; i <= daysInMonth; i++) {
        daysInMonthArr.push(i);
      }

      return {
        ...state,
        month: newMonth,
        year: newYear,
        daysInMonthArr,
        blankDaysArr,
      };
    }

    case "SUBTRACT_MONTH": {
      let newYear: number;
      let newMonth: number;
      if (state.month === 0) {
        newMonth = 11;
        newYear = state.year - 1;
      } else {
        newMonth = state.month - 1;
        newYear = state.year;
      }

      const newMonthFirstWeekdayNumber = new Date(
        newYear,
        newMonth,
        1
      ).getDay();
      const japaneseFirstWeekdayNumber =
        japaneseDays[newMonthFirstWeekdayNumber].weekdayNumber;
      const daysInMonth = new Date(newYear, newMonth + 1, 0).getDate();

      let blankDaysArr = [];
      for (let i = 1; i <= japaneseFirstWeekdayNumber; i++) {
        blankDaysArr.push(i);
      }

      let daysInMonthArr = [];
      for (let i = 1; i <= daysInMonth; i++) {
        daysInMonthArr.push(i);
      }

      return {
        ...state,
        year: newYear,
        month: newMonth,
        daysInMonthArr,
        blankDaysArr,
      };
    }

    default: {
      throw Error("Error un reducer");
    }
  }
};

export const getJapaneseDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayShortName = japaneseDays[date.getDay()].shortName;

  return `${year}年${month}月${day}日${dayShortName}`;
};

const formatYearsMonthDay = (date: Date): string => {
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2)
  );
};

type Props = {
  reservations: Reservations;
  setReservations: React.Dispatch<React.SetStateAction<Reservations>>;
  admin?: boolean;
};

export const DatePicker: VFC<Props> = ({
  reservations,
  setReservations,
  admin = false,
}) => {
  const [state, dispatch] = useReducer<
    React.Reducer<DatePickerReducerState, DatePickeReducerAction>
  >(datePickerReducer, initState);
  const displayDateRef = useRef<HTMLInputElement>();
  const daysDivRef = useRef<HTMLDivElement>();

  useEffect(() => {
    dispatch({ type: "SET_INIT_STATE" });
  }, []);

  const isToday = (dayNumber: number) => {
    const today = new Date();
    const day = new Date(state.year, state.month, dayNumber);

    return today.toDateString() === day.toDateString() ? true : false;
  };

  const isPast = (dayNumber: number) => {
    const today = new Date();
    const day = new Date(state.year, state.month, dayNumber);

    return today > day ? true : false;
  };

  const handleDatePickerKeydown = (event: React.KeyboardEvent) => {
    if (event.charCode === 0) {
      dispatch({ type: "IS_OPEN", isOpen: false });
    }
  };

  const toggleDisplayDateFocus = (): void => {
    const displayDate = displayDateRef.current;
    if (displayDate.classList.contains("shadow-outline")) {
      displayDate.classList.remove("shadow-outline");
      displayDate.blur();
    } else {
      displayDate.classList.add("shadow-outline");
      displayDate.focus();
    }

    const daysDiv = daysDivRef.current;
    daysDiv.focus();
  };

  useEffect(() => {
    setReservations({ ...reservations, date: state.displayDate });
  }, [state.displayDate]);

  return (
    <div className="flex">
      <div className="antialiased sans-serif">
        <div
          className={
            admin ? "container mx-auto pb-1" : "container mx-auto py-2"
          }
        >
          <div className="mb-0 w-64">
            <div className="relative">
              <input
                type="text"
                readOnly
                value={state.displayDate}
                ref={displayDateRef}
                onClick={() => {
                  dispatch({ type: "IS_OPEN", isOpen: !state.isOpen });
                  toggleDisplayDateFocus();
                }}
                onKeyDown={(event) => handleDatePickerKeydown(event)}
                onBlur={() => {
                  dispatch({ type: "IS_OPEN", isOpen: false });
                  toggleDisplayDateFocus();
                }}
                className="w-full pl-4 pr-10 py-3 leading-none rounded-lg border border-theme-dark shadow-sm text-gray-600 font-medium outline-none focus:outline-none focus:shadow-outline"
                placeholder="Select date"
              />

              <div className="absolute top-0 right-0 px-3 py-2">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div
                className={`focus:outline-none duration-200 mt-12 bg-white border rounded-lg shadow p-4 absolute top-0 left-0 ${
                  !state.isOpen
                    ? "invisible opacity-0"
                    : "visible opacity-100 z-50"
                }`}
                style={{ width: "17rem" }}
                ref={daysDivRef}
                tabIndex={-1}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-lg text-gray-600 font-normal">
                      {state.year}年 {state.month + 1}月
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      className={`transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full focus:shadow-outline focus:outline-none mr-1`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => dispatch({ type: "SUBTRACT_MONTH" })}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      className={`transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full focus:shadow-outline focus:outline-none`}
                      onClick={() => dispatch({ type: "ADD_MONTH" })}
                    >
                      <svg
                        className="h-6 w-6 text-gray-500 inline-flex"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap mb-3 -mx-1">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      style={{ width: "14.26%" }}
                      className="px-1"
                    >
                      <div className="text-gray-800 font-medium text-center text-xs">
                        {day}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap -mx-1">
                  {state.blankDaysArr.map((day) => (
                    <div
                      key={day}
                      style={{ width: "14.28%" }}
                      className="text-center border p-1 border-transparent text-sm"
                    />
                  ))}
                  {state.daysInMonthArr.map((dayNumber, index) => (
                    <div
                      key={index}
                      style={{ width: "14.28%" }}
                      className="px-1 mb-1"
                    >
                      <div
                        onClick={() => {
                          if (isToday(dayNumber) || !isPast(dayNumber)) {
                            dispatch({ type: "SET_DATE", dayNumber });
                            toggleDisplayDateFocus();
                          }
                        }}
                        onMouseDown={(event) => event.preventDefault()}
                        className={`cursor-pointer text-center text-sm leading-loose rounded-full transition ease-in-out duration-100 
                                                ${
                                                  isToday(dayNumber)
                                                    ? "bg-blue-500 text-white"
                                                    : isPast(dayNumber)
                                                    ? "text-gray-400 bg-gray-200 cursor-default"
                                                    : "text-gray-700 hover:bg-blue-200"
                                                }`}
                      >
                        {dayNumber}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
