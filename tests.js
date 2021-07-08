
const   title = document.getElementById('title')
        title.addEventListener('click', () => console.table())
const   text = document.getElementById('text')
        text.addEventListener('keydown', e => {
            console.log(text.value)
        })
        text.focus()
const   star = document.getElementById('star')
        star.addEventListener('click', () => { 
            // debugger 
        })
const   column = document.getElementById('column')
        column.addEventListener('click', () => text.focus())
const   METAKEYS = ['Shift', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape']



let newElement = document.createElementNS('http://www.w3.org/2000/svg','rect');
newElement.setAttribute('fill','orange');
newElement.setAttribute('width','50');
newElement.setAttribute('height','50');
document.getElementById('svg-drawing').appendChild(newElement)

// function appendSVGChild(elementType,target,attributes = {},text = '') {
//     const element = document.createElementNS('http://www.w3.org/2000/svg',elementType);
//     Object.entries(attributes).map(a => element.setAttribute(a[0],a[1]));
//     if (text) {
//       const textNode = document.createTextNode(text);
//       element.appendChild(textNode);
//     }
//     target.appendChild(element);
//     return element;
//   };

  