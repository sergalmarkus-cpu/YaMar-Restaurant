export class IdService {
  static generateOrderNumber(
    establishmentId: number
  ) {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      now.getDate()
    ).padStart(2, '0');

    const time = String(
      now.getTime()
    ).slice(-6);

    return `YM-${establishmentId}-${year}${month}${day}-${time}`;
  }
}