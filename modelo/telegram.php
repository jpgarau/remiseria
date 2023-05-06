<?php

include_once 'validar.php';
include_once 'conexion.php';
require_once '../settings.php';
class Telegram{
    private $telid;
    private $last_name;
    private $firts_name;
    private $idOperadora = OPERADORA;
    private $token = TOKEN;
    private $website = 'https://api.telegram.org/bot';

    public function __construct()
    {
        $driver = new mysqli_driver();
        $driver->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
        $this->telid = 0;
        $this->last_name = '';
        $this->firts_name = '';
    }

    // getters y setters
    public function __get($name)
    {
        return $this->{$name};
    }
    public function __set($name, $value)
    {
        $this->{$name} = $value;
    }

    public function actualizarTabla(){
        $arr = array('exito'=>false, 'msg'=>'Error al actualizar la tabla');
        if($this->token !== ""){
            try {
                $existentes = $this->listar()[0];
                $url = $this->website.$this->token;
                $update = file_get_contents($url.'/getUpdates');
                $update = json_decode($update, TRUE);
                $result = $update['result'];
                $arrNuevos = array();
                $sql = 'INSERT INTO telegram (telid, last_name, first_name) VALUES ';
                if(count($result)>0){
                    foreach ($result as $mensaje) {
                        $chatid = $mensaje['message']['chat']['id'];
                        $last_name = $mensaje['message']['chat']['last_name'];
                        $first_name = $mensaje['message']['chat']['first_name'];
                        if(!in_array($chatid,array_column($arrNuevos, 'id'))){
                            $agregar = array('id'=>$chatid,'last_name'=>$last_name,'first_name'=>$first_name);
                            array_push($arrNuevos,$agregar);
                        }
                    }
                    if(count($arrNuevos)>0){
                        $contador = 0;
                        foreach ($arrNuevos as $nuevoTUser) {
                            $chatid = $nuevoTUser['id'];
                            $last_name = $nuevoTUser['last_name'];
                            $first_name = $nuevoTUser['first_name'];
                            if(!in_array($chatid, array_column($existentes, 'telid'))){
                                if($contador > 0){
                                    $sql .= ',';
                                }
                                $sql .= '('.$chatid.',"'.$last_name.'","'.$first_name.'") ';
                                $contador ++;
                            }
                        }
                        if($contador > 0){
                            echo $sql;
                            $mysqli = Conexion::abrir();
                            $stmt = $mysqli->prepare($sql);
                            if($stmt!==FALSE){
                                $stmt->execute();
                                $stmt->close();
                                $mysqli->close();
                            }
                        }
                    }
                }
                $arr = array('exito'=>true, 'msg'=>'');
            } catch (Exception $e) {
                $arr['msg'] = $e->getMessage();
            }
        }else{
            $arr = array('exito'=>true, 'msg'=>'');
        }
        return $arr;
    }

    public function enviarTE($chatid, $msg){
        if($this->token !== ""){
            $url = $this->website.$this->token.'/sendMessage';
            $url .= '?chat_id='.$chatid.'&parse_mode=HTML&text='.urlencode($msg);
            file_get_contents($url);
        }
    }
    
    public function enviarTEOperadora($msg){
        if($this->token !== ""){
        $url = $this->website.$this->token.'/sendMessage';
        $url .= '?chat_id='.$this->idOperadora.'&parse_mode=HTML&text='.urlencode($msg);
        file_get_contents($url);
        }
    }

    public function listar(){
        $arr = array('exito'=>false, 'msg'=>'Error al listar');
        if($this->token !== ""){
            try {
                $sql = 'SELECT * FROM telegram';
                $mysqli = Conexion::abrir();
                $stmt = $mysqli->prepare($sql);
                if($stmt!==FALSE){
                    $stmt->execute();
                    $rs = $stmt->get_result();
                    $encontrados = $rs->num_rows;
                    $stmt->close();
                    $arrTel = $rs->fetch_all(MYSQLI_ASSOC);
                    $mysqli->close();
                    $arr = array('exito'=>true, 'msg'=>'','encontrados'=>$encontrados, $arrTel);
                }
            } catch (Exception $e) {
                $arr['msg'] = $e->getMessage();
            }
        }else{
            $arr = array('exito'=>true, 'msg'=>'', 'encontrados'=>0);
        }
        return $arr;
    }
}