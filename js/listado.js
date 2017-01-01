var categoriasProductos = [];                                      
var productosBusqueda = [];

// -------------------------------------------------------
function ordenarPorNombre(){
    productosBusqueda.sort(sortByName);
}

// -------------------------------------------------------
function ordenarPorMenorPrecio(){
    productosBusqueda.sort(sortByLessPrice);
}

// -------------------------------------------------------
function ordenarPorMayorPrecio(){
    productosBusqueda.sort(sortByMaxPrice);
}

// -------------------------------------------------------
function sortByName(a, b){
    if(a && b){
        var aName = a.name.toLowerCase();

        var bName = b.name.toLowerCase(); 
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }
}

// -------------------------------------------------------
function sortByLessPrice(a, b){
    if(a && b){
        var aPrice = transformarPrecios(a.price);

        var bPrice = transformarPrecios(b.price); 
        return ((aPrice < bPrice) ? -1 : ((aPrice > bPrice) ? 1 : 0));
    }
}

// -------------------------------------------------------
function sortByMaxPrice(a, b){
    if(a && b){
        var aPrice = transformarPrecios(a.price);

        var bPrice = transformarPrecios(b.price); 
        return ((aPrice > bPrice) ? -1 : ((aPrice < bPrice) ? 1 : 0));
    }
}

// -------------------------------------------------------
function buscador(clue){
    var productos = getProductos();

    if(clue!=""){
        var search = new RegExp(clue , "i");
        productos = $.grep(productos, function(p) {
             if(p){
                return search.test(p.name);
            }
        });
    } 
    $("#filtros").trigger('reset');

    productosBusqueda = productos;
    pintarProductos();
}

// -------------------------------------------------------
function filtrarCategorias(productos, categoria){
    if(categoria!=0){
        productos = $.grep(productos, function(p) {
            if(p){
                var categorias = p.categories;
                return (jQuery.inArray(categoria, categorias) !== -1);
            }
        });
    }

    return productos;
}

// -------------------------------------------------------
function filtrarPrecios(productos, precio){
    if(precio==1){
        productos = $.grep(productos, function(p) {
            if(p){
                var precioFormat = transformarPrecios(p.price);
                return precioFormat > 30000;
            }
        });
    }else if(precio==2){
        productos = $.grep(productos, function(p) {
            if(p){
                var precioFormat = transformarPrecios(p.price);
                return precioFormat < 10000;
            }
        });
    }

    return productos;
}

// -------------------------------------------------------
function filtrarEstados(productos, estado){
    if(estado==1){
        productos = $.grep(productos, function(p) {
            if(p){
                return p.available;
            }
        });
    }else if(estado==2){
        productos = $.grep(productos, function(p) {
            if(p){
                return !p.available;
            }
        });
    }

    return productos;
}

// -------------------------------------------------------
function filtrarProductos(){
    var categoria = $('#filtro-categoria-select').val();
    var estado = $('input[name=estado]:checked').val();
    var precio = $('input[name=precio]:checked').val();

    productosBusqueda = getProductos();

    productosBusqueda=filtrarCategorias(productosBusqueda,parseInt(categoria));
    productosBusqueda=filtrarPrecios(productosBusqueda,precio);
    productosBusqueda=filtrarEstados(productosBusqueda,estado);

    pintarProductos();
}

// -------------------------------------------------------
function agregarAlCarrito(productoId,cantidad){
    var carritoActual = getCarritoActual();
    var current = encontrarProductoCarrito(productoId);//Obtengo el indice y el objeto producto

    if(current && current.length > 0){
         var item = {
            id: productoId,
            cantidad: parseInt(current[1].cantidad) + parseInt(cantidad)
        };

        carritoActual[current[0]] = item;

    }else{
        var item = {
            id: productoId,
            cantidad: parseInt(cantidad)
        };

        carritoActual.push(item);
    }

    guardarCarrito(carritoActual);
    pintarItemsCarrito();
}

// -------------------------------------------------------
function cargarProductos(productos) {
    var productosPersistentes = new Array();
    $.each(productos, function( i, producto ) {
        if (producto){
            productosPersistentes.push(producto);
        }
    });

    productosBusqueda = productosPersistentes;

    var jsonProductos = JSON.stringify( productosPersistentes );
    localStorage.setItem("productos", jsonProductos);
}

// -------------------------------------------------------
function cargarCategorias(categorias){
    $.each(categorias, function( i, categoria ){
        if(categoria){
             categoriasProductos[categoria.categori_id] = categoria;

            $('#filtro-categoria-select').append($('<option>', { 
                value: categoria.categori_id,
                text : categoria.name 
            }));
        }
    });  
}

// -------------------------------------------------------
function pintarProductoModal(productoId){
    var item = encontrarProductoPersistente(productoId);

    if (item){
        var producto = item[0];

        $("#producto-modal-body").empty();
        var templateProductoModal = Handlebars.compile($('#tpl-producto-modal').html());

        var bestSeller = "No";

        if(producto.best_seller){
            bestSeller = "Si";
        }

        var categoriasNombres = [];

        $.each(producto.categories, function( i, categoria ){
            var categoriaActual = categoriasProductos[categoria];
            categoriasNombres.push(categoriaActual.name);
        });

        var htmlLayout = templateProductoModal({
            id: producto.id, 
            nombre: producto.name,
            precio: producto.price,
            disponible: "Disponible",
            bestSeller: bestSeller,
            img: producto.img,
            categorias: categoriasNombres.join(),
            descripcion: producto.description
        });

        $("#producto-modal-body").append(htmlLayout);
        $("#agregar-carrito").attr("data-producto",producto.id);
        $("#producto-modal").modal('show');
    }

}

// -------------------------------------------------------
function pintarProductos(){
    ordenarProductos();
    var productos = productosBusqueda;
    $("#productos-content").empty();
    var templateProducto = Handlebars.compile($('#tpl-producto').html());

    $.each(productos, function( i, producto ) {
        if (producto){
            var bestSeller = "No";
            var disponible = "No Disponible";
            var disponibleClassText = "text-danger";
            var disponibleClassBtn = "hidden";

            if(producto.available){
                disponible = "Disponible";
                var disponibleClassText = "text-success";
                disponibleClassBtn = "";
            }

            if(producto.best_seller){
                bestSeller = "Si";
            }

            var categoriasNombres = [];

            $.each(producto.categories, function( i, categoria ){
                var categoriaActual = categoriasProductos[categoria];
                categoriasNombres.push(categoriaActual.name);
            });

            var htmlLayout = templateProducto({
                id: producto.id, 
                nombre: producto.name,
                precio: producto.price,
                disponible: disponible,
                disponibleClassText: disponibleClassText,
                disponibleClassBtn: disponibleClassBtn,
                bestSeller: bestSeller,
                img: producto.img,
                categorias: categoriasNombres.join(),
                descripcion: producto.description
            });

            $("#productos-content").append(htmlLayout);
        }
    });
}

// -------------------------------------------------------
function ordenarProductos(){
    var tipoFiltro = $('#ordenamiento').val();

    if(tipoFiltro == 1){
        ordenarPorNombre();
    }else if(tipoFiltro == 2){
        ordenarPorMenorPrecio();
    }else if(tipoFiltro == 3){
        ordenarPorMayorPrecio();
    }
}

// -------------------------------------------------------
function cargarData() {
    $.getJSON( URL_JSON, function( json ) {
        var productos = json.products;
        var categorias = json.categories;

        cargarCategorias(categorias);
        cargarProductos(productos);
        ordenarProductos();
        pintarProductos();
    });
}