import { OptionType } from "src/constants/types";
import { FirebaseTimestamp } from "src/firebase";

export const filterValue = (array: OptionType[]) => {
  return array.map((item) => item.value);
};

export const arrayForSearch = (array: OptionType[]) => {
  return filterValue(array)
    .map((i) => [i])
    .reduce((obj, [key]) => Object.assign(obj, { [key]: true }), {});
};

export const FromTimeStampToDate = (date: typeof FirebaseTimestamp) => {
  const d = new Date(date.seconds * 1000);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = `0${d.getHours()}`.slice(-2);
  const min = `0${d.getMinutes()}`.slice(-2);

  return `${year}年${month}月${day}日 ${hour}:${min}`;
};

export const resetDate = (date: Date): Date => {
  const year_str = date.getFullYear();
  const month_str = 1 + date.getMonth();
  const day_str = date.getDate();
  const resetDate = new Date(`${year_str}/${month_str}/${day_str}`);
  return resetDate;
};
