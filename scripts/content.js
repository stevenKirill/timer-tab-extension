window.onload = function() {
    chrome.runtime.sendMessage({type: "exist-timer", options: {
        message: "Идет ли таймер"
    }});
};
chrome.runtime.onMessage.addListener(gotMessage);
let popUp = null;
const timerElement = createHelpBox();

/**
 * Функция получения сообщения от background script
 * @param {*} request ответ от background script
 */
function gotMessage(request) {
    const {message} = request;
    if (message === 'finished') {
        createPopUp()
        .then(() => {
            initListeners();
        })
    };
    if (message === 'time') {
        const {timeString} = request;
        timerElement.style.display = 'block';
        timerElement.innerText = timeString;
    };
};

/**
 * Функция создания модального окна с выбором
 */
function createPopUp() {
    const layout = `
    <div>
        <div class="modal_layout">
            <div class="timer_modal">
                <h2 class="timer_modal_timer">Your time is up. Do you wanna leave the tab?</h2>
                <div class="timer_buttons_wrapper">
                    <button class="leave_btn">Leave</button>
                    <button class="cancel_btn">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    `;
    return new Promise((resolve) => {
        popUp = document.createElement('div');
        const styles = createPopUpStyles();
        popUp.innerHTML = layout;
        document.body.appendChild(popUp);
        document.head.appendChild(styles);
        resolve('elements are in dom');
    })
};


/**
 * Функция создания инлайновых стилей, не знаю как создать отдельный css 
 * для контент скрипта
 * @returns возвращает строку со стилями
 */
function createPopUpStyles() {
    const styles = document.createElement('style');
    styles.innerHTML = `
    .body {
        color: black !important;
    }
    .modal_layout {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgb(0, 0, 0,0.7);
        z-index: 10000000000;
    }
    .timer_modal {
        width: 600px;
        height: 300px;
        margin: 10% auto;
        background-color: white;
        padding: 10px;
        font-size: 20px;
        z-index: 10000000001;
    }
    .timer_modal h2 {
        text-align: center;
        color: black !important;
    }
    .timer_buttons_wrapper {
        width: 200px;
        margin: 10px auto;
    }
    .timer_modal_timer {
        text-align: center;
        color: black;
    }
    .leave_btn, .cancel_btn {
        padding: 10px !important;
        font-size: 15px !important;
        border: 1px solid blue !important;
        cursor: pointer !important;
        color: black !important;
    }
    `;
    return styles;
};

function initListeners() {
    const leaveBtn = document.querySelector('.leave_btn');
    const cancelBtn = document.querySelector('.cancel_btn');
    leaveBtn.addEventListener('click',leave);
    cancelBtn.addEventListener('click',removePopUp);
};

/**
 * Функция закрытия вкладки
 */
function leave () {
    chrome.runtime.sendMessage({type: "remove-tab", options: {
        title: "Отправка номера вкладки",
        message: "Удалить вкладку"
    }});
};

/**
 * Функция удаления попапа из DOM
 */
function removePopUp() {
    if (popUp !== null) {
        popUp.remove();
        chrome.runtime.sendMessage({type: "stay", options: {
            title: "Остаться на вкладке",
            message: "Остаться на вкладке"
        }});
    };
    timerElement.style.display = 'none';
    timerElement.innerText = '';
};

/**
 * Функция создания окна со временем и кнопкой сброса времени
 */
function createHelpBox() {
    const block = document.createElement('div');
    block.classList.add('help_box_timer');
    block.style.display = 'none';
    createHelpBoxStyles();
    document.body.append(block);
    return block;
};

/**Стили для окошка со временем */
function createHelpBoxStyles() {
    const styles = document.createElement('style');
    styles.innerHTML = `
    .help_box_timer {
        width: 80px;
        height: 50px;
        text-align: center;
        padding: 5px;
        color: white;
        font-size: 17px;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 10000000;
        background-color: blue;
    }
    `;
    document.head.appendChild(styles);
};

