const FULL_DASH_ARRAY = 283;
const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;
const alphabet = "abcçdefghıijklmnoöprsştuüvyz".split("");

let answers = [];
let score = 0;
let randomLetter;
//DOM elements
let timer = document.querySelector("#base-timer-path-remaining");
let timeLabel = document.getElementById("base-timer-label");

//Time related vars
const TIME_LIMIT = 3; //in seconds
let timePassed = 1;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

function reset() {
    clearInterval(timerInterval);
    resetVars();
    timer.setAttribute("stroke-dasharray", RESET_DASH_ARRAY);
}

function start(withReset = false) {
    if (withReset) {
        resetVars();
    }
    startTimer();
}

function stop() {
    clearInterval(timerInterval);
}

const countDown = () => {
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    timeLabel.innerHTML = formatTime(timeLeft);
    setCircleDasharray();


    if (timeLeft === 0) {
        timeIsUp();
    }
}

function startTimer() {
    countDown();
    timerInterval = setInterval(() => {
        countDown();
    }, 1000);
}

window.addEventListener("load", () => {
    timeLabel.innerHTML = formatTime(TIME_LIMIT);
});

function timeIsUp() {
    clearInterval(timerInterval);

    $("#answer-input").val("");
    $("#answer-input").blur();

    $('#main').append(`
    <div class="popup-overlay">
    </div>

    <div class="popup-content">
        <h2>Oyun Bitti!</h2>
        <p>Skorunuz -> ${score}</p>
        <button class="close">Yeni Oyun</button>    
    </div>
    `);

    $(".close").on("click", function () {
        $(".popup, .popup-content, .popup-overlay, .word").remove();
        score = 0;
        answers = [];
        timeLabel.innerHTML = formatTime(TIME_LIMIT);
        $('#score > h2').text(`Skor: ${score}`);
        setRandomLetter(alphabet);
    });
}

function resetVars() {
    timePassed = -1;
    timeLeft = TIME_LIMIT;

    timeLabel.innerHTML = formatTime(TIME_LIMIT);
}

function formatTime(time) {
    return `${time}s`;
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;

    timer.setAttribute("stroke-dasharray", circleDasharray);
}

$(function () {
    $(document).on(`focus`, `input`, function () {
        myEl = $(this);
        setTimeout(function () {
            myEl.attr(`inputmode`, ``);
        }, 1);
    });

    $(document).on(`blur`, `input`, function () {
        $(this).attr(`inputmode`, `none`);
    });

    $('#answer-input').keypress((e) => {
        const key = e.which;

        if (key == 13) {
            sendAnswer();
        }
    });

    $("#answer-button").click((e) => {
        sendAnswer();
    });

    $(".keyboard-button").click((e) => {

        if (e.target.innerHTML === '⤾') {
            return sendAnswer();
        }

        if (e.target.innerHTML === '⟵') {
            return $('#answer-input').val($('#answer-input').val().slice(0, -1));
        }

        if ($('#answer-input').val().length < 6) {
            $('#answer-input').val($('#answer-input').val() + e.target.innerHTML);
        }
    });

    setRandomLetter(alphabet);
});

const sendAnswer = () => {
    let answer = $('#answer-input').val().toLowerCase();

    if (!answer.startsWith(randomLetter)) {
        toastr.error('Lütfen seçili kelime ile başlayın.');
        return;
    }

    if (answer.length < 2) {
        toastr.error('Girdiğiniz kelime en az 2 harf içermelidir.')
        return;
    }

    if (answer.length < 2) {
        toastr.error('Girdiğiniz kelime en az 2 harf içermelidir.')
        return;
    }

    if (answer.length > 6) {
        toastr.error('Girdiğiniz kelime en fazla 6 harf içermelidir.')
        return;
    }

    if (answers.includes(answer)) {
        toastr.error('Bu kelimeyi daha önce girdiniz.')
        return;
    }

    if (!answer) {
        toastr.error('Lütfen bir kelime giriniz.')
        return;
    }

    fetch(`https://sozluk.gov.tr/gts?ara=${answer}`)
        .then((response) => {
            return response.json();
        })
        .then((respJson) => {
            if (respJson?.error) {
                toastr.error('Girdiğiniz kelime bulunamadı.')
                return;
            }

            answer = answer.replace("ğ", "g")

            answers.push(answer);

            const answerArray = answer.split("");

            randomIndex = setRandomLetter(answerArray);

            const answerLetterSquare = answerArray
                .map((letter, index) => {
                    if (index === randomIndex) {
                        return `<div class="square" style='background-color:green'>${letter.toLowerCase()}</div>`;
                    }
                    return `<div class="square">${letter.toLowerCase()}</div>`;
                })
                .join("");

            $('#correct-answers').append(`
            <div class="word">
                ${answerLetterSquare}
            </div>`);


            if ($('#correct-answers').find('.word').length > 3) {
                $('#correct-answers').find('div').first().remove();
            }

            $('#answer-input').val("")

            score += 1;
            $('#score > h2').text(`Skor: ${score}`);

            reset();
            start();
        });
};

const setRandomLetter = (answerArray, randomIndex) => {
    randomIndex = Math.floor(Math.random() * answerArray.length);
    randomLetter = answerArray[randomIndex];

    $('#selected-letter > h2').text(`Seçilen Harf: ${randomLetter.toLowerCase()}`);
    return randomIndex;
};
