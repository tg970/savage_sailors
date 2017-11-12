//console.log($);

// === GLOBAL VARIABLES ===
let userBoats = [];
let enemyBoats = [];
let size = 4;
let availBoats = [['Your Catamaran',3,`cat`],['The Fishing Boat',2,`fish`],['Tender', 1, `dingy`]];
let availEnemy = [['Enemy Trawler', 3,`traw`],['Ol Busted Pontoon', 2, `toon`],['Skiff', 1, `skif`]];
let userTurn = false;
let compShotOpt = [];
let vertical = true;

// === BOARD RENDER ===
const buildBoard = (user, size, func) => {
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass(`${user}Row`)
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass(`${user}Sq`).attr(`id`,`${j}`)
         $sq.addClass(`${i}`)
         $sq.on('click',func)
         let delay = getDelay(i, j)
         $sq.addClass(`hidden`)
         setTimeout(removeHidden,delay)
         // $sq.css(`animation-delay`,`${delay}ms`)
         $container.append($sq)
      };
   $(`.${user}`).append($container)
   }
   //$(`.messageContainer`)
}
// const animateSq = () => {
//    $(`.heroSq`).css('display', 'block')
// }
const getDelay = (i, j) => {
   return ((i * 400) + ((j+1) * 100))
}
const removeHidden = () => {
   $(`.hidden`).eq(0).removeClass(`hidden`);
}

// === CLICK HANDERLERS ===
const boatPlacement = (event) => {
   let newBoatLength = availBoats[0][1]
   let newBoatName = availBoats[0][0]
   let id = availBoats[0][2]
   let row = getRow(event);
   let col = getCol(event);
   if (checkConflicts(row, col, `.heroSq`, newBoatLength)) {
      $(`.messageContainer`).removeClass(`start`)
      $(`#${id}`).removeClass(`notplaced`)
      userBoats.unshift(new HeroBoat (availBoats[0][0],availBoats[0][1],availBoats[0][2]));
      availBoats.shift();
      userBoats[0].posBuild(row, col);
      userBoats[0].colorIn($(event.currentTarget), row, col)
      if (availBoats.length > 0) {
         userBoats[0].placedMessage(availBoats[0][0])
      }
      //console.log('boat built');
      console.log(userBoats);
   } else {
      $('.message').text(`${newBoatName} won't fit there, try again...`)
   }
   if (availBoats.length == 0) {
      killBoatPlaceClicks();
      buildBoard(`enemy`, size, userShot);
      placeEnemyBoats();
      genCompShotOpt();
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
   constructor(name, length, imgId) {
      this.name = name,
      this.length = length,
      this.position = [],
      this.hit = []
      this.imgId = imgId
   }
   posBuild(row, col) {
      if (!vertical) {
         for (let i = 0; i < this.length; i++) {
            this.position[i] = [row, col + i]
            this.hit.push(false)
         }
      } else {
         for (let i = 0; i < this.length; i++) {
            this.position[i] = [row + i, col]
            this.hit.push(false)
         }
      }
   }
   damage(opp) {
      //console.log(`this is`, this, opp);
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
      console.log(`${this.name} Sunk!`);
      //console.log(this);
      opp.splice(opp.indexOf(this),1);
      //console.log(opp);
   }
}

class HeroBoat extends Boat {
   constructor(name, length) {
      super(name, length)
   }
   colorIn(event, row, col) {
      $(event).addClass('bb')
      $(event).off()
      if (!vertical) {
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
      } else {
         this.colorInVert(row, col)
      }
   }
   colorInVert(row, col) {
      console.log(`colorInVert running`, row, col);
      let $col = $('.heroSq').filter(`#${col}`)
      let cnt = this.length-1
      console.log($col, cnt);
      for (let i = 0; i < $col.length; i++) {
         let tmpRow = $($col[i]).attr('class').split(' ')[1]
         //console.log(id);
         if ( tmpRow > row && cnt > 0 ) {
            $($col[i]).addClass('bb').off()
            cnt--
         }
      }
   }
   placedMessage(nextBoatName) {
      $('.message').text(`${this.name} has been put on the board! Click again to place ${nextBoatName}:`)
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
         console.log(enemyBoats[0].name, enemyBoats[0].position);
         availEnemy.shift();
         enemyBoats[0].posBuild(row, col);
         //enemyBoats[0].colorIn(row, col);
         //console.log(enemyBoats);
      }
   }
}

const checkConflicts = (row, col, board, newBoatLength) => {
   if (vertical) {
      return checkConflictsVert(row, col, board, newBoatLength)
   }
   //console.log('checking row conflicts');
   let $row = $(board).filter(`.${row}`)
   //console.log($row);
   if ( col <= size - newBoatLength ) {
      for (let i = 0; i < $row.length; i++) {
         let tmpCol = $($row[i]).attr('id')
         let tmpRow = $($row[i]).attr('class').split(' ')[1]
         //console.log('tmpRow', tmpRow, 'tmpcol', tmpCol);
         if ( newBoatLength > 0 && tmpCol >= col ) {
            if ($($row[i]).hasClass('bb')) {
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
}

const checkConflictsVert = (row, col, board, newBoatLength) => {
   let $col = $(board).filter(`#${col}`)
   //console.log(row, col);
   if ( row <= size - newBoatLength ) {
      for (let i = 0; i < $col.length; i++) {
         let tmpCol = $($col[i]).attr('id')
         let tmpRow = $($col[i]).attr('class').split(' ')[1]
         //console.log('tmpRow', tmpRow, 'tmpcol', tmpCol);
         if ( newBoatLength > 0 && tmpRow >= row) {
            if ($($col[i]).hasClass('bb')) {
               //console.log('break');
               return false
            } else {
               newBoatLength--
            }
            //console.log('new boat length', newBoatLength);
            if (newBoatLength == 0) {
               return true
            }
         }
      }
   }
}

const genCompShotOpt = () => {
   for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
         compShotOpt.push([i, j])
      }
   }
   //console.log(compShotOpt);
}

const computerShot = () => {
   console.log('computer shooting');
   let randIndex = Math.floor(Math.random()*compShotOpt.length)
   let target = compShotOpt[randIndex]
   compShotOpt.splice(randIndex, 1)
   //console.log(target);
   let shot = checkHit(target[0], target[1], userBoats);
   if (shot.t) {
      $('.message').text(`That's a HIT!!!!`)
      shot.b.damage(userBoats)
      $(`.heroSq`).filter(`.${target[0]}`).slice(target[1],target[1]+1).addClass(`hit`)
   } else {
      $('.message').text(`Misssssed....`);
      $(`.heroSq`).filter(`.${target[0]}`).slice(target[1],target[1]+1).addClass(`miss`)
   }
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
   //console.log('Game Play:', userBoats, enemyBoats);
   if ( userBoats.length > 0 && enemyBoats.length > 0 ) {
      setTimeout(computerShot, 3000);
   }
   if ( userBoats.length == 0 ) {
      $('.message').text(`Game over...  :(`);
   }
   if ( enemyBoats.length == 0 ) {
      $('.message').text(`YOU Won!!!`);
   }
   //console.log('userTurn now', userTurn);
}

const startGame = () => {
   $('.message').text("Place your Boats!")
   $('.messageContainer').addClass(`start`)
   buildBoard(`hero`, size, boatPlacement);
}

// === WINDOW ON LOAD/PAGE READY ===
$(() => {

startGame();

})
