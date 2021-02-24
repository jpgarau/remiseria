<?php 
$dir = is_dir('modelo')?'':'../';
include_once $dir.'modelo/validar.php';
include_once $dir.'modelo/perfilprograma.php';
$perfilp = new PerfilPrograma();
$perfilp->setPerfilId($_SESSION['userProfile']['perfilid']);
$retorno = $perfilp->listarProgramas();
?>
<nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand text-warning text-uppercase" href="/remiseria" style="font-family: 'Russo One', sans-serif;"><img src="img/favicon-32x32.png" alt="GESTION REMISES"></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarGestion" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarGestion">
        <ul id="menu-principal" class="navbar-nav mr-auto mt-2 mt-lg-0">
        <?php 
                if($retorno['exito'] && $retorno['encontrados']>0){
                    $padre = '';
                    $menu = '';
                    $arrprogramas = $retorno[0];
                    $encontrados = $retorno['encontrados'];
                    for ($i=0;$i<$encontrados;$i++){
                        if($arrprogramas[$i]['esopcion']===0){
                            $menu.='<li class="nav-item dropdown">';
                            $menu.='<a href="#" class="nav-link dropdown-toggle" id="menu'.$arrprogramas[$i]['nombre'].'" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'.$arrprogramas[$i]['nombre'].'</a>';
                            $menu.='<div class="dropdown-menu" aria-labelledby="menu'.$arrprogramas[$i]['nombre'].'">';
                            $padre = $arrprogramas[$i]['nombre'];
                            continue;
                        }else if($padre!==''){
                            if($arrprogramas[$i]['padre']===$padre){
                                $menu.='<a class="dropdown-item opcion" href="" id="'.$arrprogramas[$i]['link'].'">'.$arrprogramas[$i]['nombre'].'</a>';
                                continue;
                            }else{
                                $menu.='</div></li>';
                                $padre = '';
                            }
                        }
                        $menu.='<li class="nav-item"><a class="nav-link opcion" href="" id="'.$arrprogramas[$i]['link'].'">'.$arrprogramas[$i]['nombre'].'</a></li>';
                    }
                    echo $menu;
                }
            ?>
        </ul>
        <form class="form-inline my-2 my-lg-0" method="post">
            <li class="nav-item dropdown list-group">
                <a href="#" class="nav-link dropdown-toggle text-white font-weight-bold" id="menuUsuario" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-user"></i> <?php echo $_SESSION['usuario']; ?>
                </a>
                <div class="dropdown-menu dropdown-menu-left dropdown-menu-sm-right" aria-labelledby="menuUsuario">
                    <?php if($_SESSION['userProfile']['perfilid']===1 || $_SESSION['userProfile']['perfilid']===2){?>
                        <button class="dropdown-item" id="seguridad"><i class="fas fa-shield-alt"></i> Seguridad</button>
                    <?php }?>
                    <button class="dropdown-item" id="cambioPass"><i class="fas fa-key"></i> Cambiar Contraseña</button>
                    <?php if($_SESSION['userProfile']['perfilid']===1){?>
                        <button class="dropdown-item" id="config"><i class="fas fa-cogs"></i> Configuración</button>
                    <?php }?>
                    
                    <div class="dropdown-divider"></div>

                    <button class="dropdown-item" name="cerrars" id="cerrars"><i class="fas fa-door-open"></i> Cerrar Session</button>
                </div>
            </li>
        </form>
    </div>
</nav>