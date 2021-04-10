let stopTime = null; // это время в мс в будущем когда надо остановиться
let timer = null;
let currTab = null;
let currentTime = null;

/** 
 * Слушатель обработчик сообщений от content script и popup script
 */
chrome.runtime.onMessage.addListener(function(request) {
    if (request.type == "remove-tab") {
        chrome.tabs.remove(currTab, () => {
            console.info('tab was removed')
        });
    };

    if (request.type == "start-timer") {
        const {dataTosend} = request.options;
        const {hours,minutes,seconds,tabId} = dataTosend;
        if(Number(hours) === 0 && Number(minutes) === 0 && Number(seconds) === 0) {
            return
        }
        const currentTime = new Date().getTime();
        currTab = tabId;
        stopTime = currentTime + convertToMilliseconds(hours,minutes,seconds);
        if (timer === null) {
            timer = setInterval(tick,1000);
        }
    };
    if (request.type === 'reset-timer') {
        clearInterval(timer);
        timer = null;
    };
    if (request.type === 'stay') {
        clearInterval(timer);
        timer = null;
    };
    if(request.type === 'exist-timer') {
        if (timer !== null) {
            chrome.tabs.sendMessage(currTab,{message: 'time', timeString : currentTime});
        }
    }
});

/**
 * Функция переводит переданые пользователем значения в милисекунды
 * @returns возвращает количество будущее время в милисекундах
 */
 function convertToMilliseconds(hours,minutes,seconds) {
    const hoursInMilleseconds = Number(hours) * 60 * 60 * 1000;
    const minutesInMilleseconds = Number(minutes) * 60 * 1000;
    const secondsInMilleseconds = Number(seconds) * 1000;
    return hoursInMilleseconds + minutesInMilleseconds + secondsInMilleseconds;
};

/**
 * Функция таймера считает сколько времени осталось и показывает на экране
 * если время закончилось тогда покажем попап с выбором опций
 */
 function tick() {
    const now = Date.now();
    const distance = stopTime - now;
    if (distance < 0) {
        chrome.tabs.sendMessage(currTab,{message: 'finished'});
        clearInterval(timer);
        timer = null;
    } else {
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (hours < 10) {
            hours = '0' + hours;
        };
        if (minutes < 10) {
            minutes = '0' + minutes;
        };
        if (seconds < 10) {
            seconds = '0' + seconds;
        };

        currentTime = `${hours}:${minutes}:${seconds}`;
        chrome.tabs.sendMessage(currTab,{message: 'time', timeString : currentTime});
        console.log(currentTime)
    }
};