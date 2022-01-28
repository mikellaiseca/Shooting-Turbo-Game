class Enemy1 {
    constructor(ctx, posX, posY, width, height, gameSize) {
        this.ctx = ctx
        this.enemy1Pos = {x: posX, y: posY}
        this.enemy1Size = {w: width, h: height}
        this.enemy1Vel = {x: 10, y: 1}
        this.enemy1Physics = {gravity: .5}
        this.gameSize = gameSize
        this.enemy1Lives = 1
        this.dead = false
        
        this.imageInstance = undefined
        

        this.init()
    }

    init() {
        this.imageInstance = new Image()
        this.imageInstance.src = "images/Bat.png"
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
            this.enemy1Pos.x,
            this.enemy1Pos.y,
            this.enemy1Size.w,
            this.enemy1Size.h 
        )
        this.animate(framesCounter)
    }

    animate(framesCounter) {
        if (framesCounter % 3 === 0) {
            this.imageInstance.framesIndex++
        }

        if (this.imageInstance.framesIndex >= this.imageInstance.frames) {
            this.imageInstance.framesIndex = 0
        }
    }

    move() {
        this.enemy1Pos.x += this.enemy1Vel.x
        
        this.enemy1Vel.y += this.enemy1Physics.gravity
        this.enemy1Pos.y += this.enemy1Vel.y
        this.checkCollision()
    }

    checkCollision() {
        if (this.enemy1Pos.y >= this.gameSize.h - this.enemy1Size.h) {
            this.enemy1Vel.y += -6
        }

        if (this.enemy1Pos.y <= 0) {
            this.enemy1Vel.y *= -1
        }
    }
}