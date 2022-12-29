

//para controlar un acceso incorrecto al modal
var form = document.querySelector("form")
var title = document.querySelector(".title")

if(location.href.includes("modal")){
    form.reset()
    location.href="./";
}

//sugerencia: en una funcion ir tomando elementos, uno para clases y otro para id

//datos de productos, guardados de forma local
// localStorage.setItem("products", JSON.stringify([{nombre:"Gorra azul", precio:"9000", cantidad:45}]))
let data = JSON.parse(localStorage.getItem("products"))

console.log(data)


var input = document.querySelector("#inputSearch")

//
input.addEventListener("input", (input) => {
    let val = input.target.value
    let value = val.trim().toLowerCase()

    let dataToShow = data.filter(registro => {
        return registro.nombre.toLowerCase().includes(value)
    })
    
    var inputSearch = document.querySelector("#inputSearch")
    var resultElementsAdded = document.querySelectorAll(".result")

    if(inputSearch.value =="" && resultElementsAdded.length>0){
        // aca se deben eliminar todos los elementos .result pero solo se debe ejecutar una vez
        
        var dropListAct = document.querySelector(".dropList")

        for (let index = 0; index < resultElementsAdded.length; index++) {
            dropListAct.removeChild(document.querySelector(".result"))
        }
    }else{
        //retirar todos los result que haya hasta el momento para agregar los actualizados
        var dropList = document.querySelector(".dropList")
        var result = document.querySelectorAll(".result")
        if(result.length > 0){
            for (let index = 0; index < result.length; index++) {
                dropList.removeChild(result[index])
            }
        }

        if(dataToShow.length > 0){
            dataToShow.forEach(
                (data) => {
                    
                    //Creando el contenedor .result
                    var result = document.createElement("div")
                    result.classList = "result"
                    
                    //Titulo
                    var pTitle = document.createElement("p")
                    pTitle.textContent = data.nombre //magia aca
                    result.appendChild(pTitle)
                
                    // Agregando acciones al contenedor .resultActions
                    var resultActions = document.createElement("div")
                    resultActions.classList = "resultActions"
                
                    //Acciones para cada producto del listado
                    var reducir = document.createElement("a")
                    reducir.textContent = "Reducir"
                    reducir.href = "#modal"
                    reducir.id = "actionOption"
                    reducir.onclick = function() { initialModalReduce(data) }
                    resultActions.appendChild(reducir)
                
                    var editar = document.createElement("a")
                    editar.textContent = "Editar"
                    editar.href = "#modal"
                    editar.id = "actionOption"
                    editar.onclick = function() { initialModalEdit(data) }
                    resultActions.appendChild(editar)
                
                    var eliminar = document.createElement("a")
                    eliminar.textContent = "Eliminar"
                    eliminar.id = "actionOption"
                    eliminar.onclick = function() { deleteProduct(data); };
                    resultActions.appendChild(eliminar)
                    
                    // Añadiendo el contenedor .resultActions al contenedor .result, esto agr
                    result.appendChild(resultActions)
                
                    // Añadiendo el registro al contenedor .dropList
                    var droplist = document.querySelector(".dropList")
                    droplist.appendChild(result)
                }
            )
        }else{
            //Añadiendo sin resultados
            var droplist = document.querySelector(".dropList")
            var r = document.querySelectorAll(".result")

            if(r.length < 1){
                var result = document.createElement("div")
                result.classList = "result"
                result.textContent = "No hay coincidencias"
                
                droplist.appendChild(result)
            }
        }
    }
})


//agregar
var agregar = document.querySelector(".addLink")
agregar.onclick = function() {
    initAddModal()
}

//con este metodo se prepara el modal para su fucionamiento, en este caso para agregar
function initAddModal(){
    //para desenfocar el focus tab de la barra de navegacion y del cuadro de busqueda
    disableTabFocus()

    var form = document.querySelector("form")
    form.reset()

    var h3 = document.querySelector(".title")
    h3.textContent = "Agregar"
    
    var nombre = document.querySelector("#nombre")
    var precio = document.querySelector("#precio")

    if(nombre.hasAttribute("disabled")){
        nombre.removeAttribute("disabled")
    }

    if(precio.hasAttribute("disabled")){
        precio.removeAttribute("disabled")
    }

    nombre.setAttribute("required", true)
    precio.setAttribute("required", true)

    var btnGuardar = document.querySelector("#btnGuardar")
    btnGuardar.onclick = function() {
        addProduct()
    }

    var cerrar = document.querySelector("#close")
    cerrar.onclick = function() {
        //para restaurar el focus tab de la barra de navegacion y del cuadro de busqueda
        enableTabFocus()
    }
}

function addProduct(){
    let data = getDataForm()
    if(data.estado){
        //obteniendo y modificando datos locales
        let array = JSON.parse(localStorage.getItem("products"))
        array.push({nombre:data.nombre, precio:data.precio, cantidad:parseInt(data.cantidad)})
        localStorage.products = JSON.stringify(array)

        var form = document.querySelector("form")
        form.reset()

        alert("Producto "+data.nombre+" / "+data.precio+" / "+data.cantidad+" agregado")

        location.href="./";
    }
}


//reducir
function initialModalReduce(producto){
    disableTabFocus()

    var form = document.querySelector("form")
    form.reset()

    var h3 = document.querySelector(".title")
    h3.textContent = "Reducir"
    
    var nombre = document.querySelector("#nombre")
    nombre.value = producto.nombre
    nombre.setAttribute("disabled", true)

    var precio = document.querySelector("#precio")
    precio.value = producto.precio
    precio.setAttribute("disabled", true)

    var cantidad = document.querySelector("#cantidad")
    cantidad.value = producto.cantidad

    var btnGuardar = document.querySelector("#btnGuardar")
    btnGuardar.onclick = function() {
        reduceProduct()
    }

    var cerrar = document.querySelector("#close")
    cerrar.onclick = function() {
        enableTabFocus()
    }
}

function reduceProduct(){
    let data = getDataForm()

    var form = document.querySelector("form")
    
    if(data.estado){
        let array = JSON.parse(localStorage.getItem("products"))
        
        let nombre = data.nombre
        let cantidad = parseInt(data.cantidad)
        
        //obteniendo el registro que coincide con el seleccionado para reducirlo
        for (let index = 0; index < array.length; index++) {            
            if(array[index].nombre.toLowerCase() == nombre.toLowerCase()){
                alert("Producto reducido")
                array[index].cantidad = cantidad

                localStorage.products = JSON.stringify(array)

                break
            }
        }
        form.reset()
        location.href="./";
    }
}


//editar
function initialModalEdit(producto){
    disableTabFocus()

    var form = document.querySelector("form")
    form.reset()

    var h3 = document.querySelector(".title")
    h3.textContent = "Editar"
    
    var nombreInput = document.querySelector("#nombre")
    var precioInput = document.querySelector("#precio")
    var cantidadInput = document.querySelector("#cantidad")

    nombreInput.value = producto.nombre
    precioInput.value = producto.precio
    cantidadInput.value = producto.cantidad

    if(nombreInput.hasAttribute("disabled")){
        nombreInput.removeAttribute("disabled")
    }

    nombreInput.setAttribute("required", true)
    precioInput.setAttribute("required", true)

    var btnGuardar = document.querySelector("#btnGuardar")
    btnGuardar.onclick = function() {
        editProduct(producto.nombre)
    }

    var cerrar = document.querySelector("#close")
    cerrar.onclick = function() {
        enableTabFocus()
    }
}

function editProduct(nombreObjetivo){
    let data = getDataForm()

    var form = document.querySelector("form")
    
    if(data.estado){
        let array = JSON.parse(localStorage.getItem("products"))
        
        let nombre = data.nombre
        let cantidad = parseInt(data.cantidad)
        
        //obteniendo el registro que coincide con el seleccionado para editarlo
        for (let index = 0; index < array.length; index++) {            
            if(array[index].nombre.toLowerCase() == nombreObjetivo.toLowerCase()){
                alert("Producto editado")
                array[index].nombre = nombre
                array[index].cantidad = precio
                array[index].cantidad = cantidad

                localStorage.products = JSON.stringify(array)

                break
            }
        }
        form.reset()
        location.href="./";
    }
}


//Eliminar
function deleteProduct(objetivo){
    if (confirm("¿Quieres eliminar el producto "+objetivo.nombre+"?")) {

        let array = JSON.parse(localStorage.getItem("products"))

        //obteniendo el registro que coincide con el seleccionado para eliminarlo
        for (let index = 0; index < array.length; index++) {            
            if(array[index].nombre.toLowerCase() == objetivo.nombre.toLowerCase()){

                array.splice(index, 1)

                localStorage.products = JSON.stringify(array)
                
                alert("Producto eliminado")

                break
            }
        }
        
        location.href="./";
    }
}

//obteniendo datos del formulario
function getDataForm() {
    var form = document.querySelector("form")
    var nombre = document.querySelector("#nombre")
    var cantidad = document.querySelector("#cantidad")
    
    if(form.checkValidity()){
        return { estado:true, nombre:nombre.value, precio:precio.value, cantidad:cantidad.value }
    }
}


// Para que el tabulador haga target focus solo en los inputs del modal
function disableTabFocus(){
    document.querySelector(".addLink").setAttribute("tabindex", "-1")
    document.querySelector("#inputSearch").setAttribute("tabindex", "-1")
    var resultActions = document.querySelectorAll("#actionOption")
    for (let index = 0; index < resultActions.length; index++) {
        resultActions[index].setAttribute("tabindex", "-1")
    }
}

function enableTabFocus(){
    document.querySelector(".addLink").removeAttribute("tabindex")
    document.querySelector("#inputSearch").removeAttribute("tabindex")
    var resultActions = document.querySelectorAll("#actionOption")
    for (let index = 0; index < resultActions.length; index++) {
        resultActions[index].removeAttribute("tabindex")
    }
}
