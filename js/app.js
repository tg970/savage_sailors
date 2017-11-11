//console.log($);

// === GLOBAL VARIABLES ===
let userBoats = [];
let enemyBoats = [];
let size = 4;
let availBoats = [['Your Catamaran',3],['The Fishing Boat',2],['Tender', 1]];
let availEnemy = [['Enemy Trawler', 3],['Ol Busted Pontoon', 2],['Skiff', 1]];
let userTurn = false;

// === BOARD RENDER ===
const buildBoard = (user, size, func) => {
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass(`${user}Row`)
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass(`${user}Sq`).attr(`id`,`${j}`)
         $sq.addClass(`${i}`)
         $sq.on('click',func)
         $container.append($sq)
      };
   $(`.${user}`).append($container)
   }
}

// === CLICK HANDERLERS ===
const boatPlacement = (event) => {
   let newBoatLength = availBoats[0][1]
   let newBoatName = availBoats[0][0]
   let row = getRow(event);
   let col = getCol(event);
   if (checkConflicts(row, col, `.heroSq`, newBoatLength) && (col <= size - newBoatLength)) {
      userBoats.unshift(new HeroBoat (availBoats[0][0],availBoats[0][1]));
      availBoats.shift();
      userBoats[0].posBuild(row, col);
      userBoats[0].colorIn($(event.currentTarget), row, col)
      if (availBoats.length > 0) {
         userBoats[0].placedMessage(availBoats[0][0])
      }
      //console.log('boat built');
      //console.log(userBoats);
   } else {
      $('.message').text(`${newBoatName} won't fit there, try again...`)
   }
   if (availBoats.length == 0) {
      killBoatPlaceClicks();
      buildBoard(`enemy`, size, userShot);
      placeEnemyBoats();
      $('.message').text(`Alright, Let's Play!`);
      return gamePlay();
   }
} //returns gamePlay
const killBoatPlaceClicks = () => {
   let $heroSqEmpty = $(`.heroSq`).not(`.bb`)
   for (let i = 0; i < $heroSqEmpty.length; i++) {
      $($heroSqEmpty).eq(i).off();
   }
}
const userShot = (event) => {
   console.log('user fired');
   if (userTurn) {
      let row = getRow(event);
      let col = getCol(event);
      let shot = checkHit(row, col, enemyBoats);
      if (shot.t) {
         $('.message').text(`That's a HIT!!!!`)
         shot.b.damage(enemyBoats)
         renderHit(event)
      } else {
         $('.message').text(`Misssssed....`);
         renderMiss(event)
      }
      userTurn = !userTurn
      console.log('userturn to', userTurn);
      return gamePlay();
   }
}

// === Henderler Dependencies ===
const getRow = (event) => {
   return Number($(event.currentTarget).attr('class').split(' ')[1]);
}
const getCol = (event) => {
   return Number($(event.currentTarget).attr('id'));
}
const renderHit = (event) => {
   $(event.currentTarget).off();
   $(event.currentTarget).addClass(`hit`);
}
const renderMiss = (event) => {
   $(event.currentTarget).off();
   $(event.currentTarget).addClass(`miss`)
}

// === LOGIC LAYER ===
class Boat {
   constructor(name, length) {
      this.name = name,
      this.length = length,
      this.position = [],
      this.hit = []
   }
   posBuild(row, col) {
      for (let i = 0; i < this.length; i++) {
         this.position[i] = [row, col + i]
         this.hit.push(false)
      }
   }
   damage(opp) {
      console.log(`this is`, this, opp);
      this.hit.shift();
      this.hit.push(true);
      this.checkForSunk(opp);
   }
   checkForSunk(opp) {
      for (let i = 0; i < this.length; i++) {
         if (this.hit[i]) {
            continue
         } else {
            return
         }
      }
      $('.message').text(`${this.name} Sunk!`);
      opp.splice(opp.indexOf(this),1);
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
   placedMessage(nextBoatName) {
      $('.message').text(`Your ${this.name} has been put on the board! Click again to place your ${nextBoatName}:`)
   }
}
class EnemyBoat extends Boat {
   constructor(name, length) {
      super(name, length)
   }
   colorIn(row, col) {
      let $enemySq = $(`.enemySq`)
      //console.log($enemySq);
      let cnt = this.length
      for (let i = 0; i < $enemySq.length; i++) {
         let tmpCol = $($enemySq[i]).attr('id')
         let tmpRow = $($enemySq[i]).attr('class').split(' ')[1]
         //console.log($enemySq, 'cnt', cnt, 'tmpcol', tmpCol, classes);
         if ( cnt > 0 && tmpCol >= col && tmpRow == row) {
            //console.log('yep');
            $($enemySq[i]).addClass('bb')
            cnt--
         }
      }
   }
}
const placeEnemyBoats = () => {
   while (availEnemy.length) {
      let newBoatLength = availEnemy[0][1]
      let row = Math.floor(Math.random()*size)
      let col = Math.floor(Math.random()*((size-newBoatLength)+1))
      //console.log('new go', row, col);
      if (checkConflicts(row, col, `.enemySq`, newBoatLength)) {
         enemyBoats.unshift(new EnemyBoat (availEnemy[0][0],availEnemy[0][1]));
         //console.log(enemyBoats[0].name);
         availEnemy.shift();
         enemyBoats[0].posBuild(row, col);
         enemyBoats[0].colorIn(row, col);
         //console.log(enemyBoats);
      }
   }
}
const checkConflicts = (row, col, board, newBoatLength) => {
   let $row = $(board).filter(`.${row}`)
   //console.log($enemyRow);
   for (let i = 0; i < $row.length; i++) {
      let tmpCol = $($row[i]).attr('id')
      let tmpRow = $($row[i]).attr('class').split(' ')[1]
      //console.log($enemyRow, 'cnt', testCnt, 'tmpcol', tmpCol);
      if ( newBoatLength > 0 && tmpCol >= col) {
         if ($($row[i]).hasClass('bb')) {
            //console.log('break');
            return false
         } else {
            newBoatLength--
         }
         if (newBoatLength == 0) {
            return true
         }
      }
   }
}
const computerShot = () => {
   console.log('computer shooting');
   userTurn = !userTurn
}
const checkHit = (row, col, otherBoats) => {
   for (let boat of otherBoats) {
      for (let post of boat.position) {
         if (post[0] == row && post[1] == col) {
            //boat.damage();
            return {'t':true, b:boat}
         }
      }
   }
   return false
}
const gamePlay = () => {
   console.log('Game Play', userBoats, enemyBoats);
   if ( userBoats.length > 0 && userBoats.length > 0 ) {
      computerShot();
   }
   //console.log('userTurn now', userTurn);
}
const startGame = () => {
   $('.message').text("Place your Boats!")
   buildBoard(`hero`, size, boatPlacement);
}
// === WINDOW ON LOAD/PAGE READY ===
$(() => {

startGame();

})
