<?php

const PRODUCCION = false;

if(!PRODUCCION) {
    ini_set('error_reporting', E_ALL | E_NOTICE | E_STRICT);
    ini_set('display_errors', '1');
    ini_set('track_errors', 'On');
} else {
    ini_set('display_errors', '0');
}

const CUIT = "";
const SERVERURL = 'http://localhost/remiseria/';
const EMPRESA = 'Remiseria';
const ALARMA = 15;
const TOKEN = '';
const OPERADORA = 0;

ini_set("include_path", __DIR__);

date_default_timezone_set('America/Argentina/Cordoba');