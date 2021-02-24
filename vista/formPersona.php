<?php
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
if(isset($_SESSION['usuario'])){
?>
<div class="input-group float-left mb-2 col-12 col-md-6 col-lg-4">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fas fa-user"></i></span>
    </div>
    <input type="text" class="form-control " name="apynom" id="apynom" placeholder="Apellido y Nombre" title="Ingrese apellido y nombre.">
    <div class="invalid-tooltip">
        <strong>* Este campo no debe estar vacio.</strong>
    </div>
</div>
<div class="input-group float-left mb-2 col-12 col-md-6 col-lg-4">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
    </div>
    <input type="text" class="form-control " placeholder="Dirección" name="direccion" id="direccion" title="Ingrese el domicilio.">
</div>
<div class="input-group float-left mb-2 col-12 col-sm-6 col-lg-4">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fas fa-city"></i></span>
    </div>
    <select class="form-control" name="idlocalidad" aria-placeholder="Ciudad" id="idlocalidad" title="Seleccione la localidad.">
    </select>
</div>
<div class="input-group float-left mb-2 col-12 col-sm-6 col-lg-4">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fas fa-phone"></i></span>
    </div>
    <input type="number" class="form-control" placeholder="Teléfono" id="telefono" name="telefono" title="Ingrese el Nº de teléfono.">
</div>
<div class="input-group float-left mb-2 col-sm-5 col-lg-4">
    <div class="input-group-prepend">
        <label for="cmbDoc" class="input-group-text"><i class="fas fa-id-card"></i></label>
    </div>
    <select class="form-control" name="tipodoc" id="cmbDoc" title="Seleccione el tipo de documento."></select>
</div>
<div class="input-group float-left mb-2 col-sm-7 col-lg-4">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fas fa-id-card"></i></span>
    </div>
    <input type="number" name="numdni" id="numdni" placeholder="Nº Documento" class="form-control" title="Ingrese el Nº de documento.">
    <div class="invalid-tooltip">
        <strong id="errorNumDni">* Este campo no debe estar vacio.</strong>
    </div>
</div>
<div class="input-group float-left mb-2 col-12 col-lg-8">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fas fa-at"></i></span>
    </div>
    <input type="email" name="email" id="email" class="form-control" placeholder="e_mail" title="Ingrese el correo electronico. Por ejemplo: mi_email@gmail.com">
</div>
<div class="input-group float-left mb-2 col-sm-7 col-md-5 col-lg-4">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
    </div>
    <input type="date" name="fecnac" id="fecnac" placeholder="Fecha de nacimiento" class="form-control" title="Ingrese la fecha de nacimiento.">
</div>
<div class="input-group float-left mb-2 col-sm-5 col-md-4 col-lg-3">
    <div class="input-group-prepend">
        <span class="input-group-text">IVA</span>
    </div>
    <select name="cmbIva" id="cmbIva" class="form-control" title="Seleccione la condición ante el AFIP."></select>
</div>
<div class="input-group float-left mb-2 col-sm-7 col-md-5 col-lg-4">
    <div class="input-group-prepend">
        <span class="input-group-text">CUIT</span>
    </div>
    <input type="text" class="form-control" name="cuit" id="cuit" title="Ingrese el Nº de CUIT." pattern="^[0-9]{2}-[0-9]{8}-[0-9]$">
    <div class="invalid-tooltip" >
        <strong id="errorCuit">* Este campo no debe estar vacio.</strong>
    </div>
</div>
<div class="input-group float-left mb-2 col-sm-7 col-md-6 col-lg-5">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fab fa-telegram-plane"></i></span>
    </div>
    <select name="cmbTelegram" id="cmbTelegram" class="form-control" title="Seleccione id o usuario de Telegram"></select>
    <div class="ml-2">
        <button id="actTelegram" class="btn btn-outline-success rounded-circle" title="Actualizar datos Telegram"><i class="fas fa-sync-alt"></i></button>
    </div>
</div>

<?php 
}else{
    header('HTTP/1.1 401');
    die('Credenciales incorrectas');}
?>