<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
include_once $dir.'modelo/conexion.php';

class Localidad{
    private $idlocalidad;
    private $localidad;

    public function __construct()
    {
        $driver = new mysqli_driver();
        $driver->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
        $this->idlocalidad = 0;
        $this->localidad = '';
    }

    public function getIdLocalidad(){
        return $this->idlocalidad;
    }
    public function getLocalidad(){
        return $this->localidad;
    }

    public function setIdLocalidad($idlocalidad){
        $this->idlocalidad = $idlocalidad;
    }
    public function setLocalidad($localidad){
        $this->localidad = '';
        $error = false;
        $localidad = trim($localidad);
        $localidad = filter_var($localidad, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        if($localidad===FALSE || is_null($localidad) || strlen($localidad)===0) $error = true;
        if(!$error){
            $this->localidad = $localidad;
        }else{
            $this->localidad = $error;
        }
        return $error;
    }

    public function agregar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al agregar');
        try {
            $localidad = $this->getLocalidad();
            if(!is_bool($localidad)){
                $sql = 'INSERT INTO localidades (localidad) VALUES (?)';
                $mysqli = Conexion::abrir();
                $stmt = $mysqli->prepare($sql);
                if ($stmt !== FALSE) {
                    $stmt->bind_param('s', $localidad);
                    $stmt->execute();
                    $stmt->close();
                    $idlocalidad = $mysqli->insert_id;
                    $mysqli->close();
                    $arr = array('exito' => true, 'msg' => '', 'idlocalidad' => $idlocalidad);
                }
            }
        } catch (\Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function actualizar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al actualizar');
        try {
            $idlocalidad = $this->getIdLocalidad();
            $localidad = $this->getLocalidad();
            if(!is_bool($localidad)){
                $sql = 'UPDATE localidades SET localidad=? WHERE idlocalidad=?';
                $mysqli = Conexion::abrir();
                $stmt = $mysqli->prepare($sql);
                if ($stmt !== FALSE) {
                    $stmt->bind_param('si', $localidad, $idlocalidad);
                    $stmt->execute();
                    $stmt->close();
                    $mysqli->close();
                    $arr = array('exito' => true, 'msg' => '');
                }
            }
        } catch (\Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function eliminar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al eliminar');
        try {
            $idlocalidad = $this->getIdLocalidad();
            $sql = 'DELETE FROM localidades WHERE idlocalidad=?';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if ($stmt !== FALSE) {
                $stmt->bind_param('i', $idlocalidad);
                $stmt->execute();
                $stmt->close();
                $mysqli->close();
                $arr = array('exito' => true, 'msg' => '');
            }
        } catch (\Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function listar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al listar');
        try {
            $sql = 'SELECT * FROM localidades';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if ($stmt !== FALSE) {
                $stmt->execute();
                $rs = $stmt->get_result();
                $encontrados = $rs->num_rows;
                $stmt->close();
                $localidades = $rs->fetch_all(MYSQLI_ASSOC);
                $mysqli->close();
                $arr = array('exito' => true, 'msg' => '', 'encontrados' => $encontrados, $localidades);
            }
        } catch (\Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }
}