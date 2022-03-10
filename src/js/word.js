import seedrandom from 'seedrandom';
import fs from 'fs';
import { Buffer } from 'buffer';

var date = new Date().toISOString().slice(0, 10);
var dailySeed = parseInt(seedrandom(date).quick() * 2000);

var file= fs.readFileSync('src/data/mots.txt').toString().split('\n')
var word = file[dailySeed]

while (word.length != 5 || !word.endsWith("ER")) {
    dailySeed = dailySeed + 1000;
    word = file[dailySeed]
}

window.word = word;
window.wordList = file;

