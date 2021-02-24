<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir . 'modelo/validar.php';
if(isset($_SESSION['usuario'])){
?>
<div class="d-flex justify-content-center"> 
    <p class="bg-dark text-warning text-uppercase px-2 rounded-bottom mb-0">vehiculos</p>  
</div>
<div class="contenedor mx-5 clearfix">
    <label class="align-middle"><input type="text" name="buscador" id="buscador" class="form-control float-left" placeholder="Buscar"></label>
    <button type="submit" name="addvehiculo" id="addvehiculo" class="btn btn-info rounded-circle float-right" title="Agregar Vehículo" data-toggle="modal"><i class="fas fa-taxi"></i></button>
</div>

<!-- Modal -->
<div class="modal fade" id="adm_vehiculos" tabindex="-1" role="dialog" aria-labelledby="Vehiculos" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Vehículos</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="input-group float-left mb-2 col-12">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-taxi"></i></span>
                    </div>
                    <input type="text" class="form-control text-capitalize" name="marca" id="marca" placeholder="Vehículo" title="Ingrese vehículo.">
                    <div class="invalid-tooltip">
                        <strong>* Este campo no debe estar vacio.</strong>
                    </div>
                </div>
                <div class="input-group float-left mb-2 col-12 col-sm-6">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                    </div>
                    <input type="number" class="form-control" name="anio" id="anio" placeholder="Año" title="Ingrese año de fabricación del vehículo.">
                </div>
                <div class="input-group float-left mb-2 col-12 col-sm-6">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-digital-tachograph"></i></span>
                    </div>
                    <input type="text" class="form-control text-uppercase" name="patente" id="patente" placeholder="Patente" title="Ingrese la patente del vehículo.">
                </div>
                <div class="input-group float-left mb-2 col-12 col-sm-6">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                    </div>
                    <input type="date" class="form-control" name="falta" id="falta" placeholder="Fecha de Alta" title="Ingrese fecha de alta del vehículo.">
                </div>
                <div class="form-group float-left  col-12 col-sm-6">
                    <div class="custom-control align-middle my-1 custom-switch">
                        <input type="checkbox" class="custom-control-input" id="habilitado" name="habilitado" title="Seleccione si el vehículo esta habilitado para trabajar">
                        <label for="habilitado" class="custom-control-label">Habilitado?</label>
                    </div>
                </div>
                <div class="input-group float-left mb-2 col-12 col-sm-6">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                    </div>
                    <input type="date" class="form-control" name="vtoseguro" id="vtoseguro" placeholder="Vencimiento del Seguro" title="Ingrese la fecha de vencimiento del seguro del vehículo">
                </div>
                <div class="input-group float-left mb-2 col-12 col-sm-6">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-user-tie"></i></span>
                    </div>
                    <select class="form-control" name="titular" id="titular" title="Seleccione el titular del vehículo."></select>
                </div>
                <div class="input-group mb-2 col-12">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-edit"></i></span>
                    </div>
                    <textarea name="observa" class="form-control" placeholder="Observaciones" id="observa" cols="100" rows="4" title="Utilice este campo como texto libre para cualquier observación necesaría."></textarea>
                </div>
                <input type="hidden" id="idVehiculos">
            </div>
            <div class="modal-footer">
                <button type="button" id="guardar" class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>
</div>

<div class="container-flex mx-5">
    <div class="table-responsive">

        <table id="tabla_vehiculos" class="table table-hover text-center table-sm">
            <thead class="thead-dark">
                <tr>
                    <th title="Vehículo"><i class="fas fa-car-alt"></i></th>
                    <th title="Patente"><i class="fas fa-digital-tachograph"></i></th>
                    <th title="Vencimiento del Seguro"><i class="fas fa-calendar-alt"></i></th>
                    <th title="Propietario"><i class="fas fa-user-tie"></i></th>
                    <th title="Modificar"><i class="fas fa-cog"></i></th>
                    <th title="Eliminar"><i class="fas fa-trash-alt"></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
</div>
<script src="js/vehiculos.js?v=3"></script>

<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');}
?>