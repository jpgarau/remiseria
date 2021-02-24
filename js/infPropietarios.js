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
                    generarInformePDF(response[0], vehiculo);
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

function generarInformePDF(servicios, vehiculo){
	let total = 0.00,
		ctaCte = 0.00,
		recaudado = 0.00,
        viajes = 0;
        fecha = getFechaHora();
	var informe = new jsPDF( {orientation: 'p',
	unit: 'mm',
	format: 'a4'});
	
	informe.setFontSize(10);
	informe.text(160, 5, "Fecha: "+fecha.fecha2);
	
	informe.setFontSize(18);
	informe.text(105, 10, empresa, "center");

	informe.setFontSize(14);
	informe.setFontType('bold');
	informe.text(105, 20, "INFORME DE VIAJES REALIZADOS", "center");

	informe.setFontSize(10);
	informe.text(20,30, "Movil: "+vehiculo);
	// informe.text(40,30, "Chofer: "+chofer);

	informe.roundedRect(10,35,190,7,1,1);

	informe.text(12,40, "Salió");
	informe.text(23,40, "Libre");
	informe.text(35,40, "Origen");
    informe.text(92,40, "Destino");
    informe.text(148,40, "CC");
	informe.text(163,40, "Importe");
	informe.text(190,40, "Total");

	informe.setFontType('normal');
	let linea=41;
    let idChofer = 0;
    let fechaServicio = '';
	servicios.forEach((servicio)=>{
        if (servicio.fecha!=fechaServicio){
            linea+=5;
            informe.setFontType('bold');
            informe.text(12,linea, servicio.fecha);
            informe.setFontType('normal');
            linea+=5;
            fechaServicio = servicio.fecha;
            informe.setFontType('bold');
            informe.text(12,linea, servicio.ayn);
            informe.setFontType('normal');
            linea+=5;
            idChofer = servicio.idChofer;
        }
        if (servicio.idChofer!=idChofer){
            informe.setFontType('bold');
            informe.text(12,linea, servicio.ayn);
            informe.setFontType('normal');
            linea+=5;
            idChofer = servicio.idChofer;
        }
        if(servicio.idCliente>0){
            ctaCte += servicio.importe==null?0.00:parseFloat(servicio.importe);
			informe.text(148,linea,"CC");
        }
		total += servicio.importe==null?0.00:parseFloat(servicio.importe);
		informe.text(12,linea, servicio.hora.substring(0,5));
		informe.text(23,linea, servicio.hora.substring(0,5));
		let origen = informe.splitTextToSize(servicio.origen,55);
		let destino = informe.splitTextToSize(servicio.destino==null?"":servicio.destino,55);
		informe.text(35,linea, origen[0]);
		informe.text(97,linea, destino[0]);
		let importe = servicio.importe==null?"0.00":servicio.importe.toString();
		informe.text(176,linea, "$ "+importe,"right");
		informe.text(199,linea, "$ "+total.toFixed(2).toString(),"right");
		viajes++;
		if(linea>285){
			informe.addPage();
			linea=10;
		}
		linea+=5;
	});

	recaudado = total-ctaCte,
	informe.roundedRect(140,linea,60,17,1,1);
	linea+=5;
	informe.text(142,linea, "Recaudado:");
	informe.text(199,linea, "$ "+recaudado.toFixed(2).toString(),"right");
	linea+=5;
	informe.text(142,linea, "Cuenta Corriente:");
	informe.text(199,linea, "$ "+ctaCte.toFixed(2).toString(),"right");
	linea+=5;
	informe.setFontType('bold');
	informe.text(142,linea, "Totales: "+viajes.toString()+" (viaje/s)");
	informe.text(199,linea, "$ "+total.toFixed(2).toString(),"right");
	informe.save(fecha.fecha+' -'+' Informe de Viajes realizados.pdf');
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