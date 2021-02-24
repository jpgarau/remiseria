var programas = new Array();
$(document).ready(function(){
    listar();
    $('#addprograma').on('click',function(){
        $('#adm_programas .modal-title').text('Agregar Programa');
        $('#adm_programas .modal-body input#nombre').val('');
        $('#adm_programas .modal-body input#link').val('');
        $('#adm_programas .modal-body input[name=padre]').val('');
        $('#adm_programas .modal-body input#esopcion').prop('checked',true);
        $('#adm_programas .modal-body input#orden').val('');
        $('#adm_programas .modal-body input#idprograma').val('Agregar');
        $('#adm_programas').modal('show');
    });

    $('#tabla_programa tbody').on('click','.btn_editar', function(){
        var nombre = this.parentNode.parentNode.childNodes[0].innerText;
        var link = this.parentNode.parentNode.childNodes[1].innerText;
        var padre = this.parentNode.parentNode.childNodes[2].innerText;
        var esopcion = this.parentNode.parentNode.childNodes[3].innerText=='Si'?true:false;
        var orden = this.parentNode.parentNode.childNodes[4].innerText;
        var idprograma = this.parentNode.parentNode.childNodes[7].value;
        $('#adm_programas .modal-title').text('Modificar Programa');
        $('#adm_programas .modal-body input#nombre').val(nombre);
        $('#adm_programas .modal-body input#link').val(link);
        $('#adm_programas .modal-body input[name=padre]').val(padre);
        $('#adm_programas .modal-body input#esopcion').prop('checked',esopcion);
        $('#adm_programas .modal-body input#orden').val(orden);
        $('#adm_programas .modal-body input#idprograma').val(idprograma);
        $('#adm_programas').modal('show');
    });
    
    $('#tabla_programa tbody').on('click','.btn_borrar', function(){
        confirmarBorrado(this);
    });

    $('#guardar').on('click',function(){
        var valido = 0;
        var nombre = $('#nombre').val();
        var link = $('#link').val();
        var padre = $('input[name=padre]').val();
        var esopcion = $('#esopcion').prop('checked');
        var orden = $('#orden').val();
        var idprograma = $('#idprograma').val();
        valido = validarNombre(nombre) + validarOrden(orden);
        if(valido==0){
            if(idprograma=='Agregar'){
                agregarPrograma(nombre, link, padre, esopcion, orden);
                alertify.success('Agregado '+nombre);
            }else{
                actualizarPrograma(nombre,link, padre, esopcion, orden, idprograma);
                alertify.success('Actualizado '+nombre);
            }
            $('#adm_programas').modal('hide');
        }
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

        if(registros[i].childNodes[0].textContent.replace(/\s/g, "").search(expresion) !=-1 || buscar==''){
            $(registros[i]).show();
        }
    }
}

function listar(){
    $.ajax({
        type: 'POST',
        url:'scripts/apiprograma.php',
        data:{'param':1},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                llenarTabla(response[0]);
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

function llenarTabla(respuesta){
    respuesta.forEach(renglon => {
        cargarFila(renglon);
        programas.push(renglon.nombre);
        $('#padre').append('<option value="'+renglon.nombre+'">');
    });
}

function cargarFila(objeto){
    $('#tabla_programa').append('<tr>'+
        '<td>'+objeto.nombre+'</td>'+
        '<td>'+objeto.link+'</td>'+
        '<td>'+objeto.padre+'</td>'+
        '<td>'+(objeto.esopcion=="0"?'No':'Si')+'</td>'+
        '<td>'+objeto.orden+'</td>'+
        '<td>'+'<button class="btn btn-sm btn-dark btn_editar" title="Modificar Progrma" data-toggle="modal"><i class="fas fa-edit"></i></button>'+'</td>'+
        '<td>'+'<button class="btn btn-sm btn-danger btn_borrar" title="Eliminar Progrma"><i class="fas fa-trash-alt"></i></button>'+'</td>'+
        '<input type="hidden" value="'+objeto.programaid+'">'+
        '</tr>');
}

function agregarPrograma(nombre,link,padre,esopcion,orden){
    $.ajax({
        type:'POST',
        url:'scripts/apiprograma.php',
        data:{'param':2,
                'nombre':nombre,
                'link': link,
                'padre': padre,
                'esopcion': esopcion==true?1:0,
                'orden': orden},
        dataType:'json',
        success: function(response){
            if(response.exito){
                var oprograma = {'nombre':nombre,'link':link,'padre':padre,'esopcion':esopcion,'orden':orden,'programaid':response.id};
                cargarFila(oprograma);
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

function actualizarPrograma(nombre,link,padre,esopcion,orden,idprograma){
    $.ajax({
        type:'POST',
        url:'scripts/apiprograma.php',
        data:{'param':3,
                'nombre':nombre,
                'link': link,
                'padre': padre,
                'esopcion': esopcion==true?1:0,
                'orden': orden,
                'programaid':idprograma},
        dataType:'json',
        success: function(response){
            if(response.exito){
                var oprograma = {'nombre':nombre,'link':link,'padre':padre,'esopcion':esopcion,'orden':orden,'programaid':idprograma};
                actualizarFila(oprograma);
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

function actualizarFila(objeto){
    var input = $('#tabla_programa tbody input[value="'+objeto.programaid+'"]');
    input[0].parentNode.childNodes[0].innerText=objeto.nombre;
    input[0].parentNode.childNodes[1].innerText=objeto.link;
    input[0].parentNode.childNodes[2].innerText=objeto.padre;
    input[0].parentNode.childNodes[3].innerText=objeto.esopcion==true?'Si':'No';
    input[0].parentNode.childNodes[4].innerText=objeto.orden;
}

function confirmarBorrado(botonBorrar){
    var id = botonBorrar.parentNode.parentNode.childNodes[7].value;
    var trBorrar = botonBorrar.parentNode.parentNode;
    alertify.confirm('Eliminar', 'Esta seguro que desea eliminarlo?',function(){
        borrarPrograma(id, trBorrar);
        alertify.success('Eliminado');
    },function(){
        alertify.error('Cancelado');
    })
}

function borrarPrograma(id,trBorrar){
    $.ajax({
        type: 'POST',
        url: 'scripts/apiprograma.php',
        data: {'param':4,
                'programaid':id},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                eliminarFila(trBorrar);
            }else{
                alertify.error('Hubo un error');
                console.log(response.msg);
            }
        },
        error: function(response){
            console.log(response);
        }
    })
}

function eliminarFila(trBorrar){
    $(trBorrar).remove();
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
    }else{return 0;}
}

function validarOrden(orden){
    if(orden=='' || parseInt(orden,10)<0){
        $('#orden').addClass('is-invalid');
        console.log($('#orden'));
        alertify.error('El N° de Orden debe ser un número entero positivo y no puede estar vacio');
        $('#orden').on('input', function(){
            if($(this).val()=='' || parseInt($(this).val(),10)<0 || isNaN($(this).val())){
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
            }else{
                $(this).addClass('is-valid');
                $(this).removeClass('is-invalid');
            }
        });
       return 1;
    }else{return 0;}
}