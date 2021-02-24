<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
if(isset($_SESSION['usuario'])){
?>
<div style="height: 89vh;">

    <div class="d-flex justify-content-around h-50 w-100 container">
        <div class="table-responsive">
            <table id="tabla_vehiculos" class="table table-hover table-sm table-info text-center my-1">
                <thead>
                    <tr>
                        <th>Marca</th>
                        <th>Patente</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class="d-flex justify-content-center mx-1 w-50">
            <p id="terminarServicio" class="align-self-center rounded-circle text-danger mx-auto display-4" title="Terminar el servicio seleccionado"><i class="fas fa-arrow-alt-circle-up"></i></p>
            <p id="iniciarServicio" class="align-self-center rounded-circle text-success mx-auto display-4" title="Iniciar servicio"><i class="fas fa-arrow-alt-circle-down"></i></p>
        </div>
        <div class="table-responsive">
            <table id="tabla_choferes" class="table table-hover table-sm table-info text-center my-1">
                <thead>
                    <tr>
                        <th>Chofer</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <div class="d-flex h-50 mt-2 container">
        <div class="table-responsive">
            <table id="tabla_servicios" class="mx-auto table table-hover table-sm table-success w-50 text-center my-1">
                <thead>
                    <tr>
                        <th>Vehículo</th>
                        <th>Patente</th>
                        <th>Chofer</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>

<script src="js/main.js"></script>
<script src="js/servicios.js"></script>

<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');}
?>