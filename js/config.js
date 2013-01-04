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
dojo.provide("js.Config");
dojo.declare("js.Config", null, {

    // This file contains various configuration settings for "Parks And Recreation Finder" template
    //
    // Use this file to perform the following:
    //
    // 1.  Specify application title                  - [ Tag(s) to look for: ApplicationName ]
    // 2.  Set path for application icon              - [ Tag(s) to look for: ApplicationIcon ]
    // 3.  Set splash screen message                  - [ Tag(s) to look for: SplashScreenMessage ]
    // 4.  Set URL for help page                      - [ Tag(s) to look for: HelpURL ]
    //
    // 5.  Specify URLs for basemaps                  - [ Tag(s) to look for: BaseMapLayers ]
    // 6.  Set initial map extent                     - [ Tag(s) to look for: DefaultExtent ]
    //
    // 7.  Tags for using map services:
    // 7a. Specify URLs and attributes for operational layers
    //                                                - [ Tag(s) to look for: DevPlanLayer,ParkActivitiesLayer,ParkCommentsLayer,ReferenceOverlayLayer,FacilityId,ParkName ]
    // 7b. Customize info-Window settings             - [ Tag(s) to look for: InfoWindowHeader, InfoWindowContent ]
    // 7c. Customize info-Popup settings              - [ Tag(s) to look for: InfoPopupFieldsCollection, Activities ]
    // 7d. Customize activity search settings         - [ Tag(s) to look for: ActivitySearch ]
    // 7e. Customize info-Popup size                  - [ Tag(s) to look for: InfoPopupHeight, InfoPopupWidth ]
    // 7f. Customize data formatting                  - [ Tag(s) to look for: ShowNullValueAs, FormatDateAs ]
    //
    // 8. Customize buffer settings                   - [ Tag(s) to look for: BufferDistance,BufferColor ]
    // 9. Customize address search settings           - [ Tag(s) to look for: LocatorURL, LocatorNameFields, LocatorFields, LocatorDefaultAddress,LocatorDefaultPark, LocatorMarkupSymbolPath, AddressMatchScore,LocatorRippleSize ]
    //
    // 10. Set URL for geometry service                - [ Tag(s) to look for: GeometryService ]
    //
    // 11. Customize routing settings for directions  - [ Tag(s) to look for: RouteServiceURL, RouteColor, RouteWidth, RippleColor, GetDirections ]
    //
    // 12. Configure data to be displayed on the bottom panel
    //                                                - [ Tag(s) to look for: InfoBoxWidth]
    //
    // 13. Specify URLs for map sharing               - [ Tag(s) to look for: MapSharingOptions,TinyURLServiceURL, TinyURLResponseAttribute, FacebookShareURL, TwitterShareURL, ShareByMailLink ]
    //
    // 14. Set the sequence for info-pods             - [ Tag(s) to look for: Order]
    //
    // ------------------------------------------------------------------------------------------------------------------------
    // GENERAL SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set application title
    ApplicationName: "Park and Recreation Finder",

    // Set application icon path
    ApplicationIcon: "images/appIcon.png",

    // Set splash window content - Message that appears when the application starts
    SplashScreenMessage: "Lorem ipsum dolor sit er elit lamet, consectetaur cillium adipisicing pecu, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Nam liber te conscient to factor tum poen legum odioque civiuda.",

    // Set URL of help page/portal
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers
    // Please note: All basemaps need to use the same spatial reference. By default, on application start the first basemap will be loaded
    BaseMapLayers:
          [
                {
                    Key: "topoMap",
                    ThumbnailSource: "images/topographic.jpg",
                    Name: "Topographic Map",
                    MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
                },
				{
				    Key: "parcelMap",
				    ThumbnailSource: "images/parcel.png",
				    Name: "Parcel Map",
				    MapURL: "http://localgovtemplates.esri.com/ArcGIS/rest/services/ParcelPublicAccess/MapServer"
				}
          ],

    // Initial map extent. Use comma (,) to separate values and don t delete the last comma
    DefaultExtent: "-9820183.18, 5123332.08, -9807373.74, 5128739.76",

    // ------------------------------------------------------------------------------------------------------------------------
    // OPERATIONAL DATA SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Configure operational layers:
    //URL used for doing query task on the features.
    DevPlanLayer: "http://203.199.47.146/arcgis/rest/services/ParksAndRecreation/ParksAndRecreation/FeatureServer/0",

    ParkActivitiesLayer: "http://203.199.47.146/arcgis/rest/services/ParksAndRecreation/ParksAndRecreation/FeatureServer/2",

    ParkCommentsLayer: "http://203.199.47.146/arcgis/rest/services/ParksAndRecreation/ParksAndRecreation/FeatureServer/1",

    //Set the facility Id attribute for the parks
    FacilityId: "${facilityid}",

    //Set the park name attribute for the parks
    ParkName: "${name}",

    // ServiceUrl is the REST end point for the reference overlay layer
    // DisplayOnLoad setting is used to show or hide the reference overlay layer. Reference overlay will be shown when it is set to true
    // isMapService setting determines how the reference overlay will be added if isMapService is set to true
    //   Reference overlay will be added as tiled service when it is set to true.
    //   Reference overlay will be added as feature service when it is set to false.

    ReferenceOverlayLayer:

          {
              ServiceUrl: "http://services.arcgis.com/b6gLrKHqgkQb393u/arcgis/rest/services/Trails/FeatureServer/0",
              DisplayOnLoad: true,
              isMapService: false
          },

    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-WINDOW SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Info-window is a small, two line popup that gets displayed on selecting a feature
    // Set Info-window title. Configure this with text/fields
    InfoWindowHeader: [
	    {
	        FieldName: "${name}",
	        Alias: "Park Name"
	    }
	],

    // Choose content/fields for the info window
    InfoWindowContent: [
	    {
	        FieldName: "${fulladdr}",
	        Alias: "Full Address"
	    }
	],


    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-POPUP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Info-popup is a popup dialog that gets displayed on selecting a feature
    // Set the content to be displayed on the info-Popup. Define labels, field values, field types and field formats
    InfoPopupFieldsCollection:
       [
        {
            DisplayText: "Address:",
            FieldName: "${fulladdr}",
            Alias: "Full Address"
        },
		{
		    DisplayText: "Days Open:",
		    FieldName: "${operdays}",
		    Alias: "Operational Days"
		},
		{ DisplayText: "Hours of Operation:",
		    FieldName: "${operhours}",
		    Alias: "Operational Hours"
		},
		{
		    DisplayText: "Parking Spaces Available:",
		    FieldName: "${parkurl}",
		    Alias: "Number of Parking Spaces"
		}

      ],

    //Activities that are to be displayed in info window of that particular park.
    Activities: [
	             {
	                 FieldName: "${restroom}",
	                 Alias: "Restrooms Available",
	                 Image: "images/restrooms.png"
	             },
	             {
	                 FieldName: "${adacomply}",
	                 Alias: "ADA Compliant",
	                 Image: "images/ada compliant.png"
	             },
	             {
	                 FieldName: "${swimming}",
	                 Alias: "Swimming",
	                 Image: "images/swimming.png"
	             },
	             {
	                 FieldName: "${hiking}",
	                 Alias: "Hiking",
	                 Image: "images/hiking.png"
	             },
	             {
	                 FieldName: "${fishing}",
	                 Alias: "Fishing",
	                 Image: "images/fishing.png"
	             },
	             {
	                 FieldName: "${picnic}",
	                 Alias: "Picnic Shelters",
	                 Image: "images/picnic.png"
	             },
	             {
	                 FieldName: "${boating}",
	                 Alias: "Boating",
	                 Image: "images/boating.png"
	             },
	             {
	                 FieldName: "${roadcycle}",
	                 Alias: "Road Cycling",
	                 Image: "images/cycling.png"
	             },
	             {
	                 FieldName: "${mtbcycle}",
	                 Alias: "Mountain Biking",
	                 Image: "images/mtb.png"
	             },
	             {
	                 FieldName: "${playground}",
	                 Alias: "Playgrounds",
	                 Image: "images/playground.png"
	             },
	             {
	                 FieldName: "${ski}",
	                 Alias: "Skiing",
	                 Image: "images/skiing.png"
	             },
	             {
	                 FieldName: "${soccer}",
	                 Alias: "Multi-Purpose Fields",
	                 Image: "images/soccer.png"
	             },
                 {
                     FieldName: "${camping}",
                     Alias: "Camping",
                     Image: "images/camping.png"
                 },
                  {
                      FieldName: "${hunting}",
                      Alias: "Hunting",
                      Image: "images/hunting.png"
                  },
	             {
	                 FieldName: "${baseball}",
	                 Alias: "Baseball Fields",
	                 Image: "images/baseball.png"
	             },
	             {
	                 FieldName: "${basketball}",
	                 Alias: "Basketball Courts",
	                 Image: "images/basketball.png"
	             }
	],


    //Activities that are to be displayed in the search pod for the search view.
    ActivitySearch: {
        RESTROOM: {
            Alias: "Restrooms Available",
            Image: "images/restrooms.png",
            isSelected: true
        },
        ADACOMPLY: {
            Alias: "ADA Compliant",
            Image: "images/ada compliant.png"
        },
        SWIMMING: {
            Alias: "Swimming",
            Image: "images/swimming.png"
        },
        HIKING: {
            Alias: "Hiking",
            Image: "images/hiking.png"
        },
        FISHING: {
            Alias: "Fishing",
            Image: "images/fishing.png"
        },
        PICNIC: {
            Alias: "Picnic Shelters",
            Image: "images/picnic.png"
        },
        BOATING: {
            Alias: "Boating",
            Image: "images/boating.png"
        },
        ROADCYCLE: {
            Alias: "Road Cycling",
            Image: "images/cycling.png"
        },
        MTBCYCLE: {
            Alias: "Mountain Biking",
            Image: "images/mtb.png"
        },
        PLAYGROUND: {
            Alias: "Playgrounds",
            Image: "images/playground.png"
        },
        SKI: {
            Alias: "Skiing",
            Image: "images/skiing.png"
        },
        SOCCER: {
            Alias: "Multi-Purpose Fields",
            Image: "images/soccer.png"
        },
        CAMPING: {
            Alias: "Camping",
            Image: "images/camping.png"
        },
        HUNTING: {
            Alias: "Hunting",
            Image: "images/hunting.png"
        },
        BASEBALL: {
            Alias: "Baseball Fields",
            Image: "images/baseball.png"
        },
        BASKETBALL: {
            Alias: "Basketball Courts",
            Image: "images/basketball.png"
        }
    },

    // Set size of the info-Popup - select maximum height and width in pixels
    InfoPopupHeight: 270,
    InfoPopupWidth: 330,


    // Set string value to be shown for null or blank values
    ShowNullValueAs: "N/A",

    // Set date format
    FormatDateAs: "MMM dd, yyyy",

    //Distance in miles for drawing the buffer
    BufferDistance: "1",

    //Buffer color for  search address.
    BufferColor: [0, 100, 0],

    // ------------------------------------------------------------------------------------------------------------------------
    // ADDRESS SEARCH SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set Locator service URL
    LocatorURL: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Locators/TA_Address_NA_10/GeocodeServer",

    //Set locator name fields to search.
    LocatorNameFields: [{
        FieldName: 'Loc_name',
        FieldValues: ["US_RoofTop", "US_StreetName"]
    }],

    // Set Locator fields (fields to be used for searching)
    LocatorFields: "SingleLine",

    // Set default address to search
    LocatorDefaultAddress: "971 sylvan cir Naperville IL 60540",

    // Set default park to search
    LocatorDefaultPark: "Knoch Park",

    // Set pushpin image path
    LocatorMarkupSymbolPath: "images/Pushpin.png",

    //Set the minimum match score for address search
    AddressMatchScore: 80,

    //Set the locator ripple size
    LocatorRippleSize: 30,

    // ------------------------------------------------------------------------------------------------------------------------
    // GEOMETRY SERVICE SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set geometry service URL
    GeometryService: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",

    // ------------------------------------------------------------------------------------------------------------------------
    // DRIVING DIRECTIONS SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for routing service (network analyst)
    RouteServiceURL: "http://tasks.arcgisonline.com/ArcGIS/rest/services/NetworkAnalysis/ESRI_Route_NA/NAServer/Route",

    // Set color for the route symbol
    RouteColor: "#7F7FFE",

    // Set width of the route
    RouteWidth: 6,

    //Ripple color for selected feature.
    RippleColor: [60, 72, 36],

    //If set to true the directions will be calculated.
    GetDirections: true,

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR INFO-PODS ON THE BOTTOM PANEL
    // ------------------------------------------------------------------------------------------------------------------------
    // Set width of the boxes in the bottom panel
    InfoBoxWidth: 422,

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR MAP SHARING
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for TinyURL service, and URLs for social media
    MapSharingOptions:
          {
              TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
              TinyURLResponseAttribute: "data.url",

              FacebookShareURL: "http://www.facebook.com/sharer.php?u=${0}&t=Parks%20and%20Recreation%20Finder",
              TwitterShareURL: "http://twitter.com/home/?status=Parks%20and%20Recreation%20Finder ${0}",
              ShareByMailLink: "mailto:%20?subject=Checkout%20this%20map!&body=${0}"
          },
    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR INFOPODS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set sequence for infopods in the bottom panel
    Order: ["search", "park", "directions", "photogallery", "comments"]


});
