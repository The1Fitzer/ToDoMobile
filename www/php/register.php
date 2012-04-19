<?php
	include 'settings.php';
	
	/*
	* Written By: Gary Fitzpatrick
	* For: Msc in Web Tech (ARIA Project)
	* Started: 5/4/2012
	* 
	* This file contains all methods needed for registering 
	* for the application
	*/
	define('SALT','ariamobilephoneapp');
	/*
	 * Functions go here
	 * List of Functions:
	 *		1. encrypt(Encrypts users password for storage)
	 *
	 */
	function encrypt($password){
		return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, SALT, $password, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)))); 
	}
	
	print "Hello World";
?>