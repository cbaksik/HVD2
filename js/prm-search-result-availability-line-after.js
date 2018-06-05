/**
 * Created by samsan on 9/13/17.
 */


angular.module('viewCustom')
    .controller('prmSearchResultAvailabilityLineAfterCtrl',['customMapService','$timeout','customHathiTrustService','customService','customGoogleAnalytic','$q','prmSearchService',function (customMapService,$timeout, customHathiTrustService,customService, customGoogleAnalytic, $q, prmSearchService) {
        var vm=this;
        var cga=customGoogleAnalytic;
        var custService=customService;
        var cs=customMapService;
        var chts=customHathiTrustService;
        var prmsv=prmSearchService;
        // get endpoint url from config.html file
        vm.api = custService.getApi();
        // display of table of content
        vm.TOC = {'type':'01HVD_ALMA','isbn':[],'display':false};
        vm.itemPNX={};
        vm.hathiTrust={};
        var map;

        // find if pnx has table of content
        vm.findTOC=function () {
          if(vm.itemPNX.pnx.control.sourceid[0]===vm.TOC.type && vm.itemPNX.pnx.addata.isbn) {
              if(vm.itemPNX.pnx.addata.isbn.length > 0) {
                  var listRequest=[];
                  for(var i=0; i < vm.itemPNX.pnx.addata.isbn.length; i++) {
                      var param={'isbn':'','hasData':false};
                      param.isbn = vm.itemPNX.pnx.addata.isbn[i];
                      var post = custService.postData(vm.api.tocUrl,param);
                      listRequest.push(post);
                  }
                  // put everything into a list of queue call
                  var ajax = $q.all(listRequest);
                  ajax.then(
                      function (response) {
                          for(var k=0; k < response.length; k++) {
                              var data = response[k].data;
                              var xmldata = prmsv.parseXml(data.result);
                              if(xmldata.ssi) {
                                // it has table of content
                                if(xmldata.ssi[0].TOC[0]) {
                                    data.hasData = true;
                                    vm.TOC.display = data.hasData;
                                    vm.TOC.isbn = data.isbn;
                                    k = response.length;
                                }
                              } else {
                                  // it doesn't have table of content
                                  data.hasData = false;
                                  vm.TOC.display = data.hasData;
                              }

                          }
                      },
                      function (error) {
                          console.log(error);
                      }
                  )
              }
          }
        };

        //This function is used to center and zoom the map based on WKT POINT(x y)
        vm.mapWKTPoint=function(map, wkt, popupText) {
            if (popupText === "") {
                popupText = "<b>Center of data set coverage area.</b>";
            }

            var y = wkt[0];
            var x = wkt[2];

            // create a marker symbol on the map
            L.marker([x, y]).addTo(map).bindPopup(popupText);

            // pan to the marker symbol
            map.panTo(new L.LatLng(x, y));
        };

        //This function is used to center and zoom the map based on WKT BBOX(x1 y1, x2 y2)
        vm.mapWKTBbox=function(map, wkt, popupText) {
            if (popupText === "") {
                popupText = "<b>Extent of data set.</b>";
            }

            // define rectangle geographical bounds
            var bounds = [
                [wkt[2], wkt[0]],
                [wkt[3], wkt[1]]
            ];

            // create an orange rectangle
            L.rectangle(bounds, {
                color: "#ff7800",
                weight: 1
            }).addTo(map).bindPopup(popupText);

            // zoom the map to the rectangle bounds
            map.fitBounds(bounds, {
                padding: [10, 10]
            });

        };

        vm.getHathiTrustData=function () {
            if(vm.api.hathiTrustUrl) {
                chts.doPost(vm.api.hathiTrustUrl, vm.hathiTrust)
                    .then(function (data) {
                            if (data.data.items) {
                                vm.hathiTrustItem = chts.validateHarvard(data.data.items);
                            }
                        },
                        function (error) {
                            console.log(error);
                        }
                    )
            }
        };

        vm.$onInit=function() {
            // get rest endpoint url from config.html where it preload prm-tobar-after.js
            vm.api=custService.getApi();
            vm.itemPNX=vm.parentCtrl.result;
            // get table of content
            vm.findTOC();
            if(vm.itemPNX.pnx.display.lds40 && vm.parentCtrl.isFullView) {
                $timeout(function () {
                    vm.coordinates = cs.buildCoordinatesArray(vm.itemPNX.pnx.display.lds40[0]);
                    vm.centerLongitude = (vm.coordinates[0] + vm.coordinates[1]) / 2;
                    vm.centerLatitude = (vm.coordinates[2] + vm.coordinates[3]) / 2;

                    var zoom=3;
                    map=L.map('hglMap12',{center:[vm.centerLatitude, vm.centerLongitude],
                    zoom:zoom,keyboard:true,tap:true,zoomControl: false});


                    // create the tile layer with correct attribution
                    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
                    var osm = new L.TileLayer(osmUrl, {minZoom: zoom, maxZoom: 40, attribution: osmAttrib});

                    map.setView([vm.centerLatitude, vm.centerLongitude],zoom);
                    map.addLayer(osm);

                    // custom zoom bar control that includes a Zoom Home function
                    L.Control.zoomHome = L.Control.extend({
                        options: {
                            position: 'topleft',
                            zoomInText: '<i class="iconMapFontSize">+</i>',
                            zoomInTitle: 'Zoom in',
                            zoomOutText: '<i class="iconMapFontSize">-</i>',
                            zoomOutTitle: 'Zoom out',
                            zoomHomeText: '<img class="iconHome" src="/primo-explore/custom/HVD2/img/ic_home_black_18px.svg"/>',
                            zoomHomeTitle: 'Zoom home'
                        },

                        onAdd: function (map) {
                            var controlName = 'gin-control-zoom',
                                container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                                options = this.options;

                            this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
                                controlName + '-in', container, this._zoomIn);
                            this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
                                controlName + '-out', container, this._zoomOut);

                            this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
                                controlName + '-home', container, this._zoomHome);

                            this._updateDisabled();
                            map.on('zoomend zoomlevelschange', this._updateDisabled, this);

                            return container;
                        },

                        onRemove: function (map) {
                            map.off('zoomend zoomlevelschange', this._updateDisabled, this);
                        },

                        _zoomIn: function (e) {
                            this._map.zoomIn(e.shiftKey ? 3 : 1);
                        },

                        _zoomOut: function (e) {
                            this._map.zoomOut(e.shiftKey ? 3 : 1);
                            if(vm.itemPNX.pnx.display) {
                                var title = 'zoom-out: ' + vm.itemPNX.pnx.display.title[0];
                                cga.setPage('user-use-openMapStreet', title);
                            }
                        },

                        _zoomHome: function (e) {
                            map.setView([vm.centerLatitude, vm.centerLongitude], zoom);

                            if (vm.coordinates[0] == vm.coordinates[1] && vm.coordinates[2] == vm.coordinates[3]) {
                                vm.mapWKTPoint(map, vm.coordinates, "Center of data set coverage area.");
                            } else {
                                vm.mapWKTBbox(map, vm.coordinates, "Extent of data set.");
                            }

                        },

                        _createButton: function (html, title, className, container, fn) {
                            var link = L.DomUtil.create('a', className, container);
                            link.innerHTML = html;
                            link.href = '#';
                            link.title = title;

                            L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                                .on(link, 'click', L.DomEvent.stop)
                                .on(link, 'click', fn, this)
                                .on(link, 'click', this._refocusOnMap, this);

                            return link;
                        },

                        _updateDisabled: function () {
                            var map = this._map,
                                className = 'leaflet-disabled';

                            L.DomUtil.removeClass(this._zoomInButton, className);
                            L.DomUtil.removeClass(this._zoomOutButton, className);

                            if (map._zoom === map.getMinZoom()) {
                                L.DomUtil.addClass(this._zoomOutButton, className);
                            }
                            if (map._zoom === map.getMaxZoom()) {
                                L.DomUtil.addClass(this._zoomInButton, className);
                            }
                        }
                    });

                    var zoomHome = new L.Control.zoomHome();
                    zoomHome.addTo(map);

                    // end here

                    if (vm.coordinates[0] == vm.coordinates[1] && vm.coordinates[2] == vm.coordinates[3]) {
                        vm.mapWKTPoint(map, vm.coordinates, "Center of data set coverage area.");
                    } else {
                        vm.mapWKTBbox(map, vm.coordinates, "Extent of data set.");
                    }


                },1000);

            }

            // validate Hathi Trust to see if it is existed
            vm.hathiTrust=chts.validateHathiTrust(vm.itemPNX);
            vm.hathiTrustItem={};
            if(vm.hathiTrust.flag) {
                vm.getHathiTrustData();
            }

        };

    }]);


angular.module('viewCustom')
    .component('prmSearchResultAvailabilityLineAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmSearchResultAvailabilityLineAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-search-result-availability-line-after.html'
    });
