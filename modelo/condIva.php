<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
include_once $dir.'modelo/conexion.php';

class CondIva
{
    private $idcondiva;
    private $desccondiva;

    public function __construct()
    {
        $driver = new mysqli_driver();
        $driver->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
        $this->idcondiva = 0;
        $this->desccondiva = '';
    }


    public function getIdCondIva()
    {
        return $this->idcondiva;
    }
    public function getDescCondIva()
    {
        return $this->desccondiva;
    }

    public function setIdCondIva($idcondiva)
    {
        $this->idcondiva = $idcondiva;
    }
    public function setDescCondIva($desccondiva)
    {
        $this->desccondiva = '';
        $error = false;
        $desccondiva = trim($desccondiva);
        $desccondiva = filter_var($desccondiva, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        if ($desccondiva === FALSE || is_null($desccondiva) || strlen($desccondiva) === 0) $error = true;
        if (!$error) {
            $this->desccondiva = $desccondiva;
        } else {
            $this->desccondiva = $error;
        }
        return $error;
    }

    public function agregar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al agregar');
        try {
            $desccondiva = $this->getDescCondIva();
            if (!is_bool($desccondiva)) {
                $sql = 'INSERT INTO condiva (desccondiva) VALUES (?)';
                $mysqli = Conexion::abrir();
                $stmt = $mysqli->prepare($sql);
                if ($stmt !== FALSE) {
                    $stmt->bind_param('s', $desccondiva);
                    $stmt->execute();
                    $stmt->close();
                    $idcondiva = $mysqli->insert_id;
                    $mysqli->close();
                    $arr = array('exito' => true, 'msg' => '', 'idcondiva' => $idcondiva);
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
            $idcondiva = $this->getIdCondIva();
            $desccondiva = $this->getDescCondIva();
            if (!is_bool($desccondiva)) {
                $sql = 'UPDATE condiva SET desccondiva = ? WHERE idcondiva=?';
                $mysqli = Conexion::abrir();
                $stmt = $mysqli->prepare($sql);
                if ($stmt !== FALSE) {
                    $stmt->bind_param('si', $desccondiva,$idcondiva);
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
            $idcondiva = $this->getIdCondIva();
            $sql = 'DELETE FROM condiva WHERE idcondiva=?';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if ($stmt !== FALSE) {
                $stmt->bind_param('i', $idcondiva);
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
            $sql = 'SELECT * FROM condiva';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if ($stmt !== FALSE) {
                $stmt->execute();
                $rs = $stmt->get_result();
                $encontrados = $rs->num_rows;
                $stmt->close();
                $arrCond = $rs->fetch_all(MYSQLI_ASSOC);
                $mysqli->close();
                $arr = array('exito' => true, 'msg' => '', 'encontrados' => $encontrados, $arrCond);
            }
        } catch (\Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }
}