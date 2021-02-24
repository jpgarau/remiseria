<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
include_once $dir.'modelo/conexion.php';

class TipoDoc
{
    private $idTipoDoc;
    private $descripcion;

    public function __construct()
    {
        $driver = new mysqli_driver();
        $driver->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
        $this->idTipoDoc = 0;
        $this->descripcion = '';
    }

    public function getIdTipoDoc()
    {
        return $this->idTipoDoc;
    }
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function setIdTipoDoc($idTipoDoc)
    {
        $this->idTipoDoc = $idTipoDoc;
    }
    public function setDescripcion($descripcion)
    {
        $this->descripcion = '';
        $error = false;
        $descripcion = trim($descripcion);
        $descripcion = filter_var($descripcion, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        if ($descripcion === FALSE || is_null($descripcion) || strlen($descripcion) === 0) $error = true;
        if (!$error) {
            $this->descripcion = $descripcion;
        } else {
            $this->descripcion = $error;
        }
        return $error;
    }

    public function agregar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al agregar');
        try {
            $descripcion = $this->getDescripcion();
            if (!is_bool($descripcion)) {
                $sql = 'INSERT INTO tipodoc (descripcion) VALUES (?)';
                $mysqli = Conexion::abrir();
                $stmt = $mysqli->prepare($sql);
                if ($stmt !== FALSE) {
                    $stmt->bind_param('s', $descripcion);
                    $stmt->execute();
                    $stmt->close();
                    $idTipoDoc = $mysqli->insert_id;
                    $mysqli->close();
                    $arr = array('exito' => true, 'msg' => '', 'idTipoDoc' => $idTipoDoc);
                }
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function actualizar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al actualizar');
        try {
            $idTipoDoc = $this->getIdTipoDoc();
            $descripcion = $this->getDescripcion();
            if (!is_bool($descripcion)) {
                $sql = 'UPDATE tipodoc SET descripcion=? WHERE idTipoDoc=?';
                $mysqli = Conexion::abrir();
                $stmt = $mysqli->prepare($sql);
                if ($stmt !== FALSE) {
                    $stmt->bind_param('si', $descripcion, $idTipoDoc);
                    $stmt->execute();
                    $stmt->close();
                    $mysqli->close();
                    $arr = array('exito' => true, 'msg' => '');
                }
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function eliminar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al eliminar');
        try {
            $idTipoDoc = $this->getIdTipoDoc();
            $sql = 'DELETE FROM tipodoc WHERE idTipoDoc=?';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if ($stmt !== FALSE) {
                $stmt->bind_param('i', $idTipoDoc);
                $stmt->execute();
                $stmt->close();
                $mysqli->close();
                $arr = array('exito' => true, 'msg' => '');
            }
        } catch (Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }

    public function listar()
    {
        $arr = array('exito' => false, 'msg' => 'Error al listar');
        try {
            $sql = 'SELECT * FROM tipodoc';
            $mysqli = Conexion::abrir();
            $stmt = $mysqli->prepare($sql);
            if ($stmt !== FALSE) {
                $stmt->execute();
                $rs = $stmt->get_result();
                $encontrados = $rs->num_rows;
                $stmt->close();
                $arrTipos = $rs->fetch_all(MYSQLI_ASSOC);
                $mysqli->close();
                $arr = array('exito' => true, 'msg' => '', 'encontrados' => $encontrados, $arrTipos);
            }
        } catch (\Exception $e) {
            $arr['msg'] = $e->getMessage();
        }
        return $arr;
    }
}