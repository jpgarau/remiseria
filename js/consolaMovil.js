var idServicio = 0;
var movil = 0;
var chofer = '';
var locaciones = {1:'Base',2:'Zona 1', 3:'Zona 2'};
var proximoDestino = "";
var idViajeDestino = 0;
$(function () {
    establecerServicio();

    $("#actualizarDestino").on("click", async function(){
        if( await verificarServicio()){
            actualizarDestino();
        }else{
            noHayServicio();
        }
    });
    $("#tomo_viaje").on("click", async function(){
        $(this).prepend('<i class="fas fa-spinner fa-pulse fa-lg carga"></i>');
        if( await verificarServicio()){
            tomarViaje();
        }else{
            noHayServicio();
        }
    });
    $("#libre_base").on("click", async function(){
        $(this).prepend('<i class="fas fa-spinner fa-pulse fa-lg carga"></i>');
        $(".btn").removeClass("active");
        $(this).addClass("active");
        if( await verificarServicio()){
            libre(1);
        }else{
            noHayServicio();
        }
    });
    $("#libre_zona1").on("click", async function(){
        $(this).prepend('<i class="fas fa-spinner fa-pulse fa-lg carga"></i>');
        $(".btn").removeClass("active");
        $(this).addClass("active");
        if( await verificarServicio()){
            libre(2);
        }else{
            noHayServicio();
        }
    });
    $("#libre_zona2").on("click", async function(){
        $(this).prepend('<i class="fas fa-spinner fa-pulse fa-lg carga"></i>');
        $(".btn").removeClass("active");
        $(this).addClass("active");
        if( await verificarServicio()){
            libre(3);
        }else{
            noHayServicio();
        }
    });
    $("#fuera_servicio").on("click", async function(){
        $(this).prepend('<i class="fas fa-spinner fa-pulse fa-lg carga"></i>');
        $(".btn").removeClass("active");
        $(this).addClass("active");
        if( await verificarServicio()){
            fueraServicio();
        }else{
            noHayServicio();
        }
    });
    $("#resumen_turno").on("click", async function(){
        $(this).prepend('<i class="fas fa-spinner fa-pulse fa-lg carga"></i>');
        if( await verificarServicio()){
            resumenTurno();
        }else{
            noHayServicio();
        }
    });
});

function actualizarDestino(){
    let idChofer = $("#actualizarDestino").val();
    $("#origenMovil").html("");
    $("#origenMovil").addClass("text-info");
    $("#origenMovil").append("Buscando...<div class='spinner-border' role='status' aria-hidden='true'></div>");
    $.ajax({
        type:"POST",
        url:"scripts/apiviajes.php",
        data:{param:8, idChofer},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                if(response.encontrados>0){
                    $('#tomo_viaje').prop('disabled', false);
                    $('#tomo_viaje i').removeClass('text-white');
                    $('#tomo_viaje i').addClass('text-success');
                    $("#origenMovil").html("");
                    $("#origenMovil").removeClass("text-info");
                    $("#origenMovil").append(response[0].origen);
                    proximoDestino = response[0].origen;
                    idViajeDestino = response[0].idViaje;
                    $(".btn").removeClass("active");
                }else{
                    $("#origenMovil").html("");
                    $("#origenMovil").removeClass("text-info");
                    $("#origenMovil").append("No hay viajes disponibles");
                    $(".btn").removeClass("active");
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

function libre(pila){
    $.ajax({
        type:"POST",
        url:"scripts/apipila.php",
        data:{param:3, idServicio, pila, 'msg':chofer+': Libre en ' + locaciones[pila]},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                $("#origenMovil").html("...");
                $('#tomo_viaje').prop('disabled', true);
                $('#tomo_viaje i').removeClass('text-success');
                $('#tomo_viaje i').addClass('text-white');
                alertify.success('Libre en ' + locaciones[pila]);
            }else{
                console.error(response.msg);
            }
            $(".carga").remove();
        },
        error: function(response){
            console.error(response);
        }
    });
}

function fueraServicio(){
    $.ajax({
        type:"POST",
        url:"scripts/apipila.php",
        data:{param:2, idServicio, msg:chofer+': Fuera de Servicio'},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                $('#tomo_viaje').prop('disabled', true);
                $('#tomo_viaje i').removeClass('text-success');
                $('#tomo_viaje i').addClass('text-white');
                alertify.warning('Fuera de Servicio');
            }else{
                console.error(response.msg);
            }
            $(".carga").remove();
        },
        error: function(response){
            console.error(response);
        }
    });
}

function resumenTurno(){
    let fecha = getFechaHora();
    $.ajax({
		type: "POST",
		url: "scripts/apiviajes.php",
		data: { param: 1, idServicio },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
                if(response.encontrados>0){
                    generarInformePDF(response[0], movil, chofer, fecha);
                }else{
                    alertify.error('No se encontraron viajes para este servicio.');
                }
			} else {
				console.log(response.msg);
            }
            $(".carga").remove();
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function establecerServicio() {
    let idChofer = $("#resumen_turno").val();
    $.ajax({
        type:"POST",
        url:"scripts/apiservicios.php",
        data:{param:4, idChofer},
        dataType: "json",
        success: function(response){
            if(response.exito){
                if(response.encontrados>0){
                    idServicio = response[0].idServicio;
                    movil = response[0].idVehiculo;
                    chofer = response[0].ayn;
                }else{
                    noHayServicio();
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

function tomarViaje(){
    $.ajax({
        type: "POST",
        url: 'scripts/apipila.php',
        data: {param:2, idServicio, msg:chofer+": Viaje Tomado a "+proximoDestino, idViaje: idViajeDestino},
        dataType: 'json',
        success: function(response){
            if(response.exito){
                if(response.estado !== 3){
                    $('#tomo_viaje').prop('disabled', true);
                    $('#tomo_viaje i').removeClass('text-success');
                    $('#tomo_viaje i').addClass('text-white');
                    $("#tomo_viaje").addClass("active");
                    alertify.success("Viaje Tomado con exito!!");
                }else{
                    $("#origenMovil").html("...");
                    $('#tomo_viaje').prop('disabled', true);
                    $('#tomo_viaje i').removeClass('text-success');
                    $('#tomo_viaje i').addClass('text-white');
                    alertify.error("El viaje fue rechazado por la operadora");
                }
            }else{
                console.error(response.msg);
            }
            $(".carga").remove();
        },
        error: function(response){
            console.error(response);
        }
    });
}

function verificarServicio(){
    return new Promise((exito)=>{
        $.ajax({
            type:'POST',
            url:'scripts/apiservicios.php',
            data:{param:5, idServicio},
            dataType: 'json',
            success: function(response){
                exito(response.exito);
            },
            error: function(response){
                console.error(response);
                exito(false);
            }
        });
    });
}

function noHayServicio(){
    alertify.error("No se encontro servicio Activo");
    $('#tomo_viaje').prop('disabled', true);
    $('#tomo_viaje i').removeClass('text-success');
    $('#tomo_viaje i').addClass('text-white');
    $("#actualizarDestino").prop("disabled", true);
    $("#libre_base").prop("disabled", true);
    $("#libre_zona1").prop("disabled", true);
    $("#libre_zona2").prop("disabled", true);
    $("#fuera_servicio").prop("disabled", true);
    $("#resumen_turno").prop("disabled", true);
    $("#errorServicio").removeClass("d-none");
}