var cuitPropietarios = new Array();
var dniPropietarios = new Array();
var dniPersonas = new Array();
var dniActual;
var cuitActual;
var idPropietarioActual = 0;

$(document).ready(function () {
	cargarCuitPropietarios();
	cargarDniPropietarios();
	cargarDniPersonas();
    listar();

	$("#addpropietario").on("click", function () {
		cuitActual = null;
		$("#adm_propietarios .modal-title").text("Agregar Propietario");
		$("#adm_propietarios .modal-body input#apynom").val("");
		$("#adm_propietarios .modal-body input#direccion").val("");
		$("#adm_propietarios .modal-body #idlocalidad").val(
			$("#idlocalidad option").val()
		);
		$("#adm_propietarios .modal-body input#telefono").val("");
		$("#adm_propietarios .modal-body #cmbDoc").val($("#cmbDoc option").val());
		$("#adm_propietarios .modal-body input#numdni").val("");
		$("#adm_propietarios .modal-body input#numdni").prop("disabled", false);
		$("#adm_propietarios .modal-body input#email").val("");
		$("#adm_propietarios .modal-body input#fecnac").val("");
		$("#adm_propietarios .modal-body #cmbIva").val($("#cmbIva option").val());
        $("#adm_propietarios .modal-body input#cuit").val("");
		$("#adm_propietarios .modal-body #observaciones").val("");
		$("#adm_propietarios .modal-body #cmbTelegram").val(0);
		$("#adm_propietarios .modal-body input#idPropietario").val("Agregar");
		$("#adm_propietarios").modal("show");
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
    
    $("#tabla_propietarios tbody").on("click", ".btn_editar", function (event) {
		$("#adm_propietarios .modal-title").text("Modificar Propietario");
		var boton = $(event.currentTarget);
		var idPropietario = boton[0].parentNode.parentNode.childNodes[6].value;
		$.ajax({
			type: "POST",
			url: "scripts/apipropietarios.php",
			data: { param: 5, idPropietario: idPropietario },
			dataType: "json",
			success: function (response) {
				var cuit = response[0].cuit;
				cuitActual = cuit;
				if(cuit!=null){
					cuit = cuit.replace(/([0-9]{2})([0-9]{8})([0-9])/,"$1-$2-$3");
				}
				$("#adm_propietarios .modal-body input#apynom").val(response[0].ayn);
				$("#adm_propietarios .modal-body input#direccion").val(
					response[0].domicilio
				);
				$("#adm_propietarios .modal-body #idlocalidad").val(
					response[0].idlocalidad
				);
				$("#adm_propietarios .modal-body input#telefono").val(response[0].telefono);
				$("#adm_propietarios .modal-body #cmbDoc").val(response[0].tipodoc);
				$("#adm_propietarios .modal-body input#numdni").val(response[0].nrodoc);
				dniactual=response[0].nrodoc;
				$("#adm_propietarios .modal-body input#email").val(response[0].email);
				$("#adm_propietarios .modal-body input#fecnac").val(response[0].nacido);
				$("#adm_propietarios .modal-body #cmbIva").val(response[0].iva);
				$("#adm_propietarios .modal-body input#cuit").val(cuit);
				$("#adm_propietarios .modal-body #observaciones").val(response[0].observa);
				$("#adm_propietarios .modal-body #cmbTelegram").val(response[0].telid==null?0:response[0].telid);
				$("#adm_propietarios .modal-body input#idPropietario").val(idPropietario);
				$("#adm_propietarios").modal("show");
			},
			error: function (response) {
				console.log(response);
			},
		});
	});

	$("#tabla_propietarios tbody").on("click",".btn_borrar", function(){
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
		var idPropietario = $("#idPropietario").val();
		var valido = 0;
		valido = validarApynom(apynom) + validaCuit(cuit);
		if (valido == 0) {
			if (idPropietario == "Agregar") {
				agregarPropietario(
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
						vincularPropietario(idPropietario);
						$("#numdni").prop("disabled",false);
				}
				actualizarPropietario(
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
					idPropietario
				);
			}
			$("#adm_propietarios").modal("hide");
		}
    });
	$("#adm_propietarios").on("hide.bs.modal", function(){
		$("#apynom").removeClass("is-invalid is-valid");
		$("#cuit").removeClass("is-valid is-invalid");
		$("#numdni").removeClass("is-valid is-invalid");
		$("#cuit").prop("required", false);
		$("#numdni").prop("disabled",false);
	});
	$("#adm_propietarios").on("shown.bs.modal", function(){
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
        url:"scripts/apipropietarios.php",
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
	$("#tabla_propietarios tbody").append(
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
			objeto.idPropietario +
			"'>" +
			"</tr>"
	);
}

function agregarPropietario(
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
) {
	if (cuit!=""){
		cuit = parseInt(cuit.toString().replace(/[-_]/g, ""));
	}
	$.ajax({
		type: "POST",
		url: "scripts/apipropietarios.php",
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
            observa:observaciones,
			cuit: cuit,
			telid: telid
		},
		dataType: "json",
		success: function (response) {
			if (response.exito == true) {
				var oPropietario = {
					ayn: apynom,
					domicilio: direccion,
					telefono: telefono,
					email: email,
					idPropietario: response.idPersona,
				};
				cargarFila(oPropietario);
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

function actualizarPropietario(
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
	idPropietario
) {
	if (cuit!=""){
		cuit = parseInt(cuit.toString().replace(/[-_]/g, ""));
	}
	$.ajax({
		type: "POST",
		url: "scripts/apipropietarios.php",
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
			idPropietario: idPropietario,
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
					idPropietario: idPropietario,
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
	var input = $("input[value='"+objeto.idPropietario+"']");
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
	var idPropietario = botonBorrar.parentNode.parentNode.childNodes[6].value;
	var trBorrar = botonBorrar.parentNode.parentNode;
	alertify.confirm('Eliminar', "Esta seguro que desea eliminarlo?", function(){
		borrarPropietario(idPropietario, trBorrar);
	},function(){
		alertify.error('Cancelado');
	});
}

function borrarPropietario(idPropietario, trBorrar){
	$.ajax({
		type:"POST",
		url:"scripts/apipropietarios.php",
		data:{"param":4,
				"idPropietario":idPropietario},
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
		alertify.error("Apellido y Nombre no puede esta vacio");
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
		if(cuit.length!=11 || !validarCuit(cuit) || cuitPropietarios.includes(cuit)){
			if(cuit.length==11){
				if (validarCuit(cuit)){
					if(cuitPropietarios.includes(cuit)){
						if(cuit==cuitActual && $("#idPropietario").val()!="Agregar"){
							$("#cuit").removeClass("is-invalid");
							$("#cuit").addClass("is-valid");
							return 0;
						}else{
							$("#errorCuit").text("El número de CUIT ya esta asignado en otro propietario");
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

function cargarCuitPropietarios(){
	$.ajax({
		type:"POST",
		url:"scripts/apipropietarios.php",
		data:{param:6},
		dataType: "json",
		success: function(response){
			if(response.exito){
				response[0].forEach((linea)=>{
					cuitPropietarios.push(linea.cuit);
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
	// if ($(".modal-title").text().slice(0, 7) == "Agregar") {
	if ($("#idPropietario").val() == "Agregar") {
		if (dniPropietarios.includes(numdni)) {
			$("#numdni").removeClass("is-valid");
			$("#numdni").addClass("is-invalid");
			$("#errorNumDni").text("Este DNI pertenece a otro propietario. Verificar");
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
							$("#adm_propietarios .modal-body input#apynom").val(response[0].ayn);
							$("#adm_propietarios .modal-body input#direccion").val(
								response[0].domicilio
							);
							$("#adm_propietarios .modal-body #idlocalidad").val(
								response[0].idlocalidad
							);
							$("#adm_propietarios .modal-body input#telefono").val(
								response[0].telefono
							);
							$("#adm_propietarios .modal-body #cmbDoc").val(response[0].tipodoc);
							$("#adm_propietarios .modal-body input#email").val(response[0].email);
							$("#adm_propietarios .modal-body input#fecnac").val(
								response[0].nacido
							);
							$("#adm_propietarios .modal-body #cmbIva").val(response[0].iva);
							$("#adm_propietarios .modal-body input#cuit").val(cuit);
							$("#adm_propietarios .modal-body #observaciones").val(response[0].observa);
							$("#adm_propietarios .modal-body #cmbTelegram").val(response[0].telid==null?0:response[0].telid);
							$("#idPropietario").val(response[0].idPersonas);
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
		if (dniPropietarios.includes(numdni) && numdni !== dniActual) {
			$("#numdni").removeClass("is-valid");
			$("#numdni").addClass("is-invalid");
			$("#errorNumDni").text("Este DNI pertenece a otro propietario. Verificar");
			return 1;
		}else if(dniPersonas.includes(numdni) && numdni !==dniActual){
			alertify.confirm(
				"Existente",
				"Este DNI ya esta cargado. Desea traer los datos guardados?",
				function () {
					idPropietarioActual = $("#adm_propietarios .modal-body #idPropietario").val();
					
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
							$("#adm_propietarios .modal-body input#apynom").val(response[0].ayn);
							$("#adm_propietarios .modal-body input#direccion").val(
								response[0].domicilio
							);
							$("#adm_propietarios .modal-body #idlocalidad").val(
								response[0].idlocalidad
							);
							$("#adm_propietarios .modal-body input#telefono").val(
								response[0].telefono
							);
							$("#adm_propietarios .modal-body #cmbDoc").val(response[0].tipodoc);
							$("#adm_propietarios .modal-body input#email").val(response[0].email);
							$("#adm_propietarios .modal-body input#fecnac").val(
								response[0].nacido
							);
							$("#adm_propietarios .modal-body #cmbIva").val(response[0].iva);
							$("#adm_propietarios .modal-body input#cuit").val(cuit);
							$("#adm_propietarios .modal-body #observaciones").val(response[0].observa);
							$("#adm_propietarios .modal-body #cmbTelegram").val(response[0].telid==null?0:response[0].telid);
							$("#idPropietario").val(response[0].idPersonas);
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

function cargarDniPropietarios() {
	$.ajax({
		type: "POST",
		url: "scripts/apipropietarios.php",
		data: { param: 7 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				response[0].forEach((renglon) => {
					dniPropietarios.push(renglon.nrodoc);
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
		url: "scripts/apipropietarios.php",
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

function vincularPropietario(idPropietario) {
	if(idPropietarioActual===0){
		$.ajax({
			type: "POST",
			url: "scripts/apipropietarios.php",
			data: { param: 9, idPropietario },
			dataType: "json",
			success: function (response) {
				if (response.exito) {
					var opropietario = {
						ayn: "",
						domicilio: "",
						telefono: "",
						email: "",
						idPropietario,
					};
					cargarFila(opropietario);
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
			url: "scripts/apipropietarios.php",
			data: {param:10, idPropietario, idPropietarioActual},
			dataType: "json",
			success: function(response){
				if(response.exito){
					$("#tabla_propietarios input[value='" + idPropietarioActual + "']").val(idPropietario);
					idPropietarioActual=0;
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