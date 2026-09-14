const maximumNumber = 10;

let drawnNumbers = [];
let secretNumber = generateRandomNumber();
let attempts = 0;
let minimumHint = 1;
let maximumHint = maximumNumber;
let gameFinished = false;

const guessForm = document.querySelector("#guess-form");
const guessInput = document.querySelector("#guess-input");
const guessButton = document.querySelector("#guess-button");
const restartButton = document.querySelector("#restart-button");
const messageBox = document.querySelector("#game-message p");
const attemptCount = document.querySelector("#attempt-count");
const minimumNumberDisplay = document.querySelector("#minimum-number");
const maximumNumberDisplay = document.querySelector("#maximum-number");
const clock = document.querySelector("#clock");

function generateRandomNumber() {
    if (drawnNumbers.length === maximumNumber) {
        drawnNumbers = [];
    }

    const chosenNumber = Math.floor(Math.random() * maximumNumber) + 1;

    if (drawnNumbers.includes(chosenNumber)) {
        return generateRandomNumber();
    }

    drawnNumbers.push(chosenNumber);
    return chosenNumber;
}

function speakMessage(message) {
    if (typeof responsiveVoice !== "undefined") {
        responsiveVoice.cancel();
        responsiveVoice.speak(message, "Brazilian Portuguese Female", { rate: 1.05 });
    }
}

function showMessage(message, shouldSpeak = true) {
    messageBox.innerHTML = message;

    if (shouldSpeak) {
        const spokenMessage = message
            .replace(/<br\s*\/?>/gi, ". ")
            .replace(/<[^>]*>/g, "")
            .replace(/[💗💜⭐✨🎉♡♥]/g, "");

        speakMessage(spokenMessage);
    }
}

function updateStats() {
    attemptCount.textContent = attempts;
    minimumNumberDisplay.textContent = minimumHint;
    maximumNumberDisplay.textContent = maximumHint;
}

function validateGuess(value) {
    if (value === "") {
        return "Digite um número antes de chutar! 💗";
    }

    const guess = Number(value);

    if (!Number.isInteger(guess) || guess < 1 || guess > maximumNumber) {
        return `Escolha um número inteiro entre 1 e ${maximumNumber}. ✨`;
    }

    return null;
}

function checkGuess() {
    if (gameFinished) {
        return;
    }

    const validationMessage = validateGuess(guessInput.value);

    if (validationMessage) {
        showMessage(validationMessage);
        guessInput.focus();
        return;
    }

    const guess = Number(guessInput.value);
    attempts += 1;

    if (guess === secretNumber) {
        gameFinished = true;

        const attemptWord = attempts === 1 ? "teste" : "testes";
        showMessage(`ACERTOU! 🎉💗<br>Você encontrou o número secreto em ${attempts} ${attemptWord}!`);

        guessButton.disabled = true;
        guessInput.disabled = true;
        restartButton.disabled = false;
    } else if (guess < secretNumber) {
        minimumHint = Math.max(minimumHint, guess + 1);
        showMessage("Quase! 💗<br>O número secreto é <strong>MAIOR</strong>.");
    } else {
        maximumHint = Math.min(maximumHint, guess - 1);
        showMessage("Quase! 💜<br>O número secreto é <strong>MENOR</strong>.");
    }

    updateStats();

    if (!gameFinished) {
        guessInput.value = "";
        guessInput.focus();
    }
}

function restartGame() {
    secretNumber = generateRandomNumber();
    attempts = 0;
    minimumHint = 1;
    maximumHint = maximumNumber;
    gameFinished = false;

    guessInput.disabled = false;
    guessButton.disabled = false;
    restartButton.disabled = true;
    guessInput.value = "";

    updateStats();
    showMessage("Pronta para começar?<br>Boa sorte! 💜", false);
    guessInput.focus();
}

function updateClock() {
    if (!clock) {
        return;
    }

    const now = new Date();

    clock.textContent = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

guessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkGuess();
});

restartButton.addEventListener("click", restartGame);

updateStats();
updateClock();
setInterval(updateClock, 1000);
