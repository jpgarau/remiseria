
$(document).ready(function () {
    // listar tipos de documento
    listar();

    //listener botón agregar
    $('#addtipodoc').click(function(){
        $('#adm_tipoDoc .modal-title').text('Agregar Tipo de Documento');
        $('#adm_tipoDoc .modal-body input#descripcion').val('');
        $('#adm_tipoDoc .modal-body input#idTipoDoc').val('Agregar');
        $('#adm_tipoDoc').modal('show');
    });
    //listerner botón editar de la tabla
    $('#tabla_tipoDoc tbody').on('click','.btn_editar',function(event){
        var boton = $(event.currentTarget);
        var descripcion = boton[0].parentNode.parentNode.childNodes[0].innerText;
        var id = boton[0].parentNode.parentNode.childNodes[3].value;
        $('#adm_tipoDoc .modal-title').text('Modificar tipo de documento');
        $('#adm_tipoDoc .modal-body input#descripcion').val(descripcion);
        $('#adm_tipoDoc .modal-body input#idTipoDoc').val(id);
        $('#adm_tipoDoc').modal('show');
    });

    //listener botón borrar del listado de la tabla
    $("#tabla_tipoDoc tbody").on('click','.btn_borrar',function(){
        confirmarBorrado(this);
    });

    //Remover la clase is-invalid del input al momento de cerrar la ventana modal
    $("#adm_tipoDoc").on("hide.bs.modal", function(e){
        $("#descripcion").removeClass('is-invalid is-valid');
    });

    // Controlador de Evento Click del boton guardar de la ventana modal
    $("#guardar").on('click', function(){
        var descripcion=$("#descripcion").val();
        var idTipoDoc=$("#idTipoDoc").val();
        if(!$("#descripcion").val()==""){
            if (idTipoDoc=='Agregar'){
                agregarTipoDoc(descripcion);
                alertify.success('Agregado '+descripcion);
            }else{
                actualizarTipoDoc(idTipoDoc,descripcion);
                alertify.success('Actualizado '+descripcion);
            }
            $("#adm_tipoDoc").modal("hide");
        }else{
            $("#descripcion").addClass('is-invalid');
            alertify.error("El campo descripcion no puede estar vacio");
            $("#descripcion").on("input", function(){
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
        url: "scripts/apiTipoDoc.php",
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
            borrarTipoDoc(id, trBorrar);
            alertify.success('Eliminado'); 
        }
        , function(){ 
            alertify.error('Cancelado');
        });
}

// Insertar una nueva fila en la tabla de manera dinámica
function cargarFila(objeto){
    $('#tabla_tipoDoc').append("<tr>"+
                "<td>"+objeto.descripcion+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-dark btn_editar' title='Modificar Tipo de Documento' data-toggle='modal'><i class='fas fa-edit'></i></button>"+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-danger btn_borrar'><i class='fas fa-trash-alt'></i></button>"+"</td>"+
                "<input type='hidden' value='"+objeto.idTipoDoc+"'>"+
                "</tr>");
}

// Agregar un nuevo registro a la BD
function agregarTipoDoc(descripcion){
    $.ajax({
        type: "POST",
        url: "scripts/apiTipoDoc.php",
        data: {"param":2,
                "descripcion":descripcion},
        dataType: "json",
        success: function (response) {
            if(response.exito){
                var otipoDoc = {'idTipoDoc':response.id,
                'descripcion':descripcion};
                cargarFila(otipoDoc); // Agregar el nuevo registro a la tabla
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        }
    });
}

// Modificar el perfil seleccionado en la BD
function actualizarTipoDoc(idTipoDoc, descripcion){
    $.ajax({
        type: "POST",
        url: "scripts/apiTipoDoc.php",
        data: {"param":3,
                "idTipoDoc":idTipoDoc,
                "descripcion":descripcion},
        dataType: "json",
        success: function (response) {
            if(response.exito){
                var otipoDoc = {'idTipoDoc':idTipoDoc,
                'descripcion':descripcion};
                actualizarFila(otipoDoc); // Actualizar los datos en la tabla
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        },
    });
}

//Borrar de la BD
function borrarTipoDoc(id, trBorrar){
    $.ajax({
        type: "POST",
        url: "scripts/apiTipoDoc.php",
        data: {"param":4,
                "idTipoDoc":id},
        dataType: "json",
        success: function (response) {
            eliminarFila(trBorrar); //Eliminar la fila de la tabla
        }
    });
}

// Actualizar la información de la tabla en la correspondiente fila y columna
function actualizarFila(objeto){
    var input = $("input[value='"+objeto.idTipoDoc+"']");
    input[1].parentNode.childNodes[0].innerText=objeto.descripcion;
}

//Eliminar la fila de la tabla que se eliminó de la BD
function eliminarFila(trBorrar){
    $(trBorrar).remove();
}