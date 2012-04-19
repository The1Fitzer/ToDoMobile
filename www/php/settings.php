<?php
	header("Allow-Control-Allow-Origin: *");
	/*
	* Written By: Gary Fitzpatrick
	* For: Msc in Web Tech (ARIA Project)
	* Started: 5/4/2012
	*
	* General Settings for database connection
	* and any other settings that are required
	* by the Smart Phone applications
	*/
	
	/*
	* General Error Codes to pass back through
	* any Ajax requests:
	*
	*	error1 = database connection error
	*
	*
	*/
	
	// Database connection details
	$dbname = 'db1108811_airsoft';
	$dbpass   = 'javajunkie';
	$dbuser   = 'u1108811_gary';
	$dbhost   = 'mysql519.cp.blacknight.com';
	
	// Create new mysql connection using mySQLi
	$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
	
	if($mysqli->connect_errno){
		print 'error1';
	}
	
	
?>