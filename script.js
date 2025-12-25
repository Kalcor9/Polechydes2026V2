const gameRounds = [
    {
        word: "КАРНАВАЛ",
        riddles: [
            "Зимний вид спорта, в котором игроки скользят по льду камнями и используют специальные щетки.",
            "Крупный тропический плод с жесткой кожей и зеленым пучком листьев наверху.",
            "Чувство, которое испытывает человек, когда он очень счастлив или весел.",
            "Время суток, когда на небе видна луна и зажигаются звезды.",
            "Вторая буква в слове, означающем волшебство и чародейство.",
            "Сильный снежный ветер, который кружит и заметает дороги.",
            "Буква, с которой начинается абсолютно любой алфавит.",
            "Замерзшая вода, свисающая с крыши в виде острой палочки."
        ]
    },
    {
        word: "ФЕЙЕРВЕРК",
        riddles: [
            "Легендарная птица, способная возрождаться из собственного пепла.",
            "Главное дерево, которое принято наряжать в конце декабря.",
            "Продукт из молока, который бывает питьевым или густым с добавлением фруктов.",
            "То, что кладут в тарелку, когда хотят утолить голод.",
            "Легкое волнение на воде или мелкие складки на ткани.",
            "Поток воздуха, который заставляет деревья качаться.",
            "Животное с полосатым хвостом, которое любит все полоскать в воде.",
            "Предмет одежды для рук, чтобы пальцы не замерзли зимой.",
            "Спортивный снаряд, через который прыгают на уроках физкультуры."
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
        document.getElementById("question").innerText = `Загадка для буквы ${letterIdx + 1}: ${round.riddles[letterIdx]}`;
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
            status.innerText = `На барабане ${pointsOnWheel}! Введите ответ на загадку.`;
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
            status.innerText = "Правильно! Крутите барабан для следующего вопроса.";
            showRiddle();
            updateScorePanel();
        } else {
            checkWin();
        }
    } else {
        status.innerText = "Неверно! Очередь переходит к следующему игроку.";
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
        status.innerHTML = "<strong>Слово открыто! Начинаем новый раунд...</strong>";
        setTimeout(loadRound, 3000);
    } else {
        const winner = [...players].sort((a,b) => b.score - a.score)[0];
        status.innerHTML = `<strong>Победил Игрок ${winner.id}! 🎉</strong>`;
        document.getElementById("wheel").style.display = "none";
        document.getElementById("restart-btn").style.display = "block";
    }
}

input.addEventListener("keypress", (e) => { if (e.key === "Enter") guessLetter(); });
