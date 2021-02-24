var timerAlarma = 15;
$(function () {
	setearAlarma();

	$("#downNav").on("click", openNav);
	$("#calendario").datepicker({
		autoSize: true,
		dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
		monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
		onSelect: function (dateText, inst) {
			listarReservas(getFechaHora($(this).datepicker("getDate")).fecha);
		},
	});

	actualizarFecha();
	window.relojConsola = setInterval(actualizarFecha, 1000);
	listarReservas(getFechaHora().fecha);

	listarServiciosActivos();

	$("#tabla_reservas tbody").on("click", "tr", function () {
		$("#tabla_reservas tbody tr").removeClass("table-active");
		$(this).addClass("table-active");
	});

	$("#tabla_reservas tbody").on("dblclick", "tr", async function () {
		$("#tabla_reservas tbody tr").removeClass("table-active");
		$(this).addClass("table-active");
		let idReserva = $(this)[0].childNodes[5].childNodes[0].value;
		await cargarClientes().then(()=>{
			$.ajax({
				type: "POST",
				url: "scripts/apireservas.php",
				data: { param: 4, idReserva: idReserva },
				dataType: "json",
				success: function (response) {
					if (response.exito) {
						let reserva = response[0];
						$("#modal_nueva_reserva .modal-body #fecha").val(reserva.fecha);
						$("#modal_nueva_reserva .modal-body #hora").val(reserva.hora);
						$("#modal_nueva_reserva .modal-body #fechaHasta").val(reserva.fecha);
						$("#modal_nueva_reserva .modal-body #fechaHasta").prop(
							"disabled",
							true
						);
						$("#modal_nueva_reserva .modal-body #finSemana").prop({
							checked: true,
							disabled: true,
						});
						$("#modal_nueva_reserva .modal-body #origen").val(reserva.origen);
						$("#modal_nueva_reserva .modal-body #destino").val(reserva.destino);
						$("#modal_nueva_reserva .modal-body #observa").val(reserva.observa);
						$("#modal_nueva_reserva .modal-body .cmbCliente").val(
							reserva.idCliente
						);
						$("#modal_nueva_reserva .modal-body #idReserva").val(
							reserva.idReserva
						);
						$("#modal_nueva_reserva").modal("show");
					} else {
						console.log(response.msg);
					}
				},
				error: function (response) {
					console.log(response);
				},
			});
		});
	});

	$("#btn_nueva_reserva").on("click", async function () {
		await cargarClientes().then(()=>{
			var hoy = getFechaHora().fecha;
			var ahora = getFechaHora().hora.substring(0, 5);
			$("#modal_nueva_reserva #fecha").val(hoy);
			$("#modal_nueva_reserva #hora").val(ahora);
			$("#modal_nueva_reserva #fechaHasta").val(hoy);
			$("#modal_nueva_reserva #finSemana").prop("checked", true);
			$("#modal_nueva_reserva #origen").val("");
			$("#modal_nueva_reserva #destino").val("");
			$("#modal_nueva_reserva #observa").val("");
			$("#modal_nueva_reserva #idReserva").val("Agregar");
			$("#modal_nueva_reserva").modal("show");
		});
	});

	$("#btn_cancelar_reserva").on("click", function () {
		let tr = $("#tabla_reservas tbody tr.table-active");
		let idReserva = tr[0].childNodes[5].childNodes[0].value;
		alertify.confirm(
			"Cancelar",
			"Cancelar la reserva seleccionada?",
			function () {
				cancelarReserva(idReserva);
			},
			function () {
				alertify.error("No cancelado");
			}
		);
	});

	$("#btn_asignar_viaje").on("click", function () {
		let tr = $("#tabla_reservas tbody tr.table-active");
		let servicio = $("#menu-servicios li a.active");
		if (tr.length !== 0 && servicio.length !== 0) {
			let reserva = tr[0].childNodes[5].childNodes[0].value;
			let servicioActivo = servicio[0].id;
			asignarReserva(reserva, servicioActivo);
		}
	});

	$("#modal_nueva_reserva #guardar").on("click", function () {
		var idCliente = $("#modal_nueva_reserva .cmbCliente").val();
		var fecha = $("#modal_nueva_reserva #fecha").val();
		var hora = $("#modal_nueva_reserva #hora").val();
		var fechaH = $("#modal_nueva_reserva #fechaHasta").val();
		var finSemana = $("#modal_nueva_reserva #finSemana").prop("checked");
		var origen = $("#modal_nueva_reserva #origen").val();
		var destino = $("#modal_nueva_reserva #destino").val();
		var observa = $("#modal_nueva_reserva textarea#observa").val();
		var idReserva = $("#modal_nueva_reserva #idReserva").val();
		var valido = 0;
		valido =
			validarOrigen(origen) +
			validarFechaHasta(fecha, fechaH) +
			validarFecha(fecha) +
			validarHora(fecha, hora);
		if (valido == 0) {
			if (idReserva === "Agregar") {
				agendarNuevaReserva(
					idCliente,
					fecha,
					hora,
					fechaH,
					finSemana,
					origen,
					destino,
					observa
				);
			} else {
				actualizarReserva(
					idReserva,
					idCliente,
					fecha,
					hora,
					origen,
					destino,
					observa
				);
			}

			$("#modal_nueva_reserva").modal("hide");
		}
	});

	$("#modal_nueva_reserva").on("hide.bs.modal", function () {
		$("#origen").removeClass("is-valid is-invalid");
		$("#fecha").removeClass("is-valid is-invalid");
		$("#hora").removeClass("is-valid is-invalid");
		$("#fechaHasta").removeClass("is-valid is-invalid");
		$("#modal_nueva_reserva .modal-body #fechaHasta").prop("disabled", false);
		$("#modal_nueva_reserva .modal-body #finSemana").prop("disabled", false);
	});

	$("#menu-servicios").on("click", "li a", function () {
		$("#menu-servicios li a").removeClass("active");
		$(this).addClass("active");
		let idServicio = $(this).prop("id");
		ObtenerViajes(idServicio);
	});

	$("#tabla_viajes tbody").on("click", "tr", function () {
		$("#tabla_viajes tbody tr").removeClass("table-active");
		$(this).addClass("table-active");
	});

	$("#tabla_viajes tbody").on("dblclick", "tr", async function () {
		$("#tabla_viajes tbody tr").removeClass("table-active");
		$(this).addClass("table-active");
		let idViaje = $(this)[0].childNodes[6].childNodes[0].value;
		await cargarClientes().then(()=>{
			$.ajax({
				type: "POST",
				url: "scripts/apiviajes.php",
				data: { param: 5, idViaje: idViaje },
				dataType: "json",
				success: function (response) {
					if (response.exito) {
						let viaje = response[0];
						$("#modal_nuevo_viaje .modal-body #fecha").val(viaje.fecha);
						$("#modal_nuevo_viaje .modal-body #hora").val(viaje.hora);
						$("#modal_nuevo_viaje .modal-body #origen").val(viaje.origen);
						$("#modal_nuevo_viaje .modal-body #destino").val(viaje.destino);
						$("#modal_nuevo_viaje .modal-body #horaLibre").val(viaje.horaLibre);
						$("#modal_nuevo_viaje .modal-body #importe").val(viaje.importe);
						$("#modal_nuevo_viaje .modal-body #observa").val(viaje.observa);
						$("#modal_nuevo_viaje .modal-body .cmbCliente").val(viaje.idCliente);
						$("#modal_nuevo_viaje .modal-body #idViaje").val(viaje.idViaje);
						$("#modal_nuevo_viaje").modal("show");
					} else {
						console.log(response.msg);
					}
				},
				error: function (response) {
					console.log(response);
				},
			});
		});
	});

	$("#btn-nuevo-viaje").on("click", async function () {
	await cargarClientes().then(()=>{
		var hoy = getFechaHora().fecha;
		var ahora = getFechaHora().hora.substring(0, 5);
		$("#modal_nuevo_viaje #fecha").val(hoy);
		$("#modal_nuevo_viaje #hora").val(ahora);
		$("#modal_nuevo_viaje #origen").val("");
		$("#modal_nuevo_viaje #destino").val("");
		$("#modal_nuevo_viaje #observa").val("");
		$("#modal_nuevo_viaje #horaLibre").val("");
		$("#modal_nuevo_viaje #importe").val("");
		$("#modal_nuevo_viaje #idViaje").val("Agregar");
		$("#modal_nuevo_viaje").modal("show");
	});
	});

	$("#modal_nuevo_viaje #btn-guardar-viaje").on("click", function () {
		var idCliente = $("#modal_nuevo_viaje .cmbCliente").val();
		var fecha = $("#modal_nuevo_viaje #fecha").val();
		var hora = $("#modal_nuevo_viaje #hora").val();
		var origen = $("#modal_nuevo_viaje #origen").val();
		var destino = $("#modal_nuevo_viaje #destino").val();
		var horaLibre = $("#modal_nuevo_viaje #horaLibre").val();
		var importe = $("#modal_nuevo_viaje #importe").val();
		var observa = $("#modal_nuevo_viaje textarea#observa").val();
		var idViaje = $("#modal_nuevo_viaje #idViaje").val();
		var idServicio = $("#menu-servicios li a.active").prop("id");
		var valido = 0;
		valido = validarOrigen(origen);
		if (valido == 0) {
			if (idViaje === "Agregar") {
				nuevoViaje(
					idCliente,
					fecha,
					hora,
					origen,
					destino,
					idServicio,
					horaLibre,
					importe,
					observa
				);
			} else {
				actualizarViaje(
					idViaje,
					idCliente,
					fecha,
					hora,
					origen,
					destino,
					idServicio,
					horaLibre,
					importe,
					observa
				);
			}

			$("#modal_nuevo_viaje").modal("hide");
		}
	});

	$("#modal_nuevo_viaje").on("hide.bs.modal", function () {
		$(".origen").removeClass("is-valid is-invalid");
		$(".fecha").removeClass("is-valid is-invalid");
		$("#hora").removeClass("is-valid is-invalid");
	});

	$("#btn-cancelar-viaje").on("click", function () {
		let tr = $("#tabla_viajes tbody tr.table-active");
		let idViaje = tr[0].childNodes[6].childNodes[0].value;
		alertify.confirm(
			"Cancelar",
			"Cancelar el viaje seleccionado?",
			function () {
				cancelarViaje(idViaje);
			},
			function () {
				alertify.error("No cancelado");
			}
		);
	});

	$("#btn-informe-turno").on("click", function () {
		imprimirInforme();
	});

	$("#tabla_base tbody").on("dblclick", "tr", function () {
		let idServicio = $(this.childNodes[2].childNodes[0]).val();
		$("#menu-servicios li a").removeClass("active");
		$("#menu-servicios li a#" + idServicio).addClass("active");
		ObtenerViajes(idServicio);
		closeNav();
	});
	$("#tabla_zona1 tbody").on("dblclick", "tr", function () {
		let idServicio = $(this.childNodes[2].childNodes[0]).val();
		$("#menu-servicios li a").removeClass("active");
		$("#menu-servicios li a#" + idServicio).addClass("active");
		ObtenerViajes(idServicio);
		closeNav();
	});

	$("#tabla_zona2 tbody").on("dblclick", "tr", function () {
		let idServicio = $(this.childNodes[2].childNodes[0]).val();
		$("#menu-servicios li a").removeClass("active");
		$("#menu-servicios li a#" + idServicio).addClass("active");
		ObtenerViajes(idServicio);
		closeNav();
	});
});

// FUNCIONES DE RESERVA

function listarReservas(fecha) {
	$.ajax({
		type: "POST",
		url: "scripts/apireservas.php",
		data: { param: 1, fecha: fecha },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				llenarTablaReservas(response[0]);
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function llenarTablaReservas(reservas) {
	$("#tabla_reservas tbody").html("");
	reservas.forEach((reserva) => {
		agregarFilaReserva(reserva);
	});
	verificarAlarma();
}

function agregarFilaReserva(reserva) {
	$("#tabla_reservas tbody").append(
		"<tr>" +
			"<td>" +
			(reserva.ayn == null ? "" : reserva.ayn) +
			"</td>" +
			"<td>" +
			reserva.origen +
			"</td>" +
			"<td>" +
			(reserva.destino == null ? "" : reserva.destino) +
			"</td>" +
			"<td>" +
			reserva.fecha +
			"</td>" +
			"<td>" +
			reserva.hora +
			"</td>" +
			"<td>" +
			"<input type='hidden' value='" +
			reserva.idReserva +
			"'>" +
			"</td>" +
			"</tr>"
	);
}

function agendarNuevaReserva(
	idCliente,
	fecha,
	hora,
	fechah,
	finSemana,
	origen,
	destino,
	observa
) {
	$.ajax({
		type: "POST",
		url: "scripts/apireservas.php",
		data: {
			param: 2,
			idCliente: idCliente,
			fecha: fecha,
			hora: hora,
			fechah: fechah,
			finSemana: finSemana,
			origen: origen,
			destino: destino,
			observa: observa,
		},
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				listarReservas(getFechaHora().fecha);
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function actualizarReserva(
	idReserva,
	idCliente,
	fecha,
	hora,
	origen,
	destino,
	observa
) {
	$.ajax({
		type: "POST",
		url: "scripts/apireservas.php",
		data: {
			param: 5,
			idReserva: idReserva,
			idCliente: idCliente,
			fecha: fecha,
			hora: hora,
			origen: origen,
			destino: destino,
			observa: observa,
		},
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				listarReservas(
					getFechaHora($("#calendario").datepicker("getDate")).fecha
				);
				alertify.success("Reserva Actualizada");
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function cancelarReserva(idReserva) {
	$.ajax({
		type: "POST",
		url: "scripts/apireservas.php",
		data: { param: 3, idReserva: idReserva },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				listarReservas(
					getFechaHora($("#calendario").datepicker("getDate")).fecha
				);
				alertify.success("Reserva Cancelada");
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function asignarReserva(idReserva, idServicio) {
	$.ajax({
		type: "POST",
		url: "scripts/apireservas.php",
		data: { param: 6, idReserva: idReserva },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				listarReservas(
					getFechaHora($("#calendario").datepicker("getDate")).fecha
				);
				asignarViaje(response[0], idServicio);
				alertify.success("Viaje asignado");
			} else {
				response.msg;
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

// FUNCIONES DE VIAJES

function listarServiciosActivos() {
	$.ajax({
		type: "POST",
		url: "scripts/apiservicios.php",
		data: { param: 1 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				if (response[0].length !== 0) {
					llenarServicios(response[0]);
					$("#menu-servicios a#" + response[0][0].idServicio).addClass(
						"active"
					);
					ObtenerViajes(response[0][0].idServicio);
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

function llenarServicios(servicios) {
	$("#menu-servicios").html("");
	servicios.forEach((servicio) => {
		$("#menu-servicios").append(
			"<li class='nav-item text-truncate'>" +
				"<a class='nav-link' href='#' id='" +
				servicio.idServicio +
				"'>" +
				servicio.idVehiculos +
				" (" +
				servicio.ayn +
				")</a>" +
				"</li>"
		);
	});
}

function ObtenerViajes(idServicio) {
	$.ajax({
		type: "POST",
		url: "scripts/apiviajes.php",
		data: { param: 1, idServicio: idServicio },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				$("#tabla_viajes tbody").html("");
				if (response[0].length !== 0) {
					llenarTablaViajes(response[0]);
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

function llenarTablaViajes(viajes) {
	let total = 0;
	viajes.forEach((viaje) => {
		total += viaje.importe == null ? 0 : parseFloat(viaje.importe);
		$("#tabla_viajes tbody").append(
			"<tr" +
				(viaje.idCliente !== 0 ? " class='bg-success'" : "") +
				">" +
				"<td>" +
				viaje.hora +
				"</td>" +
				"<td>" +
				(viaje.horaLibre == null ? "" : viaje.horaLibre) +
				"</td>" +
				"<td>" +
				viaje.origen +
				"</td>" +
				"<td>" +
				(viaje.destino == null ? "" : viaje.destino) +
				"</td>" +
				"<td class='text-right'>" +
				(viaje.importe == null ? "" : viaje.importe) +
				"</td>" +
				"<td class='text-right'>" +
				total +
				"</td>" +
				"<td>" +
				"<input type='hidden' value='" +
				viaje.idViaje +
				"'>" +
				"</td>" +
				"</tr>"
		);
	});
}

function asignarViaje(oReserva, idServicio) {
	let fecha = getFechaHora().fecha,
		hora = getFechaHora().hora.substring(0, 5);
	$.ajax({
		type: "POST",
		url: "scripts/apiviajes.php",
		data: {
			param: 2,
			fecha: fecha,
			hora: hora,
			idCliente: oReserva.idCliente,
			origen: oReserva.origen,
			destino: oReserva.destino,
			observa: oReserva.observa,
			idReserva: oReserva.idReserva,
			idServicio: idServicio,
		},
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				ObtenerViajes(idServicio);
				// quitarPila(idServicio);
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function nuevoViaje(
	idCliente,
	fecha,
	hora,
	origen,
	destino,
	idServicio,
	horaLibre,
	importe,
	observa
) {
	$.ajax({
		type: "POST",
		url: "scripts/apiviajes.php",
		data: {
			param: 3,
			idCliente: idCliente,
			fecha: fecha,
			hora: hora,
			origen: origen,
			destino: destino,
			idServicio: idServicio,
			horaLibre: horaLibre,
			importe: importe,
			observa: observa,
		},
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				ObtenerViajes(idServicio);
				// quitarPila(idServicio);
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function actualizarViaje(
	idViaje,
	idCliente,
	fecha,
	hora,
	origen,
	destino,
	idServicio,
	horaLibre,
	importe,
	observa
) {
	$.ajax({
		type: "POST",
		url: "scripts/apiviajes.php",
		data: {
			param: 6,
			idViaje: idViaje,
			idCliente: idCliente,
			fecha: fecha,
			hora: hora,
			origen: origen,
			destino: destino,
			horaLibre: horaLibre,
			importe: importe,
			observa: observa,
		},
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				ObtenerViajes(idServicio);
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function cancelarViaje(idViaje) {
	$.ajax({
		type: "POST",
		url: "scripts/apiviajes.php",
		data: { param: 4, idViaje: idViaje },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				let servicio = $("#menu-servicios li a.active");
				let idServicio = servicio[0].id;
				ObtenerViajes(idServicio);
				alertify.success("Viaje Cancelado");
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function imprimirInforme() {
	let servicio = $("#menu-servicios li a.active");
	let idServicio = servicio[0].id;
	let textoServicio = servicio.text();
	let movil = textoServicio.split(" ", 1);
	let chofer = textoServicio.substring(
		movil.length + 2,
		textoServicio.length - 1
	);
	let fecha = getFechaHora();
	$.ajax({
		type: "POST",
		url: "scripts/apiviajes.php",
		data: { param: 1, idServicio: idServicio },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				if(response.encontrados>0){
					generarInformePDF(response[0], movil, chofer, fecha);
				}else{
					alertify.error('No se encontraron viajes para este servicio');
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



//FUNCIONES GENERALES

function cargarClientes() {
	return new Promise((exito)=>{
		$.ajax({
			type: "POST",
			url: "scripts/apiclientes.php",
			data: { param: 1 },
			dataType: "json",
			success: function (response) {
				if (response.exito) {
					llenarSelectClientes(response[0]);
					exito(response.exito);
				} else {
					console.log(response.msg);
					exito(response.exito)
				}
			},
			error: function (response) {
				console.log(response);
				exito(false);
			},
		});
	});
}

function llenarSelectClientes(clientes) {
	$(".cmbCliente").html("");
	$(".cmbCliente").append(
		$("<option>" + "Seleccionar Cliente" + "</option>").val(0)
	);
	clientes.forEach((cliente) => {
		$(".cmbCliente").append(
			$("<option>" + cliente.ayn + "</option>").val(cliente.idClientes)
		);
	});
}

function actualizarFecha() {
	if ($("#diaSemana")) {
		var fecha = new Date(),
			horas = fecha.getHours(),
			ampm,
			minutos = fecha.getMinutes(),
			segundos = fecha.getSeconds(),
			diaSemana = fecha.getDay(),
			dia = fecha.getDate(),
			mes = fecha.getMonth(),
			year = fecha.getFullYear();

		var pHoras = document.getElementById("horas"),
			pAMPM = document.getElementById("ampm"),
			pMinutos = document.getElementById("minutos"),
			pSegundos = document.getElementById("segundos"),
			pDiaSemana = document.getElementById("diaSemana"),
			pDia = document.getElementById("dia"),
			pMes = document.getElementById("mes"),
			pYear = document.getElementById("year");

		var semana = [
			"Domingo",
			"Lunes",
			"Martes",
			"Miercoles",
			"Jueves",
			"Viernes",
			"Sabado",
		];
		pDiaSemana.textContent = semana[diaSemana];

		pDia.textContent = dia;

		var meses = [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		];
		pMes.textContent = meses[mes];

		pYear.textContent = year;

		if (horas >= 12) {
			horas -= 12;
			ampm = "PM";
		} else {
			ampm = "AM";
		}

		if (horas == 0) {
			horas = 12;
		}

		pHoras.textContent = horas.toString().padStart(2, 0);

		pAMPM.textContent = ampm;

		pMinutos.textContent = minutos.toString().padStart(2, 0);

		pSegundos.textContent = segundos.toString().padStart(2, 0);

		if (
			getFechaHora(fecha).fecha ===
			getFechaHora($("#calendario").datepicker("getDate")).fecha
		) {
			if (segundos == 0) {
				verificarAlarma();
			}
		}
	} else {
		clearInterval(relojConsola);
	}
}

function verificarAlarma() {
	let horaAhora = new Date();
	if (
		getFechaHora(horaAhora).fecha ===
		getFechaHora($("#calendario").datepicker("getDate")).fecha
	) {
		let trs = $("#tabla_reservas tbody tr");
		let alarma;
		if (trs.length !== 0) {
			let trLength = trs.length;
			for (let i = 0; i < trLength; i++) {
				let trHoraReserva = trs[i].childNodes[4].innerText;
				let fechaHoraReserva = new Date();
				fechaHoraReserva.setHours(
					trHoraReserva.split(":")[0],
					trHoraReserva.split(":")[1],
					00
				);
				if (horaAhora <= fechaHoraReserva) {
					let difmin = Math.round((fechaHoraReserva - horaAhora) / 1000 / 60);
					if (difmin <= timerAlarma / 4) {
						$(trs[i]).removeClass("table-danger table-warning");
						$(trs[i]).addClass("bg-danger");
						alarma = new Audio("media/alarma3.mp3");
						alarma.play();
					} else if (difmin <= timerAlarma / 2) {
						$(trs[i]).removeClass("table-warning");
						$(trs[i]).addClass("table-danger");
						alarma = new Audio("media/alarma2.mp3");
						alarma.play();
					} else if (difmin <= timerAlarma) {
						$(trs[i]).addClass("table-warning");
						alarma = new Audio("media/alarma1.mp3");
						alarma.play();
					}
				} else {
					$(trs[i]).addClass("bg-danger");
				}
			}
		}
	}
}
// FUNCIONES DE VALIDACION

function validarOrigen(origen) {
	if (origen == "" || origen == "null" || origen == "undefined") {
		$(".origen").addClass("is-invalid");
		alertify.error("El campo origen no puede estar vacio");
		$(".origen").on("input", function () {
			if ($(this).val() == "") {
				$(this).removeClass("is-valid");
				$(this).addClass("is-invalid");
			} else {
				$(this).addClass("is-valid");
				$(this).removeClass("is-invalid");
			}
		});
		return 1;
	} else {
		return 0;
	}
}

function validarFechaHasta(fecha, fechaH) {
	if (fechaH < fecha) {
		$("#fechaHasta").addClass("is-invalid");
		alertify.error("La fecha hasta no puede ser inferior a la fecha desde");
		$("#fechaHasta").on("change", function () {
			if ($(this).val() >= $("#fecha").val()) {
				$(this).addClass("is-valid");
				$(this).removeClass("is-invalid");
			} else {
				$(this).removeClass("is-valid");
				$(this).addClass("is-invalid");
			}
		});
		return 1;
	} else {
		return 0;
	}
}

function validarFecha(fecha) {
	let hoy = getFechaHora().fecha;
	if (fecha < hoy) {
		$("#fecha").addClass("is-invalid");
		alertify.error(
			"La fecha de la reserva no puede ser anterior al día actual"
		);
		$("#fecha").on("change", function () {
			if ($(this).val() < getFechaHora().fecha) {
				$(this).removeClass("is-valid");
				$(this).addClass("is-invalid");
			} else {
				$(this).addClass("is-valid");
				$(this).removeClass("is-invalid");
			}
		});
		return 1;
	} else {
		return 0;
	}
}

function validarHora(fecha, hora) {
	if (fecha == getFechaHora().fecha) {
		if (hora < getFechaHora().hora) {
			$("#hora").addClass("is-invalid");
			alertify.error("La hora no puede ser anterior a la hora actual");
			$("#hora").on("change", function () {
				if (
					$(this).val() < getFechaHora().hora &&
					$("#fecha").val() == getFechaHora().fecha
				) {
					$(this).removeClass("is-valid");
					$(this).addClass("is-invalid");
				} else {
					$(this).removeClass("is-invalid");
					$(this).addClass("is-valid");
				}
			});
			return 1;
		}
	}
	return 0;
}

function openNav() {
	$("#tabla_base tbody").html("");
	$("#tabla_zona1 tbody").html("");
	$("#tabla_zona2 tbody").html("");
	$.ajax({
		type: "POST",
		url: "scripts/apipila.php",
		data: { param: 1 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				if (response.encontrados > 0) {
					let ordenBase = 1,
						ordenZona1 = 1,
						ordenZona2 = 1;
					response[0].forEach((servicio) => {
						if (servicio.pila === 1) {
							$("#tabla_base tbody").append(
								"<tr>" +
									"<td>" +
									ordenBase +
									"</td>" +
									"<td>" +
									servicio.idVehiculo +
									" (" +
									servicio.ayn +
									")" +
									"</td>" +
									"<td>" +
									"<input type='hidden' value='" +
									servicio.idServicio +
									"'>" +
									"</td>" +
									"</tr>"
							);
							ordenBase++;
						} else if (servicio.pila === 2) {
							$("#tabla_zona1 tbody").append(
								"<tr>" +
									"<td>" +
									ordenZona1 +
									"</td>" +
									"<td>" +
									servicio.idVehiculo +
									" (" +
									servicio.ayn +
									")" +
									"</td>" +
									"<td>" +
									"<input type='hidden' value='" +
									servicio.idServicio +
									"'>" +
									"</td>" +
									"</tr>"
							);
							ordenZona1++;
						} else if (servicio.pila === 3) {
							$("#tabla_zona2 tbody").append(
								"<tr>" +
									"<td>" +
									ordenZona2 +
									"</td>" +
									"<td>" +
									servicio.idVehiculo +
									" (" +
									servicio.ayn +
									")" +
									"</td>" +
									"<td>" +
									"<input type='hidden' value='" +
									servicio.idServicio +
									"'>" +
									"</td>" +
									"</tr>"
							);
							ordenZona2++;
						}
					});
					document.getElementById("mySidenav").style.height = "250px";
					document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
				} else {
					alertify.error("No se encontraron resultados para mostrar");
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

function closeNav() {
	document.getElementById("mySidenav").style.height = "0";
	document.body.style.backgroundColor = "white";
}

function setearAlarma(){
	$.ajax({
		type:'POST',
		url: 'scripts/apiparametros.php',
		data: {param:'alarma'},
		dataType: 'json',
		success: function(response){
			if(response.exito){
				timerAlarma = response.alarma;
			}
		}
	});
}