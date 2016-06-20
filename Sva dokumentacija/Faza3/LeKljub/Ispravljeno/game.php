<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>DiXit prototip</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">  
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/flatly/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container" >
    	<?php include('navbar.php'); ?>

      <div class="col-md-8">
        <div class="well">
          <img src="img/table.jpg" class="img-responsive" alt="Game table">
        </div>
      </div><!-- /.col-lg-6 -->
      <div class="col-md-3">
        <div class="panel panel-default">
          <!-- Default panel contents -->
          <div class="panel-heading clearfix">
            <h4 class="panel-title pull-left">Users in the room</h4>
          </div>
          <textarea class="form-control" placeholder="The match has started!" rows="15" readonly></textarea>
          <div class="input-group">
            <input type="text" class="form-control" placeholder="chat with others">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button">Send</button>
            </span>
          </div><!-- /input-group -->
        </div>
        <a class="btn btn-danger" href="results.php" style="width:250px">Leave</a>
      </div>

      <?php include('footer.html'); ?>
    </div>

    <?php include('scripts.html') ;?>
  </body>
</html>