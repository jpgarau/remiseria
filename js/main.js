var empresa = 'Remiseria';

$(function(){
	setearEmpresa();
	if($('#idlocalidad').length>0){cargarLocalidad()}
    if($('#cmbDoc').length>0){cargarTipodoc()}
	if($('#cmbIva').length>0){cargarCondiva()}
	if($("#cmbTelegram").length>0) {cargarTelegram()}
	if($("#actTelegram").length>0){
		$("#actTelegram").on('click', function (){
			let telid = $("#cmbTelegram").val();
			$("#actTelegram i").addClass("fa-spin");
			actualizarTablaTelegram().then((exito)=>{
				cargarTelegram().then((exito)=>{
					$("#actTelegram i").removeClass("fa-spin");
					$("#cmbTelegram").val(telid);
				});
			});
		});
	}
	if(typeof relojConsola !== 'undefined'){
		clearInterval(relojConsola)};
});

// Localidades
function cargarLocalidad() {
	$.ajax({
		type: 'POST',
		url: 'scripts/apiLocalidades.php',
		datatype: 'json',
		data: ({param:1}),
		success: function(response){
			if(response.exito){
				$("#idlocalidad").html("");
				if(response.encontrados>0){
					response[0].forEach(localidad => {
						$("#idlocalidad").append("<option value='" + localidad.idlocalidad + "'>" + localidad.localidad + "</option>");
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

//Tipos Documentos
function cargarTipodoc() {
	$.ajax({
		type: 'POST',
		url: 'scripts/apiTipoDoc.php',
		data: ({ param: 1 }),
		datatype: 'json',
		success: function (response) {
			if (response.exito) {
				$("#cmbDoc").html("");
				if (response.encontrados > 0) {
					response[0].forEach(tipoDoc => {
						$("#cmbDoc").append("<option value='" + tipoDoc.idTipoDoc + "'>" + tipoDoc.descripcion + "</option>");
					});
				}
			} else {
				console.error(response.msg);
			}
		},
		error: function (response) {
			console.error(response);
		}
	});
}

// Condiciones de Iva
function cargarCondiva() {
	$.ajax({
		type: 'POST',
		url: 'scripts/apiCondIva.php',
		datatype: 'json',
		data: ({param:1}),
		success: function(response){
			if(response.exito){
				$("#cmbIva").html("");
				if(response.encontrados>0){
					response[0].forEach(condIva => {
						$("#cmbIva").append("<option value='" + condIva.idcondiva + "'>" + condIva.desccondiva + "</option>");
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

function cargarTelegram(){
	return new Promise((exito)=>{
    let cmbTelegram = document.getElementById("cmbTelegram");
    cmbTelegram.html = '';
    let opTelegram = document.createElement("option");
    opTelegram.value = 0;
    opTelegram.text = "Sin Telegram";
    cmbTelegram.appendChild(opTelegram);
    let datos = new FormData();
    datos.append("param",1);
    let request = new Request('scripts/apitelegram.php',{ method:'POST', body: datos});
    fetch(request).then((response)=>response.json()).then((respuesta)=>{
      if(respuesta.exito){
        if(respuesta.encontrados > 0)
		{
			let arrTelegrams = respuesta[0];
			if(arrTelegrams.length > 0){
				arrTelegrams.forEach(telegram => {
					let opTelegram = document.createElement("option");
					opTelegram.value = telegram.telid;
					opTelegram.text = telegram.last_name + ", "+ telegram.first_name;
					cmbTelegram.appendChild(opTelegram);
				});
				exito(respuesta.exito);
			}
		}else{
			exito(respuesta.exito);
		}
      }else{
		console.error(respuesta.msg);
		exito(respuesta.exito);
      }
	});
	});
}

function actualizarTablaTelegram(){
	return new Promise((exito)=>{
		$.ajax({
			type: 'POST',
			url: 'scripts/apitelegram.php',
			data: {param:2},
			dataType: 'json',
			success: function(response){
				if(response.exito){
					exito(response.exito);
				}
				else{
					console.error(response.msg);
					exito(response.exito);
				}
			},
			error: function(response){
				console.error(response);
				exito(false);
			}
		});
	});
}

function getFechaHora(diahr=new Date()){
	var year = diahr.getFullYear().toString();
	var mes = (diahr.getMonth()+1).toString().padStart(2,0);
	var dia = diahr.getDate().toString().padStart(2,0);
	var fecha = year+"-"+mes+"-"+dia;
	var fecha2 = dia+"/"+mes+"/"+year;
	var hora = diahr.getHours().toString().padStart(2,0);
	var min = diahr.getMinutes().toString().padStart(2,0);
	var seg = diahr.getSeconds().toString().padStart(2,0);
	var time = hora+":"+min+":"+seg;
	return {"fecha":fecha,"hora":time, "fecha2":fecha2};
}

function generarInformePDF(servicios, movil, chofer, fecha) {
	let total = 0.0,
		ctaCte = 0.0,
		recaudado = 0.0,
		viajes = 0;
	var informe = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

	informe.setFontSize(10);
	informe.text(160, 5, "Fecha: " + fecha.fecha2);

	informe.setFontSize(18);
	informe.text(105, 10, empresa, "center");

	informe.setFontSize(14);
	informe.setFontType("bold");
	informe.text(105, 20, "INFORME DE VIAJES REALIZADOS", "center");

	informe.setFontSize(10);
	informe.text(20, 30, "Movil: " + movil);
	informe.text(40, 30, "Chofer: " + chofer);

	informe.roundedRect(10, 35, 190, 7, 1, 1);

	informe.text(12, 40, "Salió");
	informe.text(23, 40, "Libre");
	informe.text(35, 40, "Origen");
	informe.text(92, 40, "Destino");
	informe.text(148, 40, "CC");
	informe.text(163, 40, "Importe");
	informe.text(190, 40, "Total");

	informe.setFontType("normal");
	let linea = 46;

	servicios.forEach((servicio) => {
		if (servicio.idCliente > 0) {
			ctaCte += servicio.importe == null ? 0.0 : parseFloat(servicio.importe);
			informe.text(148, linea, "CC");
		}
		total += servicio.importe == null ? 0.0 : parseFloat(servicio.importe);
		informe.text(12, linea, servicio.hora.substring(0, 5));
		informe.text(23, linea, servicio.hora.substring(0, 5));
		let origen = informe.splitTextToSize(servicio.origen, 55);
		let destino = informe.splitTextToSize(
			servicio.destino == null ? "" : servicio.destino,
			55
		);
		informe.text(35, linea, origen[0]);
		informe.text(92, linea, destino[0]);

		let importe =
			servicio.importe == null ? "0.00" : servicio.importe.toString();
		informe.text(176, linea, "$ " + importe, "right");
		informe.text(199, linea, "$ " + total.toFixed(2).toString(), "right");
		viajes++;
		if (linea > 285) {
			informe.addPage();
			linea = 10;
		}
		linea += 5;
	});

	(recaudado = total - ctaCte), informe.roundedRect(140, linea, 60, 17, 1, 1);
	linea += 5;
	informe.text(142, linea, "Recaudado:");
	informe.text(199, linea, "$ " + recaudado.toFixed(2).toString(), "right");
	linea += 5;
	informe.text(142, linea, "Cuenta Corriente:");
	informe.text(199, linea, "$ " + ctaCte.toFixed(2).toString(), "right");
	linea += 5;
	informe.setFontType("bold");
	informe.text(142, linea, "Totales: " + viajes.toString() + " (viaje/s)");
	informe.text(199, linea, "$ " + total.toFixed(2).toString(), "right");
	informe.save(fecha.fecha + " -" + " turno movil " + movil + ".pdf");
}

function setearEmpresa(){
	$.ajax({
		type:'POST',
		url: 'scripts/apiparametros.php',
		data: {param:'empresa'},
		dataType: 'json',
		success: function(response){
			if(response.exito){
				empresa = response.empresa;
			}
		}
	});
}