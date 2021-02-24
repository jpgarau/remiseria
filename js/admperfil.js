
$(document).ready(function () {
    listar();
    $('#addperfil').click(function(){
        $('#adm_perfiles .modal-title').text('Agregar Perfil');
        $('#adm_perfiles .modal-body input#descripcion').val('');
        $('#adm_perfiles .modal-body input#idperfil').val('Agregar');
        $('#adm_perfiles').modal('show');
    });
    $('#tabla_perfil tbody').on('click','.btn_editar',function(event){
        var boton = $(event.currentTarget);
        var descripcion = boton[0].parentNode.parentNode.childNodes[0].innerText;
        var id = boton[0].parentNode.parentNode.childNodes[4].value;
        $('#adm_perfiles .modal-title').text('Modificar Perfil');
        $('#adm_perfiles .modal-body input#descripcion').val(descripcion);
        $('#adm_perfiles .modal-body input#idperfil').val(id);
        $('#adm_perfiles').modal('show');
    });

    $('#tabla_perfil tbody').on('click','.btn_perpro',function(event){
        var boton = $(event.currentTarget);
        var descripcion = boton[0].parentNode.parentNode.childNodes[0].innerText;
        var id = boton[0].parentNode.parentNode.childNodes[4].value;
        $('#tit_per_prog').text(descripcion);
        cargarProgramas(id);
        $('#perfilprog').modal('show');
    });

    $("#tabla_perfil tbody").on('click','.btn_borrar',function(){
        confirmarBorrado(this);
    });

    //Remover la clase is-invalid del input al momento de cerrar la ventana modal
    $("#adm_perfiles").on("hide.bs.modal", function(e){
        $("#descripcion").removeClass('is-invalid is-valid');
    });

    // Controlador de Evento Click del boton guardar de la ventana modal
    $("#guardar").on('click', function(){
        var descripcion=$("#descripcion").val();
        var idperfil=$("#idperfil").val();
        if(!$("#descripcion").val()==""){
            if (idperfil=='Agregar'){
                agregarPerfil(descripcion);
                alertify.success('Agregado '+descripcion);
            }else{
                actualizarPerfil(idperfil,descripcion);
                alertify.success('Actualizado '+descripcion);
            }
            $("#adm_perfiles").modal("hide");
        }else{
            $("#descripcion").addClass('is-invalid');
            alertify.error("El campo descripción no puede estar vacio");
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

    $('#guardar_perfil').on('click',function(){
        var ochecks = $('#perfilprog :checkbox').map(function(){if($(this).prop('checked')){return this.value}});
        var checks = $.makeArray(ochecks);
        var perfilid = $('#perfilselect').val();
        guardarPerfilPrograma(perfilid,checks);

        $('#perfilprog').modal('hide');
        
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


//Traer el listado de Elementos de la tabla Perfil
function listar(){
    $.ajax({
        type: "POST",
        url: "scripts/apiperfil.php",
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
    var id=botonBorrar.parentNode.parentNode.childNodes[4].value;
    var trBorrar=botonBorrar.parentNode.parentNode;
    alertify.confirm('Eliminar', 'Esta seguro que desea eliminarlo?', function(){
            borrarPerfil(id, trBorrar);
            alertify.success('Eliminado'); 
        }
        , function(){ 
            alertify.error('Cancelado');
        });
}

// Insertar una nueva fila en la tabla de manera dinámica
function cargarFila(objeto){
    $('#tabla_perfil').append("<tr>"+
                "<td>"+objeto.descripcion+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-dark btn_editar' title='Modificar Perfil' data-toggle='modal'><i class='fas fa-edit'></i></button>"+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-danger btn_borrar'><i class='fas fa-trash-alt'></i></button>"+"</td>"+
                "<td>"+"<button class='btn btn-sm btn-info btn_perpro'><i class='fas fa-bars'></i></button>"+"</td>"+
                "<input type='hidden' value='"+objeto.perfilid+"'>"+
                "</tr>");
}

// Agregar un nuevo registro a la BD
function agregarPerfil(descripcion){
    $.ajax({
        type: "POST",
        url: "scripts/apiperfil.php",
        data: {"param":2,
                "descripcion":descripcion},
        dataType: "json",
        success: function (response) {
            if(response.exito==true){
                var operfil = {'perfilid':response.id,
                'descripcion':descripcion};
                cargarFila(operfil); // Agregar el nuevo registro a la tabla
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        }
    });
}

// Modificar el perfil seleccionado en la BD
function actualizarPerfil(idperfil, descripcion){
    $.ajax({
        type: "POST",
        url: "scripts/apiperfil.php",
        data: {"param":3,
                "idperfil":idperfil,
                "descripcion":descripcion},
        dataType: "json",
        success: function (response) {
            if(response.exito==true){
                var operfil = {'perfilid':idperfil,
                'descripcion':descripcion};
                actualizarFila(operfil); // Actualizar los datos en la tabla
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        },
    });
}

//Borrar Perfil de la BD
function borrarPerfil(id, trBorrar){
    $.ajax({
        type: "POST",
        url: "scripts/apiperfil.php",
        data: {"param":4,
                "idperfil":id},
        dataType: "json",
        success: function (response) {
            eliminarFila(trBorrar); //Eliminar la fila de la tabla
        }
    });
}

// Actualizar la información de la tabla en la correspondiente fila y columna
function actualizarFila(objeto){
    var input = $("input[value='"+objeto.perfilid+"']");
    input[1].parentNode.childNodes[0].innerText=objeto.descripcion;
}

//Eliminar la fila de la tabla que se eliminó de la BD
function eliminarFila(trBorrar){
    $(trBorrar).remove();
}

function cargarProgramas(perfilid){
$.ajax({
    type:'POST',
    url: 'scripts/apiprograma.php',
    data:{'param':1},
    dataType:'json',
    success: function(response){
        if(response.exito){
            listarProgramas(response[0]);
            $('#perfilselect').val(perfilid);
            $.ajax({
                type:'POST',
                url: 'scripts/apiperfpro.php',
                data:{'param':1,
                    'perfilid':perfilid},
                dataType:'json',
                success:  function(r){
                    if(r.exito){
                        if(r[0].length>0){
                            r[0].forEach(check=>{
                                c='#pro'+check.programaid;
                                $(c).prop('checked',true);
                            });
                        }
                    }else{
                        alertify.error('Hubo un error');
                        console.log(r.msg);
                    }
                },
                error: function(r){
                    console.log(r);
                }
            })
        }else{
            alertify.error('Hubo un error');
            console.log(response.msg);
        }
    },
    error: function (response){
        console.log(response);
    }
});
}

function listarProgramas(objeto){
    $('#perfilprog .modal-body').text('');
    objeto.forEach(renglon => {
        $('#perfilprog .modal-body').append('<div class="custom-control custom-switch float-left w-50">'+
        '<input type="checkbox" class="custom-control-input" id="pro'+renglon.programaid+'" name="perfilpro[]" value="'+renglon.programaid+'">'+
        '<label for="pro'+renglon.programaid+'" class="custom-control-label">'+renglon.nombre+'</label>'+
        '</div>')
    });
}

function guardarPerfilPrograma(perfilid,checks){
    $.ajax({
        type:'POST',
        url: 'scripts/apiperfpro.php',
        data: {'param':2,
                'perfilid':perfilid,
                'programas':checks},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                alertify.success('Actualizado con Exito');
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        },
        error: function(response){
            console.log(response);
        }
    });
}