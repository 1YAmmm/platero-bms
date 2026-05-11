export const calculateAge = (birthdate) => {
  if (!birthdate) return 0;

  const today = new Date();
  const birth = new Date(birthdate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};
