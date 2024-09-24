function createGame(obj1, obj2) {
    const options = {default: ".", x: "x" , o: "o", size: 3}
    const player1 = {mark: options.x, ...obj1};
    const player2 = {mark: options.o, ...obj2};
    let winBool = false;
    let currPlayer = player1;
    const board = (function() {
        let state = [];
        for(let i = 0 ; i < options.size ; i++) {
            let row = [];
            for(let j = 0 ; j < options.size ; j++) {
                row.push(options.default);
            }
            state.push(row);
        };
        return state;
    })();
    const changeTurn = () => { (currPlayer === player1) ? currPlayer = player2 : currPlayer = player1; }
    const makeMark = (xCoord, yCoord) => { // 
        let row = board[yCoord];
        (row[xCoord] === ".") ? row[xCoord] = currPlayer.mark : console.log("error attempting to place mark");
        checkWin() ? declareWin(currPlayer) : changeTurn();
    }
    const checkWin = () => {
        const diags = (function () { // create diagonals
            let top = [];
            for(let i = 0 ; i < options.size ; i++) {
                top.push(board[i][i]);
            }
            let bottom = [];
            for(let i=0, j=options.size-1 ; i<options.size ; i++, j--) {
                bottom.push(board[i][j]);
            }
            return [ top, bottom ];
        })();
        const cols = board[0].map( // transpose the board
            (column, i) => board.map(row => row[i])
        )
        const checkLines = (matrix) => {
            matrix.forEach(row => {
                if(winBool) return;
                if(row[0] === options.default) return;
                winBool = row.every(value => value === row[0]);
            });
        }
        checkLines(board); checkLines(diags); checkLines(cols);
        return winBool;
    }
    const declareWin = (currPlayer) => {
        console.log("Win detected");
        currPlayer.win();
        winBool = false;
    }
    return { player1, player2, makeMark, checkWin, board };
}

function createPlayer(name) {
    let scoreTotal = 0;
    const win = () => ++scoreTotal;
    const getScore = () => scoreTotal;
    return { name, win, getScore };
}
const game = createGame(createPlayer("john"), createPlayer("milton"));