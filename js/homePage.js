/*
| Version 10.1.2
| Copyright 2012 Esri
|
| Licensed under the Apache License, Version 2.0 (the "License");
| you may not use this file except in compliance with the License.
| You may obtain a copy of the License at
|
|    http://www.apache.org/licenses/LICENSE-2.0
|
| Unless required by applicable law or agreed to in writing, software
| distributed under the License is distributed on an "AS IS" BASIS,
| WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
| See the License for the specific language governing permissions and
| limitations under the License.
*/
dojo.require("esri.map");
dojo.require("esri.tasks.geometry");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.tasks.locator");
dojo.require("dojo.date.locale");
dojo.require("dojox.mobile");
dojo.require("js.Config");
dojo.require("dojo.window");
dojo.require("js.date");
dojo.require("dojo.number");
dojo.require("js.InfoWindow");
dojo.require("esri.tasks.route");

var baseMapLayers;  //Variable for storing base map layers
var devPlanLayerID = 'devPlanLayerID';  //Temp Feature layer ID
var devPlanLayerURL;    //Variable for storing Feature layer URL
var formatDateAs; //variable to store the date format
var fontSize; //variable for storing font sizes for all devices.
var showNullValueAs; //variable to store the default value for replacing null values
var infoActivity;
var infoBoxWidth; //variable to store the width of the carousel pod
var infoWindowContent
var infoPopupFieldsCollection; //variable for storing the info window fields
var infoWindowHeader; //variable for storing the info window header part
var infoWindowHeight; //variable for storing the info window height
var infoWindowWidth; //variable for storing the info window width
var isBrowser = false; //flag set for browser web device
var isiOS = false; //flag set for iOS devices
var isMobileDevice = false; //flag set for mobile devices
var isTablet = false; //flag set for tablet devices
var locatorMarkupSymbolPath; //variable for storing the locator marker image URL
var locatorURL; //variable to store locator object for geocoding
var map;    //variable to store map object
var mapPoint;   //variable to store map point
var mapSharingOptions; //variable for storing the tiny service URL
var messages; //variable used for storing the error messages
var parkActivitiesLayer;
var parkCommentsLayer; //variable to store polling comments layer URL
var parkCommentsLayerId = "parkCommentsLayerId"; //variable to store polling comments layer Id
var parkActivitiesLayerId = "parkActivitiesLayerId"; //variable to store polling comments layer Id
var locatorFields; //Variable for storing configurable address fields
var facilityId;
var selectedPark;
var selectedGraphic;
var tempGraphicsLayerId = 'tempGraphicsLayerID';  //variable to store graphics layer ID
var highlightPollLayerId = "highlightPollLayerId"; //Graphics layer object for displaying selected park
var routeLayerId = "routeLayerId"; //variable to store graphics layer ID for routing
var intervalIDs = [];  //Array of IntervalID of glow-effect.
var tempBufferLayer = 'tempBufferLayer'; //Graphics layer object for displaying buffered region
var bufferDistance;
var rendererColor;
var order;
var rippleColor;
var routeTask;
var routeSymbol;
var parkName;
var isInfoWindowData = false;
var isParkSearched = false;
var searchedPark;
var searchAddressViaPod = false;
var locatorDefaultPark;
var activitySearch;
var loadingIndicatorCounter = 0;
var handlers = [];
var handlersPod = [];
var addressMatchScore;
var locatorRippleSize;
var directionsHeaderArray = [];
var getDirections;
var locatorNameFields;
var resultFound = false;
var printFlag = false;
var loadingAttachmentsImg = "images/imgAttachmentLoader.gif";
var loaderImg = "images/loader.gif";
var referenceOverlayLayer;
var nameAttribute;

//Function to initialize the map and read data from Configuration file
function Init() {
    esri.config.defaults.io.proxyUrl = "proxy.ashx"; //relative path
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.io.timeout = 180000;    // milliseconds

    var userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("iPhone") >= 0 || userAgent.indexOf("iPad") >= 0) {
        isiOS = true;
    }
    if (userAgent.indexOf("Android") >= 0 || userAgent.indexOf("iPhone") >= 0) {
        fontSize = 15;
        isMobileDevice = true;
        dojo.byId('dynamicStyleSheet').href = "styles/mobile.css";
    }
    else if (userAgent.indexOf("iPad") >= 0) {
        fontSize = 14;
        isTablet = true;
        dojo.byId('dynamicStyleSheet').href = "styles/tablet.css";
    }
    else {
        fontSize = 11;
        isBrowser = true;
        dojo.byId('dynamicStyleSheet').href = "styles/browser.css";
        //        fontSize = 15;
        //        isMobileDevice = true;
        //        dojo.byId('dynamicStyleSheet').href = "styles/mobile.css";
    }
    dojo.byId("divSplashContent").style.fontSize = fontSize + "px";

    var eventFierd = false;
    var lastSearchedValue = "";

    dojo.connect(dojo.byId("txtAddress"), 'onkeyup', function (evt) {
        searchAddressViaPod = false;
        if (evt) {
            var keyCode = evt.keyCode;
            if (keyCode == 8) { // To handle backspace
                resultFound = false;
            }
            if (keyCode == 27) {
                RemoveChildren(dojo.byId('tblAddressResults'));
                RemoveScrollBar(dojo.byId('divAddressScrollContainer'));
                return;
            }
            //validations for autocomplete search
            if (!((keyCode > 46 && keyCode < 58) || (keyCode > 64 && keyCode < 91) || keyCode == 8 || keyCode == 110 || keyCode == 188 || keyCode == 13 || (keyCode > 95 && keyCode < 106)) || (keyCode == 40)) {
                evt = (evt) ? evt : event;
                evt.cancelBubble = true;
                if (evt.stopPropagation) evt.stopPropagation();
                return;
            }

            eventFierd = true;

            setTimeout(function () {
                if (eventFierd) {
                    eventFierd = false;
                    if (dojo.byId("tdSearchAddress").className == "tdSearchByAddress") {
                        LocateAddress();
                    }
                    else if (dojo.byId("tdSearchPark").className == "tdSearchByPark") {
                        if (lastSearchedValue != dojo.byId("txtAddress").value.trim()) {
                            LocateParkbyName();
                        }
                        lastSearchedValue = dojo.byId("txtAddress").value.trim();
                    }
                }
            }, 500);

        }
    });

    handlers.push(dojo.connect(dojo.byId("imgLocate"), 'onclick', function (evt) {
        searchAddressViaPod = false;
        if (dojo.byId("tdSearchAddress").className == "tdSearchByAddress") {
            if (dojo.byId('txtAddress').value.trim() == "") {
                alert(messages.getElementsByTagName("addressToLocate")[0].childNodes[0].nodeValue);
                return;
            }
            LocateAddress();
        }
        else if (dojo.byId("tdSearchPark").className == "tdSearchByPark") {
            resultFound = false;
            if (dojo.byId('txtAddress').value.trim() == "") {
                alert(messages.getElementsByTagName("parkToLocate")[0].childNodes[0].nodeValue);
                return;
            }
            LocateParkbyName();
        }
        else if (dojo.byId("tdSearchActivity").className == "tdSearchByActivity") {
            LocateParkbyActivity();
        }
    }));

    if (!Modernizr.geolocation) {
        dojo.byId("tdGeolocation").style.display = "none";
    }

    var responseObject = new js.Config();

    Initialize(responseObject);
}

function Initialize(responseObject) {
    var infoWindow = new js.InfoWindow({
        domNode: dojo.create("div", null, dojo.byId("map"))
    });

    if (isMobileDevice) {
        dojo.byId('divInfoContainer').style.display = "none";
        dojo.removeClass(dojo.byId('divInfoContainer'), "opacityHideAnimation");
        dojo.byId('divResults').style.display = "none";
        dojo.removeClass(dojo.byId('divResults'), "opacityHideAnimation");
        dojo.replaceClass("divAddressHolder", "hideContainer", "hideContainerHeight");
        dojo.byId('divAddressContainer').style.display = "none";
        dojo.removeClass(dojo.byId('divAddressContainer'), "hideContainerHeight");
        dojo.byId('divSplashScreenContent').style.width = "95%";
        dojo.byId('divSplashScreenContent').style.height = "95%";
        dojo.byId("divLogo").style.display = "none";
        dojo.byId("lblAppName").style.display = "none";
        dojo.byId("lblAppName").style.width = "80%";
        dojo.byId("divToggle").style.display = "none";
    }
    else {
        dojo.byId("imgDirections").style.display = "none";
        dojo.byId("imgList").style.display = "none";
        var imgBasemap = document.createElement('img');
        imgBasemap.src = "images/imgBaseMap.png";
        imgBasemap.className = "imgOptions";
        imgBasemap.title = "Switch Basemap";
        imgBasemap.id = "imgBaseMap";
        imgBasemap.style.cursor = "pointer";
        imgBasemap.onclick = function () {
            ShowBaseMaps();
        }
        dojo.byId("tdBaseMap").appendChild(imgBasemap);
        dojo.byId("tdBaseMap").className = "tdHeader";
        dojo.byId('divSplashScreenContent').style.width = "350px";
        dojo.byId('divSplashScreenContent').style.height = "290px";
        dojo.byId('divAddressContainer').style.display = "block";
        dojo.byId("divLogo").style.display = "block";
        dojo.byId("imgMblNextImg").style.display = "none";
        dojo.byId("imgMblPrevImg").style.display = "none";
    }

    devPlanLayerURL = responseObject.DevPlanLayer;
    infoBoxWidth = responseObject.InfoBoxWidth;
    dojo.byId('imgApp').src = responseObject.ApplicationIcon;
    dojo.byId("lblAppName").innerHTML = responseObject.ApplicationName;
    dojo.byId('divSplashContent').innerHTML = responseObject.SplashScreenMessage;

    dojo.xhrGet({
        url: "ErrorMessages.xml",
        handleAs: "xml",
        preventCache: true,
        load: function (xmlResponse) {
            messages = xmlResponse;
        }
    });

    map = new esri.Map("map", {
        slider: true,
        infoWindow: infoWindow
    });

    ShowProgressIndicator();

    locatorFields = responseObject.LocatorFields.split(",");
    geometryService = new esri.tasks.GeometryService(responseObject.GeometryService);
    locatorURL = responseObject.LocatorURL;
    baseMapLayers = responseObject.BaseMapLayers;
    mapSharingOptions = responseObject.MapSharingOptions;
    locatorMarkupSymbolPath = responseObject.LocatorMarkupSymbolPath;
    formatDateAs = responseObject.FormatDateAs;
    showNullValueAs = responseObject.ShowNullValueAs;
    infoActivity = responseObject.Activities;
    infoWindowHeader = responseObject.InfoWindowHeader;
    infoWindowContent = responseObject.InfoWindowContent;
    infoPopupFieldsCollection = responseObject.InfoPopupFieldsCollection;
    infoWindowHeight = responseObject.InfoPopupHeight;
    infoWindowWidth = responseObject.InfoPopupWidth;
    parkActivitiesLayer = responseObject.ParkActivitiesLayer;
    parkCommentsLayer = responseObject.ParkCommentsLayer;
    facilityId = responseObject.FacilityId;
    bufferDistance = responseObject.BufferDistance;
    rendererColor = responseObject.BufferColor;
    order = responseObject.Order;
    rippleColor = responseObject.RippleColor;
    routeTask = new esri.tasks.RouteTask(responseObject.RouteServiceURL);
    dojo.connect(routeTask, "onSolveComplete", ShowRoute);
    dojo.connect(routeTask, "onError", ErrorHandler);
    routeSymbol = new esri.symbol.SimpleLineSymbol().setColor(responseObject.RouteColor).setWidth(responseObject.RouteWidth);
    parkName = responseObject.ParkName;
    locatorDefaultPark = responseObject.LocatorDefaultPark;
    activitySearch = responseObject.ActivitySearch;
    addressMatchScore = responseObject.AddressMatchScore;
    locatorRippleSize = responseObject.LocatorRippleSize;
    getDirections = responseObject.GetDirections;
    locatorNameFields = responseObject.LocatorNameFields;
    referenceOverlayLayer = responseObject.ReferenceOverlayLayer;

    parkName.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
        nameAttribute = key;
    });

    var tr = dojo.byId("tblCarousel").insertRow(0);
    for (var i in order) {
        dojo.query("[type=" + order[i] + "]").forEach(function (node) {
            var td = tr.insertCell(i);
            if (order[i] == "photogallery") {
                td.id = "tdPhotoGallery";
            }
            if (order[i] == "directions") {
                td.id = "tdDirectionsPod";
            }
            td.appendChild(node);
            node.style.width = infoBoxWidth + "px";
        })
    }

    CreateBaseMapComponent();

    var routeLayer = new esri.layers.GraphicsLayer();
    routeLayer.id = routeLayerId;
    map.addLayer(routeLayer);

    if (!isMobileDevice) {
        TouchEvent();
    }
    else {
        TouchImage();
    }

    dojo.connect(map, "onLoad", function () {
        routeParams = new esri.tasks.RouteParameters();
        routeParams.stops = new esri.tasks.FeatureSet();
        routeParams.returnRoutes = false;
        routeParams.returnDirections = true;
        routeParams.directionsLengthUnits = esri.Units.MILES;
        routeParams.outSpatialReference = map.spatialReference;
        var zoomExtent;
        var extent = GetQuerystring('extent');
        if (extent != "") {
            zoomExtent = extent.split(',');
        }
        else {
            zoomExtent = responseObject.DefaultExtent.split(",");
        }
        var startExtent = new esri.geometry.Extent(parseFloat(zoomExtent[0]), parseFloat(zoomExtent[1]), parseFloat(zoomExtent[2]), parseFloat(zoomExtent[3]), map.spatialReference);
        map.setExtent(startExtent);
        MapInitFunction();
    });

    dojo.connect(map, "onExtentChange", function (evt) {
        SetMapTipPosition();
        if (dojo.coords("divAppContainer").h > 0) {
            ShareLink(false);
        }
    });

    dojo.byId("txtAddress").setAttribute("defaultAddress", responseObject.LocatorDefaultAddress);
    dojo.byId('txtAddress').value = responseObject.LocatorDefaultAddress;

    dojo.byId("txtAddress").setAttribute("defaultAddressTitle", responseObject.LocatorDefaultAddress);
    dojo.byId("txtAddress").style.color = "gray";

    dojo.byId("txtAddress").setAttribute("defaultParkName", responseObject.LocatorDefaultPark);
    dojo.byId("txtAddress").setAttribute("defaultParkTitle", responseObject.LocatorDefaultPark);

    dojo.byId("txtPodAddress").value = responseObject.LocatorDefaultAddress;
    dojo.byId("txtPodAddress").style.color = "gray";
    dojo.byId("txtPodAddress").setAttribute("defaultAddress", responseObject.LocatorDefaultAddress);
    dojo.byId("txtPodAddress").setAttribute("defaultAddressPodTitle", responseObject.LocatorDefaultAddress);

    dojo.connect(dojo.byId('txtAddress'), "ondblclick", ClearDefaultText);
    dojo.connect(dojo.byId('txtAddress'), "onblur", ReplaceDefaultText);
    dojo.connect(dojo.byId('txtAddress'), "onfocus", function (evt) {
        this.style.color = "#FFF";
    });

    dojo.connect(dojo.byId('txtPodAddress'), "ondblclick", ClearDefaultText);
    dojo.connect(dojo.byId('txtPodAddress'), "onblur", ReplaceDefaultText);
    dojo.connect(dojo.byId('txtPodAddress'), "onfocus", function (evt) {
        this.style.color = "#FFF";
    });

    dojo.connect(dojo.byId('imgHelp'), "onclick", function () {
        window.open(responseObject.HelpURL);
    });
}

//function called when map is initialized
function MapInitFunction() {
    if (dojo.query('.logo-med', dojo.byId('map')).length > 0) {
        dojo.query('.esriControlsBR', dojo.byId('map'))[0].id = "imgesriLogo";
    }
    else if (dojo.query('.logo-sm', dojo.byId('map')).length > 0) {
        dojo.query('.esriControlsBR', dojo.byId('map'))[0].id = "imgesriLogo";
    }
    dojo.addClass("imgesriLogo", "esriLogo");


    dojo.connect(map, "onPanEnd", function (extent) {
        if (printFlag) {
            map.setLevel(currentLevel + 1);
            setTimeout(function () {
                map.setLevel(currentLevel);
            }, 100);
            printFlag = false;
        }
    });

    dojo.connect(map, "onPanStart", function (extent) {
        if (printFlag) {
            currentLevel = map.getLevel();
        }
    });


    var graphicLayer = new esri.layers.GraphicsLayer();
    graphicLayer.id = tempBufferLayer;
    map.addLayer(graphicLayer);

    gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = highlightPollLayerId;
    map.addLayer(gLayer);

    var devPlanLayer = new esri.layers.FeatureLayer(devPlanLayerURL, {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"],
        id: devPlanLayerID

    });

    var facilityID;
    facilityId.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
        facilityID = key;
    });

    var handle = dojo.connect(devPlanLayer, "onUpdateEnd", function () {
        HideProgressIndicator();
        dojo.disconnect(handle);
        var parkID = GetQuerystring('selectedParkID');
        if (parkID != "") {
            var query = new esri.tasks.Query();
            query.where = facilityID + "= '" + parkID + "'";
            devPlanLayer.queryFeatures(query, function (results) {
                if (results.features.length > 0) {
                    setTimeout(function () {
                        defaultPark = results.features[0];
                        selectedPark = results.features[0].geometry;
                        ExecuteQueryForParks(results, null, null, true);
                    }, 500);
                }
            });
        }
    });

    dojo.connect(devPlanLayer, "onClick", function (evtArgs) {
        selectedPark = evtArgs.graphic.geometry;
        isParkSearched = false;
        selectedGraphic = null;
        map.infoWindow.hide();
        ShowServiceInfoDetails(evtArgs.graphic.geometry, evtArgs.graphic.attributes);
        evtArgs = (evtArgs) ? evtArgs : event;
        evtArgs.cancelBubble = true;
        if (evtArgs.stopPropagation) {
            evtArgs.stopPropagation();
        }
    });
    map.addLayer(devPlanLayer);

    var commentsLayer = new esri.layers.FeatureLayer(parkCommentsLayer, {
        mode: esri.layers.FeatureLayer.MODE_SELECTION,
        outFields: ["*"],
        id: parkCommentsLayerId
    });
    map.addLayer(commentsLayer);


    var activityLayer = new esri.layers.FeatureLayer(parkActivitiesLayer, {
        mode: esri.layers.FeatureLayer.MODE_SELECTION,
        outFields: ["*"],
        id: parkActivitiesLayerId
    });

    map.addLayer(activityLayer);

    var gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = tempGraphicsLayerId;
    map.addLayer(gLayer);

    if (referenceOverlayLayer.DisplayOnLoad) {
        if (!referenceOverlayLayer.isMapService) {
            var overlaymap = new esri.layers.FeatureLayer(referenceOverlayLayer.ServiceUrl, {
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"]
            });
            map.addLayer(overlaymap);
        }
        else {
            var overlaymap = new esri.layers.ArcGISTiledMapServiceLayer(referenceOverlayLayer.ServiceUrl);
            map.addLayer(overlaymap);
        }
    }

    dojo.byId('divSplashScreenContainer').style.display = "block";
    dojo.replaceClass("divSplashScreenContent", "showContainer", "hideContainer");
    SetHeightSplashScreen();

    CreateRatingWidget(dojo.byId('commentRating'));

    if (!isMobileDevice) {
        window.onresize = function () {
            resizeHandler();
            ResetSlideControls();
        }
    }
    else {
        SetHeightAddressResults();
    }
    HideProgressIndicator();
}

dojo.addOnLoad(Init);