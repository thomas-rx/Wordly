import seedrandom from 'seedrandom';
import fs from 'fs';
import { Buffer } from 'buffer';

class DailyWord {
    constructor() {
        this.date = new Date().toISOString().slice(0, 10);
        this.seed = parseInt(seedrandom(this.date).quick() * 10000);
        this.wordList = fs.readFileSync('src/data/mots.txt').toString().split('\n')
    }

    getWord() {
        var w = this.wordList[this.seed];
        let valid = false;
        while (w.length < 4 || w.length > 6 || !valid) {
            w = this.wordList[this.seed];
            if ((w.endsWith("IR") || w.endsWith("ER"))
                && (!w.endsWith("S") && !w.endsWith("Z") && !w.endsWith("ES") && !w.endsWith("EE") && !w.endsWith("ER"))
                && (!w.startsWith("K") && !w.startsWith("Z") && !w.startsWith("X"))
            ) {
                break;
            } else {
                this.seed += 50;
            }
        }
        console.log(this.seed);
        return w.toLowerCase();
    }

    getWordList() {
        return this.wordList;
    }
}

window.dailyWord = new DailyWord();