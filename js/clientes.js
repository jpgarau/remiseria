var cuitClientes = new Array(),
	dniClientes = new Array(),
	dniPersonas = new Array(),
	cuitActual,
	dniActual,
	idClienteActual = 0;

$(document).ready(function () {
	cargarCuitClientes();
	cargarDniClientes();
	cargarDniPersonas();
    listar();

	$("#addcliente").on("click", function () {
		cuitActual = null;
		$("#adm_clientes .modal-title").text("Agregar Cliente");
		$("#adm_clientes .modal-body input#apynom").val("");
		$("#adm_clientes .modal-body input#direccion").val("");
		$("#adm_clientes .modal-body #idlocalidad").val(
			$("#idlocalidad option").val()
		);
		$("#adm_clientes .modal-body input#telefono").val("");
		$("#adm_clientes .modal-body #cmbDoc").val($("#cmbDoc option").val());
		$("#adm_clientes .modal-body input#numdni").val("");
		$("#adm_clientes .modal-body input#numdni").prop("disabled", false);
		$("#adm_clientes .modal-body input#email").val("");
		$("#adm_clientes .modal-body input#fecnac").val("");
		$("#adm_clientes .modal-body #cmbIva").val($("#cmbIva option").val());
		$("#adm_clientes .modal-body input#cuit").val("");
		$("#adm_clientes .modal-body #observaciones").val("");
		$("#adm_clientes .modal-body #cmbTelegram").val(0);
		$("#adm_clientes .modal-body input#idclientes").val("Agregar");
		$("#adm_clientes").modal("show");
	});

	$("#cmbIva").on("change", function () {
		if ($(this).val() != 1){
			$("#cmbDoc").val(4);
			$("#cuit").prop({minlength:"11", required:"true", maxlength:"13"});
		}else{
			$("#cmbDoc").val(1);
			$("#cuit").prop('required',false);
			$("#cuit").removeClass("is-valid is-invalid");
		}

	});
	$("#cuit").on("input", function(){
		validaCuit($(this).val());
	});

	$("#numdni").on("input", function () {
		validarNumdni($(this).val());
	});
    
    $("#tabla_clientes tbody").on("click", ".btn_editar", function (event) {
		$("#adm_clientes .modal-title").text("Modificar Cliente");
		var boton = $(event.currentTarget);
		var idclientes = boton[0].parentNode.parentNode.childNodes[6].value;
		$.ajax({
			type: "POST",
			url: "scripts/apiclientes.php",
			data: { param: 5, idClientes: idclientes },
			dataType: "json",
			success: function (response) {
				var cuit = response[0].cuit;
				cuitActual = cuit;
				if(cuit!=null){
					cuit = cuit.replace(/([0-9]{2})([0-9]{8})([0-9])/,"$1-$2-$3");
				}
				$("#adm_clientes .modal-body input#apynom").val(response[0].ayn);
				$("#adm_clientes .modal-body input#direccion").val(
					response[0].domicilio
				);
				$("#adm_clientes .modal-body #idlocalidad").val(
					response[0].idlocalidad
				);
				$("#adm_clientes .modal-body input#telefono").val(response[0].telefono);
				$("#adm_clientes .modal-body #cmbDoc").val(response[0].tipodoc);
				$("#adm_clientes .modal-body input#numdni").val(response[0].nrodoc);
				dniactual=response[0].nrodoc;
				$("#adm_clientes .modal-body input#email").val(response[0].email);
				$("#adm_clientes .modal-body input#fecnac").val(response[0].nacido);
				$("#adm_clientes .modal-body #cmbIva").val(response[0].iva);
				$("#adm_clientes .modal-body input#cuit").val(cuit);
				$("#adm_clientes .modal-body #observaciones").val(response[0].observa);
				$("#adm_clientes .modal-body #cmbTelegram").val(response[0].telid==null?0:response[0].telid);
				$("#adm_clientes .modal-body input#idclientes").val(idclientes);
				$("#adm_clientes").modal("show");
			},
			error: function (response) {
				console.log(response);
			},
		});
	});

	$("#tabla_clientes tbody").on("click",".btn_borrar", function(){
		confirmarBorrado(this);
    });
    
    $("#guardar").on("click", function () {
		var apynom = $("#apynom").val();
		var direccion = $("#direccion").val();
		var idlocalidad = $("#idlocalidad").val();
		var telefono = $("#telefono").val();
		var cmbDoc = $("#cmbDoc").val();
		var numdni = $("#numdni").val();
		var email = $("#email").val();
		var fecnac = $("#fecnac").val();
		var cmbIva = $("#cmbIva").val();
		var cuit = $("#cuit").val();
		cuit=cuit.toString().replace(/[-_]/g, "");
		var observaciones = $("#observaciones").val();
		var telid = $("#cmbTelegram").val();
		var idclientes = $("#idclientes").val();
		var valido = 0;
		valido = validarApynom(apynom) + validaCuit(cuit);
		if (valido == 0) {
			if (idclientes == "Agregar") {
				agregarClientes(
					apynom,
					direccion,
					idlocalidad,
					telefono,
					cmbDoc,
					numdni,
					email,
					fecnac,
					cmbIva,
					observaciones,
					cuit,
					telid
				);
			} else {
				if ($("#numdni").prop("disabled")) {
					vincularCliente(idclientes);
					$("#numdni").prop("disabled",false);
				}
				actualizarCliente(
					apynom,
					direccion,
					idlocalidad,
					telefono,
					cmbDoc,
					numdni,
					email,
					fecnac,
					cmbIva,
					cuit,
					observaciones,
					telid,
					idclientes
				);
			}
			$("#adm_clientes").modal("hide");
		}
    });
	$("#adm_clientes").on("hide.bs.modal", function(){
		$("#apynom").removeClass("is-invalid is-valid");
		$("#cuit").removeClass("is-valid is-invalid");
		$("#numdni").removeClass("is-valid is-invalid");
		$("#cuit").prop("required", false);
		$("#numdni").prop("disabled",false);
	});
	$("#adm_clientes").on("shown.bs.modal", function(){
		$("#apynom").focus();
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
			buscar == ""
		) {
			$(registros[i]).show();
		}
	}
}

function listar(){
    $.ajax({
        type:"POST",
        url:"scripts/apiclientes.php",
        data:{param:1},
        dataType:"json",
        success: function(response){
            if(response.exito){
                llenarTabla(response[0]);
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

function llenarTabla(respuesta) {
	respuesta.forEach((renglon) => {
		cargarFila(renglon);
	});
}

function cargarFila(objeto) {
	$("#tabla_clientes").append(
		"<tr>" +
			"<td>" +
			objeto.ayn +
			"</td>" +
			"<td>" +
			objeto.telefono +
			"</td>" +
			"<td>" +
			objeto.domicilio +
			"</td>" +
			"<td>" +
			objeto.email +
			"</td>" +
			"<td>" +
			"<button class='btn btn-sm btn-dark btn_editar' title='Modificar' data-toggle='modal'><i class='fas fa-edit'></i></button>" +
			"</td>" +
			"<td>" +
			"<button class='btn btn-sm btn-danger btn_borrar' title='Eliminar'><i class='fas fa-trash-alt'></i></button>" +
			"</td>" +
			"<input type='hidden' value='" +
			objeto.idClientes +
			"'>" +
			"</tr>"
	);
}

function agregarClientes(
	apynom,
	direccion,
	idlocalidad,
	telefono,
	cmbDoc,
	numdni,
	email,
	fecnac,
	cmbIva,
	observaciones,
	telid,
	cuit
) {
	if (cuit!=""){
		cuit = parseInt(cuit.toString().replace(/[-_]/g, ""));
	}
	$.ajax({
		type: "POST",
		url: "scripts/apiclientes.php",
		data: {
			param: 2,
			ayn: apynom,
			domicilio: direccion,
			idlocalidad: idlocalidad,
			telefono: telefono,
			tipodoc: cmbDoc,
			nrodoc: numdni,
			email: email,
			nacido: fecnac,
			iva: cmbIva,
			observa: observaciones,
			telid: telid,
			cuit: cuit
		},
		dataType: "json",
		success: function (response) {
			if (response.exito == true) {
				var ocliente = {
					ayn: apynom,
					domicilio: direccion,
					telefono: telefono,
					email: email,
					idClientes: response.idPersona,
				};
				cargarFila(ocliente);
				alertify.success("Agregado " + apynom);
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

function actualizarCliente(
	apynom,
	direccion,
	idlocalidad,
	telefono,
	cmbDoc,
	numdni,
	email,
	fecnac,
	cmbIva,
	cuit,
	observaciones,
	telid,
	idClientes
) {
	if (cuit!=""){
		cuit = parseInt(cuit.toString().replace(/[-_]/g, ""));
	}
	$.ajax({
		type: "POST",
		url: "scripts/apiclientes.php",
		data: {
			param: 3,
			ayn: apynom,
			domicilio: direccion,
			idlocalidad: idlocalidad,
			telefono: telefono,
			tipodoc: cmbDoc,
			nrodoc: numdni,
			email: email,
			nacido: fecnac,
			iva: cmbIva,
			cuit: cuit,
			observa: observaciones,
			telid: telid,
			idClientes: idClientes,
		},
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				alertify.success("Actualizado con Exito");
				actualizarFila({
					apynom: apynom,
					domicilio: direccion,
					telefono: telefono,
					email: email,
					idClientes: idClientes,
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
	var input = $("input[value='"+objeto.idClientes+"']");
	if(input[1]){
	input[1].parentNode.childNodes[0].innerText=objeto.apynom;
	input[1].parentNode.childNodes[1].innerText=objeto.telefono;
	input[1].parentNode.childNodes[2].innerText=objeto.domicilio;
	input[1].parentNode.childNodes[3].innerText=objeto.email;
	}else{
		listar();
	}
}

function confirmarBorrado(botonBorrar){
	var idcliente = botonBorrar.parentNode.parentNode.childNodes[6].value;
	var trBorrar = botonBorrar.parentNode.parentNode;
	alertify.confirm('Eliminar', "Esta seguro que desea eliminarlo?", function(){
		borrarCliente(idcliente, trBorrar);
	},function(){
		alertify.error('Cancelado');
	});
}

function borrarCliente(idcliente, trBorrar){
	$.ajax({
		type:"POST",
		url:"scripts/apiclientes.php",
		data:{"param":4,
				"idClientes":idcliente},
		dataType:"json",
		success: function(response){
			if(response.exito){
				eliminarFila(trBorrar);
				alertify.success('Eliminado');
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

function validarApynom(apynom) {
	if (apynom == "") {
		$("#apynom").addClass("is-invalid");
		alertify.error("Apellido y Nombre no puede estar vacio");
		$("#apynom").on("input", function () {
			if ($(this).val() == "") {
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

function validaCuit(cuit){
	var cuit=cuit.toString().replace(/[-_]/g, "");
	if($("#cmbIva").val()==1 && cuit==''){
		$("#cuit").removeClass("is-valid is-invalid");
		$("#cuit").prop("required",false);
		return 0;
	}else{
		if(cuit.length!=11 || !validarCuit(cuit) || cuitClientes.includes(cuit)){
			if(cuit.length==11){
				if (validarCuit(cuit)){
					if(cuitClientes.includes(cuit)){
						if(cuit==cuitActual && $("#idclientes").val()!="Agregar"){
							$("#cuit").removeClass("is-invalid");
							$("#cuit").addClass("is-valid");
							return 0;
						}else{
							$("#errorCuit").text("El número de CUIT ya esta asignado en otro cliente");
							$("#cuit").removeClass("is-valid");
							$("#cuit").addClass("is-invalid");
						}
					}else{
						$("#cuit").removeClass("is-invalid");
						$("#cuit").addClass("is-valid");
					}
				}else{
					$("#errorCuit").text("El número de CUIT es invalido, compruebelo");
					$("#cuit").removeClass("is-valid");
					$("#cuit").addClass("is-invalid");
				}
			}else{
				$("#errorCuit").text("El número de CUIT tiene 11 posiciones separadas con - . Por ejemplo:44-44444444-1");
				$("#cuit").removeClass("is-valid");
				$("#cuit").addClass("is-invalid");
			}
			return 1;
		}else{
			$("#cuit").removeClass("is-invalid");
			$("#cuit").addClass("is-valid");
			return 0;
		}
	}
}

function validarCuit(cuit){
	if(typeof(cuit)=='undefined' || cuit==""){
		return true;
	}
	if(cuit.length!=11){
		return false;
	}else{
		var mult = [5,4,3,2,7,6,5,4,3,2];
		var total = 0;
		for (var i=0; i<mult.length;i++){
			total += parseInt(cuit[i])*mult[i];
		}
		var mod = total%11;
		var digito = mod==0?0:mod==1?9:11-mod;
		return digito == parseInt(cuit[10]);
	}
}

function cargarCuitClientes(){
	$.ajax({
		type:"POST",
		url:"scripts/apiclientes.php",
		data:{param:6},
		dataType: "json",
		success: function(response){
			if(response.exito){
				response[0].forEach((linea)=>{
					cuitClientes.push(linea.cuit);
				});
			}else{
				console.log(response.msg);
			}
		},
		error: function(response){
			console.log(response);
		}
	});
}

function validarNumdni(numdni) {
	if (numdni == "" || typeof numdni == "undefined") {
		$("#numdni").removeClass("is-valid is-invalid");
		return 0;
	}
	if (numdni.length < 7) {
		$("#numdni").removeClass("is-valid");
		$("#numdni").addClass("is-invalid");
		$("#errorNumDni").text("El DNI no puede ser inferior a 7 caracteres");
		return 1;
	}
	if ($("#idclientes").val() == "Agregar") {
		if (dniClientes.includes(numdni)) {
			$("#numdni").removeClass("is-valid");
			$("#numdni").addClass("is-invalid");
			$("#errorNumDni").text("Este DNI pertenece a otro cliente. Verificar");
			return 1;
		} else if (dniPersonas.includes(numdni)) {
			alertify.confirm(
				"Existente",
				"Este DNI ya esta cargado. Desea traer los datos guardados?",
				function () {
					$.ajax({
						type: "POST",
						url: "scripts/apipersonas.php",
						data: { param: 6, nrodoc: numdni },
						dataType: "json",
						success: function (response) {
							var cuit = response[0].cuit;
							cuitActual = cuit;
							if (cuit != null) {
								cuit = cuit.replace(/([0-9]{2})([0-9]{8})([0-9])/, "$1-$2-$3");
							}
							$("#adm_clientes .modal-body input#apynom").val(response[0].ayn);
							$("#adm_clientes .modal-body input#direccion").val(
								response[0].domicilio
							);
							$("#adm_clientes .modal-body #idlocalidad").val(
								response[0].idlocalidad
							);
							$("#adm_clientes .modal-body input#telefono").val(
								response[0].telefono
							);
							$("#adm_clientes .modal-body #cmbDoc").val(response[0].tipodoc);
							$("#adm_clientes .modal-body input#email").val(response[0].email);
							$("#adm_clientes .modal-body input#fecnac").val(
								response[0].nacido
							);
							$("#adm_clientes .modal-body #cmbIva").val(response[0].iva);
							$("#adm_clientes .modal-body input#cuit").val(cuit);
							$("#adm_clientes .modal-body #observaciones").val(response[0].observa);
							$("#adm_clientes .modal-body #cmbTelegram").val(response[0].telid==null?0:response[0].telid);
							$("#idclientes").val(response[0].idPersonas);
							$("#numdni").prop("disabled", "yes");
						},
						error: function (response) {
							console.log(response);
						},
					});
				},
				function () {
					alertify.error("No se cargaran los datos.");
				}
			);
		}
	} else {
		if (dniClientes.includes(numdni) && numdni !== dniActual) {
			$("#numdni").removeClass("is-valid");
			$("#numdni").addClass("is-invalid");
			$("#errorNumDni").text("Este DNI pertenece a otro cliente. Verificar");
			return 1;
		}else if(dniPersonas.includes(numdni) && numdni !==dniActual){
			alertify.confirm(
				"Existente",
				"Este DNI ya esta cargado. Desea traer los datos guardados?",
				function () {
					idClientesActual = $("#adm_clientes .modal-body #idclientes").val();
					
					$.ajax({
						type: "POST",
						url: "scripts/apipersonas.php",
						data: { param: 6, nrodoc: numdni },
						dataType: "json",
						success: function (response) {
							var cuit = response[0].cuit;
							cuitActual = cuit;
							if (cuit != null) {
								cuit = cuit.replace(/([0-9]{2})([0-9]{8})([0-9])/, "$1-$2-$3");
							}
							$("#adm_clientes .modal-body input#apynom").val(response[0].ayn);
							$("#adm_clientes .modal-body input#direccion").val(
								response[0].domicilio
							);
							$("#adm_clientes .modal-body #idlocalidad").val(
								response[0].idlocalidad
							);
							$("#adm_clientes .modal-body input#telefono").val(
								response[0].telefono
							);
							$("#adm_clientes .modal-body #cmbDoc").val(response[0].tipodoc);
							$("#adm_clientes .modal-body input#email").val(response[0].email);
							$("#adm_clientes .modal-body input#fecnac").val(
								response[0].nacido
							);
							$("#adm_clientes .modal-body #cmbIva").val(response[0].iva);
							$("#adm_clientes .modal-body input#cuit").val(cuit);
							$("#adm_clientes .modal-body #observaciones").val(response[0].observa);
							$("#adm_clientes .modal-body #cmbTelegram").val(response[0].telid==null?0:response[0].telid);
							$("#idclientes").val(response[0].idPersonas);
							$("#numdni").prop("disabled", "yes");

						},
						error: function (response) {
							console.log(response);
						},
					});
				},
				function () {
					alertify.error("No se cargaran los datos.");
				}
			);
		}
	}
	$("#numdni").removeClass("is-invalid");
	$("#numdni").addClass("is-valid");
	return 0;
}

function cargarDniClientes(){
	$.ajax({
		type: "POST",
		url: "scripts/apiclientes.php",
		data: { param: 7 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				response[0].forEach((renglon) => {
					dniClientes.push(renglon.nrodoc);
				});
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function cargarDniPersonas() {
	$.ajax({
		type: "POST",
		url: "scripts/apiclientes.php",
		data: { param: 8 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				response[0].forEach((renglon) => {
					dniPersonas.push(renglon.nrodoc);
				});
			} else {
				console.log(response.msg);
			}
		},
		error: function (response) {
			console.log(response);
		},
	});
}

function vincularCliente(idClientes) {
	if(idClientesActual===0){
		$.ajax({
			type: "POST",
			url: "scripts/apiclientes.php",
			data: { param: 9, idClientes },
			dataType: "json",
			success: function (response) {
				if (response.exito) {
					var oclientes = {
						ayn: "",
						domicilio: "",
						telefono: "",
						email: "",
						idClientes,
					};
					cargarFila(oclientes);
				} else {
					alertify.error("Hubo un error");
					console.log(response.msg);
				}
			},
			error: function (response) {
				console.log(response);
			},
		});
	}else{
		$.ajax({
			type: "POST",
			url: "scripts/apiclientes.php",
			data: {param:10, idClientes, idClientesActual},
			dataType: "json",
			success: function(response){
				if(response.exito){
					$("#tabla_clientes input[value='" + idClientesActual + "']").val(idClientes);
					idClientesActual=0;
				}else{
					console.log(response.msg);
				}
			},
			error: function(response){
				console.log(response);
			}
		});
	}
}