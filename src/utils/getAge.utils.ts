/**
 * Calcula la edad a partir de una fecha de nacimiento (YYYY-MM-DD)
 * @param birthdateStr Fecha en formato YYYY-MM-DD
 * @returns Edad en años (entero)
 */
export function getAge(birthdateStr: string): number {
  const [year, month, day] = birthdateStr.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
