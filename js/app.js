//console.log($);

// === GLOBAL VARIABLES ===
let userBoats = [];
let enemyBoats = [];
let boats = 3;
let size = 4;
let availBoats = [['Tender', 1],['Fishing',2],['Cat',3]]

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
}

// === CLICK HANDERLERS ===

const userShot = (event) => {
   console.log('click enemy square');
}

const boatPlacement = (event) => {
   if (boats > 0) {
      let row = $(event.currentTarget).attr('class').split(' ')[1];
      let col = $(event.currentTarget).attr('id');
      userBoats.unshift(new Boat (availBoats[0][0],availBoats[0][1]));
      availBoats.shift();
      boats--
      console.log(userBoats, availBoats, boats);
   }
   if (boats == 1) {

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
   posBuild(event) {
      for (let i = 0; i < this.length; i++) {
         //this.position[i] = event click handler + i
         //this.hit.push(false)
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
