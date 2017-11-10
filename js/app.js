//console.log($);

// === GLOBAL VARIABLES ===
let userBoats = [];
let enemyBoats = [];
let size = 4;
let availBoats = [['Tender', 1], ['Fishing',2], ['Cat',3]];
let availEnemy = [['Skiff', 1], ['Ol Busted Pontoon', 2], ['Trawler', 3]];

// === BOARD CONSTRUCTION ===
const buildBoards = (size) => {
   // Build User Board
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass('row')
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass('heroSq').attr('id',`${j}`)
         $sq.addClass(`${i}`)
         $sq.on('click',boatPlacement)
         $container.append($sq)
      };
   $('.hero').append($container)
   }
   //Build Enemy Board
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass('row')
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass('enemySq').attr('id',`${j}`)
         $sq.addClass(`${i}`)
         $sq.on('click',userShot)
         $container.append($sq)
      };
   $('.enemy').append($container)
   }
   return placeEnemyBoats();
}

const placeEnemyBoats = () => {
   let possPost = buildPossiblePositions();
   console.log(possPost);
   let countEnemy = availEnemy.length
   for (let i = 0; i < countEnemy; i++) {
      let row = Math.floor(Math.random()*size)
      let col = Math.floor(Math.random()*size)
      enemyBoats.unshift(new Boat (availEnemy[0][0],availEnemy[0][1]));
      availEnemy.shift();
      enemyBoats[0].posBuild(row, col);
      //removeEnemyPos(row, col);
   }
   console.log(enemyBoats);
}

const buildPossiblePositions = () => {
   let tempArr = []
   for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
         tempArr.push([i, j])
      }
   }
   return tempArr
}

const removeEnemyPos = () => {

}


// === CLICK HANDERLERS ===

const userShot = (event) => {
   console.log('click enemy square');
}

const boatPlacement = (event) => {
   if (availBoats.length >= 1) {
      let row = Number($(event.currentTarget).attr('class').split(' ')[1]);
      let col = Number($(event.currentTarget).attr('id'));
      userBoats.unshift(new Boat (availBoats[0][0],availBoats[0][1]));
      availBoats.shift();
      userBoats[0].posBuild(row, col);
      console.log(userBoats, availBoats);
   }
   if (availBoats.length == 0) {
      console.log('game play');
      //return gamePlay
   }
}

// === LOGIC LAYER ===

class Boat {
   constructor(name, length) {
      this.name = name,
      this.length = length,
      this.position = {},
      this.hit = []
   }
   posBuild(row, col) {
      for (let i = 0; i < this.length; i++) {
         this.position[i] = [row, col + i]
         this.hit.push(false)
      }
   }
}

const startGame = () => {
   buildBoards(size);
   //alert('Click the square where you want to place your boat');
}

// === WINDOW ON LOAD/PAGE READY ===
$(() => {

startGame();

})
