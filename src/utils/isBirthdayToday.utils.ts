export const isBirthdayToday = (birthdateStr: string): boolean => {
  const today = new Date();
  const birthdate = new Date(birthdateStr);

  const todayDate = today.getDate();
  const todayMonth = today.getMonth() + 1;

  const birthdateInLocalTz = new Date(
    birthdate.getFullYear(),
    birthdate.getMonth() + 1,
    birthdate.getDate() + 1
  );

  return (
    birthdateInLocalTz.getMonth() === todayMonth &&
    birthdateInLocalTz.getDate() === todayDate
  );
};
