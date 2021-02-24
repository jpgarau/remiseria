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

include_once $dir . 'modelo/localidad.php';

$tarea = $_POST['param'];
if (isset($_POST['idlocalidad'])) {
    $idlocalidad = $_POST['idlocalidad'];
}
if (isset($_POST['localidad'])) {
    $localidad = $_POST['localidad'];
}

switch ($tarea) {
    case 1:
        $oLocalidad = new Localidad();
        $retorno = $oLocalidad->listar();
        break;
    case 2:
        $oLocalidad = new Localidad();
        $oLocalidad->setLocalidad($localidad);
        $retorno = $oLocalidad->agregar();
        break;
    case 3:
        $oLocalidad = new Localidad();
        $oLocalidad->setIdLocalidad($idlocalidad);
        $oLocalidad->setLocalidad($localidad);
        $retorno = $oLocalidad->actualizar();
        break;
    case 4:
        $oLocalidad = new Localidad();
        $oLocalidad->setIdLocalidad($idlocalidad);
        $retorno = $oLocalidad->eliminar();
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