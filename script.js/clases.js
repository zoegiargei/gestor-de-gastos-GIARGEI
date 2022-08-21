class Usuario{
    constructor(nombre=`invitado`, email=`in@email.com`){
        this.nombre = nombre
        this.email = email
    }
}

class Presupuesto{
    constructor(presupuesto, divisa){
        this.presupuesto = presupuesto
        this.divisa = divisa
    }
}

class Gasto{
    constructor(titulo, categoria, monto){
        this.titulo = titulo
        this.categoria = categoria
        this.monto = monto
        this.fecha = (new Date()).toLocaleDateString()
    }
}