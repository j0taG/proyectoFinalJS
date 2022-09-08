//----------------------------------------------------------------------//
//Declaro una variable global de productos de mi archivo JSON con Fetch//
//----------------------------------------------------------------------//
let productos =[];
fetch('../productos.json')
    .then((res) => res.json())
    .then((productosjson) => { 
        productos = productosjson
        console.log(productos)
        cardsAlquiler(productos)})

//----------------------------------------------------------------//
//Declaro un array vacío para guardar los juegos seleccionadas//
//----------------------------------------------------------------//
let carritoSession = sessionStorage.getItem("carrito");
let carrito = carritoSession == '' || carritoSession == null ? [] : JSON.parse(sessionStorage.getItem("carrito"));

//------------------------------------------------------------------------//
//variable para la cantidad de productos del carrito en el Badge del menú//
//------------------------------------------------------------------------//
const cantidadProdBadge = document.querySelector("#cantidad-prod");

//--------------------------------//
//Cantidad del carrito en el menú.//
//--------------------------------//
cantidadProdBadge.textContent = carrito.length;

//--------------------------------------------------------//
//Recorro carrito y genero cards html. PAGE alquiler.html//
//--------------------------------------------------------//
function cardsAlquiler() {
    let emptyList = document.querySelector("#cards-alquiler");
    for (let nameJuego of productos) {
        let listadoCards = document.createElement("div");
        let label = nameJuego.tipo == "alquiler" ? "Alquilar" : "Comprar";
        if (nameJuego.stock <= 0) {
            label = "Sin stock";
        }
        listadoCards.classList.add("col", "mb-5");
        if(existeJuego(nameJuego.id)){
            listadoCards.innerHTML = `
            <div class="card h-100">
            <!-- Sale badge-->
            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">${nameJuego.badge}</div>
            <!-- Product image-->
            <img class="card-img-top" src="${nameJuego.img}" alt="..." />
            <!-- Product details-->
            <div class="card-body p-4">
            <div class="text-center text-dark">
            <!-- Product name-->
            <h5 class="fw-bolder">${nameJuego.nombre}</h5>
            <!-- Product price-->
            $ ${nameJuego.precio}
            </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><a class="btn btn-outline-dark mt-auto agregar-carrito" id="${nameJuego.id}" style="display:none">${label}</a>
            <a class="btn btn-outline-dark mt-auto eliminar-carrito" id="remove-${nameJuego.id}">Quitar</a></div>
            </div>
            </div>
            </div>
            `;
        }else{
            listadoCards.innerHTML = `
            <div class="card h-100">
            <!-- Sale badge-->
            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">${nameJuego.badge}</div>
            <!-- Product image-->
            <img class="card-img-top" src="${nameJuego.img}" alt="..." />
            <!-- Product details-->
            <div class="card-body p-4">
            <div class="text-center text-dark">
            <!-- Product name-->
            <h5 class="fw-bolder">${nameJuego.nombre}</h5>
            <!-- Product price-->
            $ ${nameJuego.precio}
            </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><a class="btn btn-outline-dark mt-auto agregar-carrito" id="${nameJuego.id}">${label}</a>
            <a class="btn btn-outline-dark mt-auto eliminar-carrito" id="remove-${nameJuego.id}" style="display:none">Quitar</a></div>
            </div>
            </div>
            </div>
            `;
        }
        emptyList.appendChild(listadoCards);
    }
    cargarEventListeners();
}

//------------------------------------------------------------------//
//Creo la funcion para validar que exista el juego en el carrito//
//------------------------------------------------------------------//
function existeJuego(id) {
    for (const juego of carrito) {
        if (juego.id == id) {
            return true;
        }
    }
    return false;
}

//------------------------------------------//
//Función para agregar al carrito con click//
//------------------------------------------//
function cargarEventListeners() {
    document.querySelectorAll(".agregar-carrito").forEach(juegoBtn => {
        juegoBtn.addEventListener("click", agregarJuego);
    })
    document.querySelectorAll(".eliminar-carrito").forEach(juegoBtn => {
        juegoBtn.addEventListener("click", eliminarJuego);
    })
}

//------------------------------------------------//
//Agrego juego al carrito y los voy acumulando//
//------------------------------------------------//
function agregarJuego(e) {
    e.preventDefault();
    if (e.target.classList.contains("agregar-carrito")) {
        const juegoSeleccionado = obtenerJuego(e.target.id);
        console.log(juegoSeleccionado);
        if (juegoSeleccionado.stock > 0) {
            carrito.push(juegoSeleccionado);
            sessionStorage.setItem("carrito", JSON.stringify(carrito));
            cantidadProdBadge.textContent = carrito.length;
            Toastify({
                text: "Agregaste el juego: " + juegoSeleccionado.nombre,
                duration: 2000,
                gravity:'top',
                position: 'left',
                style: {background:'linear-gradient(to right, #54af7f, #0cd366'}
                }).showToast();
            let botonAgregar = document.getElementById(juegoSeleccionado.id);
            botonAgregar.style.display = "none";
            let botonEliminar = document.getElementById("remove-" + juegoSeleccionado.id);
            botonEliminar.style.display = "inline-block";
        }
        else {
                Swal.fire({
                    text: 'No hay stock del juego seleccionado.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
        }
    }
}

//------------------------------//
//Eliminar producto del carrito//
//------------------------------//
function eliminarJuego(e) {
    e.preventDefault();
    if (e.target.classList.contains("eliminar-carrito")) {
        const juegoSeleccionado = obtenerJuego(e.target.id.replace('remove-',''));
        carrito = carrito.filter(juego => juego.id != juegoSeleccionado.id);
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
        cantidadProdBadge.textContent = carrito.length;
        let botonAgregar = document.getElementById(juegoSeleccionado.id);
        botonAgregar.style.display = "inline-block";
        let botonEliminar = document.getElementById("remove-" + juegoSeleccionado.id);
        botonEliminar.style.display = "none";
        Toastify({
            text: "Eliminaste el juego: " + juegoSeleccionado.nombre + " del carrito",
            duration: 2000,
            gravity:'top',
            position: 'left',
            style: {background:'linear-gradient(to right, #ff0000, #ff1427'}
            }).showToast();
    }
}

//--------------------------------//
//Obtengo el juego seleccionado//
//--------------------------------//
function obtenerJuego(idJuego) {
    for (const juego of productos) {
        if (juego.id == idJuego) {
            return juego;
        }
    }
    return null;
}

//----------------------------------------------------------//
//Recorro carrito y genero lista html. PAGE mi-carrito.html//
//----------------------------------------------------------//
function agregoListaMiCarrito() {
    let emptyList = document.querySelector("#listaUl");
    // let carrito = JSON.parse(sessionStorage.getItem("carrito"));
    cantidadProdBadge.textContent = carrito.length;
    for (let nameJuego of carrito) {
        let listado = document.createElement("li");
        listado.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-condensed");
        listado.innerHTML = `<div><h6 class="my-0">${nameJuego.nombre}</h6></div><span class="text-muted">$ ${nameJuego.precio}</span>`;
        emptyList.appendChild(listado);
    }
    cupon()
    sumarPrecio(carrito);
}

//--------------------------------------------------------//
//Recorro carrito y genero lista html. PAGE checkout.html//
//--------------------------------------------------------//
function listaCheckout() {
    let emptyList = document.querySelector("#listaUl");
    // let carrito = JSON.parse(sessionStorage.getItem("carrito"));
    cantidadProdBadge.textContent = carrito.length;
    for (let nameJuego of carrito) {
        let listado = document.createElement("li");
        listado.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-condensed");
        listado.innerHTML = `
        <div>
        <h6 class="my-0">${nameJuego.nombre}</h6>
        <small class="text-muted">${nameJuego.tipo}</small>
        </div>
        <span class="text-muted">$ ${nameJuego.precio}</span>
        `;
        emptyList.appendChild(listado);
    }
    cupon()
    sumarPrecio(carrito);
}

//-----------------------------------------------------------------------------//
//Funcion sumar los precios de los procuctos agregados en el carrito solamente//
//-----------------------------------------------------------------------------//
function sumarPrecio(carrito) {
    const miCompra = carrito;
    const total = miCompra.reduce((acc, miCompra) => acc + parseInt(miCompra.precio), 0);
    let emptyListPrice = document.querySelector("#listaUl");
    let listPrice = document.createElement("li");
    listPrice.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-condensed");
    listPrice.innerHTML = `<span>Total:</span><strong>$${total}</strong>`;
    emptyListPrice.appendChild(listPrice);
    console.log(total);
}

//------------------------------------------------//
//agrego solamente la sección del campo del cupon//
//------------------------------------------------//
function cupon() {
    let emptyListCupon = document.querySelector("#listaUl");
    let listCupon = document.createElement("li");
    listCupon.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-condensed");
    listCupon.innerHTML = `<div class="text-success"><h6 class="my-0">Codigo promocional</h6>
    <small>EXAMPLECODE (agregado a modo ejemplo)</small></div><span class="text-success">- $10</span>`;
    emptyListCupon.appendChild(listCupon);
}