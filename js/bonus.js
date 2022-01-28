class Bonus {
    constructor(ctx, posX, posY, width, height, gameSize) {
        this.ctx = ctx
        this.bonusPos = {x: posX, y: posY}
        this.bonusSize = {w: width, h: height}
        this.bonusVel = {x: 15, y: 1}
        this.bonusPhysics = {gravity: .5}
        this.gameSize = gameSize
        this.bonusLives = 1
        this.dead = false

        this.imageInstance = undefined

        this.init()
    }

    init() {
        this.imageInstance = new Image()
        this.imageInstance.src = "images/sand.png"
    }

    draw() {
        this.ctx.drawImage(this.imageInstance, this.bonusPos.x, this.bonusPos.y, this.bonusSize.w, this.bonusSize.h)
    }

    move() {
        this.bonusPos.x += this.bonusVel.x
        
        this.bonusVel.y += this.bonusPhysics.gravity
        this.bonusPos.y += this.bonusVel.y
        this.checkCollision()
    }

    checkCollision() {
        if (this.bonusPos.y >= this.gameSize.h - this.bonusSize.h) {
            this.bonusVel.y += -6
        }

        if (this.bonusPos.y <= 0) {
            this.bonusVel.y *= -1
        }
    }
}