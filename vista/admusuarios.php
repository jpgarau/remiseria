<button type="submit" class="btn btn-primary btn-lg m-2 rounded-circle float-right" name="addusuario" id="addusuario" title="Agregar Usuario" data-toggle="modal"><i class="fas fa-plus"></i></button>

<div class="modal fade" id="adm_usuarios" tabindex="-1" role="dialog" aria-labelledby="Usuarios" aria-hidden="true">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Usuario</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" >&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="apellido">Apellido</label>
                    <input type="text" class="form-control" id="apellido" name="apellido" title="Debe ingresar el apellido del usuario en este campo" value="">
                    <div class="invalid-feedback">
                        <strong>* Este campo no debe estar vacio.</strong>
                    </div>
                </div>
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" class="form-control" id="nombre" name="nombre" title="Debe ingresar el nombre del usario en este campo" value="">
                    <div class="invalid-feedback">
                        <strong>* Este campo no debe estar vacio.</strong>
                    </div>
                </div>
                <div class="form-group">
                    <label for="usuario">Usuario</label>
                    <input type="text" class="form-control" id="usuario" name="usuario" title="Debe ingresar el nick del usuario en este campo" value="">
                    <div class="invalid-feedback">
                        <strong>* Este campo no debe estar vacio.</strong>
                    </div>
                </div>
                <div class="form-group">
                    <label for="perfiles">Perfil</label>
                    <select id="select_perfiles" class="form-control" name="perfiles">
                    </select>
                    <div class="invalid-feedback">
                        <strong>* Debe seleccionar un perfil de Usuario.</strong>
                    </div>
                </div>
                <div class="form-group">
                    <label for="choferes">Chofer</label>
                    <select id="select_choferes" class="form-control" name="choferes">
                    </select>
                </div>
                <div class="form-group">
                    <label for="propietarios">Propietario</label>
                    <select id="select_propietarios" class="form-control" name="propietarios">
                    </select>
                </div>
                <div>
                    <input type="hidden" id="idusuario">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="guardar" class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>
</div>

<input type="text" name="buscador" id="buscador" class="buscador" placeholder="Buscar">

<div class="container">
    <div class="table-responsive">

        <table id="tabla_usuarios" class="table table-hover table-sm mx-2">
            <thead>
                <tr>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Perfil</th>
                    <th class="text-center">Chofer</th>
                    <th  class="text-center">Propietario</th>
                    <th>Modificar</th>
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                </tbody>
            </table>
    </div>
</div>

<script src="js/admusuarios.js"></script>