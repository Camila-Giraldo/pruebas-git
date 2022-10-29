export default class Toast {
    devMode = true
    /*
        Esta clase no requiere elementos previamente creados en *.html
        Simplemente use:
            Toast.info({ 
                message: 'bla bla bla...', 
                mode: 'success' // ['warning'|'danger'|'info']
            })
    */

    /**
     * Determina el estilo de los avisos con base en el argumento recibido.
     * @param {string} mode Puede ser: success, warning, danger o info.
     * @returns Un objeto con la configuración de los avisos según su tipo.
     */
    static #init(mode) {
        // elimine el siguiente comentario para que la clase no funcione correctamente:
        // class="bg-blue-500 bg-green-500 bg-yellow-400 bg-red-500"

        if (mode === 'success') {
            return {
                title: 'Acción exitosa',
                colour: 'green-500',
                icon: `
                    <svg class="w-6 h-6 text-white animate-bounce fill-current" 
                         viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337
                         29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667
                         20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337
                         20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667
                         13.3333L16.6667 28.3333Z"/>
                    </svg>`
            }
        } else if (mode === 'warning') {
            return {
                title: '¡Cuidado!',
                colour: 'yellow-400',
                icon: `
                    <svg class="w-6 h-6 text-white animate-bounce fill-current" 
                         viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337
                         29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667
                         20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667
                         28.3333H18.3334V25H21.6667V28.3333ZM21.6667
                         21.6666H18.3334V11.6666H21.6667V21.6666Z"/>
                    </svg>`
            }
        } else if (mode === 'danger') {
            return {
                title: 'Lo siento...',
                colour: 'red-500',
                icon: `
                <svg class="w-6 h-6 text-white animate-bounce fill-current" 
                     viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2
                     10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667
                     10.8 29.2 3.33331 20 3.33331ZM21.6667
                     28.3333H18.3334V25H21.6667V28.3333ZM21.6667
                     21.6666H18.3334V11.6666H21.6667V21.6666Z"/>
                </svg>`
            }
        } else {
            return {
                title: 'Aviso',
                colour: 'blue-500',
                icon: `
                    <svg class="w-6 h-6 text-white animate-bounce fill-current" 
                         viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667
                         20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333
                         36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20
                         3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667
                         6.66667V17.1H27.25L19.1334 33.3333Z"/>
                    </svg>`
            }
        }
    }

    /**
     * Estándar para la presentaciones de errores, advertencias o información general
     * @param {String} message El mensaje que se debe mostrar
     * @param {String} mode Indica el tipo de toast a mostrar: 'success', 'warning',
                       'danger' o 'info'
     * @param {string} error Preferiblemente aquellos mensajes reportados por el
                             entorno de ejecución
     */
    static info({ message = '', mode = 'info', error = '', sleep = 3000 } = {}) {

        // https://dmitripavlutin.com/javascript-object-destructuring/ 
        const { title, colour, icon } = this.#init(mode.toLowerCase())

        const id = `toast-${Math.floor(Math.random() *
            99999999999999).toString().padStart(14, "0")}`

        document.querySelector('body').insertAdjacentHTML('afterbegin', `
            <div id="${id}" class="overflow-hidden absolute top-2 right-2 mx-auto 
                                   w-full max-w-sm bg-white rounded-lg dark:bg-gray-800">
                <div class="flex shadow-inner bg-${colour} bg-opacity-20">
                    <div class="flex items-center justify-center w-12 bg-${colour}
                                transition-all duration-1000 ease-in-out">
                        ${icon}
                    </div>
                    
                    <div class="px-4 py-2 -mx-3">
                        <div class="mx-3">
                            <span class="font-semibold text-${colour}
                                         dark:text-${colour}">${title}</span>
                            <p class="text-sm text-gray-600 dark:text-gray-200"> 
                               ${message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>`
        )

        // si no se muestra el toast, quite el comentario de la siguiente instrucción:
        // document.querySelector(`#${id}`).style.zIndex = "10000" // o 15000 si es preciso

        setTimeout(() => document.querySelector(`#${id}`).remove(), sleep)

        if (error) {
            if (error && this.devMode != false) {
                console.error('Houston, tenemos un problema:', error)
            }
        }
    }

}


