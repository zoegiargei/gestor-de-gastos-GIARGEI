//declaración de variables que capturamos del DOM
const sectionUsuario = document.getElementById(`sectionUsuario`)
const sectionPresupuesto = document.getElementById(`sectionPresupuesto`)
const sectionGastos = document.getElementById(`sectionGastos`)
const sectionVistaGastos = document.getElementById(`sectionVistaGastos`)
const sectionRenovarPres = document.getElementById(`sectionRenovarPres`)
const sectionFiltrar = document.getElementById(`sectionFiltrar`)
const sectionConversor = document.getElementById(`sectionConversor`)

//función para mostrar error en DOM
function error(div, mensaje){

    let divError = document.getElementById(div)
    divError.innerHTML = `<p class="error">${mensaje}</p>`
    setTimeout(() => {divError.innerHTML = ``}, 3000)
}

//función para consultar datos en Storage
function consultarStorage(clave){
    let datoEnStorage = JSON.parse(localStorage.getItem(clave))
    return datoEnStorage
}

//header
const header = () => {

    let opcionUsuario = document.getElementById(`opcionUsuario`)
    let opcionPresupuesto = document.getElementById(`opcionPresupuesto`)
    let opcionGastos = document.getElementById(`opcionGastos`)
    let opcionConversor = document.getElementById(`opcionConversor`)
    let opcionFiltrar = document.getElementById(`opcionFiltrar`)

    opcionUsuario.addEventListener(`click`, () => {
        sectionUsuario.style.display = `block`
        sectionPresupuesto.style.display = `none`
        sectionRenovarPres.style.display = `none`
        sectionGastos.style.display = `none`
        sectionVistaGastos.style.display = `none`
        sectionFiltrar.style.display = `none`
        sectionConversor.style.display = `none`
    })

    opcionPresupuesto.addEventListener(`click`, () => {
        sectionUsuario.style.display = `none`
        sectionPresupuesto.style.display = `block`
        sectionRenovarPres.style.display = `none`
        sectionGastos.style.display = `none`
        sectionVistaGastos.style.display = `none`
        sectionFiltrar.style.display = `none`
        sectionConversor.style.display = `none`
    })

    opcionGastos.addEventListener(`click`, () => {

        let presupuesto = consultarStorage(`presupuesto`)
        if(presupuesto == 0){
            Swal.fire({
                icon: 'warning',
                title: 'No cargó presupuesto',
                text: 'Para ir a sección de Gastos primero debe cargar presupuesto',
            })
            return
        }else{
            sectionUsuario.style.display = `none`
            sectionRenovarPres.style.display = `block`
            sectionPresupuesto.style.display = `none`
            sectionGastos.style.display = `block`
            sectionVistaGastos.style.display = `block`
            sectionFiltrar.style.display = `none`
            sectionConversor.style.display = `none`
        }
    })

    opcionFiltrar.addEventListener(`click`, () => {

        let gastosEnStorage = consultarStorage(`gastos`)
        if(gastosEnStorage.length == 0){
            Swal.fire({
                icon: 'warning',
                title: 'No cargó ningún gasto',
                text: 'Para ir a sección de Filtrar Gastos primero debe cargar al menos un gasto.',
            })
            return
        }else{
            filtrarGastos()
            sectionUsuario.style.display = `none`
            sectionPresupuesto.style.display = `none`
            sectionRenovarPres.style.display = `none`
            sectionGastos.style.display = `none`
            sectionVistaGastos.style.display = `none`
            sectionFiltrar.style.display = `block`
            sectionConversor.style.display = `none`
        }
    })

    opcionConversor.addEventListener(`click`, () => {
        apis()
        
        sectionUsuario.style.display = `none`
        sectionRenovarPres.style.display = `none`
        sectionPresupuesto.style.display = `none`
        sectionGastos.style.display = `none`
        sectionVistaGastos.style.display = `none`
        sectionFiltrar.style.display = `none`
        sectionConversor.style.display = `block`
    })
}

//función para guardar datos de Usuario ingresado por el usuario
const guardarUsuario = () => {

    let nombreUsuario = document.getElementById(`nombre`).value
    let emailUsuario = document.getElementById(`email`).value
 
    if(nombreUsuario == "" || emailUsuario == ""){
        localStorage.setItem(`usuario`, JSON.stringify(new Usuario()))
    } else{
        let nuevoUsuario = new Usuario(nombreUsuario, emailUsuario)
        localStorage.setItem(`usuario`, JSON.stringify(nuevoUsuario))
    }

    sectionUsuario.style.display = `none`
    sectionPresupuesto.style.display = `block`
}


//función para guardar presupuesto ingresado por el Usuario
const guardarPresupuesto = () => {
    
    let usuario = consultarStorage(`usuario`)
    let inputPresupuesto = parseFloat(document.getElementById(`presupuesto`).value)
    let inputDivisa = document.getElementById(`divisa`).value

    if(inputPresupuesto < 1 || isNaN(inputPresupuesto)){
        error(`errorPresupuesto`, `${usuario.nombre} Ingresaste un presupuesto no válido, intenta nuevamente`)
        return
    } else if(inputDivisa == `divisa`){
        error(`errorPresupuesto`, `${usuario.nombre} no seleccionaste divisa`)
        return
    }

    let totalGastos = consultarStorage(`totalGastos`)
    inputPresupuesto -= totalGastos
    let presupuesto = new Presupuesto(inputPresupuesto, inputDivisa)
    localStorage.setItem(`presupuesto`, JSON.stringify(presupuesto))
    actualizarVista()
}

//función para actualizar vista dependiendo de los datos ingresados por el usuario
const actualizarVista = () => {

    let presupuesto = consultarStorage(`presupuesto`)
    let usuario = consultarStorage(`usuario`)
    
    sectionUsuario.style.display = `none`
    sectionRenovarPres.style.display = `none`
    sectionPresupuesto.style.display = `none`
    sectionGastos.style.display = `none`
    sectionVistaGastos.style.display = `none`
    sectionFiltrar.style.display = `none`
    sectionConversor.style.display = `none`

    let mostrarGastos = `
        <div class="gastos">
            <h2>Lista de Gastos</h2>
            <div id="vistaPresupuesto" class="vistaPresupuesto"><h5>Presupuesto actual: ${presupuesto.presupuesto} ${presupuesto.divisa}</h5></div>
        </div>
    `

    if(presupuesto == 0 && usuario.nombre == `invitado`){
        sectionUsuario.style.display = `block`
        sectionPresupuesto.style.display = `none`
        sectionGastos.style.display = `none`
        sectionVistaGastos.style.display = `none`
    }else{
        contPresupuesto += presupuesto.presupuesto
        sectionUsuario.style.display = `none`
        sectionPresupuesto.style.display = `none`
        sectionGastos.style.display = `block`
        sectionVistaGastos.style.display = `block`
        sectionVistaGastos.innerHTML = mostrarGastos
        mostrarListaGastos()
    }
}


//función para agregar gastos
const agregarGasto = (e) => {

    let usuario = consultarStorage(`usuario`)
    let dataForm = new FormData(e.target)
    let gasto = new Gasto(dataForm.get(`titulo`), dataForm.get(`categoria`), parseFloat(dataForm.get(`monto`)))

    if(gasto.monto < 1 || isNaN(gasto.monto) || gasto.titulo.trim() === ``){
        error(`errorGasto`, `${usuario.nombre} los datos que ingresaste no son válidos, intenta nuevamente`)
        return
    }

    if(gasto.monto > contPresupuesto){
        error(`presupuestoAgotado`, `${usuario.nombre} el monto del gasto que ingresaste es mayor al presupuesto disponible`)
        return
    }

    contPresupuesto -= gasto.monto
    
    let presupuesto = consultarStorage(`presupuesto`)
    presupuesto.presupuesto -= gasto.monto
    localStorage.setItem(`presupuesto`, JSON.stringify(presupuesto))

    let gastosStorage = JSON.parse(localStorage.getItem(`gastos`))
    gastosStorage.push(gasto)
    localStorage.setItem(`gastos`, JSON.stringify(gastosStorage))
    actualizarVista()
}

//función para mostrar gastos en la lista de gastos
const mostrarListaGastos = () => {

    let usuario = consultarStorage(`usuario`)
    let presupuestoEnStorage = consultarStorage(`presupuesto`)
    let gastosEnStorage = consultarStorage(`gastos`)

    let totalGastos = 0
    let mostrarGasto = ``

    sectionRenovarPres.style.display = `block` //Mostramos btn renovar y eliminar

    gastosEnStorage.forEach((gasto, indice) => {
        mostrarGasto += `
            <div id="gasto${indice}" class="mostrarGasto">
                <p>${gasto.titulo}</p>
                <p>${gasto.categoria}</p>
                <p><span>${gasto.monto} ${presupuestoEnStorage.divisa}</span></p>
                <p>${gasto.fecha}</p>
            </div>
        `
        totalGastos += gasto.monto
        localStorage.setItem(`totalGastos`, JSON.stringify(totalGastos))
    })

    sectionVistaGastos.innerHTML = ``
    sectionVistaGastos.innerHTML += `
    <div class="contListaGastos">
    <h2>Lista de Gastos</h2>
        <div class="contVistaPresupuesto">
            <p>Presupuesto actual de ${usuario.nombre}:   <span>${presupuestoEnStorage.presupuesto} ${presupuestoEnStorage.divisa}</span></p>
            <p>Se gastó hasta ahora:   <span>${totalGastos} ${presupuestoEnStorage.divisa}</span></p>
        </div>
        <div class="tituloMonto">
            <p>Título</p>
            <p>Categoría</p>
            <p>Monto</p>
            <p>Fecha</p>
        </div>
        ${mostrarGasto}
    </div>
    `

    if(presupuestoEnStorage.presupuesto < 200){

        Swal.fire({
            icon: 'warning',
            title: 'Presupuesto agotandose',
            text: 'El presupuesto se está agotando',
            footer: '<button id="renovarPres" class="btn">Renovar presupuesto</button>'
        })

        let renovarPres = document.getElementById(`renovarPres`)
        renovarPres.addEventListener(`click`, () => {
            renovarPresupuesto()
        })
    }
}

//función para renovar presupuesto
const renovarPresupuesto = () => {
    
    sectionRenovarPres.style.display = `none`
    sectionPresupuesto.style.display = `block`
    sectionGastos.style.display = `none`
    sectionVistaGastos.style.display = `none`
}

//función para llamar a las apis
const apis = () => {
    //AJAX y Fetch

    //Dolar hoy
    fetch("https://criptoya.com/api/dolar")
    .then(response => response.json())
    .then(({solidario, blue}) => {

        let dolarSolidario = document.getElementById(`solidario`)
        let dolarBlue = document.getElementById(`blue`)

        dolarSolidario.innerHTML = ``
        dolarSolidario.innerHTML += `
        Solidario: ${solidario}`

        dolarBlue.innerHTML = ``
        dolarBlue.innerHTML += `
        Blue: ${blue}`
    })

    //Conversor de moneda
    let myHeaders = new Headers();
    myHeaders.append("apikey", "xTSp083De3jdN6gDfkoYCXuO6HgBh0xQ");

    let requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
    };

    //api layer
    fetch("https://api.apilayer.com/currency_data/live?source=ARS&currencies=USD,EUR,AUD", requestOptions)
    .then(response => response.json())
    .then(result => {

        let eur = document.querySelector(`#EUR`)
        eur.dataset.cambio = result.quotes.ARSEUR
        
        let usd = document.querySelector(`#USD`)
        usd.dataset.cambio = result.quotes.ARSUSD
        
        let aud = document.querySelector(`#AUD`)
        aud.dataset.cambio = result.quotes.ARSAUD

        console.log(result.quotes.ARSAUD)
        console.log(result.quotes.ARSEUR)
        console.log(result.quotes.ARSUSD)

        inputs.forEach(input => {
            input.value = input.dataset.cambio
        })
    })
    .catch(error => console.error(error))
    //

    let inputs = document.querySelectorAll(`.valor`)

    inputs.forEach((input)=>{
        
        input.value = (input.dataset.cambio)
        input.addEventListener(`change`, () => {
            valorModificado(input)
        })
    })

    function valorModificado(input){
        let factor = (input.value / input.dataset.cambio)

        inputs.forEach((input) => {
            input.value = (input.dataset.cambio * factor).toFixed(3)
        })
    }
}

//variable para funciones de filtrado de gastos
const divGastosFiltrados = document.getElementById(`divGastosFiltrados`)

//función para filtrar gasto por categoría
const filtrarPorCategoria = () => {

    document.getElementById(`btnCategoria`).addEventListener(`click`, ()=>{

        let datosEnStorage = consultarStorage(`gastos`)
        let categoriaElijida = document.getElementById(`categoriaFiltrar`).value
        let existe = datosEnStorage.some(gasto => gasto.categoria == categoriaElijida)
        console.log(existe)
        
        if(existe){
            
            let presupuesto = consultarStorage(`presupuesto`)
            let gastosCategoria = datosEnStorage.filter(gasto => gasto.categoria == categoriaElijida)

            gastosCategoria.forEach((gasto, indice) => {

                divGastosFiltrados.innerHTML += `
                    <div id="gasto${indice}" class="mostrarGasto">
                        <p>${gasto.titulo}</p>
                        <p><span>${gasto.categoria}</span></p>
                        <p>${gasto.monto} ${presupuesto.divisa}</p>
                        <p>${gasto.fecha}</p>
                    </div>
                `
            })

        } else{

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No existe gasto con esa categoría!',
            })
        }
    })
}

//función para seleccionar filtrado de gastos
const filtrarGastos = () => {

    const divFiltrarPorCategoria = document.getElementById(`filtrarPorCategoria`)
    divFiltrarPorCategoria.style.display = `none`
    //const formFiltros = document.getElementById(`formFiltros`)
    const btnFiltros = document.getElementById(`btnFiltros`)

    btnFiltros.addEventListener(`click`, () => {

        const filtros = document.getElementById(`filtros`).value
        let presupuesto = consultarStorage(`presupuesto`)

        if(filtros == `Categoría`){

            divFiltrarPorCategoria.style.display = `block`
            filtrarPorCategoria()

        } else if(filtros == `MenorAMayor`){

            divFiltrarPorCategoria.style.display = `none`
            divGastosFiltrados.innerHTML = ``
            let datosEnStorage = consultarStorage(`gastos`)

            datosEnStorage.sort(function (a, b) {
                if (a.monto > b.monto) {
                    return 1;
                }
                if (a.monto < b.monto) {
                    return -1;
                }
                return 0;
            })

            datosEnStorage.forEach((gasto) => {

                divGastosFiltrados.innerHTML += `

                <div class="mostrarGasto">
                    <p>${gasto.titulo}</p>
                    <p><span>${gasto.categoria}</span></p>
                    <p>${gasto.monto} ${presupuesto.divisa}</p>
                    <p>${gasto.fecha}</p>
                </div>
            `})

        } else if(filtros == `MayorAMenor`){

            divGastosFiltrados.innerHTML = ``
            let datosEnStorage = consultarStorage(`gastos`)

            datosEnStorage.sort(function (a, b) {
                if (a.monto < b.monto) {
                    return 1;
                }
                if (a.monto > b.monto) {
                    return -1;
                }
                return 0;
            })

            datosEnStorage.forEach((gasto) => {

                divGastosFiltrados.innerHTML += `

                <div class="mostrarGasto">
                    <p>${gasto.titulo}</p>
                    <p><span>${gasto.categoria}</span></p>
                    <p>${gasto.monto} ${presupuesto.divisa}</p>
                    <p>${gasto.fecha}</p>
                </div>
            `})

        }
    })
}