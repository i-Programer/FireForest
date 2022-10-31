const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const gravity = 0.7

canvas.width = window.innerWidth
canvas.height = window.innerHeight

console.log(canvas.width)
console.log(canvas.height)

let score = 0

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    scale: 1,
    imageSrc: './img/background.png'
})

const player = new Player({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/fireKnight/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/fireKnight/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/fireKnight/Walk.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/fireKnight/Jump.png',
            framesMax: 3
        },
        fall: {
            imageSrc: './img/fireKnight/Fall.png',
            framesMax: 3
        },
        attack1: {
            imageSrc: './img/fireKnight/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/fireKnight/Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/fireKnight/Death.png',
            framesMax: 11
        }
    },
    attackBox: {
        offset: {
            x: 0,
            y: 50
        },
        width: 200,
        height: 100
    }
})

const enemy = new Enemy({
    position: {
        x: 1000,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/DemonBoss/Idle.png',
    framesMax: 6,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/DemonBoss/Idle.png',
            framesMax: 6
        },
        run: {
            imageSrc: './img/DemonBoss/Walk.png',
            framesMax: 12
        },
        attack1: {
            imageSrc: './img/DemonBoss/Walk.png',
            framesMax: 12
        },
        takeHit: {
            imageSrc: './img/DemonBoss/TakeHit.png',
            framesMax: 5
        },
        death: {
            imageSrc: './img/DemonBoss/Death.png',
            framesMax: 22
        }
    },
    attackBox: {
        offset: {
            x: -50,
            y: 50
        },
        width: 200,
        height: 100
    }
})

gameTimer()

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}



function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    c.fillStyle = 'rgba(255,255,255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update()
    enemy.attack()

    if (enemy.position.x <= 5) {
        enemy.position.x = 1000;
    }

    player.velocity.x = 0
    enemy.velocity.x = 0

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    if (!enemy.dead) {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else {
        enemy.position.x = 1000
        enemy.velocity.x = 0
    }

    if (enemy.dead) {
        enemy.health = 20
        enemy.swithSprite('run')
    }

    if (rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isAttacking) {
        enemy.takeHit()
        score += 1
        player.isAttacking = false
    }

    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    if (rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && enemy.isAttacking && enemy.framesCurrent === 4) {
        player.takeHit()
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    document.querySelector('#score').innerHTML = score
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case ' ':
      player.attack()
      break
  }
})