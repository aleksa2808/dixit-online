<?php
  include('login.php');
  include('session.php');
?>

<nav class="navbar navbar-default"  style="opacity:0.75">
  <div class="container-fluid" >
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="index.php"><img src="img/logo.png" width="125px" height="30px"></img></a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li><a data-toggle="modal" data-target="#rulesModal">Rules</a></li>
        <li><a href="#">About</a></li>
      </ul>
      
      <?php if(isset($_SESSION['login_user'])) { ?>
        <p class="navbar-text navbar-right">Logged in as <a data-toggle="modal" data-target="#loginModal"><?php echo $login_session; ?></a> (<a href="logout.php">logout</a>)</p>
      <?php } else { ?>
        <p class="navbar-text navbar-right"><a data-toggle="modal" data-target="#loginModal">login</a> | <a data-toggle="modal" data-target="#registerModal">register</a></p>
      <?php } ?>

    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

<!-- Navbar modals -->
<div class="modal fade" id="rulesModal" tabindex="-1" role="dialog" aria-labelledby="rulesModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="rulesModalLabel">Rules of the game</h4>
      </div>
      <div class="modal-body">
        <h4>Game start</h4>
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
        <hr>
        <h4>Taking turns</h4>
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
        <hr>
        <h4>Voting</h4>
        <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Got it!</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="loginModalLabel">Login to your account</h4>
      </div>
      <form action="" method="post">
        <div class="modal-body">
            <div class="form-group">
              <input type="text" class="form-control" name="username" placeholder="username">
            </div>
            <div class="form-group">
              <input type="password" class="form-control" name="password" placeholder="password">
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary" name="submit">Login</button>
        </div>
      </form>
    </div>
  </div>
  </div>
  
  <!-- login warning message snippet -->
  <?php if (!empty($error)) { ?>
    <div class="alert alert-dismissible alert-danger">
      <button type="button" class="close" data-dismiss="alert">&times;</button>
      <strong>Warning!</strong> <?php echo $error; ?>
    </div>
  <?php } ?>


  <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="registerModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="registerModalLabel">Register as a new user</h4>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="username">
          </div>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="e-mail">
          </div>
          <div class="form-group">
            <input type="password" class="form-control" id="reg-password" placeholder="password">
          </div>
          <div class="form-group">
            <input type="password" class="form-control" id="reg-conf-password" placeholder="reconfirm password">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary">Register</button>
      </div>
    </div>
  </div>
</div>