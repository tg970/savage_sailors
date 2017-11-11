//console.log($);

// === GLOBAL VARIABLES ===
let userBoats = [];
let enemyBoats = [];
let size = 4;
let availBoats = [['Cat',3],['Fishing',2],['Tender', 1]];
let availEnemy = [['Trawler', 3],['Ol Busted Pontoon', 2],['Skiff', 1]];
let possPostHero = []

// === BOARD RENDER ===
const buildBoards = (size) => {
   // Build User Board
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass('row')
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass('heroSq').attr('id',`${j}`)
         // if (j <= (size - availEnemy[0][1])) {
         //    $sq.addClass(`bb`)
         // }
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
   //return placeEnemyBoats();
}

const placeEnemyBoats = () => {
   while (availEnemy.length) {
      let row = Math.floor(Math.random()*size)
      let col = Math.floor(Math.random()*((size-availEnemy[0][1])+1))
      //console.log(row, col);
      if (col <= size - availBoats[0][1]){
         enemyBoats.unshift(new EnemyBoat (availEnemy[0][0],availEnemy[0][1]));
         availEnemy.shift();
         enemyBoats[0].posBuild(row, col);

         //console.log('boat built');
      }


   // let possEnemyPost = buildPossiblePositions();
   // let countEnemy = availEnemy.length
   // for (let i = 0; i < countEnemy; i++) {
   //    enemyBoats.unshift(new Boat (availEnemy[0][0],availEnemy[0][1]));
   //    availEnemy.shift();
   //    let tempArr = checkPost()
      //enemyBoats[0].posBuild(tempArr[0], tempArr[1]);
      //removeEnemyPos(row, col);
   }
   console.log(enemyBoats);
}

// const buildPossiblePositions = () => {
//    let tempArr = []
//    for (let i = 0; i < size; i++) {
//       for (let j = 0; j < size; j++) {
//          tempArr.push([i, j])
//       }
//    }
//    return tempArr
// }
//
// const checkPost = () => {
//    let tempArr = []
//    let length = enemyBoats[0].length
//    let colTest = true
//    while (colTest) {
//       let row = Math.floor(Math.random()*size)
//       let col = Math.floor(Math.random()*(size-length+1))
//       //console.log(possPostHero.includes([row, col]));
//       colTest = false
//       // if (possPostHero.contains([row, col])){
//       //    removeEnemyPos(row, col);
//       //    colTest = false
//       // }
//    }
// }
//
// const removeEnemyPos = (row, col) => {
//
// }


// === CLICK HANDERLERS ===

const userShot = (event) => {
   console.log('click enemy square');
}

const boatPlacement = (event) => {
   if (availBoats.length >= 1) {
      let row = Number($(event.currentTarget).attr('class').split(' ')[1]);
      let col = Number($(event.currentTarget).attr('id'));
      if (col <= size - availBoats[0][1]) {
         userBoats.unshift(new HeroBoat (availBoats[0][0],availBoats[0][1]));
         availBoats.shift();
         userBoats[0].posBuild(row, col);
         //console.log('boat built');
         console.log(userBoats);
         userBoats[0].colorIn($(event.currentTarget), row, col)
      } else {
         console.log('click again');
      }
   }
   if (availBoats.length == 0) {
      console.log('game play');
      //kill placing clicks
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

class HeroBoat extends Boat {
   constructor(name, length) {
      super(name, length)
   }
   colorIn(event, row, col) {
      $(event).addClass('bb')
      $(event).off()
      let $div = $(event).siblings()
      let cnt = this.length-1
      for (let i = 0; i < $div.length; i++) {

         let id = $($div[i]).attr('id')
         //console.log(id);
         if ( id > col && cnt > 0 ) {
            $($div[i]).addClass('bb').off()
            cnt--
         }
      }
   }
}

class EnemyBoat extends Boat {
   constructor(name, length) {
      super(name, length)
   }
   colorIn(row, col) {
      let $div = 1//$(event).siblings()
      let cnt = this.length-1
      // for (let i = 0; i < $div.length; i++) {
      //
      //    let id = $($div[i]).attr('id')
      //    //console.log(id);
      //    if ( id > col && cnt > 0 ) {
      //       $($div[i]).addClass('bb').off()
      //       cnt--
      //    }
      // }
   }
}

const startGame = () => {
   buildBoards(size);
   placeEnemyBoats();
   //possPostHero = buildPossiblePositions();
   //alert('Click the square where you want to place your boat');
}

// === WINDOW ON LOAD/PAGE READY ===
$(() => {

startGame();

})
