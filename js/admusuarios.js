$(document).ready(function(){
    listar();
    traerPerfiles();
    traerChoferes();
    traerPropietarios();

    $('#addusuario').on('click',function(){
        $('#adm_usuarios .modal-title').text('Agregar Usuario');
        $('#adm_usuarios .modal-body input#apellido').val('');
        $('#adm_usuarios .modal-body input#nombre').val('');
        $('#adm_usuarios .modal-body input#usuario').val('');
        $('#select_perfiles').val($('#select_perfiles option').val());
        $('#select_choferes').val($('#select_choferes option').val());
        $('#select_propietarios').val($('#select_propietarios option').val());
        $('#adm_usuarios .modal-body input#idusuario').val('Agregar');
        $('#adm_usuarios').modal('show');
    });
    $("#tabla_usuarios tbody").on('click','.btn_editar',function(event){
        var boton = $(event.currentTarget);
        var apellido = boton[0].parentNode.parentNode.childNodes[0].innerText;
        var nombre = boton[0].parentNode.parentNode.childNodes[1].innerText;
        var usuario = boton[0].parentNode.parentNode.childNodes[2].innerText;
        var perfilid = boton[0].parentNode.parentNode.childNodes[3].childNodes[1].value.slice(3);
        var idChofer = boton[0].parentNode.parentNode.childNodes[4].childNodes[1].value;
        var idPropietario = boton[0].parentNode.parentNode.childNodes[5].childNodes[1].value;
        var usuarioid = boton[0].parentNode.parentNode.childNodes[8].value.slice(3);
        $('#adm_usuarios .modal-title').text('Modificar Usuario');
        $('#adm_usuarios .modal-body input#apellido').val(apellido);
        $('#adm_usuarios .modal-body input#nombre').val(nombre);
        $('#adm_usuarios .modal-body input#usuario').val(usuario);
        $('#adm_usuarios .modal-body input#idusuario').val(usuarioid);
        $('#select_perfiles').val(perfilid);
        $('#select_choferes').val(idChofer);
        $('#select_propietarios').val(idPropietario);

        $('#adm_usuarios').modal('show');
    });
    
    $('#tabla_usuarios tbody').on('click','.btn_borrar', function(){
        confirmarBorrado(this);
    });
    
    $('#guardar').on('click',function(){
        var apellido = $('#apellido').val();
        var nombre = $('#nombre').val();
        var usuario = $('#usuario').val();
        var idperfil = $('#select_perfiles').val();
        var idChofer = $('#select_choferes').val();
        var idPropietario = $('#select_propietarios').val();
        var idusuario = $('#idusuario').val();
        var valido = 0;
        var descripcion = $('#select_perfiles option[value='+idperfil+']').text();
        valido = validarApellido(apellido) + validarNombre(nombre)+ validarUsuario(usuario)+validarPerfil(idperfil);
        if(valido==0){
            if(idusuario=='Agregar'){
                agregarUsuario(apellido, nombre, usuario, idperfil, idChofer, descripcion, idPropietario);
                alertify.success('Agregado '+apellido+', '+nombre);
            }else{
                actualizarUsuario(idusuario,apellido,nombre,usuario, idperfil, idChofer, descripcion, idPropietario);
                alertify.success('Actualizado '+apellido+', '+nombre);
            }
            $('#adm_usuarios').modal('hide');
        }
    });
    $("#adm_usuarios").on("hide.bs.modal", function(){
        $("#apellido").removeClass('is-invalid is-valid');
        $("#nombre").removeClass('is-invalid is-valid');
        $("#usuario").removeClass('is-invalid is-valid');
        $("#select_perfiles").removeClass('is-invalid is-valid');
    });

    $('#buscador').on('input', function(){
        ocultarTR(this.value);
    });
});

function ocultarTR(buscar){
    var registros=$('tbody tr');

    var expresion = new RegExp(buscar,'i');

    for (let i = 0; i< registros.length; i++){
        $(registros[i]).hide();

        if(registros[i].childNodes[0].textContent.replace(/\s/g, "").search(expresion) !=-1 || registros[i].childNodes[1].textContent.replace(/\s/g, "").search(expresion) !=-1 || registros[i].childNodes[2].textContent.replace(/\s/g, "").search(expresion) !=-1 || registros[i].childNodes[3].textContent.replace(/\s/g, "").search(expresion) !=-1 || buscar==''){
            $(registros[i]).show();
        }
    }
}

function listar(){
    $.ajax({
        type: "POST",
        url:"scripts/apiusuario.php",
        data: {"param":1},
        dataType: "json",
        success: function(response){
            if(response.exito){
                llenarTabla(response[0]);
            }else{
                alertify.error("Error");
                console.log(response.msg);
            }
        },
        error: function(response){
            console.log(response);
        }
    });
}

function llenarTabla(respuesta){
    respuesta.forEach(renglon => {
        cargarFila(renglon);
    });
}

function cargarFila(objeto){
    $("#tabla_usuarios").append('<tr>'+
        '<td>'+objeto.apellido+'</td>'+
        '<td>'+objeto.nombre+'</td>'+
        '<td>'+objeto.usuario+'</td>'+
        '<td>'+objeto.descripcion+'<input type="hidden" value="pid'+objeto.perfilid+'">'+'</td>'+
        '<td class="text-center">'+(objeto.idChofer==null?" ":objeto.idChofer)+'<input type="hidden" value="'+(objeto.idChofer==null?0:objeto.idChofer)+'">'+'</td>'+
        '<td class="text-center">'+(objeto.idPropietario==null?" ":objeto.idPropietario)+'<input type="hidden" value="'+(objeto.idPropietario==null?0:objeto.idPropietario)+'">'+'</td>'+
        '<td>'+'<button class="btn btn-sm btn-dark btn_editar" title="Modificar Usuario" data-toggle="modal"><i class="fas fa-edit"></i></button>'+'</td>'+
        '<td>'+'<button class="btn btn-sm btn-danger btn_borrar" title="Eliminar Usuario"><i class="fas fa-trash-alt"></i></button>'+'</td>'+
        '<input type="hidden" value="uid'+objeto.usuarioid+'">'+
        '</tr>');
}

function agregarUsuario(apellido, nombre, usuario, idperfil, idChofer, descripcion, idPropietario){
    $.ajax({
        type:'POST',
        url: 'scripts/apiusuario.php',
        data:{'param':2,
                'apellido':apellido,
                'nombre': nombre,
                'usuario': usuario,
                'perfilid': idperfil,
                'idChofer':idChofer,
                'idPropietario': idPropietario},
        dataType: 'json',
        success: function(response){
            if(response.exito==true){
                var ousuario = {'apellido':apellido, 'nombre':nombre, 'usuario':usuario, 'perfilid': idperfil, 'idChofer':idChofer, 'usuarioid':response.id,'descripcion':descripcion, 'idPropietario':idPropietario};
                cargarFila(ousuario);
            }else{
                alertify.error('Hubo un Error');
                console.log(response.msg);
            }
        },
        error:function(response){
            console.log(response);
        }
    });
}

function actualizarUsuario(idusuario, apellido, nombre, usuario, idperfil, idChofer, descripcion, idPropietario){
    $.ajax({
        type: 'POST',
        url: 'scripts/apiusuario.php',
        data:{'param':3,
                'apellido':apellido,
                'nombre':nombre,
                'usuario':usuario,
                'perfilid':idperfil,
                'idChofer': idChofer,
                'usuarioid':idusuario,
                'idPropietario': idPropietario},
        datatype: 'json',
        success: function(response){
            if(response.exito==true){
                var ousuario = {'apellido':apellido, 'nombre':nombre, 'usuario':usuario, 'perfilid': idperfil, 'idChofer':idChofer, 'usuarioid':idusuario,'descripcion':descripcion, 'idPropietario':idPropietario};
                actualizarFila(ousuario);
            }else{
                alertify.error('Hubo un Error');
                console.log(response.msg);
            }
        }
    });
}

function actualizarFila(objeto){
    var input = $("input[value='uid"+objeto.usuarioid+"']");
    input[0].parentNode.childNodes[0].innerText=objeto.apellido;
    input[0].parentNode.childNodes[1].innerText=objeto.nombre;
    input[0].parentNode.childNodes[2].innerText=objeto.usuario;
    input[0].parentNode.childNodes[3].childNodes[0].data=objeto.descripcion;
    input[0].parentNode.childNodes[3].childNodes[1].value='pid'+objeto.perfilid;
    input[0].parentNode.childNodes[4].childNodes[0].data=(objeto.idChofer==null||objeto.idChofer==0?" ":objeto.idChofer);
    input[0].parentNode.childNodes[4].childNodes[1].value=(objeto.idChofer==null?0:objeto.idChofer);
    input[0].parentNode.childNodes[5].childNodes[0].data=(objeto.idPropietario==null||objeto.idPropietario==0?" ":objeto.idPropietario);
    input[0].parentNode.childNodes[5].childNodes[1].value=(objeto.idPropietario==null?0:objeto.idPropietario);
}

function borrarUsuario(id, trBorrar){
    $.ajax({
        type: 'POST',
        url: 'scripts/apiusuario.php',
        data:{'param':4,
                'usuarioid':id},
        datatype: 'json',
        success: function(response){
            if(response.exito){
                eliminarFila(trBorrar);
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        }
    });
}

function eliminarFila(trBorrar){
    $(trBorrar).remove();
}

function llenarPerfiles(perfiles){
    var opt='';
    for (let i = 0; i < perfiles.length; i++) {
            opt += '<option value="'+perfiles[i]['perfilid']+'">'+perfiles[i]['descripcion']+'</option>';
    }
    $('#select_perfiles').append(opt);
}

function traerPerfiles(){
    $.ajax({
        type: 'POST',
        url: 'scripts/apiperfil.php',
        data: {'param':1},
        dataType: 'json',
        success: function (response){
            if(response.exito){
                llenarPerfiles(response[0])
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

function traerChoferes(){
    $.ajax({
        type: 'POST',
        url: 'scripts/apichoferes.php',
        data: {'param':1},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                $("#select_choferes").append('<option value="0">Seleccionar el chofer</option>');
                if(response[0].length > 0){
                    response[0].forEach(chofer => {
                        $("#select_choferes").append('<option value="'+chofer.idChofer+'">'+chofer.ayn+'</option>');
                    });
                }
            }else{
                console.error(response.msg);
            }
        },
        error: function(response){
            console.error(response);
        }
    });
}

function traerPropietarios(){
    $.ajax({
        type: 'POST',
        url: 'scripts/apipropietarios.php',
        data: {'param':1},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                $("#select_propietarios").append('<option value="0">Seleccionar el propietario</option>');
                if(response[0].length > 0){
                    response[0].forEach(propietario => {
                        $("#select_propietarios").append('<option value="'+propietario.idPropietario+'">'+propietario.ayn+'</option>');
                    });
                }
            }else{
                console.error(response.msg);
            }
        },
        error: function(response){
            console.error(response);
        }
    });
}

function confirmarBorrado(botonBorrar){
    var id = botonBorrar.parentNode.parentNode.childNodes[8].value.slice(3);
    var trBorrar = botonBorrar.parentNode.parentNode;
    alertify.confirm('Eliminar', 'Esta seguro de que desea eliminarlo?', function(){
        borrarUsuario(id, trBorrar);

        alertify.success('Eliminado');
    },function(){
        alertify.error('Cancelado');
    });
}

function borrarUsuario(id, trBorrar){
    $.ajax({
        type: "POST",
        url: "scripts/apiusuario.php",
        data:{"param":4,
                "usuarioid":id},
        dataType:"json",
        success: function(response){
            if(response.exito){
                eliminarFila(trBorrar);
            }else{
                alertify.error('Hubo un Error');
                console.log(response.msg);
            }
        },
        error: function(response){
            console.log(response);
        }
    });
}

function eliminarFila(trBorrar){
    $(trBorrar).remove();
}

function validarApellido(apellido){
    if (apellido==''){
        $('#apellido').addClass('is-invalid');
        alertify.error('El apellido no puede estar vacio');
        $('#apellido').on('input',function(){
            if($(this).val()==''){
                $(this).addClass('is-invalid');
            }else{
                $(this).addClass('is-valid');
                $(this).removeClass('is-invalid');
            }
        });
        return 1;
    }else{
        return 0;
    }
}

function validarNombre(nombre){
    if(nombre==''){
        $('#nombre').addClass('is-invalid');
        alertify.error('El nombre no puede estar vacio');
        $('#nombre').on('input', function(){
            if($(this).val()==''){
                $(this).addClass('is-invalid');
            }else{
                $(this).addClass('is-valid');
                $(this).removeClass('is-invalid');
            }
        });
        return 1;
    }else{
        return 0;
    }
}

function validarUsuario(usuario){
    if(usuario==''){
        $('#usuario').addClass('is-invalid');
        alertify.error('El usuario no puede estar vacio');
        $('#usuario').on('input', function(){
            if($(this).val()==''){
                $(this).addClass('is-invalid');
            }else{
                $(this).addClass('is-valid');
                $(this).removeClass('is-invalid');
            }
        });
        return 1;
    }else{
        return 0;
    }
}

function validarPerfil(idperfil){
    if(idperfil=='' || idperfil==0){
        $('#select_perfiles').addClass('is-invalid');
        alertify.error('Debe seleccionar un perfil de usuario');
        $('#select_perfiles').on('change', function(){
            if($(this).val()==''){
                $(this).addClass('is-invalid');
            }else{
                $(this).addClass('is-valid');
                $(this).removeClass('is-invalid');
            }
        });
        return 1;
    }else{
        return 0;
    }
}