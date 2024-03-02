import './style.css'

// continue with 12:00 https://www.youtube.com/watch?v=pNiyz0sl1no

const canvas = document.querySelector('canvas')
const context = canvas?.getContext('2d')

// if (canvas === null || context == null) {
//   console.error('Can not find context or canvas')
//   throw new Error('Can not find context or canvas')
// }

function assertIsDefined<T> (val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      `Expected 'val' to be defined, but received ${String(val)}`
    )
  }
}
assertIsDefined(canvas)
assertIsDefined(context)

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// game loop
function update (timeElapsed?: number): void {
  draw()

  assertIsDefined(timeElapsed)
  // console.log(timeElapsed)

  if (timeElapsed < 1000) {
    window.requestAnimationFrame(update)
  }
}

const _row = Array(BOARD_WIDTH).fill(0)
const _col = Array(BOARD_HEIGHT).fill(0)

const board: Array<Array<0 | 1>> = Array.from(_col, () => [..._row])
type boardT = typeof board

const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ] as Array<Array<0 | 1>>
}
type pieceT = typeof piece

function drawPiece (piece: pieceT, board: boardT): void {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      const value = piece.shape[y][x]
      board[piece.position.x + x][piece.position.y + y] = value
    }
  }
}

function draw (): void {
  assertIsDefined(canvas)
  assertIsDefined(context)

  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] !== 1) { continue }
      context.fillStyle = 'yellow'
      context.fillRect(x, y, 1, 1)
    }
  }

  piece.shape.forEach()
}

update(0)
