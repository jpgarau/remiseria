<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
if(isset($_SESSION['usuario'])){
?>
<div class="sidenav" id="mySidenav">
    <span class="closebtn" onclick="closeNav()">&times;</span>
    <div class="row align-items-top h-75">
        <div class="col text-center">
            <table id="tabla_base" class="table table-light table-hover table-sm">
                <thead>
                    <tr>
                        <th colspan="3">BASE</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class="col text-center">
        <table id="tabla_zona1" class="table table-light table-hover table-sm">
                <thead>
                    <tr>
                        <th colspan="3">Zona 1</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class="col text-center">
        <table id="tabla_zona2" class="table table-light table-hover table-sm">
                <thead>
                    <tr>
                        <th colspan="3">Zona 2</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>
<div class="d-flex justify-content-center">
    <p id="downNav" class="text-center m-0 bg-dark px-5 text-white rounded-bottom"><i class="fas fa-chevron-down"></i></p>
</div>
<div id="consola" style="height: 93vh;">
    <div class="row m-0 p-0 h-50 overflow-hidden">
        <div id="calendar" class="col-3">
            <div id="calendario"></div>
            <div id="wrap">
                <div class="widget">
                    <div class="fecha">
                        <p id="diaSemana" class="diaSemana"></p>
                        <p id="dia" class="dia"></p>
                        <p>de </p>
                        <p id="mes" class="mes"></p>
                        <p>del </p>
                        <p id="year" class="year"></p>
                    </div>

                    <div class="reloj">
                        <p id="horas" class="horas"></p>
                        <p>:</p>
                        <p id="minutos" class="minutos"></p>
                        <p>:</p>
                        <div class="caja-segundos">
                            <p id="ampm" class="ampm"></p>
                            <p id="segundos" class="segundos"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="resevaciones" class="col">
            <div id="reservas">
                <!-- <p class="text-center font-weight-bold">RESERVAS</p> -->
                <div class="table-responsive">

                    <table id="tabla_reservas" class="table table-hover table-sm">
                        <thead class="thead-dark">
                            <tr>
                                <th colspan="6" class="text-center">RESERVAS</th>
                            </tr>
                            <tr>
                                <th>Cliente</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
            <div id="botones_reservas" class="d-flex bg-dark  mt-3 p-1 rounded justify-content-around">
                <button class="btn btn-lg btn-outline-light" id="btn_nueva_reserva" title="Nueva reserva"><i class="fas fa-thumbtack"></i></button>
                <button class="btn btn-lg btn-outline-light" id="btn_cancelar_reserva" title="Cancelar reserva actual"><i class="fas fa-trash-alt"></i></button>
                <!-- <button class="btn btn-lg btn-outline-light" title="Cancelar bloque de reservas"><i class="fas fa-dumpster"></i></button> -->
                <button class="btn btn-lg btn-outline-light" id="btn_asignar_viaje" title="Asignar reserva al servicio actual"><i class="fas fa-taxi"></i></button>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modal_nueva_reserva" tabindex="-1" role="dialog" aria-labelledby="Reservas" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Reservas</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="input-group float-left mb-2 col-12">
                        <div class="input-group-prepend">
                            <label for="cmbCliente" class="input-group-text"><i class="fas fa-user"></i></label>
                        </div>
                        <select class="form-control cmbCliente" name="cmbCliente" title="Puede seleccionar un cliente al cual asignar la reserva"></select>
                    </div>
                    <div class="input-group col-6 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-plus"></i></span>
                        </div>
                        <input type="date" name="fecha" id="fecha" placeholder="Fecha de reserva" class="form-control fecha" title="Ingrese la fecha de la reserva.">
                        <div class="invalid-tooltip">
                            <span id="errorFecha">* La fecha no puede ser inferior a la fecha actual</span>
                        </div>
                    </div>
                    <div class="input-group col-5 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-clock"></i></span>
                        </div>
                        <input type="time" name="hora" id="hora" placeholder="Hora de reserva" class="form-control" title="Ingrese la hora de la reserva.">
                        <div class="invalid-tooltip">
                            <span id="errorHora">* La hora no puede ser inferior a la hora actual</span>
                        </div>
                    </div>
                    <div class="input-group col-6 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-times"></i></span>
                        </div>
                        <input type="date" name="fechaHasta" id="fechaHasta" placeholder="Fecha de reserva" class="form-control" title="Ingrese la fecha de la reserva.">
                        <div class="invalid-tooltip">
                            <span id="errorFechaH">* La fecha hasta no puede ser inferior a la fecha desde</span>
                        </div>
                    </div>
                    <div class="form-group float-left col-6">
                        <div class="custom-control align-middle my-1 custom-switch">
                            <input type="checkbox" class="custom-control-input" id="finSemana" name="finSemana" title="Seleccione si tomaran en cuenta o no Sabados y Domingos">
                            <label for="finSemana" class="custom-control-label py-1">Sabados y Domingos?</label>
                        </div>
                    </div>
                    <div class="input-group col-12 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-times"></i></span>
                        </div>
                        <input type="text" name="origen" id="origen" placeholder="origen" class="form-control origen" title="Ingrese la dirección de origen.">
                        <div class="invalid-tooltip">
                            <span id="errorOrigen">* Este campo no debe estar vacio.</span>
                        </div>
                    </div>
                    <div class="input-group col-12 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-times"></i></span>
                        </div>
                        <input type="text" name="destino" id="destino" placeholder="destino" class="form-control" title="Ingrese la dirección de destino.">
                    </div>
                    <div class="input-group mb-2 col-12">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-edit"></i></span>
                        </div>
                        <textarea name="observa" class="form-control" placeholder="Observaciones" id="observa" cols="100" rows="4" title="Utilice este campo como texto libre para cualquier observación necesaría."></textarea>
                    </div>
                    <input type="hidden" id="idReserva">
                </div>
                <div class="modal-footer">
                    <button type="button" id="guardar" class="btn btn-primary">Guardar</button>
                </div>
            </div>
        </div>
    </div>


    <div class="row m-0 p-0 h-50">
        <div id="viajes" class="col-12 m-0 px-1">
            <div id="botones_viajes" class="col-1 bg-dark rounded float-left py-3">
                <button class="btn btn-block btn-outline-light my-3" id="btn-nuevo-viaje" title="Nuevo Viaje"><i class="fas fa-taxi"></i></i></button>
                <button class="btn btn-block btn-outline-light my-4" id="btn-informe-turno" title="Informe del turno"><i class="fas fa-file-invoice-dollar"></i></button>
                <button class="btn btn-block btn-outline-light my-4" id="btn-cancelar-viaje" title="Cancelar Viaje"><i class="fas fa-trash-alt"></i></button>
            </div>
            <div id="choferes_viajes" class="col-11 m-0 mx-auto float-left">
                <div class="col-12 p-0">
                    <ul id="menu-servicios" class="nav nav-tabs flex-nowrap">
                    </ul>
                </div>
                <div class="table-responsive ">
                    <table id="tabla_viajes" class="table table-hover table-sm border-top-0">
                        <thead class="thead-dark">
                            <tr>
                                <th>H. Salió</th>
                                <th>H. Libre</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th class='text-right'>Importe</th>
                                <th class='text-right'>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modal_nuevo_viaje" tabindex="-1" role="dialog" aria-labelledby="Viajes" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Viajes</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="input-group float-left mb-2 col-12">
                        <div class="input-group-prepend">
                            <label for="cmbCliente" class="input-group-text"><i class="fas fa-user"></i></i></label>
                        </div>
                        <select class="form-control cmbCliente" name="cmbCliente" title="Puede seleccionar un cliente al cual asignar el viaje"></select>
                    </div>
                    <div class="input-group col-6 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-plus"></i></span>
                        </div>
                        <input type="date" name="fecha" id="fecha" placeholder="Fecha de viaje" class="form-control fecha" title="Ingrese la fecha del viaje">
                        <div class="invalid-tooltip">
                            <span id="errorFecha">* La fecha no puede ser anterior a la fecha actual</span>
                        </div>
                    </div>
                    <div class="input-group col-5 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-clock"></i></span>
                        </div>
                        <input type="time" name="hora" id="hora" placeholder="Hora de viaje" class="form-control" title="Ingrese la hora del viaje.">
                        <div class="invalid-tooltip">
                            <span id="errorHora">* La hora no puede ser inferior a la hora actual</span>
                        </div>
                    </div>
                    <div class="input-group col-12 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-times"></i></span>
                        </div>
                        <input type="text" name="origen" id="origen" placeholder="origen" class="form-control origen" title="Ingrese la dirección de origen.">
                        <div class="invalid-tooltip">
                            <span id="errorOrigen">* Este campo no debe estar vacio.</span>
                        </div>
                    </div>
                    <div class="input-group col-12 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-calendar-times"></i></span>
                        </div>
                        <input type="text" name="destino" id="destino" placeholder="destino" class="form-control" title="Ingrese la dirección de destino.">
                    </div>
                    <div class="input-group col-5 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-clock"></i></span>
                        </div>
                        <input type="time" name="horaLibre" id="horaLibre" placeholder="Hora de libre" class="form-control" title="Ingrese la hora en que termino el viaje y quedo libre el servicio.">
                        <div class="invalid-tooltip">
                            <span id="errorHoraLibre">* La hora no puede ser inferior a la hora inicial del viaje</span>
                        </div>
                    </div>
                    <div class="input-group col-5 float-left mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-money-bill-wave"></i></span>
                        </div>
                        <input type="number" step="0.01" name="importe" id="importe" placeholder="importe" class="form-control" title="Importe del viaje">
                        <div class="invalid-tooltip">
                            <span id="errorHoraLibre">* El importe no puede ser un Nº negativo</span>
                        </div>
                    </div>
                    <div class="input-group mb-2 col-12">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-edit"></i></span>
                        </div>
                        <textarea name="observa" class="form-control" placeholder="Observaciones" id="observa" cols="100" rows="4" title="Utilice este campo como texto libre para cualquier observación necesaría."></textarea>
                    </div>
                    <input type="hidden" id="idViaje">
                </div>
                <div class="modal-footer">
                    <button type="button" id="btn-guardar-viaje" class="btn btn-primary">Guardar</button>
                </div>
            </div>
        </div>
    </div>

</div>

<script src="extras/js/jspdf.min.js"></script>
<script src="js/main.js"></script>
<script src="js/consola.js"></script>
<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');}
?>