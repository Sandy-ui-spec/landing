function validarFormulario() {
    const codigo = document.querySelector('input[name="codigo"]').value.trim();
    const articulo = document.querySelector('input[name="articulo"]').value.trim();
    const categoria = document.querySelector('input[name="categoria"]').value.trim();
    const existencias = document.querySelector('input[name="existencias"]').value.trim();
    const precio = document.querySelector('input[name="precio"]').value.trim();

    if (!codigo || !articulo || !categoria || !existencias || !precio) {
        alert("Por favor, completa todos los campos.");
        return false;
    }

    if (isNaN(existencias) || existencias <= 0) {
        alert("Las existencias deben ser un número positivo.");
        return false;
    }

    if (isNaN(precio) || precio <= 0) {
        alert("El precio debe ser un número positivo.");
        return false;
    }

    return true;
}

async function agregarInventario(event) {
    event.preventDefault();
    if (!validarFormulario()) return;
    const form = document.getElementById("formulario");
    const data = Object.fromEntries(new FormData(form));
    data.precio = Number(data.precio);
    data.existencias = Number(data.existencias);

    try {
        await createInventario(data);
        cargarInventarios();
        form.reset();
    } catch (error) {
        alert("No se pudo guardar el inventario.");
        console.error(error);
    }
}

function activarModoCreacion() {
    const form = document.getElementById("formulario");
    form.reset();
    if (form._actualizarHandler) {
        form.removeEventListener("submit", form._actualizarHandler);
        form._actualizarHandler = null;
    }
    form.addEventListener("submit", agregarInventario);
}

function activarModoEdicion(id) {
    const form = document.getElementById("formulario");
    form.removeEventListener("submit", agregarInventario);
    if (form._actualizarHandler) {
        form.removeEventListener("submit", form._actualizarHandler);
    }
    form._actualizarHandler = async function actualizar(event) {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        data.precio = Number(data.precio);
        data.existencias = Number(data.existencias);
        if (!validarFormulario()) return;

        try {
            await updateInventario(id, data);
            cargarInventarios();
            activarModoCreacion();
        } catch (error) {
            alert("No se pudo actualizar.");
            console.error(error);
        }
    };
    form.addEventListener("submit", form._actualizarHandler);
}