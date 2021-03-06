function isMobileOrTablet() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

window.isMobileOrTablet = window.isMobileOrTablet || isMobileOrTablet;

// Define your product name and version
tt.setProductInfo('<your-product-name>', '<your-product-version>');

var mapElement = document.getElementById('map');
var messageBox = document.querySelector('.js-message-box');
var messageBoxContent = document.querySelector('.tt-overlay-panel__content');
var messageBoxClose = messageBox.querySelector('.js-message-box-close');

var messages = {
    permissionDenied: 'Permission denied. You can change your browser settings to allow usage of geolocation on this domain.',
    notAvailable: 'Geolocation data provider not available.'
};
// Markers Array
let marker = null;
// Create map
let latLngOpen = new tt.LngLat(78.9629, 20.5937);
var map = tt.map({
    key: 'zfph6ZjSAJgfeKS7V67TAfRyLYRxqvTz',
    container: 'map',
    style: 'tomtom://vector/1/basic-main',
    center: latLngOpen.toArray(),
    zoom: 5,
    renderWorldCopies: false,
    dragPan: !window.isMobileOrTablet()
});

map.addControl(new tt.FullscreenControl());
map.on('click', function (event) {
    if (marker !== null) {
        marker.remove();
    }
    marker = new tt.Marker().setLngLat(event.lngLat).addTo(map);
    $("#long").val(event.lngLat.lng);
    $("#lat").val(event.lngLat.lat);
    M.updateTextFields();
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.tomtom.com/search/2/reverseGeocode/" + event.lngLat.lat + "," + event.lngLat.lng + ".json?key=zfph6ZjSAJgfeKS7V67TAfRyLYRxqvTz");
    xhr.send();
    xhr.onload = function () {
        if (xhr.status == 200) {
            let data = JSON.parse(xhr.response);
            $("#long-helper").html(data.addresses[0].address.freeformAddress);
            $("#faddress").val(data.addresses[0].address.freeformAddress);
        }
    };
});


// Create plugin instance
var geolocateControl = new tt.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

bindEvents();

// Handle case when domain permissions are already blocked
handlePermissionDenied();

map.addControl(geolocateControl);

function handlePermissionDenied() {
    if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' })
            .then(function (result) {
                if (result.state === 'denied') {
                    displayErrorMessage(messages.permissionDenied);
                }
            });
    }
}

function bindEvents() {
    geolocateControl.on('error', handleError);
    messageBoxClose.addEventListener('click', handleMessageBoxClose);
}

function handleMessageBoxClose() {
    messageBox.setAttribute('hidden', true);
}

function displayErrorMessage(message) {
    messageBoxContent.textContent = message;
    messageBox.removeAttribute('hidden');
}

function handleError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            displayErrorMessage(messages.permissionDenied);
            break;
        case error.POSITION_UNAVAILABLE:
        case error.TIMEOUT:
            displayErrorMessage(messages.notAvailable);
    }
}

$("#add_place").submit(function (event) {
    event.preventDefault();

    if ($("#long").val().length == 0) {
        $("#long-helper").html("Please select an appropriate location from the map");
    } else if ($("#lat").val().length == 0) {
        $("#lat-helper").html("Please select an appropriate location from the map");
    } else {
        let btn = document.getElementById("reg-btn-div");
        let myLoader = document.getElementById("myLoader");
        btn.classList.add("hide");
        myLoader.classList.remove("hide");
        let formData = new FormData(document.getElementById("add_place"));
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../bin/functions/addPlaceAdmin.php");
        xhr.send(formData);
        xhr.onload = function () {
            if (xhr.status == 200) {
                console.log(xhr.response);
                if (xhr.response == "true") {
                    document.getElementById("add_place").reset();
                    $("#long-helper").html("");
                    btn.classList.remove("hide");
                    myLoader.classList.add("hide");
                    swal("Success !", "Place was added successfully !", "success");
                } else {
                    btn.classList.remove("hide");
                    myLoader.classList.add("hide");
                    swal("Error !", "Something went wrong !", "error");
                }
            } else {
                btn.classList.remove("hide");
                myLoader.classList.add("hide");
                swal("Error !", "Something went wrong !", "error");
            }
        };
    }

});
