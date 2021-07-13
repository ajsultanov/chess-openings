/*
    w   w      w           w       w       wwwww        WWWWW 
    w   w      w           w       w         w          W
    w w w      w       w   w       w         w          WWWW 
    ww ww      w       w   w       w         w              W
    w   w      w        www        w         w          WWWW 
*/

///     back space when a letter overlaps the one previous or makes a ligature !!!!!!!
///     some other backspace issues, like with the capitals
///     problem with ligatures spacing when following one another
///     zh

const   title = document.getElementById('title')
        title.addEventListener('click', () => console.table(Typewriter.history))
const   text = document.getElementById('text')
        text.addEventListener('keydown', e => { 
            Typewriter.switchboard(e, options) 
        })
        text.focus()
const   star = document.getElementById('star')
        star.addEventListener('click', () => { Typewriter.clear() })
const   canvas = document.getElementById('canvas')
        canvas.addEventListener('click', () => text.focus())
const   CX = canvas.getContext('2d')
        CX.canvas.width = 800
        CX.canvas.height = 800
const   METAKEYS = ['Shift', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape']

const   options = {
    scaleFactor: 1,
    letterWidth: 64,
    letterHeight: 112,
    ligModifier: (7 / 5).toFixed(2),
    get ligWidth() {    return this.letterWidth * this.ligModifier },
    get hwRatio() {     return this.letterHeight / this.letterWidth },
    get lineWidth() {   return Math.min(this.letterWidth / 4, this.letterHeight / 7) },
    get lineHeight() {  return this.letterHeight * (1 + 2 / 5) },

    get middle() {      return this.letterHeight * 5 / 12 },
    get centerX() {     return this.letterWidth / 2 },
    get centerY() {     return this.letterWidth / 2 },
    get rad() {         return this.lineWidth / 2 },
}

//  these are overriding the options object
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
        if (!dictionary[key] && dictionary[key.toLowerCase()]) { 
            key = key.toLowerCase() 
        }
        this.control(key, options)
    },
    
    control(key, options) { 
        // let letterWidth = options.letterWidth || 64
        // let letterHeight = options.letterHeight || 112
        // let scale = options.scaleFactor || 1

        if (!METAKEYS.includes(key)) {
            if (key === 'Backspace') {
                this.backspace()
                return
            }
            else if (key === 'Enter') {
                this.enter()
                return
            }
            else if (key === ' ') {
                this.add = {key: 'space', w: options.letterWidth, x: this.xCoord, y: this.yCoord}
                this.xCoord += options.letterWidth
                return
            }
            else if (key === '\\') {
                // using this to just break up ligatures
                this.add = {key: 'spacer', w: options.letterWidth / 2, x: this.xCoord, y: this.yCoord}
                return
            }
            else if (key === '|') {
                this.add = {key: 'lilSpace', w: options.letterWidth / 4, x: this.xCoord, y: this.yCoord}
                this.xCoord += options.letterWidth / 2
                return
            }
            else if (key === '+') {
                this.add = {key: 'weeSpace', w: options.letterWidth / 4, x: this.xCoord, y: this.yCoord}
                this.xCoord += options.letterWidth / 4
                return
            }
            // get canvas from printer
            else if (dictionary[key]) {
                // determine if meta character or ligature from history/dictionary
                // get letter width
                let [letter, width, height] = carriage.resolve(key)
                // console.log(letter, width, height)
                let cnv = printer.print(letter, width)
                
                // get coordinatesfrom carriage
                let [xCoord, yCoord] = carriage.spacing(letter)
                // let xCoord = this.coords.x
                // let yCoord = this.coords.y
                
                // console.log(letterHeight) // <--- global variable or from options object? might be more
                CX.drawImage(cnv, xCoord, yCoord, width, options.letterHeight)
                this.add = {key: letter, w: width, h:height, x: xCoord, y: yCoord}
                
                // based on width                
                this.xCoord = xCoord + width
                // this.xCoord = xCoord + options.letterWidth
                
            } 
            else { console.log('not found!!!!') }

            // return value??
        }
    },
    backspace() {
        let last = this.getPrev()
        if (last) {
            let [x, y, w, h] = [last.x, last.y, last.w, last.h]
            CX.clearRect(x, y, w, h)
            this.xCoord = last.x
            this.yCoord = last.y
            this.history.pop()
        }
    },
    enter() {
        this.add = {key: 'enter', w: 0, x: this.xCoord, y: this.yCoord}
        this.xCoord = 0
        this.yCoord += options.lineHeight
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






const carriage = {
    noLigFlag: false,
    nAdjustment: options.lineWidth * 3 / 2,
    pAdjustment: options.lineWidth,

    resolve(key) {
        let [width, height] = [options.letterWidth, options.letterHeight]
        let letter = key

        if (dictionary.tags.short.includes(letter)) {
            height = (options.letterHeight + options.lineWidth) / 2
        }
        else if (dictionary.tags.supershort.includes(letter)) {
            height = options.lineWidth
        }

        if (dictionary.tags.spacers.includes(letter)) {
            width = options.letterWidth / 2 
        }
        if (!this.noLigFlag) {
            if (key === 'h') {
                let lig = `${Typewriter.getPrev()?.key}h`
                if (dictionary[lig]) {
                    letter = lig
                    Typewriter.backspace()
                    if (!['sh', 'th'].includes(letter)) {
                        width = width * options.ligModifier
                    }
                }
            }
            if (key === 'o') {
                let lig = `${Typewriter.getPrev()?.key}o`
                if (dictionary[lig]) {
                    letter = lig
                    Typewriter.backspace()
                    width = width * options.ligModifier
                }
            }
        }
        else { 
            this.noLigFlag = false
        }
        return [letter, width, height]
    },

    spacing(letter) {
        let [x, y] = [Typewriter.xCoord, Typewriter.yCoord]

        if (['E', 'I', 'S'].includes(letter)) {
            if (!['m', 't', 'E', 'I', 'S', 'space', 'enter', undefined].includes(Typewriter.getPrev()?.key)) {
                x += this.pAdjustment
            }
        }
        if (dictionary.tags.short.includes(letter)) {
            if (dictionary.tags.supershort.includes(letter)) {
                if (dictionary.tags.antisupershort.includes(Typewriter.getPrev()?.key)
                || dictionary.tags.antishort.includes(Typewriter.getPrev()?.key)) {
                    x -= this.nAdjustment
                } 
                else if (dictionary.tags.eSpace.includes(Typewriter.getPrev()?.key)) {
                    x += this.pAdjustment
                }
            }
            else if (['i'].includes(letter)
            && dictionary.tags.iSpace.includes(Typewriter.getPrev()?.key)) {
                x += this.pAdjustment
            }
            else if (['s'].includes(letter)
            && dictionary.tags.sSpace.includes(Typewriter.getPrev()?.key)) {
                x += this.pAdjustment
            }
            else if (dictionary.tags.antishort.includes(Typewriter.getPrev()?.key)) {
                x -= this.nAdjustment
            }
        }

        if (dictionary.tags.hbConnectors.includes(letter)) {
            if (['b', 'h'].includes(Typewriter.getPrev()?.key)) {
                x -= this.pAdjustment
                this.noLigFlag = true
            }
        }
        if (dictionary.tags.hLigatures.includes(Typewriter.getPrev()?.key)) {
            if (['ch', 'gh'].includes(Typewriter.getPrev()?.key) && letter === 't') {
                x -= this.nAdjustment
            }
            else { x += this.pAdjustment }
        }
        return [x, y]
    },
}












const printer = {
    print(letter, width, canvas) {
        let cnv = canvas || document.createElement('canvas')
        cnv.width = width || options.letterWidth
        cnv.height = options.letterHeight
        let pcx = cnv.getContext('2d')
        pcx.lineWidth = options.lineWidth
        pcx.lineCap = 'square'
        pcx.lineJoin = 'miter'
        
        // just for tests
        if (canvas) {
            let grad = pcx.createLinearGradient(0, 0, 0, cnv.height)
            grad.addColorStop(0, '#ccf')
            grad.addColorStop(.5, '#aad')
            pcx.strokeStyle = grad
        }

        pcx.beginPath()
        dictionary[letter]()(pcx)
        
        if (letter.match(/[a-z0-9_]{1,2}/)) {
            pcx.stroke()
        } else if (letter.match(/[A-Z]/)) {
            pcx.fill()
        }
        return cnv
    },
    line(start, end, ctx, width = options.letterWidth) {
        let {x, y} = this.zone(start, width)
        let {x:xEnd, y:yEnd} = this.zone(start + end, width)
        if (start > 6 ) {
            x *= options.ligModifier
            xEnd *= options.ligModifier
        }
        ctx.moveTo(x, y)
        ctx.lineTo(xEnd, yEnd)
    },
    dot(point, ctx) {
        let {x, y} = this.zone(point)
        x += options.rad
        y += options.rad
        ctx.arc(x, y, options.rad, 0, Math.PI * 2 )
    },
    // working
    curve(start, type, ctx, width = options.letterWidth) {
        const t = {
            q: {   lr: 0, w: 0, uh: 0 },
            s: {   lr: 0, w: 0, uh: 1 },
            lig: { lr: 0, w: 1, uh: 1 },
            j: {   lr: 1, w: 0, uh: 1 }
        }
        let {x, y} = this.zone(start)
        let [cpx, cpy] = [0, 0]
        let [x2, y2] = [0, 0]
        if (t[type].uh) {
            ({x:cpx, y:cpy} = this.zone(start + 2))
        } else {
            ({x:cpx, y:cpy} = this.zone(start - 1))
        }
        if (t[type].lr) {
            ({x:x2, y:y2} = this.zone(start + 3))
        } else {
            ({x:x2, y:y2} = this.zone(start + 1))
        }
        if (t[type].w) {
            x *= options.ligModifier;
            cpx *= options.ligModifier;
            ({x:x2, y:y2} = this.zone(9, width))
            x2 *= options.ligModifier
        }
        // console.log(x, cpx, x2)
        ctx.moveTo(x, y)
        ctx.quadraticCurveTo(cpx, cpy, x2, y2)
    },
    zone(z, width = options.letterWidth, offset = {x: 0, y: 0}, buffer = 0) {
        // console.log(z, width, offset, buffer)
        let [x, y] = [0, 0]
        switch (z) {
            case 1:
                x = options.rad + offset.x + buffer
                y = options.rad + offset.y + buffer
                break;
            case 2:
                x = width - options.rad + offset.x - buffer
                y = options.rad + offset.y + buffer
                break;
            case 3:
                x = options.rad + offset.x + buffer
                y = options.letterHeight / 2 + offset.y
                break;
            case 4:
                x = width - options.rad + offset.x - buffer
                y = options.letterHeight / 2 + offset.y
                break;
            case 5:
                x = options.rad + offset.x + buffer
                y = options.letterHeight - options.rad + offset.y - buffer
                break;
            case 6:
                x = width - options.rad + offset.x - buffer
                y = options.letterHeight - options.rad + offset.y - buffer
                break;

            case 7:
                x = width / 2 + offset.x - buffer
                y = options.rad + offset.y + buffer
                break;
            case 8:
                x = width / 2 + offset.x - buffer
                y = options.letterHeight / 2 + offset.y
                break;
            case 9:
                x = width / 2 + offset.x - buffer
                y = options.letterHeight - options.rad + offset.y - buffer
                break;
            default:
                break;
        }
        return {x, y}
    }
}








const dictionary = {
    a() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
        }
    },
    b() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
            printer.curve(4, 's', ctx)
        }
    },
    c() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
            printer.line(3, 2, ctx)
        }
    },
    d() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
            printer.line(5, 1, ctx)
        }   
    },
    e() {
        return function(ctx) {
            printer.line(1, 1, ctx)
        }   
    },
    f() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(3, 1, ctx)
            printer.line(3, 2, ctx)
            printer.line(5, 1, ctx)
        }
    },
    g() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 2, ctx)
            printer.line(5, 1, ctx)
        }   
    },
    h() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(3, 1, ctx)
            printer.curve(4, 's', ctx)
        }   
    },
    i() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(3, 1, ctx)
        }   
    },
    j() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.curve(3, 'j', ctx)
        }   
    },
    k() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
            printer.line(3, 2, ctx)
        }   
    },
    l() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
            printer.line(5, 1, ctx)
        }   
    },
    m() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 2, ctx)
        }   
    },
    n() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
        }   
    },
    o() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.curve(3, 'j', ctx)
        }   
    },
    p() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.line(3, 2, ctx)
            printer.line(5, 1, ctx)
        }
    },
    q() {
        return function(ctx) {
            printer.curve(2, 'q', ctx)
            printer.line(3, 1, ctx)
            printer.line(3, 2, ctx)
        }   
    },
    r() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
        }   
    },
    s() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.curve(2, 's', ctx)
        }   
    },
    t() {
        return function(ctx) {
            printer.line(1, 2, ctx)
        }
    },
    u() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(3, 1, ctx)
            printer.line(3, 2, ctx)
        }
    },
    v() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.curve(2, 's', ctx)
            printer.line(3, 2, ctx)
        }   
    },
    w() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.line(3, 2, ctx)
        }
    },
    x() {
        // old old way
        // return function(ctx, c) {
        //     printer.origin(ctx, c)
        //     printer.curve(ctx, c, 'j')
        //     printer.xFix(ctx, c)
        //     printer.curve(ctx, c, 'q')
        // }   
        // old way
        // return function(ctx, c) {
        //     printer.origin(ctx, c)
        //     printer.skip(ctx, c)
        //     printer.maxX(ctx, c)
        //     printer.curve(ctx, c, 'q')
        //     printer.origin(ctx, c)
        //     printer.curve(ctx, c, 'j')
        // } 
        return function(ctx) {
            printer.curve(1, 'j', ctx)
            printer.curve(4, 'q', ctx)
        }
    },
    y() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
            printer.curve(3, 'j', ctx)
        }   
    },
    z() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(3, 1, ctx)
            printer.curve(3, 'j', ctx)
        }   
    },





    1() { return this.e() },
    2() { return this.i() },
    3() {
        return function(ctx, c) {
            printer.line(1, 1, ctx)
            printer.line(3, 1, ctx)
            printer.line(5, 1, ctx)
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
        return function(ctx) {

            printer.line(1, 1, ctx, options.ligWidth)
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx, options.ligWidth)
            printer.line(3, 2, ctx)
            printer.curve(4, 'lig', ctx)
        }  
    },
    //working
    gh() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 2, ctx)
            printer.curve(4, 'lig', ctx)
            printer.line(7, -5, ctx)
            printer.line(8, -4, ctx)
            printer.line(5, 4, ctx)
        }  
    },
    kh() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
            printer.line(3, 2, ctx)
            printer.curve(4, 'lig', ctx)
            printer.line(7, -5, ctx)
            printer.line(8, -4, ctx)
        }  
    },
    oo() {
        return function(ctx) {
            printer.line(1, 2, ctx)
            printer.curve(3, 'j', ctx)
            printer.line(2, 2, ctx)
            printer.curve(4, 's', ctx)
            // printer.curve(4, 'j', ctx)
        }  
    },
    ph() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.line(3, 2, ctx)
            printer.line(7, -5, ctx)
            printer.line(8, -4, ctx)
            printer.line(5, 4, ctx)
            printer.curve(4, 'lig', ctx)
        }  
    },
    sh() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.curve(2, 's', ctx)
            printer.line(3, 1, ctx)
            printer.curve(4, 's', ctx)
        } 
    },
    th() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.line(3, 1, ctx)
            printer.curve(4, 's', ctx)
        } 
    },
    wh() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(1, 2, ctx)
            printer.line(3, 2, ctx)
            printer.curve(4, 'lig', ctx)
            printer.line(7, -5, ctx)
            printer.line(8, -4, ctx)
        }  
    },
    zh() {
        return function(ctx) {
            printer.line(1, 1, ctx)
            printer.line(3, 1, ctx)
            printer.curve(3, 'j', ctx)
            printer.curve(4, 's', ctx)
        }  
    },
    E() {
        return function(ctx) {
            printer.dot(1, ctx)
        }  
    },
    I() {
        return function(ctx) {
            printer.dot(1, ctx)
            printer.dot(3, ctx) // too low
        }  
    },
    S() {
        return function(ctx) {
            printer.dot(1, ctx)
            printer.dot(3, ctx) // too low
            printer.dot(5, ctx) // too low
        }  
    },
    _() {
        return function(ctx) {
            printer.line(5, 1, ctx)
        }  
    },
    tags: {
        short: ['a', 'e', 'i', 'n', 'r', 's', 't'],
        antishort: ['g', 'o'],
        supershort: ['e', 'E'],
        antisupershort: ['b', 'd', 'k', 'n', 'x', 'y'],
        spacers: ['m', 't', 'E', 'I', 'S'],
        hLigatures: ['ch', 'gh', 'kh', 'ph', 'sh', 'th', 'wh', 'zh'],
        hbConnectors: ['a', 'j', 'n', 'o', 'r', 't', 'y'], // D? L?
        eSpace: ['a', 'c', 'e', 'f', 'h', 'j', 'l', 'p', 'q', 'r', 's', 'u', 'v', 'w', 'z'], 
        // less conservative: a, e, j, p, w
        iSpace: ['a', 'b', 'c', 'd', 'f', 'h', 'i', 'j', 'k', 'l', 'n', 'p', 'q', 'r', 's', 'u', 'v', 'w', 'x', 'y', 'z'],
        // less conservative: c, i, q, r, u, z
        sSpace: ['c', 'f', 'h', 'i', 'l', 'q', 'r', 'u', 'z'], // A? E? J? P? V? W?
        // less conservative: c, i, q, r, u, z
        // more conservative: a, b, c, d, e, f, h, i, j, k, l, n, p, q, r, u, w, x, y, z
    },
}

// tests
let strings = []
let scaler = 0.5
for (const string of strings) {
    if (!string) { Typewriter.yCoord -= (options.lineHeight * scaler) } //Math.round
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




