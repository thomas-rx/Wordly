import ConfettiGenerator from 'confetti-js'
import Timer from 'easytimer.js'
import Cookies from 'js-cookie'

const animationDuration = 300

class Game {
    constructor(word, dictionary) {
        this.word = word
        this.dictionary = dictionary
        this.letters = word.split('')
        this.gameStatus = 3 // ? 0 = playing, 1 = won, 2 = lost, 3 = waiting for start
        this.maxTrys = 6
        this.try = 1
        this.cell = 1
        this.proposition = []
        this.historyEmoji = []
        this.historyText = []
        this.timer = new Timer()
        this.score = 0
    }

    getWordGrid() {
        let html = '<table>'
        let id = 1
        for (let x = 0; x < this.maxTrys; x++) {
            html += '<tr>'
            for (let i = 0; i < this.word.length; i++) {
                html += '<td class="test" id="' + id + '">'
                if (i == 0 && x == 0) {
                    html += this.letters[i].toUpperCase() + '</td>'
                    this.proposition.push(this.letters[i])
                } else {
                    html += '.</td>'
                }
                id++
            }
            html += '</tr>'
        }
        html += '</table>'
        return html
    }

    setCellValue(cell_id, letter) {
        if (cell_id > 0) {
            let e = document.getElementById(cell_id)
            e.innerHTML = letter.toUpperCase()
        }
    }

    removeCellValue(cell_id) {
        if (cell_id > 0) {
            let e = document.getElementById(cell_id)
            e.innerHTML = '.'
        }
    }

    setCellColor(cell_id, color) {
        if (cell_id > 0) {
            let e = document.getElementById(cell_id)
            e.animate(
                [
                    { transform: 'rotateX(0.5turn)' },
                    { transform: 'rotateX(1turn)' },
                ],
                { duration: animationDuration }
            )
            setTimeout(() => {
                e.style.backgroundColor = color
            }, animationDuration)
        }
    }

    addLetter(letter) {
        if (this.cell >= 0 && this.cell < this.word.length * this.try) {
            this.cell++
            this.setCellValue(this.cell, letter)
            this.proposition.push(letter.toUpperCase())
        }
    }

    deleteLastLetter() {
        if (this.cell > 1 && this.cell > this.getFirstCellID()) {
            this.removeCellValue(this.cell)
            this.cell--
            this.proposition.pop()
        }
    }

    getFirstCellID() {
        return this.word.length * this.try - this.word.length
    }

    setKeyOff(id) {
        let btn = document.getElementById(id.toLowerCase())
        btn.style.backgroundColor = '#5b5b5b'
    }

    setKeyOn(id) {
        let btn = document.getElementById(id.toLowerCase())
        btn.style.backgroundColor = '#ffffff'
    }

    setKeyboardOff() {
        document.getElementsByClassName('keyboard')[0].style.display = 'none'
    }

    setShareButtonOn() {
        document.querySelector('.header-left').style.display = 'block'
    }

    setShareButtonOff() {
        document.querySelector('.header-left').style.display = 'none'
    }

    setInfoText(text, final) {
        let e = document.getElementsByClassName('info')[0]
        e.innerHTML = text
        e.style.opacity = 1
        if (!final) {
            setTimeout(() => {
                e.style.opacity = 0
            }, 3000)
        }
    }

    autoCellColor(p) {
        for (let i = 0; i < this.word.length; i++) {
            let cellId = this.getFirstCellID() + i

            if (p[i] == '🟩') {
                // correct
                setTimeout(() => {
                    this.setCellColor(cellId + 1, '#228b22')
                }, animationDuration * i)
            } else if (p[i] == '🟥') {
                // letter not in the word
                setTimeout(() => {
                    this.setCellColor(cellId + 1, '#1D1D1D')
                }, animationDuration * i)

                this.setKeyOff(this.proposition[i])
            } else if (p[i] == '🟧') {
                // letter is in the word but not in the right position
                setTimeout(() => {
                    this.setCellColor(cellId + 1, '#e9692c')
                }, animationDuration * i)
            }
        }
    }

    verifyProposition() {
        // Refactor needed
        if (
            this.proposition.length == this.word.length &&
            this.dictionary.includes(this.proposition.join('').toUpperCase())
        ) {
            let propositionBuffer = this.proposition.slice()
            let wordBuffer = this.letters.slice()

            for (let t = 0; t < 3; t++) {
                for (let i = 0; i < this.word.length; i++) {
                    if (t == 0) {
                        if (propositionBuffer[i] == wordBuffer[i]) {
                            propositionBuffer[i] = '🟩'
                            wordBuffer[i] = null
                        }
                    } else if (t == 1) {
                        if (
                            (!this.word.includes(propositionBuffer[i]) ||
                                !wordBuffer.includes(propositionBuffer[i])) &&
                            propositionBuffer[i] != '🟩'
                        ) {
                            propositionBuffer[i] = '🟥'
                        }
                    } else if (t == 2) {
                        if (wordBuffer.includes(propositionBuffer[i])) {
                            propositionBuffer[i] = '🟧'
                            wordBuffer[i] = null
                        }
                    }
                }
            }

            this.autoCellColor(propositionBuffer)
            this.historyEmoji.push(propositionBuffer)
            this.historyText.push(
                propositionBuffer
                    .join('')
                    .replaceAll('🟩', 'V')
                    .replaceAll('🟥', 'R')
                    .replaceAll('🟧', 'O')
            )
            setTimeout(() => {
                
            this.checkWinOrLose()
            }, animationDuration * this.word.length)

        } else if (
            this.proposition.length == this.word.length &&
            !this.dictionary.includes(this.proposition.join('').toUpperCase())
        ) {
            this.setInfoText("Ce mot n'est pas dans notre dictionnaire.", false)
        }
    }

    checkWinOrLose() {
        if (this.proposition.join('') == this.word) {
            // game won
            this.stopTimer()
            this.score = this.getScore()
            this.setInfoText('Vous pouvez partager votre résultat !', true)
            this.setShareButtonOn()
            this.gameStatus = 1
            this.saveGame()
            return true
        } else if (
            this.try == this.maxTrys &&
            this.proposition.join('') != this.word
        ) {
            // game is lost
            this.stopTimer()
            this.setInfoText(`Vous avez perdu ! <br> Le mot était : ${this.word}`, true)
            this.setShareButtonOn()
            this.gameStatus = 2
        } else {
            // game is still playing
            this.newRound()
        }
        return false
    }

    newRound() {
        this.proposition = []
        this.try++
    }

    showConfetti() {
        var confettiSettings = {
            target: 'canvas-confetti',
            size: 1,
            start_from_edge: true,
            respawn: false,
            clock: 20,
            max: 150 / this.try,
            rotate: true,
        }
        var confetti = new ConfettiGenerator(confettiSettings)
        confetti.render()
    }

    shareResult() {
        let shareText
        if (this.gameStatus == 1) {
            shareText = `📚 Je viens de trouver le mot du jour en ${this.try} ${
                this.try > 1 ? 'essais' : 'essai'
            } ! \nScore: ${this.getScore()}/1000`
        } else if (this.gameStatus == 2) {
            shareText = `📚 Je n'ai pas réussi à trouver le mot du jour, pourras-tu y arriver ?`
        }
        const copyText =
            shareText +
            `\n\n${this.historyEmoji
                .join('\n')
                .replaceAll(
                    ',',
                    ''
                )}  \n\n Viens jouer toi aussi ! https://wordly.xrths.fr`
        navigator.clipboard.writeText(copyText)
    }

    startTimer() {
        this.timer.start()
    }

    getScore() {
        // Max time = 5 minutes
        const coefficient = 2
        const maxScore = 60 * 5 * this.maxTrys * coefficient
        const format = 1000 // Max score formated
        return parseInt(
            ((maxScore -
                this.timer.getTimeValues().seconds * (this.try * coefficient)) *
                format) /
                maxScore
        )
    }

    stopTimer() {
        this.timer.pause()
    }

    saveGame() {
        delete this.dictionary
        let c = JSON.stringify(this)
    }
}

window.addEventListener('load', (event) => {
    const word = window.dailyWord.getRandomWord()
    const dictionary = window.dailyWord.getDictionary()

    window.game = new Game(word, dictionary)

    document.getElementById('table').innerHTML = window.game.getWordGrid()
    document.getElementById('build_id').innerHTML =
        'Build:    ' + process.env.COMMIT_REF.substring(0, 7)
})
