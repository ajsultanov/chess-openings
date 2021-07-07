/*
    w   w      w           w       w       wwwww           WW
    w   w      w           w       w         w            W W
    w w w      w       w   w       w         w           W  W
    ww ww      w       w   w       w         w          WWWWWW
    w   w      w        www        w         w              W
*/


//  numbers are broken
//  capitals aren't added yet
//  no space, enter, backspace
//  no spacing adjustments
//  no history




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

const   scaleFactor = 3 / 5
const   letterWidth = 128 * scaleFactor
const   letterHeight = 256 * scaleFactor
const   middle = letterHeight / 2
const   lineWidth = letterWidth / 3
const   rad = lineWidth / 2

function scale(...c) { 
    let ヤキソバ = c.map(e => e * scaleFactor)
    if (ヤキソバ.length === 1) {
        return ヤキソバ[0]
    }
    return ヤキソバ
}

const Typewriter = {
    cx: CX,
    currentKey: null,
    history: [],

    xCoord: 0,
    yCoord: 0,
    get x() { return this.xCoord} ,
    get y() { return this.yCoord },
    get coords() { return [this.x, this.y] },
    set coords([x, y]) { [this.x, this.y] = [x, y] },
    logCoords() {
        console.log(`x: ${this.x}, y: ${this.y}`)
    },
    logHistory() {
        console.log(`history: ${this.history}`)
    },
    getPrev(n = 1) {
        if (this.history.length === 0) return undefined
        return this.history[this.history.length - n]
    },
    set add(val) { 
        if (val) this.history.push(val)
    },
    returnNext: false,


    control(x) { 
        if (this.returnNext) text.value += '\n'
        this.returnNext = false

        //  clean key here
        if (!METAKEYS.includes(x.key)) {
            if (x.key === 'Backspace') {
                this.backspace()
                return
            }
            if (x.key === 'Enter') {
                this.enter()
                return
            }
            if (x.key === ' ') {
                this.space()
                return
            }

            if (!dictionary[x.key]) return
            let {cnv, width} = printer.print(x.key)
            //  send cnv and width to:
            //  carriage, which adjusts x, subsitutes ligatures......
            //  adjust y.....
            //  for example: let {canvas, newWidth} = carriage(x.key)
            let [xc, yc, w, h] = scale(this.xCoord, this.yCoord, 128, 256)
            CX.drawImage(cnv, xc, yc, w, h)
            this.add = {key: x.key, w: width, x: this.xCoord, y: this.yCoord}
            this.xCoord += width


            if (this.xCoord >= (canvas.width / scaleFactor - letterWidth + lineWidth)) { 
                this.enter() 
                this.returnNext = true
            }

            //  TRYING TO MAKE A CONTROLLED TEXT AREA
            // text.value = this.history.map(el => {
            //     return el.key
            // }).join('')
        }
    },
    backspace() {
        let last = this.getPrev()
        if (last) {
            let [x, y, w, h] = scale(last.x, last.y, last.w, letterHeight)
            CX.clearRect(x, y, w, h)
            this.xCoord = last.x
            this.yCoord = last.y
            this.history.pop()
        }
    },
    enter() {
        this.add = {key: 'enter', w: 0, x: this.xCoord, y: this.yCoord}
        this.xCoord = 0
        this.yCoord += letterHeight * (1 + 2 / 5)
    },
    space() {
        this.add = {key: 'space', w: scale(letterWidth), x: this.xCoord, y: this.yCoord}
        this.xCoord += letterWidth
    },
    clear() {
        console.log('here\'s where you would clear everything, history, etc.')
    },


}


const carriage = {}














const printer = {
    print(letter) {
        let cnv = document.createElement('canvas')
        cnv.width = 128
        cnv.height = 256
        let ncx = cnv.getContext('2d')
        ncx.lineWidth = lineWidth
        let width = dictionary[letter](ncx)
        return {cnv: cnv, width: width}
    },

    makePath({start, end}, cx) {
        let {x: startX, y: startY} = start
        let {x: endX, y: endY} = end
        cx.beginPath()
        cx.moveTo(startX, startY)
        cx.lineTo(endX, endY)
        cx.stroke()
        cx.closePath()
        return [startX, startY, endX, endY]
    },

    // top left
    alpha(x, y) {
        return { 
            x: 0 + (rad * x), 
            y: 0 + (rad * y)}
    },
    // top right
    beta(x, y) {
        return { 
            x: letterWidth - lineWidth + (rad * x), 
            y: 0 + (rad * y)}
    },
    // middle left
    gamma(x, y) {
        return {
            x: 0 + (rad * x),
            y: middle - rad + (rad * y),
        }
    },
    // middle right
    delta(x, y) {
        return {
            x: letterWidth - lineWidth + (rad * x),
            y: middle - rad + (rad * y),
        }
    },
    // bottom left
    epsilon(x, y) {
        return {
            x: 0 + (rad * x),
            y: letterHeight - lineWidth + (rad * y),
        }
    },
    // bottom right
    zeta(x, y) {
        return {
            x: letterWidth - lineWidth + (rad * x),
            y: letterHeight - lineWidth + (rad * y),
        }
    },

    topBar() {
        return { start: this.alpha(0, 1), end: this.beta(2, 1) }
    },
    topLine() {
        return { start: this.alpha(1, 0), end: this.gamma(1, 2) }
    },
    midBar() {
        return { start: this.gamma(0, 1), end: this.delta(2, 1) }
    },
    midLine() {
        return { start: this.gamma(1, 0), end: this.epsilon(1, 2) }
    },
    bottomBar() {
        return { start: this.epsilon(0, 1), end: this.zeta(2, 1)}
    },

    makeArc({angles, position, rad}, cx) {
        let {x: centerX, y: centerY} = position
        let {startAngle, endAngle} = angles
        let radius = rad || this.radius
        cx.beginPath()
        cx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            endAngle,
        )
        cx.stroke()
        cx.closePath()
        return [centerX, centerY, radius, startAngle, endAngle]
    },

    // radius: letterWidth / 2 + lineWidth,
    radius: letterWidth - lineWidth,

    south: {
        startAngle: 2 * Math.PI,
        endAngle: Math.PI,
    },
    southEast: {
        startAngle: 2 * Math.PI,
        endAngle: Math.PI / 2,
    },
    southWest: {
        startAngle: Math.PI / 2, 
        endAngle: Math.PI,
    },
    northWest: {
        startAngle: Math.PI, 
        endAngle: 3 * Math.PI / 2,
    },

    bArc() {
        return { angles: this.southEast, position: this.gamma(1, 1) }
    },
    jArc() {
        return { angles: this.southWest, position: this.delta(1, 1) }
    },
    qArc() {
        return { angles: this.northWest, position: this.delta(0, 0) }
    },
    sArc() {
        return { angles: this.southEast, position: this.alpha(2, 2) }
    },
    xArc1() {
        return { angles: this.southWest, position: this.beta(0, 2) }
    },
    xArc2() {
        return { angles: this.northWest, position: this.zeta(0, 0) }
    },


    makeCurve({start, end, ctrl}, cx) {
        cx.beginPath()
        let {x: x1, y: y1} = start
        let {x: x2, y: y2} = end
        let {x: x3, y: y3} = end
        let {x: x4, y: y4} = start
        let {x: cpX1, y: cpY1} = ctrl
        let {x: cpX2, y: cpY2} = ctrl

        // will need this in a minute
        let L2R = start.x - end.x < 0
        let T2B = start.y - end.y < 0
        console.log(L2R, T2B)

        // x1 += 0
        y1 += T2B ? lineWidth : 0
        x2 += L2R ? 0 : lineWidth
        y2 += (L2R && T2B) ? lineWidth : 0
        x3 += L2R ? 0 : lineWidth
        y3 += (L2R && T2B) ? 0 : lineWidth
        x4 += lineWidth
        y4 += T2B ? lineWidth : 0
        // cpX1 += 0
        cpY1 += (L2R && T2B) ? lineWidth : 0
        cpX2 += lineWidth
        cpY2 += (L2R && T2B) ? 0 : lineWidth

        cx.moveTo(
            x1,
            y1
        )
        cx.quadraticCurveTo(
            cpX1, 
            cpY1, 
            x2,
            y2
        )
        cx.lineTo(
            x3, 
            y3
        )
        cx.quadraticCurveTo(
            cpX2, 
            cpY2, 
            x4,
            y4
        )
        cx.lineTo(x1, y1)
        cx.fill()
        cx.closePath()
            
        // let color = 'darkolivegreen'
        // printer.controlPoint({start:{x:x1, y:y1}, end:{x:x2, y:y2}, ctrl:{x:cpX1, y:cpY1}, color}, cx)
        // color = 'cornflowerblue'
        // printer.controlPoint({start:{x:x3, y:y3}, end:{x:x4, y:y4}, ctrl:{x:cpX2, y:cpY2}, color}, cx)
    },

    controlPoint({start, end, ctrl, color}, cx) {
        let {x: startX, y: startY} = start
        let {x: endX, y: endY} = end
        let {x: cpX, y: cpY} = ctrl
        cx.lineWidth = 1

        cx.beginPath()
        cx.moveTo(startX, startY)
        cx.lineTo(cpX, cpY)
        cx.strokeStyle = '#F00'
        cx.stroke()
        cx.lineTo(endX, endY)
        cx.stroke()
        cx.closePath()
        cx.beginPath()
        cx.arc(
            cpX, 
            cpY, 
            lineWidth / 6,
            0,
            Math.PI * 2)
        cx.fillStyle = color
        cx.fill()
        cx.fillStyle = "#000"
        cx.closePath()
        cx.beginPath()
        cx.arc(
            cpX + 2 / rad, 
            cpY, 
            lineWidth / 12,
            1 - 1 / 12,
            Math.PI * 2 - (1 - 1 / 12))
        cx.strokeStyle = 'white'
        cx.stroke()
        cx.lineWidth = lineWidth
        cx.strokeStyle = '#000'
        cx.closePath()
    },

    bCurve() {
        return {
            start: printer.delta(0, 0), 
            ctrl: printer.zeta(0, 0), 
            end: printer.epsilon(0, 0)
        }
    },
    jCurve() {
        return {
            start: printer.gamma(0, 0), 
            ctrl: printer.epsilon(0, 0), 
            end: printer.zeta(0, 0)
        }
    },
    qCurve() {
        return {
            start: printer.gamma(0, 0), 
            ctrl: printer.alpha(0, 0), 
            end: printer.beta(0, 0)
        }
    },
    sCurve() {
        return {start: printer.beta(0, 0), ctrl: printer.delta(0, 0), end: printer.gamma(0, 0)}
    },
    x1Curve() {
        return {start: printer.alpha(0, 0), ctrl: printer.gamma(0, 0), end: printer.delta(0, 0)}
    },
    x2Curve() {
        return {start: printer.epsilon(0, 0), ctrl: printer.gamma(0, 0), end: printer.delta(0, 0)}
    },




    eBox() {
        return { start: this.epsilon(0, 1), end: this.epsilon(2, 1) }
    },
    zBox() {
        return { start: this.zeta(0, 1), end: this.zeta(2, 1) }
    },
    bBox() {
        return { start: this.beta(0, 1), end: this.beta(2, 1) }
    },
    gBox() {
        return { start: this.gamma(0, 1), end: this.gamma(2, 1) }
    },
    xBoxes() {
        return [
            { start: this.alpha(1, 0), end: this.alpha(1, 2) },
            { start: this.delta(0, 1), end: this.delta(2, 1) },
            { start: this.epsilon(1, 0), end: this.epsilon(1, 2) }
        ]
    },


    overlay(cx) {
        for (const spot of ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta']) {
            cx.strokeStyle = 'green'
            cx.fillStyle = 'lime'
            cx.lineWidth = 1
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    printer.makeArc(
                        {
                            angles: {startAngle: 0, endAngle: Math.PI * 2}, 
                            position: printer[spot](i, j), 
                            rad: 1
                        }, cx)
                        cx.fill()
                    }
                }
                cx.strokeStyle = '#000'
                cx.fillStyle = '#000'
                cx.lineWidth = lineWidth
            }
    },
}




const dictionary = {
   
   
   

    // letters
    a(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        return letterWidth
    },
    b(cx) {
        // cx.fillStyle = '#26a'
        // cx.fillRect(0, 0, letterWidth, letterHeight)
        // cx.fillStyle = '#000'
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        // printer.makeArc(printer.bArc(), cx)

        // cx.beginPath()
        // let {x: startX, y: startY} = printer.delta(1, 2)
        // cx.moveTo(
        //     startX,
        //     startY - 1)
        // let {x: cpX, y: cpY} = printer.zeta(0, 0)
        // let {x: endX, y: endY} = printer.epsilon(2, 1)
        // cpX += rad 
        // cpY += rad
        // cx.quadraticCurveTo(
        //     cpX, 
        //     cpY, 
        //     endX - 1, 
        //     endY)
        // cx.stroke()
        // cx.closePath()
        printer.makeCurve(printer.bCurve(), cx)
        printer.makePath(printer.eBox(), cx)
        // printer.overlay(cx)
        return letterWidth
    },
    c(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.midLine(), cx)
        return letterWidth
    },
    d(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.bottomBar(), cx)
        return letterWidth
    },
    e(cx) {
        printer.makePath(printer.topBar(), cx)
        return letterWidth
    },
    f(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makePath(printer.bottomBar(), cx)
        return letterWidth
    },
    g(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makePath(printer.bottomBar(), cx)
        return letterWidth
    },
    h(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makeArc(printer.bArc(), cx)
        printer.makePath(printer.eBox(), cx)
        return letterWidth
    },
    i(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.midBar(), cx)
        return letterWidth
    },
    j(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makeArc(printer.jArc(), cx)
        printer.makePath(printer.zBox(), cx)
        return letterWidth
    },
    k(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.midLine(), cx)
        return letterWidth
    },
    l(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.bottomBar(), cx)
        return letterWidth
    },
    m(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        return lineWidth * 2
    },
    n(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        return letterWidth
    },
    o(cx) {
        printer.makePath(printer.topLine(), cx)
        // printer.makeArc(printer.jArc(), cx)

        // cx.beginPath()
        // let {x: startX, y: startY} = printer.gamma(1, 2)    // a/b, g/d, e
        // cx.moveTo(
        //     startX,
        //     startY - 1)                                     // always -
        // let {x: cpX, y: cpY} = printer.epsilon(2, 0)        // a, g/d, e/z
        // let ratio = letterHeight / letterWidth
        // cpY += rad
        // let {x: endX, y: endY} = printer.zeta(0, 1)         // b, g/d, e/z
        // cx.quadraticCurveTo(
        //     cpX, 
        //     cpY, 
        //     endX + 1,                                       // +/-
        //     endY)
        // cx.stroke()
        // cx.closePath()
        printer.makeCurve(printer.jCurve(), cx)
        printer.makePath(printer.zBox(), cx)
        // printer.overlay(cx)
        return letterWidth
    },
    p(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makePath(printer.bottomBar(), cx)
        return letterWidth
    },
    q(cx) {
        // printer.makeArc(printer.qArc(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makePath(printer.bBox(), cx)

        printer.makeCurve(printer.qCurve(), cx)
        // printer.overlay(cx)
        return letterWidth
    },   
    r(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        return letterWidth
    },
    s(cx) {
        printer.makePath(printer.topBar(), cx)
        // printer.makeArc(printer.sArc(), cx)
        printer.makePath(printer.gBox(), cx)

        printer.makeCurve(printer.sCurve(), cx)

        return letterWidth
    },   
    t(cx) {
        printer.makePath(printer.topLine(), cx)
        return lineWidth * 2
    },
    u(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.midLine(), cx)
        return letterWidth
    },
    v(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makeArc(printer.sArc(), cx)
        printer.makePath(printer.midLine(), cx)
        return letterWidth
    },   
    w(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        return letterWidth
    },
    x(cx) {
        // printer.makeArc(printer.xArc1(), cx)
        // printer.makeArc(printer.xArc2(), cx)
        printer.makeCurve(printer.x1Curve(), cx)
        printer.makeCurve(printer.x2Curve(), cx)

        for (const box of printer.xBoxes()) {
            printer.makePath(box, cx)
        }
        return letterWidth
    },  
    y(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        // printer.makeArc(printer.jArc(), cx)
        printer.makePath(printer.zBox(), cx)

        printer.makeCurve(printer.jCurve(), cx)
        return letterWidth
        
    },  
    z(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.midBar(), cx)
        // printer.makeArc(printer.jArc(), cx)
        printer.makePath(printer.zBox(), cx)

        printer.makeCurve(printer.jCurve(), cx)
        return letterWidth
    },   
    


    // ligatures
    ch(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makeArc({angles: printer.southEast, position: printer.gamma(4, 4), rad: letterWidth/2}, cx)
        printer.makePath({start: printer.delta(1, 2), end: printer.delta(1, 4)}, cx)
        return letterWidth
    },
    gh(cx) {
        printer.makePath({start: printer.alpha(4, 1), end: printer.beta(2, 1)}, cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makePath({start: printer.gamma(4, 1), end: printer.delta(2, 1)}, cx)
        printer.makeArc({angles: printer.southEast, position: printer.gamma(4, 4), rad: letterWidth / 2}, cx)
        printer.makePath({start: printer.delta(1, 2), end: printer.delta(1, 4)}, cx)
        printer.makePath({start: printer.epsilon(2, 1), end: printer.epsilon(4, 1)}, cx)
        return letterWidth
    },
    kh(cx) {
        printer.makePath({start: printer.alpha(4, 1), end: printer.beta(2, 1)}, cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makeArc({angles: printer.southEast, position: printer.gamma(4, 4), rad: letterWidth / 2}, cx)
        printer.makePath({start: printer.delta(1, 2), end: printer.delta(1, 4)}, cx)
        return letterWidth
    },
    ph(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makePath({start: printer.gamma(4, 1), end: printer.delta(2, 1)}, cx)
        printer.makeArc({angles: printer.southEast, position: printer.gamma(4, 4), rad: letterWidth / 2}, cx)
        printer.makePath({start: printer.delta(1, 2), end: printer.delta(1, 4)}, cx)
        printer.makePath({start: printer.epsilon(2, 1), end: printer.epsilon(4, 1)}, cx)
        return letterWidth
    },
    sh(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makeArc(printer.sArc(), cx)
        printer.makePath(printer.gBox(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makeArc({angles: printer.southEast, position: printer.gamma(4, 4), rad: letterWidth / 2}, cx)
        printer.makePath({start: printer.delta(1, 2), end: printer.delta(1, 4)}, cx)
        printer.makePath({start: printer.epsilon(0, 1), end: printer.epsilon(4, 1)}, cx)
        return letterWidth
    },
    th(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makeArc({angles: printer.southEast, position: printer.gamma(4, 4), rad: letterWidth / 2}, cx)
        printer.makePath({start: printer.delta(1, 2), end: printer.delta(1, 4)}, cx)
        printer.makePath({start: printer.epsilon(0, 1), end: printer.epsilon(4, 1)}, cx)
        return letterWidth
    },
    wh(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        printer.makePath({start: printer.gamma(4, 1), end: printer.delta(2, 1)}, cx)
        printer.makeArc({angles: printer.southEast, position: printer.gamma(4, 4), rad: letterWidth / 2}, cx)
        printer.makePath({start: printer.delta(1, 2), end: printer.delta(1, 4)}, cx)
        return letterWidth
    },
    zh(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath({start: printer.gamma(1, 2), end: printer.gamma(1, 5)}, cx)
        printer.makePath({start: printer.delta(1, 2), end: printer.delta(1, 5)}, cx)
        printer.makeArc({angles: printer.south, position: printer.gamma(5, 5), rad: letterWidth - (lineWidth * 3)}, cx)
        return letterWidth
    },




    // numbers
    1(cx) {
        printer.makePath(printer.topBar(), cx)
        return letterWidth
    }, 
    2(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.midBar(), cx)
        return letterWidth
    }, 
    3(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makeArc(printer.sArc(), cx)
        printer.makePath(printer.gBox(), cx)
        return letterWidth
    }, 
    4(cx) {
        printer.makePath(printer.topLine(), cx)
        return lineWidth * 2
    }, 
    5(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        return letterWidth
    }, 
    6(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makePath(printer.bottomBar(), cx)
        return letterWidth
    }, 
    7(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.midBar(), cx)
        printer.makeArc(printer.bArc(), cx)
        printer.makePath(printer.eBox(), cx)
        return letterWidth
    }, 
    8(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makePath(printer.midLine(), cx)
        return lineWidth * 2
    }, 
    9(cx) {
        printer.makePath(printer.topBar(), cx)
        printer.makePath(printer.topLine(), cx)
        return letterWidth
    }, 
    0(cx) {
        printer.makePath(printer.topLine(), cx)
        printer.makeArc(printer.jArc(), cx)
        printer.makePath(printer.zBox(), cx)
        return letterWidth
    },  
}






//  TESTS
let cnv = document.createElement('canvas')
cnv.width = letterWidth
cnv.height = letterHeight
let ncx = cnv.getContext('2d')
ncx.lineWidth = lineWidth

// dictionary['zh'](ncx)
// CX.drawImage(cnv, scale(0), 0, scale(120), scale(216))
// ncx.clearRect(0, 0, 120, 240)

// dictionary['sh'](ncx)
// CX.drawImage(cnv, scale(200), 0, scale(120), scale(216))
// ncx.clearRect(0, 0, 120, 240)

// dictionary['th'](ncx)
// CX.drawImage(cnv, scale(400), 0, scale(120), scale(216))
// ncx.clearRect(0, 0, 120, 240)

// dictionary['b'](ncx)
// CX.drawImage(cnv, 0, 0, scale(letterWidth), scale(letterHeight))
// ncx.clearRect(0, 0, letterWidth, letterHeight)

// dictionary['o'](ncx)
// CX.drawImage(cnv, scale(200), 0, scale(letterWidth), scale(letterHeight))
// ncx.clearRect(0, 0, letterWidth, letterHeight)

// dictionary['q'](ncx)
// CX.drawImage(cnv, scale(100), scale(300), scale(letterWidth), scale(letterHeight))
// ncx.clearRect(0, 0, letterWidth, letterHeight)



//  BLINKING CURSOR
// let blinker = document.createElement('canvas')
// document.getElementById('main').appendChild(blinker)
// blinker.width = scale(letterWidth)
// blinker.height = 50
// blinker.style.position = 'absolute'
// let bcx = blinker.getContext('2d')

// let ptop = parseInt(window.getComputedStyle(canvas, null).getPropertyValue('padding-top').replace(/px/, ''))
// let pleft = parseInt(window.getComputedStyle(canvas, null).getPropertyValue('padding-left').replace(/px/, ''))

// window.setInterval(() => {
//     console.log(Typewriter.xCoord, Typewriter.yCoord)
//     blinker.style.top = canvas.offsetTop + ptop + scale(Typewriter.yCoord) + 'px'
//     blinker.style.left = canvas.offsetLeft + pleft + scale(Typewriter.xCoord) + 'px'
//     bcx.fillStyle = '#31aa'
//     bcx.fillRect(0, 0, 2, scale(letterHeight))
//     let [xc, yc, lw, lh] = scale(Typewriter.xCoord, Typewriter.yCoord, letterWidth, letterHeight)
//     blinker.x = Typewriter.xCoord
//     setTimeout(() => {
//         bcx.clearRect(0, 0, 2, scale(letterHeight))
//     }, 500)
// }, 1000)