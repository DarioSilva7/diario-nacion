export class EmailService {
  static sendCongratulationsEmail(
    to: string,
    name: string,
    age: number
  ): string {
    return `Correo enviado a: ${to}.- Congratulations ${name} Today you turn ${age}! Best regards`;
  }
}
