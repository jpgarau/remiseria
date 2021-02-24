$(document).ready(function () {
	listar();
	traerPropietarios();
	$("#addvehiculo").on("click", function () {
		$("#adm_vehiculos .modal-title").text("Agregar Vehículo");
		$("#adm_vehiculos .modal-body #marca").val("");
		$("#adm_vehiculos .modal-body #anio").val("");
		$("#adm_vehiculos .modal-body #patente").val("");
		$("#adm_vehiculos .modal-body #falta").val("");
		$("#adm_vehiculos .modal-body #habilitado").prop("checked",true);
		$("#adm_vehiculos .modal-body #vtoseguro").val("");
		$("#adm_vehiculos .modal-body #titular").val($("#titular").val());
		$("#adm_vehiculos .modal-body #observa").val("");
		$("#adm_vehiculos .modal-body #idVehiculos").val("Agregar");

		$("#adm_vehiculos").modal("show");
	});

	$("#tabla_vehiculos tbody").on("click",".btn_editar", function(event){
		$("#adm_vehiculos .modal-title").text("Modificar Vehículo");
		var boton = $(event.currentTarget);
		var idVehiculos = boton[0].parentNode.parentNode.childNodes[6].value;
		$.ajax({
			type: "POST",
			url: "scripts/apivehiculos.php",
			data: {param:5, idVehiculos:idVehiculos},
			dataType: "json",
			success: function(response){
				$("#adm_vehiculos .modal-body #marca").val(response[0].marca);
				$("#adm_vehiculos .modal-body #anio").val(response[0].anio);
				$("#adm_vehiculos .modal-body #patente").val(response[0].patente);
				$("#adm_vehiculos .modal-body #falta").val(response[0].falta);
				$("#adm_vehiculos .modal-body #habilitado").prop("checked",response[0].habilita==0?false:true);
				$("#adm_vehiculos .modal-body #vtoseguro").val(response[0].vtoseguro);
				$("#adm_vehiculos .modal-body #titular").val(response[0].titular);
				$("#adm_vehiculos .modal-body #observa").val(response[0].observa);
				$("#adm_vehiculos .modal-body #idVehiculos").val(idVehiculos);
				$("#adm_vehiculos").modal("show");
			},
			error: function(response){
				console.log(response);
			}
		});
	});

	$("#tabla_vehiculos tbody").on("click", ".btn_borrar",function(){
		confirmarBorrado(this);
	});

	$("#guardar").on("click", function () {
		var marca = $("#marca").val();
		var anio = $("#anio").val();
		var patente = $("#patente").val();
		var falta = $("#falta").val();
		var habilitado = $("#habilitado").prop("checked")?1:0;
		var vtoseguro = $("#vtoseguro").val();
		var titular = $("#titular").val();
		var titularN = $("#titular option:selected").text();
		var observa = $("#observa").val();
		var idVehiculos = $("#idVehiculos").val();
		if (idVehiculos == "Agregar") {
			agregarVehiculo(
				marca,
				anio,
				patente,
				falta,
				habilitado,
				vtoseguro,
				titular,
				observa,
				titularN
			);
		} else {
			actualizarVehiculo(
				marca,
				anio,
				patente,
				falta,
				habilitado,
				vtoseguro,
				titular,
				observa,
				idVehiculos,
				titularN
			);
		}
		$("#adm_vehiculos").modal("hide");
	});
	$("#adm_vehiculos").on("shown.bs.modal", function(){
		$("#marca").focus();
	});

	$("#buscador").on("input", function () {
		ocultarTR(this.value);
	});
});

function ocultarTR(buscar) {
	var registros = $("tbody tr");
	var expresion = new RegExp(buscar, "i");

	for (let i = 0; i < registros.length; i++) {
		$(registros[i]).hide();
		if (
			registros[i].childNodes[0].textContent
				.replace(/\s/g, "")
				.search(expresion) != -1 ||
			registros[i].childNodes[3].textContent
				.replace(/\s/g, "")
				.search(expresion) != -1 ||
			buscar == ""
		) {
			$(registros[i]).show();
		}
	}
}
function listar() {
	$.ajax({
		type: "POST",
		url: "scripts/apivehiculos.php",
		data: { param: 1 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				llenarTabla(response[0]);
			} else {
				alertify.error("Hubo un error");
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function llenarTabla(respuesta) {
	respuesta.forEach((renglon) => {
		cargarFila(renglon);
	});
}

function cargarFila(objeto) {
	$("#tabla_vehiculos tbody").append(
		"<tr>" +
			"<td>" +
			objeto.marca +
			"</td>" +
			"<td>" +
			objeto.patente +
			"</td>" +
			"<td>" +
			objeto.vtoseguro +
			"</td>" +
			"<td>" +
			objeto.ayn +
			"</td>" +
			"<td>" +
			"<button class='btn btn-sm btn-dark btn_editar' title='Modificar' data-toggle='modal'><i class='fas fa-edit'></i></button>" +
			"</td>" +
			"<td>" +
			"<button class='btn btn-sm btn-danger btn_borrar' title='Eliminar'><i class='fas fa-trash-alt'></i></button>" +
			"</td>" +
			"<input type='hidden' value='" +
			objeto.idVehiculos +
			"'>" +
			"</tr>"
	);
}

function agregarVehiculo(
	marca,
	anio,
	patente,
	falta,
	habilitado,
	vtoseguro,
	titular,
	observa,
	titularN
) {
	$.ajax({
		type: "POST",
		url: "scripts/apivehiculos.php",
		data: {
			param: 2,
			marca: marca,
			anio: anio,
			patente: patente,
			falta: falta,
			habilitado: habilitado,
			vtoseguro: vtoseguro,
			titular: titular,
			observa: observa
		},
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				ovehiculo = {
					marca: marca,
					patente: patente,
					vtoseguro: vtoseguro,
					ayn: titularN,
					idVehiculos: response.idVehiculos,
				};
				cargarFila(ovehiculo);
				alertify.success("Agregado " + marca);
			} else {
				alertify.error("Hubo un error");
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function actualizarVehiculo(
	marca,
	anio,
	patente,
	falta,
	habilitado,
	vtoseguro,
	titular,
	observa,
	idVehiculos,
	titularN
) {
	$.ajax({
		type: "POST",
		url: "scripts/apivehiculos.php",
		data: {
			param: 3,
			marca: marca,
			anio: anio,
			patente: patente,
			falta: falta,
			habilitado: habilitado,
			vtoseguro: vtoseguro,
			titular: titular,
			observa: observa,
			idVehiculos: idVehiculos,
		},
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				actualizarFila({
					marca: marca,
					patente: patente,
					vtoseguro: vtoseguro,
					ayn: titularN,
					idVehiculos: idVehiculos,
				});
			} else {
				alertify.error("Hubo un error");
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function actualizarFila(objeto){
	var input = $("input[value='"+objeto.idVehiculos+"']");
	input[1].parentNode.childNodes[0].innerText=objeto.marca;
	input[1].parentNode.childNodes[1].innerText=objeto.patente;
	input[1].parentNode.childNodes[2].innerText=objeto.vtoseguro;
	input[1].parentNode.childNodes[3].innerText=objeto.ayn;
}
function confirmarBorrado(botonBorrar){
	var idVehiculos = botonBorrar.parentNode.parentNode.childNodes[6].value;
	var trBorrar = botonBorrar.parentNode.parentNode;
	alertify.confirm('Eliminar', "Esta seguro que desea eliminarlo?", function(){
		borrarVehiculo(idVehiculos, trBorrar);
	},function(){
		alertify.error('Cancelado');
	});
}

function borrarVehiculo(idVehiculos, trBorrar){
	$.ajax({
		type: "POST",
		url: "scripts/apivehiculos.php",
		data: {param:4, idVehiculos : idVehiculos},
		dataType: "json",
		success: function(response){
			if(response.exito){
				eliminarFila(trBorrar);
				alertify.success("Eliminado");
			}else{
				alertify.error("Hubo un error");
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

function traerPropietarios() {
	$.ajax({
		type: "POST",
		url: "scripts/apipropietarios.php",
		data: { param: 1 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				response[0].forEach((titular) => {
					var opTitulo = $("<option>");
					opTitulo.val(titular.idPropietario);
					opTitulo.html(titular.ayn);
					$("#titular").append(opTitulo);
				});
			} else {
				alertify.error("Hubo un error");
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}
