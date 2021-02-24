<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
if(isset($_SESSION['usuario'])){
?>
<div class="container">
    <h3 class="text-center"><i>Informes</i></h3>
    <div class="">
        <button class="btn btn-info" id="informeViaje">Informe de Viajes Realizados</button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="inf_viajes_realizados" tabindex="-1" role="dialog" aria-labelledby="Informe de viajes realizados" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Informe de viajes realizados</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-2 col-12">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-car-alt"></i></span>
                        </div>
                        <select class="form-control" name="vehiculo" id="vehiculo" title="Seleccione el vehiculo."></select>
                    </div>
                    <div class="input-group col-6 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-plus"></i></span>
                        </div>
                        <input type="date" name="fecha" id="fecha" placeholder="Fecha" class="form-control" title="Ingrese la fecha de inicio del informe.">
                        <div class="invalid-tooltip">
                            <span id="errorFecha">* La fecha no puede ser inferior a la fecha actual</span>
                        </div>
                    </div>
                    <div class="input-group col-6 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-times"></i></span>
                        </div>
                        <input type="date" name="fechaHasta" id="fechaHasta" placeholder="Fecha Hasta" class="form-control fecha" title="Ingrese la fecha final del informe.">
                        <div class="invalid-tooltip">
                            <span id="errorFecha">* La fecha no puede ser inferior a la fecha de inicio del informe</span>
                        </div>
                    </div>
                    <div class="input-group mb-2 col-12">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                        </div>
                        <select class="form-control" name="chofer" id="chofer" title="Seleccione el chofer."></select>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" id="generar" class="btn btn-primary">Generar Informe</button>
                </div>
            </div>
        </div>
    </div>

</div>

<script src="extras/js/jspdf.min.js"></script>
<script src="js/main.js"></script>
<script src="js/infPropietarios.js"></script>
<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');}
?>