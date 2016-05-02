$(function() {
    
    
  $("#submit_login").click(function() {
	var username = $("input#username").val();
	if (username == "") {
	   $('.errormess').html('Please Insert Your Username');	
       return false;
    }
	var password = $("input#password").val();
	if (password == "") {
	   $('.errormess').html('Please Insert Your Password');	
       return false;
    }
	var dataString = 'username='+ username + '&password=' + password;
	$.ajax({
      type: "POST",
      url: 'http://www.ff-stlorenz.at/geomap/login/login.php',
      data: dataString,
	  dataType: "html",
      success: function(data) {
          console.log(data);
	  if ((data == 'Error: wrong password') || (data == 'Error: username not found')) {
	  $('.errormess').html('Wrong Login Data');
		} else {
            localStorage.setItem('geomap_user', username);
            
            $('#userInfo').html('Sie sind eingelogged als: '+data+' <span id="logout">abmelden</span>');
            $('.loggedin_form').show();
            $('.login_form').hide();
            $('#pathList li').remove();
            app.initialize(data);
             $('#logout').unbind().click(function(){
                 localStorage.clear();
                  $('.login_form').show();
                  $('.login_form input:not(#submit_login)').val('');
                  $('.loggedin_form, .loggedin_form').hide();
                  data = '';
             });
		}
      },
      error: function(){
      console.log(data);
      }
     });
    return false;
	});
    $('#takeImg').click(function(e) {
        alert('photo');
        alert(navigator.camera);
        

        

    });
});		

