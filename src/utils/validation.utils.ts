export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidBirthdate = (birthdate: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(birthdate)) {
    return false;
  }
  const [anio, mes, dia] = birthdate.split('-').map(Number);
  const fechaObjeto = new Date(anio, mes - 1, dia);
  return (
    fechaObjeto.getFullYear() === anio &&
    fechaObjeto.getMonth() === mes - 1 &&
    fechaObjeto.getDate() === dia
  );
};
