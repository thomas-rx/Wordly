import seedrandom from 'seedrandom';
import fs from 'fs';
import { Buffer } from 'buffer';

class DailyWord {
    constructor() {
        this.date = new Date().toISOString().slice(0, 10);
        this.seed = parseInt(seedrandom(this.date).quick() * 2000);
        this.wordList = fs.readFileSync('src/data/mots.txt').toString().split('\n')
    }

    getWord() {
        var w = this.wordList[this.seed];
        while (!w.endsWith("ER") || ( w.length >= 4 && w.length <= 6)) {
            this.seed += 2;
            w = this.wordList[this.seed];
        }
        return w.toLowerCase();
    }

    getWordList() {
        return this.wordList;
    }
}

window.dailyWord = new DailyWord();