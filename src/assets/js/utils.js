const getNewDate =  (date) => {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return {year, month, day};
};

const getDate = (year, month, day) => {
  return new Date(year, month, day);
};

const formatDate = (date) => {
  date = Number(date);
  return date < 10? `0${date}`:date;
};
export {
  getNewDate,
  getDate,
  formatDate
}
