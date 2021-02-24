<?php

class ConexionWeb{
    static $mysqli;
	public static function abrir(){
		$host = '151.106.98.6';
		$user = 'u945187807_remoto';
		$pass = '4g0nT3ch';
		$bbdd = 'u945187807_mgcagontech';
		$mysqli = new mysqli($host,$user,$pass,$bbdd);
		return $mysqli;
	}
}