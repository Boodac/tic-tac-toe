function createGame(obj1, obj2) {
    const options = { blank: ".", x: "x" , o: "o", size: 3 };
    const players = {
                    one: {mark: options.x, ...obj1}, 
                    two: {mark: options.o, ...obj2},
                    current: {}
                }
    const createBoard = () => {
        let state = [];
        for(let i = 0 ; i < options.size ; i++) {
            let row = [];
            for(let j = 0 ; j < options.size ; j++) {
                row.push(options.blank);
            }
            state.push(row);
        };
        return state;
    }            
    let board = createBoard(); // board[Ycoord][Xcoord] - the ROW is the yCoord, the CELL is the xCoord
    let winBool = false;
    let marksMade = 0;
    players.current = players.one;
    const changeTurn = () => { players.current === players.one ? players.current = players.two : players.current = players.one; }

    const makeMark = (xCoord, yCoord) => {
        marksMade++;
        let row = board[yCoord];
        (row[xCoord] === options.blank) ? row[xCoord] = players.current.mark : console.error("error attempting to place mark");
        checkWin() ? declareWin(players) : changeTurn();
    }

    const getMark = (xCoord, yCoord) => {
        return board[yCoord][xCoord];
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
                if(winBool || row[0] === options.blank) return;
                winBool = row.every(value => value === row[0]);
            });
        }

        checkLines(board); checkLines(diags); checkLines(cols);
        return winBool;
    }
    
    const declareWin = (players) => { 
        // external APIs use checkWin()
        console.log("Win detected");
        players.current.win(this);
    }

    const reset = () => {
        players.one.reset();
        players.two.reset();
        players.current = players.one;
        winBool = false;
        marksMade = 0;
        board = createBoard();
    }

    const changeOption = (option, value) => {
        if(!(option in options)) return false;
        options[option] = value; return true;
    }

    return { players, makeMark, getMark, checkWin, reset, changeOption };
}

function createPlayer(name) {
    let scoreTotal = 0;
    const reset = () => scoreTotal = 0;
    const win = (gameObj) => gameObj ? ++scoreTotal : scoreTotal;
    const getScore = () => scoreTotal;
    return { name, win, getScore, reset };
}

function displayHandler() {

}

const game = createGame(createPlayer("john"), createPlayer("fred"));