$(document).ready(function () {
    //listener botón localidades - carga la vista admlocalidades
    $("#localidades").click(function (e) { 
        e.preventDefault();
        $("#contenido").load("vista/admlocalidades.php");
    });
    //listener botón tipoDoc - carga la vista admtipoDoc
    $("#tipoDoc").click(function (e) { 
        e.preventDefault();
        $("#contenido").load("vista/admtipoDoc.php");
    });
    //listener botón condIva - carga la vista admcondIva
    $("#condIva").click(function (e) { 
        e.preventDefault();
        $("#contenido").load("vista/admcondIva.php");
    });
});