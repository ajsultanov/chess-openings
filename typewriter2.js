
function main() {
    console.log('WIJET with a J')

    const color = document.querySelector("#palette")
    const colorDict = ['d', 'e', 'f']
    for (let i = 0; i < 3; i++) {
        let r = colorDict[i]
        for (let i = 0; i < 3; i++) {
            let g = colorDict[i]
            for (let i = 0; i < 3; i++) {
                let b = colorDict[i]
                let myDiv = document.createElement('div')
                myDiv.style.backgroundColor = `#${r}${g}${b}`
                myDiv.style.height = '100px'
                myDiv.style.width = '100px'
                color.appendChild(myDiv)
            }
        }
    }

    const canvas = document.querySelector("#canvas")
    if (canvas.getContext) {
        const cx = canvas.getContext("2d")

        cx.fillStyle = '#ddf'
        cx.fillRect(0, 0, 800, 600)
        cx.fillStyle = 'black'

        currentLetter = ''

        const letterGroups = {
            tall:               ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'o', 'p', 'q', 'u', 'v', 'w', 'x', 'y', 'z'],
            middleConnectors:   ['b', 'c', 'd', 'f', 'h', 'i', 'k', 'l', 'n', 'q', 'r', 'u', 'x', 'y', 'z'],        
            eSpacers:           ['a', 'c', 'j', 'l', 'p', 'q', 'r', 's', 'v', 'w'],
            hLigatures:         ['c', 'g', 'k', 'p', 's', 't', 'w', 'z'],
            short:              ['a', 'e', 'i', 'n', 'r', 's', 't'],   
            hbConnectors:       ['a', 'j', 'n', 'o', 'r', 't', 'y'],
            upperSpace:         ['b', 'd', 'k', 'n', 'x', 'y'],             
            iSpacers:           ['e', 'g', 'm', 'o', 't'],
            gLigatures:         ['d', 'f', 'g', 'l', 'p'],
            doubleConnectors:   ['c', 'i', 'q', 'r', 'u'],
            overBar:            ['f', 'h', 'u', 'z'],
            upperMiddleSpace:   ['g', 'o'],  
            spacers:            ['m', 't'],
            extraCharacters:    ['#', '-', '\''],
        }

         


        let scale = .5
        let x = 0
        let y = 0
        let feelinFiddly = false
        const history = []
        const prev = i => history[history.length - i - 1]


        const historyHandler = key => {
            if (prev(0) === 'backspace') {
                history.pop()
            }
            history.push(key)
            // console.clear()
            // console.log(history)
            if (prev(0)) {
                const hist = []
                for (const x of [3, 2, 1, 0]) {
                    hist.push(prev(x) || '')
                }
                console.log(hist.join(' '))
            }
        }

        // DRAWING FUNCTIONS
        function topBar(cx) { cx.fillRect(0, 0, 100, 20) }
        function middleBar(cx) { cx.fillRect(0, 80, 100, 20) }
        function bottomBar(cx) { cx.fillRect(0, 160, 100, 20) }
        function upperLine(cx) { cx.fillRect(0, 0, 20, 100) }
        function lowerLine(cx) { cx.fillRect(0, 80, 20, 100) }
        function arcLeft(cx, type) {
            switch (type) {
                case 'topToMiddle':
                    cx.beginPath()
                    cx.arc(20, 20, 70, 0, Math.PI / 2)
                    cx.stroke()
                    cx.fillRect(0, 80, 20, 20)
                    break;
                case 'middleToBottom':
                    cx.beginPath()
                    cx.arc(20, 100, 70, 0, Math.PI / 2)
                    cx.stroke()
                    cx.fillRect(0, 160, 20, 20)
                    break
                default:
                    break
            }
        }
        function arcRight(cx, type) {
            switch (type) {
                case 'topToMiddle':
                    cx.fillRect(0, 0, 20, 20)
                    cx.beginPath()
                    cx.arc(80, 20, 70, Math.PI / 2, Math.PI)
                    cx.stroke()
                    cx.fillRect(80, 80, 20, 20)
                    break;
                case 'middleToTop':
                    cx.beginPath()
                    cx.arc(80, 80, 70, Math.PI, 3 * Math.PI / 2)
                    cx.stroke()
                    cx.fillRect(80, 0, 20, 20)
                    break
                case 'middleToBottom':
                    cx.beginPath()
                    cx.arc(80, 100, 70, Math.PI / 2, Math.PI)
                    cx.stroke()
                    cx.fillRect(80, 160, 20, 20)
                    break
                case 'bottomToMiddle':
                    cx.beginPath()
                    cx.arc(80, 160, 70, Math.PI, 3 * Math.PI / 2)
                    cx.stroke()
                    cx.fillRect(0, 160, 20, 20)
                    break
                default:
                    break
            }
        }
        function circle(cx, type) {
            if (type === 'top') {
                cx.beginPath()
                cx.arc(40, 20, 10, 0, Math.PI * 2)
                cx.stroke()
            }
            else if (type === 'middle') {
                cx.beginPath()
                cx.arc(40, 90, 10, 0, Math.PI * 2)
                cx.stroke()
            }
        }

        const dict = {
            a: cx => {
                topBar(cx)
                upperLine(cx)
            },
            b: cx => {
                upperLine(cx)
                middleBar(cx)
                arcLeft(cx, 'middleToBottom')
            },
            c: cx => {
                topBar(cx)
                upperLine(cx)
                middleBar(cx)
                lowerLine(cx)
            },
            d: cx => {
                upperLine(cx)
                middleBar(cx)
                bottomBar(cx)
            },
            e: cx => {
                topBar(cx)
            },
            f: cx => {
                topBar(cx)
                middleBar(cx)
                lowerLine(cx)
                bottomBar(cx)
            },
            g: cx => {
                upperLine(cx)
                lowerLine(cx)
                bottomBar(cx)
            },
            h: cx => {
                cx.fillStyle = 'white'
                bottomBar(cx)
                cx.fillStyle = 'black'
                topBar(cx)
                middleBar(cx)
                arcLeft(cx, 'middleToBottom')
            },
            i: cx => {
                topBar(cx)
                middleBar(cx)
            },
            j: cx => {
                topBar(cx)
                upperLine(cx)
                arcRight(cx, 'middleToBottom')
            },
            k: cx => {
                upperLine(cx)
                middleBar(cx)
                lowerLine(cx)
            },
            l: cx => {
                topBar(cx)
                upperLine(cx)
                middleBar(cx)
                bottomBar(cx)
            },
            m: cx => {
                upperLine(cx)
                lowerLine(cx)
            },
            n: cx => {
                upperLine(cx)
                middleBar(cx)
            },
            o: cx => {
                upperLine(cx)
                arcRight(cx, 'middleToBottom')
            },
            p: cx => {
                topBar(cx)
                upperLine(cx)
                lowerLine(cx)
                bottomBar(cx)
            },
            q: cx => {
                arcRight(cx, 'middleToTop')
                middleBar(cx)
                lowerLine(cx)
            },
            r: cx => {
                topBar(cx)
                upperLine(cx)
                middleBar(cx)
            },
            s: cx => {
                topBar(cx)
                arcLeft(cx, 'topToMiddle')
            },
            t: cx => {
                upperLine(cx)
            },
            u: cx => {
                topBar(cx)
                middleBar(cx)
                lowerLine(cx)
            },
            v: cx => {
                topBar(cx)
                arcLeft(cx, 'topToMiddle')
                lowerLine(cx)
            },
            w: cx => {
                topBar(cx)
                upperLine(cx)
                lowerLine(cx)
            },
            x: cx => {
                arcRight(cx, 'topToMiddle')
                arcRight(cx, 'bottomToMiddle')
            },
            y: cx => {
                upperLine(cx)
                middleBar(cx)
                arcRight(cx, 'middleToBottom')
            },
            z: cx => {
                topBar(cx)
                middleBar(cx)
                arcRight(cx, 'middleToBottom')
            },
            1: function(cx) { this.e(cx) },
            2: function(cx) { this.i(cx) },
            3: function(cx) { this.s(cx) },
            4: function(cx) { this.t(cx) },
            5: function(cx) { this.n(cx) },
            6: function(cx) { this.d(cx) },
            7: function(cx) { this.h(cx) },
            8: function(cx) { this.m(cx) },
            9: function(cx) { this.a(cx) },
            0: function(cx) { this.o(cx) },
            _: cx => {
                cx.fillStyle = 'white'
                bottomBar(cx)
                cx.fillStyle = 'black'
                cx.fillRect(20, 160, 60, 20)
            },
            '#': cx => {
                circle(cx, 'top')
            },
            '-': cx => {
                circle(cx, 'middle')
            },
            '\'': cx => {
                cx.fillRect(20, 0, 20, 40)
            }
            
        }
        
        const letterResolver = key => {
            
            let image = document.createElement('canvas')
            if (key.match(/^[\w\d]$/)
                || letterGroups.extraCharacters.includes(key)
            ) {
                image.width = 100
                image.height = 200
                let context = image.getContext('2d')
                context.lineWidth = 20
                dict[key](context)
                
                historyHandler(key)
            } else {
                metaKeyHandler(key)
                image = null
            }
            return image
        }

        let line = 1
        let lineEnds = {}

        const specificLength = 40


        const metaKeyHandler = key => {
            switch (key) {
                case '!': console.log(x, y); break
                case '@': console.log(line, lineEnds); break
                case '$': console.log(history); break
                case '\\': x += scale * 20; break
                case ' ': x += scale * 100; break
                case 'enter': 
                    lineEnds[line] = x
                    line++
                    x = 0
                    y = scale * (line - 1) * 240
                    break
                case 'backspace':
                    if (prev(0) === 'enter') {
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
                default: break
            }
            if (['\\', ' ', 'enter'].includes(key)) { historyHandler(key) }
        }
        
        
        const drawer = (image, key) => {
            let beforeSpace = 0
            let afterSpace = 0

// A, E, I, N, R, S, T
            if (letterGroups.short.includes(key)
                &&
                letterGroups.upperMiddleSpace.includes(prev(1))
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
                    beforeSpace += specificLength   // AE, CE, EE, FE, HE, JE, LE, PE,
                }                                   // QE, RE, SE, UE, VE, WE, ZE
                else if (letterGroups.upperSpace.includes(prev(1))) {
                    beforeSpace += -specificLength  // BE, DE, GE, KE,
                }                                   // NE, OE, XE, YE
                else if (letterGroups.spacers.includes(prev(1))) {
                    beforeSpace += -0               // ME, TE    ***************
                }
            }
            
// H
            // dreadful & dreary
            if (key === 'h'
                &&
                letterGroups.hLigatures.includes(prev(1))
            ) {
                beforeSpace += (
                    prev(1) === 't'
                        ? -60   // TH
                    : prev(1) === 's'
                        ? -100  // SH
                        : prev(1) === 'z'
                        ? -30   // ZH
                        : -60   // CH, GH, KH, PH, WH
                )
            }
            if (prev(1) === 'h') {
                if (letterGroups.hbConnectors.includes(key)) {
                    beforeSpace += (
                        letterGroups.hLigatures.includes(prev(2))
                    )
                        ? 20        // CHA, GHA, KHA, PHA, SHA, etc.
                        : -20       // HA, HJ, HN, HO, HR, HT, HY
                }
                else {
                    beforeSpace += 20
                }
            }

// I
            if (key === 'i') {
                if (letterGroups.spacers.includes(prev(1))
                ) {
                    beforeSpace += -20                  // MI, TI  
                }
                else if (!letterGroups.iSpacers.includes(prev(1))) {
                    beforeSpace += specificLength       // All Excluding EI, GI, MI, OI, TO
                }
            }   
                
// M, T
            if (letterGroups.spacers.includes(prev(1))) {
                beforeSpace += -specificLength
            }

// S
            if (key === 's') {
                if (letterGroups.middleConnectors.includes(prev(1))) {       
                    beforeSpace += (
                        prev(1) === 'h'
                        ? letterGroups.hLigatures.includes(prev(2)) 
                            ? 0                 // CHS, GHS, KHS, etc.
                            : 20                // HS
                        : specificLength        // BS, CS, DS, FS, IS, KS, LS
                    )                           // NS, QS, RS, US, XS, YS, ZS
                }   
                else if (letterGroups.spacers.includes(prev(1))) {
                    beforeSpace += 0            // MS, TS 
                    
                }                   
            }

// T
            if (key === 't') {
                if (prev(1) === 'h'
                    && (prev(2) === 'c' || prev(2) === 'g')
                ) {
                    beforeSpace += -specificLength  // CHT, GHT
                }
            }

// '            
            if (key === '\'') {
                if (letterGroups.upperSpace.includes(prev(1))
                    || letterGroups.upperMiddleSpace.includes(prev(1))
                ) {
                    beforeSpace += -specificLength *2
                }
            }
            if (prev(1) === '\'') {
                beforeSpace += -specificLength
            }







            if (feelinFiddly) {
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






            beforeSpace += feelinFiddly ? -20 : 0
            x = Math.max(0, x + scale * beforeSpace)
            cx.drawImage(image, x, y, scale * 100, scale * 200)
            x += scale * afterSpace
            x += scale * 100
        }

        window.addEventListener('keydown', e => {
            const key = e.key.toLowerCase()

            // console.log(key)

            let image = letterResolver(key)
            if (image) {
                drawer(image, key)
                currentLetter = image
            }
        })
    } else {
        alert('Something is wrong with HTML5 Canvas.')
    }
}
window.onload = main