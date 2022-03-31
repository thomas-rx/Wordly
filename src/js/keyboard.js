const allowedSymbols = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "backspace", "enter"];

window.addEventListener('load', (event) => {
    window.keys = [
        document.getElementById("a"),
        document.getElementById("b"),
        document.getElementById("c"),
        document.getElementById("d"),
        document.getElementById("e"),
        document.getElementById("f"),
        document.getElementById("g"),
        document.getElementById("h"),
        document.getElementById("i"),
        document.getElementById("j"),
        document.getElementById("k"),
        document.getElementById("l"),
        document.getElementById("m"),
        document.getElementById("n"),
        document.getElementById("o"),
        document.getElementById("p"),
        document.getElementById("q"),
        document.getElementById("r"),
        document.getElementById("s"),
        document.getElementById("t"),
        document.getElementById("u"),
        document.getElementById("v"),
        document.getElementById("w"),
        document.getElementById("x"),
        document.getElementById("y"),
        document.getElementById("z"),
        document.getElementById("backspace"),
        document.getElementById("enter"),
    ];

    for (let key of keys) {
        key.addEventListener("click", keyboardsEvent);
    }
});

function keyboardsEvent(e) {
    let key = null;
    if (e.type == "click") {
        key = e.target.id;
    } else if (e.type == "keydown") {
        key = e.key.toLowerCase();
        if (!allowedSymbols.includes(key)) {
            return;
        }
    }

    if (window.game.gameStatus == 0 && window.game.try <= window.game.maxTrys) {
        if (key == 'backspace') {
            window.game.deleteLastLetter();
        } else if (key == 'enter' && window.game.proposition.length == window.game.word.length) {
            window.game.verifyProposition();
        } else if (key != 'enter' && key != 'backspace') {
            window.game.addLetter(key);
        }
    }
}

document.addEventListener('keydown', keyboardsEvent);