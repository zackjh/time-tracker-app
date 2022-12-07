// Takes a Date object and returns its "time" portion in the format "1.23PM"
function formatTimeForDisplay(dateObj) {
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes()
                        .toString()
                        .padStart(2, "0");
  const ampm = hours < 12 ? "AM" : "PM";

  hours = hours % 12;
  if (hours === 0) {
    hours = 12;
  }

  return `${hours}.${minutes}${ampm}`;
}

// Takes a Date object and returns its "date" portion in the format "Tuesday, 23 Oct"
function formatDateForDisplay(dateObj) {
  const today = new Date();

  // Create new Date object and set its date to yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateObj.toDateString() === today.toDateString()) {
    return "Today";
  } else if (dateObj.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day = dayNames[dateObj.getDay()]
  const date = dateObj.getDate();
  const month = monthNames[dateObj.getMonth()];

  return `${day}, ${date} ${month}`;
}

// Takes a Date object and returns its "date" portion in the format "23102022"
function formatDateForKey(dateObj) {
  const day = dateObj.getDate()
                      .toString()
                      .padStart(2, "0");
  const month = dateObj.getMonth()
                        .toString()
                        .padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}${month}${year}`;
}

// Takes a date key in the format DDMMYYYY and returns a Date object
function dateKeyToObj(dateKey) {
  const day = Number(dateKey.slice(0, 2));
  const month = Number(dateKey.slice(2, 4));
  const year = Number(dateKey.slice(4, 8));
  return new Date(year, month, day);
}

// Takes a duration in ms and returns it in the format "0:15:25"
function formatDurationForDisplay(durationInMs) {
let remainingMs = durationInMs;
const hours = Math.floor(durationInMs / 3600000);
remainingMs -= hours * 3600000;

const minutes = Math.floor(remainingMs / 60000)
                      .toString()
                      .padStart(2, "0");
remainingMs -= minutes * 60000;

const seconds = Math.floor(remainingMs / 1000)
                      .toString()
                      .padStart(2, "0");

return `${hours}:${minutes}:${seconds}`
}

// Takes a UTC date string and returns a local date string
// E.g. "2022-11-08T00:16:34.303Z" --> "2022-11-08T00:16"
function UTCStringToLocalString(dateStr) {
  const dateObj = new Date(dateStr);

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
  const day = dateObj.getDate()
                      .toString()
                      .padStart(2, "0");
  const hours = dateObj.getHours()
                        .toString()
                        .padStart(2, "0");
  const minutes = dateObj.getMinutes()
                          .toString()
                          .padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export {
  formatTimeForDisplay,
  formatDateForDisplay,
  formatDateForKey,
  dateKeyToObj,
  formatDurationForDisplay,
  UTCStringToLocalString,
};