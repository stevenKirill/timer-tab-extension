// файл черновик

const hours = '1';
const minutes = '0';
const seconds = '0';



const currentTime = new Date().getTime();
const stopTime = currentTime + convertToMilliseconds();

function convertToMilliseconds() {
    const hoursInMilleseconds = Number(hours) * 60 * 60 * 1000;
    const minutesInMilleseconds = Number(minutes) * 60 * 1000;
    const secondsInMilleseconds = Number(seconds) * 1000;
    return hoursInMilleseconds + minutesInMilleseconds + secondsInMilleseconds;
};

/**
 * Функция вычисляет будущее время когда таймер будет остановлен
 * @param {number} ms Милисекунды 
 * @returns 
 */
function getFutureStopTime(ms) {
    const d = new Date(ms);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    return `${hours}:${minutes}:${seconds}`
};

var timer = setInterval(tick,1000);

function tick() {
    const now = Date.now();
    const distance = stopTime - now;
    if (distance < 0) {
        clearInterval(timer);
        console.log('over')
    } else {
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var time = `${hours}:${minutes}:${seconds}`;
        console.log(time)
    }
};