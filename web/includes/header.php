<?php
	if (isset( $_SESSION['user_id'] )) {
		$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	    if (!mysqli_connect_errno()) {
	        $user_id = $_SESSION['user_id'];
		    // Get the username.
		    $user_full_name = "Unknown User";
		    $sql = "SELECT first_name, last_name FROM users WHERE id = ?";
		    if ($stmt = $mysqli->prepare($sql)) {
		        $stmt->bind_param('i', $user_id);
		        $stmt->execute();
		        $stmt->bind_result($first_name, $last_name);
		        while ($stmt->fetch()) {
		            $user_full_name = "$first_name $last_name";  
		        }
		        $stmt->close();
		    }
			if (!($page == 'user stats') && !($page == 'manage courses')) {
			    $mysqli->close();
		    }
		}
	}
?>
<div id="header">
    
    <?php if (isset( $user_full_name )) : ?>
    	<div id="navbar">
            <?php include("includes/navbar_general.php") ?>
    		<?php if ($page == 'user stats' || $page == 'manage courses') : ?>
    		    <a href="authenticate.php">Control a Mobot</a> | <a href="index.php">Watch queue</a> | 
            <?php elseif ($_SESSION['is_admin']) :?>
                <a href="user_stats.php">User stats</a> | 
            <?php endif; ?>
            <?php if ($page == 'main') : ?>
                <a href="exit_queue.php" style="">Exit Queue</a> | 
            <?php endif; ?>
            <a href="logout.php">Logout</a> | 
            <strong><?=$user_full_name ?></strong>
    	</div>
	<?php else: ?>
    	<div id="navbar">
		    <?php include("includes/navbar_general.php") ?>
    		<a href="login.php">Login with Google</a>
    	</div>
	<?php endif; ?>
    <h1><a href="http://www.barobo.com"><span>RoboQWOP</span></a></h1>
	<form action="https://www.paypal.com/cgi-bin/webscr" method="post" style="float:left;margin-right:20px;">
				<input type="hidden" name="cmd" value="_s-xclick">
				<input type="hidden" name="hosted_button_id" value="H7TP3NJC76TQJ">
				<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
				<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
			</form>
	<iframe src="http://ghbtns.com/github-btn.html?user=Barobo&repo=RoboQWOP&type=fork"
  allowtransparency="true" frameborder="0" scrolling="0" width="53px" height="20px"></iframe>
</div>
