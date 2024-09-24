function createGame(obj1, obj2) {
    const options = { default: ".", x: "x" , o: "o", size: 3}
    const player1 = {mark: options.x, ...obj1};
    const player2 = {mark: options.o, ...obj2};
    const board = (function(size = options.size) {
        let state = [];
        for(let i = 0 ; i < size ; i++) {
            let row = [];
            for(let j = 0 ; j < size ; j++) {
                row.push(options.default);
            }
            state.push(row);
        }
        return state;
    })();
    let currPlayer = player1;

    const changeTurn = () => { (currPlayer === player1) ? currPlayer = player2 : currPlayer = player1; }

    const makeMark = (x, y) => { // 
        let row = board[y];
        (row[x] === ".") ? row[x] = currPlayer.mark : console.log("error attempting to place mark");
        showBoard();
        checkWin() ? declareWin(currPlayer) : changeTurn();
    }

    const showBoard = () => {
        board.forEach(element => {
            console.log(element);
        });
    }

    const checkWin = () => {
        let winBool = false;
        // create diagonals
        const diags = (function () {
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

        // transpose the board
        const cols = board[0].map(
            (col, i) => board.map(row => row[i])
        )

        checkLines = (matrix) => {
            matrix.forEach(row => {
                if(winBool) return;
                if(row[0] === options.default) return;
                winBool = row.every(value => value === row[0]);
            });
        }

        checkLines(board), checkLines(diags), checkLines(cols);

        return winBool;
    }

    const declareWin = (currPlayer) => {
        console.log(currPlayer.name + " wins!");
        winBool = false;
    }

    return { player1, player2, makeMark, showBoard, checkWin, board };
}

function createPlayer(name) {
    let scoreTotal = 0;
    const win = () => ++scoreTotal;
    const getScore = () => scoreTotal;

    return { name, win, getScore };
}

let John = createPlayer("john");
let Fred = createPlayer("fred");

const game = createGame(John, Fred);
