export class Logger {
  private static format(level: string) {
    return `[${level}] ${new Date().toISOString()}`;
  }

  static info(message: string, data?: unknown) {
    console.info(
      `${this.format('INFO')} - ${message}`,
      data ?? ''
    );
  }

  static warn(message: string, data?: unknown) {
    console.warn(
      `${this.format('WARN')} - ${message}`,
      data ?? ''
    );
  }

  static error(message: string, error?: unknown) {
    console.error(
      `${this.format('ERROR')} - ${message}`,
      error ?? ''
    );
  }

  static debug(message: string, data?: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        `${this.format('DEBUG')} - ${message}`,
        data ?? ''
      );
    }
  }
}