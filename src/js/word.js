import seedrandom from 'seedrandom';
import fs from 'fs';
import { Buffer } from 'buffer';

class DailyWord {
    constructor() {
        this.date = new Date()
        this.day = this.date.getDay();
        this.seed = parseInt(seedrandom(this.date.toISOString().slice(0, 10)).quick() * 100);
        this.dictionary = fs.readFileSync('src/data/dictionnaire.txt').toString().split('\n');
        this.production = fs.readFileSync('src/data/production.txt').toString().split('\n');
    }

    getDictionary() {
        return this.dictionary.filter(w => w.length == 5);
    }

    getProduction() {
        return this.production.filter(w => w.length == 5 && w.match(/[A-Z]/));
    }

    getRandomWord() {
        return this.getProduction()[this.seed % this.getProduction().length];
    }
}

window.dailyWord = new DailyWord();