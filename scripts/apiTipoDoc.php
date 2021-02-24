<?php
$dir = is_dir('modelo') ? '' : '../';
include_once $dir . 'modelo/validar.php';
if (!isset($_SESSION['usuario'])) {
    header('HTTP/1.1 401');
    die('No Autorizado');
}
if (!peticion_ajax()) {
    header('HTTP/1.1 401');
    die(json_encode(array('exito' => false, 'msg' => 'No Autorizado')));
}
if (!isset($_POST['param'])) {
    header('HTTP/1.1 401');
    die(json_encode(array('exito' => false, 'msg' => 'No Autorizado')));
}

include_once $dir . 'modelo/tipoDoc.php';

$tarea = $_POST['param'];
if (isset($_POST['idTipoDoc'])) {
    $idTipoDoc = $_POST['idTipoDoc'];
}
if (isset($_POST['descripcion'])) {
    $descripcion = $_POST['descripcion'];
}

switch ($tarea) {
    case 1:
        $oTipoDoc = new TipoDoc();
        $retorno = $oTipoDoc->listar();
        break;
    case 2:
        $oTipoDoc = new TipoDoc();
        $oTipoDoc->setDescripcion($descripcion);
        $retorno = $oTipoDoc->agregar();
        break;
    case 3:
        $oTipoDoc = new TipoDoc();
        $oTipoDoc->setIdTipoDoc($idTipoDoc);
        $oTipoDoc->setDescripcion($descripcion);
        $retorno = $oTipoDoc->actualizar();
        break;
    case 4:
        $oTipoDoc = new TipoDoc();
        $oTipoDoc->setIdTipoDoc($idTipoDoc);
        $retorno = $oTipoDoc->eliminar();
        break;
    default:
        break;
}

if ($retorno['exito'] == true) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($retorno);
} else {
    header('HTTP/1.1 500');
    die(json_encode($retorno));
}

function peticion_ajax()
{
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest';
}