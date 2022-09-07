
//------------------------------------//
//Declaro constante del método de pago//
//------------------------------------//
const metodosDePago = document.querySelectorAll("[name='paymentMethod']");

//-------------------------------------------------//
//Función para validar selección del método de pago//
//-------------------------------------------------//
function cargarEventListenersCheck() {
    metodosDePago.forEach(metodoDePago => {
        metodoDePago.addEventListener("change", function (e) {
            //e.target.id me trae el elemento seleccionado.
            let metodoSeleccionado = document.getElementById(e.target.id);
            if (e.target.value == "paypal") {
                document.querySelectorAll(".methodPayment").forEach(item => {
                    item.style.display = "none";
                });
            }
            else {
                document.querySelectorAll(".methodPayment").forEach(item => {
                    item.style.display = "flex";
                });
            }
        });
    });
}
cargarEventListenersCheck();


// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("abonar");

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
    sessionStorage.setItem("carrito", []);
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}