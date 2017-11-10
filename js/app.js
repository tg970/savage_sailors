//console.log($);

// === GLOBAL VARIABLES ===
let userBoard = [];
let enemyBoard = [];
let size = 4;

// === BOARD CONSTRUCTION ===
const buildBoards = (size) => {
   // Build User Board
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass('row')
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass('heroSq').attr('id',`${j}`)
         $sq.addClass(`${i}`)
         //$sq.on('click',boatPlacement)
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
         //$sq.on('click',userShot)
         $container.append($sq)
      };
   $('.enemy').append($container)
   }
}



// === WINDOW ON LOAD/PAGE READY
$(() => {

buildBoards(size)

})
