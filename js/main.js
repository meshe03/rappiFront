 // -------------------------------------------------------
function getCarritoActual(){
    var carritoActual = new Array();

    if (localStorage.getItem("carrito")){
        carritoActual = JSON.parse(localStorage.getItem("carrito"));
    }
    return carritoActual;
}

 // -------------------------------------------------------
function getProductos(){
    var productos = new Array();

    if (localStorage.getItem("productos")){
        productos = JSON.parse(localStorage.getItem("productos"));
    }
    return productos;
}

 // -------------------------------------------------------
function getCategorias(){
    var categorias = [];

    if (localStorage.getItem("categorias")){
        categorias = JSON.parse(localStorage.getItem("categorias"));
    }
    return categorias;
}

// -------------------------------------------------------
function calcularItemsCarrito(){
    var carritoActual = getCarritoActual();
    var cantidad = 0;

    $.each(carritoActual, function( i, producto ){
        if(producto){                     
            cantidad = parseInt(cantidad) + parseInt(producto.cantidad);
        }
    });

    return cantidad;
}

// -------------------------------------------------------
function pintarItemsCarrito(){
    var numeroItems = calcularItemsCarrito();
    $('#numero-items').text(numeroItems);
}

// -------------------------------------------------------
function guardarCarrito(carritoActual){
    var jsonStr = JSON.stringify( carritoActual );
    localStorage.setItem("carrito", jsonStr);
}

// -------------------------------------------------------
function transformarPrecios(precio){
    precio = precio.replace('.', '');
    precio = precio.replace(',', '.');
    
    return parseFloat(precio);
}

// -------------------------------------------------------
function encontrarProductoPersistente(productoId){
    var productos = getProductos();
    var producto = null;
    
    producto = $.grep(productos, function(p) {
        if(p){
           return p.id == productoId;
       }
    });
    
    return producto;
}

// -------------------------------------------------------
function encontrarProductoCarrito(productoId){
    var productos = getCarritoActual();
    var index = [];
    
    index = $.map(productos, function(obj, index) {
        if(obj.id == productoId) {
            return [index,obj];
        }
    })
    
    return index;
}

