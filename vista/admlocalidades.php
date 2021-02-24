<!-- maquetacion con HTML5 y Bootstrap -->
<button name="addlocalidad" id="addlocalidad" class="btn btn-success btn-lg m-2 rounded-circle float-right" title="Agregar Localidad" data-toggle="modal"><i class="fas fa-plus"></i></button>

<!-- Ventana Modal -->
<div class="modal fade" id="adm_localidades" tabindex="-1" role="dialog" aria-labelledby="Localidad" aria-hidden="true">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Localidad</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="localidad">Localidad</label>
          <input type="text" class="form-control" name="localidad"  id="localidad" title="Ingrese la localidad">
          <div class="invalid-feedback">
            <strong>* Este campo no debe estar vacio.</strong>
          </div>
        </div>
          <input type="hidden" id="idlocalidad">
      </div>
      <div class="modal-footer">
        <button type="button" id="guardar" class="btn btn-success">Guardar</button>
      </div>
    </div>
  </div>
</div>
<!-- Fin Ventana Modal -->

<input type="text" name="buscador" id="buscador" class="buscador" placeholder="Buscar">
<table id="tabla_localidades" class="table table-hover table-sm">
	<thead>
		<tr>
			<th>Localidad</th>
			<th>Modificar</th>
			<th>Eliminar</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>

<!-- incluir el archivo JavaScript admlocalidades.js -->
<script src="js/admlocalidades.js"></script>