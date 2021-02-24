<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
if(isset($_SESSION['usuario'])){
?>
<div class="container h-100">
    <h3 class="text-center"><i>Cuenta Corriente</i></h3>
    <div class="row">
        <div class="form-group col-md-4 col-lg-6">
            <div class="input-group">
                <input list="list-clientes" class="form-control form-control-sm" placeholder="Cliente/Razón Social" name="cliente" id="cliente" title="Seleccione un cliente" aria-describedby="button-limpiar">
                <datalist id="list-clientes">
                </datalist>
                <div class="input-group-append">
                    <button class="btn btn btn-outline-secondary btn-sm" type="button" id="button-limpiar" aria-hidden="true"><i class="fas fa-times-circle"></i></button>
                </div>
            </div>
        </div>
        <div class="form-group col-6 col-sm-4 col-md-3 col-lg-2">
            <input type="date" name="fechaDesde" id="fechaDesde" class="form-control form-control-sm" title="Seleccione desde que fecha quiere realizar el filtro de la Cta. Cte.">
        </div>
        <div class="form-group col-6 col-sm-4 col-md-3 col-lg-2">
            <input type="date" name="fechahasta" id="fechaHasta" class="form-control form-control-sm" title="Seleccione hasta que fecha quiere realizar el filtro de la Cta. Cte.">
        </div>
        <div class="form-group col align-self-end">
            <input type="button" id="filtrar" value="Filtrar" class="btn btn-primary btn-sm">
        </div>
    </div>

<div class="modal fade" id="movimiento_cta_cte" tabindex="-1" role="dialog" aria-labelledby="Movimiemtos" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="movimientosLabel">Movimiento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="d-flex justify-content-center">
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <input class="form-check-input" type="radio" name="db_rc" id="debito" value="DB"> DEBITO
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label">
                            <input class="form-check-input" type="radio" name="db_rc" id="credito" value="RC" checked> CREDITO
                        </label>
                    </div>
                </div>
                <div class="form-group row my-3">
                    <label for="importe" class="col-3 col-form-label">Importe</label>
                    <div class="col-9">
                        <input type="number" name="importe" id="importe" step="0.01" class="form-control">
                    </div>
                </div>
                <div class="form-group row my-3">
                    <label for="concepto" class="col-3 col-form-label">Concepto</label>
                    <div class="col-9">
                        <textarea name="observa" id="observa" class="form-control"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="guardar" class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>
</div>


    <div class="row" id="det_ctacte">
        <div class="table-responsive">
            <table id="tabla_ctacte" class="table table-hover table-bordered table-sm border-top-0">
                <thead class="thead-dark">
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>Movil</th>
                        <th class='text-right'>Debe</th>
                        <th class='text-right'>Haber</th>
                        <th class='text-right'>Total</th>
                        <th class='d-none'></th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>
    <div class="container pt-2 mb-2">

        <div class="row justify-content-between align-items-end">
            <div class="botonera d-flex d-lg-block col-12 col-lg-4 justify-content-around">
                <button class="btn btn-secondary" id="btn_movCtaCte">Movimiento</button>
                <button class="btn btn-danger" id="btn_borrar">Borrar</button>
                <button class="btn btn-secondary" id="btn_imprimirResumen">Imprimir</button>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mt-3">
                <div class="row text-right">
                    <p class="font-weight-bold col-form-label col-6">Total Resumen</p>
                    <p id="total_resumen" class="form-control col-6 m-0"></p>
                </div>
            </div>
            <div class="resumen col-md-6 col-12 col-lg-4 align-self-end mt-3">
                <div class="row text-right">
                    <p class="font-weight-bold col-form-label col-6">SALDO Cta.Cte.</p>
                    <p id="saldo" class="form-control col-6 m-0"></p>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="extras/js/jspdf.min.js"></script>
<script src="extras/js/NumeroALetras.js"></script>
<script src="js/main.js"></script>
<script src="js/ctacte.js"></script>
<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');}
?>