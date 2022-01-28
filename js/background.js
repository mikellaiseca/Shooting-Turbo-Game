class Background {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    
        
    
        this.posX = 0;
        this.posY = 0;
    
        this.velX = 10;

        this.init()
      }

      init() {
        this.image = new Image();
        this.image.src = "images/sky.png";
      }
    
      draw() {
        this.ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        this.ctx.drawImage(this.image, this.posX + this.width, this.posY, this.width, this.height);
        this.move()
      }
    
      move() {
        if (this.posX <= -this.width) {
          this.posX = 0;
        }
        this.posX -= this.velX;
      }

      updateSpeed(value) {
        this.velX = value
      }
}