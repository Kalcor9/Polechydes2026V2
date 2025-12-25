const gameRounds = [
    { word: "МАНДАРИН", question: "Самый новогодний фрукт, который чистят под бой курантов?" },
    { word: "СНЕГУРОЧКА", question: "Сказочная спутница Деда Мороза, слепленная из снега?" },
    { word: "ГИРЛЯНДА", question: "Длинная цепь из разноцветных лампочек на ёлке?" }
];

let players = [];
let currentPlayerIdx = 0;
let roundIdx = 0;
let pointsOnWheel = 0;
let canGuess = false;
let guessedLetters = [];

const input = document.getElementById("letter-input");
const status = document.getElementById("status-message");

// Запуск игры после выбора количества игроков
function initGame(num) {
    players = [];
    for (let i = 0; i < num; i++) {
        players.push({ id: i + 1, score: 0 });
    }
    
    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("main-game").style.display = "block";
    
    updateScorePanel();
    loadRound();
}

// Загрузка нового раунда
function loadRound() {
    guessedLetters = [];
    canGuess = false;
    const round = gameRounds[roundIdx];
    document.getElementById("question").innerText = `Раунд ${roundIdx + 1}: ${round.question}`;
    
    const wordDiv = document.getElementById("word-display");
    wordDiv.innerHTML = "";
    for (let i = 0; i < round.word.length; i++) {
        const div = document.createElement("div");
        div.className = "letter-slot";
        div.id = "s-" + i;
        wordDiv.appendChild(div);
    }
    updateTurnDisplay();
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
        div.innerText = `Игрок ${p.id}: ${p.score}`;
        panel.appendChild(div);
    });
}

// Вращение барабана
document.getElementById("wheel").addEventListener("click", () => {
    if (canGuess || roundIdx >= gameRounds.length) return;
    
    const rot = Math.floor(Math.random() * 360) + 1440; // 4 полных оборота + рандом
    document.getElementById("wheel").style.transform = `rotate(${rot}deg)`;
    status.innerText = "Барабан вращается...";
    
    setTimeout(() => {
        // Сектора: очки или 0 (Банкрот)
        const sectors = [100, 200, 300, 500, 700, 1000, 0];
        pointsOnWheel = sectors[Math.floor(Math.random() * sectors.length)];
        
        if (pointsOnWheel === 0) {
            status.innerText = `💥 Сектор Банкрот! Игрок ${players[currentPlayerIdx].id} теряет всё.`;
            players[currentPlayerIdx].score = 0;
            setTimeout(nextTurn, 1500);
        } else {
            status.innerText = `На барабане ${pointsOnWheel}! Назовите букву.`;
            canGuess = true;
            input.focus();
        }
    }, 2000);
});

// Проверка введенной буквы
function guessLetter() {
    const char = input.value.toUpperCase();
    input.value = "";
    if (!canGuess || !char) return;

    const word = gameRounds[roundIdx].word;
    
    if (guessedLetters.includes(char)) {
        status.innerText = "Эту букву уже открыли! Назовите другую.";
        return;
    }

    let found = false;
    for (let i = 0; i < word.length; i++) {
        if (word[i] === char) {
            document.getElementById("s-" + i).innerText = char;
            found = true;
        }
    }

    if (found) {
        guessedLetters.push(char);
        players[currentPlayerIdx].score += pointsOnWheel;
        status.innerText = "Есть такая буква! Крутите барабан снова.";
        updateScorePanel();
        checkWin();
    } else {
        status.innerText = "Нет такой буквы! Ход переходит дальше.";
        nextTurn();
    }
    canGuess = false;
}

// Переход хода
function nextTurn() {
    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
    canGuess = false;
    updateTurnDisplay();
    status.innerText = `Очередь Игрока ${players[currentPlayerIdx].id}. Крутите!`;
}

// Проверка победы в раунде
function checkWin() {
    const slots = document.getElementsByClassName("letter-slot");
    let allOpened = true;
    for (let slot of slots) { if (slot.innerText === "") allOpened = false; }

    if (allOpened) {
        roundIdx++;
        if (roundIdx < gameRounds.length) {
            status.innerHTML = "<strong>Слово отгадано! Подготовка к новому раунду...</strong>";
            setTimeout(loadRound, 3000);
        } else {
            const winner = [...players].sort((a,b) => b.score - a.score)[0];
            status.innerHTML = `<strong>КОНЕЦ ИГРЫ! Победил Игрок ${winner.id}! 🎉</strong>`;
            document.getElementById("wheel").style.display = "none";
            document.getElementById("restart-btn").style.display = "block";
        }
    }
}

// Поддержка нажатия Enter на клавиатуре
input.addEventListener("keypress", (e) => { if (e.key === "Enter") guessLetter(); });
