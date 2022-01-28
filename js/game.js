const shootingGame = {
    appName: 'Shooting Game',
    author: 'Mikel Laiseca & Roberto Cadenas',
    version: '1.0.0',
    license: undefined,
    canvas: document.querySelector("#myCanvas"),
    gameSize: {w: undefined, h: undefined},
    ctx: undefined,
    background: undefined,
    framesCounter: 0,
    intervalId: undefined,
    lives: 10,
    score: 0,
    turboScore: 0,
    turboCounter: 0,
    turboBoolean: false,
    countDown: 15,
    countDownCounter: 0,
    enemy1: [],
    enemy2: [],
    bonus: [],
    turboMode: false,
    audio: document.querySelector("audio"),

    init() {
        this.setContext()
        this.setSize()
        this.createBackground()
        this.changeCursor()
        this.drawAll()
        this.takeCoor()
    },

    // CONTEXT AND SIZE /////////////////////////////////////////

    setContext() {
        this.ctx = document.querySelector("#myCanvas").getContext("2d")
    },

    setSize() {
        this.gameSize = {
            w: window.innerWidth,
            h: 600
        }
        document.querySelector("#myCanvas").setAttribute("width", this.gameSize.w)
        document.querySelector("#myCanvas").setAttribute("height", this.gameSize.h)
    },

    // BACKGROUND /////////////////////////////////////////

    createBackground() {
        this.background = new Background(this.ctx, this.gameSize.w, this.gameSize.h)
    },

    bgAudio() {
        this.audio.play()
    },

    // ENEMIES /////////////////////////////////////////

    createEnemy1() {
        if (this.framesCounter % 60 === 0) {
            this.enemy1.push(new Enemy1(
                this.ctx,
                0,
                Math.random() * this.gameSize.h,
                100,
                100,
                this.gameSize
            ))
            
        }
    },

    createEnemy2() {

        if (this.framesCounter % 100 === 0) {
            this.enemy2.push(new Enemy2(
                this.ctx,
                0,
                Math.random() * this.gameSize.h,
                150,
                150,
                this.gameSize
            ))
            
        }
    },

    // DRAW ALL (INTERVAL) /////////////////////////////////////////

    drawAll() {
        this.intervalId = setInterval(() => {
            this.clearAll()
            this.background.draw()
            this.createEnemy1()
            this.createEnemy2()
            this.loseLives()
            this.enemy1Score()
            this.enemy2Score()
            if (this.lives <= 0) {
                this.gameOver()
            }

            // ENEMIES AND BONUS /////////////////////////////////////////
            
            this.enemy1.forEach(elm => {
                elm.move()
                elm.draw(this.framesCounter)
            })
            this.enemy2.forEach(elm => {
                elm.move()
                elm.draw(this.framesCounter)
            })

            this.bonus.forEach(elm => {
                elm.move()
                elm.draw()
            })

            // AVOID LOOP ADDING 1 TO SCORE WHEN ENTERING TURBO MODE /////////////////////////////////////////

            if (this.score % 20 === 0 && this.score != 0) {
                this.turboMode = true
                this.score += 1
                this.audio.playbackRate = 1.25
                this.background.updateSpeed(30)
            }

            // RETURN THE CURSOR TO THE INITIAL IMAGE /////////////////////////////////////////
            if (!this.turboMode && document.querySelector("canvas.active")) {
                document.querySelector("canvas.active").className = "inactive"
                this.turboBoolean = false
                this.audio.playbackRate = 1
                this.background.updateSpeed(10)
            }

            // TURBO MODE STARTS /////////////////////////////////////////

            if (this.turboMode) {
                this.countDownCounter++

                if (!this.turboBoolean) {
                    this.turboCounter++
                    this.turboBoolean = true
                }

                

                // CHANGE THE CURSOR TO THE TURBO MODE /////////////////////////////////////////

                if (document.querySelector("canvas.inactive")) {
                    document.querySelector("canvas.inactive").className = "active"
                }

                // CREATE ENEMIES AND BONUS /////////////////////////////////////////

                if (this.framesCounter % 20 === 0) {
                    this.enemy1.push(new Enemy1(
                        this.ctx,
                        0,
                        Math.random() * this.gameSize.h,
                        100,
                        100,
                        this.gameSize
                    ))
                    
                }

                if (this.framesCounter % 20 === 0) {
                    this.enemy2.push(new Enemy2(
                        this.ctx,
                        0,
                        Math.random() * this.gameSize.h,
                        150,
                        150,
                        this.gameSize
                    ))
                    
                }

                if (this.framesCounter % 200 === 0) {
                    this.bonus.push(new Bonus(
                        this.ctx,
                        0,
                        Math.random() * this.gameSize.h,
                        100,
                        100,
                        this.gameSize
                    ))
                    
                }

                // KILL ENEMIES AND BONUS /////////////////////////////////////////

                document.querySelector(".turbo-score span").innerHTML = this.turboScore
                this.enemy1.forEach(elem => {
                    if (elem.enemy1Lives <= 0) {
                        this.turboScore += 1
                        elem.dead = true
                            
                    }
                })

                this.enemy2.forEach(elem => {
                    if (elem.enemy2Lives <= 0) {
                        this.turboScore += 2
                        elem.dead = true
                    }
                })

                this.bonus.forEach(elem => {
                    if (elem.bonusLives <= 0) {
                        this.enemy1.forEach(elem => {
                            elem.enemy1Vel = {x: 4, y: 1}
                        })

                        this.enemy2.forEach(elem => {
                            elem.enemy2Vel = {x: 2, y: 1}
                        })
                        elem.dead = true
                    }
                })
            }

            // COUNTDOWN /////////////////////////////////////////

            if(this.countDownCounter % 375 === 0) {
                this.turboMode = false
                this.countDownCounter = 0
                this.countDown = 15
            }

            if (this.countDownCounter % 25 === 0 && this.countDownCounter != 0) {
                this.countDown -= 1
            }

            document.querySelector(".count-down span").innerHTML = this.countDown

            this.framesCounter++
        }, 40)
        
    },

    // CLEAR ALL /////////////////////////////////////////

    clearAll() {
        this.ctx.clearRect(0, 0, this.gameSize.w, this.gameSize.h)
        this.clearEnemies()
    },

    // COLLISION /////////////////////////////////////////

    takeCoor() {
        let coords = document.querySelector("#myCanvas")
        
        

        const logKey = (e) => {

            this.bgAudio()

            
            if(this.turboMode && e.type === "mousemove" || !this.turboMode && e.type === "click") {
                coords.innerText = `Screen X/Y: ${e.screenX} ${e.screenY}`
                this.enemy1.forEach(elem => {
                    if (elem.enemy1Pos.x < e.clientX &&
                        elem.enemy1Pos.x + elem.enemy1Size.w > e.clientX &&
                        elem.enemy1Pos.y < e.clientY &&
                        elem.enemy1Size.h + elem.enemy1Pos.y > e.clientY) {
                        elem.enemy1Lives--
                    }
                })

                this.enemy2.forEach(elem => {
                    if (elem.enemy2Pos.x < e.clientX &&
                        elem.enemy2Pos.x + elem.enemy2Size.w > e.clientX &&
                        elem.enemy2Pos.y < e.clientY &&
                        elem.enemy2Size.h + elem.enemy2Pos.y > e.clientY) {
                        elem.enemy2Lives--
                    }
                })

                this.bonus.forEach(elem => {
                    if (elem.bonusPos.x < e.clientX &&
                        elem.bonusPos.x + elem.bonusSize.w > e.clientX &&
                        elem.bonusPos.y < e.clientY &&
                        elem.bonusSize.h + elem.bonusPos.y > e.clientY) {
                        elem.bonusLives--
                    }
                })
            }
               
        }  
        document.addEventListener("click", logKey)
        document.addEventListener("mousemove", logKey)
    },

    // KILL ENEMIES /////////////////////////////////////////

    loseLives() {
        document.querySelector(".lives span").innerHTML = this.lives
        if (this.enemy1.some(elem => {
            return elem.enemy1Pos.x >= elem.gameSize.w
           
       })) {
            this.lives -= 1
        }

        if (this.enemy2.some(elem => {
            return elem.enemy2Pos.x >= elem.gameSize.w
           
       })) {
            this.lives -= 2
        } 
        
        if (this.bonus.some(elem => {
            return elem.bonusPos.x >= elem.gameSize.w
        })) {
            this.lives -= 1
        }


    },

    // SCORE /////////////////////////////////////////

    enemy1Score() {
        document.querySelector(".score span").innerHTML = this.score

        if (this.turboMode === false) {
            this.enemy1.forEach(elem => {
                if (elem.enemy1Lives <= 0) {
                    this.score += 1
                    elem.dead = true
                }
            })
        }
        
    },

    enemy2Score() {
        document.querySelector(".score span").innerHTML = this.score

        if (this.turboMode === false) {
            this.enemy2.forEach(elem => {
                if (elem.enemy2Lives <= 0) {
                    this.score += 2
                    elem.dead = true
                }
            })
        }
        
    },

    // CHANGE CURSOR TO IMAGE /////////////////////////////////////////

    changeCursor() {
        document.querySelector("canvas.inactive").style.cursor = ""
    },

    turboCursor() {
        document.querySelector("canvas.active").style.cursor = ""
    },

    // GAME OVER /////////////////////////////////////////

    gameOver() { 
        clearInterval(this.intervalId)
        document.querySelector(".total-score span").innerHTML = this.score + this.turboScore - this.turboCounter
        document.querySelector(".game-div").style.display = "none"
        document.querySelector(".main").style.display = "flex"
        document.querySelector("#myCanvas").style.cursor = "none"
        this.audio.muted = true
        
    },

    // CLEAR ENEMIES /////////////////////////////////////////

    clearEnemies() {
        this.enemy1 = this.enemy1.filter(elm => elm.enemy1Pos.x <= this.gameSize.w  && !elm.dead)
        this.enemy2 = this.enemy2.filter(elm => elm.enemy2Pos.x <= this.gameSize.w  && !elm.dead)
        this.bonus = this.bonus.filter(elm => elm.bonusPos.x <= this.gameSize.w && !elm.dead && this.turboMode)
    }
}