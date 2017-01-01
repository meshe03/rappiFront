// -------------------------------------------------------
function modificarCantidad(productoId,cantidad){
    var carritoActual = getCarritoActual();
    var current = encontrarProductoCarrito(productoId);//Obtengo el indice y el objeto producto

    if(current && current.length > 0){
         var item = {
            id: productoId,
            cantidad:  cantidad
        };

        carritoActual[current[0]] = item;
    }

    guardarCarrito(carritoActual);
    pintarItemsCarrito();
    pintarTotal(); 
}

// -------------------------------------------------------
function eliminarDelCarrito(id){
    var carritoActual = getCarritoActual();
    var item = encontrarProductoCarrito(id);

    if(item && item.length > 0){
        carritoActual.splice(item[0], 1);
        $("#producto-"+id ).remove();

        guardarCarrito(carritoActual);
        pintarItemsCarrito();
        pintarTotal();
    }
}

// -------------------------------------------------------
function calcularTotal(){
    var carritoActual = getCarritoActual();
    var total = 0;

    $.each(carritoActual, function( i, item ){
        if(item){
            var current = encontrarProductoPersistente(item.id);
            if(current){
                var producto = current[0];
                var precio =  transformarPrecios(producto.price);            
                total = parseFloat(total + (item.cantidad * precio));
            }
        }
    });

    return total;
}

// -------------------------------------------------------
function pintarTotal(){
    var total = calcularTotal();
    $('#total-carrito').text(total);
}

// -------------------------------------------------------
function pintarProductosCarrito(){
    var productos = getCarritoActual();
    var templateProducto = Handlebars.compile($('#tpl-producto-carrito').html());

    $.each(productos, function( i, item ) {
        if(item){
            var current = encontrarProductoPersistente(item.id);
            if(current){
                var producto = current[0];

                var htmlLayout = templateProducto({
                    id: producto.id, 
                    nombre: producto.name,
                    precio: producto.price,
                    img: producto.img,
                    cantidad: item.cantidad
                });

                $("#productos-carrito-content").append(htmlLayout);   
            }
        }
    });
}