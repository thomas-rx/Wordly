document.getElementById('share').addEventListener('click', function () {
    let myPromise = new Promise(function (myResolve, myReject) {
        window.game.shareResult()

        myResolve()
        myReject()
    })

    myPromise.then(
        function (value) {
            window.game.setInfoText('Votre résultat a été copié ! 📚', true)
        },
        function (error) {
            /* error */
        }
    )
})
