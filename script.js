const playersInfo = function(mark, name) {
    return { mark, name};
};

const player1 = playersInfo('X', 'player1');
const player2 = playersInfo('O', 'player2');

const Gameboard = {
    playersInfo : function(mark, name) {
                    return { mark, name};},
    gameboard : [' ',' ',' ',' ',' ',' ',' ',' ',' '],
    gameboardPrint : function(){ console.log(`${this.gameboard[0]} ${this.gameboard[1]} ${this.gameboard[2]}
${this.gameboard[3]} ${this.gameboard[4]} ${this.gameboard[5]}
${this.gameboard[6]} ${this.gameboard[7]} ${this.gameboard[8]}`)}
    
}
    


const gameControl = (function (){
    let players = [player1, player2];
    let activePlayer = null;
    let cellsSelected = 0;
    const winCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    //The input is an array of two players
    function firstTurn(playersArr){
        const randomNum = Math.floor(Math.random() * 2);
        this.activePlayer = playersArr[randomNum];

        if(this.players[1] == this.activePlayer){
            this.players = [this.players[1], this.players[0]];
        }

        return this.activePlayer;
    }

    function switchPlayer(){
        players = [players[1], players[0]];
        return activePlayer = players[0];
    }
    
    function markCell(cellNumber, player){
        if (Gameboard.gameboard[cellNumber] == ' '){
            Gameboard.gameboard[cellNumber] = `${player.mark}`;
            cellsAvailable++;
            return true;
        }
        return false;
    }
    
    function checkEnd(){
        for(let combo of winCombos){
            const [a,b,c] = combo;
            if(
                Gameboard.gameboard[a] != ' ' &&
                Gameboard.gameboard[a] === Gameboard.gameboard[b] &&
                Gameboard.gameboard[b] === Gameboard.gameboard[c]
            ){
                return console.log(`the winner is: ${activePlayer.name}`);
                
            }
        }
        if(cellsAvailable === 9){
            return console.log("Draw");
        }
        switchPlayer();
    }

    return {
    getActivePlayer: () => activePlayer, 
    getPlayers: () => players, 
    firstTurn, 
    switchPlayer,
    markCell,
    checkEnd,
 };
    //return {players, playerTurn};
    //When you return players directly, you're exposing 
    //the actual reference to the internal array. 
    //This means external code could modify it directly 
    //(e.g., gameControl.players.push(newPlayer)), 
    //potentially breaking internal logic.
})();

// round{
    console.log(`player with first turn: ${gameControl.firstTurn(gameControl.getPlayers()).name}`);
    gameControl.markCell(0, gameControl.getActivePlayer());
    console.log(`board: 0`);
    Gameboard.gameboardPrint();
    gameControl.checkEnd()
    console.log(`player's turn: ${gameControl.getActivePlayer().name}`);
    gameControl.markCell(5, gameControl.getActivePlayer());
    console.log(`board: 5`);
    Gameboard.gameboardPrint();
    gameControl.checkEnd()
    console.log(`player's turn: ${gameControl.getActivePlayer().name}`);
    gameControl.markCell(4, gameControl.getActivePlayer());
    console.log(`board: 5`);
    Gameboard.gameboardPrint();
    gameControl.checkEnd()
    console.log(`player's turn: ${gameControl.getActivePlayer().name}`);
    gameControl.markCell(7, gameControl.getActivePlayer());
    console.log(`board: 7`);
    Gameboard.gameboardPrint();
    gameControl.checkEnd()
    gameControl.markCell(8, gameControl.getActivePlayer());
    console.log(`board: 8`);
    Gameboard.gameboardPrint();
    gameControl.checkEnd()



// }