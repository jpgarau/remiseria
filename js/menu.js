var url = '/';
$(document).ready(function () {
	setearUrl();
	if (typeof relojConsola !== "undefined") {
		clearInterval(relojConsola);
	}

	$("#seguridad").click(function (e) {
		e.preventDefault();
		document.body.style.backgroundColor = "white";
		$("button.navbar-toogler").addClass('collapsed');
		$("#navbarGestion").removeClass('show');
		if (typeof relojConsola !== "undefined") {
			clearInterval(relojConsola);
		}
		$("#contenedor").removeClass("menu-principal");
		$("#navbarGestion a").removeClass("active");
		$("#navbarGestion button").removeClass("active");
		$(this).addClass("active");
		$("#contenedor2").load("vista/seguridad.php");
	});
	
	$("#config").on('click', function(e){
		e.preventDefault();
		document.body.style.backgroundColor = "white";
		$("button.navbar-toogler").addClass('collapsed');
		$("#navbarGestion").removeClass('show');
		if (typeof relojConsola !== "undefined") {
			clearInterval(relojConsola);
		}
		$("#contenedor").removeClass("menu-principal");
		$("#navbarGestion a").removeClass("active");
		$("#navbarGestion button").removeClass("active");
		$(this).addClass("active");
		$("#contenedor2").load("vista/controlPanel.php");
	});
	
	$("#cambioPass").click(function (e) {
		e.preventDefault();
		document.body.style.backgroundColor = "white";
		$("button.navbar-toogler").addClass('collapsed');
		$("#navbarGestion").removeClass('show');
		if (typeof relojConsola !== "undefined") {
			clearInterval(relojConsola);
		}
		$("#contenedor").removeClass("menu-principal");
		$("#navbarGestion a").removeClass("active");
		$("#navbarGestion button").removeClass("active");
		$(this).addClass("active");
		SolicitarCambioClave();
	});
	$("ul#menu-principal").on("click", "a.opcion", function (e) {
		e.preventDefault();
		document.body.style.background = "white"
		$("button.navbar-toogler").addClass('collapsed');
		$("#navbarGestion").removeClass('show');
		$("#contenedor").removeClass("menu-principal");
		if(!(e.target.id==='consola' && window.innerWidth<1100))
		{
			$("#navbarGestion a").removeClass("active");
			$("#navbarGestion button").removeClass("active");
			$(this).addClass("active");
			$("#contenedor2").load("vista/" + e.target.id + ".php"),
				(res, status, xhr) => {
					if (status === "error") {
						function redirigir() {
							window.location.replace(url);
						}
						$("#contenedor2").html(
							"<div class='container'><div class='alert alert-danger m-4'><strong>Error</strong> en las credenciales. Redirigiendo...<div class='spinner-border spinner-border-sm float-right' role='status' aria-hidden='true'></div></div></div>"
						);
						setTimeout(redirigir, 3000);
						res, status, xhr;
					}
				};
		}else{
			alertify.error('<b>Imposible Abrir</b><br>Resolución de pantalla insuficiente');
		}
	});
});

function SolicitarCambioClave() {
	$.ajax({
		type: "POST",
		url: "scripts/apiusuario.php",
		data: { param: 5 },
		dataType: "json",
		success: function (response) {
			if (response.exito) {
				$("#contenedor2").html(
					'<h2 class="h2 text-center p-4 align-self-center">Cambio de clave solicitado con exito</h2>' +
						'<p class="text-center align-self-center text-success"><i class="fas fa-check-circle fa-10x"></i></p>' +
						'<p class="text-center h4 align-self-center text-info">Redirigiendo <i class="fas fa-spinner fa-pulse"></i></p>'
				);
				alertify.success(
					"Cambio de clave solicitado con exito. Redirigiendo..."
				);
				setTimeout(() => {
					window.location.replace(url);
				}, 3000);
			} else {
				console.error(response.msg);
			}
		},
		error: function (response) {
			console.error(response);
		},
	});
}

function setearUrl(){
	$.ajax({
		type: "POST",
		url: "scripts/apiparametros.php",
		data: { param: 'url'},
		dataType: "json",
		success: function (response){
			if(response.exito){
				url = response.url;
			}
		}
	});
}