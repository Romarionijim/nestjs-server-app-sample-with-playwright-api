class Logger {

  async log(message: string) {
    console.log(`${this.getTimeStamp()}: ${message}`);
  }

  async warn(message: string) {
    console.warn(`${this.getTimeStamp()}: ${message}`)
  }

  async error(message: string) {
    console.error(`${this.getTimeStamp()}: ${message}`)
  }

  private getTimeStamp() {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
}

export const logger = new Logger();