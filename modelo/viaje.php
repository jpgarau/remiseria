<?php
include_once('validar.php');
include_once('conexion.php');
include_once('ctacte.php');

class Viaje
{
    private $idViaje;
    private $fecha;
    private $hora;
    private $idCliente;
    private $origen;
    private $destino;
    private $observa;
    private $idReserva;
    private $idServicio;
    private $horaLibre;
    private $importe;
    private $estado;

    public function __construct()
    {
        $driver = new mysqli_driver();
        $driver->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
        $this->idViaje = null;
        $this->fecha = null;
        $this->hora = null;
        $this->idCliente = null;
        $this->origen = null;
        $this->destino = null;
        $this->observa = null;
        $this->idReserva = null;
        $this->idServicio = null;
        $this->horaLibre = null;
        $this->importe = null;
        $this->estado = 0;
    }

    //getters
    public function getIdViaje(){
        return $this->idViaje;
    }
    public function getFecha(){
        return $this->fecha;
    }
    public function getHora(){
        return $this->hora;
    }
    public function getIdCliente(){
        return $this->idCliente;
    }
    public function getOrigen(){
        return $this->origen;
    }
    public function getDestino(){
        return $this->destino;
    }
    public function getObserva(){
        return $this->observa;
    }
    public function getIdReserva(){
        return $this->idReserva;
    }
    public function getIdServicio(){
        return $this->idServicio;
    }
    public function getHoraLibre(){
        return $this->horaLibre;
    }
    public function getImporte(){
        return $this->importe;
    }
    public function getEstado(){
        return $this->estado;
    }

    //setters

    public function setIdViaje($idViaje){
        $this->idViaje = $idViaje;
    }
    public function setFecha($fecha){
        $this->fecha = '';
        $error = false;
        $fecha = trim($fecha);
        $fecha = filter_var($fecha,FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        if($fecha===FALSE || is_null($fecha) || strlen($fecha)===0) $error = true;
        if(!$error){
            $this->fecha = $fecha;
        }else{
            $this->fecha = $error;
        }
        return $error;
    }
    public function setHora($hora){
        $this->hora = '';
        $error = false;
        $hora = trim($hora);
        $hora = filter_var($hora,FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        if($hora === FALSE || is_null($hora) || strlen($hora)===0) $error = true;
        if(!$error){
            $this->hora = $hora;
        }else{
            $this->hora = $error;
        }
        return $error;
    }
    public function setIdCliente($idCliente){
        $this->idCliente = null;
        $error = false;
        $idCliente = filter_var($idCliente,FILTER_VALIDATE_INT);
        if($idCliente===FALSE) $error = true;
        if(!$error){
            $this->idCliente = $idCliente;
        }
        return $error;
    }
    public function setOrigen($origen){
        $this->origen = '';
        $error = false;
        $origen = trim($origen);
        $origen = filter_var($origen,FILTER_SANITIZE_SPECIAL_CHARS);
        if($origen===FALSE || is_null($origen) || strlen($origen)===0) $error = true;
        if(!$error){
            $this->origen = $origen;
        }else{
            $this->$error;
        }
        return $error;
    }
    public function setDestino($destino){
        $this->destino = null;
        $error = false;
        $destino = trim($destino);
        $destino = filter_var($destino,FILTER_SANITIZE_SPECIAL_CHARS);
        if($destino===FALSE) $error = true;
        if(!$error){
            $this->destino = $destino;
        }
        return $error;
    }
    public function setObserva($observa){
        $this->observa = null;
        $error = false;
        $observa = trim($observa);
        $observa = filter_var($observa,FILTER_SANITIZE_SPECIAL_CHARS);
        if($observa===FALSE) $error = true;
        if(!$error){
            $this->observa = $observa;
        }
        return $error;
    }
    public function setIdReserva($idReserva){
        $this->idReserva = $idReserva;
    }
    public function setIdServicio($idServicio){
        $this->idServicio = $idServicio;
    }
    public function setHoraLibre($horaLibre){
        $this->horaLibre = null;
        $error = false;
        $horaLibre = trim($horaLibre);
        $horaLibre = filter_var($horaLibre,FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        if($horaLibre === FALSE || is_null($horaLibre) || strlen($horaLibre)===0) $error = true;
        if(!$error){
            $this->horaLibre = $horaLibre;
        }
        return $error;
    }
    public function setImporte($importe){
        $this->importe = null;
        $error = false;
        $importe = filter_var($importe,FILTER_VALIDATE_FLOAT);
        if($importe === FALSE) $error = true;
        if(!$error){
            $this->importe = $importe;
        }
        return $error;
    }
    public function setEstado($estado){
        $this->estado = $estado;
    }

    public function buscarViaje(){
        $arr = array('exito'=>false, 'msg'=>'Hubo un error al buscar el viaje');
        try {
            $idViaje = $this->getIdViaje();
            $sql = 'SELECT * FROM viajes WHERE idViaje=?';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if($stmt!==FALSE){
                $stmt->bind_param('i',$idViaje);
                $stmt->execute();
                $arrviaje = $stmt->get_result();
                $stmt->close();
                $mysqli->close();
                $viaje = $arrviaje->fetch_assoc();
                $arr = array('exito'=>true,'msg'=>'',$viaje);
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function agregarViaje(){
        $arr = array('exito'=>false,'msg'=>'Hubo un error al agregar el viaje');
        try {
            $fecha = $this->getFecha();
            $hora = $this->getHora();
            $idCliente = $this->getIdCliente();
            $origen = $this->getOrigen();
            $destino = $this->getDestino();
            $observa = $this->getObserva();
            $idServicio = $this->getIdServicio();
            $horaLibre = $this->getHoraLibre();
            $importe = $this->getImporte();
            $estado = 1;
            $sql = "INSERT INTO viajes(fecha, hora, idCliente, origen, destino, observa, idServicio, horaLibre, importe, estado) VALUES(?,?,?,?,?,?,?,?,?,?)";
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if($stmt!==FALSE){
                $stmt->bind_param('ssisssisdi', $fecha, $hora, $idCliente, $origen, $destino, $observa, $idServicio, $horaLibre, $importe, $estado);
                $stmt->execute();
                $stmt->close();
                $idViaje = $mysqli->insert_id;
                if($idCliente>0 && $importe>0){
                    $octacte = new Ctacte();
                    $octacte->setSigla("VI");
                    $octacte->setIdViaje($idViaje);
                    $octacte->setFecha($fecha);
                    $octacte->setHora($hora);
                    $octacte->setIdCliente($idCliente);
                    $octacte->setImporte($importe);
                    $octacte->agregarViajeACtaCte();
                }
                $sql = 'SELECT personas.telid FROM servicio LEFT JOIN personas on servicio.idChofer=personas.idPersonas WHERE servicio.idServicio=?';
                $stmt2 = $mysqli->prepare($sql);
                if($stmt2!==FALSE){
                    $stmt2->bind_param('i', $idServicio);
                    $stmt2->execute();
                    $rs = $stmt2->get_result();
                    $stmt2->close();
                    $mysqli->close();
                    $id = $rs->fetch_assoc();
                    $arr = array('exito'=>true, 'msg'=>'', 'id'=>$id['telid']);
                }
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function actualizarViaje(){
        $arr = array('exito'=>false,'msg'=>'Hubo un error al actualizar el viaje');
        try {
            $idViaje = $this->getIdViaje();
            $fecha = $this->getFecha();
            $hora = $this->getHora();
            $idCliente = $this->getIdCliente();
            $origen = $this->getOrigen();
            $destino = $this->getDestino();
            $observa = $this->getObserva();
            $horaLibre = $this->getHoraLibre();
            $importe = $this->getImporte();
            $sql = 'UPDATE viajes SET fecha=?, hora=?, idCliente=?, origen=?, destino=?, observa=?, horaLibre=?, importe=? WHERE idViaje=?';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if($stmt!==FALSE){
                $stmt->bind_param('ssissssdi',$fecha, $hora, $idCliente, $origen, $destino, $observa, $horaLibre, $importe, $idViaje);
                $stmt->execute();
                $stmt->close();
                $mysqli->close();
                if($idCliente>0 && $importe>0){
                    $octacte = new Ctacte();
                    $octacte->setIdViaje($idViaje);
                    $ctacte = $octacte->buscarViaje();
                    if($ctacte['exito'] && $ctacte[0]['idCtaCte']!==0){
                        $idCtaCte = $ctacte[0]['idCtaCte'];
                        $octacte->setIdCtaCte($idCtaCte);
                        $octacte->setIdCliente($idCliente);
                        $octacte->setImporte($importe);
                        $octacte->modificarCtaCte();
                        $arr = array('exito'=>true, 'msg'=>'');
                    }elseif($ctacte['exito'] && $ctacte[0]['idCtaCte']===0){
                        $octacte->setSigla("VI");
                        $octacte->setFecha($fecha);
                        $octacte->setHora($hora);
                        $octacte->setIdCliente($idCliente);
                        $octacte->setImporte($importe);
                        $octacte->agregarViajeACtaCte();
                        $arr = array('exito'=>true, 'msg'=>'');
                    }else{
                        $arr = array('exito'=>false, 'msg'=>'Hubo un error al guardar en la CtaCte.');
                    }
                }elseif($idCliente===0){
                    $octacte = new Ctacte();
                    $octacte->setIdViaje($idViaje);
                    $ctacte = $octacte->buscarViaje();
                    if($ctacte['exito'] && $ctacte[0]['idCtaCte']!==0){
                        $octacte->setIdCtaCte($ctacte[0]['idCtaCte']);
                        $octacte->eliminarMovimiento();
                    }
                    $arr = array('exito'=>true, 'msg'=>'');
                }else{
                    $arr = array('exito'=>true, 'msg'=>'');
                }
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function asignarViaje(){
        $arr = array('exito'=>false, 'msg'=>'Hubo un error al asignar');
        try {
            $fecha = $this->getFecha();
            $hora = $this->getHora();
            $idCliente = $this->getIdCliente();
            $origen = $this->getOrigen();
            $destino = $this->getDestino();
            $observa = $this->getObserva();
            $idReserva = $this->getIdReserva();
            $idServicio = $this->getIdServicio();
            $estado = 1;
            $sql = "INSERT INTO viajes(fecha, hora, idCliente, origen, destino, observa, idReserva, idServicio, estado) VALUES (?,?,?,?,?,?,?,?,?)";
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if($stmt!==FALSE){
                $stmt->bind_param('ssisssiii',$fecha, $hora, $idCliente, $origen, $destino, $observa, $idReserva, $idServicio, $estado);
                $stmt->execute();
                $stmt->close();
                $sql = 'SELECT personas.telid FROM servicio LEFT JOIN personas on servicio.idChofer=personas.idPersonas WHERE servicio.idServicio=?';
                $stmt2 = $mysqli->prepare($sql);
                if($stmt2!==FALSE){
                    $stmt2->bind_param('i', $idServicio);
                    $stmt2->execute();
                    $rs = $stmt2->get_result();
                    $stmt2->close();
                    $mysqli->close();
                    $id = $rs->fetch_assoc();
                    $arr = array('exito'=>true, 'msg'=>'', 'id'=>$id['telid']);
                }
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function cancelarViaje(){
        $arr = array('exito'=>false,'msg'=>'Hubo un error al cancelar el viaje');
        try {
            $idViaje = $this->getIdViaje();
            $estado = 3;
            $sql = 'UPDATE viajes SET estado=? WHERE idViaje=?';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if($stmt!==FALSE){
                $stmt->bind_param('ii', $estado, $idViaje);
                $stmt->execute();
                $stmt->close();
                $octacte = new Ctacte();
                $octacte->setIdViaje($idViaje);
                $ctacte = $octacte->buscarViaje();
                if($ctacte['exito']){
                    $idCtaCte = $ctacte[0]['idCtaCte'];
                    $octacte->setIdCtaCte($idCtaCte);
                    $octacte->eliminarMovimiento();
                }
                $sql = 'SELECT personas.telid FROM viajes LEFT JOIN servicio ON viajes.idServicio=servicio.idServicio LEFT JOIN personas on servicio.idChofer=personas.idPersonas WHERE viajes.idViaje=?';
                $stmt2 = $mysqli->prepare($sql);
                if($stmt2!==FALSE){
                    $stmt2->bind_param('i', $idViaje);
                    $stmt2->execute();
                    $rs = $stmt2->get_result();
                    $stmt2->close();
                    $mysqli->close();
                    $id = $rs->fetch_assoc();
                    $arr = array('exito'=>true, 'msg'=>'', 'id'=>$id['telid']);
                }
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function listarViajes(){
        $arr = array('exito'=>false,'msg'=>'Hubo un error al listar');
        try {
            $idServicio = $this->getIdServicio();
            $sql = "SELECT * FROM viajes WHERE idServicio = ? AND estado=1 ORDER BY fecha,hora";
            $mysqli = Conexion::abrir();
            $stmt  =$mysqli->prepare($sql);
            if($stmt!==FALSE){
                $stmt->bind_param('i',$idServicio);
                $stmt->execute();
                $arrViajes = $stmt->get_result();
                $stmt->close();
                $encontrados = $arrViajes->num_rows;
                $mysqli->close();
                $viajes = $arrViajes->fetch_all(MYSQLI_ASSOC);
                $arr = array('exito'=>true,'msg'=>'', 'encontrados'=>$encontrados, $viajes);
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function informeViajes($idVehiculos, $fecha, $fechaHasta, $idChofer){
        $idVehiculos = filter_var($idVehiculos, FILTER_VALIDATE_INT);
        $idChofer = filter_var($idChofer, FILTER_VALIDATE_INT);
        $hoy = new DateTime('now');
        $AC = new DateTime('1900/01/01');
        $fecha = is_null($fecha)||$fecha==''?$AC->format('Y-m-d'):$fecha;
        $fechaHasta = is_null($fechaHasta)||$fechaHasta==''?$hoy->format('Y-m-d'):$fechaHasta;
        $arr = array('exito'=>false, 'msg'=>'Hubo un error al realizar el informe');
        try {
            $sql = "SELECT viajes.fecha, viajes.hora, viajes.idCliente, viajes.origen, viajes.destino, viajes.horaLibre, viajes.importe, servicio.idChofer, personas.ayn FROM viajes LEFT JOIN servicio on viajes.idServicio=servicio.idServicio LEFT JOIN personas on servicio.idChofer=personas.idPersonas WHERE viajes.fecha BETWEEN ? AND ? AND servicio.idVehiculo=? AND viajes.estado!=3"; 
            $sql .= $idChofer>0?" AND idChofer={$idChofer}":"";
            $sql .= " ORDER BY fecha, hora";
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if($stmt!==FALSE){
                $stmt->bind_param('ssi',$fecha, $fechaHasta,$idVehiculos);
                $stmt->execute();
                $arrViajes = $stmt->get_result();
                $stmt->close();
                $mysqli->close();
                $viajes = $arrViajes->fetch_all(MYSQLI_ASSOC);
                $arr = array('exito'=>true, 'msg'=>'', $viajes);
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function buscarDestino($idChofer){
        $arr = array('exito'=>false, 'msg'=>'Error al buscar destino');
        try {
            $sql = 'SELECT viajes.idViaje, viajes.origen FROM viajes LEFT JOIN servicio on viajes.idServicio=servicio.idServicio WHERE servicio.idChofer=? AND viajes.importe IS NULL AND viajes.estado=1 AND servicio.estado=1 AND viajes.idViaje = (SELECT MAX(idViaje) FROM viajes WHERE viajes.estado=1)';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if($stmt!==FALSE){
                $stmt->bind_param('i',$idChofer);
                $stmt->execute();
                $rs = $stmt->get_result();
                $respuesta = $rs->fetch_assoc();
                $encontrado = $rs->num_rows;
                $stmt->close();
                $mysqli->close();
                $arr = array('exito'=>true, 'msg'=>'', 'encontrados'=>$encontrado, $respuesta);
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }
}
