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

require_once $dir . 'settings.php';

$tarea = $_POST['param'];

switch ($tarea) {
    case 'empresa':
        $retorno = array('exito' => 'true', 'empresa' => EMPRESA);
        break;
    case 'alarma':
        $retorno = array('exito' => 'true', 'alarma' => ALARMA);
        break;
    default:
        $retorno = array('exito' => false);
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
