function createGame(obj1, obj2) {
    const options = {default: ".", x: "x" , o: "o", size: 3}
    const players = {
                    one: {mark: options.x, ...obj1}, 
                    two: {mark: options.o, ...obj2},
                    current: {}
                }
    let board = createBoard();
    let winBool = false;
    let marksMade = 0;
    players.current = players.one;
    const changeTurn = () => { players.current === players.one ? players.current = players.two : players.current = players.one; }

    const makeMark = (xCoord, yCoord) => { // 
        marksMade++;
        let row = board[yCoord];
        (row[xCoord] === options.default) ? row[xCoord] = players.current.mark : console.error("error attempting to place mark");
        checkWin() ? declareWin(players) : changeTurn();
    }
    
    const checkWin = () => {
        if(marksMade < options.size*2-1) return false; // preserve resources if a win is not possible
        
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

        const checkLines = matrix => {
            matrix.forEach(row => {
                if(winBool || row[0] === options.default) return;
                winBool = row.every(value => value === row[0]);
            });
        }

        checkLines(board); checkLines(diags); checkLines(cols);
        return winBool;
    }
    
    const declareWin = (players) => { 
        // external APIs use checkWin()
        console.log("Win detected");
        players.current.win();
    }

    const reset = () => {
        players.current = players.one;
        winBool = false;
        marksMade = 0;
        board = createBoard();
    }

    const createBoard = () => {
        let state = [];
        for(let i = 0 ; i < options.size ; i++) {
            let row = [];
            for(let j = 0 ; j < options.size ; j++) {
                row.push(options.default);
            }
            state.push(row);
        };
        return state;
    }

    return { players, makeMark, checkWin, board, options, reset };
}

function createPlayer(name) {
    let scoreTotal = 0;
    const win = () => ++scoreTotal;
    const getScore = () => scoreTotal;
    return { name, win, getScore };
}

function displayHandler() {

}