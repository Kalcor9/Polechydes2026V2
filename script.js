const gameRounds = [
    {
        word: "КАРНАВАЛ",
        riddles: [
            "Вид спорта на льду, где игроки пускают по льду тяжелые камни и трут поверхность щетками.",
            "Тропический фрукт с хохолком из листьев, напоминающий по форме большую шишку.",
            "Светлое, радостное чувство, которое охватывает людей при получении подарков.",
            "Время суток, когда наступает момент смены старого года на новый.",
            "Вторая буква в слове 'Магия'.",
            "Единственное животное в упряжке Деда Мороза, которое умеет летать согласно легендам.",
            "Буква, с которой начинается любой алфавит.",
            "Ледяная палочка, которая растет вниз головой."
        ]
    },
    {
        word: "ФЕЙЕРВЕРК",
        riddles: [
            "Мифическая птица, которая обладает способностью сжигать себя и заново возрождаться.",
            "Дерево, которое засыпают искусственным снегом и украшают шарами.",
            "Вещество, в которое превращается вода при температуре ниже нуля.",
            "Город в России, названный в честь императрицы Екатерины Первой.",
            "Сильное похолодание или очень морозная погода.",
            "Движение воздуха, которое зимой превращается в ледяной поток.",
            "Кислая лесная ягода (черная), название которой начинается на пятую букву алфавита.",
            "Имя самого известного северного оленя с красным носом.",
            "Гимнастический снаряд, через который прыгают ученики на физкультуре."
        ]
    },
    {
        word: "СТАЛАКТИТ",
        riddles: [
            "Самая известная сказочная девочка, сделанная из снега.",
            "Предмет мебели, на котором расставляют праздничное угощение.",
            "Буква, которая всегда стоит первой в слове 'Арбуз'.",
            "Месяц, в который приходит самый первый зимний мороз.",
            "Цитрус, который обязательно должен быть в новогоднем подарке.",
            "Твердое состояние воды.",
            "Тонкий слой ледяных кристаллов, образующийся на ветках деревьев в морозную ночь.",
            "Зеленая и колючая жительница леса.",
            "Музыкальный инструмент, в который громко дуют, чтобы издать звук."
        ]
    }
];

let players = [];
let currentPlayerIdx = 0;
let roundIdx = 0;
let letterIdx = 0;
let pointsOnWheel = 0;
let canGuess = false;

const input = document.getElementById("letter-input");
const status = document.getElementById("status-message");

function initGame(num) {
    players = [];
    for (let i = 0; i < num; i++) players.push({ id: i + 1, score: 0 });
    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("main-game").style.display = "block";
    updateScorePanel();
    loadRound();
}

function loadRound() {
    letterIdx = 0;
    canGuess = false;
    const round = gameRounds[roundIdx];
    const wordDiv = document.getElementById("word-display");
    wordDiv.innerHTML = "";
    for (let i = 0; i < round.word.length; i++) {
        const div = document.createElement("div");
        div.className = "letter-slot";
        div.id = "s-" + i;
        wordDiv.appendChild(div);
    }
    showRiddle();
    updateTurnDisplay();
}

function showRiddle() {
    const round = gameRounds[roundIdx];
    if (letterIdx < round.word.length) {
        document.getElementById("question").innerText = `Раунд ${roundIdx + 1}. Загадка: ${round.riddles[letterIdx]}`;
    }
}

function updateTurnDisplay() {
    document.getElementById("current-player-display").innerText = `Ход Игрока ${players[currentPlayerIdx].id}`;
    updateScorePanel();
}

function updateScorePanel() {
    const panel = document.getElementById("score-panel");
    panel.innerHTML = "";
    players.forEach((p, idx) => {
        const div = document.createElement("div");
        div.className = "player-score" + (idx === currentPlayerIdx ? " active-score" : "");
        div.innerText = `Игр. ${p.id}: ${p.score}`;
        panel.appendChild(div);
    });
}

document.getElementById("wheel").addEventListener("click", () => {
    if (canGuess || roundIdx >= gameRounds.length) return;
    const rot = Math.floor(Math.random() * 360) + 1440;
    document.getElementById("wheel").style.transform = `rotate(${rot}deg)`;
    status.innerText = "Барабан вращается...";
    
    setTimeout(() => {
        const sectors = [100, 200, 300, 500, 1000, 0];
        pointsOnWheel = sectors[Math.floor(Math.random() * sectors.length)];
        
        if (pointsOnWheel === 0) {
            status.innerText = "💥 Банкрот! Ход переходит дальше.";
            players[currentPlayerIdx].score = 0;
            setTimeout(nextTurn, 1500);
        } else {
            status.innerText = `На барабане ${pointsOnWheel}! Введите букву-ответ:`;
            canGuess = true;
            input.focus();
        }
    }, 2000);
});

function guessLetter() {
    const char = input.value.toUpperCase();
    input.value = "";
    if (!canGuess || !char) return;

    const correctLetter = gameRounds[roundIdx].word[letterIdx];

    if (char === correctLetter) {
        document.getElementById("s-" + letterIdx).innerText = char;
        players[currentPlayerIdx].score += pointsOnWheel;
        letterIdx++;
        canGuess = false;
        if (letterIdx < gameRounds[roundIdx].word.length) {
            status.innerText = "Верно! Крутите барабан для следующей буквы.";
            showRiddle();
            updateScorePanel();
        } else {
            checkWin();
        }
    } else {
        status.innerText = "Неправильно! Ход переходит к следующему.";
        nextTurn();
    }
}

function nextTurn() {
    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
    canGuess = false;
    updateTurnDisplay();
}

function checkWin() {
    roundIdx++;
    if (roundIdx < gameRounds.length) {
        status.innerHTML = "<strong>Слово открыто! Переходим к следующему раунду...</strong>";
        setTimeout(loadRound, 3000);
    } else {
        const winner = [...players].sort((a,b) => b.score - a.score)[0];
        status.innerHTML = `<strong>Победил Игрок ${winner.id}! 🎉</strong>`;
        document.getElementById("wheel").style.display = "none";
        document.getElementById("restart-btn").style.display = "block";
    }
}

input.addEventListener("keypress", (e) => { if (e.key === "Enter") guessLetter(); });
