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
        while (w.length != 5 || !w.endsWith("ER")) {
            this.seed += 1000;
            w = this.wordList[this.seed];
        }
        return w.toLowerCase();
    }        

    getWordList() {
        return this.wordList;
    }
}

window.dailyWord = new DailyWord();