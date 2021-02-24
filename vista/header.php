<?php
    $dir = !is_dir('modelo')?'../':'';
    include_once($dir.'modelo/validar.php');
    if(isset($_POST['cerrars'])){
        session_destroy();
        unset($_SESSION);
        header('Location: '.SERVERURL);
    }
    if(!isset($_SESSION['usuario'])){
        include_once($dir.'vista/login.php');
    }
    if(isset($_SESSION['userProfile']) && $_SESSION['userProfile']['estado']===50){
        include_once $dir.'vista/cambioPass.php';
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png">
    <link rel="stylesheet" href="extras/css/bootstrap.min.css">
    <link rel="stylesheet" href="extras/css/alertify.css">
    <link rel="stylesheet" href="extras/css/themes/default.css">
    <link rel="stylesheet" href="extras/css/all.css">
    <link rel="stylesheet" href="extras/jquery-ui-1.12.1/jquery-ui.css">
    <link href="https://fonts.googleapis.com/css?family=Orbitron|Play|Russo+One&display=swap" rel="stylesheet">
        <!-- font-family: 'Play', sans-serif;
        font-family: 'Orbitron', sans-serif;
        font-family: 'Russo One', sans-serif; -->
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;700&display=swap" rel="stylesheet">
        <!-- font-family: 'Oswald', sans-serif;  -->
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;700&display=swap" rel="stylesheet">
        <!-- font-family: 'Ubuntu', sans-serif; -->
    <link rel="stylesheet" href="css/estilos.css">
    <title>Sistema de Remises</title>
</head>