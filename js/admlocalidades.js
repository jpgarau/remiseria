
$(document).ready(function () {
    // listar localidades
    listar();

    //listener botón agregar
    $('#addlocalidad').click(function(){
        $('#adm_localidades .modal-title').text('Agregar Localidad');
        $('#adm_localidades .modal-body input#localidad').val('');
        $('#adm_localidades .modal-body input#idlocalidad').val('Agregar');
        $('#adm_localidades').modal('show');
    });

    //listener botón editar del listado de la tabla
    $('#tabla_localidades tbody').on('click','.btn_editar',function(event){
        var boton = $(event.currentTarget);
        var localidad = boton[0].parentNode.parentNode.childNodes[0].innerText;
        var id = boton[0].parentNode.parentNode.childNodes[3].value;
        $('#adm_localidades .modal-title').text('Modificar Localidad');
        $('#adm_localidades .modal-body input#localidad').val(localidad);
        $('#adm_localidades .modal-body input#idlocalidad').val(id);
        $('#adm_localidades').modal('show');
    });

    //listener botón borrar del listado de la tabla
    $("#tabla_localidades tbody").on('click','.btn_borrar',function(){
        confirmarBorrado(this);
    });

    //Remover la clase is-invalid del input al momento de cerrar la ventana modal
    $("#adm_localidades").on("hide.bs.modal", function(e){
        $("#localidad").removeClass('is-invalid is-valid');
    });

    // Controlador de Evento Click del boton guardar de la ventana modal
    $("#guardar").on('click', function(){
        var localidad=$("#localidad").val();
        var idlocalidad=$("#idlocalidad").val();
        if(!$("#localidad").val()==""){
            if (idlocalidad=='Agregar'){
                agregarLocalidad(localidad);
                alertify.success('Agregado '+localidad);
            }else{
                actualizarLocalidad(idlocalidad,localidad);
                alertify.success('Actualizado '+localidad);
            }
            $("#adm_localidades").modal("hide");
        }else{
            $("#localidad").addClass('is-invalid');
            alertify.error("El campo localidad no puede estar vacio");
            $("#localidad").on("input", function(){
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


//Traer el listado de Elementos de la tabla localidades
function listar(){
    $.ajax({
        type: "POST",
        url: "scripts/apiLocalidades.php",
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
            borrarLocalidad(id, trBorrar);
            alertify.success('Eliminado'); 
        }
        , function(){ 
            alertify.error('Cancelado');
        });
}

// Insertar una nueva fila en la tabla de manera dinámica
function cargarFila(objeto){
    $('#tabla_localidades').append("<tr>"+
                "<td>"+objeto.localidad+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-dark btn_editar' title='Modificar Localidad' data-toggle='modal'><i class='fas fa-edit'></i></button>"+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-danger btn_borrar'><i class='fas fa-trash-alt'></i></button>"+"</td>"+
                "<input type='hidden' value='"+objeto.idlocalidad+"'>"+
                "</tr>");
}

// Agregar un nuevo registro a la BD
function agregarLocalidad(localidad){
    $.ajax({
        type: "POST",
        url: "scripts/apiLocalidades.php",
        data: {"param":2,
                "localidad":localidad},
        dataType: "json",
        success: function (response) {
            if(response.exito){
                var olocalidad = {'idlocalidad':response.id,
                'localidad':localidad};
                cargarFila(olocalidad); // Agregar el nuevo registro a la tabla
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        }
    });
}

// Modificar el perfil seleccionado en la BD
function actualizarLocalidad(idlocalidad, localidad){
    $.ajax({
        type: "POST",
        url: "scripts/apiLocalidades.php",
        data: {"param":3,
                "idlocalidad":idlocalidad,
                "localidad":localidad},
        dataType: "json",
        success: function (response) {
            if(response.exito){
                var olocalidad = {'idlocalidad':idlocalidad,
                'localidad':localidad};
                actualizarFila(olocalidad); // Actualizar los datos en la tabla
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        },
    });
}

//Borrar Localidad de la BD
function borrarLocalidad(id, trBorrar){
    $.ajax({
        type: "POST",
        url: "scripts/apiLocalidades.php",
        data: {"param":4,
                "idlocalidad":id},
        dataType: "json",
        success: function (response) {
            eliminarFila(trBorrar); //Eliminar la fila de la tabla
        }
    });
}

// Actualizar la información de la tabla en la correspondiente fila y columna
function actualizarFila(objeto){
    var input = $("input[value='"+objeto.idlocalidad+"']");
    input[1].parentNode.childNodes[0].innerText=objeto.localidad;
}

//Eliminar la fila de la tabla que se eliminó de la BD
function eliminarFila(trBorrar){
    $(trBorrar).remove();
}