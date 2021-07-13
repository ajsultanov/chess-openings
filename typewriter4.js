/*
    w   w      w           w       w       wwwww           WW
    w   w      w           w       w         w            W W
    w w w      w       w   w       w         w           W  W
    ww ww      w       w   w       w         w          WWWWWW
    w   w      w        www        w         w              W
*/


//  no spacing adjustments





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
const   letterWidth = 128 
const   letterHeight = 224 
const   middle = 5 * letterHeight / 12
const   lineWidth = letterWidth / 4
const   rad = lineWidth / 2
const   ligModifier = 7 / 5

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
            
            //  send cnv and width to:
            //  carriage, which adjusts x, subsitutes ligatures......
            //  adjust y.....
            //  for example: let {canvas, newWidth} = carriage(x.key)
            
            let {cnv, width} = printer.print(x.key)
            // let [xc, yc] = scale(this.xCoord, this.yCoord)
            let [xc, yc] = [this.xCoord, this.yCoord]
            CX.drawImage(cnv, xc, yc, width, letterHeight)
            this.add = {key: x.key, w: width, x: this.xCoord, y: this.yCoord}
            this.xCoord += width //- (width / 100)

            if (this.xCoord >= (canvas.width / scaleFactor - letterWidth + lineWidth)) { 
                // LINE BREAK ON OVERFLOW
                // this.enter() 
                // this.returnNext = true
            }
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


const carriage = {

}














const printer = {
    // cheese
    print(letter) {
        let cnv = document.createElement('canvas')
        cnv.width = letterWidth
        cnv.height = letterHeight
        let ncx = cnv.getContext('2d')
        ncx.lineWidth = lineWidth

        printer.beforeLetters(ncx)
        let width = dictionary[letter]({cn: cnv, cx: ncx, mod: ligModifier})
        printer.afterLetters(ncx)


        return {cnv: cnv, width: width}
    },

    makePath({start, end}, cx) {
        let {x: startX, y: startY} = start
        let {x: endX, y: endY} = end
        cx.lineWidth = lineWidth

        cx.beginPath()
        cx.moveTo(startX, startY)
        cx.lineTo(endX, endY)

        cx.lineWidth = 0.5
        cx.stroke()
        cx.lineWidth = lineWidth

        cx.stroke()
        cx.closePath()
        return [startX, startY, endX, endY]
    },

    makeRect({a, b, c, d}, cx) {
        let {x: x1, y: y1} = a
        let {x: x2, y: y2} = b
        let {x: x3, y: y3} = c
        let {x: x4, y: y4} = d 

        cx.beginPath()
        cx.moveTo(x1, y1)
        cx.lineTo(x2, y2)
        cx.lineTo(x3, y3)
        cx.lineTo(x4, y4)
        this.addStroke(cx)
        cx.fill()
        cx.closePath()
    },

    // top left
    alpha(x, y) {
        return { 
            x: 0 + (rad * x), 
            y: 0 + (rad * y)}
    },
    // top right
    beta(x, y, lw = letterWidth) {
        return { 
            x: lw - lineWidth + (rad * x), 
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
    delta(x, y, lw = letterWidth) {
        return {
            x: lw - lineWidth + (rad * x),
            y: middle - rad + (rad * y),
        }
    },
    // bottom left
    // cheese
    epsilon(x, y, mod = 0) {
        return {
            x: 0 + (rad * x),
            y: letterHeight - lineWidth + (rad * y),
        }
    },
    // bottom right
    zeta(x, y, lw = letterWidth) {
        return {
            x: lw - lineWidth + (rad * x),
            y: letterHeight - lineWidth + (rad * y),
        }
    },

    topBar(width) {
        // cheese
        return { 
            a: printer.alpha(0, 0),
            b: printer.beta(2, 0, width),
            c: printer.beta(2, 2, width),
            d: printer.alpha(0, 2),
        }
    },
    topLine() {
        return { 
            a: printer.alpha(0, 0),
            b: printer.alpha(2, 0),
            c: printer.gamma(2, 2),
            d: printer.gamma(0, 2), 
        }
    },
    midBar(width) {
        return { 
            a: printer.gamma(0, 0),
            b: printer.delta(2, 0, width),
            c: printer.delta(2, 2, width),
            d: printer.gamma(0, 2), 
        }
    },
    midLine() {
        return { 
            a: printer.gamma(0, 0),
            b: printer.gamma(2, 0),
            c: printer.epsilon(2, 2),
            d: printer.epsilon(0, 2), 
        }
    },
    bottomBar(width) {
        return { 
            a: printer.epsilon(0, 0),
            b: printer.zeta(2, 0, width),
            c: printer.zeta(2, 2, width),
            d: printer.epsilon(0, 2), 
        }
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

        let L2R = start.x - end.x < 0
        let T2B = start.y - end.y < 0

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
            x1, y1
        )
        cx.quadraticCurveTo(
            cpX1, cpY1, 
            x2, y2
        )
        cx.lineTo(
            x3, y3
        )
        cx.quadraticCurveTo(
            cpX2, cpY2, 
            x4,y4
        )
        cx.lineTo(
            x1, y1
        )


        this.addStroke(cx)

        cx.fill()
        cx.closePath()
            
        // CONTROL POINTS
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
        return {
            start: printer.beta(0, 0), 
            ctrl: printer.delta(0, 0), 
            end: printer.gamma(0, 0)
        }
    },
    x1Curve() {
        return {
            start: printer.alpha(0, 0), 
            ctrl: printer.gamma(0, 0), 
            end: printer.delta(0, 0)
        }
    },
    x2Curve() {
        return {
            start: printer.epsilon(0, 0), 
            ctrl: printer.gamma(0, 0), 
            end: printer.delta(0, 0)
        }
    },
    



    eBox() {
        return { 
            a: this.epsilon(0, 0), 
            b: this.epsilon(2, 0),
            c: this.epsilon(2, 2),
            d: this.epsilon(0, 2)
        }
    },
    zBox() {
        return { 
            a: this.zeta(0, 0), 
            b: this.zeta(2, 0),
            c: this.zeta(2, 2),
            d: this.zeta(0, 2)
        }
    },
    bBox() {
        return { 
            a: this.beta(0, 0), 
            b: this.beta(2, 0),
            c: this.beta(2, 2),
            d: this.beta(0, 2)
        }
    },
    gBox() {
        return { 
            a: this.gamma(0, 0), 
            b: this.gamma(2, 0),
            c: this.gamma(2, 2),
            d: this.gamma(0, 2)
        }
    },
    xBoxes() {
        return [
            { 
                a: this.alpha(0, 0), 
                b: this.alpha(2, 0),
                c: this.alpha(2, 2),
                d: this.alpha(0, 2)
            },
            { 
                a: this.delta(0, 0), 
                b: this.delta(2, 0),
                c: this.delta(2, 2),
                d: this.delta(0, 2)            
            },
            {
                a: this.epsilon(0, 0), 
                b: this.epsilon(2, 0),
                c: this.epsilon(2, 2),
                d: this.epsilon(0, 2)            
            }
        ]
    },


    overlay(cx) {
        for (const spot of ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta']) {
            cx.lineWidth = 1
            let {x:textPointX, y:textPointY} = printer[spot](0.5, 0.5)
            cx.fillStyle = 'red'
            cx.fillText(spot[0], textPointX, textPointY);
            cx.strokeStyle = 'green'
            cx.fillStyle = 'lime'
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
    addStroke(cx) {
        cx.lineWidth = 2
        cx.strokeStyle = '#f00'
        cx.stroke()
        cx.lineWidth = lineWidth
        cx.strokeStyle = '#000'
    },
    beforeLetters(cx) {
        // cx.fillStyle = '#8ae4'
        // cx.fillStyle = '#0f08'
        // cx.fillRect(0, 0, letterWidth, letterHeight)
        // cx.fillStyle = '#000'
    },
    afterLetters(cx) {
        // printer.overlay(cx)
    },




}




const dictionary = {
   
  

    // letters
    a({cn, cx}) {
        // printer.makePath(printer.topBar(), cx)
        // printer.makePath(printer.topLine(), cx)
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)

        return letterWidth
    },
    b({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeCurve(printer.bCurve(), cx)
        printer.makeRect(printer.eBox(), cx)
        return letterWidth
    },
    c({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeRect(printer.midLine(), cx)
        return letterWidth
    },
    d({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeRect(printer.bottomBar(), cx)
        return letterWidth
    },
    e({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        return letterWidth
    },
    f({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeRect(printer.midLine(), cx)
        printer.makeRect(printer.bottomBar(), cx)
        return letterWidth
    },
    g({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midLine(), cx)
        printer.makeRect(printer.bottomBar(), cx)
        return letterWidth
    },
    h({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeCurve(printer.bCurve(), cx)
        printer.makeRect(printer.eBox(), cx)
        return letterWidth
    },
    i({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.midBar(), cx)
        return letterWidth
    },
    j({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeCurve(printer.jCurve(), cx)
        printer.makeRect(printer.zBox(), cx)
        return letterWidth
    },
    k({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeRect(printer.midLine(), cx)
        return letterWidth
    },
    l({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeRect(printer.bottomBar(), cx)
        return letterWidth
    },
    m({cn, cx}) {
        const modifier = 1 / 2
        cn.width = Math.max(letterWidth * modifier, lineWidth * 2)
        console.log(letterWidth*modifier, lineWidth*2)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midLine(), cx)
        return cn.width
    },
    n({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        return letterWidth
    },
    o({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeCurve(printer.jCurve(), cx)
        printer.makeRect(printer.zBox(), cx)
        return letterWidth
    },
    p({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midLine(), cx)
        printer.makeRect(printer.bottomBar(), cx)
        return letterWidth
    },
    q({cn, cx}) {
        printer.makeCurve(printer.qCurve(), cx)
        printer.makeRect(printer.bBox(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeRect(printer.midLine(), cx)
        return letterWidth
    },   
    r({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        return letterWidth
    },
    s({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeCurve(printer.sCurve(), cx)
        printer.makeRect(printer.gBox(), cx)
        return letterWidth
    },   
    t({cn, cx}) {
        const modifier = 1 / 2
        cn.width = Math.max(letterWidth * modifier, lineWidth * 2)
        console.log(letterWidth*modifier, lineWidth*2)
        printer.makeRect(printer.topLine(), cx)
        return letterWidth * modifier
    },
    u({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeRect(printer.midLine(), cx)
        return letterWidth
    },
    v({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeCurve(printer.sCurve(), cx)
        printer.makeRect(printer.midLine(), cx)
        return letterWidth
    },   
    w({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midLine(), cx)
        return letterWidth
    },
    x({cn, cx}) {printer.makeCurve(printer.x1Curve(), cx)
        printer.makeCurve(printer.x2Curve(), cx)
        for (const box of printer.xBoxes()) {
            printer.makeRect(box, cx)
        }
        return letterWidth
    },  
    y({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeCurve(printer.jCurve(), cx)
        printer.makeRect(printer.zBox(), cx)
        return letterWidth
        
    },  
    z({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeCurve(printer.jCurve(), cx)
        printer.makeRect(printer.zBox(), cx)
        return letterWidth
    },   
    


    // ligatures
    // cheese
    ligCurve(width) {
        console.log(letterWidth/2-rad)

        console.log(width/2-rad)
        return {
            start: printer.delta(0, 1, width), 
            ctrl: printer.zeta(0, 0, width), 
            // end: printer.epsilon(2, 0, mod)
            end: {
                x: width / 2 - lineWidth,
                y: letterHeight - lineWidth
            }
        }
    },
    sLigCurve(mod) {
        return {
            start: printer.beta(0, 2, letterWidth * mod), 
            ctrl: printer.delta(0, 0, letterWidth * mod), 
            end: printer.gamma(2, 0)
        }
    },
    z1LigCurve(mod) {
        return {
            start: printer.delta(0, 1, letterWidth * mod), 
            ctrl: printer.zeta(0, 0, letterWidth * mod), 
            end: {
                x: letterWidth * mod / 2 - lineWidth, 
                y: letterHeight - lineWidth
            }
        }
    },
    z2LigCurve(mod) {
        return {
            start: printer.gamma(0, 1), 
            ctrl: printer.epsilon(0, 0), 
            end: {
                x: letterWidth * mod / 2, 
                y: letterHeight - lineWidth
            }
        }
    },
    shortTopBar(width) {
        return { 
            a: {x: letterWidth / 2 + rad, y: 0}, 
            b: printer.beta(2, 0, width),
            c: printer.beta(2, 2, width), 
            d: {x: letterWidth / 2 + rad, y: lineWidth}
        }
    },
    shortMidBar(width) {
        return { 
            a: {x: letterWidth / 2 + rad, y: middle - rad}, 
            b: printer.delta(2, 0, width),
            c: printer.delta(2, 2, width), 
            d: {x: letterWidth / 2 + rad, y: middle + rad}
        }
    },
    ligBlock(width) {
        return { 
            a: printer.delta(0, 2, width), 
            b: printer.delta(2, 2, width),
            c: printer.delta(2, 3, width), 
            d: printer.delta(0, 3, width) 
        }
    },
    ligBlock2(width) {
        return { 
            a: printer.gamma(0, 2, width), 
            b: printer.gamma(2, 2, width),
            c: printer.gamma(2, 3, width), 
            d: printer.gamma(0, 3, width) 
        }
    },
    ligBottomBlock(width) {
        console.log(letterWidth / 2 - rad)
        console.log(width / 2 - rad)
        return { 
            a: printer.epsilon(2, 0, width), 
            b: {
                x: width / 2, 
                y: letterHeight-lineWidth
            },
            c: {
                x: width / 2, 
                y: letterHeight
            },
            d: printer.epsilon(2, 2, width)
        }
    },

    C({cn, cx, mod}) {
        // cheese
        cn.width *= mod
        printer.makeRect(printer.topBar(cn.width), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(cn.width), cx)
        printer.makeRect(printer.midLine(), cx)
        printer.makeRect(this.ligBlock(cn.width), cx)
        printer.makeCurve(this.ligCurve(cn.width), cx)
        printer.makeRect({
            a: {x:lineWidth*2, y:letterHeight-lineWidth},
            b: {x:cn.width/2, y:letterHeight-lineWidth},
            c: {x:cn.width/2, y:letterHeight},
            d: {x:lineWidth*2, y:letterHeight}
        }, cx)
        return cn.width
    },
    G({cn, cx, mod}) {
        // ghost
        cn.width *= mod
        // printer.makeRect({
        //     a: {x:cn.width/2, y:0},
        //     b: {x:cn.width/2, y:0},
        //     c: {x:cn.width/2, y:letterHeight},
        //     d: {x:cn.width/2, y:letterHeight}
        // }, cx)
        printer.makeRect(this.shortTopBar(cn.width), cx)        
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midLine(), cx)
        printer.makeRect(this.shortMidBar(cn.width), cx)     
        printer.makeRect(this.ligBlock(cn.width), cx)
        printer.makeCurve(this.ligCurve(cn.width), cx)
        printer.makeRect(this.ligBottomBlock(cn.width), cx)
        return cn.width
    },
    K({cn, cx, mod}) {
        // khaki
        cn.width *= mod
        // printer.makeRect({
        //     a: {x:cn.width/2-rad, y:0},
        //     b: {x:cn.width/2-rad, y:0},
        //     c: {x:cn.width/2-rad, y:letterHeight},
        //     d: {x:cn.width/2-rad, y:letterHeight}
        // }, cx)
        printer.makeRect(this.shortTopBar(cn.width), cx)        
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(cn.width), cx)
        printer.makeRect(printer.midLine(), cx)
        printer.makeRect(this.ligBlock(cn.width), cx)
        printer.makeCurve(this.ligCurve(cn.width), cx)
        // printer.makeRect({
        //     a: {x:cn.width/2-rad, y:letterHeight-lineWidth},
        //     b: {x:cn.width/2, y:letterHeight-lineWidth},
        //     c: {x:cn.width/2, y:letterHeight},
        //     d: {x:cn.width/2-rad, y:letterHeight}
        // }, cx)
        return cn.width
    },
    P({cn, cx, mod}) {
        // phone
        cn.width *= mod
        printer.makeRect(printer.topBar(cn.width), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midLine(), cx)
        printer.makeRect(this.shortMidBar(cn.width), cx)     
        printer.makeRect(this.ligBlock(cn.width), cx)
        printer.makeCurve(this.ligCurve(cn.width), cx)
        printer.makeRect(this.ligBottomBlock(cn.width), cx)
        return cn.width
    },
    S({cn, cx}) {
        // shell
        printer.makeRect(printer.topBar(), cx)
        printer.makeCurve(printer.sCurve(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeCurve(printer.bCurve(), cx)
        printer.makeRect(printer.eBox(), cx)
        return letterWidth
    },
    T({cn, cx}) {
        // thing
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeCurve(printer.bCurve(), cx)
        printer.makeRect(printer.eBox(), cx)
        return letterWidth
    },
    W({cn, cx, mod}) {
        // wheel
        cn.width *= mod
        printer.makeRect(printer.topBar(cn.width), cx)
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midLine(), cx)

        printer.makeRect(this.shortMidBar(cn.width), cx)     
        printer.makeRect(this.ligBlock(cn.width), cx)
        printer.makeCurve(this.ligCurve(cn.width), cx)
        printer.makeCurve(this.ligCurve(cn.width), cx)    
        return cn.width
    },
    Z({cn, cx, mod}) {
        // zhoosh
        cn.width *= mod
        printer.makeRect(printer.topBar(cn.width), cx)
        printer.makeRect(printer.midBar(cn.width), cx)
        printer.makeRect(this.ligBlock(cn.width), cx)
        printer.makeRect(this.ligBlock2(cn.width), cx)
        printer.makeCurve(this.z1LigCurve(cn.width), cx)
        printer.makeCurve(this.z2LigCurve(cn.width), cx)
        return cn.width
    },




    // numbers
    1({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        return letterWidth
    }, 
    2({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.midBar(), cx)
        return letterWidth
    }, 
    3({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeCurve(printer.sCurve(), cx)
        printer.makeRect(printer.gBox(), cx)
        return letterWidth
    }, 
    4({cn, cx}) {
        const modifier = 1 / 2
        cn.width *= modifier
        printer.makeRect(printer.topLine(), cx)
        return letterWidth * modifier
    }, 
    5({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        return letterWidth
    }, 
    6({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeRect(printer.bottomBar(), cx)
        return letterWidth
    }, 
    7({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.midBar(), cx)
        printer.makeCurve(printer.bCurve(), cx)
        printer.makeRect(printer.eBox(), cx)
        return letterWidth
    }, 
    8({cn, cx}) {
        const modifier = 1 / 2
        cn.width *= modifier
        printer.makeRect(printer.topLine(), cx)
        printer.makeRect(printer.midLine(), cx)
        return letterWidth * modifier
    }, 
    9({cn, cx}) {
        printer.makeRect(printer.topBar(), cx)
        printer.makeRect(printer.topLine(), cx)
        return letterWidth
    }, 
    0({cn, cx}) {
        printer.makeRect(printer.topLine(), cx)
        printer.makeCurve(printer.jCurve(), cx)
        printer.makeRect(printer.zBox(), cx)
        return letterWidth
    },  
}



// curve(ctx, c, type) {
//     const t = {
//         j: { x: 1, y: 1, z: 1 },
//         s: { x: 0, y: 1, z: 1 },
//         q: { x: 0, y: 1, z: 0},
//     }

//     let L2R = t[type].x
//     let firstStory = this.storey1(c)
//     let underhand = t[type].z

//     if (t[type].z) { c.y = c.y + lineWidth }
//     else { c.x = c.x - lineWidth }
//     ctx.lineTo(c.x, c.y)

//     let [cpx, cpy] = [0, 0]
//     if (underhand) {   
//         cpx = c.x
//         if (firstStory) {   
//             cpy = centerY
//             c.y = centerY
//         } // SV
//         else {
//             cpy = this.yMax(ctx.canvas.height)
//             c.y = this.yMax(ctx.canvas.height)
//         } // BHJOYZ
//     }
//     else {      
//         cpx = this.xMin
//         if (firstStory) {   
//             cpy = c.y
//             c.y = centerY - lineWidth
//         } // Q
//         else {                  
//             cpy = centerY
//             c.y = this.yMax(ctx.canvas.height) - lineWidth
//         } // X
//     }

//     if (underhand) {
//         if (L2R) { c.x = this.xMax(ctx.canvas.width) - lineWidth } // JOYZ
//         else { c.x = this.xMin + lineWidth } // BHSV
//     } else {
//         c.x = this.xMin 
//     } // QX
//     ctx.quadraticCurveTo(cpx, cpy, c.x, c.y)

//     if (L2R) { c.x = this.xMax(ctx.canvas.width) } 
//         else { c.x = this.xMin }
//     if (firstStory) { c.y = centerY } 
//                else { c.y = this.yMax(ctx.canvas.height) }
//     ctx.lineTo(c.x, c.y)
// },































//  TESTS
// let cnv = document.createElement('canvas')
// cnv.width = letterWidth
// cnv.height = letterHeight
// let ncx = cnv.getContext('2d')
// ncx.lineWidth = lineWidth

// dictionary['8'](ncx)
// CX.drawImage(cnv, scale(200), scale(200), scale(128), scale(224))
// ncx.clearRect(0, 0, 64, 112)

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
