'use strict'


var gBoard;
var gCountShown;
const emojiSmile = '🙂';
const BOMB = '💣';
var printBombOrNumber;
var gIsBoardEmpty;

//THE MODEL
var gBoardCell = {
    // A Matrix. containing cell objects:Each cell: {minesAround
    minesAroundCound: 4,
    isShown: false, // CELL ARE SHOWN.
    isMine: true, // CELL ARE MINE.
    isMarked: false
}

//BOARD SIZE AND MINES PUT IN BOARD.
var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false, // Boolean, when true we let the user play
    shownCount: 0, //How many cells are shown
    markedCount: 0, // How many cells are marked (with a flag)
    secsPassed: 0, // How many seconds passed

}

function init() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

// Model Board.
function buildBoard() {
    var mat = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        mat[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            mat[i][j] = {
                // A Matrix. containing cell objects:Each cell: {minesAround
                minesAroundCound: 4,
                isShown: false, // CELL ARE SHOWN.
                isMine: true, // CELL ARE MINE.
                isMarked: false
            };
        }

    }

    // print random position the bomb.
    for (var i = 0; i < gLevel.MINES; i++) {
        var randCoord = {i: getRandomIntInclusive(0,mat.length-1), j:getRandomIntInclusive(0,mat.length-1)}
            mat[randCoord.i][randCoord.j].isShown = true;

    }

    return mat;
}

// DOM Board.
function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`;
        for (var j = 0; j < board[i].length; j++) {
            var tdId = `cell-${i}-${j}`; // each pos cell
            var currCell = board[i][j];
            strHtml += `<td id="cell ${tdId}" onclick="cellClicked(this,${i}, ${j})">`
            // check if its bomb or number to print by(true/false).
            if (currCell.isShown) {
                // modal - the mines around is 0 couse is a bomb(mines).
                board[i][j].minesAroundCound = 0;
                //DOM. print the bomb.
                strHtml += BOMB;
            } else if (!currCell.isShown) {
                //get the neighbors for the model and dom.
                var countNeighbor = countNeighbors(i, j, board);
                // MODEL. save the count of the neighbors.
                board[i][j].minesAroundCound = countNeighbor;
                //DOM. print the numbers. 
                strHtml += countNeighbor;
            }
            strHtml += '</td>';
        }
        strHtml += `</tr>`;
    };
    console.log(board);
    // catch the board from html.
    var elBoard = document.querySelector('.board');
    //print the board to html.
    elBoard.innerHTML = strHtml;
}

//Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {

    // when player try to click on bomb or number already on board.


    var currCell = { i: i, j: j };
    gBoard[0][0].isMine = true;
    // gBoard[i][j].isMine = true;
    gBoard[i][j].minesAroundCound = countNeighbors(i, j, gBoard);
    // renderBoard(gBoard);
    console.log('curr coord:', currCell);
    console.log('mines around:', gBoard[i][j].minesAroundCound)
    console.log('curr cell:', gBoard)
    renderBoard(gBoard)












    // var getNeighborsOfCell = gBoard[i][j].minesAroundCound;
    // // var isGameOver = gameOver(currCell);

    // var getNeighborsOfCell = countNeighbors(i, j, gBoard);

    // // check if the all board cell are empty(the game is not started).
    // var isEmptyBoardCell = isBoardCellEmpty();

    // // only when we click on the first(left) click(start to play).
    // if (!gGame.isOn && isEmptyBoardCell) {
    //     // get position of the bomb and place the bomb. and place the first number. 
    //     for (var i = 0; i < gLevel.MINES; i++) {
    //         printTheBomb(i, j);
    //     }
    //     // run on board to change the first number
    //     //(if he near to bomb we change the number to correct bomb neighbors).
    //     printFirstNumber(elCell, currCell)

    //     console.table(gBoard);
    // } else {
    //     // only if the game is already start(first click already).
    //     if (gGame.isOn && !isEmptyBoardCell && !isGameOver) {
    //         // every click we print the neighbors of curr cell.
    //         gBoard[currCell.i][currCell.j] = getNeighborsOfCell;
    //         elCell.innerHTML = getNeighborsOfCell;

    //         console.table(gBoard);
    //     }

    // }
    // // change here to true cuase in first click we didint want the runing go to else option.
    // gGame.isOn = true;
    // // should render the gboard every click?
}

// getting true/false if all the board cell are empty.
function isBoardCellEmpty() {
    var boardSize = gLevel.SIZE * gLevel.SIZE;
    var isEmptyPlace = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            // check if all the cell is empty.
            if (gBoard[i][j] === '') {
                isEmptyPlace++;
            }
        }
    }
    // check if we not have empty cell at all.
    (isEmptyPlace === boardSize) ? gIsBoardEmpty = true : gIsBoardEmpty = false;
    return gIsBoardEmpty;
}

function printTheBomb(i, j) {
    // get random i and j.
    var getRandI = getRandomIntInclusive(0, 3);
    var getRandJ = getRandomIntInclusive(0, 3);
    // to print BOMB we checkif  we didint print on the PLAYER curr cell click.
    if (getRandI !== i, getRandJ !== j) {
        // update model.
        gBoard[getRandI][getRandJ] = BOMB;
    }
}
function printFirstNumber(elCell, currCell) {
    gBoard.forEach(function (row, i) {
        row.forEach(function (cell, j) {
            if (currCell.i === i && currCell.j === j) {

                var getNeighborsOfCell = countNeighbors(currCell.i, currCell.j, gBoard);

                // update model.
                gBoard[currCell.i][currCell.j] = getNeighborsOfCell;
                // update dom.
                elCell.innerHTML = getNeighborsOfCell;
            }
        })
    })

}

function gameOver(currCell) {
    var currPos = gBoard[currCell.i][currCell.j];
    if (currPos === BOMB || currPos !== '') {
        console.log('its or bomb or take already');
        return true;
    }


}

//Count mines around each cell
//and set the cell's minesAroundCount.
function setMinesNegsCount(i, j, mat) {
    var coordIsShown = 0;
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            if (mat[i][j].isShown) {
                coordIsShown++
            }
        }
    }
    return coordIsShown;
}

// get string id like 'cell-1-3' and return coord like {i: 1, j: 3};
function getCellId(strCellId) {
    var coord = {};
    var part = strCellId.split('-');
    coord.i = +part[1];
    coord.j = +part[2];
    return coord;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}
