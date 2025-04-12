const startBtn = document.querySelector('.start');
const container = document.querySelector('[data-name="container"]');
const container1 = document.querySelector('.container1');
const form = document.querySelector('#players');
const input = document.querySelectorAll('input')
let cells = document.querySelectorAll('.cell');
let boardGrid, scoreX, scoreO, draws, rounds;
let player1, player2;


startBtn.addEventListener('click', async (e) => {
        player1 = form.elements['player1'].value;
        player2 = form.elements['player2'].value;
        form.reset();
    container.style.transition = 'opacity 0.5s'
    container.style.opacity = '0';
    //change opacity again to 1 -------------------------
    startBtn.disabled = true;
    input.forEach(input => input.disabled = true);

    await new Promise(resolve => setTimeout(resolve, 400));

    container.innerHTML = '';
    container.classList.remove('container1');
    container.classList.add('container2');
        
    container.innerHTML = `
    <div class="caution-wrapper">
    <div class="caution">⚠️ Protect yourselves at all times .. FIGHT!</div>
    <img src="GIF2.gif" alt="funny gif" class='funny-intro'>
    </div>
    `;
    container.offsetHeight;
    container.style.opacity = '1';
    await new Promise(resolve => setTimeout(resolve, 2000));
    container.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 500));
    container.classList.remove('container2');
    container.classList.add('container3');
    container.innerHTML = `            <div class="p1-wrapper">
                <div class="p1">
                    <p>${player1 || 'Player1'} (X)</p>
                    <div class="x-score score">0</div>
                    <div class="x-win"></div>
                </div>
            </div>

            <div class="game">
                <div class="round">
                    <img src="logo3.png" alt="logo" class="logo2">
                    <div class="status">
                        <div class="draws">Draws: 0</div>
                        <div class="rounds">Rounds: 0</div>
                    </div>
                </div>
                <div class="gameboard-wrapper">
                    <div class="gameboard">
                    </div>
                </div>
                <div class="options">
                    <button class="next-round">Next Round</button>
                    <button class="main-menu">Main Menu</button>
                    <button class="new-game">New Game</button>

                </div>
            </div>

            <div class="p2-wrapper">
                <div class="p2">
                    <p>${player2 || 'Player2'} (O)</p>
                    <div class="o-score score">0</div>
                    <div class="o-win"></div>
                </div>
            </div>
`;
    container.style.opacity = '1';
    
    initGameUI();
    createBoard();
    boardGrid.addEventListener('click', (e) => {
        if(GameControl.gameEnd() == true) return;
    
        if(e.target.classList.contains('cell') && !e.target.classList.contains('marked')){
            e.target.classList.add('marked');
            const winner = GameControl.gameRound(e.target.dataset.id);
            boardRefresh();
            if(winner){
               Gameboard.rounds++;
               rounds.textContent = `Rounds: ${Gameboard.rounds}`;
            }
            if(winner === 'player1'){
                Gameboard.player1.score++;
                scoreX.textContent = `${Gameboard.player1.score}`;
                let [a,b,c] = GameControl.winCombo();
                cells[a].classList.add('winner-x');
                cells[b].classList.add('winner-x');
                cells[c].classList.add('winner-x');
            }
            if(winner === 'player2'){
                Gameboard.player2.score++;
                scoreO.textContent = `${Gameboard.player2.score}`;
                let [a,b,c] = GameControl.winCombo();
                cells[a].classList.add('winner-o');
                cells[b].classList.add('winner-o');
                cells[c].classList.add('winner-o');
            }
            if(winner === 'draw'){
                Gameboard.draw++;
                draws.textContent = `Draws: ${Gameboard.draw}`
            }
    
        }
    });
    
})

function initGameUI(){
    const nextRoundBtn = document.querySelector(".next-round");
    const mainMenuBtn = document.querySelector('.main-menu');
    const newGameBtn = document.querySelector('.new-game');

    scoreX = document.querySelector('.x-score');
    scoreO = document.querySelector('.o-score');
    draws = document.querySelector('.draws');
    rounds = document.querySelector('.rounds');
    boardGrid = document.querySelector('.gameboard');

    nextRoundBtn.addEventListener('click', () => {
        if(GameControl.gameEnd() == true){
            resetBoard()    
        }
    });

    newGameBtn.addEventListener('click', ()=>{
        resetBoard();
        Gameboard.gameStatusReset();
        rounds.textContent = `Rounds: ${Gameboard.rounds}`;
        scoreX.textContent = `${Gameboard.player1.score}`;
        scoreO.textContent = `${Gameboard.player2.score}`;
        draws.textContent = `Draws: ${Gameboard.draw}`
    });

    mainMenuBtn.addEventListener('click', () => {        
        location.reload();
    });

}


function resetBoard(){
        boardGrid.innerHTML = '';
        createBoard();
        Gameboard.gameboard = [' ',' ',' ',' ',' ',' ',' ',' ',' '],
        cells = document.querySelectorAll('.cell');    
        GameControl.resetGame();
}


const Gameboard = {
    player1 : {mark:'X', name: 'player1', score: 0},
    player2 : {mark:'O', name: 'player2', score: 0},
    draw : 0,
    rounds : 0,
    gameboard : [' ',' ',' ',' ',' ',' ',' ',' ',' '],
    gameStatusReset : function(){
        this.draw = 0;
        this.rounds = 0;
        this.player1 = {mark:'X', name: 'player1', score: 0};
        this.player2 = {mark:'O', name: 'player2', score: 0};
    }
}

function boardRefresh(){
    for(let i = 0; i < 9; i++){
        cells[i].textContent = `${Gameboard.gameboard[i]}`;
    }
}

function createBoard(){
        for(let i = 0; i < 9; i++){
            const cell = document.createElement('div');
            boardGrid.appendChild(cell);
            cell.dataset.id = i;
            cell.classList.add('cell');
        }
        cells = document.querySelectorAll('.cell');
}


const GameControl = (function() {
    const gameControl = {
        _players : [Gameboard.player1, Gameboard.player2],
        _activePlayer : null,
        _cellsSelected : 0,
        _winCombos : [[0,1,2],[3,4,5],[6,7,8],[0,3,6],
                    [1,4,7],[2,5,8],[0,4,8],[2,4,6]],
        _validity : false,
        _first : true,
        _end : false,
        _draw: false,
        //The input is an array of two players
        firstTurn : function (playersArr){
            const randomNum = Math.floor(Math.random() * 2);
            this._activePlayer = playersArr[randomNum];
    
            if(this._players[1] == this._activePlayer){
                this._players = [this._players[1], this._players[0]];
            }
            
            return this._activePlayer;
        },
    
        switchPlayer : function (){
            this._players = [this._players[1], this._players[0]];
            return this._activePlayer = this._players[0];
        },
        
        markCell : function(cellNumber, player){
            if (cellNumber < 0 || cellNumber > 8){
                return;//out of range
            } 
            if (Gameboard.gameboard[cellNumber] == ' ')
            {
                Gameboard.gameboard[cellNumber] = `${player.mark}`;
                this._cellsSelected++;
                this._first = false;
                this._validity = true;
                return;//valid
            }
            this._validity = false;
            return;//marked, mark another one
        },
        
        checkWin: function (){
            for(let combo of this._winCombos){
                const [a,b,c] = combo;
                if(
                    Gameboard.gameboard[a] != ' ' &&
                    Gameboard.gameboard[a] === Gameboard.gameboard[b] &&
                    Gameboard.gameboard[b] === Gameboard.gameboard[c]
                ){
                    this._end = true;
                    return combo;
                }
            }
        },
        //check for game end + switch players
        checkEnd : function (){
            if(this._cellsSelected < 5){
                this.switchPlayer();
                return;
            }
    
            this.checkWin();
    
            if(this._cellsSelected === 9){
                this._end = true;
                this._draw = true;
                return;
            }
            if(this._end == false) this.switchPlayer();
        },

        playerFirstTurn: function(cellNumber){
            this.firstTurn(this._players)
            this.markCell(cellNumber, this._activePlayer);
            if(this._validity === false) return;
            this.checkEnd();    
        },

        newGame: function (){
            this._first = true;
            this._end = false;
            this._draw = false;
            this._activePlayer = null;
            this._cellsSelected = 0;
        },
    
        gameRound: function(cellNumber){
            if (this._end === true) return;
            if (this._first === true) {
                this.playerFirstTurn(cellNumber);
                return;
            }

            this.markCell(cellNumber, this._activePlayer);
            if(this._validity === false) return;
            this.checkEnd();
            if(this._end == true && this._draw == true){
                return  'draw';
            }
            if(this._end == true && this._draw == false){
                return  this._activePlayer.name;
            }
        }
    }


return {
    gameRound: gameControl.gameRound.bind(gameControl),
    gameEnd: ()=> gameControl._end,
    
    resetGame: () => {
        gameControl._end = false;
        gameControl.newGame();
    },
    winCombo: ()=> gameControl.checkWin(),
}
})();


//when you extract a method from an object,   imp <<<--------------
//  it loses its original this binding.


    //return {players, playerTurn};
    //When you return players directly, you're exposing 
    //the actual reference to the internal array. 
    //This means external code could modify it directly 

    