/*
Interface format
Running in Background
small alert message
*/

var track = {
        //'Path1': {'coords':[],pathColor:''}
}, trackInterval, activePathName, trackIntVal, gMSetObj;


var app = {
    initialize: function () {
        this.bindEvents();
    }
    , bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }
    , onDeviceReady: function () {
        app.receivedEvent('deviceready');
        app.getLocalStorage();
    }
    , getLocalStorage: function () {

        if (localStorage.getItem('geoMapSettings')) {
            trackIntVal = localStorage.getItem('geoMapSettings');
        } else {
            toggle_sidebar();
        }

    }

    
    , startTracking: function () {
        if (localStorage.getItem('geoMapSettings')) {
            var gMSetStorage = localStorage.getItem('geoMapSettings'); // fill input from local storage
            gMSetObj = jQuery.parseJSON(gMSetStorage);
        } else {
            toggle_sidebar();
        }



        if (document.querySelector('.trackOptsStart input[type="text"]').value && gMSetObj.trackInterval && gMSetObj.userId) {
            document.querySelector('h1').innerHTML = 'Searching for GPS...';
            document.querySelector('.trackOptsRunning').classList.remove('hidden');
            document.querySelector('.trackOptsStart').className += ' hidden';
            document.querySelector('#pauseTracking').classList.remove('hidden');
            document.querySelector('#resumeTracking').className += ' hidden';


            app.getCurrPosition();
            clearInterval(trackInterval);
            activePathName = document.querySelector('.trackOptsStart input[type="text"]').value;

            track[activePathName] = {
                'coords': []
                , pathColor: ''
            }

            //var trackingTimer = (gMSetObj.trackInterval * 60000);
            //console.log(gMSetObj.trackInterval);
            var trackingTimer = (gMSetObj.trackInterval * 1000);
            //console.log(trackingTimer);
            trackInterval = setInterval(app.getCurrPosition, trackingTimer);

            document.querySelector('#stopTracking').removeEventListener('click', app.stopTracking);
            document.querySelector('#stopTracking').addEventListener('click', app.stopTracking);

            document.querySelector('#pauseTracking').removeEventListener('click', app.pauseTracking);
            document.querySelector('#pauseTracking').addEventListener('click', app.pauseTracking);

        } else {
            document.querySelector('h1').innerHTML = 'Please enter all options!';
        }

    }
    , pauseTracking: function () {
        clearInterval(trackInterval);
        app.trackPaused();
    }
    , resumeTracking: function () {
        clearInterval(trackInterval);
        document.querySelector('#pauseTracking').classList.remove('hidden');
        document.querySelector('#resumeTracking').className += ' hidden';
        //var trackingTimer = (gMSetObj.trackInterval * 60000;
        var trackingTimer = (gMSetObj.trackInterval * 1000);
        trackInterval = setInterval(app.getCurrPosition, trackingTimer);
    }
    , stopTracking: function () {
        clearInterval(trackInterval);
        document.querySelector('.trackOptsFinished').classList.remove('hidden');
        document.querySelector('.trackOptsRunning').className += ' hidden';
        app.trackStoped();
    }
    , deleteTrack: function () {
        //console.log('track deleted');
        track[activePathName].coords.length = 0;
        document.querySelector('h1').innerHTML = 'G(e)oMap';
        document.querySelector('.trackOptsStart').classList.remove('hidden');
        document.querySelector('.trackOptsFinished').className += ' hidden';
        app.receivedEvent('deviceready');
    }
    , trackPaused: function () {
        document.querySelector('#pauseTracking').className += ' hidden';
        document.querySelector('#resumeTracking').classList.remove('hidden');

        document.querySelector('#resumeTracking').removeEventListener('click', app.resumeTracking);
        document.querySelector('#resumeTracking').addEventListener('click', app.resumeTracking);
    }, 
    trackStoped: function () {
        document.querySelector('#uploadTrack').removeEventListener('click', false);
        document.querySelector('#uploadTrack').addEventListener('click', app.uploadTrack);
        document.querySelector('#deleteTrack').removeEventListener('click', app.alertBox);
        document.querySelector('#deleteTrack').addEventListener('click', app.alertBox);
    }
    , uploadTrack: function () {
        var userId = gMSetObj.userId;
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
          'userID':userId},
    success: function(data) {
      alert("Data Save: " + data);
    }
  });


//        $.ajax({
//            data: dataObjString
//            , type: "post"
//            , dataType : 'json'
//            , processData: false //jQuery issue
//            , url: "http://www.ff-stlorenz.at/geomap/insert.php"
//            , success: function (data) {
//                alert("Data Save: " + data);
//            }
//        });
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

        }, 'OK,Cancel', 'Title')
    }
    , getCurrPosition: function () {

        navigator.geolocation.getCurrentPosition(function (position) {
                var location = [position.coords.latitude, position.coords.longitude];

                latPos = parseFloat(position.coords.latitude).toFixed(7);
                lngPos = parseFloat(position.coords.longitude).toFixed(7);

                track[activePathName].coords.push({
                    lat: latPos*1
                    , lng: lngPos*1
                });


                document.querySelector('h1').innerHTML = track[activePathName].coords.length + ' Wegpunkte gesetzt';
                console.log(track);
            }
            , function (error) {
                // error getting GPS coordinates
                //alert('code: ' + error.code + ' with message: ' + error.message + '\n');
            }, {
                enableHighAccuracy: true
                , maximumAge: 3000
                , timeout: 5000
            });

    },

    receivedEvent: function (id) {
        document.querySelector('#startTracking').removeEventListener('click', app.startTracking);
        document.querySelector('#startTracking').addEventListener('click', app.startTracking);
    }
};


function toggle_sidebar() {

    var sidebar = document.getElementById("sidebar");
    //console.log(sidebar.style.left);
    if (sidebar.style.left == "-100%") {
        sidebar.style.left = "0px";

        if (localStorage.getItem('geoMapSettings')) {
            var gMSetStorage = localStorage.getItem('geoMapSettings'); // fill input from local storage
            gMSetObj = jQuery.parseJSON(gMSetStorage);
            document.querySelector('#sidebar input[type="number"]').value = gMSetObj.trackInterval;
            document.querySelector('#sidebar input[type="text"]').value = gMSetObj.userId;
        }

    } else {

        var gMSettings = {
            'trackInterval': document.querySelector('#sidebar input[type="number"]').value
            , 'userId': document.querySelector('#sidebar input[type="text"]').value
        };
        var gMSetString = JSON.stringify(gMSettings);
        //console.log(gMSetString);
        localStorage.setItem('geoMapSettings', gMSetString);
        sidebar.style.left = "-100%";
    }
}

console.log('finished loading');