// TODO : Système de sauvegarde
// TODO : Système de chargement
import ConfettiGenerator from "confetti-js";

const animationDuration = 1200;

class Game {
    constructor(word) {
        this.word = word;
        this.letters = word.split('');
        this.gameStatus = 0; // 0 = playing, 1 = won, 2 = lost

        this.maxTrys = 5;
        this.try = 1;

        this.proposition = [];

        this.gameState = [];
        this.cell = 1;
    }

    generateTable() {
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
            e.style.transform = 'rotateX(-180deg)';
            e.animate([
                { transform: 'rotateX(360deg)' }
            ],
                { duration: animationDuration });
            setTimeout(() => {
                e.style.transform = 'rotateX(360deg)';
                e.style.backgroundColor = color;
            }, animationDuration);
        }
    }

    add(letter) {
        if (this.cell >= 0 && this.cell < this.word.length * this.try) {
            this.cell++;
            this.setCellValue(this.cell, letter);
            this.proposition.push(letter.toLowerCase());
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

    lockKeyboardKey(id) {
        let btn = document.getElementById(id);
        btn.style.backgroundColor = '#5b5b5b';
    }

    unlockKeyboardKey(id) {
        let btn = document.getElementById(id);
        btn.style.backgroundColor = '#ffffff';
    }

    hideKeyboard() {
        document.getElementsByClassName('keyboard')[0].style.display = 'none';
    }

    verifyProposition() {
        if (this.proposition.length == this.word.length) {

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
                    this.lockKeyboardKey(this.proposition[i]);
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
                        proposition[parseInt(x)] = '🟥';
                    }
                }
            }

            this.gameState.push(proposition);
            console.log(proposition);

            if (this.proposition.join('') == this.word) {
                this.gameStatus = 1;

                setTimeout(() => {
                    this.hideKeyboard();
                    this.showConfetti();
                }, animationDuration * this.word.length);

                this.saveGame()

            } else if (this.try == this.maxTrys) {
                this.hideKeyboard();

            } else {
                setTimeout(() => {
                    this.newRound();
                }, 1500 * this.word.length);
            }
        }
    }

    newRound() {
        this.proposition = [];
        this.try++;
    }

    saveGame() { // TODO : Finaliser
        let result = '';
        for (let x in this.gameState) {
            result += this.gameState[x].join('').replace(/,/g, '');
            result += '\n';
        }

        for (let x in this.gameState) {
            switch (x) {
                case '🟩':
                    result = result.replace('🟩', '1');
                    break;
                case '🟥':
                    result = result.replace('🟥', '2');
                    break;
                case '🟧':
                    result = result.replace('🟧', '3');
                    break;
            }
        }

        console.log(result);
        let cookie = `try=${this.try} gameStatus=${this.gameStatus} gameState=${result}`;
        document.cookie = cookie;
        console.log('🎉 Game saved !');
        console.log(document.cookie);
    }

    getSaveGame() {
        return document.cookie;
    }

    restoreGame() { // TODO : Finaliser
        let cookie = this.getSaveGame();
        let cookie_array = cookie.split(' ');
        console.log("Restoring game");
        console.log(cookie);

        if (cookie_array[0].includes('try')) {
            this.try = parseInt(cookie_array[0].split('=')[1]);
        }

        if (cookie_array[1].includes('gameStatus')) {
            this.gameStatus = parseInt(cookie_array[1].split('=')[1]);
            if (this.gameStatus == 1) {
                document.getElementsByClassName('keyboard')[0].style.display = 'none';
                this.showConfetti();
            }
        }

    }

    showConfetti() {
        var confettiSettings = { target: 'canvas-confetti', size: 2, start_from_edge: true, respawn: true, clock: 20, max: 150 / this.try };
        var confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
    }
}

window.addEventListener('load', (event) => {
    window.game = new Game(window.word);
    document.getElementById("table").innerHTML = window.game.generateTable();
    console.log(window.game);
    //if (window.game.getSaveGame() == '') {
    //    window.game.restoreGame();
    //}
});
