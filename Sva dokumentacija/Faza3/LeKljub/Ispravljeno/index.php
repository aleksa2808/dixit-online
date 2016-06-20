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

      <div class="jumbotron" style="background-image: url(img/dixit.jpg); background-repeat: no-repeat; background-position: 50% 75%; height: 512px; max-height: 720px;">
        <div class="container">
          <h1 style="color:yellow; text-shadow: 2px 2px #ff0000;">Welcome!</h1>
          <p style="color:blue; text-shadow: 2px 2px yellow;">Step into the role of a mysterious storyteller as you slowly uncover the magical world of DiXit!</p>
          <p><a class="btn btn-primary btn-lg" role="button" data-toggle="modal" data-target="#createGameModal">Create room &raquo;</a></p>
        </div>
      </div>

      <div class="panel panel-default" style="opacity:0.6" >
        <!-- Default panel contents -->
        <div class="panel-heading clearfix">
          <h4 class="panel-title pull-left" style="padding-top: 7.5px;">Available games</h4>
          <form class="pull-right form-inline">
              <input type="text" class="form-control" placeholder="Filter games">
              <a href="lobby.php" class="btn btn-primary btn-sm">Join game</a>
          </form>
        </div>

        <!-- Table -->
        <table class="table table-hover">
          <thead> 
            <tr> 
              <th>#</th>
              <th>Game Name</th>
              <th>Owner</th>
              <th>Slots</th>
              <th>Has Password?</th>
            </tr> 
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>pedal to the metal</td>
              <td>Otto</td>
              <td>4/6</td>
              <td>Yes</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>super secret match</td>
              <td>dulehudini</td>
              <td>6/6</td>
              <td>No</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry's groove</td>
              <td>Larry</td>
              <td>2/6</td>
              <td>No</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>the game</td>
              <td>otto242</td>
              <td>4/6</td>
              <td>No</td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Sue me</td>
              <td>Mary</td>
              <td>3/6</td>
              <td>Yes</td>
            </tr>
            <tr>
              <th scope="row">6</th>
              <td>hello kitty island adventure</td>
              <td>cartman</td>
              <td>4/6</td>
              <td>No</td>
            </tr>
            <tr>
              <th scope="row">7</th>
              <td>hamill4lyf</td>
              <td>pera-detlic</td>
              <td>1/6</td>
              <td>No</td>
            </tr>
            <tr>
              <th scope="row">8</th>
              <td>dr.iggy</td>
              <td>milan</td>
              <td>3/6</td>
              <td>Yes</td>
            </tr>
            <tr>
              <th scope="row">9</th>
              <td>dixitody</td>
              <td>birdman</td>
              <td>4/6</td>
              <td>Yes</td>
            </tr>
          </tbody> 
        </table>
      </div>

      <?php include('footer.html'); ?>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="createGameModal" tabindex="-1" role="dialog" aria-labelledby="createGameModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="createGameModalLabel">Create a game</h4>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <input type="text" class="form-control" id="recipient-name" placeholder="game name">
              </div>
              <div class="form-group">
                <input type="text" class="form-control" id="recipient-name" placeholder="maximum players (4-6)">
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="recipient-name" placeholder="password (optional)">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary">Create</button>
          </div>
        </div>
      </div>
    </div>

    <?php include('scripts.html') ;?>
  </body>
</html>