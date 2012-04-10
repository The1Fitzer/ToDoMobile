function onBodyLoad()
{		
	document.addEventListener("deviceready", onBodyReady, false);
}

function onBodyReady()
{
	// JavaScript functions go here
	var is_valid_email = function(e) {
		var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(e);
	}
	//End JavaScript Functions
	
	//Event handlers go here
	$("#login").click(function(event){
		var uid = $("#username").val();
		var pwd = $("#password").val();
		
		if(uid.length > 0 && pwd.length > 0){
			window.location="page2.html";
		}else{
			if(uid.length < 1){
			   $("#usrlabel").css("color","red");
			}
			if(pwd.length < 1){
			   $("#usrlabel").css("color","red");
			}
			$("#loginError").html("Login failed, check below");
		}
	});
	
	$("#register").live("click", function(event){
		var email    = $("#username").val();
		var password = $("#password").val();				 
		var confirm  = $("#confirm-password").val();
		var valid_creds = true;
		
		alert(email);
		
		/*if(!is_valid_email(email)){
			$("#email-error").html("You did not enter a valid email<br/>").fadeOut(3000);
			valid_creds = false;
		}
		if(password != confirm){
			$("#password-error").html("Your Passwords Did Not Match").fadeOut(3000);
			valid_creds = false;
		}
		
		if(valid_creds){
			alert('everything is ok');
		}*/
		
	});
}
