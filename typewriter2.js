
function main() {
    console.log('WIJET with a J')

    // MESSAGING
    // let top = document.getElementById('top')
    // let message = document.getElementById('messaging')
    // message.style.width = '100%'
    // message.style.border = '1px solid #4001'

    // let canv1 = document.createElement('canvas')
    // let canv1cx = canv1.getContext('2d')
    // canv1cx.fillRect(0, 0, 20, 20)
    // canv1cx.fillStyle = '#fff'
    // canv1cx.fillText('A', 5, 10)
    // message.appendChild(canv1)
 
    // let canv2 = document.createElement('canvas')
    // canv2.id = 'canv2'
    // let canv2cx = canv1.getContext('2d')
    // canv2cx.fillStyle = '#f00'
    // canv2cx.fillRect(20, 0, 10, 20)
    // canv2cx.fillStyle = '#fff'
    // canv2cx.fillText('S', 10, 10)
    // canv2cx.style.width = 10
    // message.appendChild(canv2)


    // BOTTOM PIPES
    // const palette = document.querySelector("#palette")
    // for (let color of colors) {
        //     let myDiv = document.createElement('div')
        //     myDiv.style.backgroundColor = color
        //     myDiv.style.height = '150px'
    //     myDiv.style.width = '150px'
    //     palette.appendChild(myDiv)
    // }

    // CANVAS
    const canvas = document.querySelector("#canvas")
    if (canvas.getContext) {
        var cx = canvas.getContext("2d")
    } else {
        alert('Something is wrong with HTML5 Canvas.')
    }

    // cx.fillStyle = ['#ddf', '#dfd', '#fdd'][Math.round(Math.random() * 2)]
    cx.fillStyle = '#ddfa'
    cx.fillRect(0, 0, 800, 600)
    cx.fillStyle = '#000'

    currentLetter = ''

    const letterGroups = {
        tall:               ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'o', 'p', 'q', 'u', 'v', 'w', 'x', 'y', 'z'],
        middleConnectors:   ['b', 'c', 'd', 'f', 'h', 'i', 'k', 'l', 'n', 'q', 'r', 'u', 'x', 'y', 'z'],        
        eSpacers:           ['a', 'c', 'j', 'l', 'p', 'q', 'r', 's', 'v', 'w'],
        // middleSpace:        ['a', 'e', 'g', 'j', 'm', 'o', 'p', 't', 'w'],
        hbConnectors:       ['a', 'j', 'm', 'n', 'o', 'r', 't', 'y', 'z'],
        hLigatures:         ['c', 'g', 'k', 'p', 's', 't', 'w', 'z'],
        short:              ['a', 'e', 'i', 'n', 'r', 's', 't'],   
        lowerSpace:         ['c', 'k', 'q', 'u', 'v', 'w', 'x'],
        upperSpace:         ['b', 'd', 'k', 'n', 'x', 'y'],             
        iSpacers:           ['e', 'g', 'm', 'o', 't'],
        gLigatures:         ['d', 'f', 'g', 'l', 'p'],
        doubleConnectors:   ['c', 'i', 'q', 'r', 'u'],
        overBar:            ['f', 'h', 'u', 'z'],
        extraCharacters:    ['.', ',', '#', '-', '=', '\'', 'Space'],
        unusedSymbols:      ['&', '(', ')', '+', '[', ']'],
    }
        

// CONFIG
    let scale = 0.5
    let x = 0
    let y = 0
    const history = []
    const rawHistory = []
    const prev = i => history[history.length - i - 1]
    let line = 1
    let lineEnds = {}
    const specificLength = 40
    let feelinFiddly = false
    let alt = true




// UTILITY FUNCTIONS

    let colors = []
    const hex = ['d', 'e', 'f']
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                colors.push(`#${hex[i]}${hex[j]}${hex[k]}`)
            }
        }
    }

    const historyHandler = key => {
        if (prev(0) === 'Backspace') {
            history.pop()
        }
        history.push(key)

        const last4 = x => {
            if (x) {
                const hist = []
                for (const x of [3, 2, 1, 0]) {
                    hist.push(prev(x) || '')
                }
                console.log(hist.join(' '))
            }
        }
        // last4(prev(0))
    }
    const newLine = () => {
        lineEnds[line] = x
        line++
        x = 0
        y = scale * (line - 1) * 240
        history.push('newLine')
    }
    function keyCleaner(key) {
        let newKey = key
        // newKey = key.toLowerCase()
        newKey = newKey === ' ' ? 'Space' : newKey
        return newKey
    }

// DRAWING FUNCTIONS
    function printer(cx, ...func)  {
        func = func.flat()
    
        let width =         cx.canvas.width,
            height =        cx.canvas.height,
            wThickness =    0.1,
            hThickness =    wThickness * 2
            middle =        0.4,
            halfway =       0.5,
            radius =        0.7,
            fullway =       0.8

        cx.lineWidth = width * hThickness

        const printer1 = {
            'style': function(arg) {
                let color = arg === 'white'
                    ? '#fff'
                    : arg === 'black'
                    ? '#000'
                    : arg === 'random'
                    ? colors[Math.round(Math.random() * 26)] + '4'
                    : '#f00'
                cx.fillStyle = color
            },
            'fill': function() {
                cx.fillRect(0, 0, width, height)
            },
            'bar': function(arg) {
                let y = arg === 'top'
                    ? 0
                    : arg === 'middle'
                    ? height * middle
                    : arg === 'bottom'
                    ? height * fullway
                    : arg === 'second'
                    ? height * 0.3
                    : arg === 'third'
                    ? height * 0.6
                    : arg === 'fourth'
                    ? height - height * wThickness
                    : arg
                cx.fillRect(0, y, width, height * wThickness) 
            },
            'line': function(arg) {
                let y = arg === 'upper'
                    ? 0
                    : arg === 'lower'
                    ? height * middle
                    : 0
                let x = arg === 'right'
                    ? width - width * hThickness
                    : 0
                cx.fillRect(x, y, width * hThickness, height * halfway) 
            },
            'line3': function(arg) {
                let y = arg === 'up'
                    ? 0
                    : arg === 'mid'
                    ? height * 0.3
                    : arg === 'low'
                    ? height * 0.6
                    : 0
                let x = arg === 'right'
                    ? width - width * hThickness
                    : 0
                cx.fillRect(x, y, width * hThickness, height * 0.4) 
            },
            'arcLeft': function(arg) {
                let [y1, y2] = arg === 'top'
                    ? [height * wThickness, height * middle]
                    : arg === 'middle'
                    ? [height * halfway, height * fullway]
                    : arg
                cx.beginPath()
                cx.arc(width * hThickness, y1, width * radius, 0, Math.PI / 2)
                cx.stroke()
                cx.fillRect(0, y2, width * hThickness, height * wThickness)
            },
            'arcRight': function(arg) {
                let [y1, y2] = arg === 'top'
                    ? [height * wThickness, height * middle]
                    : arg === 'middle'
                    ? [height * halfway, height * fullway]
                    : arg
                cx.beginPath()
                cx.arc(width * fullway, y1, width * radius, Math.PI / 2, Math.PI)
                cx.stroke()
                cx.fillRect(0, y1 - height * wThickness, width * hThickness, height * wThickness)
                cx.fillRect(width * fullway, y2, width * hThickness, height * wThickness)
            },      
            'arcRightUp': function(arg) {
                let [y1, y2] = arg === 'middle'
                    ? [height * middle, 0]
                    : arg === 'bottom'
                    ? [height * fullway, height * middle]
                    : arg
                cx.beginPath()
                cx.arc(width * fullway, y1, width * radius, Math.PI, 3 * Math.PI / 2)
                cx.stroke()
                cx.fillRect(0, y1, width * hThickness, height * wThickness)
                cx.fillRect(width - width * hThickness, y2, width * hThickness, height * wThickness)
            },
            'diagLeft': function(arg) {
                let [y1, y2] = arg === 'top'
                    ? [0, height * halfway]
                    : arg === 'middle'
                    ? [height * middle, height - height * wThickness]
                    : arg
                cx.beginPath()
                cx.moveTo(width - width * hThickness, y1)
                cx.lineTo(width, y1)
                cx.lineTo(width, y1 + height * wThickness)
                cx.lineTo(width * hThickness, y2)
                cx.lineTo(0, y2)
                cx.lineTo(0, y2 - height * wThickness)
                cx.fill()
            },
            'circle': function(arg) {
                let y = arg === 'top'
                    ? height * wThickness
                    : arg === 'middle'
                    ? height * halfway - (width * hThickness / 2)
                    : arg
                cx.beginPath()
                cx.arc(width * hThickness, y, width * wThickness, 0, Math.PI * 2)
                cx.stroke()
            },
            'square': function(arg) {
                let y = arg === 'top'
                    ? 0
                    : arg === 'bottom'
                    ? height * fullway - (width * hThickness)
                    : arg
                cx.fillRect(0, y, width * hThickness * 2, height * wThickness * 2)
            },
            'dot': function(arg) {
                let y = arg === 'top'
                    ? 0
                    : arg === 'bottom'
                    ? height * fullway - (width * hThickness)
                    : arg
                cx.fillRect(0, y, width * hThickness, height * wThickness * 2)
            },
            'tinysquare': function(arg) {
                let y = arg === 'top'
                    ? 0
                    : arg === 'mid'
                    ? height * 0.3
                    : arg
                cx.fillRect(width * 0.2, y, width * hThickness, height * wThickness)
            },
        }

        printer1[func[0]](func[1])
    }

// DICTIONARY
    const dict = {
        a: [
            ['bar', 'top'],
            ['line', 'upper']
        ],
        b: [
            ['line', 'upper'],
            ['bar', 'middle'],
            ['arcLeft', 'middle'],
        ],
        c: [
            ['bar', 'top'],
            ['line', 'upper'],
            ['bar', 'middle'],
            ['line', 'lower']
        ],
        d: [
            ['line', 'upper'],
            ['bar', 'middle'],
            ['bar', 'bottom']
        ],
        e: [['bar', 'top']],
        f: [
            ['bar', 'top'],
            ['bar', 'middle'],
            ['line', 'lower'],
            ['bar', 'bottom']
        ],
        g: [
            ['line', 'upper'],
            ['line', 'lower'],
            ['bar', 'bottom']
        ],
        h: [
            ['style', 'white'],
            ['bar', 'bottom'],
            ['style', 'black'],
            ['bar', 'top'],
            ['bar', 'middle'],
            ['arcLeft', 'middle']
        ],
        i: [
            ['bar', 'top'],
            ['bar', 'middle']
        ],
        j: [
            ['bar', 'top'],
            ['line', 'upper'],
            ['arcRight', 'middle']
        ],
        k: [
            ['line', 'upper'],
            ['bar', 'middle'],
            ['line', 'lower']
        ],
        l: [
            ['bar', 'top'],
            ['line', 'upper'],
            ['bar', 'middle'],
            ['bar', 'bottom']
        ],
        m: [
            ['line', 'upper'],
            ['line', 'lower']
        ],
        n: [
            ['line', 'upper'],
            ['bar', 'middle']
        ],
        o: [
            ['line', 'upper'],
            ['arcRight', 'middle']
        ],
        p: [
            ['bar', 'top'],
            ['line', 'upper'],
            ['line', 'lower'],
            ['bar', 'bottom']
        ],
        q: [
            ['arcRightUp', 'middle'],
            ['bar', 'middle'],
            ['line', 'lower']
        ],
        r: [
            ['bar', 'top'],
            ['line', 'upper'],
            ['bar', 'middle']
        ],
        s: [
            ['bar', 'top'],
            ['arcLeft', 'top']
        ],
        t: [['line', 'upper']],
        u: [
            ['bar', 'top'],
            ['bar', 'middle'],
            ['line', 'lower']
        ],
        v: [
            ['bar', 'top'],
            ['arcLeft', 'top'],
            ['line', 'lower']
        ],
        w: [
            ['bar', 'top'],
            ['line', 'upper'],
            ['line', 'lower']
        ],
        x: [
            ['arcRight', 'top'],
            ['arcRightUp', 'bottom']
        ],
        y: [
            ['line', 'upper'],
            ['bar', 'middle'],
            ['arcRight', 'middle']
        ],
        z: [
            ['bar', 'top'],
            ['bar', 'middle'],
            ['arcRight', 'middle']
        ],
        1: [
            ['line', 'right']
        ],
        2: [
            ['line', 'upper'],
            ['diagLeft', 'top']
        ],
        3: [
            ['bar', 'top'],
            ['diagLeft', 'top']

        ],
        4: [
            ['bar', 'middle'],
            ['diagLeft', 'top']
        ],
        5: [
            ['diagLeft', 'top'],
            ['line', 'lower'],
            ['diagLeft', 'middle']
        ],
        6: [
            ['line', 'upper'],
            ['diagLeft', 'top'],
            ['line', 'lower'],
            ['diagLeft', 'middle']
        ],
        7: [
            ['bar', 'middle'],
            ['diagLeft', 'top'],
            ['diagLeft', 'middle']
        ],
        8: [
            ['diagLeft', 'top'],
            ['bar', 'middle'],
            ['diagLeft', 'middle'],
            ['bar', 'bottom']
        ],
        9: [
            ['bar', 'top'],
            ['line', 'upper'],
            ['line', 'lower'],
            ['diagLeft', 'top'],
            ['diagLeft', 'middle']
        ],
        0: [
            ['line', 'upper'],
            ['line', 'lower'],
            ['diagLeft', 'top']
        ],
        _: [
            ['style', 'random'],
            ['bar', 'bottom'],
            ['style', 'black'],
        ],
        '#': [['circle', 'top']],
        '.': [['square', 'bottom']],
        '\'': [['dot', 'top']],
        ',': [['dot', 'bottom']],
        '-': [['bar', 'middle']],
        '=': [['bar', 'middle']],
        'Space': [
            ['style', 'random'],
            'fill',
            ['style', 'black']
        ],
        '&': [
            ['line', 'upper'],
            ['bar', 'middle'],
            ['line', 'lower'],
            ['bar', 'bottom']
        ],
        '+': [
            ['bar', 'top'],
            ['bar', 'middle'],
            ['bar', 'bottom']
        ],
        '(': [
            ['bar', 'top'],
            ['line', 'upper'],
            ['bar', 'middle'],
            ['line', 'lower'],
            ['bar', 'bottom']
        ],
        ')': [
            ['arcRightUp', 'middle'],
            ['bar', 'middle'],
            ['bar', 'bottom']
        ],
        '[': [
            ['arcRightUp', 'middle'],
            ['bar', 'middle'],
            ['line', 'lower'],
            ['bar', 'bottom']
        ],
        ']': [
            ['bar', 'top'],
            ['line', 'upper'],
            ['bar', 'middle'],
            ['arcRight', 'middle']
        ],
        'E': [
            ['circle', 'top']
        ],
        'I': [
            ['circle', 'top'],
            ['circle', 'middle']
        ], 
        'Q': [
            ['square', 'top'],
            ['square', 'bottom']
        ],
    }

    const altDict = {
        a: [
            ['bar', 'top'],
            ['line3', 'up']
        ],
        b: [
            ['line3', 'up'],
            ['bar', 'second'],
            ['bar', 'third'],
            ['bar', 'fourth'],
        ],
        c: [
            ['line3', 'up'],
            ['bar', 'second'],
            ['line3', 'mid'],
            ['bar', 'third']
        ],
        d: [
            ['line3', 'up'],
            ['bar', 'second'],
            ['bar', 'third']
        ],
        e: [['tinysquare', 'top']],
        f: [
            ['bar', 'top'],
            ['bar', 'second'],
            ['line3', 'mid'],
            ['bar', 'third']
        ],
        g: [
            ['line3', 'up'],
            ['line3', 'mid'],
            ['bar', 'third']
        ],
        h: [
            ['bar', 'top'],
            ['bar', 'second'],
            ['bar', 'third'],
            ['bar', 'fourth'],
        ],
        i: [
            ['tinysquare', 'top'],
            ['tinysquare', 'mid']
        ],
        j: [
            ['bar', 'top'],
            ['line3', 'up'],
            ['line3', 'mid'],
            ['line3', 'low']
        ],
        k: [
            ['line3', 'up'],
            ['bar', 'second'],
            ['line3', 'mid']
        ],
        l: [
            ['bar', 'top'],
            ['line3', 'up'],
            ['bar', 'second'],
            ['bar', 'third']
        ],
        m: [
            ['line3', 'up'],
            ['line3', 'mid']
        ],
        n: [
            ['line3', 'up'],
            ['bar', 'second']
        ],
        o: [
            ['line3', 'up'],
            ['line3', 'mid'],
            ['line3', 'low'],
        ],
        p: [
            ['bar', 'top'],
            ['line3', 'up'],
            ['line3', 'mid'],
            ['bar', 'third']
        ],
        q: [
            ['line3', 'up'],
            ['line3', 'mid'],
            ['bar', 'third'],
            ['line3', 'low']
        ],
        r: [
            ['bar', 'top'],
            ['line3', 'up'],
            ['bar', 'second']
        ],
        s: [
            ['bar', 'top'],
            ['bar', 'second'],
            ['bar', 'third'],
        ],
        t: [['line3', 'up']],
        u: [
            ['bar', 'top'],
            ['bar', 'second'],
            ['line3', 'mid']
        ],
        v: [
            ['bar', 'top'],
            ['bar', 'second'],
            ['bar', 'third'],
            ['line3', 'low']
        ],
        w: [
            ['bar', 'top'],
            ['line3', 'up'],
            ['line3', 'mid']
        ],
        x: [
            ['line3', 'up'],
            ['bar', 'second'],
            ['bar', 'third'],
            ['line3', 'low']
        ],
        y: [
            ['line3', 'up'],
            ['bar', 'second'],
            ['line3', 'mid'],
            ['line3', 'low']
        ],
        z: [
            ['bar', 'top'],
            ['bar', 'second'],
            ['line3', 'mid'],
            ['line3', 'low']
        ],
        'Space': [
            ['style', 'random'],
            'fill',
            ['style', 'black']
        ]
    }
    
// KEY HANDLERS
    const letterResolver = key => {
        
        let image = document.createElement('canvas')
        if (key.match(/^\w$/)
            || letterGroups.extraCharacters.includes(key)
            || letterGroups.unusedSymbols.includes(key)
        ) {
            image.width = (['e', 'i', 'm', 'o', 't'].includes(key) && alt) 
                ? ['e', 'i'].includes(key) 
                    ? 60
                    : 50
                : 100
            image.height = 200
            let context = image.getContext('2d')
            if (!dict[key]) {
                key = 'Space'
            }
            if (key !== key.toLowerCase()
                && !['E', 'I', 'Q', 'Space'].includes(key)
            ) {
                key = key.toLowerCase()
            }

            if (alt) {
                for (let step of altDict[key]) {
                    printer(context, step)
                }
            } else {
                for (let step of dict[key]) {
                    printer(context, step)
                }
            }
           
            historyHandler(key)
            currentLetter = image
        } else {
            metaKeyHandler(key)
            image = null
        }
        return image
    }

    const metaKeyHandler = key => {
        switch (key) {
            case '!': console.log(x, y); break
            case '@': console.log(line, lineEnds); break
            case '$': console.log(history); break
            case '%': console.log(rawHistory); break
            case '^': console.log(colors); break
            case '*': console.log(currentLetter); break
            case '\\': 
                x += scale * 20
                historyHandler(key)
                break
            // case 'Space':
                // console.log('hmmmmmm')
            case 'Enter': 
                newLine()
                break
// needs work:
            case 'Backspace':
                if (prev(0) === 'newLine') {
                    console.log('\'enter\' encountered!')
                    x = lineEnds[line - 1]
                    line--
                    y = scale * (line - 1) * 240
                } else {
                    cx.clearRect(x - scale * 100 , y, scale * 100, scale * 200)
                    x = Math.max(0, x - scale * 100)
                }
                history.pop()
                break
            default: 
                break
        }
    }
    
// DRAWING & SPACING FUNCTIONS
    const drawer = (image, key) => {
        let beforeSpace = 0

if (!alt) {
// A, E, I, N, R, S, T
        if (letterGroups.short.includes(key)
            &&
            ['g', 'o'].includes(prev(1))
        ) {
            beforeSpace += (
                (key === 't')
                    ? -20               // GI, OI, GT, OT
                    : -specificLength   // GA, GE, GN, GR, GS, 
            )                           // OA, OE, ON, OR, OS
        }

// B
        if (prev(1) === 'b') {
            if (letterGroups.hbConnectors.includes(key)) {
                beforeSpace += -20      // BA, BJ, BN, BO
            }                           // BR, BT, BY 
        }
        
// E
        if (key === 'e') {
            if (letterGroups.eSpacers.includes(prev(1))
                || letterGroups.overBar.includes(prev(1))
                || prev(1) === 'e'
            ) {
                beforeSpace += specificLength   // AE, CE, JE, LE, PE, QE, RE, SE, VE, WE
            }                                   // EE, FE, HE, UE, ZE
            else if (letterGroups.upperSpace.includes(prev(1))) {
                beforeSpace += -specificLength  // BE, DE, GE, KE, NE, OE, XE, YE
            } 
            else if (['m', 't'].includes(prev(1))) {
                beforeSpace += 0                // ME, TE
            }
        }
        if (key === 'E') {
            if (letterGroups.upperSpace.includes(prev(1))
                || ['g', 'o'].includes(prev(1))
            ) {
                beforeSpace += -specificLength
            }
            else if (['m', 't'].includes(prev(1))) {
                beforeSpace += 0
            }
            else {
                beforeSpace += specificLength
            }
        }
        if (prev(1) === 'E') {
            beforeSpace += -20
        }

// H
        // dreadful & dreary
        if (key === 'h') {
            if (letterGroups.hLigatures.includes(prev(1))) {
                beforeSpace += (
                    prev(1) === 's'
                    ? -100   // SH
                    : prev(1) === 'z'
                    ? -30  // ZH
                    : -60   // CH, GH, KH, PH, TH, WH
                )
            }
            if (['j', 'o', 'y'].includes(prev(1))) {
                beforeSpace += -30
            }
        }
        if (prev(1) === 'h') {
            if (letterGroups.hbConnectors.includes(key)) {
                beforeSpace += (
                    letterGroups.hLigatures.includes(prev(2))
                        ? specificLength    // CHA, GHA, KHA, PHA, etc. 
                        : -20               // HA, HJ, HN, HO, HR, HT, HY
                )
            }
            else if (!['e', 'i', 's'].includes(key)
                && key.match(/^\w$/)
            ) {
                beforeSpace += specificLength
            }

        }

// I
        if (key === 'i') {
            if (['m', 't'].includes(prev(1))) {
                beforeSpace += 0                    // MI, TI
            }
            else if (!letterGroups.iSpacers.includes(prev(1))
                && prev(1)?.match(/^\w$/)
            ) {
                beforeSpace += specificLength       // All Excluding EI, GI, MI, OI, TO
            }
        }   
        if (key === 'I') {
            if (['m', 't'].includes(prev(1))) {
                beforeSpace += 0                    // MI, TI
            }
            if (letterGroups.upperSpace.includes(prev(1))
                || ['g', 'o'].includes(prev(1))
            ) {
                beforeSpace += -specificLength
            }
            else if (!letterGroups.iSpacers.includes(prev(1))
                && prev(1)?.match(/^\w$/)
            ) {
                beforeSpace += specificLength       // All Excluding EI, GI, MI, OI, TO
            }
        } 
        if (prev(1) === 'I') {
            beforeSpace += -20
        }
            
// M, T
        if (['m', 't'].includes(prev(1))) {
            beforeSpace += -specificLength
        }

// S
        if (key === 's') {
            if (letterGroups.middleConnectors.includes(prev(1))) {       
                beforeSpace += specificLength   // BS, CS, DS, FS, IS, KS, LS
            }                                   // NS, QS, RS, US, XS, YS, ZS
            else if (['m', 't'].includes(prev(1))) {
                beforeSpace += 0            // MS, TS 
                
            }                   
        }

// T
        if (key === 't') {
            if (prev(1) === 'h'
                && (prev(2) === 'c' || prev(2) === 'g')
            ) {
                beforeSpace += -60  // CHT, GHT
            }
        }}

// Punctuation
// Top
        if (['#', '\''].includes(key)) {
            if (letterGroups.upperSpace.includes(prev(1))
                || ['g', 'o'].includes(prev(1))
            ) {
                beforeSpace += -specificLength
            }
            else if (['m', 't'].includes(prev(1))) {
                beforeSpace += 0
            }
            else {
                beforeSpace += specificLength
            }
        }
        if (['*'].includes(key)) {
            if (['g', 'o'].includes(prev(1))) {
                beforeSpace += -specificLength
            }
            else if (['m', 't'].includes(prev(1))) {
                beforeSpace += 0
            }
            else {
                beforeSpace += specificLength
            }
        }
        if (['#', '*'].includes(prev(1))) {
            beforeSpace += -20
        }
        if (['\''].includes(prev(1))) {
            beforeSpace += -specificLength
        }
// Middle
        if (['-'].includes(key)) {
            if (letterGroups.middleSpace.includes(prev(1))) {
                beforeSpace += -specificLength
            }
        }
// Baseline
        if (['.', ','].includes(key)) {
            if (letterGroups.short.includes(prev(1))
                || ['m', 't'].includes(prev(1))
                || letterGroups.lowerSpace.includes(prev(1))
            ) {
                beforeSpace += -40
            }
            beforeSpace += 20
        }
        if (['.'].includes(prev(1))) {
            beforeSpace += -40
        }
        if ([','].includes(prev(1))) {
            beforeSpace += -60
        }




// bug repro: 
//      o ' r backspace m


// 1t 2t 3t 4t 5t 6t 7t 8t 9t 0t 
// 1m 2m 3m 4m 5m 6m 7m 8m 9m 0m



// FIDDLY AREA
        if (feelinFiddly) {
            beforeSpace += -20
            switch (prev(1)) {
                case 'a':
                    if (['c', 'f', 'h', 'j', 'l', 'p', 'u', 'v', 'w', 'z'].includes(key)) {
                        // ?
                    }
                    else if (['a', 'i', 'r', 's'].includes(key)) {
                        // ?
                    }
                    else if (['e'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'b':
                    if (letterGroups.hbConnectors.includes(key)) {
                        beforeSpace += 20
                    }  
                    else if (['i'].includes(key)) {
                        beforeSpace += -40
                    }
                    break
                case 'c':
                    if (['e', 'f', 'l', 'v', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['c', 'r', 'q', 'u'].includes(key)) {
                        // ?
                    }
                    else if (['h'].includes(key)) {
                        beforeSpace += 20
                    }
                    else if (['i', 's'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'd':
                    if (['b', 'd', 'f', 'h', 'i', 'l', 'n', 'r', 's', 'y', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'e':
                    if (['i'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['e'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'f':
                    if (['e', 'f', 'h', 'i', 'l', 'r', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'g':
                    if (['h'].includes(key)) {
                        beforeSpace += 20
                    }
                    else if (letterGroups.gLigatures.includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'h':
                    if (letterGroups.hLigatures.includes(prev(2))) {
                        beforeSpace += 20
                    }
                    else if (letterGroups.hbConnectors.includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'i':
                    if (['e'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['i', 's'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'j':
                    if (['a', 'f', 'j', 'l', 'p', 'r', 's', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'k':
                    if (!['a', 'e', 'g', 'h', 'j', 'm', 'o', 'p', 'w'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['h'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'l':
                    if (['e', 'f', 'h', 'i', 'l', 'r', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'm':
                    if (['e', 'i', 's'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'n':
                    if (!['a', 'e', 'g', 'j', 'm', 'o', 'p', 't', 'w'].includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'o':
                    if (['b', 'd', 'f', 'g', 'h', 'j', 'l', 'o', 'p', 'y', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'p':
                    if (['a', 'e', 'f', 'i', 'j', 'l', 'p', 'r', 's', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['h'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'q':
                    if (['f', 'h', 'l', 'v', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['c', 'r', 'q', 'u'].includes(key)) {
                        // ?
                    }
                    else if (['i', 's'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'r':
                    if (['e', 'f', 'h', 'l', 'v', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['c', 'r', 'q', 'u'].includes(key)) {
                        // ?
                    }
                    else if (['i', 's'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 's':
                    if (['h'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 't':
                    if (['h'].includes(key)) {
                        beforeSpace += 20
                    }
                    else if (['e', 'i', 's'].includes(key)) {
                        beforeSpace += 20
                    }
                    else if (letterGroups.tall.includes(key)
                        && (prev(2) === 'g' || prev(2) === 'o') 
                    ) {
                        beforeSpace += 20
                    }
                    break
                case 'u':
                    if (['e', 'f', 'h', 'l', 'v', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['c', 'r', 'q', 'u'].includes(key)) {
                        // ?
                    }
                    else if (['i', 's'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'v':
                    if ([].includes(key)) {
                        beforeSpace += 0
                    }
                    break
                case 'w':
                    if (['a', 'c', 'f', 'i', 'j', 'l', 'p', 'r', 's', 'u', 'v', 'w', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['h'].includes(key)) {
                        beforeSpace += 20
                    }
                    else if (['e'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case 'x':
                    if (!['a', 'e', 'g', 'j', 'm', 'o', 'p', 't', 'w'].includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'y':
                    if (['b', 'd', 'f', 'h', 'i', 'l', 'n', 'r', 's', 'y', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    break
                case 'z':
                    if (['e', 'f', 'i', 'l', 'r', 's', 'y', 'z'].includes(key)) {
                        beforeSpace += -20
                    }
                    else if (['h'].includes(key)) {
                        beforeSpace += 20
                    }
                    break
                case '\\':
                    if (key === 'h') {
                        if (prev(2) === 't') {
                            beforeSpace += -40
                        }
                        else if (prev(2) === 'c' 
                            || prev(2) === 'g'
                            || prev(2) === 'k'
                            || prev(2) === 'p'
                            || prev(2) === 'w'
                            || prev(2) === 'z'
                        ) {
                            beforeSpace += 20
                        }
                    }
                    break
                default:
                    break      
            }
        }

        x = Math.max(0, x + scale * beforeSpace)
        if (x >= 800 - 100 * scale) {
            newLine()
        }

        cx.drawImage(image, x, y, scale * 100, scale * 200)

        // cx.fillStyle = '#f99'
        // cx.fillRect(x, y, 10, 10)
        // cx.fillStyle = '#000'

        if (alt && ['e', 'i', 'm', 'o', 't'].includes(key)) {
            x += ['e', 'i', 'm', 'o', 't'].includes(key)
                ? scale * 60
                : scale * 50
        } else {
            x += scale * 100
        }
    }

// KEY LISTENERS
    const input = document.getElementById('input')
    const text = document.getElementById('text')
    input.addEventListener('keydown', e => {
        let key = e.key
        if (key !== 'Shift') rawHistory.push(key)
        key = keyCleaner(key)

        // console.log(key)
        
        let image = letterResolver(key)
        if (image) {
            drawer(image, key)
            currentLetter = image
        }
    })
    text.focus()
    canvas.addEventListener('click', () => text.focus())

}
window.onload = main