class Enemy2 {
    constructor(ctx, posX, posY, width, height, gameSize) {
        this.ctx = ctx
        this.enemy2Pos = {x: posX, y: posY}
        this.enemy2Size = {w: width, h: height}
        this.enemy2Vel = {x: 5, y: 1}
        this.enemy2Physics = {gravity: .5}
        this.gameSize = gameSize
        this.enemy2Lives = 2
        this.dead = false
        this.imageInstance = undefined
        

        this.init()
        
    }

    init() {
        this.imageInstance = new Image()
        this.imageInstance.src = "images/BigBat.png"
        this.imageInstance.frames = 4
        this.imageInstance.framesIndex = 0
    }

    draw(framesCounter) {
        this.ctx.drawImage(
            this.imageInstance,
            this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames),
            0,
            this.imageInstance.width / this.imageInstance.frames,
            this.imageInstance.height,
            this.enemy2Pos.x,
            this.enemy2Pos.y,
            this.enemy2Size.w,
            this.enemy2Size.h 
        )
        this.animate(framesCounter)
    }

    animate(framesCounter) {
        if (framesCounter % 8 === 0) {
            this.imageInstance.framesIndex++
        }

        if (this.imageInstance.framesIndex >= this.imageInstance.frames) {
            this.imageInstance.framesIndex = 0
        }
    }

    move() {
        this.enemy2Pos.x += this.enemy2Vel.x

        this.enemy2Pos.x += this.enemy2Vel.x
        
        this.enemy2Vel.y += this.enemy2Physics.gravity
        this.enemy2Pos.y += this.enemy2Vel.y
        this.checkCollision()
    }

    checkCollision() {
        if (this.enemy2Pos.y >= this.gameSize.h - this.enemy2Size.h) {
            this.enemy2Vel.y += -6
        }

        if (this.enemy2Pos.y <= 0) {
            this.enemy2Vel.y *= -1
        }
    }
}