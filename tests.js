
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

