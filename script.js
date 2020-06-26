// https://random-word-api.herokuapp.com/word?number=1000

const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

const correctLetters = [];
const wrongLetters = [];

// Get random word from local txt file
let selectedWord = '';
async function getApiWord() {
    const res = await fetch('https://random-word-api.herokuapp.com/word?number=1000');
    return await res.json();
}

// Update wrong letters
// Display wrong letters
function updateWrongLettersEl(letter) {
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;
    // Display parts
    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;
        if (index < errors) {
            part.style.display = 'block'
        } else {
            part.style.display = 'none'
        }
    })
    // Check if lost
    if (wrongLetters.length === figureParts.length){
        finalMessage.innerHTML = `You Lost <span style=\'font-size:50px;\'>&#128533;</span><p>Correct word: <span class="correct-word">${selectedWord.toUpperCase()}</span></p> `
        popup.style.display = 'flex'
    }
}

// Show notification
function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000)
}

// Show hidden word
function displayWord() {
    wordEl.innerHTML = `
    ${selectedWord
        .split('')
        .map(letter => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ''}
        </span>
        `).join('')
    }`;
    const innerWord = wordEl.innerText.replace(/\n/g, '');
    if (innerWord === selectedWord && innerWord !== ''){
        finalMessage.innerHTML = `<span style=\'font-size:100px;\'>&#10024;</span> Congratulation! You Have Won! <p>&nbsp; &nbsp; &nbsp; Correct word: <span class="correct-word">${selectedWord.toUpperCase()}</span></p>`
        popup.style.display = 'flex';
    }
}

// Keydown event listener
window.addEventListener('keydown', e => {
    // console.log(e.keyCode)

    if (e.keyCode >= 65 && e.keyCode <= 90){
        const letter = e.key;
        if (selectedWord.includes(letter)){
            if (!correctLetters.includes(letter)){
                correctLetters.push(letter);
                // console.log(correctLetters)
                displayWord()
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)){
                wrongLetters.push(letter);
                updateWrongLettersEl(letter);
            } else {
                showNotification();
            }
        }
    }
})
// Restart game
playAgainBtn.addEventListener('click', () => {
    // Empty arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);
    getWords();
    // selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord()
    updateWrongLettersEl();
    popup.style.display = 'none'
})



function randomSelectedWord(arr) {
    const words = arr.flat();
    selectedWord = words[Math.floor(Math.random() * words.length)]
    displayWord()
    console.log(selectedWord)
}

// Local Storage -------------------------------------------------

// Store words in LS
function storeWordInLocalStorage(arr) {
    let words;
    if (localStorage.getItem('words') === null) {
        words = [];
        words.push(arr);
        localStorage.setItem('words', JSON.stringify(words));
        randomSelectedWord(arr)
    }
}

// Get words from LS
async function getWords() {
    let words;
    if (localStorage.getItem('words') === null) {
        await getApiWord()
            .then(arr => storeWordInLocalStorage(arr))
            .catch(err => console.log(err))
    } else {
        words = JSON.parse(localStorage.getItem('words'));
        randomSelectedWord(words)
        displayWord()
    }
}
getWords()






