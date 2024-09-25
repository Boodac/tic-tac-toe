function createGame(obj1, obj2) {
    const options = { blank: ".", x: "X" , o: "O", size: 3 };
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
    let board = createBoard();
    let winBool = false;
    let marksMade = 0;
    players.current = players.one;
    const changeTurn = () => { players.current === players.one ? players.current = players.two : players.current = players.one; }

    const setMark = (xCoord, yCoord) => {
        let row = board[yCoord];
        (row[xCoord] === options.blank) ? row[xCoord] = players.current.mark : console.error("error attempting to place mark");
        checkWin() ? declareWin(players) : changeTurn();
        marksMade++;
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
        players.current.win(checkWin());
    }

    const reset = () => {
        players.current = players.one;
        winBool = false;
        marksMade = 0;
        board = createBoard();
    }

    const changeOption = (option, value) => {
        if(!(option in options)) return false;
        options[option] = value; return true;
    }

    const option = (opt) => {
        if(!(opt in options)) return false;
        return options[opt];
    }

    const turn = () => {
        return marksMade;
    }

    return { players, setMark, getMark, checkWin, reset, changeOption, option, turn };    
}

function createPlayer(name) {
    let scoreTotal = 0;
    const reset = () => scoreTotal = 0;
    const win = (bool) => bool ? ++scoreTotal : scoreTotal;
    const getScore = () => scoreTotal;
    return { name, win, getScore, reset };
}

const display = (function() {
    const marquee = document.getElementById("marquee");
    const modal = document.querySelector("#modal");
    const container = document.querySelector(".TTOcontainer");
    let player1 = createPlayer("Player 1");
    let player2 = createPlayer("Player 2");
    
    const resetBtn = document.querySelector("#reset");
    resetBtn.addEventListener("click", e => {
        game.reset();
        init();
    });

    const settingsBtn = document.querySelector("#settings");
    settingsBtn.addEventListener("click", e => {
        displayModal();
    });
    
    const closeBtn = document.querySelector("#closeButton");
    closeBtn.addEventListener("click", e => {
        closeModal();
    });

    const saveButton = document.querySelector("#saveButton");
    saveButton.addEventListener("click", e => {
        const entries = document.querySelectorAll("input");
        if(entries[0].value === game.players.one.name && entries[1].value === game.players.two.name) {
            closeModal();
        }
        else {
            game.players.one.name = entries[0].value;
            game.players.two.name = entries[1].value;
            game.reset();
            init();
        }
    });

    const game = createGame(player1, player2);
    let size = 0;

    const init = () => {
        marquee.textContent = game.players.one.name + " " + "(" + game.players.one.mark + ") " + "goes first.";
        modal.style.display = "none";
        size = game.option("size");
        container.textContent="";
        container.style.gridTemplateColumns = "repeat(" + size + ", 1fr)";
        container.style.gridTemplateRows = "repeat(" + size + ", max-content)";
        for( let i = 0 ; i < size ; i++ ) {
            for( let j = 0 ; j < size ; j++ ) {
                const temp = document.createElement("div");
                temp.classList.add("cell");
                temp.id = "_" + j + "-" + i;
                temp.addEventListener("click", event => handleClick(event));
                container.appendChild(temp);
            }
        }
    };

    const handleClick = (e) => {
        if(game.checkWin()) return;
        if(e.target.nodeName === "IMG") return;
        let xCoord = e.target.id.substring(1).substring(0, e.target.id.indexOf("-")-1);
        let yCoord = e.target.id.substring(1).substring(e.target.id.indexOf("-"));
        game.setMark(xCoord, yCoord);
        const fill = document.createElement("img");
        fill.src = "./assets/" + game.getMark(xCoord, yCoord) + ".svg";
        fill.draggable = "false";
        e.target.appendChild(fill);
        let winBool = game.checkWin();

        if(!winBool && game.turn() < maxSize()) marquee.textContent = "Turn " + game.turn() + ": Move placed at (" + ++xCoord + ", " + ++yCoord + ") - It is now " + game.players.current.name + "'s turn.";
        else if(winBool) {
            marquee.textContent = game.players.current.name + " " + "(" + game.players.current.mark + ") wins on turn " + game.turn();
        }
        else marquee.textContent = "It's a draw. Reset to play again.";
    };

    const maxSize = () => {
        return size * size;
    };

    const displayModal = () => {
        if(modal.style.display === "none") modal.style.display = "flex";
    };

    const closeModal = () => {
        modal.style.display = "none";
    }

    return { init };
})();

display.init();