import { setTimeout } from 'timers/promises';

export class Spinner {
  private spinnerChars = ['-', '\\', '|', '/'];
  private currentCharIndex = 0;
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    this.intervalId = setInterval(this.updateSpinner.bind(this), 100);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.clearSpinner();
    }
  }

  private updateSpinner() {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0); 
    process.stdout.write(`Downloading: ${this.spinnerChars[this.currentCharIndex]}`);
    this.currentCharIndex = (this.currentCharIndex + 1) % this.spinnerChars.length;
  }

  private clearSpinner() {
    process.stdout.clearLine(0); 
    process.stdout.cursorTo(0); 
  }
}

(async () => {
 
})();
