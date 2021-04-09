const [hours, minutes, seconds] = document.querySelectorAll('select');
const startButton = document.querySelector('.start_button');
const resetBtn = document.querySelector('.reset_button');
const text = document.querySelector('.started_text');

startButton.addEventListener('click',startTimer)

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

let state = {
    hours: 0,
    minutes: 0,
    seconds: 0,
};

const updateState = (key,value) => {
    state = {
        ...state,
       [key]: value
    };
};

function createOptions(parent,items) {
    for(let item of items) {
        const option = document.createElement('option');
        if (item < 10 && item !== 0) {
            item =  '0' + item.toString();
        }
        option.innerText = item;
        option.classList.add('option_item')
        option.dataset.id = generateId()
        parent.appendChild(option);
    }
};

function initOptions() {
    createOptions(hours,HOURS);
    createOptions(minutes,MINUTES);
    createOptions(seconds,SECONDS);
};

[hours,minutes,seconds].forEach(item => item.addEventListener('input',getValue));

function getValue(e) {
    const key = e.target.name;
    let value = e.target.value;
    if (value[0] === '0' && value.length > 1) {
        value = trimValue(value)
    }
    updateState(key,value);
};

function trimValue(val) {
    return val.slice(1);
}

function startTimer() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        const activeTab = tabs[0];
        const dataTosend = {
            ...state,
            tabId: activeTab.id
        };
        chrome.runtime.sendMessage({type: "start-timer", options: {
            dataTosend,
            title: "Отправка номера вкладки",
            message: "Удалить вкладку из попап"
        }});
    });
    
    text.style.display = 'block';
    const allZeros = Object.values(state).every(val => Number(val) === 0);
    if ( allZeros ) {
        text.innerText = "Timer wasn't set, because all values are zeros"
    } else {
        text.innerText = 'Timer was set';
        resetBtn.style.display = 'block';
        resetBtn.addEventListener('click',resetTimer);
    }
};

function resetTimer() {
    chrome.runtime.sendMessage({type: "reset-timer", options: {
        message: "Сбросить таймер"
    }});
    [hours, minutes, seconds].forEach((select) => {
        select.value = "0";
        updateState(select.name, 0);
    });
    this.style.display = 'none';
    text.innerText = '';
    text.style.display = 'none';
    console.log(state)
}

initOptions();