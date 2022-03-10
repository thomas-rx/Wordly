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

    console.log(keys)
    for (let key of keys) {
        key.addEventListener("click", function () {
            // console.log("⌨️ Key pressed: " + key.id);
            if (window.game.gameStatus == 0 && window.game.try <= window.game.maxTrys) {
                if (key.id == 'backspace') {
                    window.game.delete();
                } else if (key.id == 'enter' && window.game.proposition.length == window.game.word.length) {
                    window.game.verifyProposition();
                } else if (key.id != 'enter' && key.id != 'backspace') {
                    window.game.add(key.id);
                }
            }
        });
    }
});