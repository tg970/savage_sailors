//console.log($);
const devMode = false
const publish = true

// === GLOBAL VARIABLES ===
let userBoats = [];
let enemyBoats = [];
let size = 4;
let availBoats = [['Your Catamaran',3,`cat`],['The Fishing Boat',2,`fish`],['Tender', 1, `dingy`]];
let availEnemy = [['Enemy Trawler', 3,`traw`],['Ol Busted Steamer', 2, `toon`],['Skiff', 1, `skif`]];
let userTurn = false;
let compShotOpt = [];
let vertical = true;
let enemySqSB = 6;
let first_go = true;
const imgAddress = {
   'cat': {
      1:`./img/cat_damg_1.png`,
      2:`./img/cat_damg_2.png`,
      3:`./img/cat_damg_3.png`,
      reset: `./img/cat.png`
   },
   'fish': {
      1:`./img/fishing_damg_1.png`,
      2:`./img/fishing_damg_2.png`,
      reset: `./img/fishing.png`
   },
   'dingy': {
      1:`./img/tender_damg_1.png`,
      reset: `./img/tender.png`
   },
   'traw': {
      sunk:`./img/emTrawler_sunk.png`,
      reset:`./img/emTrawler.png`
   },
   'toon': {
      sunk:`./img/olbusted_sunk.png`,
      reset:`./img/olbusted.png`
   },
   'skif': {
      sunk:`./img/skiff_sunk.png`,
      reset: `./img/skiff.png`
   }
}

// === BOARD RENDER ===
const buildBoard = (user, size, func) => {
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass(`${user}Row`)
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass(`${user}Sq`).attr(`id`,`${j}`)
         $sq.addClass(`${i}`)
         $sq.on('click',func)
         if (user == `hero`) {
            $sq.on('mouseenter',renderBoatHover)
            $sq.on('mouseleave',deRenderBoatHover)
         } else {
            $sq.on('mouseenter', renderUserShotHover)
            $sq.on('mouseleave', deRenderUserShotHover)
         }
         let delay = getDelay(i, j)
         $sq.addClass(`hidden`)
         if (devMode) {
            setTimeout(removeHidden,150)
         } else {
            setTimeout(removeHidden,delay)
         }
         $container.append($sq)
      };
   $(`.${user}`).append($container)
   }
   if (user == `hero`) {
      $(`.vert`).removeClass(`hide`)
      $('.vertBtn').removeClass(`hide`).on('click',vertToggle)
      $('.reset').removeClass(`hide`)
      if (devMode) {
         $('.resetBtn').removeClass(`hide`)
      }
   } else if (!devMode) {
      // $('.heroSq').css('cursor','not-allowed')
      $(`.vert`).addClass(`hide`)
      $('.vertBtn').addClass(`hide`).off()
      $('.reset').addClass(`hide`)
   }
   //$(`.messageContainer`)
}
const getDelay = (i, j) => {
   return ((i * 400) + ((j+1) * 100))
}
const removeHidden = () => {
   $(`.hidden`).eq(0).removeClass(`hidden`);
}

// === CLICK HANDERLERS ===
const hideGo_n_start = (event) => {
   console.log(`hide go and start!`);
   $(`.goWrapper`).addClass(`hide`);
   $(`.boatsHeader`).text(`Boats`);
   $(`.board`).removeClass(`hide`);
   $('#navResetBtn').on('click',resetBoard)
   startGame();
}
const boatPlacement = (event) => {
   let newBoatLength = availBoats[0][1]
   let newBoatName = availBoats[0][0]
   let id = availBoats[0][2]
   let row = getRow(event);
   let col = getCol(event);
   if (checkConflicts(row, col, `.heroSq`, newBoatLength)) {
      //$(`.messageContainer`).removeClass(`start`)
      // throw into rendering the boat info tiles
         $(`#${id}`).removeClass(`notplaced`)
      // ....
      userBoats.unshift(new HeroBoat (availBoats[0][0],availBoats[0][1],availBoats[0][2]));
      availBoats.shift();
      userBoats[0].posBuild(row, col);
      userBoats[0].colorIn($(event.currentTarget), row, col)
      if (availBoats.length > 0) {
         userBoats[0].placedMessage(availBoats[0][0])
      }
      //console.log('boat built');
      //console.log(userBoats);
   } else {
      $('.messageHero').text(`${newBoatName} won't fit there, try again...`)
   }
   if (availBoats.length == 0) {
      return letsPlay();
   }
} //returns gamePlay
const vertToggle = () => {
   vertical = !vertical
   if (vertical) {
      $('.vertBtn').css(`background-color`,'#1D733A')
   } else {
      $('.vertBtn').css(`background-color`,'#00516C')
   }
}
const killBoatPlaceClicks = () => {
   let $heroSqEmpty = $(`.heroSq`)//.not(`.bb`)
   for (let i = 0; i < $heroSqEmpty.length; i++) {
      $($heroSqEmpty).eq(i).off().css('cursor','default');
   }
}
const userShot = (event) => {
   //console.log('user fired');
   if (userTurn) {
      let row = getRow(event);
      let col = getCol(event);
      let shot = checkHit(row, col, enemyBoats);
      $('.messageHero').css(`opacity`,`.25`)
      $('.messageEnemy').css(`opacity`,``)
      if (shot.t) {
         $('.messageEnemy').text(`That's a HIT!!!!`)
         shot.b.damage(enemyBoats)
         renderHit(event)
      } else {
         $('.messageEnemy').text(`Misssssed....`);
         renderMiss(event)
      }
      userTurn = !userTurn
      $('.enemySq').css('cursor','not-allowed')
      // $(`.hero`).css(`border`,`2px solid yellow`)
      // $(`.enemy`).css(`border`,`2px solid transparent`)
      return gamePlay();
   }
}
const menuIn = (event) => {
   //console.log('menu in')
   $('#mySidenav').css('width','300px');
}
const menuOut = (event) => {
   //console.log('menu Out');
   $('#mySidenav').css('width','0px');
}
const showNav = (event) => {
   //console.log('showNav firing');
   let navItem = $(event.currentTarget).children();
   navItem.show(`slow`)
   $(event.currentTarget).off()
   $(event.currentTarget).on('click',unShowNav)
}
const unShowNav = (event) => {
   let navItem = $(event.currentTarget).children();
   navItem.hide('slow')
   $(event.currentTarget).off()
   $(event.currentTarget).on('click',showNav)
}

// === Henderler Dependencies ===
const renderBoatHover = (event) => {
   //console.log(`renderBoatHover firing`);
   $(event.currentTarget).addClass('bg')
   let row = getRow(event);
   let col = getCol(event);
   let cnt = availBoats[0][1]-1
   //console.log(row, col, cnt);
   if (!vertical) {
      let $div = $(event.currentTarget).siblings()
      for (let i = 0; i < $div.length; i++) {
         let id = $($div[i]).attr('id')
         //console.log(id);
         if ( id > col && cnt > 0 ) {
            $($div[i]).addClass('bg')
            cnt--
         }
      }
   } else {
      let $col = $('.heroSq').filter(`#${col}`)
      for (let i = 0; i < $col.length; i++) {
         let tmpRow = $($col[i]).attr('class').split(' ')[1]
         //console.log(id);
         if ( tmpRow > row && cnt > 0 ) {
            $($col[i]).addClass('bg')
            cnt--
         }
      }
   }
}
const deRenderBoatHover = (event) => {
   //console.log(`DErenderBoatHover firing`);
   $(event.currentTarget).removeClass('bg')
   let row = getRow(event);
   let col = getCol(event);
   let cnt = availBoats[0][1]-1
   //console.log(row, col, cnt);
   if (!vertical) {
      let $div = $(event.currentTarget).siblings()
      for (let i = 0; i < $div.length; i++) {
         let id = $($div[i]).attr('id')
         //console.log(id);
         if ( id > col && cnt > 0 ) {
            $($div[i]).removeClass('bg')
            cnt--
         }
      }
   } else {
      let $col = $('.heroSq').filter(`#${col}`)
      for (let i = 0; i < $col.length; i++) {
         let tmpRow = $($col[i]).attr('class').split(' ')[1]
         //console.log(id);
         if ( tmpRow > row && cnt > 0 ) {
            $($col[i]).removeClass('bg')
            cnt--
         }
      }
   }
}
const getRow = (event) => {
   return Number($(event.currentTarget).attr('class').split(' ')[1]);
}
const getCol = (event) => {
   return Number($(event.currentTarget).attr('id'));
}
const letsPlay = () => {
   killBoatPlaceClicks();
   if (!devMode) {
      buildBoard(`enemy`, size, userShot);
      placeEnemyBoats();
      $(`.enemyHeader`).text(`Enemy Boats`)
   }
   genCompShotOpt();
   $('.messageEnemy').text(`Alright, Let's Play!`)
   $('.messageHero').text(``);
   return gamePlay();
}
const renderHit = (event) => {
   $(event.currentTarget).off();
   $(event.currentTarget).addClass(`hit`);
}
const renderMiss = (event) => {
   $(event.currentTarget).off();
   $(event.currentTarget).addClass(`miss`)
}
const userMessageHit = () => {
   //console.log(`userMessageHit`);
   $('.messageHero').text(`that's a hit... `)
}
const userMessageMiss = () => {
   //console.log(`userMessageMiss`);
   $('.messageHero').text(`Missed!`)
}
const renderUserShotHover = (event) => {
   $(event.currentTarget).addClass(`us`)
}
const deRenderUserShotHover = (event) => {
   $(event.currentTarget).removeClass(`us`)
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
      if (vertical) {
         for (let i = 0; i < this.length; i++) {
            this.position[i] = [row + i, col]
            this.hit.push(false)
         }
      } else {
         for (let i = 0; i < this.length; i++) {
            this.position[i] = [row, col + i]
            this.hit.push(false)
         }
      }
   }
   damage(opp) {
      //console.log(`this is`, this, opp);
      this.hit.shift();
      this.hit.push(true);
      this.checkForSunk(opp);
      this.renderDamage()
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
      //console.log(`${this.name} Sunk!`);
      //console.log(this);
      opp.splice(opp.indexOf(this),1);
      //console.log(opp);
   }
   renderDamage() {
      let imgId = this.imgId
      let dmgCnt = 0
      for (let i = 0; i < this.length; i++) {
         if (this.hit[i]) {
            dmgCnt++
         }
      }
      if (this.userBoat) {
         $(`#${imgId}`).attr('src',`${imgAddress[imgId][dmgCnt]}`)
         if (dmgCnt === this.length) {
            $(`#${imgId}`).css('background',`rgba(255,34,35,0.5)`)
         }
      } else {
         if (dmgCnt === this.length) {
            //console.log(imgAddress[imgId])
            $(`#${imgId}`).attr('src',`${imgAddress[imgId].sunk}`)
            $(`#${imgId}`).css('background',`rgba(255,34,35,0.5)`)
         }
      }
   }
}

class HeroBoat extends Boat {
   constructor(name, length, imgId) {
      super(name, length, imgId),
      this.userBoat = true
   }
   colorIn(event, row, col) {
      $(event).addClass('bb')
      $(event).off()
      if (vertical) {
         this.colorInVert(row, col)
      } else {
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
   colorInVert(row, col) {
      let $col = $('.heroSq').filter(`#${col}`)
      let cnt = this.length-1
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
      $('.messageHero').text(`${this.name} has been put on the board! Click again to place ${nextBoatName}:`)
   }
}

class EnemyBoat extends Boat {
   constructor(name, length, imgId) {
      super(name, length, imgId)
      this.userBoat = false
   }
   colorIn(row, col) {
      let $enemySq = $(`.enemySq`)
      //console.log($enemySq);
      if (vertical) {
         this.colorInVert(row, col)
      } else {
         let cnt = this.length
         for (let i = 0; i < $enemySq.length; i++) {
            let tmpCol = $($enemySq[i]).attr('id')
            let tmpRow = $($enemySq[i]).attr('class').split(' ')[1]
            //console.log($enemySq, 'cnt', cnt, 'tmpcol', tmpCol, classes);
            if ( cnt > 0 && tmpCol >= col && tmpRow == row) {
               //console.log('yep');
               $($enemySq[i]).addClass('em')
               if (devMode) {
                  $($enemySq[i]).addClass('bb')
               }
               cnt--
            }
         }
      }
   }
   colorInVert(row, col) {
      //console.log(`enemy colorInVert`);
      let $col = $('.enemySq').filter(`#${col}`)
      let cnt = this.length
      //console.log($col);
      for (let i = 0; i < $col.length; i++) {
         let tmpRow = $($col[i]).attr('class').split(' ')[1]
         if ( tmpRow >= row && cnt > 0 ) {
            $($col[i]).addClass('em')
            if (devMode) {
               $($col[i]).addClass('bb')
            }
            cnt--
         }
      }
   }
}

const placeEnemyBoats = () => {
   // vertical = false
   while (availEnemy.length) {
      let newBoatLength = availEnemy[0][1]
      let row = Math.floor(Math.random()*size)
      let col = Math.floor(Math.random()*((size-newBoatLength)+1))
      if ( Math.random() > .5 ) {vertToggle()}
      //console.log('new go', row, col, vertical);
      if (checkConflicts(row, col, `.enemySq`, newBoatLength)) {
         enemyBoats.unshift(new EnemyBoat (availEnemy[0][0],availEnemy[0][1],availEnemy[0][2]));
         console.log(enemyBoats[0].name, enemyBoats[0].position);
         availEnemy.shift();
         enemyBoats[0].posBuild(row, col);
         enemyBoats[0].colorIn(row, col);
         $(`#${enemyBoats[0].imgId}`).removeClass(`notplaced`)
         //console.log(enemyBoats);
      }
   }
   checkInventory();
}

const checkInventory = () => {
   let inven = $(`.enemySq`).filter(`.em`);
   console.log(inven);
   if (inven.length != enemySqSB) {
      alert(`enemy placing issue`);
   };
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
            if ($($row[i]).hasClass('bb') || $($row[i]).hasClass('em')) {
               //console.log(`break row`);
               return false
            } else {
               newBoatLength--
            }
            if (newBoatLength == 0) {
               //console.log(`gow row`);
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
            if ($($col[i]).hasClass('bb') || $($col[i]).hasClass('em')) {
               //console.log('break', `vert`);
               return false
            } else {
               newBoatLength--
            }
            //console.log('new boat length', newBoatLength);
            if (newBoatLength == 0) {
               //console.log(`go vert`);
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
   //console.log('computer shooting');
   let randIndex = Math.floor(Math.random()*compShotOpt.length)
   let target = compShotOpt[randIndex]
   compShotOpt.splice(randIndex, 1)
   //console.log(target);
   let shot = checkHit(target[0], target[1], userBoats);
   $('.messageEnemy').css(`opacity`,`.25`)
   $('.messageHero').css(`opacity`,`1.0`)
   if (shot.t) {
      if (first_go) {
         setTimeout(userMessageHit, 1000)
         first_go = false
      } else { userMessageHit() }
      shot.b.damage(userBoats)
      $(`.heroSq`).filter(`.${target[0]}`).slice(target[1],target[1]+1).addClass(`hit us`)
   } else {
      if (first_go) {
         setTimeout(userMessageMiss, 1000)
         first_go = false
      } else { userMessageMiss() };
      $(`.heroSq`).filter(`.${target[0]}`).slice(target[1],target[1]+1).addClass(`miss us`)
   }
   userTurn = !userTurn
   $('.enemySq').not('.hit, .miss').css('cursor','pointer')
   // $(`.enemy`).css(`border`,`2px solid yellow`)
   // $(`.hero`).css(`border`,`2px solid transparent`)

   checkGameOver();
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

const checkGameOver = () => {
   if ( userBoats.length == 0 ) {
      console.log(`game over user`);
      $('.messageHero').text(`Game over...  :(`);
      showEnemyBoard();
      askReset();
   }
   if ( enemyBoats.length == 0 ) {
      console.log(`game for enemy`);
      $('.messageEnemy').text(`You Won!!!`);
      showEnemyBoard();
      askReset();
   }
}

const showEnemyBoard = () => {
   let $enemySq = $(`.enemySq`).not(".hit, .miss")
   for (let i = 0; i < $enemySq.length; i++) {
      if ($($enemySq[i]).hasClass(`em`)) {
         $($enemySq[i]).addClass(`bb`)
      } else {
         $($enemySq[i]).css(`background-color`,`transparent`)
      }
   }
}

const askReset = () => {
   $('.vert').removeClass(`hide`)
   $('.reset').removeClass(`hide`)
   $('.resetBtn').removeClass(`hide`).on('click',resetBoard)
}

const resetBoard = () => {
   let imgArr = ['cat', 'fish', 'dingy', `traw`, `toon`, `skif`]
   for (let img of imgArr) {
      $(`#${img}`).addClass(`notplaced`);
      $(`#${img}`).attr(`src`,`${imgAddress[img].reset}`)
      $(`#${img}`).css(`background`,``)

   }
   $(`.message`).empty()
   $(`.hero`).empty()
   $(`.enemy`).empty()
   $('.vert').addClass(`hide`)
   $('.reset').addClass(`hide`)
   $('.resetBtn').addClass(`hide`)
   userBoats = [];
   enemyBoats = [];
   availBoats = [['Your Catamaran',3,`cat`],['The Fishing Boat',2,`fish`],['Tender', 1, `dingy`]];
   availEnemy = [['Enemy Trawler', 3,`traw`],['Ol Busted Pontoon', 2, `toon`],['Skiff', 1, `skif`]];
   userTurn = false;
   compShotOpt = [];
   return startGame();
}

const gamePlay = () => {
   //console.log('Game Play:', userBoats, enemyBoats);
   if ( userBoats.length > 0 && enemyBoats.length > 0 ) {
      if (devMode) {computerShot()}
      else {setTimeout(computerShot, 2000)};
   }
   checkGameOver();
   //console.log('userTurn now', userTurn);
}

const startGame = () => {
   $('.messageHero').text("Place your Boats!")
   //$('.messageContainer').addClass(`start`)
   buildBoard(`hero`, size, boatPlacement);
   if (devMode) {
      $('*').css(`border`,`1px solid green`)
      $('.resetBtn').on('click',resetBoard)
      buildBoard(`enemy`, size, userShot);
      placeEnemyBoats();
   }
}

const landing = () => {
   $('.menuImg').on('click',menuIn)
   $('.closebtn').on('click',menuOut)
   $('.navDiv').on('click', showNav)
   if (devMode ) {
      hideGo_n_start();
   } else if (publish) {
      $('.goBtn').on('click',hideGo_n_start);
   }
}

// === WINDOW ON LOAD/PAGE READY ===
$(() => {

landing();

})
