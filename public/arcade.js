const arcadeBoard = document.querySelector("#arcadeBoard")
const width = 20
const startBoard = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
]

function createBoard() {
    startBoard.forEach((square) => {
        const tile = document.createElement('div')
        tile.classList.add('tile')
        arcadeBoard.append(tile)
    })
}