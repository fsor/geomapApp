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
        //alert(navigator.camera);
        takeTheImage();
    });
    function takeTheImage(){
//        console.log(track[activePathName].coords.length);
//        console.log(activePathName);
//        var curPoint = (track[activePathName].coords.length*1)-1;
//        track[activePathName].coords[curPoint].img = '3333';
//        console.log(track[activePathName].coords[curPoint]);
//        console.log(track[activePathName].coords[curPoint]);
//        console.log(track[activePathName]);
        

 
        function getImage() {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(uploadPhoto, function(message) {
			alert('get picture failed');
		},{
            quality: 60,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false, 
            //allowEdit : true, 
            encodingType: Camera.EncodingType.JPEG, 
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            correctOrientation: true
		}
            );
 
        }
 
        function uploadPhoto(imageURI) {
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
 
            var params = new Object();
            params.value1 = "test";
            params.value2 = "param";
 
            options.params = params;
            options.chunkedMode = false;
 
            var ft = new FileTransfer();
            ft.upload(imageURI, "http://www.ff-stlorenz.at/geomap/upload/upload.php", win, fail, options);
        }
 
        function win(r) {

            var lastLine = r.response.substr(r.response.lastIndexOf("\n")+1);
            console.log(lastLine);
            
            var curPoint = (track[activePathName].coords.length*1)-1;
            track[activePathName].coords[curPoint].img = lastLine;
            

            //alert(r.response);
        }
 
        function fail(error) {
            alert("An error has occurred: Code = " = error.code);
        }
        
        
        getImage();
        
        
        
        
        
        
  
    }
});		

