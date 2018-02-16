(function(){
"use strict";
'use strict';

/**
 * Created by samsan on 7/18/17.
 */

angular.module('viewCustom', ['angularLoad']);

/**
 * Created by samsan on 2/8/18.
 * This component get aeon (alma) data by passing mss_id in rest url
 */

angular.module('viewCustom').controller('customAeonCtrl', ['customService', '$scope', function (customService, $scope) {
    var sv = customService;
    var vm = this;
    vm.api = sv.getApi();
    vm.dataList = [];
    vm.holdingItems = [];
    vm.$onInit = function () {
        // get question mark parameters
        vm.params = vm.parentCtrl.$location.$$search;
        // watch for api variable changing
        $scope.$watch('vm.api', function () {
            vm.getData();
        });
    };

    // build url to send to aeon
    var buildUrl = function buildUrl(data, item) {
        var url = 'https://aeon.hul.harvard.edu/aeon.php?sid=Via AEON';
        var keyList = Object.keys(data);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = keyList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                if (key === 'callNumber') {
                    url += '&callnum=' + data[key];
                }
                if (key === 'libraryCode') {
                    url += '&sublib=' + data[key];
                }
                if (key === 'locationDesc') {
                    url += '&collection=' + data[key];
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        if (item.description) {
            url += '&description=' + item.description;
        }
        if (item.barCode) {
            url += '&barcode=' + item.barCode;
        }

        keyList = Object.keys(vm.dataList);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = keyList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _key = _step2.value;

                if (_key === 'author' || _key === 'title' || _key === 'genre' || _key === 'publisher') {
                    url += '&' + _key + '=' + vm.dataList[_key];
                }
                if (_key === 'mmsId') {
                    url += '&hollisnum=' + vm.dataList[_key];
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return url;
    };

    vm.$doCheck = function () {
        // get config-dev.html api url from prm-topbar-after.js
        vm.api = sv.getApi();
    };

    // get data from primo-service
    vm.getData = function () {
        if (vm.api.aeonApiUrl && vm.params) {
            var url = vm.api.aeonApiUrl + '/' + vm.params['rft.local_attribute'];
            sv.getAjax(url, '', 'get').then(function (res) {
                var data = res.data;
                vm.dataList = data;
                if (data.holdingItems) {
                    vm.holdingItems = data.holdingItems;
                }
            }, function (err) {
                console.log(err);
            });
        }
    };

    // open a new window when a user click on the link
    vm.goto = function (data, item) {
        var url = buildUrl(data, item);
        window.open(encodeURI(url), '_blank');
    };

    // when a user press enter, call this function
    vm.pressLink = function (e, data, item) {
        if (e.which === 13) {
            vm.goto(data, item);
        }
    };
}]);

angular.module('viewCustom').component('customAeon', {
    bindings: { parentCtrl: '<' },
    controller: 'customAeonCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/custom-aeon.html'
});
/**
 * Created by samsan on 8/29/17.
 */

angular.module('viewCustom').controller('customBarcodeCtrl', ['customService', '$stateParams', '$scope', function (customService, $stateParams, $scope) {
    var vm = this;
    vm.result = {}; // store data from alma
    vm.item = {}; // store data from pnx
    vm.barcode = $stateParams.code;
    vm.almaBarcodeUrl = ''; // get rest end point url from config.text file
    vm.errorMsg = '';
    var cs = customService;

    // get relative path rest end point url
    vm.getUrl = function () {
        var config = cs.getEnv();
        cs.getAjax('/primo-explore/custom/01HVD/html/' + config, '', 'get').then(function (result) {
            if (result.data) {
                vm.almaBarcodeUrl = result.data.almaBarcodeUrl;
            }
        }, function (error) {
            console.log(error);
        });
    };

    vm.searchPNX = function () {
        // search for pnx item base on isbn number so it will get pnx/control/recordid
        var url = vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL;
        var params = { 'addfields': '', 'Inst': '01HVD', 'lang': 'en_US', 'limit': 10, 'offset': 0, 'getMore': 0, 'mode': 'advanced', 'pcAvailability': true, 'q': 'isbn,exact,0062020447,AND', 'vid': '01HVD', 'sort': 'rank', 'rtaLinks': true, 'scope': 'everything', 'tab': 'everything' };
        params.vid = vm.parentCtrl.vid;
        params.Inst = vm.parentCtrl.searchService.cheetah.inst;
        params.q = 'any,contains,' + vm.result.bib_data.mms_id;
        cs.getAjax(url, params, 'get').then(function (result) {
            if (result.data.docs) {
                vm.item = result.data.docs[0];
            }
        }, function (error) {
            console.log(error);
        });
    };

    // get result of barcode
    vm.getResult = function () {
        vm.determinateValue = 50;
        var param = { 'barcode': '' };
        param.barcode = $stateParams.code;
        cs.postAjax(vm.almaBarcodeUrl, param).then(function (result) {
            vm.determinateValue = 100;
            if (result.status === 200) {
                var data = result.data;
                if (data.errorList) {
                    vm.errorMsg = data.errorList.error[0].errorMessage;
                } else {
                    vm.result = data;
                    vm.searchPNX();
                }
            }
        }, function (error) {
            vm.errorMsg = error;
        });
    };

    vm.$onInit = function () {
        // get rest end point url from config.text file
        vm.getUrl();
        $scope.$watch('[vm.almaBarcodeUrl,vm.barcode]', function () {
            if (vm.almaBarcodeUrl && vm.barcode) {
                vm.getResult();
            }
        });
    };
}]);

angular.module('viewCustom').component('customBarcode', {
    bindings: { parentCtrl: '<' },
    controller: 'customBarcodeCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/custom-barcode.html'
});

/**
 * Created by samsan on 9/22/17.
 */

angular.module('viewCustom').service('customGoogleAnalytic', ['$timeout', function ($timeout) {
    var svObj = {};
    // initialize google analytic
    svObj.init = function () {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments);
            }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-52592218-13', 'auto', 'HVD2');
        ga('send', 'pageview');
    };

    // set up page
    svObj.setPage = function (urlPath, title) {
        $timeout(function () {

            var loc = window.location.href;
            ga('create', 'UA-52592218-13', 'auto', title);
            ga('send', { 'hitType': 'pageview', 'page': urlPath, 'title': title, location: loc });
        }, 500);
    };

    return svObj;
}]);

/**
 * Created by samsan on 9/20/17.
 */

angular.module('viewCustom').service('customHathiTrustService', ['$http', function ($http) {
    var serviceObj = {};

    serviceObj.doGet = function (url, param) {
        return $http({
            'method': 'get',
            'url': url,
            'timeout': 5000,
            'params': param
        });
    };

    serviceObj.doPost = function (url, param) {
        return $http({
            'method': 'post',
            'url': url,
            'timeout': 5000,
            'data': param
        });
    };

    serviceObj.validateHathiTrust = function (pnxItem) {
        var item = { 'flag': false, 'isbn': '', 'oclcid': '', 'data': {} };
        if (pnxItem.pnx.control.sourceid && pnxItem.pnx.delivery.delcategory && pnxItem.pnx.addata) {
            if (pnxItem.pnx.control.sourceid[0] === '01HVD_ALMA' && pnxItem.pnx.delivery.delcategory[0] !== 'Online Resource') {
                item.flag = true;
                if (pnxItem.pnx.addata.oclcid) {
                    item.oclcid = pnxItem.pnx.addata.oclcid[0];
                } else if (pnxItem.pnx.addata.isbn) {
                    item.isbn = pnxItem.pnx.addata.isbn[0];
                }
            }
        }
        return item;
    };

    // validate if orig data is harvard
    serviceObj.validateHarvard = function (arrList) {
        var item = {};
        for (var i = 0; i < arrList.length; i++) {
            if (arrList[i].orig === 'Harvard University' && arrList[i].usRightsString === 'Full view') {
                item = arrList[i];
                item.huflag = true;
                item.fullview = true;
                i = arrList.length;
            } else if (arrList[i].usRightsString === 'Full view') {
                item = arrList[i];
                item.huflag = false;
                item.fullview = true;
                i = arrList.length;
            } else if (arrList[i].usRightsString === 'Limited (search-only)') {
                item = arrList[i];
                item.huflag = false;
                item.fullview = false;
                i = arrList.length;
            }
        }
        return item;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 10/23/17.
 * Create Map it link, place icon, and display the library name
 */

angular.module('viewCustom').controller('customLibraryMapCtrl', ['customService', '$window', '$location', '$scope', '$sce', function (customService, $window, $location, $scope, $sce) {
    var vm = this;
    var sv = customService;
    vm.params = $location.search();
    vm.api = sv.getApi();
    vm.mapLocData = {};

    vm.getMapIt = function () {
        vm.api = sv.getApi();
        if (vm.api.mapUrl) {
            var url = vm.api.mapUrl + '/' + vm.params.library;
            url += '/' + vm.params.location + '?callNumber=' + encodeURI(vm.params.callnum);
            sv.getAjax(url, '', 'get').then(function (result) {
                vm.mapLocData = result.data;
            }, function (error) {
                console.log(error);
            });
        }
    };

    vm.$onInit = function () {
        $scope.$watch('vm.api', function () {
            vm.getMapIt();
        });
    };

    vm.$doCheck = function () {
        vm.api = sv.getApi();
    };

    vm.goPlace = function (loc, e) {
        e.stopPropagation();
        var url = 'http://nrs.harvard.edu/urn-3:hul.ois:' + loc.mainLocation;
        $window.open(url, '_blank');
        return true;
    };
}]);

angular.module('viewCustom').component('customLibraryMap', {
    bindings: { loc: '<' },
    controller: 'customLibraryMapCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/custom-library-map.html'
});

// map letter to specific word in floor
angular.module('viewCustom').filter('mapFilter', [function () {
    return function (str) {
        var newStr = '';
        if (str.length === 2) {
            var loc = str.substring(0, 1);
            var loc2 = str.substring(1, str.length);
            newStr = 'Floor ' + loc;
            if (loc2 === 'E') {
                newStr += ' East';
            } else if (loc2 === 'W') {
                newStr += ' West';
            } else if (loc2 === 'N') {
                newStr += ' North';
            } else if (loc2 === 'S') {
                newStr += ' South';
            }
        } else if (str.length === 1) {
            newStr = 'Floor ' + str;
        } else {
            newStr = str;
        }
        return newStr;
    };
}]);

// remove 2 forward slash from the url
angular.module('viewCustom').filter('mapFilterUrl', ['$sce', function ($sce) {
    return function (str) {
        var newStr = '';
        if (str) {
            var urlList = str.split('//');
            if (urlList.length > 2) {
                newStr = urlList[0] + '//' + urlList[1] + '/' + urlList[2];
            } else {
                newStr = str;
            }
        } else {
            newStr = str;
        }
        newStr = $sce.trustAsResourceUrl(newStr);
        return newStr;
    };
}]);
/**
 * Created by samsan on 9/13/17.
 */

angular.module('viewCustom').service('customMapService', [function () {
    var serviceObj = {};
    serviceObj.getRegexMatches = function (string, regex, index) {
        index || (index = 1); // default to the first capturing group
        var matches = [];
        var match;
        while (match = regex.exec(string)) {
            matches.push(match[index]);
        }
        return matches;
    };

    serviceObj.buildCoordinatesArray = function (inputString) {
        var coordinates;
        //Populate array with Minutes format converstion
        if (RegExp(/\$\$D([a-zA-Z])/).test(inputString)) {
            coordinates = serviceObj.getRegexMatches(inputString, /\$\$[DEFG](.{8})/g);
            for (var i = 0; i < coordinates.length; i++) {
                var hemisphere = coordinates[i].substr(0, 1);
                var degrees = parseInt(coordinates[i].substr(1, 3));
                var minutes = parseInt(coordinates[i].substr(4, 2));
                var seconds = parseInt(coordinates[i].substr(6, 2));

                var decimalValue;
                if (hemisphere == "N" || hemisphere == "E") coordinates[i] = degrees + (minutes + seconds / 60) / 60;else coordinates[i] = 0 - (degrees + (minutes + seconds / 60) / 60);
            }
        }

        //Populate array with Degrees values
        else if (RegExp(/\$\$D(\d|-)/).test(inputString)) {
                coordinates = serviceObj.getRegexMatches(inputString, /\$\$\w([\d\.-]+)/g);
            }

        //Round the numbers to 6 decimal points
        if (coordinates) {
            for (var i = 0; i < coordinates.length; i++) {
                coordinates[i] = Math.round(coordinates[i] * 1000000) / 1000000;
            }
        }
        return coordinates;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 11/21/17.
 */

angular.module('viewCustom').config(function ($stateProvider) {
    $stateProvider.state('exploreMain.almaMapIt', {
        url: '/almaMapIt',
        views: {
            '': {
                template: '<custom-library-map loc="$ctrl"></custom-library-map>'
            }
        }
    }).state('exploreMain.aeon', {
        url: '/aeon',
        views: {
            '': {
                template: '<custom-aeon parent-ctrl="$ctrl"></custom-aeon>'
            }
        }
    });
});

/**
 * Created by samsan on 7/18/17.
 * This is a service component and use to store data, get data, ajax call, compare any logic.
 */

angular.module('viewCustom').service('customService', ['$http', '$sce', '$window', function ($http, $sce, $window) {
    var serviceObj = {};

    // get environment to run config.html
    serviceObj.getEnv = function () {
        var host = $window.location.hostname;
        var config = 'config-prod.html';
        if (host.toLowerCase() === 'localhost') {
            config = 'config-local.html';
        } else if (host.toLowerCase() === 'primo-for-alma-01hvd.hosted.exlibrisgroup.com') {
            config = 'config-dev.html';
        }

        return config;
    };

    serviceObj.getAjax = function (url, param, methodType) {
        return $http({
            'method': methodType,
            'url': url,
            'timeout': 5000,
            'params': param
        });
    };

    serviceObj.postAjax = function (url, jsonObj) {
        // pass primo token to header with value call token
        $http.defaults.headers.common.token = jsonObj.token;
        return $http({
            'method': 'post',
            'url': url,
            'timeout': 5000,
            'data': jsonObj
        });
    };

    serviceObj.postData = function (url, jsonObj) {
        return $http({
            'method': 'post',
            'url': url,
            'timeout': 5000,
            'data': jsonObj
        });
    };

    // setter and getter for text msg data
    serviceObj.textData = {};
    serviceObj.setTextData = function (data) {
        serviceObj.textData = data;
    };

    serviceObj.getTextData = function () {
        return serviceObj.textData;
    };

    // action list selected
    serviceObj.actionName = 'none';
    serviceObj.setActionName = function (actionName) {
        serviceObj.actionName = actionName;
    };
    serviceObj.getActionName = function () {
        return serviceObj.actionName;
    };

    // setter and getter
    serviceObj.items = {};
    serviceObj.setItems = function (data) {
        serviceObj.items = data;
    };
    serviceObj.getItems = function () {
        return serviceObj.items;
    };

    // replace & . It cause error in firefox;
    serviceObj.removeInvalidString = function (str) {
        var pattern = /[\&]/g;
        return str.replace(pattern, '&amp;');
    };

    //parse xml
    serviceObj.convertXML = function (str) {
        var listItems = [];
        str = serviceObj.removeInvalidString(str);
        var xmldata = xmlToJSON.parseString(str);
        if (xmldata.requestlinkconfig) {
            listItems = xmldata.requestlinkconfig[0].mainlocationcode;
        }

        return listItems;
    };

    // setter and getter for library list data logic from xml file
    serviceObj.logicList = [];
    serviceObj.setLogicList = function (arr) {
        serviceObj.logicList = arr;
    };

    serviceObj.getLogicList = function () {
        return serviceObj.logicList;
    };

    // compare logic
    serviceObj.getLocation = function (currLoc) {
        var item = '';
        for (var i = 0; i < serviceObj.logicList.length; i++) {
            var data = serviceObj.logicList[i];
            if (data._attr.id._value === currLoc.location.mainLocation) {
                item = data;
                i = serviceObj.logicList.length;
            }
        }

        return item;
    };

    // setter and getter for parent locations data
    serviceObj.parentData = {};
    serviceObj.setParentData = function (data) {
        serviceObj.parentData = data;
    };
    serviceObj.getParentData = function () {
        return serviceObj.parentData;
    };

    // locationInfoArray when the current Location is matched with xml location
    // itemsCategory is an ajax response with itemcategorycode when pass current location
    serviceObj.getRequestLinks = function (locationInfoArray, itemsCategory, ItemType, TextDisplay, index, flagBoolean) {
        var requestItem = { 'flag': false, 'item': {}, 'type': '', 'text': '', 'displayflag': false };
        requestItem.type = ItemType; // requestItem, scanDeliver, aeonrequest
        requestItem.text = TextDisplay; // Request Item, Scan & Delivery, Schedule visit
        requestItem.displayflag = flagBoolean;

        if (itemsCategory.length > 0 && locationInfoArray.length > 0) {

            for (var i = 0; i < locationInfoArray.length; i++) {
                var json = locationInfoArray[i];

                for (var j = 0; j < itemsCategory.length; j++) {
                    var itemCat = itemsCategory[j].items;

                    if (itemCat.length > 0) {
                        var item = itemCat[index];
                        var itemCategoryCodeList = '';
                        if (json._attr.itemcategorycode) {
                            itemCategoryCodeList = json._attr.itemcategorycode._value;
                            if (itemCategoryCodeList.length > 1) {
                                itemCategoryCodeList = itemCategoryCodeList.toString();
                                itemCategoryCodeList = itemCategoryCodeList.split(';'); // convert comma into array
                            } else {
                                if (parseInt(itemCategoryCodeList)) {
                                    // add 0 infront of a number
                                    var arr = [];
                                    itemCategoryCodeList = '0' + itemCategoryCodeList.toString();
                                    arr.push(itemCategoryCodeList);
                                    itemCategoryCodeList = arr;
                                } else {
                                    itemCategoryCodeList = itemCategoryCodeList.toString();
                                    itemCategoryCodeList = itemCategoryCodeList.split(';');
                                }
                            }
                        }
                        var itemStatusNameList = '';
                        if (json._attr.itemstatusname) {
                            itemStatusNameList = json._attr.itemstatusname._value;
                            itemStatusNameList = itemStatusNameList.split(';'); // convert comma into array
                        }
                        var processingStatusList = '';
                        if (json._attr.processingstatus) {
                            processingStatusList = json._attr.processingstatus._value;
                            processingStatusList = processingStatusList.split(';'); // convert comma into array
                        }
                        var queueList = '';
                        if (json._attr.queue) {
                            queueList = json._attr.queue._value;
                            queueList = queueList.split(';'); // convert comma into array
                        }

                        if (itemCategoryCodeList.length > 0) {
                            // compare if item category code is number
                            if (itemCategoryCodeList.indexOf(item.itemcategorycode) !== -1) {
                                if (item.processingstatus === '') {
                                    item.processingstatus = 'NULL';
                                }
                                if (item.queue === '') {
                                    item.queue = 'NULL';
                                }
                                if (itemStatusNameList.indexOf(item.itemstatusname) !== -1 && processingStatusList.indexOf(item.processingstatus) !== -1) {
                                    if (queueList.indexOf(item.queue) !== -1) {
                                        requestItem.flag = true;
                                        requestItem.item = item;
                                        i = locationInfoArray.length;
                                    } else if (!queueList) {
                                        requestItem.flag = true;
                                        requestItem.item = item;
                                        i = locationInfoArray.length;
                                    }
                                } else if (itemStatusNameList.length > 0) {
                                    for (var k = 0; k < itemStatusNameList.length; k++) {
                                        var statusName = itemStatusNameList[k];
                                        statusName = statusName.replace(/\*/g, '');
                                        var itemstatusname = item.itemstatusname;
                                        if (itemstatusname.includes(statusName) && processingStatusList.indexOf(item.processingstatus) !== -1) {
                                            requestItem.flag = true;
                                            requestItem.item = item;
                                            i = locationInfoArray.length;
                                        }
                                    }
                                }
                            } else if (itemCategoryCodeList[0] === '*') {
                                // compare if item category code is asterisk
                                if (itemStatusNameList.indexOf(item.itemstatusname) !== -1 && processingStatusList.indexOf(item.processingstatus) !== -1) {
                                    requestItem.flag = true;
                                    requestItem.item = item;
                                    i = locationInfoArray.length;
                                } else if (itemStatusNameList.length > 0) {
                                    // remove asterisk and find word in the array list
                                    for (var k = 0; k < itemStatusNameList.length; k++) {
                                        var statusName = itemStatusNameList[k];
                                        statusName = statusName.replace(/\*/g, '');
                                        var itemstatusname = item.itemstatusname;
                                        if (itemstatusname.includes(statusName) && processingStatusList.indexOf(item.processingstatus) !== -1) {
                                            requestItem.flag = true;
                                            requestItem.item = item;
                                            i = locationInfoArray.length;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return requestItem;
    };

    serviceObj.auth = {};
    serviceObj.setAuth = function (data) {
        serviceObj.auth = data;
    };

    serviceObj.getAuth = function () {
        return serviceObj.auth;
    };

    // get url api from config.html file
    serviceObj.api = {};
    serviceObj.setApi = function (data) {
        serviceObj.api = data;
    };

    serviceObj.getApi = function () {
        return serviceObj.api;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 8/16/17.
 */

angular.module('viewCustom').controller('prmActionContainerAfterCtrl', ['customService', 'prmSearchService', '$window', 'customGoogleAnalytic', function (customService, prmSearchService, $window, customGoogleAnalytic) {

    var cisv = customService;
    var cs = prmSearchService;
    var cga = customGoogleAnalytic;
    var vm = this;
    vm.restsmsUrl = '';
    vm.locations = [];
    vm.temp = { 'phone': '' };
    vm.form = { 'phone': '', 'deviceType': '', 'body': '', 'error': '', 'mobile': false, 'msg': '', 'token': '', 'ip': '', 'sessionToken': '', 'isLoggedIn': false, 'iat': '', 'inst': '', 'vid': '', 'exp': '', 'userName': '', 'iss': '', 'onCampus': false };

    vm.$onChanges = function () {
        vm.auth = cisv.getAuth();
        if (vm.auth.primolyticsService.jwtUtilService) {
            vm.form.token = vm.auth.primolyticsService.jwtUtilService.storageUtil.sessionStorage.primoExploreJwt;
            vm.form.sessionToken = vm.auth.primolyticsService.jwtUtilService.storageUtil.localStorage.getJWTFromSessionStorage;
            vm.form.isLoggedIn = vm.auth.isLoggedIn;
            // decode JWT Token to see if it is a valid token
            var obj = vm.auth.authenticationService.userSessionManagerService.jwtUtilService.jwtHelper.decodeToken(vm.form.token);
            vm.form.ip = obj.ip;
            vm.form.iss = obj.iss;
            vm.form.userName = obj.userName;
            vm.form.iat = obj.iat;
            vm.form.exp = obj.exp;
            vm.form.vid = obj.viewId;
            vm.form.inst = obj.viewInstitutionCode;
            vm.form.onCampus = obj.onCampus;
        }
    };

    vm.keyChange = function (e) {
        if (e.which > 47 && e.which < 58) {
            vm.form.error = '';
            var phone = angular.copy(vm.temp.phone);
            phone = phone.replace(/[\(\)\-]/g, '');
            if (phone.length > 2 && phone.length < 5) {
                vm.temp.phone = '(' + phone.substring(0, 3) + ')' + phone.substring(3, phone.length);
            } else if (phone.length > 5 && phone.length < 14) {
                vm.temp.phone = '(' + phone.substring(0, 3) + ')' + phone.substring(3, 6) + '-' + phone.substring(6, phone.length);
            }
        } else if (e.which > 96 && e.which < 123) {
            vm.form.error = 'Enter invalid phone number';
        } else {
            vm.form.error = 'Enter invalid phone number';
        }
    };

    vm.$onInit = function () {
        // check if a user is using mobile phone or laptop browser
        vm.form.deviceType = cs.getPlatform();
        if (vm.form.deviceType) {
            vm.form.mobile = true;
        } else {
            vm.form.deviceType = cs.getBrowserType();
        }

        vm.locations = vm.parentCtrl.item.delivery.holding;
        for (var i = 0; i < vm.locations.length; i++) {
            vm.locations[i].cssClass = 'textsms-row';
        }
    };

    vm.$doCheck = function () {
        // get action name when a user click on each action list
        var actionName = cisv.getActionName();
        if (actionName && vm.parentCtrl.actionName !== 'none') {
            vm.parentCtrl.actionName = actionName;
        } else if (actionName === 'textsms') {
            vm.parentCtrl.actionName = actionName;
        }
    };

    // this function is trigger only if a user is using laptop computer
    vm.sendText = function (k) {
        // get rest endpoint from config.html file. It's preload in prm-topbar-after.js
        vm.api = cisv.getApi();
        if (vm.api) {
            vm.restsmsUrl = vm.api.smsUrl;
        }

        // reset the row css class
        for (var i = 0; i < vm.locations.length; i++) {
            vm.locations[i].cssClass = 'textsms-row';
        }
        // set select row highlite
        vm.locations[k].cssClass = 'textsms-row-visited';

        var phone = '';

        if (vm.temp.phone.length > 0) {
            phone = angular.copy(vm.temp.phone);
            phone = phone.replace(/[\(\)\-]/g, '');
        }

        vm.form.error = '';
        vm.form.msg = '';
        var count = 0;
        if (!phone) {
            vm.form.error = 'Enter your phone number';
            count++;
        } else if (isNaN(phone) || phone.length < 10) {
            vm.form.error = 'Enter a valid phone number';
            count++;
        }

        // get the library name and call number
        var el = document.getElementById('smsLocation');
        if (el) {
            vm.form.body = el.children[k].innerText;
        }
        if (count === 0) {
            vm.form.phone = phone;
            var title = '';
            if (vm.parentCtrl.item.pnx.display.title) {
                title = vm.parentCtrl.item.pnx.display.title[0];
                var pattern = /[:]/;
                if (pattern.test(title)) {
                    var arr = title.split(':');
                    title = arr[0];
                    if (title.length > 30) {
                        title = title.substring(0, 30);
                    }
                    title = title.trim();
                    title += '... ';
                } else if (title.length > 30) {
                    title = title.substring(0, 30);
                    title += '... ';
                } else {
                    title += '... ';
                }

                vm.form.body = title + vm.form.body;

                var sendTitle = vm.form.userName + ' : ' + vm.form.body;
                cga.setPage('/sendsms', sendTitle);
            }

            if (vm.form.mobile) {
                var url = 'sms:' + vm.form.phone + '&body=' + vm.form.body;
                $window.open(url, '_blank');
            } else {
                cisv.postAjax(vm.restsmsUrl, vm.form).then(function (result) {
                    if (result.status === 200) {
                        if (result.data.status) {
                            var data = JSON.parse(result.data.msg);
                            data = data.data.message[0];
                            if (data.accepted) {
                                vm.form.msg = 'The message has been sent to ' + vm.temp.phone + '.';
                            } else {
                                vm.form.msg = 'The message did not send. The ClickAtell did not accept sms.';
                            }
                        } else {
                            vm.form.msg = result.data.msg;
                        }
                    } else {
                        vm.form.msg = 'There is a technical issue with Text Message Server. Please try it later on.';
                    }
                }, function (error) {
                    console.log(error);
                    vm.form.msg = 'There is a technical issue with Text Message Server. The rest endpoint server may be down.';
                });
            }
        }
    };
}]);

angular.module('viewCustom').component('prmActionContainerAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmActionContainerAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-action-container-after.html'
});

/**
 * Created by samsan on 8/15/17.
 * This component will insert textsms and its icon into the action list
 */

angular.module('viewCustom').controller('prmActionListAfterCtrl', ['$element', '$compile', '$scope', '$timeout', 'customService', function ($element, $compile, $scope, $timeout, customService) {
    var vm = this;
    var cisv = customService;
    vm.$onInit = function () {
        // if holding location is existed, then insert Text call # into action list
        if (vm.parentCtrl.item.delivery.holding.length > 0) {
            // insert  textsms into existing action list
            vm.parentCtrl.actionLabelNamesMap.textsms = 'Text call #';
            vm.parentCtrl.actionListService.actionsToIndex.textsms = vm.parentCtrl.requiredActionsList.length + 1;
            if (vm.parentCtrl.actionListService.requiredActionsList.indexOf('textsms') === -1) {
                vm.parentCtrl.actionListService.requiredActionsList.push('textsms');
            }
        }
    };

    vm.$onChanges = function () {
        $timeout(function () {
            // if holding location is existed, then insert sms text call icon
            if (vm.parentCtrl.item.delivery.holding.length > 0) {
                var el = document.getElementById('textsms');
                if (el) {
                    //remove prm-icon
                    var prmIcon = el.children[0].children[0].children[0].children[0];
                    prmIcon.remove();
                    // insert new icon
                    var childNode = el.children[0].children[0].children[0];
                    var mdIcon = document.createElement('md-icon');
                    mdIcon.setAttribute('md-svg-src', '/primo-explore/custom/01HVD/img/ic_textsms_black_24px.svg');
                    childNode.prepend(mdIcon);
                    $compile(childNode)($scope); // refresh the dom
                }
            } else {
                var el = document.getElementById('textsms');
                if (el) {
                    el.remove();
                }
            }

            // print
            var printEl = document.getElementById('Print');
            if (printEl) {
                printEl.children[0].remove();
                var printTag = document.createElement('custom-print');
                printTag.setAttribute('parent-ctrl', 'vm.parentCtrl.item');
                printEl.appendChild(printTag);
                $compile(printEl.children[0])($scope);
            }
        }, 2000);
    };

    vm.$doCheck = function () {
        // pass active action to prm-action-container-after
        if (vm.parentCtrl.activeAction) {
            cisv.setActionName(vm.parentCtrl.activeAction);
        }
    };
}]);

angular.module('viewCustom').component('prmActionListAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmActionListAfterCtrl',
    controllerAs: 'vm'
});

/**
 * Created by samsan on 8/28/17.
 */

angular.module('viewCustom').controller('prmAdvancedSearchAfterCtrl', ['$location', '$stateParams', function ($location, $stateParams) {
    var vm = this;
    vm.form = { 'barcode': '', 'error': '' };
    if ($stateParams.code) {
        vm.form.barcode = $stateParams.code;
    }

    // route to barcode page if there is no error
    vm.searchByBarcode = function () {
        vm.form.error = '';
        if (!vm.form.barcode) {
            vm.form.error = 'Enter the barcode number';
        } else {
            $location.path('/barcode/' + vm.form.barcode);
        }
    };

    vm.keypressSearch = function (e) {
        if (e.which === 13) {
            vm.searchByBarcode();
        }
    };
}]);

angular.module('viewCustom').config(function ($stateProvider) {
    $stateProvider.state('exploreMain.barcode', {
        url: '/barcode/:code',
        views: {
            '': {
                template: '<custom-barcode parent-ctrl="$ctrl"></custom-barcode>'
            }
        }
    });
}).component('prmAdvancedSearchAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmAdvancedSearchAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-advanced-search-after.html'
});

/**
 * Created by samsan on 8/7/17.
 */

angular.module('viewCustom').controller('prmAuthenticationAfterController', ['customService', function (customService) {
    var vm = this;
    // initialize custom service search
    var sv = customService;
    // check if a user login
    vm.$onChanges = function () {
        sv.setAuth(vm.parentCtrl);
    };
}]);

angular.module('viewCustom').component('prmAuthenticationAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmAuthenticationAfterController'
});

/**
 * Created by samsan on 11/17/17.
 */

angular.module('viewCustom').controller('prmFullViewAfterCtrl', ['$element', function ($element) {
    var vm = this;
    vm.$onChanges = function () {

        console.log('**** prm-full-view-after ***');
        console.log(vm);
    };

    vm.onChangeTabEvent = function (e) {
        console.log(e);
    };
}]);

angular.module('viewCustom').component('prmFullViewAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmFullViewAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-full-view-after.html'
});
/**
 * Created by samsan on 11/1/17.
 */

angular.module('viewCustom').controller('prmFullViewServiceContainerAfterCtrl', ['$element', function ($element) {
    var vm = this;
    vm.$onChanges = function () {
        console.log('**** prm-full-view-service-container-after ****');
        console.log(vm);
    };
}]);

angular.module('viewCustom').component('prmFullViewServiceContainerAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmFullViewServiceContainerAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-full-view-service-container-after.html'
});

/**
 * Created by samsan on 8/9/17.
 * It remove old logo and replace it with new logo
 */

angular.module('viewCustom').controller('prmLogoAfterCtrl', ['$element', function ($element) {
    var vm = this;
    vm.$onChanges = function () {
        // remove image logo
        var el = $element[0].parentNode.children[0];
        if (el) {
            el.remove();
        }

        // remove skip link
        var el2 = $element[0].parentNode.parentNode.children[0];
        if (el2) {
            el2.remove();
        }
    };
}]);

angular.module('viewCustom').component('prmLogoAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmLogoAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-logo-after.html'
});

/**
 * Created by samsan on 9/18/17.
 */

angular.module('viewCustom').controller('prmPermalinkAfterCtrl', ['$scope', '$sce', '$element', function ($scope, $sce, $element) {
    var vm = this;
    vm.msg = { 'class': '' };
    vm.$onInit = function () {
        vm.permalinkText = '';
        // change perm a link to correct url
        $scope.$watch('vm.parentCtrl.permalink', function () {
            if (vm.parentCtrl.item) {
                if (vm.parentCtrl.item.pnx.display.lds03) {
                    vm.parentCtrl.permalink = vm.parentCtrl.item.pnx.display.lds03[0];
                }
            }
            if (vm.parentCtrl.permalink) {
                vm.permalink = $sce.trustAsHtml(vm.parentCtrl.permalink);
                // remove parent node
                var pNode = $element[0].parentNode.children[0];
                if (pNode) {
                    pNode.style.display = 'none';
                }
                // get link text
                var el = $element[0].children[0].children[0].children[0].children[0].children[0].children[0];
                if (el) {
                    vm.permalinkText = el.textContent;
                }
            }
        });
    };

    vm.selectText = function () {
        vm.msg.class = 'highlite';
    };
    vm.unSelectText = function () {
        vm.msg.class = '';
    };
}]);

angular.module('viewCustom').component('prmPermalinkAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmPermalinkAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-permalink-after.html'
});

/**
 * Created by samsan on 9/25/17.
 */

angular.module('viewCustom').controller('prmSearchBarAfterCtrl', ['$element', '$location', '$compile', '$scope', '$mdMedia', function ($element, $location, $compile, $scope, $mdMedia) {
    var vm = this;

    vm.$onInit = function () {
        var el = $element[0].parentNode.children[0].children[0].children[2];
        var button = document.createElement('button');
        button.setAttribute('id', 'browseButton');
        button.setAttribute('class', 'md-button md-primoExplore-theme browse-button');
        button.setAttribute('ng-click', 'vm.gotoBrowse()');
        var textNode = document.createTextNode('STARTS WITH (BROWSE BY...)');
        if ($mdMedia('xs') || $mdMedia('sm')) {
            textNode = document.createTextNode('BROWSE');
        }
        button.appendChild(textNode);
        var browseBtn = document.getElementById('browseButton');
        // if browse button doesn't exist, add new one
        if (!browseBtn) {
            el.appendChild(button);
            $compile(el)($scope);
        }
    };

    vm.gotoBrowse = function () {
        $location.path('/browse');
    };
}]);

angular.module('viewCustom').component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchBarAfterCtrl',
    controllerAs: 'vm'
});

/**
 * Created by samsan on 9/13/17.
 */

angular.module('viewCustom').controller('prmSearchResultAvailabilityLineAfterCtrl', ['customMapService', '$timeout', 'customHathiTrustService', 'customService', 'customGoogleAnalytic', '$q', 'prmSearchService', function (customMapService, $timeout, customHathiTrustService, customService, customGoogleAnalytic, $q, prmSearchService) {
    var vm = this;
    var cga = customGoogleAnalytic;
    var custService = customService;
    var cs = customMapService;
    var chts = customHathiTrustService;
    var prmsv = prmSearchService;
    // get endpoint url from config.html file
    vm.api = custService.getApi();
    // display of table of content
    vm.TOC = { 'type': '01HVD_ALMA', 'isbn': [], 'display': false };
    vm.itemPNX = {};
    vm.hathiTrust = {};
    var map;

    // find if pnx has table of content
    vm.findTOC = function () {
        if (vm.itemPNX.pnx.control.sourceid[0] === vm.TOC.type && vm.itemPNX.pnx.addata.isbn) {
            if (vm.itemPNX.pnx.addata.isbn.length > 1) {
                var listRequest = [];
                for (var i = 0; i < vm.itemPNX.pnx.addata.isbn.length; i++) {
                    var param = { 'isbn': '', 'hasData': false };
                    param.isbn = vm.itemPNX.pnx.addata.isbn[i];
                    var post = custService.postData(vm.api.tocUrl, param);
                    listRequest.push(post);
                }
                // put everything into a list of queue call
                var ajax = $q.all(listRequest);
                ajax.then(function (response) {
                    for (var k = 0; k < response.length; k++) {
                        var data = response[k].data;
                        var xmldata = prmsv.parseXml(data.result);
                        if (xmldata.ssi) {
                            // it has table of content
                            if (xmldata.ssi[0].TOC[0]) {
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
                }, function (error) {
                    console.log(error);
                });
            } else if (vm.itemPNX.pnx.addata.isbn) {
                vm.TOC.display = true;
                vm.TOC.isbn = vm.itemPNX.pnx.addata.isbn[0];
            }
        }
    };

    //This function is used to center and zoom the map based on WKT POINT(x y)
    vm.mapWKTPoint = function (map, wkt, popupText) {
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
    vm.mapWKTBbox = function (map, wkt, popupText) {
        if (popupText === "") {
            popupText = "<b>Extent of data set.</b>";
        }

        // define rectangle geographical bounds
        var bounds = [[wkt[2], wkt[0]], [wkt[3], wkt[1]]];

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

    vm.getHathiTrustData = function () {
        if (vm.api.hathiTrustUrl) {
            chts.doPost(vm.api.hathiTrustUrl, vm.hathiTrust).then(function (data) {
                if (data.data.items) {
                    vm.hathiTrustItem = chts.validateHarvard(data.data.items);
                }
            }, function (error) {
                console.log(error);
            });
        }
    };

    vm.$onInit = function () {
        // get rest endpoint url from config.html where it preload prm-tobar-after.js
        vm.api = custService.getApi();
        vm.itemPNX = vm.parentCtrl.result;
        // get table of content
        vm.findTOC();
        if (vm.itemPNX.pnx.display.lds40 && vm.parentCtrl.isFullView) {
            $timeout(function () {
                vm.coordinates = cs.buildCoordinatesArray(vm.itemPNX.pnx.display.lds40[0]);
                vm.centerLongitude = (vm.coordinates[0] + vm.coordinates[1]) / 2;
                vm.centerLatitude = (vm.coordinates[2] + vm.coordinates[3]) / 2;

                var zoom = 8;
                map = L.map('hglMap12', { center: [vm.centerLatitude, vm.centerLongitude],
                    zoom: zoom, keyboard: true, tap: true, zoomControl: false });

                // create the tile layer with correct attribution
                var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
                var osm = new L.TileLayer(osmUrl, { minZoom: zoom, maxZoom: 40, attribution: osmAttrib });

                map.setView([vm.centerLatitude, vm.centerLongitude], zoom);
                map.addLayer(osm);

                // custom zoom bar control that includes a Zoom Home function
                L.Control.zoomHome = L.Control.extend({
                    options: {
                        position: 'topleft',
                        zoomInText: '<i class="iconMapFontSize">+</i>',
                        zoomInTitle: 'Zoom in',
                        zoomOutText: '<i class="iconMapFontSize">-</i>',
                        zoomOutTitle: 'Zoom out',
                        zoomHomeText: '<img class="iconHome" src="/primo-explore/custom/01HVD/img/ic_home_black_18px.svg"/>',
                        zoomHomeTitle: 'Zoom home'
                    },

                    onAdd: function onAdd(map) {
                        var controlName = 'gin-control-zoom',
                            container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                            options = this.options;

                        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle, controlName + '-in', container, this._zoomIn);
                        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle, controlName + '-out', container, this._zoomOut);

                        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle, controlName + '-home', container, this._zoomHome);

                        this._updateDisabled();
                        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

                        return container;
                    },

                    onRemove: function onRemove(map) {
                        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
                    },

                    _zoomIn: function _zoomIn(e) {
                        this._map.zoomIn(e.shiftKey ? 3 : 1);
                    },

                    _zoomOut: function _zoomOut(e) {
                        this._map.zoomOut(e.shiftKey ? 3 : 1);
                        if (vm.itemPNX.pnx.display) {
                            var title = 'zoom-out: ' + vm.itemPNX.pnx.display.title[0];
                            cga.setPage('user-use-openMapStreet', title);
                        }
                    },

                    _zoomHome: function _zoomHome(e) {
                        map.setView([vm.centerLatitude, vm.centerLongitude], zoom);

                        if (vm.coordinates[0] == vm.coordinates[1] && vm.coordinates[2] == vm.coordinates[3]) {
                            vm.mapWKTPoint(map, vm.coordinates, "Center of data set coverage area.");
                        } else {
                            vm.mapWKTBbox(map, vm.coordinates, "Extent of data set.");
                        }
                    },

                    _createButton: function _createButton(html, title, className, container, fn) {
                        var link = L.DomUtil.create('a', className, container);
                        link.innerHTML = html;
                        link.href = '#';
                        link.title = title;

                        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation).on(link, 'click', L.DomEvent.stop).on(link, 'click', fn, this).on(link, 'click', this._refocusOnMap, this);

                        return link;
                    },

                    _updateDisabled: function _updateDisabled() {
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
            }, 1000);
        }

        // validate Hathi Trust to see if it is existed
        vm.hathiTrust = chts.validateHathiTrust(vm.itemPNX);
        vm.hathiTrustItem = {};
        if (vm.hathiTrust.flag) {
            vm.getHathiTrustData();
        }
    };
}]);

angular.module('viewCustom').component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchResultAvailabilityLineAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-search-result-availability-line-after.html'
});

/**
 * Created by samsan on 5/12/17.
 * This custom service use to inject to the controller.
 */

angular.module('viewCustom').service('prmSearchService', ['$http', '$window', '$filter', function ($http, $window, $filter) {
    var serviceObj = {};

    serviceObj.getPlatform = function () {
        var userAgent = $window.navigator.userAgent;
        var browsers = { ios: /ios/i, android: /android/i, blackberry: /blackberry/i, tablet: /tablet/i, iphone: /iphone/i, ipad: /ipad/i, samsung: /samsung/i };
        for (var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        };

        return '';
    };

    serviceObj.getBrowserType = function () {
        var userAgent = $window.navigator.userAgent;
        var browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };
        for (var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        };

        return '';
    };

    //http ajax service, pass in URL, parameters, method. The method can be get, post, put, delete
    serviceObj.getAjax = function (url, param, methodType) {
        return $http({
            'method': methodType,
            'url': url,
            'params': param
        });
    };

    serviceObj.postAjax = function (url, jsonObj) {
        return $http({
            'method': 'post',
            'url': url,
            'data': jsonObj
        });
    };

    // default page info
    serviceObj.page = { 'pageSize': 50, 'totalItems': 0, 'currentPage': 1, 'query': '', 'searchString': '', 'totalPages': 0, 'offset': 0, 'userClick': false };
    // getter for page info
    serviceObj.getPage = function () {
        // localStorage page info exist, just use the old one
        if ($window.localStorage.getItem('pageInfo')) {
            return JSON.parse($window.localStorage.getItem('pageInfo'));
        } else {
            return serviceObj.page;
        }
    };

    // setter for page info
    serviceObj.setPage = function (pageInfo) {
        // store page info on client browser by using html 5 local storage
        if ($window.localStorage.getItem('pageInfo')) {
            $window.localStorage.removeItem('pageInfo');
        }
        $window.localStorage.setItem('pageInfo', JSON.stringify(pageInfo));
        serviceObj.page = pageInfo;
    };

    // clear local storage
    serviceObj.removePageInfo = function () {
        if ($window.localStorage.getItem('pageInfo')) {
            $window.localStorage.removeItem('pageInfo');
        }
    };

    // replace & . It cause error in firefox;
    serviceObj.removeInvalidString = function (str) {
        var pattern = /[\&]/g;
        return str.replace(pattern, '&amp;');
    };

    //parse xml
    serviceObj.parseXml = function (str) {
        var options = {
            mergeCDATA: true, // extract cdata and merge with text nodes
            grokAttr: true, // convert truthy attributes to boolean, etc
            grokText: false, // convert truthy text/attr to boolean, etc
            normalize: true, // collapse multiple spaces to single space
            xmlns: true, // include namespaces as attributes in output
            namespaceKey: '_ns', // tag name for namespace objects
            textKey: '_text', // tag name for text nodes
            valueKey: '_value', // tag name for attribute values
            attrKey: '_attr', // tag for attr groups
            cdataKey: '_cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
            attrsAsObject: true, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
            stripAttrPrefix: true, // remove namespace prefixes from attributes
            stripElemPrefix: true, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
            childrenAsArray: true // force children into arrays
        };

        str = serviceObj.removeInvalidString(str);
        return xmlToJSON.parseString(str, options);
    };

    // maninpulate data and convert xml data to json
    serviceObj.convertData = function (data) {
        var newData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            obj.restrictedImage = false;
            if (obj.pnx.addata.mis1) {
                if (obj.pnx.addata.mis1.length > 0) {
                    var jsonObj = serviceObj.getXMLdata(obj.pnx.addata.mis1[0]);
                    if (jsonObj.surrogate) {
                        for (var k = 0; k < jsonObj.surrogate.length; k++) {
                            if (jsonObj.surrogate[k].image) {
                                if (jsonObj.surrogate[k].image[0]._attr) {
                                    if (jsonObj.surrogate[k].image[0]._attr.restrictedImage._value) {
                                        obj.restrictedImage = true;
                                        k = jsonObj.surrogate.length;
                                    }
                                }
                            }
                        }
                    }
                    if (jsonObj.image) {
                        for (var k = 0; k < jsonObj.image.length; k++) {
                            if (jsonObj.image[k]._attr.restrictedImage) {
                                if (jsonObj.image[k]._attr.restrictedImage._value) {
                                    obj.restrictedImage = true;
                                    k = jsonObj.image.length;
                                }
                            }
                        }
                    }
                }
            }
            // remove the $$U infront of url
            if (obj.pnx.links.thumbnail) {
                var imgUrl = $filter('urlFilter')(obj.pnx.links.thumbnail);
                obj.pnx.links.thumbnail[0] = serviceObj.getHttps(imgUrl);
            }
            newData[i] = obj;
        }

        return newData;
    };

    // get user login ID
    serviceObj.logID = false;
    serviceObj.setLogInID = function (logID) {
        serviceObj.logID = logID;
    };

    serviceObj.getLogInID = function () {
        return serviceObj.logID;
    };

    // getter and setter for item data for view full detail page
    serviceObj.item = {};
    serviceObj.setItem = function (item) {
        serviceObj.item = item;
    };

    serviceObj.getItem = function () {
        return serviceObj.item;
    };

    // getter and setter for single image data
    serviceObj.data = {};
    serviceObj.setData = function (data) {
        serviceObj.data = data;
    };

    serviceObj.getData = function () {
        return serviceObj.data;
    };

    // getter and setter for selected facet
    serviceObj.facets = [];
    serviceObj.setFacets = function (data) {
        serviceObj.facets = data;
    };
    serviceObj.getFacets = function () {
        return serviceObj.facets;
    };

    // setter and getter for a single image
    serviceObj.photo = {};
    serviceObj.setPhoto = function (data) {
        serviceObj.photo = data;
    };
    serviceObj.getPhoto = function () {
        return serviceObj.photo;
    };

    // get user profile for authentication to login
    serviceObj.auth = {};
    serviceObj.setAuth = function (data) {
        serviceObj.auth = data;
    };
    serviceObj.getAuth = function () {
        return serviceObj.auth;
    };

    serviceObj.modalDialogFlag = false;
    serviceObj.setDialogFlag = function (flag) {
        serviceObj.modalDialogFlag = flag;
    };

    serviceObj.getDialogFlag = function () {
        return serviceObj.modalDialogFlag;
    };

    // replace http with https
    serviceObj.getHttps = function (url) {
        var pattern = /^(http:)/i;
        if (pattern.test(url)) {
            return url.replace(pattern, 'https:');
        } else {
            return url;
        }
    };

    // find image if it is jp2 or not
    serviceObj.findJP2 = function (itemData) {
        var flag = false;
        if (itemData.thumbnail) {
            var thumbnailUrl = itemData.thumbnail[0]._attr.href._value;
            var photoUrl = itemData._attr.href._value;
            var thumbnailList = thumbnailUrl.split(':');
            var thumbnailFlag = 0;
            if (thumbnailList.length > 0) {
                thumbnailFlag = thumbnailList[thumbnailList.length - 1];
            }
            var photoList = photoUrl.split(':');
            var photoFlag = 1;
            if (photoList.length > 0) {
                photoFlag = photoList[photoList.length - 1];
            }
            if (photoFlag === thumbnailFlag) {
                flag = true;
            }
        }
        return flag;
    };

    // convert xml data to json data by re-group them
    serviceObj.getXMLdata = function (str) {
        var xmldata = '';
        var listArray = [];
        if (str) {
            xmldata = serviceObj.parseXml(str);
            if (xmldata.work) {
                listArray = [];
                var work = xmldata.work[0];
                if (!work.surrogate && work.image) {
                    var data = work;
                    if (work.image.length === 1) {
                        listArray = data;
                    } else {
                        listArray = [];
                        var images = angular.copy(work.image);
                        delete work.image;
                        for (var i = 0; i < images.length; i++) {
                            data = angular.copy(work);
                            data.image = [];
                            data.image[0] = images[i];
                            listArray.push(data);
                        }
                    }
                } else if (work.surrogate && work.image) {
                    var data = {};
                    listArray = [];
                    var images = angular.copy(work.image);
                    var surrogate = angular.copy(work.surrogate);
                    delete work.image;
                    delete work.surrogate;
                    for (var i = 0; i < images.length; i++) {
                        data = angular.copy(work);
                        data.image = [];
                        data.image[0] = images[i];
                        listArray.push(data);
                    }

                    data = {};
                    for (var i = 0; i < surrogate.length; i++) {
                        data = surrogate[i];
                        if (surrogate[i].image) {
                            for (var j = 0; j < surrogate[i].image.length; j++) {
                                data = angular.copy(surrogate[i]);
                                if (surrogate[i].image[j]) {
                                    data.image = [];
                                    data.image[0] = surrogate[i].image[j];
                                    data.thumbnail = surrogate[i].image[j].thumbnail;
                                    data._attr = surrogate[i].image[j]._attr;
                                    data.caption = surrogate[i].image[j].caption;
                                }
                                listArray.push(data);
                            }
                        } else {
                            listArray.push(data);
                        }
                    }
                }

                if (work.subwork && !work.surrogate) {
                    listArray = [];
                    for (var i = 0; i < work.subwork.length; i++) {
                        var aSubwork = work.subwork[i];
                        if (aSubwork.surrogate) {
                            for (var j = 0; j < aSubwork.surrogate.length; j++) {
                                var data = aSubwork.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSubwork.image) {
                            for (var k = 0; k < aSubwork.image.length; k++) {
                                var data = aSubwork;
                                data.thumbnail = aSubwork.image[k].thumbnail;
                                data._attr = aSubwork.image[k]._attr;
                                data.caption = aSubwork.image[k].caption;
                                listArray.push(data);
                            }
                        }
                        if (!aSubwork.image && !aSubwork.surrogate) {
                            listArray.push(aSubwork);
                        }
                    }
                }
                if (work.subwork && work.surrogate) {
                    listArray = [];
                    for (var i = 0; i < work.subwork.length; i++) {
                        var aSubwork = work.subwork[i];
                        if (aSubwork.surrogate) {
                            for (var j = 0; j < aSubwork.surrogate.length; j++) {
                                var data = aSubwork.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSubwork.image) {
                            for (var k = 0; k < aSubwork.image.length; k++) {
                                var data = aSubwork;
                                data.thumbnail = aSubwork.image[k].thumbnail;
                                data._attr = aSubwork.image[k]._attr;
                                data.caption = aSubwork.image[k].caption;
                                listArray.push(data);
                            }
                        }
                    }
                    for (var w = 0; w < work.surrogate.length; w++) {
                        var aSurrogate = work.surrogate[w];
                        if (aSurrogate.surrogate) {
                            for (var j = 0; j < aSurrogate.surrogate.length; j++) {
                                var data = aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSurrogate.image) {
                            for (var k = 0; k < aSurrogate.image.length; k++) {
                                var data = aSurrogate;
                                data.thumbnail = aSurrogate.image[k].thumbnail;
                                data._attr = aSurrogate.image[k]._attr;
                                data.caption = aSurrogate.image[k].caption;
                                listArray.push(data);
                            }
                        }
                    }
                }
                if (work.surrogate && !work.subwork) {
                    listArray = [];
                    for (var w = 0; w < work.surrogate.length; w++) {
                        var aSurrogate = work.surrogate[w];
                        if (aSurrogate.surrogate) {
                            for (var j = 0; j < aSurrogate.surrogate.length; j++) {
                                var data = aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSurrogate.image) {
                            for (var k = 0; k < aSurrogate.image.length; k++) {
                                var data = angular.copy(aSurrogate);
                                data.image[0] = aSurrogate.image[k];
                                listArray.push(data);
                            }
                        }
                        if (!aSurrogate.image && !aSurrogate.surrogate) {
                            listArray.push(aSurrogate);
                        }
                    }
                }

                xmldata = work;
                if (listArray.length > 0) {
                    xmldata.surrogate = listArray;
                }

                /* end work section ***/
            } else if (xmldata.group) {
                listArray = [];
                xmldata = xmldata.group[0];
                if (xmldata.subwork && xmldata.surrogate) {
                    var listArray = [];
                    var subwork = xmldata.subwork;
                    var surrogate = xmldata.surrogate;
                    // get all the surrogate under subwork
                    for (var i = 0; i < subwork.length; i++) {
                        var aSubwork = subwork[i];
                        if (aSubwork.surrogate) {
                            for (var k = 0; k < aSubwork.surrogate.length; k++) {
                                var data = aSubwork.surrogate[k];
                                listArray.push(data);
                            }
                        }
                        if (aSubwork.image) {
                            for (var j = 0; j < aSubwork.image.length; j++) {
                                var data = aSubwork;
                                data.thumbnail = aSubwork.image[j].thumbnail;
                                data._attr = aSubwork.image[j]._attr;
                                data.caption = aSubwork.image[j].caption;
                                listArray.push(data);
                            }
                        }
                        if (!aSubwork.surrogate && !aSubwork.image) {
                            listArray.push(aSubwork);
                        }
                    }
                    // get all surrogate
                    for (var i = 0; i < surrogate.length; i++) {
                        var aSurrogate = surrogate[i];
                        if (aSurrogate.surrogate) {
                            for (var j = 0; j < aSurrogate.surrogate.length; j++) {
                                var data = aSurrogate.surrogate[j];
                                listArray.push(data);
                            }
                        }
                        if (aSurrogate.image) {
                            for (var j = 0; j < aSurrogate.image.length; j++) {
                                var data = aSurrogate;
                                data.thumbnail = aSurrogate.image[j].thumbnail;
                                data._attr = aSurrogate.image[j]._attr;
                                data.caption = aSurrogate.image[j].caption;
                                listArray.push(data);
                            }
                        }
                        if (!aSurrogate.surrogate && !aSurrogate.image) {
                            listArray.push(aSurrogate);
                        }
                    }
                    xmldata.surrogate = listArray;
                } else if (xmldata.subwork && !xmldata.surrogate) {
                    // transfer subwork to surrogate
                    var surrogate = [];
                    listArray = [];
                    var subwork = angular.copy(xmldata.subwork);
                    delete xmldata.subwork;
                    for (var i = 0; i < subwork.length; i++) {
                        if (subwork[i].surrogate) {
                            surrogate = angular.copy(subwork[i].surrogate);
                            delete subwork[i].surrogate;
                            for (var k = 0; k < surrogate.length; k++) {
                                if (surrogate[k].image) {
                                    var images = angular.copy(surrogate[k].image);
                                    delete surrogate[k].image;
                                    for (var c = 0; c < images.length; c++) {
                                        var data = surrogate[k];
                                        data.image = [];
                                        data.image[0] = images[c];
                                        listArray.push(data);
                                    }
                                } else {
                                    listArray.push(surrogate[k]);
                                }
                            }
                        }
                        if (subwork[i].image) {
                            var images = angular.copy(subwork[i].image);
                            delete subwork[i].image;
                            for (var j = 0; j < images.length; j++) {
                                var data = subwork[i];
                                data.image = [];
                                data.image[0] = images[j];
                                listArray.push(data);
                            }
                        }
                    }

                    xmldata.surrogate = listArray;
                }
            }
        }
        return xmldata;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 8/9/17.
 *  This component is creating white top bar, link menu on the right, and remove some doms
 */

angular.module('viewCustom').controller('prmTopbarAfterCtrl', ['$element', '$timeout', 'customService', 'customGoogleAnalytic', function ($element, $timeout, customService, customGoogleAnalytic) {
    var vm = this;
    var cs = customService;
    var cga = customGoogleAnalytic;
    vm.api = {};
    // get rest endpoint Url
    vm.getUrl = function () {
        var config = cs.getEnv();
        cs.getAjax('/primo-explore/custom/01HVD/html/' + config, '', 'get').then(function (res) {
            vm.api = res.data;
            cs.setApi(vm.api);
        }, function (error) {
            console.log(error);
        });
    };

    vm.$onInit = function () {
        // initialize google analytic
        cga.init();

        // pre-load config.html file
        vm.getUrl();

        $timeout(function () {
            // create script tag link leafletJS.com to use openstreetmap.org
            var bodyTag = document.getElementsByTagName('body')[0];
            var scriptTag = document.createElement('script');
            scriptTag.setAttribute('src', 'https://unpkg.com/leaflet@1.2.0/dist/leaflet.js');
            scriptTag.setAttribute('integrity', 'sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log==');
            scriptTag.setAttribute('crossorigin', '');
            bodyTag.append(scriptTag);
            // create link tag
            var linkTag = document.createElement('link');
            linkTag.setAttribute('href', 'https://unpkg.com/leaflet@1.2.0/dist/leaflet.css');
            linkTag.setAttribute('integrity', 'sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ==');
            linkTag.setAttribute('crossorigin', '');
            linkTag.setAttribute('rel', 'stylesheet');
            bodyTag.append(linkTag);
        }, 1000);
    };
}]);

angular.module('viewCustom').component('prmTopbarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmTopbarAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-topbar-after.html'
});

/* Copyright 2015 William Summers, MetaTribal LLC
 * adapted from https://developer.mozilla.org/en-US/docs/JXON
 *
 * Licensed under the MIT License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @author William Summers
 *
 */

var xmlToJSON = function () {

    this.version = "1.3";

    var options = { // set up the default options
        mergeCDATA: true, // extract cdata and merge with text
        grokAttr: true, // convert truthy attributes to boolean, etc
        grokText: true, // convert truthy text/attr to boolean, etc
        normalize: true, // collapse multiple spaces to single space
        xmlns: true, // include namespaces as attribute in output
        namespaceKey: '_ns', // tag name for namespace objects
        textKey: '_text', // tag name for text nodes
        valueKey: '_value', // tag name for attribute values
        attrKey: '_attr', // tag for attr groups
        cdataKey: '_cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
        attrsAsObject: true, // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
        stripAttrPrefix: true, // remove namespace prefixes from attributes
        stripElemPrefix: true, // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
        childrenAsArray: true // force children into arrays
    };

    var prefixMatch = new RegExp(/(?!xmlns)^.*:/);
    var trimMatch = new RegExp(/^\s+|\s+$/g);

    this.grokType = function (sValue) {
        if (/^\s*$/.test(sValue)) {
            return null;
        }
        if (/^(?:true|false)$/i.test(sValue)) {
            return sValue.toLowerCase() === "true";
        }
        if (isFinite(sValue)) {
            return parseFloat(sValue);
        }
        return sValue;
    };

    this.parseString = function (xmlString, opt) {
        return this.parseXML(this.stringToXML(xmlString), opt);
    };

    this.parseXML = function (oXMLParent, opt) {

        // initialize options
        for (var key in opt) {
            options[key] = opt[key];
        }

        var vResult = {},
            nLength = 0,
            sCollectedTxt = "";

        // parse namespace information
        if (options.xmlns && oXMLParent.namespaceURI) {
            vResult[options.namespaceKey] = oXMLParent.namespaceURI;
        }

        // parse attributes
        // using attributes property instead of hasAttributes method to support older browsers
        if (oXMLParent.attributes && oXMLParent.attributes.length > 0) {
            var vAttribs = {};

            for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
                var oAttrib = oXMLParent.attributes.item(nLength);
                vContent = {};
                var attribName = '';

                if (options.stripAttrPrefix) {
                    attribName = oAttrib.name.replace(prefixMatch, '');
                } else {
                    attribName = oAttrib.name;
                }

                if (options.grokAttr) {
                    vContent[options.valueKey] = this.grokType(oAttrib.value.replace(trimMatch, ''));
                } else {
                    vContent[options.valueKey] = oAttrib.value.replace(trimMatch, '');
                }

                if (options.xmlns && oAttrib.namespaceURI) {
                    vContent[options.namespaceKey] = oAttrib.namespaceURI;
                }

                if (options.attrsAsObject) {
                    // attributes with same local name must enable prefixes
                    vAttribs[attribName] = vContent;
                } else {
                    vResult[options.attrKey + attribName] = vContent;
                }
            }

            if (options.attrsAsObject) {
                vResult[options.attrKey] = vAttribs;
            } else {}
        }

        // iterate over the children
        if (oXMLParent.hasChildNodes()) {
            for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
                oNode = oXMLParent.childNodes.item(nItem);

                if (oNode.nodeType === 4) {
                    if (options.mergeCDATA) {
                        sCollectedTxt += oNode.nodeValue;
                    } else {
                        if (vResult.hasOwnProperty(options.cdataKey)) {
                            if (vResult[options.cdataKey].constructor !== Array) {
                                vResult[options.cdataKey] = [vResult[options.cdataKey]];
                            }
                            vResult[options.cdataKey].push(oNode.nodeValue);
                        } else {
                            if (options.childrenAsArray) {
                                vResult[options.cdataKey] = [];
                                vResult[options.cdataKey].push(oNode.nodeValue);
                            } else {
                                vResult[options.cdataKey] = oNode.nodeValue;
                            }
                        }
                    }
                } /* nodeType is "CDATASection" (4) */
                else if (oNode.nodeType === 3) {
                        sCollectedTxt += oNode.nodeValue;
                    } /* nodeType is "Text" (3) */
                    else if (oNode.nodeType === 1) {
                            /* nodeType is "Element" (1) */

                            if (nLength === 0) {
                                vResult = {};
                            }

                            // using nodeName to support browser (IE) implementation with no 'localName' property
                            if (options.stripElemPrefix) {
                                sProp = oNode.nodeName.replace(prefixMatch, '');
                            } else {
                                sProp = oNode.nodeName;
                            }

                            vContent = xmlToJSON.parseXML(oNode);

                            if (vResult.hasOwnProperty(sProp)) {
                                if (vResult[sProp].constructor !== Array) {
                                    vResult[sProp] = [vResult[sProp]];
                                }
                                vResult[sProp].push(vContent);
                            } else {
                                if (options.childrenAsArray) {
                                    vResult[sProp] = [];
                                    vResult[sProp].push(vContent);
                                } else {
                                    vResult[sProp] = vContent;
                                }
                                nLength++;
                            }
                        }
            }
        } else if (!sCollectedTxt) {
            // no children and no text, return null
            if (options.childrenAsArray) {
                vResult[options.textKey] = [];
                vResult[options.textKey].push(null);
            } else {
                vResult[options.textKey] = null;
            }
        }

        if (sCollectedTxt) {
            if (options.grokText) {
                var value = this.grokType(sCollectedTxt.replace(trimMatch, ''));
                if (value !== null && value !== undefined) {
                    vResult[options.textKey] = value;
                }
            } else if (options.normalize) {
                vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '').replace(/\s+/g, " ");
            } else {
                vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '');
            }
        }

        return vResult;
    };

    // Convert xmlDocument to a string
    // Returns null on failure
    this.xmlToString = function (xmlDoc) {
        try {
            var xmlString = xmlDoc.xml ? xmlDoc.xml : new XMLSerializer().serializeToString(xmlDoc);
            return xmlString;
        } catch (err) {
            return null;
        }
    };

    // Convert a string to XML Node Structure
    // Returns null on failure
    this.stringToXML = function (xmlString) {
        try {
            var xmlDoc = null;

            if (window.DOMParser) {

                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlString, "text/xml");

                return xmlDoc;
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlString);

                return xmlDoc;
            }
        } catch (e) {
            return null;
        }
    };

    return this;
}.call({});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = xmlToJSON;else if (typeof define === "function" && define.amd) define(function () {
    return xmlToJSON;
});
})();