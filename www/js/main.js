/*function onBodyLoad()
{		
	document.addEventListener("deviceready", onBodyReady, false);
}
*/

//Testing in browser
$(document).ready(function(){
	//Setting some variables
	if(this_page == "Login" && localStorage.getItem("user")){
		window.location.href="project_splash.html";
	}
	if(this_page == "Register" && localStorage.getItem("user")){
		window.location.href="project_splash.html";
	}
	if(this_page == "project_splash"){
		var storage = localStorage.getItem('user');
		console.log(storage);
		if(storage){
			get_projects(storage);
		}
	}
	
	// JavaScript functions go here
	var is_valid_email = function(e) {
		var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(e);
	}
	function get_projects(data){
		$.ajax({
			url: 'http://www.nciairsoft.com/aria/project_list.php',
			data: {email: data},
			dataType: 'json',
			type: 'POST',
			success: function(data){
				for(idx in data){
					if(data[idx][0] == "No Projects Available. Try make one!"){
						var company = idx;
						var string = data[idx][0];
						$(".company_title").append(company);
						$(".no_projects").append(string);
					}else{
						
					}
				}
			}
		});
	}
	//End JavaScript Functions
	
	//Global Variables for all handlers go here
	login_attempts = 0;
	
	//End Global Variables
	
	//Event handlers go here
	//Log out event handler
	$("#logout").live("click", function(){
		localStorage.removeItem("user")
	});
	//Login Event Handler
	$("#login").click(function(event){
		 uid = $("#username").val();
		 pwd = $("#password").val();
		
		if(uid.length > 0 && pwd.length > 0 && is_valid_email(uid)){
			if(login_attempts < 5){
				$.ajax({
					url: 'http://www.nciairsoft.com/aria/login.php',
					crossDomain: true,
					data: {uid:uid,pwd:pwd},
					type: 'POST',
					success: function(data){
						if(data == 1){
							localStorage.setItem('user', uid)
							window.location.href='project_splash.html';
						}else{
							console.log("You have entered the wrong details. Please Try Again!");
						}
					}
				});
			}
		}else{
			if(uid.length < 1){
			   $("#usrlabel").css("color","red");
			}
			if(pwd.length < 1){
			   $("#usrlabel").css("color","red");
			}
			$("#loginError").html("Login failed, check below");
			login_attempts++;
		}
		
		if(login_attempts >= 5){
			//Code for locking Account
			alert("You have failed to login "+login_attempts+" times. Your account is now locked");
		}		
	});
	//Register Event Handler
	$("#register").live("click", function(event){
		 email    = $("#reg-username").val();
		 password = $("#reg-password").val();				 
		 confirm  = $("#confirm-password").val();
		var valid_creds = true;
		
		if(!is_valid_email(email)){
			$("#email-error").html("You did not enter a valid email<br/>").fadeOut(3000);
			valid_creds = false;
		}
		if(password != confirm){
			$("#password-error").html("Your Passwords Did Not Match").fadeOut(3000);
			valid_creds = false;
		}
		if(password === "" || confirm === ""){
			$("#password-error").html("You left the password field blank").fadeOut(3000);
			valid_creds = false;
		}
		
		if(valid_creds){
			$.ajax({
				url: 'http://www.nciairsoft.com/aria/register.php',
				crossDomain: true,
				data: {email:email,password:password},
				type: 'POST',
				success: function(data){
					if(data == 0){
						alert("User not created");
					}else if(data == 1){
						localStorage.setItem('user', email);
						window.location.href= "account.html";
					}else if(data == 2){
						alert("User Exists");
					}
				} 
			});
		}
	});
	
	// Enter all User details
	$("#details").live("click", function(event){
		first_name = $("#f_name").val();
		second_name = $("#s_name").val();
		company = $("#comp").val();
		user_name = localStorage.getItem('user');
		
		if(first_name.length > 0 && second_name.length > 0 && company.length > 0){
			$.ajax({
				url: 'http://www.nciairsoft.com/aria/account_details.php',
				crossDomain: true,
				data: {user_name:user_name,first_name:first_name,second_name:second_name,company:company},
				type: 'Post',
				success: function(data){
					if(data == 1){
						alert("Account Creation is finished! Lets Get started on something fun");
						window.location.href="project_splash.html";
					}
				}
			});
		}else{
			alert("You left something blank");
		}
	});
	
	//create new project
	
})

