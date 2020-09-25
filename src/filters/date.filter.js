// eslint-disable-next-line no-unused-vars
export default function dateFilter(value, format = "date") {
  const options = {};
  if (format.includes("date")) {
    options.day = "2-digit";
    options.month = "long";
    options.year = "numeric";
  }
  if (format.includes("time")) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.second = "2-digit";
  }
  if (format.includes("shortDT")) {
    (options.month = "short"),
      (options.day = "numeric"),
      (options.hour = "numeric"),
      (options.minute = "numeric"),
      (options.weekday = "short"),
      (options.timezone = "UTC");
  }
  if(format.includes("string")){
    return `_${value.getMonth()+1}_${value.getFullYear()}`
  }
  return new Intl.DateTimeFormat("ru-RU", options).format(new Date(value));
}
