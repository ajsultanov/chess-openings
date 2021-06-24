console.log("shhhhhess, jay ess")

function main() {
    const canvas = document.querySelector("#canvas")
    if (canvas.getContext) {
        const cx = canvas.getContext('2d')

        cx.fillStyle = 'green';
        cx.fillRect(0, 0, 256, 128);
        
        cx.fillStyle = 'rgb(200, 100, 0, 0.5)';
        cx.fillRect(128, 0, 128, 256);
        
        // cx.strokeRect(32, 32, 32, 32)
        // cx.clearRect(96, 96, 64, 64);
        // cx.fillStyle = 'blue';
        // cx.fillRect(112, 112, 32, 32);

        // cx.beginPath()
        // cx.arc(100, 200, 10, 1, Math.PI + 1)
        // cx.stroke()

        // roundedRect(cx, 20, 20, 200, 200, 10, 20, 60)

        // 'gradient'
        // for (let i = 0; i < 8; i++) {
        //     for (let j = 0; j < 8; j++) {
        //         cx.fillStyle = `rgb(${j * 32 % 256}, ${i * 32 % 256}, ${(j + i) * 32}, 1)`
        //         cx.fillRect(i * 32, j * 32, 32, 32);
        //         cx.fillStyle = `rgb(${i * 32 % 256}, ${j * 32 % 256}, ${(j - i) * 32 % 256}, 1)`;
        //         cx.fillRect(i * 32 + 4, j * 32 + 4, 24, 24);
        //     }
        // }

        // mdn 'gradient' example
        // for (var i = 0; i < 6; i++) {
        //     for (var j = 0; j < 6; j++) {
        //         cx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' + Math.floor(255 - 42.5 * j) + ', 0)';
        //         cx.fillRect(j * 25, i * 25, 25, 25);
        //     }
        // }

        const boardWidth = canvas.width
        const squareWidth = Math.round(boardWidth / 8)
        const offset = Math.round(squareWidth / 2)

        // chessboard
        const orange = {
            dark: '#c78d53',
            light: '#f7cfa4'
        }
        const bw = {
            dark: '#393633',
            light: '#eef1f4'
        }
        let themeColor = orange

        for (let i = 0; i < 8; i++) {
            for (let j = 7; j >= 0; j--) {
                cx.fillStyle = (i + j) % 2 === 1 ? themeColor.dark : themeColor.light;
                cx.fillRect(
                    i * squareWidth, 
                    (boardWidth - squareWidth) - j * squareWidth, 
                    squareWidth, 
                    squareWidth
                )
            }
        }

        // helper functions
        const getRank = number => 8 - Number(number)
        const getFile = letter => {
            return !letter.match(/[a-h]/i) || !letter.length === 1
            ? null
            : {    
                a: 0, b: 1, c: 2, d: 3,
                e: 4, f: 5, g: 6, h: 7
            }[letter.toLowerCase()]
        }
        const convertNotation = square => {
            if (!square.match(/^[a-h][1-8]$/i) || !square.length === 2) return null
            const [rank, file] = [getRank(square[1]), getFile(square[0])]
            return {rank: rank, file: file}
        }
        
        // shading dot
        const square = 'd6'
        const file = convertNotation(square).file
        const rank = convertNotation(square).rank
        
        cx.fillStyle = 'rgba(200, 0, 0, 0.67)'
        cx.beginPath()
        cx.arc(
            file * (offset * 2) + offset, 
            rank * (offset * 2) + offset, 
            squareWidth / 10 * Math.PI, 
            0, 
            Math.PI * 2
        )
        cx.closePath()
        cx.fill()



        let fillStyleEx = false;
        if (fillStyleEx) {
            cx.beginPath()
            cx.moveTo(100, 101)
            cx.lineTo(110, 111)
            cx.lineTo(150,  72)
            cx.lineTo(170,  83)
            cx.lineTo(160,  94)
            cx.lineTo(110,  55)
            cx.lineTo( 90,  65)
            cx.lineTo(160, 114)
            cx.lineTo(190,  73)
            cx.lineTo(140,  42)
            cx.lineTo(100, 101)
            cx.closePath()
            cx.fill('evenodd')
        
            cx.fillStyle = 'green'
            cx.beginPath()
            cx.moveTo(100, 201)
            cx.lineTo(110, 211)
            cx.lineTo(150, 172)
            cx.lineTo(170, 183)
            cx.lineTo(160, 194)
            cx.lineTo(110, 155)
            cx.lineTo( 90, 165)
            cx.lineTo(160, 214)
            cx.lineTo(190, 173)
            cx.lineTo(140, 142)
            cx.lineTo(100, 201)
            cx.closePath()
            cx.fill('nonzero')
        }



        // パック•マン
        let pacman = false;
        if (pacman) {
            // outline
            roundedRect(cx, 12, 12, 150, 150, 15);
            roundedRect(cx, 19, 19, 150, 150, 9);
            // blocks
            roundedRect(cx, 53, 53, 49, 33, 10);
            roundedRect(cx, 53, 119, 49, 16, 6);
            roundedRect(cx, 135, 53, 49, 33, 10);
            roundedRect(cx, 135, 119, 25, 49, 10);
            
            // pacman
            cx.fillStyle = 'yellow';
            cx.beginPath();
            cx.arc(37, 37, 13, Math.PI / 7, -Math.PI / 7, false);
            cx.lineTo(31, 37);
            cx.fill();
            
            // dots
            cx.fillStyle = 'black';
            for (var i = 0; i < 8; i++) {
                cx.fillRect(51 + i * 16, 35, 4, 4);
            }
            for (i = 0; i < 6; i++) {
                cx.fillRect(115, 51 + i * 16, 4, 4);
            }
            for (i = 0; i < 8; i++) {
                cx.fillRect(51 + i * 16, 99, 4, 4);
            }
            
            // ghost
            cx.fillStyle = 'orange'
            cx.beginPath();
            cx.moveTo(83, 116);
            cx.lineTo(83, 102);
            cx.bezierCurveTo(83, 94, 89, 88, 97, 88);
            cx.bezierCurveTo(105, 88, 111, 94, 111, 102);
            cx.lineTo(111, 116);
            cx.lineTo(106.333, 111.333);
            cx.lineTo(101.666, 116);
            cx.lineTo(97, 111.333);
            cx.lineTo(92.333, 116);
            cx.lineTo(87.666, 111.333);
            cx.lineTo(83, 116);
            cx.fill();
            
            // eyes
            cx.fillStyle = 'white';
            cx.beginPath();
            cx.moveTo(91, 96);
            cx.bezierCurveTo(88, 96, 87, 99, 87, 101);
            cx.bezierCurveTo(87, 103, 88, 106, 91, 106);
            cx.bezierCurveTo(94, 106, 95, 103, 95, 101);
            cx.bezierCurveTo(95, 99, 94, 96, 91, 96);
            cx.moveTo(103, 96);
            cx.bezierCurveTo(100, 96, 99, 99, 99, 101);
            cx.bezierCurveTo(99, 103, 100, 106, 103, 106);
            cx.bezierCurveTo(106, 106, 107, 103, 107, 101);
            cx.bezierCurveTo(107, 99, 106, 96, 103, 96);
            cx.fill();
            
            // pupils
            cx.fillStyle = 'black';
            cx.beginPath();
            cx.arc(101, 102, 2, 0, Math.PI * 2, true);
            cx.fill();
            cx.beginPath();
            cx.arc(89, 102, 2, 0, Math.PI * 2, true);
            cx.fill();
        }
            
            

        // cx.fillStyle = 'gray'
        // let d = 'M10 10 h 80 v 80 h -80 Z';
        // let p = new Path2D(d);
        // cx.fill(p)








        function roundedRect(cx, x, y, width, height, radius, ...rest){
            let r1, r2, r3, r4
            if (rest.length === 0) { 
                [r1, r2, r3, r4] = [radius, radius, radius, radius] 
            }
            if (rest.length === 1) {
                r1 = radius, r2 = rest[0], r3 = radius, r4 = rest[0]
            }
            if (rest.length === 2) {
                r1 = radius, r2 = rest[0], r3 = rest[1], r4 = rest[0]
            }
            if (rest.length === 3) {
                r1 = radius, r2 = rest[0], r3 = rest[1], r4 = rest[2]
            }
            cx.beginPath();
            cx.moveTo(x, y + r1);
            cx.lineTo(x, y + height - r4);
            cx.arcTo(x, y + height, x + r4, y + height, r4);
            cx.lineTo(x + width - r3, y + height);
            cx.arcTo(x + width, y + height, x + width, y + height - r3, r3);
            cx.lineTo(x + width, y + r2);
            cx.arcTo(x + width, y, x + width - r2, y, r2);
            cx.lineTo(x + r1, y);
            cx.arcTo(x, y, x, y + r1, r1);
            cx.stroke();
        }
    } else {
        alert('Der\'s ay, uh, issue wit yer canvas der')
    }







    // gradient chessboard using 'evenodd' fill
    const   canvas3 = document.querySelector("#canvas3"),
            cx3 = canvas3.getContext('2d'),
            c3Width = canvas3.width

    const   backGrad = cx3.createLinearGradient(0, 0, 0, c3Width)
        backGrad.addColorStop(0, 'pink')
        backGrad.addColorStop(1, 'goldenrod')
    cx3.fillStyle = backGrad
    cx3.fill(cx3.rect(0, 0, c3Width, c3Width))

    const   linGrad = cx3.createLinearGradient(0, 0, c3Width, c3Width)
        linGrad.addColorStop(0, '#4383')
        linGrad.addColorStop(1, '#4c67')
    cx3.fillStyle = linGrad
    cx3.fillRect(0, 0, c3Width, c3Width)

    const   foreGrad = cx3.createLinearGradient(0, 0, c3Width, 0)
        foreGrad.addColorStop(0, 'forestgreen')
        foreGrad.addColorStop(1, 'royalblue')
    cx3.fillStyle = foreGrad
    const   divisions = 8,
            unit = Math.round(c3Width / divisions),
            [top, right, bottom, left] = [0 - unit, c3Width + unit, c3Width + unit, 0 - unit] 
    cx3.beginPath()
    cx3.moveTo(top, left)
    for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
            cx3.lineTo(i * unit, top)
            cx3.lineTo(i * unit, bottom)
        } else {
            cx3.lineTo(i * unit, bottom)
            cx3.lineTo(i * unit, top)
        }
    }
    for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
            cx3.lineTo(right, i * unit)
            cx3.lineTo(left, i * unit)
        } else {
            cx3.lineTo(left, i * unit)
            cx3.lineTo(right, i * unit)
        }
    }
    cx3.lineTo(right, top)
    cx3.closePath()
    cx3.fill('evenodd')

    const   linGrad2 = cx3.createLinearGradient(0, c3Width, c3Width, 0)
        linGrad2.addColorStop(0, '#f000')
        linGrad2.addColorStop(1, '#f003')
    cx3.fillStyle = linGrad2
    cx3.fillRect(0, 0, c3Width, c3Width)
    




    // bars and buttons
    const   canvas2 = document.querySelector("#canvas2"),
            cx2 = canvas2.getContext('2d')
    cx2.fillStyle = 'white'
    cx2.fillRect(0, 0, 256, 256)
    let bar1 = { id: 1, height: 200 }
    let bar2 = { id: 2, height: 100 }
    function draw(bar) {
        let color, x 
        if (bar.id === 1) {
            color = 'red'
            x = 80
        } else {
            color = 'blue'
            x = 120
        }
        cx2.fillStyle = 'white'
        cx2.fillRect(x, 0, 20, 256)
        cx2.fillStyle = color
        cx2.fillRect(x, 256 - bar.height, 20, bar.height)
    }
    draw(bar1)
    draw(bar2)
    const buttons = document.querySelectorAll('.cx2-button')
    buttons.forEach(b => {
        b.addEventListener('click', function(e) {
            let bar = e.target.id === '1' ? bar1 : bar2
            bar.height = (bar.height + 20) % 256
            draw(bar)
        })
    })



    // images
    const   canvas4 = document.querySelector("#canvas4"),
            cx4 = canvas4.getContext('2d')
    let img = new Image()
    img.addEventListener('load', () => {
    // alternatively img.onload = () => {...}
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                cx4.drawImage(img, 2 + i * 32, 2 + j * 32, 32, 32, i * 32, j * 32, 28, 28)
            }
        }
    }, false)
    img.src = './img/board.png'
    // cx4.drawImage(img, 100, 100, 40, 50)
    // document.body.appendChild(img)












    // palette seer
    // const canvas2 = document.querySelector("#canvas2")
    // const cx2 = canvas2.getContext('2d')
    // const width = canvas2.width
    // const palette = [
    //     '000000',
    //     '525393',
    //     '6caaf7',
    //     'c2dcdc',
    //     'ffffff',
    //     'c65d59',
    //     'f8d68c',
    //     '94d267'
    // ].sort((a, b) => {
    //     return (parseInt(a.slice(0,1), 16) + parseInt(a.slice(2,3), 16) + parseInt(a.slice(5,6), 16))
    //      - (parseInt(b.slice(0,1), 16) + parseInt(b.slice(2,3), 16) + parseInt(b.slice(5,6), 16))
    // })
    // const paletteSize = palette.length
    // const square = Math.round(width / paletteSize)
    // const offset = Math.round(square / 2)

    // cx2.fillStyle = [...palette].every(h => {
    //     return /^[0-9a-f]{6}$/.test(h)
    // }) ? '#0000' : '#f00f'
    // cx2.fillRect(0, 0, width, width)
    // cx2.fillStyle = '#' + palette[paletteSize - 1]
    // cx2.fillRect(square, 0, width - square, offset)
    // cx2.fillStyle = '#' + palette[0]
    // cx2.fillRect(0, width - offset, width - square, offset)

    // for (let i = 0; i < paletteSize; i++) {
    //     for (let j = paletteSize - 1; j >= 0; j--) {
    //         let x = i, y = j
    //         if (i === j) continue
    //         if (i > j) y += 1
    //         cx2.fillStyle = '#' + palette[i]
    //         cx2.fillRect(x * square, y * square - offset, square, square)            
    //         cx2.fillStyle = '#' + palette[j]
    //         // cx2.fillRect(10 + x * 32, y * 32 - 6, 12, 12)
    //         cx2.moveTo(offset + x * square, offset + y * square)
    //         cx2.beginPath()
    //         cx2.arc(
    //             offset + x * square, 
    //             offset + y * square - offset, 
    //             Math.round(offset / 2), 
    //             0, 
    //             Math.PI * 2
    //         )
    //         cx2.closePath()
    //         cx2.fill()
    //     }
    // }
}
window.onload = main;