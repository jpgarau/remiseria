<!-- maquetacion con HTML5 y Bootstrap -->
<button name="addcondIva" id="addcondIva" class="btn btn-success btn-lg m-2 rounded-circle float-right" title="Agregar Condicion de IVA" data-toggle="modal"><i class="fas fa-plus"></i></button>

<!-- Ventana Modal -->

<div class="modal fade" id="adm_condIva" tabindex="-1" role="dialog" aria-labelledby="CondicionIVA" aria-hidden="true">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Condicion de IVA</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="desccondiva">Descripcion</label>
          <input type="text" class="form-control" name="desccondiva"  id="desccondiva" title="Ingrese la descripcion">
          <div class="invalid-feedback">
            <strong>* Este campo no debe estar vacio.</strong>
          </div>
        </div>
          <input type="hidden" id="idcondiva">
      </div>
      <div class="modal-footer">
        <button type="button" id="guardar" class="btn btn-success">Guardar</button>
      </div>
    </div>
  </div>
</div>
<!-- Fin Ventana Modal -->

<input type="text" name="buscador" id="buscador" class="buscador" placeholder="Buscar">
<table id="tabla_condIva" class="table table-hover table-sm">
	<thead>
		<tr>
			<th>IVA</th>
			<th>Modificar</th>
			<th>Eliminar</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>

<!-- incluir el archivo JavaScript admcondiva.js -->
<script src="js/admcondiva.js"></script>