import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('button[data-start]');
startBtn.style.backgroundColor = 'blue';
startBtn.style.color = 'white';
startBtn.style.padding = '11px';
startBtn.style.border = 'none';
startBtn.style.borderRadius = '4px';

const input = document.getElementById('datetime-picker');
input.style.backgroundColor = 'white';
input.style.color = 'blue';
input.style.padding = '10px';
input.style.border = '1px solid blue';
input.style.borderRadius = '4px';

const daysCounter = document.querySelector('span[data-days]');
daysCounter.style.color = 'red';

const hoursCounter = document.querySelector('span[data-hours]');
hoursCounter.style.color = 'gold';

const minutesCounter = document.querySelector('span[data-minutes]');
minutesCounter.style.color = 'blue';

const secondsCounter = document.querySelector('span[data-seconds]');
secondsCounter.style.color = 'green';

const fp = flatpickr(input, () => {
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      console.log(selectedDates[0]);
    },
  };
});

class Timer {
  constructor({ onTick }) {
    this.timerId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  start() {
    if (this.isActive) {
      return;
    }
    const targetTime = fp.selectedDates[0];

    if (targetTime < Date.now()) {
      return Notiflix.Notify.failure('Please choose a date in the future');
    }
    this.isActive = true;

    this.timerId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = targetTime - currentTime;
      const time = convertMs(deltaTime);
      console.log(time.days, ':', time.hours, ':', time.minutes, ':', time.seconds);
      this.onTick(time);
    }, 1000);

    if (targetTime === Date.now()) {
      clearInterval(this.timerId);
      return Notiflix.Notify.success('The Future Is Now (c) The Offspring');
    }
  }
}

const timer = new Timer({
  onTick: updateTime,
});

startBtn.addEventListener('click', () => {
  timer.start();
});

function updateTime({ days, hours, minutes, seconds }) {
  daysCounter.textContent = days;
  hoursCounter.textContent = hours;
  minutesCounter.textContent = minutes;
  secondsCounter.textContent = seconds;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
