
<button name="addperfil" id="addperfil" class="btn btn-primary btn-lg m-2 rounded-circle float-right" title="Agregar Perfil" data-toggle="modal"><i class="fas fa-plus"></i></button>

<!-- Modal -->
<div class="modal fade" id="adm_perfiles" tabindex="-1" role="dialog" aria-labelledby="Perfiles" aria-hidden="true">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Perfil</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <label for="descripcion">Descripci&oacute;n</label>
          <input type="text" class="form-control" name="descripcion"  id="descripcion" title="Ingrese la descripción del perfil">
          <div class="invalid-feedback">
            <strong>* Este campo no debe estar vacio.</strong>
          </div>
        </div>
          <input type="hidden" id="idperfil">
      </div>
      <div class="modal-footer">
        <button type="button" id="guardar" class="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="perfilprog" tabindex="-1" role="dialog" aria-labelledby="Perfiles" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="tit_per_prog"></h5>
        <input type="hidden" id="perfilselect">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" id="guardar_perfil" class="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>

<input type="text" name="buscador" id="buscador" class="buscador" placeholder="Buscar">
<table id="tabla_perfil" class="table table-hover table-sm">
	<thead>
		<tr>
			<th>Descripci&oacute;n</th>
			<th>Modificar</th>
			<th>Eliminar</th>
			<th>Programas</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>


<script src="js/admperfil.js"></script>