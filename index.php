<?php
require_once "settings.php";
$dir = is_dir('modelo')?"":"../";
include_once($dir.'modelo/validar.php');
if (PRODUCCION){
    if(!isset($_SESSION['allow'])){
        require_once "modelo/conexionWeb.php";
        $cuit=CUIT;
        $sql = "SELECT Habilitado FROM habilitaciones WHERE Cuit=$cuit";
        $mysqli = ConexionWeb::abrir();
        $mysqli->set_charset('utf-8');
        $stmt = $mysqli->prepare($sql);
        if($stmt!==FALSE){
            $stmt->execute();
            $res = $stmt->get_result();
            $stmt->close();
            $mysqli->close();
            $bdhab = $res->fetch_assoc();
            $habilitado = $bdhab['Habilitado']===0?false:true;
            $_SESSION['allow'] = $habilitado;
            if(!$habilitado){
                require_once("inabilitado.html");
                die;
            }
        }else{
            require_once("inabilitado.html");
            die;
        }
    }else{
        if(!$_SESSION['allow']){
            require_once("inabilitado.html");
            die;
        }
    }
}
include_once($dir.'vista/header.php');
if(isset($_SESSION['usuario']) && $_SESSION['userProfile']['estado']===0){
?>

<body>
    <div id="contenedor" class="menu-principal">
        <?php include_once($dir.'vista/menu.php'); ?>
        <div id="contenedor2" >
        </div>
    </div>
    
    <?php require_once($dir.'vista/footer.php'); ?>
</body>
<?php }?>
</html>