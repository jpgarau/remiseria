<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir . 'modelo/validar.php';
if(isset($_SESSION['usuario'])){
?>
<div  class="container" id="pantallaMovil">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
        <div id="errorServicio" class="col d-none mb-2">
            <div class='alert alert-danger mb-0 h5'>No hay ningún servicio activo. Verifique con la Base.</div>
        </div>
        <div class="col"> 
            <div class="bg-info pt-3 px-1">
                <p class="text-center mb-2 h5 text-white">Proximo Destino</p>
                <div class="bg-light text-center h5 p-1" id="origenMovil" role="status">...</div>
                <button id="actualizarDestino" class="btn btn-block text-white py-1" value="
                <?php echo $_SESSION['userProfile']['idChofer'];?>
                "><i class="fas fa-sync-alt"></i></button>
            </div>
        </div>
        <div class="col mt-2" id="div_tomo_viaje">
            <button class="btn btn-secondary btn-block py-3 font-weight-bolder" id="tomo_viaje" disabled><i class="fas fa-check"></i> Tomar Viaje</button>
        </div>
        <div class="col mt-2">
            <button class="btn btn-success btn-block py-3 font-weight-bolder" id="libre_base"><i class="fas fa-place-of-worship"></i> BASE</button>
        </div>
        <div class="col mt-2">
            <button class="btn btn-success btn-block py-3 font-weight-bolder" id="libre_zona1"><i class="fas fa-map-marker-alt"></i> Zona 1</button>
        </div>
        <div class="col mt-2">
            <button class="btn btn-success btn-block py-3 font-weight-bolder" id="libre_zona2"><i class="fas fa-map-marker-alt"></i> Zona 2</button>
        </div>
        <div class="col mt-2">
            <button class="btn btn-warning btn-block py-3 font-weight-bolder" id="fuera_servicio"><i class="fas fa-comment-slash"></i> FUERA DE SERVICIO</button>
        </div>
        <div class="col mt-2">
            <button class="btn btn-info btn-block py-3 font-weight-bolder" id="resumen_turno" value="<?php echo $_SESSION['userProfile']['idChofer'];?>"><i class="fas fa-file-invoice-dollar"></i> RESUMEN DE TURNO</button>
        </div>
    </div>
</div>

<script src="extras/js/jspdf.min.js"></script>
<script src="js/main.js"></script>
<script src="js/consolaMovil.js"></script>
<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');}
?>