import Helpers from './helpers.js'
import {
    DateTime
} from "../../node_modules/luxon/build/es6/luxon.js"
import Modal from './modal.js'
import Toast from './toast.js'


document.addEventListener('DOMContentLoaded', async event => {
    Toast.devMode = false
    pruebas()
    const categories = [{
        value: 'business',
        text: 'Negocios'
    },
    {
        value: 'entertainment',
        text: 'Entretenimiento'
    },
    {
        value: 'general',
        text: 'General'
    },
    {
        value: 'health',
        text: 'Salud'
    },
    {
        value: 'science',
        text: 'Ciencia'
    },
    {
        value: 'sports',
        text: 'Deportes'
    },
    {
        value: 'technology',
        text: 'Tecnología'
    }
    ]

    const selectCategories = Helpers.populateSelectList('#categories', categories, 'value', 'text', 'Seleccione una categoria')
    selectCategories.selectedIndex = 2

    const dataCountries = await Helpers.fetchData('https://raw.githubusercontent.com/michaelwittig/node-i18n-iso-countries/master/langs/es.json')

    const countries = Object.entries(dataCountries.countries)
        .map(c => ({
            code: c[0],
            name: c[1]
        }))

    // console.log(countries)

    const selectCountries = Helpers.populateSelectList('#countries', countries, 'code', 'name', 'Seleccione un país')
    selectCountries.selectedIndex = 47

    selectCategories.addEventListener('change', filterNews)
    selectCountries.addEventListener('change', filterNews)
    selectCategories.dispatchEvent(new Event('change'))

})



function pruebas() {
    const idUnico = Helpers.random(0, 99999999999999).toString().padStart(14, "0")
    // console.log(idUnico);

    let z = 'Probando $0 de $1 con $2'.translate(
        'strings', 'JavaScript', 'expresiones regulares'
    )
    // console.log(z);

    const currentDate = DateTime.now().toISODate()
    // console.log(currentDate);
    const dateTime = DateTime.now().toFormat('yyyy-MM-dd hh:mm a')
    // console.log(dateTime);
}

/**
 * Cambia las ocurrencias de $# por los strings indicados como argumentos. 
 * Ejemplo de la llamada: 
 * let z = 'Probando $0 de $1 con $2'.translate(
              'strings', 'JavaScript', 'expresiones regulares'
           )
 * Esto retorna a z 'Probando strings de JavaScript con expresiones regulares'
 *
 * @param  {...any} texts los strings que se usan para hacer el reemplazo.
 * @returns El string original con los reemplazos realizados.
 */
String.prototype.translate = function (...texts) {
    let str = this
    const regex = /\$(\d+)/gi // en realidad no requiere ignoreCase
    return str.replace(regex, (item, index) => texts[index])
}

async function filterNews() {

    const apiKey = 'apiKey=cd8377351d0d4e74a4a629a74bfec3eb'
    const language = 'language=es'
    const sortBy = 'sortBy=popularity'
    const from = `from=${DateTime.now().toISODate()}`
    const country = `country=${document.querySelector('#countries').value}`
    const category = `category=${document.querySelector('#categories').value}`

    const url = 'https://newsapi.org/v2/top-headlines?$0&$1&$2&$3&$4&$5'.translate(
        apiKey, language, sortBy, from, country, category
    )

    // console.log(url)

    try {
        const news = await Helpers.fetchData(url)


        if (news.status === 'ok') {
            const card = document.querySelector('#utilities > #card').innerHTML
            document.querySelector('#news').innerHTML = ''
            news.articles.forEach(article => createArticle(article, card))
            news.articles.forEach(article => console.log(article))

        } else {
            Toast.info({
                message: 'Sin noticias para el filtro elegido',
                mode: 'warning',
                error: news
            },
                {
                    message: 'Noticias cargadas',
                    mode: 'success',
                    error: news
                }
            )
        }
    } catch (error) {
        Toast.info({
            message: 'No hay acceso al proveedor de noticias',
            mode: 'danger',
            error // ← se asigna lo de la variable con el mismo nombre del atributo
        })


    }

    function createArticle(article, card) {

        const idCard = Helpers.random(0, 99999999999999).toString().padStart(14, "0")
        const date = DateTime.fromISO(article.publishedAt).toFormat('yyyy-MM-dd hh:mm a')
        const author = article.author ? article.author : ''

        card = card.translate( /* los 7 valores siguientes los puede incluir en esta línea */
            idCard,
            article.urlToImage,
            `src="${article.urlToImage}"`,
            article.url,
            article.title,
            author,
            date
        )

        document.querySelector('#news').insertAdjacentHTML('beforeend', card)

        const btnDisplayModal = document.querySelector(`#card-${idCard} #modal-news`)
        let image = article.urlToImage
        let img = `<img class="w-52 mx-2" src="${image}" alt="Acá va una imagencita">
        `
        btnDisplayModal.addEventListener('click', e => {
            e.preventDefault()
            const m = new Modal({
                title: article.title,
                content: `<div class="flex flex-row items-center justify-center"> ${img} ${article.description} </div>`,
                buttons: [
                    {
                        id: 'close',
                        class: 'text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 mb-3',
                        innerHTML: 'Cerrar',
                        callBack: () => m.close()
                    }
                    // {
                    //     id: 'close2',
                    //     class: 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 mb-3',
                    //     innerHTML: 'Cancelar',
                    //     callBack: () => m.close()
                    // }
                ]
            }).show()
            // creación de la instancia del Modal
        })


    }
}
