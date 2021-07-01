/*
    ##      ## ####       ## #### ######## 
    ##  ##  ##  ##        ##  ##     ##    
    ##  ##  ##  ##        ##  ##     ##    
    ##  ##  ##  ##        ##  ##     ##    
    ##  ##  ##  ##  ##    ##  ##     ##    
    ##  ##  ##  ##  ##    ##  ##     ##    
     ###  ###  ####  ######  ####    ##    

    - change drawing from rects to all paths
    - ...backspace
*/



// BUTTONS
const buttons = document.getElementById('buttons')
for (let i = 0; i < 12; i++) {
    buttons.appendChild(document.createElement('button'))
}


// CANVAS UTILITY
const canvas = document.getElementById('canvas')
const cx = canvas.getContext('2d')
cx.canvas.width = 800
cx.canvas.height = 800
const scaleFactor = 0.4
const scale = xy => {
    return xy * scaleFactor
}


// // RECTS
const rects = () => {
    cx.fillStyle = 'orange'
    cx.fillRect(0, 0, 200, 200)
    cx.fillRect(200, 200, 200, 200)
    cx.fillRect(400, 400, 200, 200)
    cx.fillRect(600, 600, 200, 200)
    cx.fillStyle = 'lime'
    cx.fillRect(scale(0), scale(0), scale(200), scale(200))
    cx.fillRect(scale(200), scale(200), scale(200), scale(200))
    cx.fillRect(scale(400), scale(400), scale(200), scale(200))
    cx.fillRect(scale(600), scale(600), scale(200), scale(200))
    cx.fillStyle = 'black'
}


// TYPEWRITER
class Typewriter {
    constructor(cx) {
        this.cx = cx
    }
    x = 0
    y = 0
    currentKey = ''
    history = []
    metaKeys = ['Shift', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape']
    

    //   ######  ######## ########  ##           
    //  ##    ##    ##    ##     ## ##           
    //  ##          ##    ##     ## ##           
    //  ##          ##    ########  ##           
    //  ##          ##    ##   ##   ##           
    //  ##    ##    ##    ##    ##  ##       ### 
    //   ######     ##    ##     ## ######## ###     

    control = e => {
        switch(e.type) {
            case 'keydown':
                // console.time('time')
                if (!this.metaKeys.includes(e.key)) {
                    if (dictionary[e.key] || [' ', 'Enter', '`', 'Backspace'].includes(e.key)) {
                        this.currentKey = e.key
                    } else if (dictionary[e.key.toLowerCase()]) {
                        this.currentKey = e.key.toLowerCase()
                    } else {
                        break
                    }
                    let element = this.switchboard(this.currentKey)
                    if (!element?.tagName) {
                        if (element.className !== 'backspace') {
                            this.history.push({name: element.className, x: element.x, width: element.width, y: element.y})
                        }
                    } else {
                        this.history.push([e.key, this.currentKey, element.x, element.y, element.width])
                    }
                }
                break
            case 'keyup':
                // console.timeEnd('time')
                break
            default:
                break
        }
    }


    //   ######  ##      ## ########  ######  ##     ##     
    //  ##    ## ##  ##  ##    ##    ##    ## ##     ##     
    //  ##       ##  ##  ##    ##    ##       ##     ##     
    //   ######  ##  ##  ##    ##    ##       #########     
    //        ## ##  ##  ##    ##    ##       ##     ##     
    //  ##    ## ##  ##  ##    ##    ##    ## ##     ## ### 
    //   ######   ###  ###     ##     ######  ##     ## ### 
 
    switchboard = key => {
        // punctuation, will catch '_' before \w
        if (key.match(/[!"#$%&'()*+,-./:;<=>?@[\\\]^_{|}~]/)) {
            console.log(key)
        }
        // alphabet
        else if (key.match(/^[A-Za-z]$/)) {
            return this.carriage(this.printer(key))
        }
        // numbers
        else if (key.match(/^\d$/)) {
            return this.carriage(this.printer(key))
        }
        else if (key.match(/[' ']/)) {
            return this.carriage('space')
        }
        // other spacing key
        else if (key.match(/[`]/)) {
            return this.carriage(key)
        }
        else if (key.match(/Enter/)) {
            return this.carriage('enter')
        }
        else if (key.match(/Backspace/)) {
            return this.carriage('backspace')
        }
    }


    //   ######  ########   ######   ########     
    //  ##    ## ##     ## ##    ##  ##           
    //  ##       ##     ## ##        ##           
    //  ##       ########  ##   #### ######       
    //  ##       ##   ##   ##    ##  ##           
    //  ##    ## ##    ##  ##    ##  ##       ### 
    //   ######  ##     ##  ######   ######## ### 
    
    carriage = element => {
        const prev = (x = 1) => this.history[this.history.length - x]
        if (element?.tagName === 'CANVAS') {
            // console.log(this.currentKey, element.className, element)

            function oldSpacingFunctions() {
            // if (prev()?.['isB']|| prev()?.['isH']) {
            //     if (this.currentKey?.['hTouch']) {
            //         console.log('htouch')
            //         this.x -= 20
            //         if (prev()?.['isH'] &&prev(2)?.['hLigature']) {
            //             if ((prev(2)?.['isC'] || prev(2)?.['isG']) && this.currentKey?.['isT']) {
            //                 console.log('cht ght')
            //                 this.x += 0
            //             }
            //             else {
            //                 console.log('cha gha')
            //                 this.x += 50
            //             }
            //         }
            //     }
            //     else if (!this.currentKey?.['isE'] && !this.currentKey?.['capitalE']) {
            //         console.log('no htouch')
            //         this.x += 30
            //     }
            // }
            // // b d k n x y <> e
            // if (this.currentKey?.['superShort']) {
            //     console.log('supershort')
            //     if (prev()?.['roomy'] || prev()?.['spacious']) {
            //         this.x -= 60
            //     }
            //     else if (prev()?.['eEnd'] || prev()?.['twoEnd'] && !prev()?.['isI']) {
            //         this.x += 30
            //     }
            // }
            // // g o <> a i n r s t
            // else if (this.currentKey?.['short']) {
            //     if (prev()?.['spacious']) {
            //         if (this.currentKey?.['isT']) {
            //             this.x -= 30
            //         }
            //         else {
            //             this.x -= 60
            //         }
            //     }
            // }
            // // E I
            // if (this.currentKey?.['capitalE'] || this.currentKey?.['capitalI']) {
            //     if (this.currentKey?.['capitalE']) {
            //         if (prev()?.['roomy'] || prev()?.['spacious']) {
            //             this.x += 20
            //         }
            //         else if (prev()?.['eEnd'] || prev()?.['twoEnd']) {
            //             this.x += 10
            //         }
            //         else if (prev()?.['spacer']) {
            //             this.x += 0
            //         }
            //         else {
            //             this.x += 30
            //         }
            //     }
            // }
            // // c f i l q r u z <> is
            // if (this.currentKey?.['twoBar']) {
            //     if (prev()?.['twoEnd'] || prev()?.['threeEnd']) {
            //         this.x += 30
            //     }
            // }
            // // c g k p s t w z <> h
            // if (this.currentKey?.['isH']) {
            //     if (prev()?.['hLigature']) {
            //         this.x -= 60                    // ch kh th wh end here
            //         if (prev()?.['twoBar']) {
            //             this.x -= 60                // sh
            //         }
            //         else if (prev()?.['isZ']) {
            //             cx.clearRect(scale(this.x + 40), scale(this.y), scale(60), scale(240))
            //             this.x += 40
            //         }
            //         else if (prev()?.['isP'] || prev()?.['isG']) {
            //             cx.clearRect(scale(this.x), scale(this.y), scale(60), scale(240))
            //         }
            //     }
            // }
            }

            const space = (lookup, letter) => {
                if (lookup()?.[0]) {
                    let match = `${lookup()[0]}${letter}`
                    let match3 = (lookup(2)?.[0]) ? `${lookup(2)[0]}${lookup()[0]}${letter}` : null
                    // console.log(match, match3)
                    if (['ae', 'aE', 'ai', 'aI', 'as'].includes(match)) {
                        this.x += 40
                    } else if (['a-'].includes(match)) {
                        this.x += -40
                    }
                    if (['ba', 'bd', 'bj', 'bn', 'bo', 'br', 'bt', 'by'].includes(match)) {
                        this.x += -20
                    } else if (['be'].includes(match)) {
                        this.x += -60
                    } else if (['bE'].includes(match)) {
                        this.x += -40
                    } else if (['bi', 'bI', 'bs'].includes(match)) {
                        this.x += 40
                    }
                    if (['ce', 'cE', 'ci', 'cI', 'cs'].includes(match)) {
                        this.x += 40
                    } else if (['ch'].includes(match)) {
                        this.x += -60
                    } else if (['cha', 'chd', 'chj', 'chn', 'cho', 'chr', 'chy'].includes(match3)) {
                        this.x += 60
                    } else if (['chz'].includes(match3)) {
                        this.x += 40
                    }
                    if (['de'].includes(match)) {
                        this.x += -60
                    } else if (['dE'].includes(match)) {
                        this.x += -40
                    } else if (['di', 'dI', 'ds'].includes(match)) {
                        this.x += 40
                    }
                    if (['ee', 'eE', 'eI'].includes(match)) {
                        this.x += 40
                    } else if (['Ea', 'Eb', 'Ec', 'Ed', 'Ee', 'EE', 'Ef', 'Eg', 'Eh', 'Ei', 'EI', 'Ej', 'Ek', 'El', 'Em', 'En', 'Eo', 'Ep', 'Eq', 'Er', 'Es', 'Et', 'Eu', 'Ev', 'Ew', 'Ex', 'Ey', 'Ez'].includes(match)) {
                        this.x += -40
                    } else if (['e-'].includes(match)) {
                        this.x += -40
                    }
                    if (['fe', 'fE', 'fi', 'fI', 'fs'].includes(match)) {
                        this.x += 40
                    }
                    if (['ga', 'ge', 'gi', 'gn', 'gr', 'gs'].includes(match)) {
                        this.x += -60
                    } else if (['gE', 'gI', 'gt'].includes(match)) {
                        this.x += -40
                    } else if (['g-'].includes(match)) {
                        this.x += -40
                    } else if (['gh'].includes(match)) {
                        this.x += -60
                    } else if (['gha', 'ghd', 'ghj', 'ghn', 'gho', 'ghr', 'ghy'].includes(match3)) {
                        this.x += 60
                    } else if (['ghz'].includes(match3)) {
                        this.x += 40
                    } else if (['gtb', 'gtc', 'gtd', 'gtf', 'gtg', 'gtk', 'gtl', 'gtm', 'gtp', 'gtq', 'gtu', 'gtv', 'gtw', 'gtx'].includes(match3)) {
                        this.x += 20
                    }
                    if (['hb', 'hc', 'he', 'hf', 'hg', 'hi', 'hk', 'hl', 'hp', 'hs', 'hu', 'hv', 'hw', 'hx'].includes(match)) {
                        this.x += 40
                    } else if (['ha', 'hd', 'hj', 'hn', 'ho', 'hr', 'ht', 'hy'].includes(match)) {
                        this.x += -20
                    } else if (['hE', 'hI'].includes(match)) {
                        this.x += 40
                    }
                    if (['iE', 'ii', 'iI', 'is'].includes(match)) {
                        this.x += 40
                    } else if (['Ia', 'Ib', 'Ic', 'Id', 'Ie', 'IE', 'If', 'Ig', 'Ih', 'Ii', 'II', 'Ij', 'Ik', 'Il', 'Im', 'In', 'Io', 'Ip', 'Iq', 'Ir', 'Is', 'It', 'Iu', 'Iv', 'Iw', 'Ix', 'Iy', 'Iz'].includes(match)) {
                        this.x += -40
                    }
                    if (['je', 'jE', 'ji', 'jI', 'js'].includes(match)) {
                        this.x += 40
                    } else if (['j-'].includes(match)) {
                        this.x += -40
                    }
                    if (['ke'].includes(match)) {
                        this.x += -60
                    } else if (['kE'].includes(match)) {
                        this.x += -40
                    } else if (['ki', 'kI', 'ks'].includes(match)) {
                        this.x += 40
                    } else if (['kh'].includes(match)) {
                        this.x += -60
                    } else if (['kha', 'khd', 'khj', 'khn', 'kho', 'khr', 'kht', 'khy'].includes(match3)) {
                        this.x += 60
                    } else if (['khz'].includes(match3)) {
                        this.x += 40
                    }
                    if (['le', 'lE', 'li', 'lI', 'ls'].includes(match)) {
                        this.x += 40
                    }
                    if (['me', 'mE', 'mi', 'mI'].includes(match)) {
                        this.x += -60
                    } else if (['mc', 'mg', 'mk', 'mm', 'mp', 'mw'].includes(match)) {
                        this.x += -50
                    } else if (['ma', 'mb', 'md', 'mf', 'mh', 'mj', 'ml', 'mn', 'mo', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mx', 'my', 'mz'].includes(match)) {
                        this.x += -60
                    } else if (['m-'].includes(match)) {
                        this.x += -40
                    }
                    if (['ne'].includes(match)) {
                        this.x += -60
                    } else if (['nE'].includes(match)) {
                        this.x += -40
                    } else if (['ni', 'nI', 'ns'].includes(match)) {
                        this.x += 40
                    }
                    if (['oa', 'oe', 'oi', 'on', 'or', 'os'].includes(match)) {
                        this.x += -60
                    } else if (['oE', 'oI', 'ot'].includes(match)) {
                        this.x += -40
                    } else if (['o-'].includes(match)) {
                        this.x += -40
                    } else if (['otb', 'otc', 'otd', 'otf', 'otg', 'otk', 'otl', 'otm', 'otp', 'otq', 'otu', 'otv', 'otw', 'otx'].includes(match3)) {
                        this.x += 20
                    }
                    if (['pe', 'pE', 'pi', 'pI', 'ps'].includes(match)) {
                        this.x += 40
                    } else if (['ph'].includes(match)) {
                        this.x += -60
                    } else if (['p-'].includes(match)) {
                        this.x += -40
                    } else if (['pha', 'phd', 'phj', 'phn', 'pho', 'phr', 'pht','phy'].includes(match3)) {
                        this.x += 60
                    } else if (['phz'].includes(match3)) {
                        this.x += 40
                    }
                    if (['qe', 'qE', 'qi', 'qI', 'qs'].includes(match)) {
                        this.x += 40
                    }
                    if (['re', 'rE', 'ri', 'rI', 'rs'].includes(match)) {
                        this.x += 40
                    }
                    if (['se', 'sE', 'si', 'sI'].includes(match)) {
                        this.x += 40
                    } else if (['sh'].includes(match)) {
                        this.x += -120
                    } else if (['sha', 'shd', 'shj', 'shn', 'sho', 'shr', 'sht', 'shy'].includes(match3)) {
                        this.x += 60
                    } else if (['shz'].includes(match3)) {
                        this.x += 40
                    }
                    if (['te', 'tE', 'ti', 'tI'].includes(match)) {
                        this.x += -60
                    } else if (['tc', 'tg', 'tk', 'tm', 'tp', 'tw'].includes(match)) {
                        this.x += -50
                    } else if (['ta', 'tb', 'td', 'tf', 'tj', 'tl', 'tn', 'to', 'tq', 'tr', 'ts', 'tt', 'tu', 'tv', 'tx', 'ty', 'tz'].includes(match)) {
                        this.x += -60
                    } else if (['th'].includes(match)) {
                        this.x += -120
                    } else if (['t-'].includes(match)) {
                        this.x += -40
                    } else if (['tha', 'thd', 'thj', 'thn', 'tho', 'thr', 'tht', 'tht', 'thy'].includes(match3)) {
                        this.x += 60
                    } else if (['thz'].includes(match3)) {
                        this.x += 40
                    }
                    if (['ue', 'uE', 'ui', 'uI', 'us'].includes(match)) {
                        this.x += 40
                    }
                    if (['ve', 'vE', 'vi', 'vI'].includes(match)) {
                        this.x += 40
                    }
                    if (['we', 'wE', 'wi', 'wI', 'ws'].includes(match)) {
                        this.x += 40
                    } else if (['wh'].includes(match)) {
                        this.x += -60
                    } else if (['w-'].includes(match)) {
                        this.x += -40
                    } else if (['wha', 'whd', 'whj', 'whn', 'who', 'whr', 'wht','why'].includes(match3)) {
                        this.x += 60
                    } else if (['whz'].includes(match3)) {
                        this.x += 40
                    }
                    if (['xe'].includes(match)) {
                        this.x += -60
                    } else if (['xE'].includes(match)) {
                        this.x += -40
                    } else if (['xi', 'xI', 'xs'].includes(match)) {
                        this.x += 40
                    }
                    if (['ye'].includes(match)) {
                        this.x += -60
                    } else if (['yE'].includes(match)) {
                        this.x += -40
                    } else if (['yi', 'yI', 'ys'].includes(match)) {
                        this.x += 40
                    }
                    if (['ze', 'zE', 'zi', 'zI', 'zs'].includes(match)) {
                        this.x += 40
                    } else if (['zE'].includes(match)) {
                        this.x += -40
                    } else if (['zh'].includes(match)) {
                        this.x += -50
                    } else if (['zI'].includes(match)) {
                        this.x += 0
                    }
                }
            }
            space(prev, element.className)
            if (this.x >= (800 - 60)/scaleFactor) {
                this.x = 0
                this.y += 300
                this.history.push({
                    name: "Enter",
                    x: this.x,
                    y: this.y,
                    width: 0,
                })
            }

            element.x = this.x
            cx.drawImage(element, scale(this.x), scale(this.y), scale(120), scale(240))
            this.x += 120
            

            // m t <> all
            // if (this.currentKey?.['spacer']) {
            //     this.x += 60
            //     if (this.currentKey?.['isT'] && prev()?.['spacious']) {
            //         this.x += 20
            //     }
            //     else if (this.currentKey?.['capitalE'] || this.currentKey?.['capitalI']) {
            //         this.x += 10
            //     }
            // } 
            // else {
            //     this.x += 120
            // }

        } else {
            let newElement = {
                className: element,
                x: this.x,
                y: this.y,
                width: 0,
            }
            if (element === 'enter') {
                this.x = 0
                this.y += 300
            } else if (element === 'space') {
                this.x += 120
                newElement.width = 120
            } else if (element === '`') {
                this.x += 40
                newElement.width = 40
            } else if (element === 'backspace') {
                let last = this.history.pop()
                if (last.name === 'enter') {
                    console.log(prev())
                    this.x = prev()[2] + prev()[4]
                    this.y -= 300
                }
                // console.log(last)
                this.x = last[2]
                this.y = last[3]
                // console.log(scale(this.x), scale(this.y), scale(last[4]), scale(240))
                console.log(last)
                cx.clearRect(scale(this.x), scale(this.y), scale(last[4]), scale(240))
                cx.fillStyle = '#6e95e655'
                cx.fillRect(scale(this.x), scale(this.y), scale(last[4]), scale(240))
                cx.fillStyle = 'black'
            }
            return newElement
        } 
        return element
    }


    //  ########  ########  #### ##    ## ######## ######## ########  
    //  ##     ## ##     ##  ##  ###   ##    ##    ##       ##     ## 
    //  ##     ## ##     ##  ##  ####  ##    ##    ##       ##     ## 
    //  ########  ########   ##  ## ## ##    ##    ######   ########  
    //  ##        ##   ##    ##  ##  ####    ##    ##       ##   ##   
    //  ##        ##    ##   ##  ##   ###    ##    ##       ##    ##  
    //  ##        ##     ## #### ##    ##    ##    ######## ##     ## 

    printer = key => {
        const draw = step => {
            let position = step.pos
            let shape = step.shape
            let direction = step.dir
            let [x, y] = [0, 0]
            let width, height = [20, 20]
            let [angle1, angle2] = [0, Math.PI / 2]
             
            const makeArc = (angle1, angle2) => {
                lcx.beginPath()
                lcx.arc(x, y + 20, 100, angle1, angle2)
                lcx.stroke()
                lcx.closePath()
                if (direction === 'left') {
                    lcx.fillRect(100, y, 20, 20)
                    lcx.fillRect(0, y + 110, 10, 20)
                } else if (direction === 'right') {
                    lcx.fillRect(0, y, 20, 20)
                    lcx.fillRect(x, y + 110, 10, 20)
                } else if (direction === 'upRight') {
                    lcx.fillRect(0, y + 20, 20, 20)
                    lcx.fillRect(x, y - 90, 10, 20)
                }
            }
            const makeRect = () => {
                lcx.fillRect(x, y, width, height)
            }
            const makeCircle = () => {
                lcx.beginPath()
                lcx.arc(x, y, 10, 0, Math.PI * 2)
                lcx.stroke()
                lcx.closePath()
            }

            if (position === 'top') {
                y = 0
            } 
            else if (position === 'middle') {
                y = 110
            } 
            else if (position === 'bottom') {
                y = 220
            } 
            else { y = position }

            if (shape === 'arc') {
                if (direction === 'left') {
                    x = 10;
                    [angle1, angle2] = [0, Math.PI / 2]
                    makeArc(angle1, angle2)
                } 
                else if (direction === 'right') {
                    x = 110;
                    [angle1, angle2] = [Math.PI / 2, Math.PI]
                    makeArc(angle1, angle2)
                } 
                else if (direction === 'upRight') {
                    x = 110;
                    y += 90;
                    [angle1, angle2] = [Math.PI, 3 * Math.PI / 2]
                    makeArc(angle1, angle2)
                }
            } 
            else if (shape === 'bar') {
                width = 120
                height = 20
                makeRect()
            } 
            else if (shape === 'line') {
                width = 20
                height = 130
                makeRect()
            } 
            else if (shape === 'circle') {
                x += 20
                y += position === 'top' ? 20 : 0
                makeCircle()
            }
            else if (shape === 'mark') {
                console.log('number')
                // lcx.fillStyle = '#800'
                // lcx.fillRect(x, y, 20, 20)
                // lcx.fillStyle = 'black'
            }
        // don't need anymore?
            // else if (shape === 'thinLine') {
            //     width = 10
            //     height = 130
            //     makeRect()
            // }
        }
        let letterCanvas = document.createElement('canvas')
        letterCanvas.className = key
        letterCanvas.width = dictionary[this.currentKey]?.['spacer']
            ? 60
            : 120
        letterCanvas.height = 240
        letterCanvas.x = this.x
        letterCanvas.y = this.y
        let lcx = letterCanvas.getContext('2d')
        lcx.lineWidth = 20

        // letter background
        if (this.currentKey?.['number']) {
            lcx.fillStyle = '#e6956e55'
        }
        else {
            lcx.fillStyle = '#6e95e655'
        }
        lcx.fillRect(0, 0, 120, 240)
        lcx.fillStyle = 'black'

        if (dictionary[key]?.['steps']) {
            for (const step of dictionary[key]['steps']) {
                draw(step)
            }
        }
        return letterCanvas
    }
}
const typewriter = new Typewriter(cx)


//  ########  ####  ######  ######## 
//  ##     ##  ##  ##    ##    ##    
//  ##     ##  ##  ##          ##    
//  ##     ##  ##  ##          ##    
//  ##     ##  ##  ##          ##    
//  ##     ##  ##  ##    ##    ##    ### 
//  ########  ####  ######     ##    ###  

const dictionary = {
    // E I S H V U F Z
    e: {
        steps: [{pos: 'top', shape: 'bar'}],
        tags: ['short', 'superShort', 'eEnd', 'isE'],
        space: 0,
        short: true,
        superShort: true,
        eEnd: true,
        isE: true,
    },
    i: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'middle', shape: 'bar'}],
        tags: ['short', 'twoBar', 'twoEnd', 'isI'],
        space: 0,
        short: true,
        twoBar: true,
        twoEnd: true,
        isI: true,
    },
    s: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'arc', dir: 'left'}],
        tags: ['short', 'twoBar', 'eEnd', 'hLigature'],
        short: true,
        twoBar: true,
        eEnd: true,
        hLigature: true,
    },
    h: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'arc', dir: 'left'}],
        tags: ['isH'],
        isH: true,
    },
    v: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'arc', dir: 'left'},
            {pos: 'middle', shape: 'line'}],
        eEnd: true,
    },
    u: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'line'}],
        twoEnd: true,
    },
    f: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'line'}, {pos: 'bottom', shape: 'bar'}],
        threeEnd: true,
    },
    z: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'arc', dir: 'right'}],
        hLigature: true,
        hTouch: true,
        threeEnd: true,
        isZ: true,
    },
    // A R L C W P J
    a: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}],
        tags: ['short', 'eEnd', 'hTouch'],
        space: 0,
        short: true,
        eEnd: true,
        hTouch: true,
    },
    r: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}, 
            {pos: 'middle', shape: 'bar'}],
        short: true,
        twoEnd: true,
        hTouch: true,
    },
    l: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}, 
            {pos: 'middle', shape: 'bar'}, {pos: 'bottom', shape: 'bar'}],
        threeEnd: true,
        hTouch: true,
    },
    c: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}, 
            {pos: 'middle', shape: 'bar'}, {pos: 'middle', shape: 'line'}],
        hLigature: true,
        twoEnd: true,
        isC: true,
    },
    w: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}, 
            {pos: 'middle', shape: 'line'}],
        hLigature: true,
        eEnd: true,
    },
    p: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}, 
            {pos: 'middle', shape: 'line'}, {pos: 'bottom', shape: 'bar'}],
        hLigature: true,
        eEnd: true,
        isP: true,
    },
    j: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}, 
            {pos: 'middle', shape: 'arc', dir: 'right'}],
        eEnd: true,
        hTouch: true,
    },
    // T N D B X K Y
    t: {
        steps: [{pos: 'top', shape: 'line'}],
        tags: ['short', 'spacer', 'isT', 'hLigature', 'hTouch'],
        space: 30,
        short: true,
        spacer: true,
        isT: true,
        hLigature: true,
        hTouch: true,
    },
    n: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'}],
        tags: ['short', 'roomy', 'hTouch'],
        space: 0,
        short: true,
        roomy: true,
        hTouch: true,
    },
    d: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'},
            {pos: 'bottom', shape: 'bar'}],
        tags: ['roomy', 'hTouch'],
        roomy: true,
        hTouch: true,
    },
    b: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'arc', dir: 'left'}],
        roomy: true,
        isB: true,
    },
    x: {
        steps: [{pos: 'top', shape: 'arc', dir: 'right'}, 
            {pos: 'middle', shape: 'arc', dir: 'upRight'}],
        roomy: true,
    },
    k: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'line'}],
        hLigature: true,
        roomy: true,
    },
    y: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'arc', dir: 'right'}],
        roomy: true,
        hTouch: true,
    },
    // M G Q O
    m: {
        space: 30,
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'line'}],
        tags: ['spacer'],
        spacer: true,
        hTouch: true,
    },
    g: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'line'},
            {pos: 'bottom', shape: 'bar'}],
        hLigature: true,
        spacious: true,
        isG: true,
    },
    q: {
        steps: [{pos: 'top', shape: 'arc', dir: 'upRight'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'line'}],
        twoEnd: true,
    },
    o: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'arc', dir: 'right'}],
        spacious: true,
        hTouch: true,
    },


    E: {
        steps: [{pos: 'top', shape: 'circle'}],
        capitalE: true,
        short: true,
        superShort: true,
        eEnd: true,
        spacer: true,
    },
    I: {
        steps: [{pos: 'top', shape: 'circle'}, {pos: 'middle', shape: 'circle'}],
        capitalI: true,
        short: true,
        twoBar: true,
        twoEnd: true,
        spacer: true,
    },



    // 1 2 3 4 5 6 7 8 9 0
    1: {
        steps: [{pos: 'top', shape: 'bar'}, {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'line'}],
        number: true,
        short: true,
        superShort: true,
        eEnd: true,
        isE: true,
    },
    2: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'middle', shape: 'bar'},
            {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'bar'}],
        number: true,
        short: true,
        twoBar: true,
        twoEnd: true,
        isI: true,
    },
    3: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'arc', dir: 'left'},
            {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'line'}],
        number: true,
        short: true,
        twoBar: true,
        eEnd: true,
    },
    4: {
        steps: [{pos: 'top', shape: 'line'}, {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'bar'}, {pos: 'middle', shape: 'bar'}],
        number: true,
        short: true,
        spacer: true,
        hTouch: true,
    },
    5: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'}, 
            {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'}],
        number: true,
        short: true,
        roomy: true,
        hTouch: true,
    },
    6: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'},
            {pos: 'bottom', shape: 'bar'}, {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}],
        number: true,
        roomy: true,
        hTouch: true,
    },
    7: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'arc', dir: 'left'}, {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'},
            {pos: 'bottom', shape: 'bar'}],
        number: true,
        roomy: true,
        isB: true,
    },
    8: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'line'}, 
            {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'},
            {pos: 'middle', shape: 'bar'}],
        number: true,
        spacer: true,
        hTouch: true,
    },
    9: {
        steps: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'}, 
            {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'bar'},
            {pos: 'middle', shape: 'arc', dir: 'left'}],
        number: true,
        short: true,
        hTouch: true,
    },
    0: {
        steps: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'arc', dir: 'right'}, 
            {shape: 'mark', pos: 'top'}],
        alt: [{pos: 'top', shape: 'line'}, {pos: 'middle', shape: 'line'},
            {pos: 'bottom', shape: 'bar'}],
        alt2: [{pos: 'top', shape: 'bar'}, {pos: 'top', shape: 'line'},
            {pos: 'middle', shape: 'line'}],
        number: true,
        spacious: true,
        hTouch: true,
    },
}


//  #### ##    ## ########  ########     
//   ##  ###   ## ##     ##    ##        
//   ##  ####  ## ##     ##    ##        
//   ##  ## ## ## ########     ##        
//   ##  ##  #### ##           ##        
//   ##  ##   ### ##           ##    ### 
//  #### ##    ## ##           ##    ### 

const text = document.getElementById('text')
let keydown = false
text.addEventListener('keydown', e => {
    if (!keydown) {
        typewriter.control(e)
        if (!e.key === 'Shift') {
            keydown = true
        }
    }
})
text.addEventListener('keyup', e => {
    if (keydown) {
        typewriter.control(e)
        keydown = false
    }
})
canvas.addEventListener('click', () => text.focus())
const title = document.getElementById('title')
title.addEventListener('click', () => {
    console.group('typewriter') 
    console.log('currentkey', typewriter.currentKey)
    console.log('history', typewriter.history)
    console.log('x & y', typewriter.x, typewriter.y)
    console.groupEnd() 
})
const star = document.getElementById('star')
star.addEventListener('click', () => {
    console.clear()
    cx.clearRect(0, 0, 800, 800)

    typewriter.x = 0
    typewriter.y = 0
    typewriter.currentKey = ''
    typewriter.history = []

    text.value = ''
    text.focus()

    title.style.color = '#456'
    setTimeout(() => {
        title.style.color = '#ffd'
    }, 250);
    setTimeout(() => {
        title.style.color = '#def'
    }, 500);
})


// LIVE
text.focus()