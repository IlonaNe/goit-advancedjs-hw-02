//Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const timer = {
  userSelectedDate: null,
  intervalId: null,

  refs: {
    startBtn: document.querySelector("[data-start]"),
    dateInput: document.querySelector("#datetime-picker"),
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
  },

  init() {
    this.refs.startBtn.disabled = true;

    this.initFlatpickr();
    this.refs.startBtn.addEventListener("click", () => this.start());
  },

  initFlatpickr() {
    const options = {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,

      onClose: (selectedDates) => {
        const date = selectedDates[0];
        const now = Date.now();

        if (!date || date.getTime() <= now) {
          this.refs.startBtn.disabled = true;

          iziToast.error({
            title: "Error",
              message: "Please choose a date in the future",
            position: 'topRight',
          });

          return;
        }

        this.userSelectedDate = date;
        this.refs.startBtn.disabled = false;
      },
    };

    flatpickr(this.refs.dateInput, options);
  },

  start() {
    this.refs.startBtn.disabled = true;
    this.refs.dateInput.disabled = true;

    this.updateUI();

    this.intervalId = setInterval(() => {
      const diff = this.userSelectedDate - Date.now();

      if (diff <= 0) {
        this.stop();
        this.setTime(0, 0, 0, 0);
        return;
      }

      const time = this.convertMs(diff);
      this.setTime(time.days, time.hours, time.minutes, time.seconds);
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;

    this.refs.dateInput.disabled = false;
    this.refs.startBtn.disabled = true;
  },

  setTime(d, h, m, s) {
    this.refs.days.textContent = this.pad(d);
    this.refs.hours.textContent = this.pad(h);
    this.refs.minutes.textContent = this.pad(m);
    this.refs.seconds.textContent = this.pad(s);
  },

  updateUI() {
    const diff = this.userSelectedDate - Date.now();
    const time = this.convertMs(diff);
    this.setTime(time.days, time.hours, time.minutes, time.seconds);
  },

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },

  pad(value) {
    return String(value).padStart(2, "0");
  },
};

timer.init();