let contPresupuesto = 0;
let usuarioInvitado = new Usuario()

//consultamos si existen datos en local Storage o creamos array vacío y le damos valor 0 a presupuesto
JSON.parse(localStorage.getItem(`usuario`)) || localStorage.setItem(`usuario`, JSON.stringify(usuarioInvitado))
JSON.parse(localStorage.getItem(`presupuesto`)) || localStorage.setItem(`presupuesto`, JSON.stringify(0))
JSON.parse(localStorage.getItem(`gastos`)) || localStorage.setItem(`gastos`, JSON.stringify([]))

//dependiendo de si existen datos en el localStorage se muestra la sección correspondiente
actualizarVista()

//llamamos a la función para seleccionar botones del header
header()

//Crear perfil
const formUsuario = document.getElementById(`formUsuario`)
formUsuario.addEventListener(`submit`, (e) => {

    e.preventDefault()
    guardarUsuario()
    formUsuario.reset()

    let usuario = consultarStorage(`usuario`)
    let bienvenido = document.getElementById(`bienvenido`)
    bienvenido.innerHTML = `Hola ${usuario.nombre}! te damos la bienvenida a la app web de Gestion de Gastos`
    setTimeout(() => {bienvenido.innerHTML = ``}, 3000)
})


//agregar presupuesto
const formPresupuesto = document.getElementById(`formPresupuesto`)
formPresupuesto.addEventListener(`submit`, (e) => {

    e.preventDefault()
    guardarPresupuesto()
})

//agregar gastos
const formGastos = document.getElementById(`formGastos`)
formGastos.addEventListener(`submit`, (e) => {

    e.preventDefault()
    agregarGasto(e)
    formGastos.reset()
})

//renovar presupuesto
const btnRenovarPresupuesto = document.getElementById(`btnRenovar`)
btnRenovarPresupuesto.addEventListener(`click`, () => {
    renovarPresupuesto()
})

//eliminar archivo gastos , esta función elimina todos los datos del localStorage
const btnEliminarArchivo = document.getElementById(`btnEliminarArchivo`)
btnEliminarArchivo.addEventListener(`click`, () => {
    
    localStorage.clear()
    contPresupuesto = 0
    localStorage.setItem(`usuario`, JSON.stringify(usuarioInvitado))
    localStorage.setItem(`presupuesto`, JSON.stringify(0))
    localStorage.setItem(`gastos`, JSON.stringify([]))
    actualizarVista()
})
