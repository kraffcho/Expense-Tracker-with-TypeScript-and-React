import { format, isToday, isYesterday } from "date-fns";

export const formatDateUtil = (dateString: string): string => {
  const dateObj = new Date(dateString);
  if (isToday(dateObj)) {
    return "Today";
  } else if (isYesterday(dateObj)) {
    return "Yesterday";
  } else {
    return format(dateObj, "dd.MM.yyyy");
  }
};

export const getCurrentDateStringUtil = (): string => {
  return format(new Date(), "yyyy-MM-dd");
};