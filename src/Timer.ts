export class Timer {
  interval: NodeJS.Timer;
  currentTimeMs = 0;
  currentTime = 0;
  timeIncrementor = () => {};
  onTimeUpdate = (newTimeMs: number) => {};
  constructor() {
    const that = this;
    this.interval = setInterval(() => {
      that.timeIncrementor();
      that.onTimeUpdate(that.currentTimeMs);
    }, 1);
  }

  start() {
    const that = this;
    this.timeIncrementor = () => {
      that.currentTimeMs += 1;
      that.currentTime = that.currentTimeMs / 1000;
    };
  }
  pause() {
    this.timeIncrementor = () => {};
  }
  reset() {
    this.pause();
    this.currentTime = 0;
  }
}
