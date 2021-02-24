
$(document).ready(function () {
    //listar condiciones de Iva
    listar();
    //listener botón agregar
    $('#addcondIva').click(function(){
        $('#adm_condIva .modal-title').text('Agregar IVA');
        $('#adm_condIva .modal-body input#desccondiva').val('');
        $('#adm_condIva .modal-body input#idcondiva').val('Agregar');
        $('#adm_condIva').modal('show');
    });
    //listener botón editar del listado de la tabla
    $('#tabla_condIva tbody').on('click','.btn_editar',function(event){
        var boton = $(event.currentTarget);
        var desccondiva = boton[0].parentNode.parentNode.childNodes[0].innerText;
        var id = boton[0].parentNode.parentNode.childNodes[3].value;
        $('#adm_condIva .modal-title').text('Modificar IVA');
        $('#adm_condIva .modal-body input#desccondiva').val(desccondiva);
        $('#adm_condIva .modal-body input#idcondiva').val(id);
        $('#adm_condIva').modal('show');
    });

    //listener del boton borrar del listado de la tabla
    $("#tabla_condIva tbody").on('click','.btn_borrar',function(){
        confirmarBorrado(this);
    });

    //Remover la clase is-invalid del input al momento de cerrar la ventana modal
    $("#adm_condIva").on("hide.bs.modal", function(e){
        $("#desccondiva").removeClass('is-invalid is-valid');
    });

    // Controlador de Evento Click del boton guardar de la ventana modal
    $("#guardar").on('click', function(){
        var desccondiva=$("#desccondiva").val();
        var idcondiva=$("#idcondiva").val();
        if(!$("#desccondiva").val()==""){
            if (idcondiva=='Agregar'){
                agregarCondIva(desccondiva);
                alertify.success('Agregado '+desccondiva);
            }else{
                actualizarCondIva(idcondiva,desccondiva);
                alertify.success('Actualizado '+desccondiva);
            }
            $("#adm_condIva").modal("hide");
        }else{
            $("#desccondiva").addClass('is-invalid');
            alertify.error("El campo descripcion no puede estar vacio");
            $("#desccondiva").on("input", function(){
                if($(this).val()==''){
                    $(this).addClass('is-invalid');
                }else{
                    $(this).addClass('is-valid');
                    $(this).removeClass('is-invalid');
                }
            });
        }
    });

    //Agregar el evento para filtrar la busqueda de elementos de la tabla
    $("#buscador").on('input', function(){
        ocultarTR(this.value);
    });
});

//Ocultar o Mostrar los renglones de la tabla de acuerdo a la busqueda mediante una expresion regular
function ocultarTR(buscar){
    var registros=$("tbody tr");
    
    var expresion = new RegExp(buscar,'i');
    
    for (let i = 0; i < registros.length; i++) {
        $(registros[i]).hide();

        if(registros[i].childNodes[0].textContent.replace(/\s/g, "").search(expresion) !=-1 || buscar==''){
            $(registros[i]).show();
        }
    }
}


//Traer el listado de Elementos de la tabla
function listar(){
    $.ajax({
        type: "POST",
        url: "scripts/apiCondIva.php",
        data: {"param":1},
        dataType: "json",
        success: function (response) {
            if(response.exito){
                llenarTabla(response[0]); //llenar la tabla con los datos obtenidos
            }else{
                alertify.error('Error');
                console.log(response.msg);
            }
        },
        error: function(response){
            console.log(response);
        }
    });
}

// Llenar la tabla con los registros de la BD dinámicamente
function llenarTabla(respuesta){
    respuesta.forEach(renglon => {
        cargarFila(renglon);
    });
}

// confirmar el borrado de un registro
function confirmarBorrado(botonBorrar){
    var id=botonBorrar.parentNode.parentNode.childNodes[3].value;
    var trBorrar=botonBorrar.parentNode.parentNode;
    alertify.confirm('Eliminar', 'Esta seguro que desea eliminarlo?', function(){
            borrarCondIva(id, trBorrar);
            alertify.success('Eliminado'); 
        }
        , function(){ 
            alertify.error('Cancelado');
        });
}

// Insertar una nueva fila en la tabla de manera dinámica
function cargarFila(objeto){
    $('#tabla_condIva').append("<tr>"+
                "<td>"+objeto.desccondiva+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-dark btn_editar' title='Modificar Tipo de Documento' data-toggle='modal'><i class='fas fa-edit'></i></button>"+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-danger btn_borrar'><i class='fas fa-trash-alt'></i></button>"+"</td>"+
                "<input type='hidden' value='"+objeto.idcondiva+"'>"+
                "</tr>");
}

// Agregar un nuevo registro a la BD
function agregarCondIva(desccondiva){
    $.ajax({
        type: "POST",
        url: "scripts/apiCondIva.php",
        data: {"param":2,
                "desccondiva":desccondiva},
        dataType: "json",
        success: function (response) {
            if(response.exito){
                var oCondIva = {'idcondiva':response.id,
                'desccondiva':desccondiva};
                cargarFila(oCondIva); // Agregar el nuevo registro a la tabla
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        }
    });
}

// Modificar el perfil seleccionado en la BD
function actualizarCondIva(idcondiva, desccondiva){
    $.ajax({
        type: "POST",
        url: "scripts/apiCondIva.php",
        data: {"param":3,
                "idcondiva":idcondiva,
                "desccondiva":desccondiva},
        dataType: "json",
        success: function (response) {
            if(response.exito){
                var oCondIva = {'idcondiva':idcondiva,
                'desccondiva':desccondiva};
                actualizarFila(oCondIva); // Actualizar los datos en la tabla
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        },
    });
}

//Borrar de la BD
function borrarCondIva(id, trBorrar){
    $.ajax({
        type: "POST",
        url: "scripts/apiCondIva.php",
        data: {"param":4,
                "idcondiva":id},
        dataType: "json",
        success: function (response) {
            eliminarFila(trBorrar); //Eliminar la fila de la tabla
        }
    });
}

// Actualizar la información de la tabla en la correspondiente fila y columna
function actualizarFila(objeto){
    var input = $("input[value='"+objeto.idcondiva+"']");
    input[1].parentNode.childNodes[0].innerText=objeto.desccondiva;
}

//Eliminar la fila de la tabla que se eliminó de la BD
function eliminarFila(trBorrar){
    $(trBorrar).remove();
}