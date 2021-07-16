/*
    w   w      w           w       w       wwwww           WWWWW 
    w   w      w           w       w         w             W
    w w w      w       w   w       w         w       W     WWWW 
    ww ww      w       w   w       w         w                W
    w   w      w        www        w         w             WWWW 
*/

///     back space when a letter overlaps the one previous or makes a ligature !!!!!!!
///     some other backspace issues, like with the capitals

///     spaces after ligatures, like pho
///     problem with ligatures spacing when following one another
///     ligatures will go up to last line if at the beginning of a new line
///     ligatures and autospace not playing nice

///     fix radio buttons - connect to js

///     niqqud
///     breaks before s? .....?

let     dictionary = () => io

const   title = document.getElementById('title')
        title.addEventListener('click', () => console.table(Typewriter.history))
const   text = document.getElementById('text')
        text.addEventListener('keydown', e => { 
            Typewriter.switchboard(e, settings) 
        })
        text.focus()
const   star = document.getElementById('star')
        star.addEventListener('click', () => { Typewriter.clear() })
const   optInput = document.getElementById('options')
        optInput.addEventListener('input', e => { 
            let val = e.target.value
            // Typewriter.clear()
            dictionary = () => dix[val]
         })
const   messages = document.getElementById('messages')
        messages.addEventListener('click', () => { console.log('message')})
const   canvas = document.getElementById('canvas')
        canvas.addEventListener('click', () => text.focus())
const   CX = canvas.getContext('2d')
        CX.canvas.width = 800
        CX.canvas.height = 800
const   METAKEYS = ['Shift', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape']

const   settings = {
    scaleFactor: 1,
    letterWidth: 40,
    letterHeight: 70,
    ligModifier: (7 / 5).toFixed(2),
    offset() {
        return {
            // x: Math.floor(Math.random() * 4), 
            // y: Math.floor(Math.random() * 4)
            x:0,
            y:0
        }
    },
    padding: 0,
    get ligWidth() {    return this.letterWidth * this.ligModifier },
    get hwRatio() {     return this.letterHeight / this.letterWidth },
    get lineWidth() {   return Math.min(this.letterWidth / 4, this.letterHeight / 7) },
    get lineHeight() {  return this.letterHeight * (1 + 2 / 5) },
    get middle() {      return this.letterHeight * 5 / 12 },
    get centerX() {     return this.letterWidth / 2 },
    get centerY() {     return this.letterWidth / 2 },
    get rad() {         return this.lineWidth / 2 },
}

//  these are overriding the settings object
// const   scaleFactor = 1
// const   letterWidth = 64 * scaleFactor
// const   letterHeight = 112 * scaleFactor
// const   middle = 5 * letterHeight / 12
// const   centerX = letterWidth / 2
// const   centerY = letterHeight / 2
// const   lineWidth = letterWidth / 5
// const   rad = lineWidth / 2
// const   ligModifier = 7 / 5
// const   lineHeight = letterHeight * (1 + 2 / 5)

function scale(...c) { 
    let    ヤキソバ = c.map(e => e * scaleFactor)
    if    (ヤキソバ.length === 1) return ヤキソバ[0]
    return ヤキソバ
}

const Typewriter = {
    history: [],
    get last() { return this.history[this.history.length - 1] },
    getPrev(n = 1) {
        if (this.history.length === 0) return undefined
        return this.history[this.history.length - n]
    },
    set add(val) { if (val) { this.history.push(val) } },
    xCoord: 0,
    yCoord: 0,
    get coords() { return {x: this.xCoord, y: this.yCoord} },
    set x(val) { x = val }, //Math.round(val)
    set y(val) { y = val },

    switchboard(e) {
        // clean key here
        // any event cleanup business
        let key = e.key
        if (!dictionary()[key] 
            && dictionary()[key.toLowerCase()]) { 
            key = key.toLowerCase() 
        }
        this.control(key, settings)
    },
    
    control(key, settings) { 
        // console.log(this.xCoord, this.yCoord)
        // let letterWidth = settings.letterWidth || 64
        // let letterHeight = settings.letterHeight || 112
        // let scale = settings.scaleFactor || 1

        if (!METAKEYS.includes(key)) {
            // console.log(key)
            if (key === 'Backspace') {
                this.backspace()
                return
            }
            else if (key === 'Enter') {
                this.enter()
                return
            }
            else if (key === ' ') {
                this.add = {key: 'space', w: settings.letterWidth, x: this.xCoord, y: this.yCoord}
                this.xCoord += settings.letterWidth
                return
            }
            else if (key === '\\') {
                // using this to just break up ligatures
                this.add = {key: 'spacer', w: settings.letterWidth / 2, x: this.xCoord, y: this.yCoord}
                return
            }
            else if (key === '|') {
                this.add = {key: 'lilSpace', w: settings.letterWidth / 4, x: this.xCoord, y: this.yCoord}
                this.xCoord += settings.letterWidth / 2
                return
            }
            else if (key === '') {
                this.add = {key: 'weeSpace', w: settings.letterWidth / 4, x: this.xCoord, y: this.yCoord}
                this.xCoord += settings.letterWidth / 4
                return
            }
            // get canvas from printer
            else if (dictionary()[key]) {
                // determine if meta character or ligature from history/dictionary
                // get letter width
                let [letter, width, height] = carriage.resolve(key)
                // console.log(letter, width, height)

                // CX.fillStyle = '#ffff0080'
                // CX.fillRect(
                //     this.xCoord, 
                //     this.yCoord, 
                //     width, 
                //     height)
                // CX.fillStyle = '#ffa500a0'
                // CX.fillRect(
                //     this.xCoord + settings.lineWidth + 2, 
                //     this.yCoord + settings.lineWidth + 2, 
                //     width - (settings.lineWidth * 2) - 4, 
                //     height - (settings.lineWidth * 2) - 4
                // )

                let cnv = printer.print(letter, width)
                
                // get coordinatesfrom carriage
                let [xCoord, yCoord] = carriage.spacing(letter)
                // let xCoord = this.coords.x
                // let yCoord = this.coords.y
                

                // console.log(letterHeight) // <--- global variable or from settings object? might be more
                CX.drawImage(cnv, xCoord, yCoord, width, settings.letterHeight)
                this.add = { key: letter, x: xCoord, y: yCoord, w: width, h:height }

                // console.clear()
                // console.table(this.history)
                

                let autospace = dictionary()?.autospace?.x || 0
                
                // based on width             
                this.xCoord = xCoord + width + autospace
                // this.xCoord = xCoord + settings.letterWidth
                       
                // console.log(this.xCoord, width, this.xCoord + width)
                // console.log(this.yCoord, height)
                
            } 
            else { console.log('not found!!!!') }

            // return value??
        }
    },
    backspace() {
        let removed = this.getPrev()
        // console.log(removed)
        if (removed) {
            let x = Math.floor(removed.x)
            let y = Math.floor(removed.y)
            let w = Math.ceil(removed.w) + 1
            let h = Math.ceil(removed.h) + 1
            CX.clearRect(x, y, w, h)
            this.history.pop()
        }
        let last = this.getPrev()
        // console.log(last)
        if (last) {
            this.yCoord = last.y
            if (last.key !== 'enter') {
                this.xCoord = last.x + last.w + (dictionary()?.autospace?.x || 0)
            } else {
                this.xCoord = 0
                this.yCoord += settings.lineHeight
            }
        } else if (removed) {
            this.xCoord = removed.x
            this.yCoord = removed.y
        } else {
            this.xCoord = 0
            this.yCoord = 0
        }
        // console.log(this.xCoord, this.yCoord)
    },
    enter() {
        this.add = {key: 'enter', w: 0, x: this.xCoord, y: this.yCoord}
        this.xCoord = 0
        this.yCoord += settings.lineHeight
    },
    clear() {
        this.history = []
        CX.clearRect(0, 0, 800, 800)
        this.xCoord = 0
        this.yCoord = 0
        console.clear()
        text.value = ''
        text.focus()
    },
}


// working
const carriage = {
    noLigFlag: false,

    resolve(key) {
        // console.log(key)
        let [width, height] = [settings.letterWidth, settings.letterHeight]
        let letter = key

        if (dictionary()?.tags?.supershort.includes(letter)) {
            height = settings.lineWidth         // e
        } else if (dictionary()?.tags?.short.includes(letter)) {
            height = (settings.letterHeight + settings.lineWidth) / 2
        }                                       // a, i, n, r, s, t
        
        if (['e', 'i'].includes(letter) && dictionary()?.shortenEI) {
            width = settings.letterWidth - settings.lineWidth
        }

        if (dictionary()?.tags?.spacers.includes(letter)) {
            width = settings.letterWidth / 2    // m, t
        }

        // substituting ligatures
        if (this.noLigFlag === false) {
            if (key === 'h') {
                let lig = `${Typewriter.getPrev()?.key}h`
                if (dictionary()[lig]) {
                    letter = lig                // ch, gh, kh, ph, sh, th, wh, zh
                    Typewriter.backspace()
                    if (!['sh', 'th'].includes(letter)) {
                        width = width * settings.ligModifier
                    }
                }
            }
            if (key === 'o') {
                let lig = `${Typewriter.getPrev()?.key}o`
                if (dictionary()[lig]) {
                    letter = lig                // oo
                    Typewriter.backspace()
                    width = width * settings.ligModifier
                }
            }
            else if (dictionary()[`${Typewriter.getPrev()?.key}${letter}`]) {
                letter = `${Typewriter.getPrev()?.key}${letter}`
                Typewriter.backspace()
                width = settings.letterWidth    // ee, ii
            }
        }
        else { 
            this.noLigFlag = false
        }
        // console.log(letter, width, height)
        return [letter, width, height]
    },

    spacing(letter) {
        // console.log(letter)
        let nAdjustment = settings.lineWidth * 3 / 2
        let pAdjustment = settings.lineWidth
        let [x, y] = [Typewriter.xCoord, Typewriter.yCoord]

        // spacing dots
        if (['E', 'I', 'S'].includes(letter)) {
            if (dictionary()[Typewriter.getPrev()?.key]){
                if (!dictionary()?.tags?.spacers.includes(Typewriter.getPrev()?.key)) {
                    if (letter === 'E' 
                    && dictionary()?.tags?.antisupershort.includes(Typewriter.getPrev()?.key)
                    || dictionary()?.tags?.antishort.includes(Typewriter.getPrev()?.key)) {
                        x -= pAdjustment            // bE, dE, gE, kE, nE, oE, xE, yE
                    } else if (letter === 'I') {
                        if (dictionary()?.tags?.antishort.includes(Typewriter.getPrev()?.key)) {
                            x -= pAdjustment        // gI, oI
                        }
                        else if (Typewriter.getPrev()?.key === 'e') {
                            x -= pAdjustment / 2    // eI
                        } else {
                            x += pAdjustment        // all -I except eI, gI, mI, oI, tI
                        }
                    } else {
                        x += pAdjustment            // all -S except mS, tS
                    }
                }
            }
        }

        // compacting a, e, i, n, r, s, t
        if (dictionary()?.tags?.short.includes(letter)) {
            if (dictionary()?.tags?.supershort.includes(letter)) {
                if (dictionary()?.tags?.antisupershort.includes(Typewriter.getPrev()?.key)
                || dictionary()?.tags?.antishort.includes(Typewriter.getPrev()?.key)
                || Typewriter.getPrev()?.key === 'I') {
                    x -= nAdjustment    // be, de, ge, ie, ke, ne, oe, xe, ye
                } 
                else if (dictionary()?.tags?.eSpace.includes(Typewriter.getPrev()?.key)) {
                    x += pAdjustment    // ae, ce, ee, fe, he, je, le, pe, qe, re, se, ue, ve, we, ze
                }
            }
            else if (['i'].includes(letter)
            && dictionary()?.tags?.iSpace.includes(Typewriter.getPrev()?.key)) {
                x += pAdjustment        // all -i except ei, gi, mi, oi, ti
            }
            else if (['s'].includes(letter)
            && dictionary()?.tags?.sCSpace.includes(Typewriter.getPrev()?.key)) {
                x += pAdjustment        // as, cs, es, fs, hs, is, js, ls, ps, qs, rs, us, wx, zs
            }
            else if (dictionary()?.tags?.antishort.includes(Typewriter.getPrev()?.key)) {
                // x -= nAdjustment
                x -= pAdjustment        // ga, oa, gi, oi, gn, on, gr, or, gt, ot
            }
        }

        // compacting h, b
        if (dictionary()?.tags?.hbConnectors.includes(letter)) {
            if (['b', 'h'].includes(Typewriter.getPrev()?.key)) {
                x -= pAdjustment        // ba, bj, bn, bo, br, bt, by, ha, hj, hn, ho, hr, ht, hy
                this.noLigFlag = true
            }
        }
        // space after c, g, k, p, s, t, w, z - h
        if (dictionary()?.tags?.hLigatures.includes(Typewriter.getPrev()?.key)) {
            if (letter === 't'
            && ['ch', 'gh'].includes(Typewriter.getPrev()?.key)) {
                x -= pAdjustment        // cht, ght
                this.noLigFlag = true
            }
            else { 
                x += pAdjustment        // ch-, gh-, kh-, ph-, sh-, th-, wh-, zh-
            }
        }



        // some stuff with numbers here






        // console.log(x, y)
        return [x, y]
    },
}












const printer = {
    print(letter, width, canvas) {
        // console.log(letter, width, canvas)
        let cnv = canvas || document.createElement('canvas')
        cnv.width = width || settings.letterWidth
        cnv.height = settings.letterHeight
        let pcx = cnv.getContext('2d')
        pcx.lineWidth = settings.lineWidth
        pcx.lineCap = 'square'
        pcx.lineJoin = ''
        // pcx.lineCap = 'round'
        // pcx.lineJoin = 'round'
        
        // just for tests
        if (canvas) {
            let grad = pcx.createLinearGradient(0, 0, 0, cnv.height)
            grad.addColorStop(0, '#ccf')
            grad.addColorStop(.5, '#aad')
            pcx.strokeStyle = grad
        }

        pcx.beginPath()

        let {x, y} = this.zone(1, {width:cnv.width})
        pcx.moveTo(x, y)
        // pcx.fillStyle = '#0f04'
        // pcx.fillRect(x, y, cnv.width - settings.lineWidth, cnv.height - settings.lineWidth)
        dictionary()[letter]().forEach(el => {
            // console.log(el)
            let op = el.shift()
            let args = [...el]
            // or let func = el[0]
            //    let args = el.slice(1)
            op.call(this, pcx, ...args, {width: cnv.width, offset: settings.offset(), padding: settings.padding})
        })

        if ( dictionary()[letter]().some(e => e[0].name === 'dot') ) {
            pcx.fill()
        } else {
            pcx.stroke()
        }
        // console.log(cnv)
        return cnv
    },
    // working
    move(ctx, point, options) {
        let width = options?.width || settings.letterWidth
        let offset = options?.offset || {x:0, y:0}
        let padding = options?.padding || 0
        let {x, y} = this.grid(point, {width:width, offset:offset, padding:padding})
        // console.log(x, y)

        ctx.moveTo(x, y)
    },
    moveLine(ctx, start, end, options) {
        let width = options?.width || settings.letterWidth
        let offset = options?.offset || {x:0, y:0}
        let padding = options?.padding || 0
        let {x, y} = this.grid(start, {width:width, offset:offset, padding:padding})
        let {x:xEnd, y:yEnd} = this.grid(end, {width:width, offset: {x:0, y:0}})

        ctx.moveTo(x, y)
        ctx.lineTo(xEnd, yEnd)
    },
    line(ctx, point, options) {
        // console.log(options?.width)
        let width = options?.width || settings.letterWidth
        let offset = options?.offset || {x:0, y:0}
        let padding = options?.padding || 0
        let {x, y} = this.grid(point, {width:width, offset:offset, padding:padding})
        // console.log(x, y)

        ctx.lineTo(x, y)
    },
    dot(ctx, point, options) {
        let {x, y} = this.grid(point, {width: options.width})
        ctx.arc(x, y, settings.rad, 0, Math.PI * 2 )
    },
    square(ctx, point, options) {
        let {x, y} = this.zone(point)
        console.log(x, y)
        ctx.moveTo(x, y)
        ctx.lineTo(x, y)
    },
    curve(ctx, start, type, options) {
        let width = options.width || settings.letterWidth
        const t = {
            q: {   lr: 0, w: 0, uh: 0 },
            s: {   lr: 0, w: 0, uh: 1 },
            ch: {  lr: 0, w: 1, uh: 1 },
            zh: {  lr: 1, w: 1, uh: 1 },
            j: {   lr: 1, w: 0, uh: 1 },
            v: {   lr: 1, w: 0, uh: 0 }
        }
        let end = start + (t[type].lr 
            ? t[type].w ? 4 : 5
            : t[type].w ? 2 : 1)
        let control = start + (t[type].uh 
            ? 3 
            : t[type].lr ? 2 : -2)
        let {x, y} = this.grid(start, {width:width})
        let {x:x2, y:y2} = this.grid(end, {width:width})
        let {x:cpx, y:cpy} = this.grid(control, {width:width})

        ctx.moveTo(x, y)
        ctx.quadraticCurveTo(cpx, cpy, x2, y2)
    },
    curve2(ctx, point, cp, options) {
        let width = options.width || settings.letterWidth

        let {x, y} = this.grid(point, {width:width})
        let {x:cpx, y:cpy} = this.grid(cp, {width:width})

        // ctx.moveTo(x, y)
        ctx.quadraticCurveTo(cpx, cpy, x, y)
    },
    betterCurve(ctx, start, end, cp, options) {
        let width = options.width || settings.letterWidth
        let offsetStart = options.offsetStart || {x:0, y:0}
        let offsetEnd = options.offsetEnd || {x:0, y:0}
        let offsetCP = options.offsetCP || {x:0, y:0}
        // console.log(start, end, cp)

        let {x, y} = this.grid(start, {width:width})
        let {x:x2, y:y2} = this.grid(end, {width:width})
        let {x:cpx, y:cpy} = this.grid(cp, {width:width})

        ctx.moveTo(x, y)
        ctx.quadraticCurveTo(cpx, cpy, x2, y2)
    },
    betterLine(ctx, start, end, options) {
        let width = options.width || settings.letterWidth
        let {x, y} = this.grid(start, {width:width})
        let {x:xEnd, y:yEnd} = this.grid(end, {width:width})

        ctx.lineTo(x, y)
        ctx.lineTo(xEnd, yEnd)
    },

    zone(z, options) {
        // console.log(z, options)
        let width = options?.width || settings.letterWidth
        let offset = options?.offset || {x:0, y:0}
        let padding = options?.padding || 0
        // console.log(width, offset, padding)
        let [x, y] = [0, 0]
        switch (z) {
            case 1:
                x = settings.rad + offset.x + padding
                y = settings.rad + offset.y + padding
                break;    
            case 2:
                x = width / 2 + offset.x - padding
                y = settings.rad + offset.y + padding
                break;
            case 3:
                x = width - settings.rad + offset.x - padding
                y = settings.rad + offset.y + padding
                break;

            case 4:
                x = settings.rad + offset.x + padding
                y = settings.letterHeight / 2 + offset.y
                break;
            case 5:
                x = width / 2 + offset.x - padding
                y = settings.letterHeight / 2 + offset.y
                break;
            case 6:
                x = width - settings.rad + offset.x - padding
                y = settings.letterHeight / 2 + offset.y
                break;

            case 7:
                x = settings.rad + offset.x + padding
                y = settings.letterHeight - settings.rad + offset.y - padding
                break;
            case 8:
                x = width / 2 + offset.x - padding
                y = settings.letterHeight - settings.rad + offset.y - padding
                break;
            case 9:
                x = width - settings.rad + offset.x - padding
                y = settings.letterHeight - settings.rad + offset.y - padding
                break;
            default:
                break;
        }
        return {x, y}
    },
    grid(point, options) {
        let width = options.width || settings.letterWidth
        let height = options.widheightth || settings.letterHeight
        let [x, y] = point || [0, 0]
        let xOffset = x * (width - settings.lineWidth) / 24
        let yOffset = y * (height - settings.lineWidth) / 24

        return {
            x: settings.rad + xOffset,
            y: settings.rad + yOffset,
        }
    },
}

// let grid = []
// for (let i = 0; i < 168; i += 13) {
//     let temp = []
//     for (let j = 0; j < 13; j++) {
//         temp.push(j)
//     }
//     grid.push(temp)
// }
// console.log(grid)












/*






xyz








*/ 
























var main = {
    a() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 12]]
        ] 
    },
    b() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.curve2, [0, 24], [24, 24]]
        ] 
    },
    c() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 24]],
            [printer.moveLine, [0, 12], [24, 12]],
        ] 
    },
    d() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.moveLine, [0, 24], [24, 24]],

        ]   
    },
    e() {
        return [
            [printer.line, [24, 0]]
        ]   
    },
    f() {
        return [
            [printer.line, [24, 0]],
            [printer.moveLine, [24, 12], [0, 12]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    g() {
        return [
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ] 
    },
    h() {
        return [
            [printer.line, [24, 0]],
            [printer.moveLine, [0, 12], [24, 12]],
            [printer.curve2, [0, 24], [24, 24]]
        ]     
    },
    i() {
        return [
            [printer.line, [24, 0]],
            [printer.moveLine, [0, 12], [24, 12]],
        ]    
    },
    j() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 12]],
            [printer.curve2, [24, 24], [0, 24]]
        ] 
    },
    k() {
        return [
            [printer.line, [0, 24]],
            [printer.moveLine, [0, 12], [24, 12]],
        ]   
    },
    l() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.moveLine, [0, 24], [24, 24]],
        ]  
    },
    m() {
        return [
            [printer.line, [0, 24]]
        ]   
    },
    n() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    o() {
        return [
            [printer.line, [0, 12]],
            [printer.curve2, [24, 24], [0, 24]]
        ]   
    },
    p() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    q() {
        return [
            [printer.move, [24, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.moveLine, [24, 12], [0, 12]],
            [printer.line, [0, 24]]
        ]   
    },
    r() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    s() {
        return [
            [printer.line, [24, 0]],
            [printer.curve2, [0, 12], [24, 12]]
        ]    
    },
    t() {
        return [
            [printer.line, [0, 12]]
        ]   
    },
    u() {
        return [
            [printer.line, [24, 0]],
            [printer.moveLine, [24, 12], [0, 12]],
            [printer.line, [0, 24]]
        ]   
    },
    v() {
        return [
            [printer.line, [24, 0]],
            [printer.curve2, [0, 12], [24, 12]],
            [printer.line, [0, 24]]
        ]   
    },
    w() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 24]]
        ]   
    },
    x() {
        // eldest way
        // return function(ctx, c) {
            //     printer.origin(ctx, c)
            //     printer.curve(ctx, c, 'j')
            //     printer.xFix(ctx, c)
            //     printer.curve(ctx, c, 'q')
            // }   
            // old old way
            // return function(ctx, c) {
                //     printer.origin(ctx, c)
                //     printer.skip(ctx, c)
                //     printer.maxX(ctx, c)
                //     printer.curve(ctx, c, 'q')
                //     printer.origin(ctx, c)
                //     printer.curve(ctx, c, 'j')
                // } 
                // old way
                // return function(ctx) {
                    //     printer.curve(1, 'j', ctx)
                    //     printer.curve(4, 'q', ctx)
                    // }
        // lol
        // return [
        //     [printer.curve, [0, 0], 'j'],
        //     [printer.curve, [24, 12], 'q']
        // ]   
        return [
            [printer.curve2, [24, 12], [0, 12]],
            [printer.move, [24, 12]],
            [printer.curve2, [0, 24], [0, 12]]
        ]
    },
    y() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.move, [0, 12]],
            [printer.curve2, [24, 24], [0, 24]]
        ]    
    },
    z() {
        return [
            [printer.line, [24, 0]],
            [printer.moveLine, [0, 12], [24, 12]],
            [printer.move, [0, 12]],
            [printer.curve2, [24, 24], [0, 24]]
        ]     
    },





    1() { return this.e() },
    2() { return this.i() },
    3() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]],
            [printer.move, [0, 24]],
            [printer.line, [24, 24]],
        ]  
    },
    4() { return this.t() },
    5() { return this.n() },
    6() { return this.d() },
    7() { return this.b() },
    8() { return this.m() },
    9() { return this.a() },
    0() { return this.o() },

    ch() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 24]],
            [printer.moveLine, [0, 12], [24, 12]],
            [printer.curve2, [12, 24], [24, 24]],
        ]
    },
    ee() {
        return [
            [printer.line, [24, 0]]    // maybe keep ??
        ]
    },
    gh() {
        return [
            [printer.line, [0, 24]],
            [printer.line, [12, 24]],
            [printer.moveLine, [12, 0], [24, 0]],
            [printer.moveLine, [12, 12], [24, 12]],
            [printer.curve2, [12, 24], [24, 24]],
        ]  
    },
    ii() {
        return [
            [printer.line, [24, 0]],   // maybe keep
            [printer.moveLine, [0, 12], [24, 12]],
        ]
    },
    kh() {
        return [
            [printer.line, [0, 24]],
            [printer.moveLine, [12, 0], [24, 0]],
            [printer.moveLine, [0, 12], [24, 12]],
            [printer.curve2, [12, 24], [24, 24]],
        ]   
    },
    oo() {
        return [
            [printer.line, [0, 12]],
            [printer.curve, [0, 12], 'zh'],
            [printer.moveLine, [12, 0], [12, 12]],
            [printer.curve, [12, 12], 'zh']
        ]   
    },
    ph() {
        return [
            [printer.moveLine, [12, 12], [24, 12]],
            [printer.curve2, [12, 24], [24, 24]],
            [printer.line, [0, 24]],
            [printer.line, [0, 0]],
            [printer.line, [24, 0]]
        ]  
    },
    sh() {
        return [
            [printer.line, [24, 0]],
            [printer.curve2, [0, 12], [24, 12]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]],
            [printer.curve2, [0, 24], [24, 24]],
        ]  
    },
    th() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.curve2, [0, 24], [24, 24]],
        ] 
    },
    wh() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 24]],
            [printer.moveLine, [12, 12], [24, 12]],
            [printer.curve2, [12, 24], [24, 24]],
        ]  
    },
    zh() {
        return [
            [printer.line, [24, 0]],
            [printer.moveLine, [0, 12], [24, 12]],
            [printer.curve2, [12, 24], [24, 24]],
            [printer.curve2, [0, 12], [0, 24]],
        ]  
    },
    E() {
        return [
            [printer.dot, [0, 0]],
        ]
    },
    I() {
        return [
            [printer.dot, [0, 0]],
            [printer.move, [0, 12]],
            [printer.dot, [0, 12]]
        ]
    },
    S() {
        return [
            [printer.dot, [0, 0]],
            [printer.move, [0, 12]],
            [printer.dot, [0, 12]],
            [printer.move, [0, 24]],
            [printer.dot, [0, 24]]
        ]
    },
    '='() { return  [[printer.line, [24, 0]]] },
    '-'() { return  [[printer.moveLine, [0, 12], [24, 12]]] },
    _() { return    [[printer.moveLine, [0, 24], [24, 24]]] },
    // working
    direction: 'left-to-right',
    shortenEI: true,
    tags: {
        short: ['a', 'e', 'i', 'n', 'r', 's', 't', 
        'ee', 'ii',
        '1', '2', '4', '9'],
        antishort: ['g', 'o',
        '0'],
        supershort: ['e', 
        'ee',
        '1'],
        antisupershort: ['b', 'd', 'k', 'n', 'x', 'y',
        '5', '6', '7'],
        spacers: ['m', 't', 'E', 'I', 'S',
        '4', '8'],
        hLigatures: ['ch', 'gh', 'kh', 'ph', 'sh', 'th', 'wh', 'zh'],
        hbConnectors: ['a', 'j', 'n', 'o', 'r', 't', 'y'],
        eSpace: ['a', 'c', 'e', 'f', 'h', 'j', 'l', 'p', 'q', 'r', 's', 'u', 'v', 'w', 'z', 
        'ee',
        '1', '9'],
        // top, top two, top and bottom, and all three connectors
        iSpace: ['a', 'b', 'c', 'd', 'f', 'h', 'i', 'j', 'k', 'l', 'n', 'p', 'q', 'r', 's', 'u', 'v', 'w', 'x', 'y', 'z',
        'ii',
        '2', '5', '6', '7', '9'],
        //  top, middle, top two, top and bottom, and all three connectors
        eLSpace: ['a', 'e', 'j', 'p', 'w',
        'ee',
        '1', '9'],                     
        // base for e, top connectors only
        isLSpace: ['c', 'i', 'q', 'r', 'u', 'z',
        'ii',
        '2'],               
        // base for i and s, top & middle connectors only
        sSpace: ['c', 'f', 'h', 'i', 'l', 'q', 'r', 'u', 'z',
        'ii',
        '2'],  
        // less conservative for i and s, top two and all three connectors
        sCSpace: ['a', 'c', 'e', 'f', 'h', 'i', 'j', 'l', 'p', 'q', 'r', 'u', 'w', 'z',
        'ee', 'ii',
        '1', '2', '9'],
        // ^ using for s right now
        // more conservative for s, base e + i - s and v
    },
}



// inside out

const io = {
    // abcdefghijklmnopqrstuvwxyz
    // njcwtquhmbryiasxfkoegvdplz
    // a-n, b-j, c, d-w, e-t, f-q, g-u, h, i-m, k-r, l-y, o-s, p-x, v, z
    n() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]]
        ] 
    },
    j() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.curve2, [0, 24], [24, 24]]
        ] 
    },
    c() {
        return [
            [printer.moveLine, [24, 0], [0, 0]],
            [printer.line, [0, 24]],
            [printer.moveLine, [0, 12], [24, 12]],
        ] 
    },
    w() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    t() {
        return [
            [printer.line, [24, 0]]
        ]   
    },
    q() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [24, 12]],
            [printer.line, [0, 12]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    u() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ] 
    },
    h() {
        return [
            [printer.move, [24, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.curve2, [24, 24], [0, 24]]
        ]     
    },
    m() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]    
    },
    b() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.curve2, [24, 24], [0, 24]]
        ] 
    },
    r() {
        return [
            [printer.line, [0, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    y() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ]  
    },
    i() {
        return [
            [printer.line, [0, 24]]
        ]   
    },
    a() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    s() {
        return [
            [printer.line, [0, 12]],
            [printer.curve2, [24, 24], [0, 24]]
        ]   
    },
    x() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    f() {
        return [
            [printer.move, [24, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.line, [0, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    k() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    o() {
        return [
            [printer.line, [24, 0]],
            [printer.curve2, [0, 12], [24, 12]],
        ]    
    },
    e() {
        return [
            [printer.line, [0, 12]]
        ]   
    },
    g() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [24, 12]],
            [printer.line, [0, 12]],
            [printer.line, [0, 24]]
        ]   
    },
    v() {
        return [
            [printer.move, [24, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    d() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]]
        ]   
    },
    p() {
        return [
            [printer.curve2, [24, 12], [0, 12]],
            [printer.move, [24, 12]],
            [printer.curve2, [0, 24], [0, 12]]
        ]   
    },
    l() {
        return [
            [printer.line, [0, 12]],
            [printer.curve2, [24, 24], [0, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]    
    },
    z() {
        return [
            [printer.move, [24, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.line, [24, 12]],
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ]      
    },
    th() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [24, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.curve2, [24, 24], [0, 24]]
        ] 
    },
    direction: 'left-to-right',
       
    // a-n, b-j, c, d-w, e-t, f-q, g-u, h, i-m, k-r, l-y, o-s, p-x, v, z

    tags: {
        // these need to be here for this to work, lol
        supershort: ['t'],
        short: ['a', 'e', 'k', 'm', 'n', 'o', 't'],
        spacers: ['e', 'i'],
        hbConnectors: [],   // change to connectors
        hLigatures: [],     // chage to ligatures
        antishort: [],       // needed if letters added to 'short'
        antisupershort: ['a', 'j', 'w'],  // needed if letters added to 'supershort'
        eSpace: ['n', 'c', 't', 'q', 'h', 'b', 'y', 'x', 'f', 'k', 'o', 'g', 'v', 'd', 'z'],
            // needed if letters added to 'supershort'
    }
}

const yd = {
    o() {
        return this.a()
    },
    a() {
        return [
            [printer.betterLine, [0, 0], [12, 10]],
            [printer.betterCurve, [12, 0], [8, 6], [12, 6]],
            [printer.betterCurve, [3, 4], [0, 10], [0, 6]]
        ]
    },
    b() {
        return [
            [printer.betterLine, [0, 0], [3, 0]],
            [printer.betterCurve, [3, 0], [10, 5], [10, 0]],
            [printer.betterLine, [10, 5], [10, 10]],
            [printer.betterLine, [0, 10], [12, 10]]
        ]
    },
    g() {
        return [
            [printer.betterCurve, [2, 0], [9, 6], [8, 0]],
            [printer.betterLine, [9, 6], [12, 10]],
            [printer.betterLine, [8, 6], [0, 10]]
        ]
    },
    d() {
        return [
            [printer.betterLine, [0, 0], [12, 0]],
            [printer.betterCurve, [12, 0], [10, 3], [10, 0]],
            [printer.betterLine, [10, 3], [10, 10]]
        ]
    },
    h() {
        return [
            [printer.betterCurve, [0, 0], [11, 1], [10, 0]],
            [printer.betterCurve, [11, 1], [12, 10], [12, 1]],
            [printer.betterLine, [0, 5], [0, 10]]
        ]
    },
    w() {
        return this.v()
    },
    u() {
        return this.v()
    },
    v() {
        return [
            [printer.betterCurve, [3, 0], [9, 4], [9, 0]],
            [printer.betterLine, [9, 4], [9, 10]]
        ]
    },
    z() {
        return [
            [printer.betterLine, [3, 0], [9, 0]],
            [printer.betterCurve, [8, 0], [6, 6], [6, 1]],
            [printer.betterLine, [6, 6], [6, 10]]
        ]
    },
    x() {
        return this.ch()
    },
    // c() {
    //     return this.ch()     // not sure if helpful, needs to be here for ch to work
    // },
    ch() {
        return [
            [printer.betterCurve, [0, 0], [11, 1], [10, 0]],
            [printer.betterCurve, [11, 1], [12, 10], [12, 1]],
            [printer.betterCurve, [3, 0], [0, 6], [0, 0]],
            [printer.betterLine, [0, 6], [0, 10]]
        ]
    },
    t() {
        return [
            [printer.betterLine, [0, 0], [0, 6]],
            [printer.betterCurve, [0, 6], [6, 10], [0, 10]],
            [printer.betterCurve, [6, 10], [12, 6], [12, 10]],
            [printer.betterCurve, [12, 6], [7, 0], [12, 0]]
        ]
    },
    i() {
        return this.y()
    },
    y() {
        return [
            [printer.betterCurve, [3, 0], [9, 4], [10, 0]],
        ]
    },
    k() {
        return [
            [printer.betterCurve, [0, 0], [12, 5], [12, 0]],
            [printer.betterCurve, [12, 5], [0, 10], [12, 10]]
        ]
    },
    l() {
        return [
            [printer.betterCurve, [0, 0], [4, 3], [0, 3]],
            [printer.betterLine, [4, 3], [12, 3]],
            [printer.betterCurve, [12, 3], [8, 7], [12, 6]],
            [printer.betterCurve, [8, 7], [5, 10], [5, 8]]
        ]
    },
    m() {
        return [
            [printer.betterCurve, [0, 10], [7, 0], [1, 0]],
            [printer.betterCurve, [7, 0], [12, 4], [12, 0]],
            [printer.betterLine, [12, 4], [12, 10]],
            [printer.betterLine, [12, 10], [6, 10]],
            [printer.betterCurve, [0, 0], [2, 2], [0, 2]]
        ]
    },
    n() {
        return [
            [printer.betterCurve, [3, 0], [9, 6], [9, 0]],
            [printer.betterLine, [9, 6], [9, 10]],
            [printer.betterLine, [3, 10], [9, 10]]
        ]
    },
    s() {
        return [
            [printer.betterLine, [0, 0], [6, 0]],
            [printer.betterCurve, [6, 0], [12, 4], [12, 0]],
            [printer.betterLine, [12, 4], [12, 6]],
            [printer.betterCurve, [12, 6], [6, 10], [12, 10]],
            [printer.betterCurve, [6, 10], [0, 6], [0, 10]],
            [printer.betterLine, [0, 6], [0, 6]],
            [printer.betterCurve, [0, 6], [4, 0], [0, 2]],
        ]
    },
    e() {
        return [
            [printer.betterLine, [12, 0], [12, 7]],
            [printer.betterCurve, [12, 7], [0, 10], [12, 10]],
            [printer.betterLine, [0, 0], [4, 9]]
        ]
    },
    f() {
        return this.p()
    },
    p() {
        return [
            [printer.betterCurve, [4, 5], [1, 0], [0, 5]],
            [printer.betterCurve, [1, 0], [9, 1], [7, 0]],
            [printer.betterCurve, [9, 1], [12, 6], [12, 2]],
            [printer.betterLine, [12, 6], [12, 10]],
            [printer.betterLine, [12, 10], [0, 10]]
        ]
    },
    ts() {
        return this.tz()
    },
    tz() {
        return [
            [printer.betterLine, [0, 0], [12, 9]],
            [printer.betterLine, [12, 10], [0, 10]],
            [printer.betterCurve, [12, 0], [8, 5], [12, 5]]
        ]
    },
    q() {
        return [
            [printer.betterLine, [0, 0], [12, 0]],
            [printer.betterCurve, [12, 0], [6, 7], [12, 5]],
            [printer.betterLine, [0, 4], [0, 11]]
        ]
    },
    r() {
        return [
            [printer.betterLine, [0, 0], [4, 0]],
            [printer.betterCurve, [4, 0], [12, 4], [12, 0]],
            [printer.betterLine, [12, 4], [12, 10]]
        ]
    },
    sh() {
        return [
            [printer.betterLine, [0, 0], [0, 5]],
            [printer.betterCurve, [0, 5], [6, 10], [0, 10]],
            [printer.betterCurve, [6, 10], [12, 5], [12, 10]],
            [printer.betterLine, [12, 5], [12, 0]],
            [printer.betterCurve, [6, 0], [1, 7], [6, 7]]
        ]
    },
    th() {
        return [
            [printer.betterLine, [0, 0], [4, 0]],
            [printer.betterCurve, [4, 0], [12, 4], [12, 0]],
            [printer.betterLine, [12, 4], [12, 10]],
            [printer.betterCurve, [2, 0], [2, 10], [0, 6]],
            [printer.betterLine, [2, 10], [0, 10]],
        ]
    },
    // finals
    K() {
        return [
            [printer.betterCurve, [0, 0], [12, 6], [12, 0]],
            [printer.betterLine, [12, 6], [12, 12]],
        ]
    },
    M() {
        return [
            [printer.betterCurve, [0, 0], [12, 4], [12, 0]],
            [printer.betterLine, [12, 5], [12, 10]],
            [printer.betterLine, [12, 10], [0, 10]],
            [printer.betterLine, [0, 10], [0, 0]]
        ]
    },
    N() {
        return [
            [printer.betterCurve, [3, 0], [9, 6], [9, 0]],
            [printer.betterLine, [9, 6], [9, 12]],
        ]
    },
    F() {
        return this.P()
    },
    P() {
        return [
            [printer.betterCurve, [4, 5], [1, 0], [0, 5]],
            [printer.betterCurve, [1, 0], [9, 1], [7, 0]],
            [printer.betterCurve, [9, 1], [12, 6], [12, 2]],
            [printer.betterLine, [12, 6], [12, 12]]
        ]
    },
    T() {
        return this.TZ()
    },
    TS() {
        return this.TZ()
    },
    TZ() {
        return [
            [printer.betterLine, [0, 0], [0, 12]],
            [printer.betterCurve, [12, 0], [0, 6], [11, 5]],

        ]
    },


    // not used: i, j, o, p, u, w, x, 


    // get this to work 
    direction: 'right-to-left',
    // get this to work better
    autospace: {
        x: 20, y:0
    },
    tags: {
        // these need to be here for this to work, lol
        supershort: [],
        short: [],
        spacers: [],
        hbConnectors: [],   // change to connectors
        hLigatures: [], // ? not implemented right...
            // change to ligatures
        antishort: [],       // needed if letters added to 'short'
        antisupershort: [],  // needed if letters added to 'supershort'
        // eSpace: ['n', 'c', 't', 'q', 'h', 'b', 'y', 'x', 'f', 'k', 'o', 'g', 'v', 'd', 'z'],
            // needed if letters added to 'supershort'
    }
}

var spike = {
    co: {x: 5, y:10},
    a() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]]
        ] 
    },
    b() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.line, [0, 24]]
        ] 
    },
    c() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.move, [24, 12]],
            [printer.line, [0, 12]],
            [printer.line, [0, 24]]
        ] 
    },
    d() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    e() {
        return [
            [printer.line, [24, 0]]
        ]   
    },
    f() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [24, 12]],
            [printer.line, [0, 12]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    g() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ] 
    },
    h() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]],
            [printer.line, [0, 24]]
        ]     
    },
    i() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]    
    },
    j() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 24]]
        ] 
    },
    k() {
        return [
            [printer.line, [0, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    l() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ]  
    },
    m() {
        return [
            [printer.line, [0, 24]]
        ]   
    },
    n() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    o() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 24]]
        ]   
    },
    p() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]   
    },
    q() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 12]],
            [printer.line, [0, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    r() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    s() {
        return [
            [printer.line, [24, 0]],
            [printer.line, [0, 12]]
        ]    
    },
    t() {
        return [
            [printer.line, [0, 12]]
        ]   
    },
    u() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [24, 12]],
            [printer.line, [0, 12]],
            [printer.line, [0, 24]]
        ]   
    },
    v() {
        return [
            [printer.line, [24, 0]],
            [printer.line, [0, 12]],
            [printer.line, [0, 24]]
        ]   
    },
    w() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]]
        ]   
    },
    x() {
        return [
            [printer.line, [24, 12]],
            [printer.line, [0, 24]]
        ]   
    },
    y() {
        return [
            [printer.line, [0, 12]],
            [printer.line, [24, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]    
    },
    z() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [24, 12]],
            [printer.line, [0, 12]],
            [printer.line, [24, 24]]
        ]     
    },
    1() { return this.e() },
    2() { return this.i() },
    3() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]],
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ]  
    },
    4() { return this.t() },
    5() { return this.n() },
    6() { return this.d() },
    7() { return this.b() },
    8() { return this.m() },
    9() { return this.a() },
    0() { return this.o() },
    ch() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]],
            [printer.line, [12, 24]]
        ]
    },
    gh() {
        return [
            [printer.line, [0, 24]],
            [printer.line, [12, 24]],
            [printer.line, [24, 12]],
            [printer.line, [12, 12]],
            [printer.move, [12, 0]],
            [printer.line, [24, 0]]
        ]  
    },
    kh() {
        return [
            [printer.line, [0, 24]],
            [printer.move, [12, 0]],
            [printer.line, [24, 0]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]],
            [printer.line, [12, 24]]
        ]   
    },
    ph() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.line, [12, 24]],
            [printer.line, [24, 12]],
            [printer.line, [12, 12]]
        ]  
    },
    sh() {
        return [
            [printer.line, [24, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.line, [0, 24]],
        ]  
    },
    th() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.line, [0, 24]],
        ] 
    },
    wh() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.move, [12, 12]],
            [printer.line, [24, 12]],
            [printer.line, [12, 24]]
        ]  
    },
    zh() {
        return [
            [printer.line, [24, 0]],
            [printer.line, [24, 12]],
            [printer.curve, [0, 12], 'zh'],
            [printer.curve, [24, 12], 'ch'],
        ]  
    },
    E() {
        return [
            [printer.square, [0, 0]],
        ]
    },
    I() {
        return [
            [printer.square, [0, 0]],
            [printer.square, [0, 12]]
        ]
    },
    S() {
        return [
            [printer.square, [0, 0]],
            [printer.square, [0, 12]],
            [printer.square, [0, 24]]
        ]
    },
    '='() { return  [[printer.line, [24, 0]]] },
    '-'() { return  [[printer.line, [24, 12]]] },
    _() { return    [[printer.line, [24, 24]]] },
    direction: 'left-to-right',
    autospace: {x:-10, y:0},
    tags: {
        short: ['a', 'e', 'i', 'n', 'r', 's', 't'],
        antishort: ['g', 'o'],
        supershort: ['e'],
        antisupershort: ['b', 'd', 'k', 'n', 'x', 'y'],
        spacers: ['m', 't', 'E', 'I', 'S'],
        hLigatures: ['ch', 'gh', 'kh', 'ph', 'sh', 'th', 'wh', 'zh'],
        hbConnectors: ['a', 'j', 'n', 'o', 'r', 't', 'y'],
        eSpace: ['a', 'c', 'e', 'f', 'h', 'j', 'l', 'p', 'q', 'r', 's', 'u', 'v', 'w', 'z'],
        // top, top two, top and bottom, and all three connectors
        iSpace: ['a', 'b', 'c', 'd', 'f', 'h', 'i', 'j', 'k', 'l', 'n', 'p', 'q', 'r', 's', 'u', 'v', 'w', 'x', 'y', 'z'],
        //  top, middle, top two, top and bottom, and all three connectors
        eLSpace: ['a', 'e', 'j', 'p', 'w'],                     
        // base for e, top connectors only
        isLSpace: ['c', 'i', 'q', 'r', 'u', 'z'],               
        // base for i and s, top & middle connectors only
        sSpace: ['c', 'f', 'h', 'i', 'l', 'q', 'r', 'u', 'z'],  
        // less conservative for i and s, top two and all three connectors
        sCSpace: ['a', 'c', 'e', 'f', 'h', 'i', 'j', 'l', 'p', 'q', 'r', 'u', 'w', 'z'],
        // ^ using for s right now
        // more conservative for s, base e + i - s and v
    },
}

var en = {
    a() {
        return [
            [printer.move, [0, 24]],
            [printer.line, [12, 0]],
            [printer.line, [24, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ] 
    },
    b() {
        return [
            [printer.line, [0, 24]],
            [printer.line, [24, 12]],
            [printer.line, [0, 12]],
            [printer.line, [12, 0]],
            [printer.line, [0, 0]],
        ] 
    },
    c() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 24]],
        ] 
    },
    d() {
        return [
            [printer.line, [24, 12]],
            [printer.line, [0, 24]],
            [printer.line, [0, 0]]
        ]   
    },
    e() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    f() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    g() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]],
            [printer.line, [24, 12]],
            [printer.line, [12, 12]]
        ] 
    },
    h() {
        return [
            [printer.line, [0, 24]],
            [printer.move, [24, 0]],
            [printer.line, [24, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]     
    },
    i() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [12, 0]],
            [printer.line, [12, 24]],
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ]    
    },
    j() {
        return [
            [printer.line, [24, 0]],
            // [printer.move, [12, 0]],
            [printer.line, [24, 24]],
            [printer.line, [0, 24]],
            [printer.line, [0, 12]]
        ] 
    },
    k() {
        return [
            [printer.line, [0, 24]],
            [printer.move, [24, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 24]]
        ]   
    },
    l() {
        return [
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]  
    },
    m() {
        return [
            [printer.move, [0, 24]],
            [printer.line, [0, 0]],
            [printer.line, [12, 12]],
            [printer.line, [24, 0]],
            [printer.line, [24, 24]]
        ]   
    },
    n() {
        return [
            [printer.move, [0, 24]],
            [printer.line, [0, 0]],
            [printer.line, [24, 24]],
            [printer.line, [24, 0]]
        ]   
    },
    o() {
        return [
            [printer.move, [0, 12]],
            [printer.line, [12, 0]],
            [printer.line, [24, 12]],
            [printer.line, [12, 24]],
            [printer.line, [0, 12]]
        ]   
    },
    p() {
        return [
            [printer.move, [0, 24]],
            [printer.line, [0, 0]],
            [printer.line, [24, 0]],
            [printer.line, [24, 12]],
            [printer.line, [0, 12]]
        ]   
    },
    q() {
        return [
            [printer.line, [24, 0]],
            [printer.line, [24, 24]],
            [printer.line, [0, 24]],
            [printer.line, [0, 0]],
            [printer.move, [12, 12]],
            [printer.line, [24, 24]]
        ]   
    },
    r() {
        return [
            [printer.move, [0, 24]],
            [printer.line, [0, 0]],
            [printer.line, [24, 0]],
            [printer.line, [24, 12]],
            [printer.line, [0, 12]],
            [printer.line, [24, 24]]
        ]   
    },
    s() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 12]],
            [printer.line, [24, 12]],
            [printer.line, [24, 24]],
            [printer.line, [0, 24]]
        ]    
    },
    t() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [12, 0]],
            [printer.line, [12, 24]]
        ]   
    },
    u() {
        return [
            [printer.line, [0, 24]],
            [printer.line, [24, 24]],
            [printer.line, [24, 0]]
        ]   
    },
    v() {
        return [
            [printer.line, [12, 24]],
            [printer.line, [24, 0]]
        ]   
    },
    w() {
        return [
            [printer.line, [0, 24]],
            [printer.line, [12, 12]],
            [printer.line, [24, 24]],
            [printer.line, [24, 0]]
        ]   
    },
    x() {
        return [
            [printer.line, [24, 24]],
            [printer.move, [24, 0]],
            [printer.line, [0, 24]]
        ]   
    },
    y() {
        return [
            [printer.line, [12, 12]],
            [printer.line, [24, 0]],
            [printer.move, [12, 12]],
            [printer.line, [12, 24]]
        ]    
    },
    z() {
        return [
            [printer.line, [24, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]     
    },
    '-'() { 
        return [
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ] 
    },
    _() { 
        return [
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ] 
    },
    '+'() {
        return [
            [printer.square, [12, 12]]
        ]
    },
    direction: 'left-to-right',
    autospace: {x:5, y:0},
    tags: {
        // these need to be here for this to work, lol
        supershort: [],
        short: [],
        spacers: [],
        hbConnectors: [],   // change to connectors
        hLigatures: [], // ? not implemented right...
            // change to ligatures
        // antishort: [],       // needed if letters added to 'short'
        // antisupershort: [],  // needed if letters added to 'supershort'
        // eSpace: ['n', 'c', 't', 'q', 'h', 'b', 'y', 'x', 'f', 'k', 'o', 'g', 'v', 'd', 'z'],
            // needed if letters added to 'supershort'
    }
}

var basic = {
    a() {
        return [
            [printer.move, [0, 24]],
            [printer.line, [12, 0]],
            [printer.line, [24, 24]],
            [printer.move, [6, 16]],
            [printer.line, [18, 16]]
        ] 
    },
    b() {
        return [
            [printer.line, [12, 0]],
            [printer.curve2, [22, 6], [22, 0]],
            [printer.curve2, [12, 12], [22, 12]],
            [printer.line, [0, 12]],
            [printer.move, [12, 12]],
            [printer.curve2, [24, 18], [24, 12]],
            [printer.curve2, [12, 24], [24, 24]],
            [printer.line, [0, 24]],
            [printer.line, [0, 0]]

        ] 
    },
    c() {
        return [
            [printer.move, [24, 6]],
            [printer.curve2, [12, 0], [22, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.curve2, [12, 24], [0, 24]],
            [printer.curve2, [24, 18], [22, 24]]
        ] 
    },
    d() {
        return [
            [printer.line, [12, 0]],
            [printer.curve2, [24, 12], [24, 0]],
            [printer.curve2, [12, 24], [24, 24]],
            [printer.line, [0, 24]],
            [printer.line, [0, 0]]
        ]   
    },
    e() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]],
            [printer.move, [0, 12]],
            [printer.line, [22, 12]]
        ]   
    },
    f() {
        return [
            [printer.move, [24, 0]],
            [printer.line, [0, 0]],
            [printer.line, [0, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]   
    },
    g() {
        return [
            [printer.move, [24, 6]],
            [printer.curve2, [12, 0], [22, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.curve2, [12, 24], [0, 24]],
            [printer.curve2, [24, 13], [24, 24]],
            [printer.line, [12, 13]],
            [printer.move, [24, 13]],
            [printer.line, [24, 24]]
        ] 
    },
    h() {
        return [
            [printer.line, [0, 24]],
            [printer.move, [24, 0]],
            [printer.line, [24, 24]],
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ]     
    },
    i() {
        return [
            [printer.move, [6, 0]],
            [printer.line, [18, 0]],
            [printer.move, [12, 0]],
            [printer.line, [12, 24]],
            [printer.move, [6, 24]],
            [printer.line, [18, 24]]
        ]    
    },
    j() {
        return [
            [printer.move, [12, 0]],
            [printer.line, [24, 0]],
            [printer.line, [24, 12]],   
            [printer.curve2, [12, 24], [24, 24]],
            [printer.curve2, [0, 16], [0, 24]]

        ] 
    },
    k() {
        return [
            [printer.line, [0, 24]],
            [printer.move, [24, 0]],
            [printer.line, [6, 10]],
            [printer.curve2, [24, 24], [20, 16]]
        ]   
    },
    l() {
        return [
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]  
    },
    m() {
        return [
            [printer.move, [0, 24]],
            [printer.line, [0, 0]],
            [printer.line, [12, 12]],
            [printer.line, [24, 0]],
            [printer.line, [24, 24]]
        ]   
    },
    n() {
        return [
            [printer.move, [0, 24]],
            [printer.line, [0, 0]],
            [printer.line, [24, 24]],
            [printer.line, [24, 0]]
        ]   
    },
    o() {
        return [
            [printer.move, [12, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.curve2, [12, 24], [0, 24]],
            [printer.curve2, [24, 12], [24, 24]],
            [printer.curve2, [12, 0], [24, 0]]
        ]   
    },
    p() {
        return [
            [printer.line, [12, 0]],
            [printer.curve2, [24, 6], [24, 0]],
            [printer.curve2, [12, 12], [24, 12]],
            [printer.line, [0, 12]],
            [printer.move, [0, 0]],
            [printer.line, [0, 24]]

        ]   
    },
    q() {
        return [
            [printer.move, [12, 0]],
            [printer.curve2, [0, 12], [0, 0]],
            [printer.curve2, [12, 24], [0, 24]],
            [printer.curve2, [24, 12], [24, 24]],
            [printer.curve2, [12, 0], [24, 0]],
            [printer.move, [16, 18]],
            [printer.line, [24, 24]]
        ]   
    },
    r() {
        return [
            [printer.line, [12, 0]],
            [printer.curve2, [24, 6], [24, 0]],
            [printer.curve2, [12, 12], [24, 12]],
            [printer.line, [0, 12]],
            [printer.move, [12, 12]],
            [printer.curve2, [22, 18], [22, 12]],
            [printer.curve2, [24, 24], [22, 22]],
            [printer.move, [0, 0]],
            [printer.line, [0, 24]]
        ]   
    },
    s() {
        return [
            [printer.move, [24, 4]],
            [printer.curve2, [12, 0], [22, 0]],
            [printer.curve2, [0, 6], [0, 0]],
            [printer.curve2, [12, 12], [0, 12]],
            [printer.curve2, [24, 18], [24, 12]],
            [printer.curve2, [12, 24], [24, 24]],
            [printer.curve2, [0, 20], [2, 24]]
        ]    
    },
    t() {
        return [
            [printer.line, [24, 0]],
            [printer.move, [12, 0]],
            [printer.line, [12, 24]]
        ]   
    },
    u() {
        return [
            [printer.line, [0, 14]],
            [printer.curve2, [12, 24], [0, 24]],
            [printer.curve2, [24, 14], [24, 24]],
            [printer.line, [24, 0]],
        ]   
    },
    v() {
        return [
            [printer.line, [12, 24]],
            [printer.line, [24, 0]]
        ]   
    },
    w() {
        return [
            [printer.line, [4, 24]],
            [printer.line, [12, 12]],
            [printer.line, [20, 24]],
            [printer.line, [24, 0]]
        ]   
    },
    x() {
        return [
            [printer.line, [24, 24]],
            [printer.move, [24, 0]],
            [printer.line, [0, 24]]
        ]   
    },
    y() {
        return [
            [printer.line, [12, 12]],
            [printer.line, [24, 0]],
            [printer.move, [12, 12]],
            [printer.line, [12, 24]]
        ]    
    },
    z() {
        return [
            [printer.line, [24, 0]],
            [printer.line, [0, 24]],
            [printer.line, [24, 24]]
        ]     
    },
    '-'() { 
        return [
            [printer.move, [0, 12]],
            [printer.line, [24, 12]]
        ] 
    },
    _() { 
        return [
            [printer.move, [0, 24]],
            [printer.line, [24, 24]]
        ] 
    },
    '+'() {
        return [
            [printer.square, [12, 12]]
        ]
    },
    direction: 'left-to-right',
    autospace: {x:10, y:0},
    tags: {
        // these need to be here for this to work, lol
        supershort: [],
        short: [],
        spacers: [],
        hbConnectors: [],   // change to connectors
        hLigatures: [], // ? not implemented right...
            // change to ligatures
        // antishort: [],       // needed if letters added to 'short'
        // antisupershort: [],  // needed if letters added to 'supershort'
        // eSpace: ['n', 'c', 't', 'q', 'h', 'b', 'y', 'x', 'f', 'k', 'o', 'g', 'v', 'd', 'z'],
            // needed if letters added to 'supershort'
    }
}

const dix = {
    main: main,
    io: io,
    yd: yd,
    en: en,
    spike: spike,
    basic: basic
}








// tests
let strings = [
    // 'wijit',
]
let scaler = 0.5
for (const string of strings) {
    if (!string) { Typewriter.yCoord -= (settings.lineHeight * scaler) } //Math.round
    for (let i = 0; i < string.length; i++) {
        let canvas = document.createElement('canvas')
        let [temp, width, height] = carriage.resolve(string[i])
        canvas.width = width 
        canvas.height = height
        let cnv = printer.print(temp, width, canvas)
        CX.drawImage(cnv, Typewriter.xCoord, Typewriter.yCoord, width * scaler, height * scaler)
        Typewriter.xCoord += width * scaler
    }
    Typewriter.enter(scaler)
    Typewriter.history = []
}







/// search with regular expressions





// var basketModule = (function () {
 
//     // privates
   
//     var basket = [];
   
//     function doSomethingPrivate() {
//       //...
//     }
   
//     function doSomethingElsePrivate() {
//       //...
//     }
   
//     // Return an object exposed to the public
//     return {
   
//       // Add items to our basket
//       addItem: function( values ) {
//         basket.push(values);
//       },
   
//       // Get the count of items in the basket
//       getItemCount: function () {
//         return basket.length;
//       },
   
//       // Public alias to a private function
//       doSomething: doSomethingPrivate,
   
//       // Get the total value of items in the basket
//       getTotal: function () {
   
//         var q = this.getItemCount(),
//             p = 0;
   
//         while (q--) {
//           p += basket[q].price;
//         }
   
//         return p;
//       }
//     };
//   })();         // <-- IIFE
// // basketModule returns an object with a public API we can use
 
// basketModule.addItem({
//     item: "bread",
//     price: 0.5
//   });
   
//   basketModule.addItem({
//     item: "butter",
//     price: 0.3
//   });
   
//   // Outputs: 2
//   console.log( basketModule.getItemCount() );
   
//   // Outputs: 0.8
//   console.log( basketModule.getTotal() );
   
//   // However, the following will not work:
   
//   // Outputs: undefined
//   // This is because the basket itself is not exposed as a part of our
//   // public API
//   console.log( basketModule.basket );
   
//   // This also won't work as it only exists within the scope of our
//   // basketModule closure, but not in the returned public object
//   console.log( basket );

