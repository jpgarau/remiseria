$(function () {
	listarClientes();

	$("#filtrar").on("click", function () {
		let cliente = $("#cliente").val();
		let idCliente = cliente.split(" ", 1)[0];
		let fechaDesde = $("#fechaDesde").val();
		let fechaHasta = $("#fechaHasta").val();
		if (idCliente == "") {
			alertify.error("Debe seleccionar un cliente valido.");
			$("#cliente").focus();
		} else {
			filtrarCtaCte(idCliente, fechaDesde, fechaHasta);
		}
	});
	
	$("#tabla_ctacte tbody").on("click", "tr", function () {
		$("#tabla_ctacte tbody tr").removeClass("table-active");
		$(this).addClass("table-active");
    });
    
	$("#tabla_ctacte tbody").on("dblclick", "tr", function () {
		$("#tabla_ctacte tbody tr").removeClass("table-active");
		$(this).addClass("table-active");
		let tr = $(this)[0]
		let sigla = tr.childNodes[2].innerText;
		if(sigla==='RC'){
			alertify.confirm("Reimprimir", "Desea reimprimir el recibo seleccionado?", function(){
				let fecha = tr.childNodes[0].innerText;
				let hora = tr.childNodes[1].innerText;
				let cliente = $("#cliente").val();
				let importe = tr.childNodes[7].innerText;
				let observa = tr.childNodes[3].innerText;
				imprimirRecibo(fecha, hora, cliente, importe, observa);
			}, function(){
				alertify.error("Cancelado");
			})
		}
	});
	
	$("#button-limpiar").on("click", function (){
        $("#cliente").val("");
		$("#tabla_ctacte tbody").html("");
		$("#total_resumen").html("");
        $("#saldo").html("");
    });

	$("#btn_movCtaCte").on("click", function(){
		if($("#cliente").val()!==''){
			$("#credito").prop("checked", true);
			$("#importe").val("");
			$("#observa").val("");
			$("#movimiento_cta_cte").modal("show");
		}else{
			alertify.error('Debe seleccionar un cliente para poder agregar un movimiento de CtaCte');
		}
	});

	$("#btn_borrar").on("click", function () {
		let tr = $("#tabla_ctacte tbody tr.table-active");
		if (tr.length !== 0) {
			let idCtaCte = tr[0].childNodes[9].childNodes[0].value;
			let sigla = tr[0].childNodes[2].innerText;
			if(sigla!=="VI"){
				alertify.confirm(
					"Eliminar",
					"Eliminar el movimiento seleccionado?",
					function () {
						eliminarMovimiento(idCtaCte);
					},
					function () {
						alertify.error("No cancelado");
					}
				);
			}
			else{
				alertify.error("Los viajes no pueden ser eliminados desde la Cta Cte del cliente");
			}
		}else{
			alertify.error("No ha seleccionado un movimiento para borrar.")
		}
	});

	$("#btn_imprimirResumen").on("click",function(){
		let tr = $("#tabla_ctacte tbody tr");
		if(tr.length !== 0){
			let cliente = $("#cliente").val();
			let idCliente = cliente.split(" ", 1)[0];
			let fechaDesde = $("#fechaDesde").val();
			let fechaHasta = $("#fechaHasta").val();
			if (idCliente == "") {
				alertify.error("Debe seleccionar un cliente valido.");
				$("#cliente").focus();
			} else {
				imprimirR(idCliente, fechaDesde, fechaHasta);
			}
		}else{
			alertify.error("No hay movimientos para imprimir");
		}
	});

	$("#guardar").on("click", function(){
		let debcre = $(".modal-body input[type=radio][name=db_rc]:checked").val();
		let importe = $("#importe").val();
		let observa = $("#observa").val();
		agregarMovimiento(debcre, importe, observa);
		$("#movimiento_cta_cte").modal("hide");
	});
});

function listarClientes() {
	$.ajax({
		type: "POST",
		url: "scripts/apiclientes.php",
		data: { param: 1 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				llenarDataList(response[0]);
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function llenarDataList(clientes) {
	$("#list-clientes").html("");
	clientes.forEach((cliente) => {
		$("#list-clientes").append(
			'<option value="' + cliente.idPersonas + " - " + cliente.ayn + '">'
		);
	});
}

function filtrarCtaCte(idCliente, fechaDesde, fechaHasta) {
	$.ajax({
		type: "POST",
		url: "scripts/apictacte.php",
		data: { param: 1, idCliente, fechaDesde, fechaHasta },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				$("#tabla_ctacte tbody").html("");
				$("#total_resumen").html("");
				$("#saldo").html("");
				if (response[0].length === 0) {
					alertify.error("No se encontraron movimientos de cuenta corriente");
				} else {
					llenarTablaCtaCte(response[0], response[1]);
				}
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function llenarTablaCtaCte(movimientos, saldo) {
	let total = 0.00;
	if(saldo.saldoInicial>0){
		total += parseFloat(saldo.saldoInicial);
		$("#tabla_ctacte tbody").append("<tr class='text-right'>"+"<td colspan='8'>Saldo Inicial</td>"+"<td>"+saldo.saldoInicial+"</td>"+"</tr>");
	}
	movimientos.forEach((movimiento) => {
		if(movimiento.sigla==="RC"){
			total -= movimiento.importe==null?0.00:parseFloat(movimiento.importe);;
		}else{
			total += movimiento.importe==null?0.00:parseFloat(movimiento.importe);;
		}
		$("#tabla_ctacte tbody").append(
			"<tr>" +
				"<td>" +
				movimiento.fecha.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/,"$3-$2-$1") +
				"</td>" +
				"<td>" +
				movimiento.hora +
				"</td>" +
				"<td class='text-center'>" +
				movimiento.sigla +
				"</td>" +
				"<td>" + (movimiento.sigla==="VI"?
				movimiento.origen:movimiento.observa) +
				"</td>" +
				"<td>" +(movimiento.sigla==="VI"?
				movimiento.destino:"")+
				"</td>" +
				"<td>" +
				(movimiento.idVehiculo===null?"":movimiento.idVehiculo) +
				"</td>" +
				"<td class='text-right'>" +
				(movimiento.sigla!=="RC"?movimiento.importe:"") +
				"</td>" +
				"<td class='text-right'>" +
				(movimiento.sigla==="RC"?movimiento.importe:"") +
				"</td>" +
				"<td class='text-right'>" +
				total.toFixed(2) +
				"</td>" +
				"<td class='d-none'>" +
				"<input type='hidden' value=" +
				movimiento.idCtaCte +
				">" +
				"</td>" +
				"</tr>"
		);
	});
    $("#total_resumen").html(total.toFixed(2));
    $("#saldo").html(parseFloat(saldo.saldoCtaCte).toFixed(2));
}

function agregarMovimiento(debcre, importe, observa){
	let cliente = $("#cliente").val();
	let idCliente = cliente.split(" ", 1)[0];
	let fechaHora = getFechaHora();
	let fecha = fechaHora.fecha;
	let hora = fechaHora.hora;
	$.ajax({
		type: "POST",
		url:"scripts/apictacte.php",
		data: {param:3, sigla:debcre, fecha, hora, idCliente, observa, importe},
		dataType: "json",
		success: function (response){
			if(response.exito){
				let fechaDesde = $("#fechaDesde").val();
				let fechaHasta = $("#fechaHasta").val();
				if (debcre==='RC'){
					imprimirRecibo(fecha, hora, cliente, importe, observa);
				}
				filtrarCtaCte(idCliente, fechaDesde, fechaHasta);
			}else{
				console.error(response.msg);
			}
		},
		error: function (response){
			console.error(response);
		}
	});
}

function eliminarMovimiento(idCtaCte){
	$.ajax({
		type: "POST",
		url: "scripts/apictacte.php",
		data: {param:2, idCtaCte},
		dataType: "json",
		success: function (response) {
			if(response.exito){
				let cliente = $("#cliente").val();
				let idCliente = cliente.split(" ", 1)[0];
				let fechaDesde = $("#fechaDesde").val();
				let fechaHasta = $("#fechaHasta").val();
				filtrarCtaCte(idCliente, fechaDesde, fechaHasta);
			}else{
				console.error(response.msg);
			}
		},
		error: function (response) {
			console.error(response);
		}
	});
}

function imprimirRecibo(fecha, hora, cliente, importe, observa){
	importe = parseFloat(importe);
	let nombreCliente = cliente.split(" - ",2)[1];
	var recibo = new jsPDF( {orientation: 'p',
	unit: 'mm',
	format: 'a4'});

	recibo.setFontSize(10);
	recibo.text(5,5,"Fecha: "+fecha);
	recibo.text(5,10,"Hora: "+hora);

	recibo.setFontSize(18);
	recibo.text(105, 10, empresa, "center");

	recibo.setFontSize(14);
	recibo.setFontType('bold');
	recibo.text(105, 17, "X", "center");
	recibo.setFontSize(10);
	recibo.text(105, 22, "RECIBO", "center");

	recibo.setFontSize(10);
	recibo.rect(9,25,192,7,1,1);
	recibo.text(10,30,"Recibimos de "+nombreCliente);
	
	recibo.setFontType('bold');
	recibo.text(10,40,"Concepto");
	recibo.text(200,40, "Importe", "right");

	recibo.setFontType('normal');
	let concepto = recibo.splitTextToSize(observa,170);
	recibo.text(10,45, concepto[0]);
	recibo.text(200,45,"$ " + importe.toFixed(2).toString(), "right");

	let importeLetras = NumeroALetras(importe,{plural:"Pesos",singular:"Peso", centPlural:"centavos", centSingular:"centavo"}).toLowerCase()
	let arrImporteaLetras = recibo.splitTextToSize(importeLetras,87);
	let lineas = arrImporteaLetras.length;
	recibo.rect(9,65,102,7*lineas,1,1);
	recibo.setFontType('italic')
	recibo.text(10,70,"Son: ");
	for(i=0;i<lineas;i++){
		recibo.text(18,70+5*i,arrImporteaLetras[i]);
	}
	recibo.setFontType('normal')
	recibo.line(150,65+(7*lineas+20),190,65+(7*lineas+20),'DF');
	recibo.text(170,65+(7*lineas+20)+5,"Firma", "center");


	recibo.save(fecha+' -'+' recibo '+cliente+'.pdf');
}

function imprimirR(idCliente, fechaDesde, fechaHasta){
	$.ajax({
		type: "POST",
		url: "scripts/apictacte.php",
		data: { param: 1, idCliente, fechaDesde, fechaHasta },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				if (response[0].length === 0) {
					alertify.error("No se encontraron movimientos de cuenta corriente");
				} else {
					imprimirResumen(response[0], response[1]);
				}
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function imprimirResumen(movimientos, saldo){
	let cliente = $("#cliente").val();
	let nombreCliente = cliente.split(" - ",2)[1];
	let fecha = getFechaHora();
	let fechaDesde = $("#fechaDesde").val();
	let fechaHasta = $("#fechaHasta").val();
	let total = 0;
	let linea = 5;
	let resumen = new jsPDF( {orientation: 'p',
	unit: 'mm',
	format: 'a4'});

	resumen.setFontSize(10);
	resumen.text(5,5,"Fecha: " + fecha.fecha.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/,"$3-$2-$1"));
	
	resumen.setFontSize(18);
	resumen.text(105, 10, empresa, "center");

	resumen.setFontSize(12);
	resumen.setFontType('bold');
	resumen.text(105, 17, "Résumen de Cuenta Corriente", "center");
	resumen.setFontType('normal');
	if(fechaDesde!==''){
		if(fechaHasta===''){
			fechaHasta=fecha.fecha;
		}
		resumen.text(105, 22, "Desde: " + fechaDesde.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/,"$3-$2-$1") + " - " + "Hasta: "+ fechaHasta.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/,"$3-$2-$1"), "center");
	}

	resumen.setFontSize(10);
	resumen.text(10,30,"Cliente: " + nombreCliente);
	
	resumen.rect(9,35,192,7,1,1);
	resumen.text(10,40,"Fecha");
	resumen.text(26,40,"Hora");
	resumen.text(35,40,"Tipo");
	resumen.text(44,40,"Origen/Concepto");
	resumen.text(100,40,"Destino");
	resumen.text(129,40,"Movil");
	resumen.text(160,40,"Debe","right");
	resumen.text(180,40,"Haber","right");
	resumen.text(200,40,"Saldo","right");
	linea = 46;
	if (saldo.saldoInicial>0){
		total = parseFloat(saldo.saldoInicial);
		resumen.setFontType('bold');
		resumen.text(105, linea, "Saldo Anterior: $ "+ total.toFixed(2).toString(), "center");
		linea +=5;
		resumen.setFontSize(10);
		resumen.setFontType('normal');
	}
	movimientos.forEach((movimiento)=>{
		resumen.text(10,linea,movimiento.fecha.replace(/([0-9]{2})([0-9]{2})-([0-9]{2})-([0-9]{2})/,"$4-$3-$2"));
		resumen.text(26,linea,movimiento.hora.replace(/([0-9]{2}):([0-9]{2}):([0-9]{2})/,"$1:$2"));
		resumen.text(37,linea,movimiento.sigla);
		if(movimiento.sigla==='VI'){
			total += movimiento.importe==null?0.00:parseFloat(movimiento.importe);
			let origen = resumen.splitTextToSize(movimiento.origen,40);
			let destino = resumen.splitTextToSize(movimiento.destino==null?"":movimiento.destino,40);
			resumen.text(44,linea,origen[0]);
			resumen.text(85,linea,destino[0]);
			resumen.text(160,linea,movimiento.importe.toString(),"right");

		}else{
			if(movimiento.sigla==="RC"){
				total -= movimiento.importe==null?0.00:parseFloat(movimiento.importe);
				resumen.text(180,linea,movimiento.importe.toString(),"right");
			}else{
				total += movimiento.importe==null?0.00:parseFloat(movimiento.importe);
				resumen.text(160,linea,movimiento.importe.toString(),"right");
			}
			let observa = resumen.splitTextToSize(movimiento.observa,90);
			resumen.text(44,linea,observa[0]);
		}
		if(movimiento.idVehiculo){
			resumen.text(131,linea,movimiento.idVehiculo.toString());
		}
		resumen.text(200,linea,total.toFixed(2).toString(),"right");
		linea +=5;

		if(linea>285){
			informe.addPage();
			linea=10;
		}
	});

	resumen.roundedRect(130,linea,70,14,1,1);
	resumen.setFontType('bold');
	linea+=5;
	resumen.text(132,linea,"Total Resumen: ");
	resumen.text(198,linea,"$ "+total.toFixed(2).toString(), "right");
	linea+=5;
	resumen.text(132,linea,"Saldo Cta. Cte.: ");
	resumen.text(198,linea,"$ "+parseFloat(saldo.saldoCtaCte).toFixed(2).toString(), "right");

	resumen.save(fecha.fecha+' -'+' resumen '+nombreCliente+'.pdf');
}