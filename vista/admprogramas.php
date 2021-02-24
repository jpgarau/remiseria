<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';

if($_SESSION['userProfile']['perfilid']===1){
?>
<button type="submit" class="btn btn-primary btn-lg m-2 rounded-circle float-right" name="addprograma" id="addprograma" title="Agregar Programa" data-toggle="modal"><i class="fas fa-plus"></i></button>

<div class="modal fade" id="adm_programas" tabindex="-1" role="dialog" aria-labelledby="Programas" aria-hidden="true">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Programa</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" >&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" class="form-control" id="nombre" name="nombre" title="Debe ingresar el nombre de la opción de menu en este campo">
                    <div class="invalid-feedback">
                        <strong>* Este campo no debe estar vacio.</strong>
                    </div>
                </div>
                <div class="form-group">
                    <label for="link">Link</label>
                    <input type="text" class="form-control" id="link" name="link" title="Debe ingresar el link de la opción ingresada, en este campo">
                </div>
                <div class="form-group">
                    <label for="padre" class="form-label">Padre</label>
                    <input list="padre" class="form-control" name="padre" title="Debe seleccionar si es padre de otras opciones">
                </div>
                <div class="form-group">
                    <datalist id="padre">
                        
                    </datalist>
                </div>
                <div class="form-group">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="esopcion" name="esopcion" title="Seleccione si es opción de menu">
                        <label for="esopcion" class="custom-control-label">Es opción de menu?</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="orden">Orden</label>
                    <input type="text" class="form-control" id="orden" name="orden" title="Ingrese el orden">
                    <div class="invalid-feedback">
                        <strong>* El N° de Orden debe ser un número entero positivo y no puede estar vacio.</strong>
                    </div>
                </div>
                <div>
                    <input type="hidden" id="idprograma">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="guardar" class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>
</div>

<input type="text" name="buscador" id="buscador" class="buscador" placeholder="Buscar">

<table id="tabla_programa" class="table table-hover table-sm mx-2">
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Link</th>
            <th>Padre</th>
            <th>Es opción?</th>
            <th>Orden</th>
            <th>Modificar</th>
            <th>Eliminar</th>
        </tr>
    </thead>
    <tbody>

    </tbody>
</table>

<script src="js/admprograma.js"></script>

<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');
}
?>