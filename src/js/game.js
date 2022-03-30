import ConfettiGenerator from "confetti-js";
import dotenv from "dotenv";

const animationDuration = 300;

class Game {
    constructor(word, dictionary) {
        this.word = word;
        this.dictionary = dictionary;
        this.letters = word.split('');
        this.gameStatus = 0; // 0 = playing, 1 = won, 2 = lost
        this.maxTrys = 6;
        this.try = 1;
        this.cell = 1;
        this.proposition = [];
        this.historyEmoji = [];
        this.historyText = [];
        this.success = false;
    }

    getWordGrid() {
        let html = '<table>';
        let id = 1;
        for (let x = 0; x < this.maxTrys; x++) {
            html += '<tr>';
            for (let i = 0; i < this.word.length; i++) {
                html += '<td class="test" id="' + id + '">';
                if (i == 0 && x == 0) {
                    html += this.letters[i].toUpperCase() + '</td>';
                    this.proposition.push(this.letters[i]);
                } else {
                    html += '.</td>';
                }
                id++;
            }
            html += '</tr>';
        }
        html += '</table>';
        return html;
    }

    setCellValue(cell_id, letter) {
        if (cell_id > 0) {
            let e = document.getElementById(cell_id);
            e.innerHTML = letter.toUpperCase();
        }
    }

    removeCellValue(cell_id) {
        if (cell_id > 0) {
            let e = document.getElementById(cell_id);
            e.innerHTML = '.';
        }
    }

    setCellColor(cell_id, color,) {
        if (cell_id > 0) {
            let e = document.getElementById(cell_id);
            e.animate([
                { transform: 'rotateX(0.5turn)' },
                { transform: 'rotateX(1turn)' }
            ],
                { duration: animationDuration });
            setTimeout(() => {
                e.style.backgroundColor = color;
            }, animationDuration);

        }
    }

    add(letter) {
        if (this.cell >= 0 && this.cell < this.word.length * this.try) {
            this.cell++;
            this.setCellValue(this.cell, letter);
            this.proposition.push(letter.toUpperCase());
        }
    }

    delete() {
        if (this.cell > 1 && this.cell > this.getFirstCellID()) {
            this.removeCellValue(this.cell);
            this.cell--;
            this.proposition.pop();
        }
    }

    getFirstCellID() {
        return (this.word.length * this.try) - this.word.length;
    }

    setKeyOff(id) {
        let btn = document.getElementById(id.toLowerCase());
        btn.style.backgroundColor = '#5b5b5b';
    }

    setKeyOn(id) {
        let btn = document.getElementById(id.toLowerCase());
        btn.style.backgroundColor = '#ffffff';
    }

    setKeyboardOff() {
        document.getElementsByClassName('keyboard')[0].style.display = 'none';
    }

    setShareButtonOn() {
        document.querySelector('.header-left').style.display = 'block';
    }

    setInfoText(text, final) {
        let e = document.getElementsByClassName('info')[0];
        e.innerHTML = text;
        e.style.opacity = 1;
        if (!final) {
            setTimeout(() => {
                e.style.opacity = 0;
            }, 3000);
        }
    }

    verify() {
        if (this.proposition.length == this.word.length && this.dictionary.includes(this.proposition.join('').toUpperCase())) {
            var word = this.letters.slice()
            var proposition = this.proposition.slice();

            for (let i = 0; i < this.word.length; i++) {
                let id = this.getFirstCellID() + i;

                if (this.word[i] == this.proposition[i]) { // Verifying correct letters

                    setTimeout(() => {
                        this.setCellColor(id + 1, '#228b22');
                    }, animationDuration * i);

                    proposition[i] = '🟩';
                    word[i] = "🟩";

                } else if (this.word.includes(this.proposition[i])) { // Verifying wrong place letters {
                    continue;

                } else { // Incorrect letters
                    setTimeout(() => {
                        this.setCellColor(id + 1, '#1D1D1D');
                    }, animationDuration * i);
                    this.setKeyOff(this.proposition[i]);
                    proposition[i] = '🟥';

                }
            }

            for (let x in proposition) {

                if (proposition[x] != '🟩' && proposition[x] != '🟥' && proposition[x] != '🟧') {

                    if (word.includes(proposition[x]) && proposition.includes(proposition[x])) {
                        setTimeout(() => {
                            this.setCellColor(this.getFirstCellID() + parseInt(x) + 1, '#e9692c');
                        }, animationDuration * x);

                        proposition[parseInt(x)] = '🟧';

                    } else {
                        setTimeout(() => {
                            this.setCellColor(this.getFirstCellID() + parseInt(x) + 1, '#1D1D1D');
                        }, animationDuration * x);
                        proposition[parseInt(x)] = '🟥';
                    }
                }
            }

            this.historyEmoji.push(proposition);
            this.historyText.push(proposition.join('').replaceAll("🟩", 'V').replaceAll("🟥", 'R').replaceAll("🟧", 'O'));

            if (this.proposition.join('') == this.word) { // Win
                this.gameStatus = 1;

                setTimeout(() => {
                    this.setKeyboardOff();
                    this.showConfetti();
                    this.success = true;
                    this.setInfoText("Vous pouvez partager votre résultat ! 🧠", true);
                    this.setShareButtonOn();
                }, animationDuration * this.word.length);


            } else if (this.try == this.maxTrys) { // Lost
                this.setKeyboardOff();
                this.setShareButtonOn();


            } else {
                setTimeout(() => {
                    this.newRound();
                }, animationDuration * this.word.length);
            }

        } else {
            this.setInfoText("Ce mot n'est pas dans notre dictionnaire.", false);
        }
    }

    newRound() {
        this.proposition = [];
        this.try++;
    }

    showConfetti() {
        var confettiSettings = { target: 'canvas-confetti', size: 1, start_from_edge: true, respawn: false, clock: 20, max: 150 / this.try, rotate: true };
        var confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
    }

    shareResult() {
        let shareText;
        if (this.success) {
            shareText = `📚 Je viens de trouver le mot du jour en ${this.try} ${this.try > 1 ? "essais" : "essai"} !`;
        } else {
            shareText = `📚 Je suis nul, je n'ai pas trouvé le mot du jour.`;
        }
        const text = this.historyEmoji.join('\n').replaceAll(',', '');
        const copyText = shareText + '\n\n' + text + '\n\n' + 'Viens jouer sur https://wordly.xrths.fr';
        navigator.clipboard.writeText(copyText);
    }
}

window.addEventListener('load', (event) => {
    const word = window.dailyWord.getRandomWord();
    const dictionary = window.dailyWord.getDictionary();

    window.game = new Game(word, dictionary);

    document.getElementById("table").innerHTML = window.game.getWordGrid();
    document.getElementById("build_id").innerHTML = "Build:    " + process.env.COMMIT_REF.substring(0, 7);
});