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
const   lineWidth = letterWidth / 4
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
            let [letter, width, height] = carriage.resolve(x.key)

            // get canvas from printer
            if (dictionary[letter]) {
                let cnv = printer.print(letter, width)
                
                // get coordinatesfrom carriage
                let [xCoord, yCoord] = carriage.spacing(letter)
                
                CX.drawImage(cnv, xCoord, yCoord, width, letterHeight)
                this.add = {key: letter, w: width, x: xCoord, y: yCoord}
                
                // based on width
                this.xCoord = xCoord + width 
                
            } else { console.log('not here!!!!') }
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
    enter(s) {
        let sc = s || 1
        this.add = {key: 'enter', w: 0, x: this.xCoord, y: this.yCoord}
        this.xCoord = 0
        this.yCoord += lineHeight * sc
    },
    space() {
        this.add = {key: 'space', w: letterWidth, x: this.xCoord, y: this.yCoord}
        this.xCoord += letterWidth
    },
    lilSpace() {
        this.add = {key: 'lilSpace', w: letterWidth / 2, x: this.xCoord, y: this.yCoord}
        // this.xCoord += letterWidth / 2
        // using this to break up ligatures
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











const carriage = {
    some: 0,
    stuff: 1,

    resolve(key) {
        let [width, height] = [letterWidth, letterHeight]
        let letter = key

        if (key === 'h') {
            let lig = `${Typewriter.getPrev()?.key}h`
            console.log(lig)
            if (dictionary[lig]) {
                letter = lig
                Typewriter.backspace()
                if (!['sh', 'th'].includes(letter)) {
                    width = width * ligModifier
                }
            }
        }
        if (dictionary.tags.spacers.includes(letter)) {
            width = letterWidth / 2
        } // MT
        if (dictionary.tags.hbConnectors.includes(letter)) {
            if (['b', 'h'].includes(Typewriter.getPrev()?.key)) {
                // dont want to make ligatures for each ~ overlay is fine
                // still need to sub 'ha' or 'bt or whatever into history
            }
        }

        else { letter = dictionary[letter] ? letter : null }
        return [letter, width, height]
    },


    spacing(letter) {
        let [x, y] = [Typewriter.xCoord, Typewriter.yCoord]

        if (dictionary.tags.supershort.includes(letter)) {
            if (dictionary.tags.antisupershort.includes(Typewriter.getPrev()?.key)) {
                x -= lineWidth
            }
        }
        else if (dictionary.tags.short.includes(letter)) {
            if (dictionary.tags.antishort.includes(Typewriter.getPrev()?.key)) {
                x -= lineWidth
            }
        }

        // ligatures = more space, i.e. if prev letter.length > 1, xcoord++
        
        return [x, y]
    },
}












const printer = {
    xMin: rad,
    xMax(width) { return width - rad },
    yMin: rad,
    yMax(height) { return height - rad },
    storey1(c) { return !!(c.y < centerY) },
    
    print(letter, width, canvas) {
        let cnv = canvas || document.createElement('canvas')
        cnv.width = width || letterWidth
        cnv.height = letterHeight
        let ncx = cnv.getContext('2d')
        ncx.lineWidth = lineWidth
        ncx.lineCap = 'square'
        ncx.lineJoin = 'miter'
        
        if (canvas) {
            let grad = ncx.createLinearGradient(0, 0, 0, cnv.height)
            grad.addColorStop(0, '#ccf')
            grad.addColorStop(.5, '#aad')
            ncx.strokeStyle = grad
        }

        this.makePath(ncx, letter)
        
        if (letter.match(/[\w]/)) {
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
        if (this.storey1(c)) {
            c.y = this.yMin
        } else { c.y = centerY }
        ctx.moveTo(c.x, c.y)
    },
    resetX(ctx, c) {
        c.x = this.xMin
        ctx.moveTo(c.x, c.y)
    },
    maxX(ctx, c) {
        c.x = this.xMax(ctx.canvas.width)
        ctx.moveTo(c.x, c.y)
    },
    skip(ctx, c) {
        if (c.y === this.yMin) {
            c.y = centerY
        }
        else if (c.y === centerY) {
            c.y = this.yMax(ctx.canvas.height)
        }
        c.x = this.xMin
        ctx.moveTo(c.x, c.y)
    },
    bar(ctx, c) {
        c.x = this.xMax(ctx.canvas.width)
        ctx.lineTo(c.x, c.y)
    },
    line(ctx, c) {
        if (c.y === this.yMin) {
            c.y = centerY
        }
        else if (c.y === centerY) {
            c.y = this.yMax(ctx.canvas.height)
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
                cpy = this.yMax(ctx.canvas.height)
                c.y = this.yMax(ctx.canvas.height)
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
                c.y = this.yMax(ctx.canvas.height) - lineWidth
            } // X
        }

        if (underhand) {
            if (L2R) { c.x = this.xMax(ctx.canvas.width) - lineWidth } // JOYZ
            else { c.x = this.xMin + lineWidth } // BHSV
        } else {
            c.x = this.xMin 
        } // QX
        ctx.quadraticCurveTo(cpx, cpy, c.x, c.y)

        if (L2R) { c.x = this.xMax(ctx.canvas.width) } 
            else { c.x = this.xMin }
        if (firstStory) { c.y = centerY } 
                   else { c.y = this.yMax(ctx.canvas.height) }
        ctx.lineTo(c.x, c.y)
    },
    // xFix(ctx, c) {
    //     c.x = letterWidth
    //     ctx.lineTo(c.x, c.y)
    // },
    shortCurve(ctx, c) {
        let cpx = c.x
        let cpy = this.yMax(ctx.canvas.height) - rad
        let cpx2 = c.x - rad
        let cpy2 = this.yMax(ctx.canvas.height)
        c.x = centerX * ligModifier
        c.y = this.yMax(ctx.canvas.height)
        // ctx.bezierCurveTo(cpx, cpy, cpx2, cpy2, c.x, c.y)
        ctx.quadraticCurveTo(cpx, cpy, c.x, c.y)
    },
    zhCurve(ctx, c) {
        let cpx = c.x
        let cpy = this.yMax(ctx.canvas.height) * 1.142857 + 1
        let cpx2 = this.xMin
        let cpy2 = this.yMax(ctx.canvas.height) * 1.142857 + 1
        c.x = this.xMin
        c.y = centerY
        ctx.bezierCurveTo(cpx, cpy, cpx2, cpy2, c.x, c.y)
    },
    xSpace(ctx, c) {
        c.x = centerX * ligModifier
        ctx.moveTo(c.x, c.y)
    },
    shFix(ctx, c) {
        c.x = 0
        ctx.lineTo(c.x, c.y)
    },
}











const dictionary = {
    tags: {
        short: ['a', 'e', 'i', 'n', 'r', 's', 't'],
        antishort: ['g', 'o'],
        supershort: ['e'],
        antisupershort: ['b', 'd', 'k', 'n', 'x', 'y'],
        spacers: ['m', 't'],
        hLigatures: ['c', 'g', 'k', 'p', 's', 't', 'w', 'z'],
        hbConnectors: ['a', 'j', 'n', 'o', 'r', 't', 'y'], // D? L?
    },
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
        return this.e()
        // return function(ctx, c) {
        //     printer.origin(ctx, c)
        //     printer.dot(ctx, c)
        // }
    },
    2() {
        return this.i()
        // return function(ctx, c) {
        //     printer.origin(ctx, c)
        //     printer.dot(ctx, c)
        //     printer.skip(ctx, c)
        //     printer.dot(ctx, c)
        // }
    },
    3() {
        // return this.s()
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
        }
    },
    4() { return this.t() },
    5() { return this.n() },
    6() { return this.d() },
    7() { return this.b() },
    8() { return this.m() },
    9() { return this.a() },
    0() { return this.o() },

    ch() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.shortCurve(ctx, c)
            printer.resetX(ctx, c)
            printer.resetY(ctx, c)
            printer.line(ctx, c)
        }  
    },
    gh() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.xSpace(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.xSpace(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
            printer.resetY(ctx, c)
            printer.line(ctx, c)
        }  
    },
    kh() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.xSpace(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.shortCurve(ctx, c, 's')
            printer.resetX(ctx, c)
            printer.resetY(ctx, c)
            printer.line(ctx, c)
        }  
    },
    ph() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.xSpace(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
            printer.resetX(ctx, c)
            printer.resetY(ctx, c)
            printer.line(ctx, c)
        }  
    },
    sh() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
            printer.shFix(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
        } 
    },
    th() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.bar(ctx, c)
            printer.curve(ctx, c, 's')
        } 
    },
    wh() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.resetX(ctx, c)
            printer.line(ctx, c)
            printer.xSpace(ctx, c)
            printer.bar(ctx, c)
            printer.shortCurve(ctx, c, 's')
            printer.resetX(ctx, c)
            printer.resetY(ctx, c)
            printer.line(ctx, c)
        }  
    },
    zh() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.bar(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
            printer.zhCurve(ctx, c)
        }  
    },
    _() {
        return function(ctx, c) {
            printer.origin(ctx, c)
            printer.skip(ctx, c)
            printer.skip(ctx, c)
            printer.bar(ctx, c)
        }  
    },
}

// tests
let strings = ['_wijit', '']
let scaler = 0.5
for (const string of strings) {
    if (!string) { Typewriter.yCoord -= Math.round(lineHeight * scaler) }
    for (let i = 0; i < string.length; i++) {
        let canvas = document.createElement('canvas')
        // let context = canvas.getContext('2d')
        // context.lineWidth = 2
        let [temp, width, height] = carriage.resolve(string[i])
        canvas.width = width 
        canvas.height = height
        
        let cnv = printer.print(temp, width, canvas)
        CX.drawImage(cnv, Typewriter.xCoord, Typewriter.yCoord, width * scaler, height * scaler)
        Typewriter.add = {key: string[i], w: width * scaler, x: Typewriter.xCoord, y: Typewriter.yCoord}
        Typewriter.xCoord += width * scaler
    }
    Typewriter.enter(scaler)
}