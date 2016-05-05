/*
Interface format
Running in Background
small alert message
*/

    
       
var track = {
        //'Path1': {'coords':[],pathColor:''}
}, trackInterval, activePathName, trackIntVal, gMSetObj, gpsBusy, appRunning, data, sidebar = $('#sidebar');

var app = {
    initialize: function (userData) {
         
            function checkLogStatus(userData){
            if(!userData){
                data = localStorage.getItem('geomap_user');
            }else{
                data = userData;
            }

        if(data){
           console.log('logged in as user: '+data);
            $('#userInfo').html('You are logged in as user: '+data+' <span id="logout">logout</span>');
            $('.login_form').hide();
            userId = data;
             $('#logout').unbind().click(function(){
                 sessionStorage.clear();
                  $('.login_form').show();
                  $('.loggedin_form').hide();
                  data = '';
             });
            
                    //this.bindEvents();
            sidebar.hide();
            $(".mobileMenu").removeClass("closed");
        }else{
             $('.login_form').show();
             $('.loggedin_form').hide();
            sidebar.show();
            $(".mobileMenu").addClass("closed");
        }
              //app.bindEvents(); 
                document.addEventListener('deviceready', app.bindEvents, false);
                
            setTimeout(function(){
                //app.onDeviceReady();
                gpsBusy = false;

            }, 1000);         
        
    }
        
    checkLogStatus(userData);
        
        
    }
    , bindEvents: function () {
        app.onDeviceReady();
    }
    , setLocationTimer: function () {
        //console.log('busy? - '+gpsBusy);
                if (!gpsBusy){
                   app.getCurrPosition();
                }
        
        var locationInterval = localStorage.getItem('geoMapSettings');
        var locationnew = JSON.parse(locationInterval);
        //console.log(locationnew.trackInterval);
        clearInterval(trackInterval);
          var trackingTimer = ((locationnew.trackInterval*1) * 60000);
       
            trackInterval = setInterval(function(){
                if (!gpsBusy){
                   app.getCurrPosition();
                }
            },trackingTimer);
    }
    , onDeviceReady: function () {
        //alert('device ready');  
        //alert('camera: '+navigator.camera);   
        app.receivedEvent('deviceready');
        app.getLocalStorage();
    }
    , getLocalStorage: function () {

        if (localStorage.getItem('geoMapSettings')) {
            trackIntVal = localStorage.getItem('geoMapSettings');
        } else {
            toggle_sidebar();
        }
        $('#takeImg').hide();

    }

    
    , startTracking: function () {
        if (localStorage.getItem('geoMapSettings')) {
            var gMSetStorage = localStorage.getItem('geoMapSettings'); // fill input from local storage
            gMSetObj = jQuery.parseJSON(gMSetStorage);
        } else {
            toggle_sidebar();
        }



        if (document.querySelector('.trackOptsStart input[type="text"]').value && gMSetObj.trackInterval && data) {
            document.querySelector('h1').innerHTML = '';
            document.querySelector('h2').innerHTML = 'Searching for GPS...';
            document.querySelector('.trackOptsRunning').classList.remove('hidden');
            document.querySelector('.trackOptsStart').className += ' hidden';
            document.querySelector('.trackOptsFinished').className += ' hidden';
            document.querySelector('#pauseTracking').classList.remove('hidden');
            document.querySelector('#resumeTracking').className += ' hidden';
            


            appRunning = true;
            app.setLocationTimer();
            activePathName = document.querySelector('.trackOptsStart input[type="text"]').value;

            track[activePathName] = {
                'coords': []
                , pathColor: ''
            }



            document.querySelector('#stopTracking').removeEventListener('click', app.stopTracking);
            document.querySelector('#stopTracking').addEventListener('click', app.stopTracking);

            document.querySelector('#pauseTracking').removeEventListener('click', app.pauseTracking);
            document.querySelector('#pauseTracking').addEventListener('click', app.pauseTracking);

        } else {
            //console.log('text: '+$('.trackOptsStart input[type="text"]').val()+' interval: '+gMSetObj.trackInterval+' data: '+data);
            document.querySelector('h1').innerHTML = '';
            //document.querySelector('h2').innerHTML = 'Please enter all options!';
            
            if(document.querySelector('.trackOptsStart input[type="text"]').value == '') {
                document.querySelector('h2').innerHTML = 'Please enter Pathname';

            }else if(document.querySelector('#trackerInterval').value == ''){
                document.querySelector('h2').innerHTML = 'Please enter Tracking Interval';
            }
            else{
                document.querySelector('h2').innerHTML = 'Please login';
                setTimeout(function(){
                    toggle_sidebar();
                }, 1000);  
            }
        }

    }
    , pauseTracking: function () {
        clearInterval(trackInterval);
        app.trackPaused();
    }
    , resumeTracking: function () {
        document.querySelector('#pauseTracking').classList.remove('hidden');
        document.querySelector('#resumeTracking').className += ' hidden';
        app.setLocationTimer();
    }
    , stopTracking: function () {
        appRunning = false;
        clearInterval(trackInterval);
        document.querySelector('.trackOptsFinished').classList.remove('hidden');
        document.querySelector('.trackOptsRunning').className += ' hidden';
        app.trackStoped();
    }
    , deleteTrack: function () {
        //console.log('track deleted');
        track[activePathName].coords.length = 0;
        document.querySelector('h1').innerHTML = 'G(e)oMap';
        document.querySelector('h2').innerHTML = '';
        document.querySelector('.trackOptsStart').classList.remove('hidden');
        document.querySelector('.trackOptsFinished').className += ' hidden';
        $('#takeImg').hide();
        app.receivedEvent('deviceready');
    }
    , trackPaused: function () {
        clearInterval(trackInterval);
        document.querySelector('#pauseTracking').className += ' hidden';
        document.querySelector('#resumeTracking').classList.remove('hidden');

        document.querySelector('#resumeTracking').removeEventListener('click', app.resumeTracking);
        document.querySelector('#resumeTracking').addEventListener('click', app.resumeTracking);
    }, 
    trackStoped: function () {
        document.querySelector('#uploadTrack').removeEventListener('click', app.uploadTrack);
        document.querySelector('#uploadTrack').addEventListener('click', app.uploadTrack);
        document.querySelector('#deleteTrack').removeEventListener('click', app.alertBox);
        document.querySelector('#deleteTrack').addEventListener('click', app.alertBox);
    }
    , uploadTrack: function () {
        document.querySelector('h1').innerHTML = '';
        document.querySelector('h2').innerHTML = 'uploading...';
        var userId = data;
        var path = track[activePathName].coords;
        //console.log(path);
        var pathString = JSON.stringify(path);
        //var dataString = 'userID=' + userId + '&pathID=' + activePathName + '&path=' + pathString;
        //var StrngWOQuotes = dataString.replace(/"/g, "");
        //var StrngWOQuotes1 = StrngWOQuotes.replace(/,/g, "");
        //var StrngWOQuotes2 = StrngWOQuotes1.replace(/:/g, "");
        
  

  $.ajax({
    type: 'POST',
    url: 'http://www.ff-stlorenz.at/geomap/insert.php',
    //dataType: 'json',
    data: {'path': pathString,
          'pathID':activePathName,
          'pathColor':'#FF0000',
          'userID':userId},
    success: function(data) {
      //alert("Data Save: " + data);
      document.querySelector('h2').innerHTML = 'Upload Successfull';
        
        clearInterval(uploadInt);
        var uploadInt = setTimeout(
              function() 
              {
                document.querySelector('h1').innerHTML = 'G(e)oMap';
                document.querySelector('h2').innerHTML = '';
                app.deleteTrack();
              }, 2000);
 
    }
  });


    }
    , alertBox: function () {
        var MessageDialogController = (function () {

            var that = {};
            var invoke = function (fun, args) {
                if (fun && typeof fun === 'function') {
                    fun(args);
                }
            };

            that.showMessage = function (message, callback, title, buttonName) {

                title = title || "DEFAULT_TITLE";
                buttonName = buttonName || 'OK';

                if (navigator.notification && navigator.notification.alert) {

                    navigator.notification.alert(
                        message, // message
                        callback, // callback
                        title, // title
                        buttonName // buttonName
                    );

                } else {
                    alert(message);
                    invoke(callback);
                }
            };

            that.showConfirm = function (message, callback, buttonLabels, title) {
                buttonLabels = buttonLabels || 'OK,Cancel';
                var buttonList = buttonLabels.split(',');
                title = title || "DEFAULT TITLE";
                if (navigator.notification && navigator.notification.confirm) {

                    var _callback = function (index) {
                        if (callback) {
                            if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                                index = buttonList.length - index;
                            }
                            callback(index == 1);
                        }
                    };

                    navigator.notification.confirm(
                        message, // message
                        _callback, // callback
                        title, // title
                        buttonLabels // buttonName
                    );
                    //Default to the usual JS confirm method.
                } else {
                    invoke(callback, confirm(message));
                }
            };
            return that;
        })();

        MessageDialogController.showConfirm('Do you really want to delete this track?', function (data) {
            //console.log(data);
            if (data) {
                app.deleteTrack();
            } else {
                return false;
            }

        }, 'OK,Cancel', 'Are you sure?')
    }
    , getCurrPosition: function () { //GET GPS
        console.log('retrieve geo loaction');
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        var rightNow = new Date();
        var res = rightNow.toISOString().slice(0,10).replace(/-/g,"");
        var dateTimeNow = res +'-'+ time;
        console.log(dateTimeNow);
        
        gpsBusy = true;
        navigator.geolocation.getCurrentPosition(function (position) {
           
            console.log('got location');
            //alert('success!');
                var location = [position.coords.latitude, position.coords.longitude];

                latPos = parseFloat(position.coords.latitude).toFixed(7);
                lngPos = parseFloat(position.coords.longitude).toFixed(7);

                track[activePathName].coords.push({
                    lat: latPos*1
                    , lng: lngPos*1
                    , time: dateTimeNow
                });
            
            if(track[activePathName].coords.length == 1){
                document.querySelector('h2').innerHTML = track[activePathName].coords.length + ' Trackingpoint set';
                $('#takeImg').show(); 
            }else if (track[activePathName].coords.length > 1){
                document.querySelector('h2').innerHTML = track[activePathName].coords.length + ' Trackingpoints set';
                $('#takeImg').show(); 
            }else{
               $('#takeImg').hide(); 
            }
            

                console.log(track);
                gpsBusy = false;
            
            }
            , function (error) {
                // error getting GPS coordinates
                alert('code: ' + error.code + ' with message: ' + error.message + '\n');
                gpsBusy = false;
            }, {
                enableHighAccuracy: true
                , maximumAge: 3000
                , timeout: 3600000
            });

    },

    receivedEvent: function (id) {
         //alert('receivedEvent');
        if(document.querySelectorAll('#startTracking').length){
        document.querySelector('#startTracking').removeEventListener('click', app.startTracking);
        document.querySelector('#startTracking').addEventListener('click', app.startTracking);   
        }

    }
};

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        toggle_sidebar();
        $(".mobileMenu").toggleClass("closed");
    });


function toggle_sidebar() {
    //console.log(sidebar.style.left);
    if (sidebar.is(":visible")) {
        sidebar.hide();
        var gMSettings = {
            'trackInterval': document.querySelector('#sidebar input[type="range"]').value
            , 'userId': document.querySelector('#sidebar input[type="text"]').value
        };
        var gMSetString = JSON.stringify(gMSettings);
        //console.log(gMSetString);
        localStorage.setItem('geoMapSettings', gMSetString);
        sidebar.hide();
        if(appRunning) app.setLocationTimer();

    } else {
        
        sidebar.show();

        if (localStorage.getItem('geoMapSettings')) {
            var gMSetStorage = localStorage.getItem('geoMapSettings'); // fill input from local storage
            gMSetObj = jQuery.parseJSON(gMSetStorage);
            document.querySelector('#sidebar input[type="range"]').value = gMSetObj.trackInterval;
            $('#trackInt').html(gMSetObj.trackInterval);
            
                if(gMSetObj.trackInterval == 1){
                     $('.minutes').html('Minute.');
                 }else{
                     $('.minutes').html('Minutes.');
                 }
            $("#sidebar input[type='range']").bind("input change", function() { 
                val = this.value;
                updateTextInput(val);
             });
            
            
             function updateTextInput(val) {
                 //console.log(val);
                 $('#trackInt').html(val);
                 if(val == 1){
                     $('.minutes').html('Minute.');
                 }else{
                     $('.minutes').html('Minutes.');
                 }
            }
            
            
            //document.querySelector('#sidebar input[type="text"]').value = gMSetObj.userId;
        }



    }
}

