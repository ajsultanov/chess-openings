/*
    w   w      w           w       w       wwwww        WWWWW 
    w   w      w           w       w         w          W
    w w w      w       w   w       w         w          WWWW 
    ww ww      w       w   w       w         w              W
    w   w      w        www        w         w          WWWW 
*/



const   title = document.getElementById('title')
        title.addEventListener('click', () => console.table(Typewriter.history))
const   text = document.getElementById('text')
        text.addEventListener('keydown', e => { Typewriter.control(e) })
        text.focus()
const   star = document.getElementById('star')
        star.addEventListener('click', () => { Typewriter.clear() })
const   canvas = document.getElementById('canvas')
        canvas.addEventListener('click', () => text.focus())
const   CX = canvas.getContext('2d')
        CX.canvas.width = 800
        CX.canvas.height = 800
const   METAKEYS = ['Shift', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape']

const   scaleFactor = 1
const   letterWidth = 64 * scaleFactor
const   letterHeight = 112 * scaleFactor
const   middle = 5 * letterHeight / 12
const   centerX = letterWidth / 2
const   centerY = letterHeight / 2
const   lineWidth = letterWidth / 3
const   rad = lineWidth / 2
const   ligModifier = 7 / 5
const   lineHeight = letterHeight * (1 + 2 / 5)

function scale(...c) { 
    let    ヤキソバ = c.map(e => e * scaleFactor)
    if    (ヤキソバ.length === 1) return ヤキソバ[0]
                                 return ヤキソバ
}

const Typewriter = {
    cx: CX,
    currentKey: null,
    history: [],

    xCoord: 0,
    yCoord: 0,
    get coords() { return [this.xCoord, this.yCoord] },
    getPrev(n = 1) {
        if (this.history.length === 0) return undefined
        return this.history[this.history.length - n]
    },
    set add(val) { 
        if (val) this.history.push(val)
    },

    control(x) { 
        if (this.returnNext) text.value += '\n'
        this.returnNext = false
        if (!METAKEYS.includes(x.key)) {
            if (x.key === 'Backspace') {
                this.backspace()
                return
            }
            else if (x.key === 'Enter') {
                this.enter()
                return
            }
            else if (x.key === ' ') {
                this.space()
                return
            }
            else if (x.key === '\\') {
                this.lilSpace()
                return
            }
            else if (x.key === '|') {
                this.litlerSpace()
                return
            }
            else if (x.key === '+') {
                this.litlestSpace()
                return
            }
            if (!dictionary[x.key]) return

            // determine if meta character or ligature from history/dictionary
            // get letter width
            // let [width, height] = xyz

            // get canvas from printer
            let cnv = printer.print(x.key)

            // get coordinatesfrom carriage
            // let [xCoord, yCoord] = xyz

            CX.drawImage(cnv, this.xCoord, this.yCoord, letterWidth, letterHeight)
            this.add = {key: x.key, w: letterWidth, x: this.xCoord, y: this.yCoord}

            // based on width
            this.xCoord += letterWidth 

            //return ?
        }
    },
    backspace() {
        let last = this.getPrev()
        if (last) {
            let [x, y, w, h] = [last.x, last.y, last.w, letterHeight]
            CX.clearRect(x, y, w, h)
            this.xCoord = last.x
            this.yCoord = last.y
            this.history.pop()
        }
    },
    enter() {
        this.add = {key: 'enter', w: 0, x: this.xCoord, y: this.yCoord}
        this.xCoord = 0
        this.yCoord += lineHeight
    },
    space() {
        this.add = {key: 'space', w: letterWidth, x: this.xCoord, y: this.yCoord}
        this.xCoord += letterWidth
    },
    lilSpace() {
        this.add = {key: 'lilSpace', w: letterWidth / 2, x: this.xCoord, y: this.yCoord}
        this.xCoord += letterWidth / 2
    },
    litlerSpace() {
        this.add = {key: 'lilSpace', w: letterWidth / 4, x: this.xCoord, y: this.yCoord}
        this.xCoord += letterWidth / 4
    },
    litlestSpace() {
        this.add = {key: 'lilSpace', w: letterWidth / 8, x: this.xCoord, y: this.yCoord}
        this.xCoord += letterWidth / 8
    },
    clear() {
        console.log('here\'s where you would clear everything, history, etc.')
    },
}


const printer = {
    xMin: rad,
    xMax: letterWidth - rad,
    yMin: rad,
    yMax: letterHeight - rad,
    storey1(c) { return !!(c.y < centerY) },
    
    print(letter) {
        let cnv = document.createElement('canvas')
        cnv.width = letterWidth
        cnv.height = letterHeight
        let ncx = cnv.getContext('2d')
        ncx.lineWidth = lineWidth
        ncx.lineCap = 'square'
        ncx.lineJoin = 'miter'

        this.makePath(ncx, letter)
        if (letter.match(/[a-zA-Z]/)) {
            ncx.stroke()
        } else {
            ncx.fill()
        }
    
        return cnv
    },

    makePath(ctx, letter) {
        ctx.beginPath()

        let operation = dictionary[letter]()
        let c = {x: 0, y: 0}
        operation(ctx, c)
    },

    origin(ctx, c) {
        c.x = this.xMin
        c.y = this.yMin
        ctx.moveTo(c.x, c.y)
    },
    resetY(ctx, c) {
        c.y = this.yMin
        ctx.moveTo(c.x, c.y)
    },
    resetX(ctx, c) {
        c.x = this.xMin
        ctx.moveTo(c.x, c.y)
    },
    maxX(ctx, c) {
        c.x = this.xMax
        ctx.moveTo(c.x, c.y)
    },
    skip(ctx, c) {
        if (c.y === this.yMin) {
            c.y = centerY
        }
        else if (c.y === centerY) {
            c.y = this.yMax
        }
        c.x = this.xMin
        ctx.moveTo(c.x, c.y)
    },
    bar(ctx, c) {
        c.x = this.xMax
        ctx.lineTo(c.x, c.y)
    },
    line(ctx, c) {
        if (c.y === this.yMin) {
            c.y = centerY
        }
        else if (c.y === centerY) {
            c.y = this.yMax
        }
        ctx.lineTo(c.x, c.y)
    },
    dot(ctx, c) {
        ctx.arc(c.x, c.y, rad, 0, Math.PI * 2 )
    },
    curve(ctx, c, type) {
        const t = {
            j: { x: 1, y: 1, z: 1 },
            s: { x: 0, y: 1, z: 1 },
            q: { x: 0, y: 1, z: 0},
        }
    
        let L2R = t[type].x
        let firstStory = this.storey1(c)
        let underhand = t[type].z

        if (t[type].z) { c.y = c.y + lineWidth }
        else { c.x = c.x - lineWidth }
        ctx.lineTo(c.x, c.y)

        let [cpx, cpy] = [0, 0]
        if (underhand) {   
            cpx = c.x
            if (firstStory) {   
                cpy = centerY
                c.y = centerY
            } // SV
            else {
                cpy = this.yMax 
                c.y = this.yMax
            } // BHJOYZ
        }
        else {      
            cpx = this.xMin
            if (firstStory) {   
                cpy = c.y
                c.y = centerY - lineWidth
            } // Q
            else {                  
                cpy = centerY
                c.y = this.yMax - lineWidth
            } // X
        }

        if (underhand) {
            if (L2R) { c.x = this.xMax - lineWidth } // JOYZ
            else { c.x = this.xMin + lineWidth } // BHSV
        } else {
            c.x = this.xMin 
        } // QX
        ctx.quadraticCurveTo(cpx, cpy, c.x, c.y)

        if (L2R) { c.x = this.xMax } 
            else { c.x = this.xMin }
        if (firstStory) { c.y = centerY } 
                   else { c.y = this.yMax }
        ctx.lineTo(c.x, c.y)
    },
    // xFix(ctx, c) {
    //     c.x = letterWidth
    //     ctx.lineTo(c.x, c.y)
    // },
    shFix(ctx, c) {
        c.x = 0
        ctx.lineTo(c.x, c.y)
    },
}



const dictionary = {
    a() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            ctx.stroke()
        }
    },
    b() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
        }
    },
    c() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
        }
    },
    d() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
        }   
    },
    e() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
        }   
    },
    f() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
        }
    },
    g() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
        }   
    },
    h() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
        }   
    },
    i() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
        }   
    },
    j() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.curve(ctx, c, 'j')
        }   
    },
    k() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
        }   
    },
    l() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
        }   
    },
    m() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
            printer.line(ctx, c)
        }   
    },
    n() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
        }   
    },
    o() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
            printer.curve(ctx, c, 'j')
        }   
    },
    p() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
        }
    },
    q() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.maxX(ctx, c)
            printer.curve(ctx, c, 'q')
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
        }   
    },
    r() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
        }   
    },
    s() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
        }   
    },
    t() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
        }
    },
    u() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
        }
    },
    v() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
            printer.line(ctx, c)
        }   
    },
    w() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.line(ctx, c)
        }
    },
    x() {
        // return function(ctx, c) {
        //     printer.origin(ctx, c)
        //     printer.curve(ctx, c, 'j')
        //     printer.xFix(ctx, c)
        //     printer.curve(ctx, c, 'q')
        // }   
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.skip(ctx, c)
            printer.maxX(ctx, c)
            printer.curve(ctx, c, 'q')
            printer.origin(ctx, c)
            printer.curve(ctx, c, 'j')
        } 
    },
    y() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.curve(ctx, c, 'j')
        }   
    },
    z() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.curve(ctx, c, 'j')
        }   
    },





    1() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.dot(ctx, c)
        }
    },
    2() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.dot(ctx, c)
            printer.skip(ctx, c)
            printer.dot(ctx, c)
        }
    },
    3() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
        }
    },
    C() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            // draw curve
            printer.resetX(ctx, c)
            // reset y   
            printer.line(ctx, c)
        }  
    },
    S() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
            printer.shFix(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
        } 
    },
    T() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
        }  
    },
 
}

// tests
let strings = ['wijit', '']
for (const string of strings) {
    if (!string) {
        Typewriter.yCoord -= lineHeight
    }
    for (let i = 0; i < string.length; i++) {
        let temp = printer.print(string[i])
        CX.drawImage(temp, letterWidth * i, Typewriter.yCoord, letterWidth, letterHeight)
    }
    Typewriter.yCoord += lineHeight
}