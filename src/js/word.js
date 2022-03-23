import seedrandom from 'seedrandom';
import fs from 'fs';
import { Buffer } from 'buffer';

class DailyWord {
    constructor() {
        this.date = new Date().toISOString().slice(0, 10);
        this.seed = parseInt(seedrandom(this.date).quick() * 1000);
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
        const productionDictionary = this.getProduction();
        return productionDictionary[this.seed];
    }
}

window.dailyWord = new DailyWord();