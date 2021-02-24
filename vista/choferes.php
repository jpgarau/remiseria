<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir . 'modelo/validar.php';
if(isset($_SESSION['usuario'])){
?>

<div class="d-flex justify-content-center"> 
    <p class="bg-dark text-warning text-uppercase px-2 rounded-bottom mb-0">choferes</p>  
</div>
<div class="contenedor mx-5 mt-2 clearfix">
    <label class="align-middle"><input type="text" name="buscador" id="buscador" class="form-control float-left" placeholder="Buscar"></label>
    <button type="submit" name="addchofer" id="addchofer" class="btn btn-info rounded-circle float-right" title="Agregar Chofer" data-toggle="modal"><i class="fas fa-user-plus"></i></button>
</div>

<!-- Modal -->
<div class="modal fade" id="adm_choferes" tabindex="-1" role="dialog" aria-labelledby="Choferes" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Chofer</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                <?php
                    include_once $dir.'vista/formPersona.php'; 
                ?>
                <div class="input-group float-left mb-2 col-sm-6 col-md-4 col-lg-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-percent"></i></span>
                    </div>
                    <input type="number" name="comis" min=0 max=100 placeholder="Comisíon" class="form-control" id="comis" title="Ingrese el porcentaje de Comision percibida por el chofer.">
                </div>
                <div class="input-group float-left mb-2 col-sm-6 col-md-4">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-id-card"></i></span>
                    </div>
                    <input type="text" name="licencia" id="licencia" class="form-control" placeholder="Nº licencia" title="Ingrese el Nº de Licencia del chofer.">
                </div>
                <div class="input-group mb-2 col-12">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-edit"></i></span>
                    </div>
                    <textarea name="observaciones" class="form-control" placeholder="Observaciones" id="observaciones" cols="100" rows="4" title="Utilice este campo como texto libre para cualquier observación necesaría."></textarea>
                </div>
                <input type="hidden" id="idchofer">
            </div>
            <div class="modal-footer">
                <button type="button" id="guardar" class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>
</div>

<div class="container-flex mx-5">
    <div class="table-responsive">

        <table id="tabla_choferes" class="table table-hover text-center table-sm">
            <thead class="thead-dark">
                <tr>
                    <th><i class="fas fa-users"></i></th>
                    <th><i class="fas fa-phone"></i></th>
                    <th><i class="fas fa-city"></i></th>
                    <th><i class="fas fa-at"></i></th>
                    <th><i class="fas fa-cog"></i></th>
                    <th><i class="fas fa-trash-alt"></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
</div>
<script src="js/main.js"></script>
<script src="js/choferes.js?v=8"></script>

<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');}
?>