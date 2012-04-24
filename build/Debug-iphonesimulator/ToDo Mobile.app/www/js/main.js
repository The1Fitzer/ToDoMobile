function onBodyLoad()
{		
	document.addEventListener("deviceready", onBodyReady, false);
}


//Testing in browser
function onBodyReady(){

	//Global Variables for all handlers go here
	login_attempts = 0;
	ajax_site = "http://www.nciairsoft.com/aria/";
	//End Global Variables
	
	//call functions that do checks on device ready
	if(!check_if_user_has_internet()){
		window.location.href="no_internet.html";
	}
	
	if(this_page == "no_internet"){
		if(check_if_user_has_internet()){
			window.location.href="index.html";
		}
	}
	
	//Do checks for certain pages
	if(this_page == "Login" && localStorage.getItem("user")){
		window.location.href="project_splash.html";
	}
	if(this_page == "Register" && localStorage.getItem("user")){
		window.location.href="project_splash.html";
	}
	if(this_page == "project_splash"){
		var storage = localStorage.getItem('user');
		if(storage){
			get_projects(storage);
		}else{
			window.location.href="index.html";
		}
	}
	if(this_page == "to_do_list"){
		var name = "proj";
		var user = localStorage.getItem('user');
		var qs = get_query_string(name);
		get_todo_list(qs, user);
		$("#text_todo").attr('href','new_text_todo.html?proj='+qs);
	}
	if(this_page == "new_text_todo"){
		var user = localStorage.getItem('user');
		get_list_of_team_members(user);
		var name = "proj";
		var qs = get_query_string(name);
	}
	if(this_page == "to_do_details"){
		var name = "todo";
		var qs = get_query_string(name);
		get_comments_list(qs);
	}
	
	// JavaScript functions go here
	var is_valid_email = function(e) {
		var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(e);
	}
	function check_if_user_has_internet(){
		var currentNetwork = navigator.network.connection.type;
	
		if(currentNetwork == Connection.UNKNOWN || currentNetwork == Connection.NONE){
			return false;
		}else{
			return true;
		}
	}
	function get_projects(data){
		$.ajax({
			url: ajax_site+'project_list.php',
			data: {email: data},
			dataType: 'json',
			type: 'POST',
			success: function(data){
				if(typeof(data) == "string"){
					$(".no_projects").html(data);
				}else{
					for(idx in data){
						var heading = "<h2>"+idx+" - <small>projects currently available.</small></h2>";
						$('.company_title').append(heading);
						
						var html = $("#project_list").html();
						for(i in data[idx]){
							var pname = data[idx][i][0];
							var pid = data[idx][i][1];
							var name = data[idx][i][2];
							html +='<li><a href="todolist.html?proj='+pid+'" id="'+pid+'"><h2>';
							html += pname;
							html += '</h2><small> created by: '+name+'</small></a>';
							html +='</li>';
						}
					}
					$("#project_list").html(html).listview("refresh");
				}
					
				}		
		});
	}
	function get_query_string(){
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		if(results == null)
		  return "";
		else
		  return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	function get_todo_list(qs, user){
		$.ajax({
			url: ajax_site+'todolist.php',
			type: 'POST',
			dataType: 'json',
			data: {query:qs, user:user},
			success: function(data){
				if(typeof(data) === "string"){
					$(".no_todo").html(data);
				}else{
					var html = $("#todo_list").html();
					for(idx in data){
						var do_id    = data[idx][0][0];
						var name     = data[idx][0][1];
						var title 	 = data[idx][0][2];
						var created  = data[idx][0][3];
						var user_id  = data[idx][0][4];
						html +='<li><table cellspacing="5"><tr><td><input type="checkbox" rel="todo_del" id="'+do_id+'"/></td><a href="todo_details.html?todo='+do_id+'" id="'+do_id+'"><td><h2>';
						html += title;
						html += '</h2></td><td><small> assigned to: '+name+' on: '+created+'</small></td></tr></table></a>';
						html +='</li>';
					}
					$("#todo_list").html(html).listview("refresh");
				}
			}
		});
	}
	function get_list_of_team_members(user){
		$.ajax({
			url: ajax_site+'get_team.php',
			data: {user:user},
			dataType: 'json',
			type: 'post',
			success: function(data){
				for(idx in data){
					for(index in data[idx]){
						var team_name = data[idx][index][0];
						var team_id   = data[idx][index][1];
						
						html  = '<option id="'+team_id+'" value="'+team_id+'">';
						html += team_name;
						html += '</option>';
						
						$("#team_list_select").append(html);
					}
				}
			}
		})
	}
	function get_comments_list(todo_id){
		$.ajax({
			url: ajax_site+'get_comments.php',
			data: {id:todo_id},
			dataType: 'json',
			type: 'post',
			success: function(data){
				if(typeof(data) == "string"){
					html = "<h2>"+data+"</h2>";
					$("#comments").html(html);
				}else{
					var html = $("#comments").html();
						html += "<li data-role='list-divider' role='heading'>Showing Comments</li>";
					for(idx in data){
						var comment_id = data[idx][0][0];
						var name = data[idx][0][1];
						var comment = data[idx][0][2];
						
						html += "<li data-corners='flase' data-shadow='false' data-theme='d'>";
						html += "<h3 class='ui-li-heading'>"+name+"</h3>";
						html += "<p class='ui-li-desc'>"+comment+"<span style='float:right;'>Delete Comment&nbsp;&nbsp;&nbsp;<input type='checkbox' rel='comment_del' id='"+comment_id+"'</span><p>";
						html += "</li>";	
					}
					$("#comments").html(html).listview("refresh");
				}
			}
		});
	}
	//End JavaScript Functions
	
	
	
	//Event handlers go here
	//Log out event handler
	$("#logout").click(function(){
		localStorage.removeItem("user")
	});
	//Login Event Handler
	$("#login").live("click", function(event){
		 uid = $("#username").val();
		 pwd = $("#password").val();
		
		if(uid.length > 0 && pwd.length > 0 && is_valid_email(uid)){
			if(login_attempts < 5){
				$.ajax({
					url: ajax_site+'login.php',
					crossDomain: true,
					data: {uid:uid,pwd:pwd},
					type: 'POST',
					success: function(data){
						console.log(data);
						if(data == 1){
							localStorage.setItem('user', uid);
							window.location.href='project_splash.html';
						}else if(data == 2){
							localStorage.setItem('user', uid);
							window.location.href='update_child_user.html'; 
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
				url: ajax_site+'register.php',
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
				url: ajax_site+'account_details.php',
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
	$("#create").live("click", function(){
		var project_name = $("#projectname").val();
		var user = localStorage.getItem('user');
		
		if(project_name.length > 0){
			$.ajax({
				url: ajax_site+'create_project.php',
				data: {name:project_name,user:user},
				type: 'POST',
				success: function(data){
					if(data == 1){
						alert("Project Created!");
						window.location.href="project_splash.html";
					}else{
						alert("Project was not created! Please try again.");
					}
				}
			});
		}else{
			alert("You must enter a project name");
		}
	});
	
	$("#invite").live("click", function(){
		var child = $("#childemail").val();
		var parent = localStorage.getItem('user');
	
		var valid_creds = true;
		
		//check if the email is valid
		if(!is_valid_email(child)){
			valid_creds = false;
		}
		//check to make sure the email field is filled in
		if(child.length < 1){
			valid_creds = false;
		}
		
		//if the valid_creds variable is true.
		//send the invite
		if(valid_creds){
			$.ajax({
				url: ajax_site+'invite.php',
				data: {child:child, parent:parent},
				type: 'POST',
				success: function(data){
					if(data == 1){
						alert("Thank you for inviting a team mate. They will now be sent an invite");
						window.location.href="project_splash.html";
					}else{
						alert("Ooops! Something went wrong. Try add a team mate again");
					}
				}
			});
		}
	});
	
	$("#update_details").live("click", function(){
		var fname = $("#_fname").val();
		var sname = $("#_sname").val();
		var pass = $("#_cp").val();
		var email = localStorage.getItem('user');
		var valid_creds = true;
		
		if(fname.length == 0){
			valid_creds = false;
		}
		if(sname.length == 0){
			valid_creds = false;
		}
		if(pass.length == 0){
			valid_creds = false;
		}
		
		if(valid_creds){
			$.ajax({
				url: ajax_site+'update_details.php',
				data: {email:email,fname:fname,sname:sname,pwd:pass},
				type: 'POST',
				success: function(data){
					if(data == 1){
						window.location.href="project_splash.html";
					}else{
						alert("Oooops! Something went wrong. Please try again.");
					}
				}
			});
		}else{
			alert("All fields must be filed in!");
		}
		
	});
	
	$("#add_text_todo").live("click", function(){
		var project = qs;
		var title   = $("#title").val();
		var assign  = $("#team_list_select").val();
		var user = localStorage.getItem('user');
 
		var valid_creds = true;
		
		if(title.length == 0){
			alert("You must enter a title");
			valid_creds = false;
		}
		if(assign == 'no'){
			alert("You must asign this to a user");
			valid_creds = false;
		}
		if(valid_creds){
			$.ajax({
				url: ajax_site+'add_text_todo.php',
				data: {project:project,title:title,assign:assign,user:user},
				type: 'post',
				success: function(data){
					if(data == 1){
						window.location.href="todolist.html?proj="+project;
					}else{
						alert("Ooops! Something went wrong. Please try again.");
					}
				}
			});	
		}
	});
	
	$("input[rel=todo_del]").live("click", function(){
		//Clone the DOM for ease of access
		$this = $(this);
		
		if($this.prop("checked", true)){
			//get the to do id
			var todo_id = $this.attr('id');
			//get the great great great great great grandparent of the checkbox. i.e. The <li>.
			//The <li> has an attribute with the same id as the checkbox, but this way is much
			//more amusing
			var the_li = $this.parent().parent().parent().parent().parent().parent().parent();
			
			the_li.fadeOut(300, function() {the_li.remove()});
			
			$.ajax({
				url: ajax_site+'remove_todo_and_comments.php',
				type: 'POST',
				data: {id:todo_id},
				success:function(data){
					if(data == 0){
						alert("Ooops! Something went wrong!");
					}
				}
			});
		}
	});
	
	$("input[rel=comment_del]").live("click", function(){
		//Clone the DOM for ease of access
		$this = $(this);
		
		if($this.prop("checked", true)){
			//get the to do id
			var todo_id = $this.attr('id');
			//get the li
			var the_li = $this.parent().parent().parent();
			
			the_li.fadeOut(300, function() {the_li.remove()});
			
			$.ajax({
				url: ajax_site+'remove_comments.php',
				type: 'POST',
				data: {id:todo_id},
				success:function(data){
					if(data == 0){
						alert("Ooops! Something went wrong!");
					}
				}
			});
		}
	});

	$("#submit_comment").live('click', function(){
		var comment = $("#comment").val();
		var valid_creds = true;
		var user = localStorage.getItem('user');
		
		if(comment.length < 1){
			alert("You must enter text into the box");
			valid_creds = false;
		}
		
		if(valid_creds){
			$.ajax({
				url: ajax_site+"add_comment.php",
				data: {comment:comment, user:user, todo:qs},
				type: 'POST',
				success:function(data){
					if(data == 1){
						window.location.reload();
					}else if(data == 0){
						alert("Something went wrong. Try again!");
					}
				}
			})
		}
	});
}

