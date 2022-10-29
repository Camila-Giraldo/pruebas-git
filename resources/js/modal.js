export default class Modal {

    #clon

    constructor({
        width = 'max-w-3xl',
        title = 'Título...',
        content = 'Contenido...',
        buttons = []
    } = {}) {


        // clonar el nodo del DOM que tiene definido el modal
        const modal = document.querySelector('#modal')
        this.#clon = modal.cloneNode(true)

        // asignarle al nuevo nodo un identificador único y agregarlo al DOM
        const random = Math.floor(Math.random() * 99999999999999).toString().padStart(14, "0")
        this.#clon.id = `${this.#clon.id}-${random}`
        document.querySelector('#utilities').before(this.#clon)

        this.title = title
        this.content = content
        this.width = width

        document.querySelector(`#${this.#clon.id} header #close`).addEventListener(
            'click', () => this.close()
        )


        const footer = document.querySelector(`#${this.#clon.id} footer`)

        if (buttons.length > 0) {
            buttons.forEach(b => this.#createButton(b, footer))
        } else {
            footer.classList.add('hidden');
        }


    }

    /**
     * Establece el título del cuadro de diálogo
     * @param {string} strTitle
     */
    set title(strTitle) {
        document.querySelector(`#${this.#clon.id} #title`).innerHTML = strTitle
        return this
    }

    /**
     * Establece el contenido del cuadro de diálogo
     * @param {string} strContent
     */
    set content(strContent) {
        document.querySelector(`#${this.#clon.id} #content`).innerHTML = strContent
        return this
    }

    /**
     * Establece el ancho máximo que puede llegar a tener el modal
     * @param {string} strWidth
     */
    set width(strWidth) {
        document.querySelector(`#${this.#clon.id} > div`).classList.add(strWidth)
        return this
    }

    /**
     * Adiciona estilos al modal, conservando los existentes
     * @param {string} _styles
     */
    set styles(_styles) {
        _styles = _styles.trim()
        if (_styles.length > 0) {
            _styles.split(' ').forEach(
                w => document.querySelector(`#${this.#clon.id} > div`).classList.add(w)
            )
        }
        return this
    }


    close() {
        this.#clon.classList.add("hidden") // simplemente oculta el modal
        return this
    }

    dispose() {
        this.#clon.remove() // elimina del DOM
        this.#clon = null // elimina la referencia
    }

    #createButton(b, footer) {
        const html = `<button id="${b.id}" class="${b.class}">${b.innerHTML}</button>`
        footer.insertAdjacentHTML('beforeend', html)
        const button = document.querySelector(`#${this.#clon.id} footer #${b.id}`)

        if (typeof b.callBack === 'function') {
            button.addEventListener('click', e => b.callBack(e))
        }
    }

    show() {
        if (this.#clon) {
            this.#clon.classList.remove("hidden")
        } else {
            console.log('No ya una instancia de Modal para ser mostrada');
        }
        return this
    }

}