import './style.css'

const canvas = document.querySelector('canvas')
const context = canvas?.getContext('2d')
const scoreElement = document.querySelector('#score')
let score = 0

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

const SPEED_MODULE = 500

const BACKGROUND = '#232634'
const PIECE_COLOR = '#ef9f76'
const PIECE_BORDER_COLOR = '#737994'
const SOLID_COLORS = '#8caaee'

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// game loop
let dropCounter = 0
let lastTime = 0
function update (time: number): void {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > (SPEED_MODULE / ((score / 30) + 1))) {
    piece.position.y++
    dropCounter = 0

    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  assertIsDefined(time)
  window.requestAnimationFrame(update)
}

const _row = Array(BOARD_WIDTH).fill(0)
const _col = Array(BOARD_HEIGHT).fill(0)

const board: Array<Array<0 | 1>> = Array.from(_col, () => [..._row])
// type boardT = typeof board

board[29].forEach((_val, x) => {
  board[29][x] = 1
})

board[28].forEach((_val, x) => {
  board[28][x] = 1
})

board[27].forEach((_val, x) => {
  board[27][x] = 1
})

// board[26].forEach((_val, x) => {
//   board[26][x] = 1
// })

board[29][4] = 0
board[28][4] = 0
board[27][4] = 0
board[26][4] = 0

const piece = {
  position: { x: 4, y: 10 },
  shape: [
    [1, 1, 1, 1]
  ] as Array<Array<0 | 1>>
}
type pieceT = typeof piece

function draw (): void {
  assertIsDefined(canvas)
  assertIsDefined(context)

  context.fillStyle = BACKGROUND
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] !== 1) { continue }
      context.fillStyle = SOLID_COLORS
      context.fillRect(x, y, 1, 1)
      context.lineWidth = 0.01
      context.strokeStyle = PIECE_BORDER_COLOR
      context.strokeRect(x, y, 1, 1)
    }
  }

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = PIECE_COLOR
        context.lineWidth = 0.01
        context.strokeStyle = PIECE_BORDER_COLOR
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
        context.strokeRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    piece.position.x--
    if (checkCollision()) {
      piece.position.x++
    }
  }
  if (event.key === 'ArrowRight') {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }
  if (event.key === 'ArrowDown') {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  if (event.key === 'ArrowUp') {
    const newPieceShape: pieceT['shape'] = []
    for (let x = 0; x < piece.shape[0].length; x++) {
      const newRow: Array<1 | 0> = []
      for (let y = piece.shape.length - 1; y >= 0; y--) {
        newRow.push(piece.shape[y][x])
      }
      newPieceShape.push(newRow)
    }
    const previousShape = piece.shape
    piece.shape = newPieceShape
    if (checkCollision()) {
      piece.shape = previousShape
    }
  }
})

function checkCollision (): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] === 0) continue

      if (board[piece.position.y + y] === undefined) {
        return true
      }

      if (board[piece.position.y + y][piece.position.x + x] !== 0) {
        return true
      }
    }
  }
  return false
}

function solidifyPiece (): void {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    }
  }

  // reset position
  piece.position.y = 0
  piece.position.x = 0

  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  if (checkCollision()) {
    window.alert('Game Over !')
    board.forEach(row => row.fill(0))
  }
}

function removeRows (): void {
  let combo = 0
  for (let y = 0; y < board.length; y++) {
    if (board[y].every(value => value === 1)) {
      combo = combo + 1
      for (let i = y; i >= 0; i--) {
        if (i === 0) {
          board[i] = Array(BOARD_WIDTH).fill(0)
          continue
        }
        board[i] = board[i - 1]
      }
    }
  }
  score = (score + (combo * (10 + combo - 1)))
  if (scoreElement == null) return
  scoreElement.textContent = String(score)
}

update(0)

const PIECES: Array<pieceT['shape']> = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [0, 0, 1],
    [1, 1, 1]
  ]
]
