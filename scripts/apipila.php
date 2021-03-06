<?php
$dir = is_dir('modelo') ? '' : '../';
include_once($dir . 'modelo/validar.php');
if(!isset($_SESSION['usuario'])) {
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

include_once($dir . 'modelo/pila.php');
include_once($dir.'modelo/telegram.php');
include_once($dir.'modelo/viaje.php');

$tarea = $_POST['param'];
if(isset($_POST['idPila'])){
    $idPila = $_POST['idPila'];
}
if(isset($_POST['pila'])){
    $pila = $_POST['pila'];
}
if(isset($_POST['idServicio'])){
    $idServicio = $_POST['idServicio'];
}
if(isset($_POST['msg'])){
    $msg = $_POST['msg'];
}
if(isset($_POST['idViaje'])){
    $idViaje = $_POST['idViaje'];
}

switch ($tarea) {
    case 1:
        $opila = new Pila();
        $retorno = $opila->listar();
        break;
    case 2:
        $estado = 0;
        if(isset($idViaje)){
            $oViaje = new Viaje();
            $oViaje->setIdViaje($idViaje);
            $retorno = $oViaje->buscarViaje();
            $estado = $retorno[0]['estado'];
        }
        if($estado!==3){
            $opila = new Pila();
            $opila->setIdServicio($idServicio);
            $retorno = $opila->eliminar();
            $retorno['estado'] = $estado;
            if(isset($msg)){
                $oTelegram = new Telegram();
                $oTelegram->enviarTEOperadora($msg);
            }
        }else{
            $retorno = array('exito'=>true, 'msg'=>'Viaje Cancelado', 'estado'=>$estado);
        }
        break;
    case 3:
        $opila = new Pila();
        $opila->setIdServicio($idServicio);
        $retorno = $opila->eliminar();
        if($retorno["exito"]){
            $opila->setPila($pila);
            $retorno = $opila->agregar();
        }
        if(isset($msg)){
            $oTelegram = new Telegram();
            $oTelegram->enviarTEOperadora($msg);
        }
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