const FULL_DASH_ARRAY = 283;
const RESET_DASH_ARRAY = `-57 ${FULL_DASH_ARRAY}`;
const alphabet = "abcçdefghıijklmnoöprsştuüvyz".split("");

let answers = [];
let score = 0;
let randomLetter = [];
let level = 1;
//DOM elements
let timer = document.querySelector("#base-timer-path-remaining");
let timeLabel = document.getElementById("base-timer-label");

//Time related vars
const TIME_LIMIT = 5; //in seconds
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
        <div id="game-over-buttons">
            <button class="close">Yeni Oyun</button>  
            <button class="share">Paylaş</button>    
        </div>
    </div>
    `);

    $(".close").on("click", function () {
        $(".popup, .popup-content, .popup-overlay, .word").remove();
        score = 0;
        answers = [];
        level = 1;
        timeLabel.innerHTML = formatTime(TIME_LIMIT);
        $('#score > p').text(`Skor: ${score}`);
        setRandomLetter(alphabet);
    });

    $(".share").on("click", async function () {
        const text = `Harf Zamanı Sonuç
Level: ${level}
Son kelime: ${answers[answers.length - 1]}
Skor: ${score}
Seçili harf: ${randomLetters.join(" - ")}
https://emincankirmizi.github.io/harfle/
        `;

        window.mobileAndTabletCheck = function () {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };

        if ((navigator.share) && (window.mobileAndTabletCheck())) {

            navigator.share({
                title: 'Harf Zamanı Sonuç',
                text,
                url: "https://emincankirmizi.github.io/harfle"
            });

        } else {
            navigator.clipboard.writeText(text);
        }
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

        // if ($('#answer-input').val().length < 10) {
        $('#answer-input').val($('#answer-input').val() + e.target.innerHTML);
        // }
    });

    setRandomLetter(alphabet);
});

const sendAnswer = () => {
    let answer = $('#answer-input').val().toLowerCase();

    if (randomLetters.length === 1) {
        if (!answer.startsWith(randomLetters[0])) {
            toastr.error('Lütfen seçili kelime ile başlayın.');
            return;
        }
    } else {
        const isValid = randomLetters.every((randomLetter) => {
            return answer.includes(randomLetter)
        });

        if (!isValid) return false;
    }

    if (answer.length < 2) {
        toastr.error('Girdiğiniz kelime en az 2 harf içermelidir.')
        return;
    }

    if (answer.length < 2) {
        toastr.error('Girdiğiniz kelime en az 2 harf içermelidir.')
        return;
    }

    if (answer.length > 10) {
        toastr.error('Girdiğiniz kelime en fazla 10 harf içermelidir.')
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

            randomIndexes = setRandomLetter(answerArray);

            const answerLetterSquare = answerArray
                .map((letter, index) => {
                    if (randomIndexes.includes(index)) {
                        return `<div class="square" style='background-color:green'>${letter.toLowerCase()}</div>`;
                    }
                    return `<div class="square">${letter.toLowerCase()}</div>`;
                })
                .join("");

            $('#correct-answers').append(`
            <div class="word">
                ${answerLetterSquare}
            </div>`);


            if ($('#correct-answers').find('.word').length > 4) {
                $('#correct-answers').find('div').first().remove();
            }

            $('#answer-input').val("")

            score += 1;

            if (score === 14) {
                level = 2;
            }


            $('#score > p').text(`Skor: ${score}`);

            reset();
            startTimer();
        });
};

const setRandomLetter = (answerArray, randomIndex) => {
    randomLetters = [];
    let randomIndexes = [];

    for (let i = 1; i < level + 1; i++) {
        randomIndex = Math.floor(Math.random() * answerArray.length);
        randomLetter = answerArray[randomIndex];
        randomLetters.push(randomLetter);
        randomIndexes.push(randomIndex)
    }

    $('#selected-letter > p').text(`Seçilen Harf: ${randomLetters.join(" - ").toLowerCase()}`);

    return randomIndexes;
};
