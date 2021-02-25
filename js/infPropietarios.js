$(document).ready(function () {
    $("#informeViaje").on("click", function(){
        listarVehiculos();
        listarChoferes();
        $("#fecha").val("");
        $("#fechaHasta").val("");
        $("#inf_viajes_realizados").modal("show");
    });
    $("#generar").on("click", function(){
        let idVehiculos = $("#vehiculo").val();
        let vehiculo = $("#vehiculo option[value='"+idVehiculos+"']").text();
        let fecha = $("#fecha").val();
        let fechaHasta = $("#fechaHasta").val();
        let idChofer = $("#chofer").val();
        generarInformeViajes(idVehiculos, fecha, fechaHasta, idChofer, vehiculo);
        $("#inf_viajes_realizados").modal("hide");
    });
});

function listarVehiculos(){
    $.ajax({
        type:"POST",
        url:"scripts/apivehiculos.php",
        data:{param:7},
        dataType: "json",
        success: function(response){
            if(response.exito){
                llenarSelectVehiculos(response[0]);
            }else{
                console.log(response.msg);
            }
        },
        error: function(response){
            console.log(response);
        }
    });
}

function generarInformeViajes(idVehiculos, fecha, fechaHasta, idChofer, vehiculo){
    $.ajax({
        type: "POST",
        url: "scripts/apiviajes.php",
        data:{param:7, idVehiculos:idVehiculos, fecha:fecha, fechaHasta:fechaHasta, idChofer:idChofer},
        dataType: "json",
        success: function(response){
            if(response.exito){
                if(response[0].length>0){
                    generarInformeVehiculo(response[0], vehiculo);
                }else{
                    alertify.error("No hay información para mostrar. Verifique los datos seleccionados");
                }
            }else{
                console.log(response.msg);
            }
        },
        error: function(response){
            console.log(response);
        }
    });
}

function listarChoferes(){
    $.ajax({
        type:"POST",
        url:"scripts/apichoferes.php",
        data:{param:1},
        dataType: "json",
        success: function(response){
            if(response.exito){
                llenarSelectChoferes(response[0]);
            }else{
                console.log(response.msg);
            }
        },
        error: function(response){
            console.log(response);
        }
    });
}

function llenarSelectVehiculos(vehiculos){
    $("#vehiculo").html("");
    vehiculos.forEach((vehiculo)=>{
        let opVehiculo = $("<option>");
		opVehiculo.val(vehiculo.idVehiculos);
		opVehiculo.html(vehiculo.idVehiculos+" - "+vehiculo.marca);
		$("#vehiculo").append(opVehiculo);
    });
}

function llenarSelectChoferes(choferes){
    $("#chofer").html("");
    $("#chofer").append(
		$("<option>" + "Seleccionar Chofer" + "</option>").val(0)
	);
    choferes.forEach((chofer)=>{
        let opChofer = $("<option>");
		opChofer.val(chofer.idChofer);
		opChofer.html(chofer.ayn);
		$("#chofer").append(opChofer);
    });
}