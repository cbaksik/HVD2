(function(){
"use strict";
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
    vm.ajaxLoader = false;
    vm.msg = { 'error': '', 'class': 'body' };
    vm.$onInit = function () {
        // hide top bar and search box
        var prmTopbar = document.getElementsByTagName('prm-topbar')[0];
        if (prmTopbar) {
            prmTopbar.style.display = 'none';
        }
        var prmSearchBar = document.getElementsByTagName('prm-search-bar')[0];
        if (prmSearchBar) {
            prmSearchBar.style.display = 'none';
        }

        // get question mark parameters
        vm.params = vm.parentCtrl.$location.$$search;
        // watch for api variable changing
        $scope.$watch('vm.api.aeonApiUrl', function () {
            vm.getData();
        });
    };

    // build url to send to aeon
    var buildUrl = function buildUrl(data, item) {
        var url = 'https://aeontest.hul.harvard.edu/logon?action=10&form=30&sid=Via AEON';
        var keyList = Object.keys(data);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = keyList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                var val = data[key];
                if (!val) {
                    val = '';
                }
                if (key === 'callNumber') {
                    url += '&callnum=' + val;
                }
                if (key === 'libraryCode') {
                    url += '&sublib=' + val;
                }
                if (key === 'locationCode') {
                    url += '&collection=' + val;
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

                var value = vm.dataList[_key];
                if (!value) {
                    value = '';
                }
                if (_key === 'author' || _key === 'title' || _key === 'genre' || _key === 'publisher') {
                    url += '&' + _key + '=' + value;
                }
                if (_key === 'mmsId') {
                    url += '&hollisnum=' + value;
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
            vm.ajaxLoader = true;
            var url = vm.api.aeonApiUrl + '/' + vm.params['mmsid'];
            sv.getAjax(url, '', 'get').then(function (res) {
                var data = res.data;
                vm.dataList = data;
                vm.ajaxLoader = false;
                if (data.holdingItems) {
                    vm.holdingItems = data.holdingItems;
                    vm.msg.class = 'body';
                }
                if (vm.dataList.recordsFound === false) {
                    vm.msg.class = 'body2';
                }
            }, function (err) {
                console.log(err);
                vm.ajaxLoader = false;
                vm.msg.error = 'Http Request XHR is error';
                console.log(vm.msg.error);
                vm.msg.class = 'body2';
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
 * Created by samsan on 3/19/18.
 * This custom alert component is used for home page on the right side splash
 * If you need to turn off or on, just set status in json file to on or off
 */

(function () {
    angular.module('viewCustom').controller('customAlertCtrl', ['customService', '$scope', function (customService, $scope) {
        var vm = this;
        var cs = customService;
        vm.apiUrl = {};
        vm.alertMsg = {};

        vm.$onInit = function () {
            vm.apiUrl = cs.getApi();
            $scope.$watch('vm.apiUrl.alertUrl', function () {
                if (vm.apiUrl.alertUrl) {
                    cs.getAjax(vm.apiUrl.alertUrl, '', 'get').then(function (res) {
                        vm.alertMsg = res.data;
                    }, function (err) {
                        console.log(err);
                    });
                }
            });
        };
    }]);

    angular.module('viewCustom').component('customAlert', {
        bindings: { parentCtrl: '<' },
        controller: 'customAlertCtrl',
        controllerAs: 'vm',
        templateUrl: '/primo-explore/custom/01HVD/html/custom-alert.html'
    });
})();

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
 * Created by samsan on 3/21/18.
 * This custom filters are using with component to filter out data
 */

(function () {
    // truncate word to limit 60 characters
    angular.module('viewCustom').filter('truncatefilter', function () {
        return function (str) {
            var newstr = str;
            var index = 45;
            if (str) {
                if (str.length > 45) {
                    newstr = str.substring(0, 45);
                    for (var i = newstr.length; i > 20; i--) {
                        var text = newstr.substring(i - 1, i);
                        if (text === ' ') {
                            index = i;
                            i = 20;
                        }
                    }
                    newstr = str.substring(0, index) + '...';
                }
            }

            return newstr;
        };
    });
})();

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
 * Created by samsan on 3/26/18.
 * This header will use for image component page and image detail page
 */

(function () {

    angular.module('viewCustom').controller('customHeaderCtrl', [function () {
        var vm = this;
    }]);

    angular.module('viewCustom').component('customHeader', {
        bindings: { parentCtrl: '<' },
        controller: 'customHeaderCtrl',
        controllerAs: 'vm',
        templateUrl: '/primo-explore/custom/01HVD/html/custom-header.html'
    });
})();

/**
 * Created by samsan on 8/7/17.
 * This service is used for Digital Bookplates
 */

(function () {
    'use strict';

    angular.module('viewCustom').service('customImagesService', [function () {
        var serviceObj = {};

        // validate url start with $$U and contain $$D, then return new item list
        serviceObj.extractImageUrl = function (item, recordLinks) {
            var itemList = [];
            if (item.pnx.links) {
                var lln02 = item.pnx.links.lln02;
                var k = 0;
                if (lln02) {
                    for (var i = 0; i < lln02.length; i++) {
                        var patternUrl = /^(\$\$U)/;
                        var patternWord = /(\$\$D)/;
                        var url = lln02[i];
                        if (patternUrl.test(url) && patternWord.test(url)) {
                            var newStr = url.split(' ');
                            newStr = newStr[0];
                            var newUrl = newStr.substring(3, newStr.length);

                            for (var j = 0; j < recordLinks.length; j++) {
                                var record = recordLinks[j];
                                var linkURL = record.linkURL;
                                if (linkURL) {
                                    linkURL = linkURL.trim(' ');
                                    newUrl = newUrl.trim(' ');
                                    if (newUrl === linkURL) {
                                        // replace old url with word EBKPLL with EBKPLT
                                        linkURL = linkURL.replace(/(EBKPLL)/, 'EBKPLT');
                                        record.linkNewURL = linkURL + '?width=155&height=205';
                                        itemList[k] = record;
                                        k++;
                                        j = recordLinks.length;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return itemList;
        };

        // remove json object from json array
        serviceObj.removeMatchItems = function (arrayList, targetList) {
            var itemsList = [];
            if (arrayList.length > 0 && targetList.length > 0) {
                for (var i = 0; i < arrayList.length; i++) {
                    var arr = arrayList[i];
                    var flag = true;
                    // find item that match
                    for (var k = 0; k < targetList.length; k++) {
                        var target = targetList[k];
                        if (arr['@id'] === target['@id']) {
                            flag = false;
                            k = targetList.length;
                        }
                    }
                    // push item into list if it is not match
                    if (flag) {
                        itemsList.push(arr);
                    }
                }
            }
            return itemsList;
        };

        return serviceObj;
    }]);
})();
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
 * Created by samsan on 9/28/17.
 */

angular.module('viewCustom').service('customMapXmlKeys', [function () {
    var serviceObj = {};

    // filter the xml key node
    serviceObj.keys = [{ 'lds01': 'HOLLIS Number' }, { 'lds04': 'Variant Title' }, { 'lds07': 'Publication Info' }, { 'lds08': 'Permalink' }, { 'lds13': 'Notes' }, { 'lds22': 'Style / Period' }, { 'lds23': 'Culture' }, { 'lds24': 'Related Work' }, { 'lds25': 'Related Information' }, { 'lds26': 'Repository' }, { 'lds27': 'Use Restrictions' }, { 'lds30': 'Form / Genre' }, { 'lds31': 'Place' }, { 'lds44': 'Associated Name' }, { 'associatedName': 'Associated Name' }, { 'creationdate': 'Creation Date' }, { 'creator': 'Author / Creator' }, { 'format': 'Description' }, { 'freeDate': 'Date' }, { 'itemIdentifier': 'Identifier' }, { 'placeName': 'Place' }, { 'production': 'Publication info' }, { 'relatedWork': 'Related Work' }, { 'relatedInformation': 'Related Information' }, { 'rights': 'Copyright' }, { 'state': 'Edition' }, { 'topic': 'Subject' }, { 'workType': 'Form / Genre' }, { 'useRestrictions': 'Use Restrictions' }, { 'hvd_associatedName': 'Image Associated Name' }, { 'hvd_classification': 'Image Classification' }, { 'hvd_copyright': 'Image Copyright' }, { 'hvd_creator': 'Image Creator' }, { 'hvd_culture': 'Image Culture' }, { 'hvd_description': 'Image Description' }, { 'hvd_dimensions': 'Image Dimensions' }, { 'hvd_freeDate': 'Image Date' }, { 'hvd_itemIdentifier': 'Image Identifier' }, { 'hvd_materials': 'Image Materials' }, { 'hvd_notes': 'Image Notes' }, { 'hvd_note': 'Image Notes' }, { 'hvd_placeName': 'Image Place' }, { 'hvd_production': 'Image Publication info' }, { 'hvd_relatedInformation': 'Image Related info' }, { 'hvd_relatedWork': 'Image Related Work' }, { 'hvd_repository': 'Harvard Repository' }, { 'hvd_state': 'Image Edition' }, { 'hvd_style': 'Image Style' }, { 'hvd_title': 'Image Title' }, { 'hvd_topic': 'Image Subject' }, { 'hvd_useRestrictions': 'Image Use Restrictions' }, { 'hvd_workType': 'Image Type' }, { '_attr': 'Image ID' }, { '_text': 'TEXT' }];

    // remove hvd_ from the key
    serviceObj.mapKey = function (key) {
        var myKey = key;

        for (var i = 0; i < serviceObj.keys.length; i++) {
            var obj = serviceObj.keys[i];
            if (Object.keys(obj)[0] === key) {
                myKey = serviceObj.keys[i][key];
            }
        }

        return myKey;
    };

    // do not show these items
    serviceObj.removeList = ['lds03', 'lds08', 'lds20', 'lds37', 'structuredDate', 'image', 'source', 'altComponentID'];
    serviceObj.getRemoveList = function () {
        return serviceObj.removeList;
    };

    //re-arrange sorting order
    serviceObj.order = ['title', 'lds04', 'creator', 'creationdate', 'edition', 'lds07', 'format', 'lds13', 'subject', 'lds31', 'lds23', 'lds22', 'lds30', 'identifier', 'lds44', 'lds24', 'lds25', 'lds27', 'rights', 'lds26', 'lds01'];

    serviceObj.sort = function (listKey) {
        var keys = [];
        for (var i = 0; i < serviceObj.order.length; i++) {
            var key = serviceObj.order[i];
            var index = listKey.indexOf(key);
            if (index !== -1) {
                keys.push(key);
            }
        }

        return keys;
    };

    // re-arrange sorting component order
    serviceObj.orderList = ['title', 'creator', 'freeDate', 'state', 'production', 'description', 'physicalDescription', 'materials', 'dimensions', 'notes', 'note', 'topic', 'placeName', 'location', 'culture', 'style', 'workType', 'classification', 'itemIdentifier', 'associatedName', 'relatedWork', 'relatedInformation', 'useRestrictions', 'copyright', 'repository'];
    serviceObj.getOrderList = function (listKey) {
        var keys = [];
        var hvdKeys = [];
        var key = '';
        var pattern = /^(hvd_)/i;
        // find hvd key
        for (var j = 0; j < listKey.length; j++) {
            key = listKey[j];
            if (pattern.test(key)) {
                hvdKeys.push(key);
            }
        }

        for (var i = 0; i < serviceObj.orderList.length; i++) {
            key = serviceObj.orderList[i];
            var index = listKey.indexOf(key);
            if (index !== -1) {
                keys.push(key);
            }
        }

        if (hvdKeys.length > 0) {
            for (var i = 0; i < serviceObj.orderList.length; i++) {
                var keyMap = serviceObj.orderList[i];
                key = 'hvd_' + keyMap;
                var index = hvdKeys.indexOf(key);
                if (index !== -1) {
                    keys.push(key);
                }
            }
        }
        if (listKey.length > 0) {
            var index = listKey.indexOf('_attr');
            if (index !== -1) {
                keys.push('_attr');
            }
        }

        return keys;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 10/13/17.
 */
angular.module('viewCustom').service('customMapXmlValues', [function () {
    var serviceObj = {};

    // get relatedInformation value
    serviceObj.getRelatedInformation = function (nodeValue) {
        var str = '';
        var keys = Object.keys(nodeValue);
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var values = nodeValue[key];
                if (values) {
                    var nodeKeys = Object.keys(values);
                    var text = '';
                    var url = '';
                    var index = nodeKeys.indexOf('_text');
                    if (index !== -1) {
                        text = values['_text'];
                    }
                    var index2 = nodeKeys.indexOf('_attr');
                    if (index2 !== -1) {
                        var href = values['_attr'];
                        if (href) {
                            var nodeKeys2 = Object.keys(href);
                            var index3 = nodeKeys2.indexOf('href');
                            if (index3 !== -1) {
                                url = values['_attr']['href']['_value'];
                            }
                        }
                    }
                    if (url && text) {
                        str = '<a href="' + url + '" target="_blank">' + text + '</a><br/>';
                    }
                }
            }
        }
        if (str) {
            str = str.replace(/<br\/>$/, '');
        }
        return str;
    };

    // get associatedName value
    serviceObj.getAssociatedName = function (nodeValue) {
        var str = '';
        var name = '';
        var dates = '';
        var role = '';
        var keys = Object.keys(nodeValue);
        for (var i = 0; i < keys.length; i++) {
            var nodeKey = keys[i];
            var values = nodeValue[nodeKey];
            if (values) {
                var nodeKeys = Object.keys(values);
                var index = nodeKeys.indexOf('nameElement');
                var index2 = nodeKeys.indexOf('dates');
                var index3 = nodeKeys.indexOf('role');
                if (index !== -1) {
                    name = values['nameElement'];
                    if (Array.isArray(name)) {
                        name = name[0]['_text'];
                    }
                }

                if (index2 !== -1) {
                    dates = values['dates'];
                    if (Array.isArray(dates)) {
                        dates = dates[0]['_text'];
                    }
                    if (dates) {
                        dates = ', ' + dates;
                    }
                }

                if (index3 !== -1) {
                    role = values['role'];
                    if (Array.isArray(role)) {
                        role = ' [' + role[0]['_text'] + ']';
                    }
                    str += name + dates + role + '<br/>';
                } else {
                    str += name + dates + '<br/>';
                }
            }
        }
        if (str) {
            str = str.replace(/<br\/>$/, '');
        }
        return str;
    };

    // get image ID
    serviceObj.getAttr = function (nodeValue) {
        var str = '';
        var keys = Object.keys(nodeValue);
        if (keys.length > 0) {
            var index = keys.indexOf('componentID');
            if (index !== -1) {
                var componentID = nodeValue['componentID'];
                if ((typeof componentID === 'undefined' ? 'undefined' : _typeof(componentID)) === 'object' && componentID !== null) {
                    componentID = componentID['_value'];
                }
                str = componentID;
            }
        }
        return str;
    };

    // get relatedWork
    serviceObj.getTopic = function (nodeValue) {
        var str = '';
        var keys = Object.keys(nodeValue);
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                var nodeKey = keys[i];
                var values = nodeValue[nodeKey];
                if ((typeof values === 'undefined' ? 'undefined' : _typeof(values)) === 'object' && values !== null) {
                    var nodeKeys2 = Object.keys(values);
                    for (var k = 0; k < nodeKeys2.length; k++) {
                        var nodekey3 = nodeKeys2[k];
                        if (nodekey3) {
                            var values2 = values[nodekey3];
                            if ((typeof values2 === 'undefined' ? 'undefined' : _typeof(values2)) === 'object' && values2 !== null) {
                                var nodekeys4 = Object.keys(values2);
                                if (nodekeys4) {
                                    var values3 = values2[nodekeys4];
                                    if ((typeof values3 === 'undefined' ? 'undefined' : _typeof(values3)) === 'object' && values3 !== null) {
                                        var nodeKeys5 = Object.keys(values3);
                                        for (var c = 0; c < nodeKeys5.length; c++) {
                                            var nodekey5 = nodeKeys5[c];
                                            if (values3[nodekey5]) {
                                                str += values3[nodekey5] + ';&nbsp;';
                                            }
                                        }
                                    } else if (values3) {
                                        str += values3 + ';&nbsp;';
                                    }
                                }
                            }
                        }
                    }
                } else {
                    str += values;
                }
            }
        }
        if (str) {
            str = str.replace(/;&nbsp;$/, '');
        }
        return str;
    };

    // get relatedWork
    serviceObj.getRelatedWork = function (nodeValue) {
        var str = '';
        var keys = Object.keys(nodeValue);
        if (keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                var nodeKey = keys[i];
                var values = nodeValue[nodeKey];
                if (values) {
                    var nodeKeys = Object.keys(values);
                    if ((typeof nodeKeys === 'undefined' ? 'undefined' : _typeof(nodeKeys)) === 'object' && nodeKeys !== null) {
                        for (var k = 0; k < nodeKeys.length; k++) {
                            var key2 = nodeKeys[k];
                            if (key2) {
                                var values2 = values[key2];
                                if ((typeof values2 === 'undefined' ? 'undefined' : _typeof(values2)) === 'object' && values2 !== null) {
                                    var nodeKeys2 = Object.keys(values2);
                                    if ((typeof nodeKeys2 === 'undefined' ? 'undefined' : _typeof(nodeKeys2)) === 'object' && nodeKeys2 !== null) {
                                        for (var c = 0; c < nodeKeys2.length; c++) {
                                            var key3 = nodeKeys2[c];
                                            if (key3) {
                                                var values3 = values2[key3];
                                                if ((typeof values3 === 'undefined' ? 'undefined' : _typeof(values3)) === 'object' && values3 !== null) {
                                                    var nodeKeys3 = Object.keys(values3);
                                                    for (var j = 0; j < nodeKeys3.length; j++) {
                                                        var key4 = nodeKeys3[j];
                                                        var values4 = values3[key4];
                                                        if (values4) {
                                                            str += values4 + '<br/>';
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else if (values2[nodeKeys2]) {
                                        str += values2[nodeKeys2] + '<br/>';
                                    }
                                } else if (values2) {
                                    str += values2 + '<br/>';
                                }
                            }
                        }
                    } else if (values) {
                        str += values + '<br/>';
                    }
                }
            }
        }

        if (str) {
            str = str.replace(/<br\/>$/, '');
        }
        return str;
    };

    // get xml node value
    serviceObj.getValue = function (values, key) {
        var text = '';
        if ((typeof values === 'undefined' ? 'undefined' : _typeof(values)) === 'object') {
            switch (key) {
                case 'hvd_relatedInformation':
                case 'relatedInformation':
                    text = serviceObj.getRelatedInformation(values);
                    break;
                case 'hvd_associatedName':
                case 'associatedName':
                    text = serviceObj.getAssociatedName(values);
                    break;
                case '_attr':
                    text = serviceObj.getAttr(values);
                    break;
                case 'hvd_relatedWork':
                case 'relatedWork':
                    text = serviceObj.getRelatedWork(values);
                    break;
                case 'hvd_topic':
                case 'topic':
                    text = serviceObj.getTopic(values);
                    break;
                default:
                    text = serviceObj.getOtherValue(values, key);
                    break;
            }
        } else {
            text = values;
        }
        return text;
    };

    // get json value base on dynamic key
    serviceObj.getOtherValue = function (obj, key) {
        var text = '';
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj = obj[0];
            }
            var keys = Object.keys(obj);
            for (var k = 0; k < keys.length; k++) {
                var nodeKey = keys[k];
                if (nodeKey) {
                    var nodeValue = obj[nodeKey];

                    if (Array.isArray(nodeValue)) {
                        nodeValue = nodeValue[0];
                    }
                    if ((typeof nodeValue === 'undefined' ? 'undefined' : _typeof(nodeValue)) === 'object' && nodeValue !== null) {

                        if (Array.isArray(nodeValue)) {
                            for (var i = 0; i < nodeValue.length; i++) {
                                var data = nodeValue[i];
                                if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data !== null) {
                                    if (Array.isArray(data)) {
                                        for (var j = 0; j < data.length; j++) {
                                            var data2 = data[j];
                                            if ((typeof data2 === 'undefined' ? 'undefined' : _typeof(data2)) === 'object' && data2 !== null) {
                                                if (Array.isArray(data2)) {
                                                    for (var c = 0; c < data2.length; c++) {
                                                        var data3 = data2[c];
                                                        if ((typeof data3 === 'undefined' ? 'undefined' : _typeof(data3)) === 'object' && data3 !== null) {
                                                            if (Array.isArray(data3)) {
                                                                for (var w = 0; w < data3.length; w++) {
                                                                    var data4 = data3[w];
                                                                    if ((typeof data4 === 'undefined' ? 'undefined' : _typeof(data4)) === 'object' && data4 !== null) {
                                                                        if (data4[0]) {
                                                                            text += data4[0] + '&nbsp;';
                                                                        }
                                                                    } else if (data4) {
                                                                        text += data4 + '&nbsp;';
                                                                    }
                                                                }
                                                            }
                                                        } else if (data3) {
                                                            text += data3 + '&nbsp;';
                                                        }
                                                    }
                                                }
                                            } else if (data2) {
                                                text += data2 + '&nbsp;';
                                            }
                                        }
                                    } else {
                                        var subNodeKeys = Object.keys(data);
                                        if (Array.isArray(subNodeKeys)) {
                                            for (var b = 0; b < subNodeKeys.length; b++) {
                                                var key2 = subNodeKeys[b];
                                                if ((typeof key2 === 'undefined' ? 'undefined' : _typeof(key2)) === 'object' && key2 !== null) {
                                                    if (Array.isArray(key2)) {
                                                        for (var c = 0; c < key2.length; c++) {
                                                            var key3 = key2[c];
                                                            if ((typeof key3 === 'undefined' ? 'undefined' : _typeof(key3)) === 'object' && key3 !== null) {
                                                                if (Array.isArray(key3)) {
                                                                    for (var x = 0; x < key3.length; x++) {
                                                                        var key4 = key3[x];
                                                                        if ((typeof key4 === 'undefined' ? 'undefined' : _typeof(key4)) === 'object' && key4 !== null) {
                                                                            if (data[key4][0]) {
                                                                                text += data[key4][0] + '&nbsp;';
                                                                            }
                                                                        } else if (data[key4]) {
                                                                            text += data[key4] + '&nbsp;';
                                                                        }
                                                                    }
                                                                }
                                                            } else if (data[key3]) {
                                                                text += data[key3] + '&nbsp;';
                                                            }
                                                        }
                                                    }
                                                } else if (key2) {
                                                    if (data[key2]) {
                                                        text += data[key2] + '&nbsp;';
                                                    }
                                                }
                                            }
                                        } else if (data[subNodeKeys]) {
                                            text += data[subNodeKeys] + '&nbsp;';
                                        }
                                    }
                                } else {
                                    text += data;
                                }
                            }
                        } else if (nodeKey) {
                            var nodeKey2 = Object.keys(nodeValue);
                            if ((typeof nodeKey2 === 'undefined' ? 'undefined' : _typeof(nodeKey2)) === 'object' && nodeKey2 !== null) {
                                if (Array.isArray(nodeKey2)) {
                                    for (var c = 0; c < nodeKey2.length; c++) {
                                        var nodeKey3 = nodeKey2[c];
                                        if (nodeKey3) {
                                            var nodeValue3 = nodeValue[nodeKey3];
                                            if (Array.isArray(nodeValue3)) {
                                                nodeValue3 = nodeValue3[0];
                                            }

                                            if ((typeof nodeValue3 === 'undefined' ? 'undefined' : _typeof(nodeValue3)) === 'object' && nodeValue3 !== null) {
                                                var nodeKey4 = Object.keys(nodeValue3);
                                                if (Array.isArray(nodeKey4)) {
                                                    for (var b = 0; b < nodeKey4.length; b++) {
                                                        var nodeKey5 = nodeKey4[b];
                                                        if (nodeKey5) {
                                                            if (nodeValue3[nodeKey5]) {
                                                                text += nodeValue3[nodeKey5] + '&nbsp;';
                                                            }
                                                        }
                                                    }
                                                } else if (nodeValue3[nodeKey4]) {
                                                    text += nodeValue3[nodeKey4] + '&nbsp;';
                                                }
                                            } else if (nodeValue3) {
                                                text += nodeValue3 + '&nbsp;';
                                            }
                                        }
                                    }
                                }
                            } else if (nodeKey2) {
                                if (nodeValue[nodeKey2]) {
                                    text += nodeValue[nodeKey2] + '&nbsp;';
                                }
                            }
                        }
                    } else if (nodeValue) {
                        text += nodeValue + '&nbsp;';
                    }
                }
            }
        } else {
            text = obj;
        }

        return text;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 9/5/17.
 * This is an actually print page. it hide action list, browse, search box, top menu section.
 */

(function () {
    angular.module('viewCustom').controller('customPrintPageCtrl', ['$element', '$stateParams', 'customService', '$timeout', '$window', function ($element, $stateParams, customService, $timeout, $window) {
        var vm = this;
        vm.item = {};
        var cs = customService;
        // get item data to display on full view page
        vm.getItem = function () {
            var url = vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL + '/' + vm.context + '/' + vm.docid;
            url += '?vid=' + vm.vid;
            cs.getAjax(url, '', 'get').then(function (result) {
                vm.item = result.data;
            }, function (error) {
                console.log(error);
            });
        };

        vm.$onInit = function () {
            // capture the parameter from UI-Router
            vm.docid = $stateParams.docid;
            vm.context = $stateParams.context;
            vm.vid = $stateParams.vid;
            vm.getItem();

            $timeout(function () {
                // remove top menu and search bar
                var el = $element[0].parentNode.parentNode;

                if (el) {
                    el.children[0].style.display = 'none';
                }

                var topMenu = document.getElementById('customTopMenu');
                if (topMenu) {
                    topMenu.style.display = 'none';
                }

                // hide action list
                var actionList = document.getElementById('action_list');
                if (actionList) {
                    actionList.style.display = 'none';
                }

                // hide right column of the page
                var el2 = $element[0].children[1].children[0].children[1];
                if (el2) {
                    el2.style.display = 'none';
                }

                var browse = document.getElementById('virtualBrowse');
                if (browse) {
                    browse.style.display = 'none';
                }
            }, 1000);
        };

        vm.$postLink = function () {
            $timeout(function () {
                $window.print();
            }, 3000);
        };
    }]);

    angular.module('viewCustom').component('customPrintPage', {
        bindings: { parentCtrl: '<' },
        controller: 'customPrintPageCtrl',
        controllerAs: 'vm',
        templateUrl: '/primo-explore/custom/01HVD/html/custom-print-page.html'
    });
})();
/**
 * Created by samsan on 9/5/17.
 * custom print page
 */

(function () {
    angular.module('viewCustom').controller('customPrintCtrl', ['$window', '$stateParams', function ($window, $stateParams) {
        var vm = this;
        var params = $stateParams;

        vm.print = function () {
            var url = '/primo-explore/printPage/' + vm.parentCtrl.context + '/' + vm.parentCtrl.pnx.control.recordid;
            url += '?vid=' + params.vid;
            $window.open(url, '_blank');
        };
    }]);

    angular.module('viewCustom').component('customPrint', {
        bindings: { parentCtrl: '<' },
        controller: 'customPrintCtrl',
        controllerAs: 'vm',
        templateUrl: '/primo-explore/custom/01HVD/html/custom-print.html'
    });
})();
/**
 * Created by samsan on 3/2/18.
 * It create a checkbox in advance search section
 */

angular.module('viewCustom').controller('customRadioCtrl', [function () {
    var vm = this;
    vm.form = { 'checked': false, 'class': 'md-off' };

    vm.check = function () {
        vm.parentCtrl.selectedSearchTab = '';
        vm.form.checked = true;
        vm.form.class = 'md-checked md-on';
        vm.parentCtrl.selectedBarcode = vm.form.checked;
    };

    vm.$doCheck = function () {
        if (vm.parentCtrl.selectedSearchTab) {
            vm.form.checked = false;
            vm.form.class = 'md-unchecked md-off';
        }
    };
}]);

angular.module('viewCustom').component('customRadio', {
    bindings: { parentCtrl: '<' },
    controller: 'customRadioCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/custom-radio.html'
});

/**
 * Created by samsan on 11/21/17.
 * Implement ui-router so it can load new pages and new component
 */

(function () {

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
        }).state('exploreMain.viewallcomponentdata', {
            url: '/viewallcomponentmetadata/:context/:docid',
            views: {
                '': {
                    template: '<custom-view-all-component-metadata parent-ctrl="$ctrl"></custom-view-all-component-metadata>'
                }
            }
        }).state('exploreMain.viewcomponent', {
            url: '/viewcomponent/:context/:docid',
            views: {
                '': {
                    template: '<custom-view-component parent-ctrl="$ctrl" item="$ctrl.item" services="$ctrl.services" params="$ctrl.params"></custom-view-component>'
                }
            }
        }).state('exploreMain.printPage', {
            url: '/printPage/:context/:docid',
            views: {
                '': {
                    template: '<custom-print-page parent-ctrl="$ctrl"></custom-print-page>'
                }
            }
        });
    });
})();
/**
 * Created by samsan on 9/7/17.
 * This is for scanned content key. Some items have scan images.
 * If any pnx/display/lds41, then it has scan images
 */

(function () {

    angular.module('viewCustom').controller('customScannedKeyContentCtrl', [function () {
        var vm = this;
        vm.lds41 = [];

        vm.$onChanges = function () {
            // re-construct json obj if lds41 is existed
            if (vm.item.pnx.display.lds41) {
                var lds41 = vm.item.pnx.display.lds41;
                for (var i = 0; i < lds41.length; i++) {
                    var str = lds41[i];
                    var arr = str.split('--');
                    if (arr.length > 0) {
                        var obj = { 'title': '', 'url': '' };
                        obj.title = arr[0];
                        obj.url = arr[1];
                        vm.lds41.push(obj);
                    }
                }
            }
        };
    }]);

    angular.module('viewCustom').component('customScannedKeyContent', {
        bindings: { item: '<' },
        controllerAs: 'vm',
        controller: 'customScannedKeyContentCtrl',
        templateUrl: '/primo-explore/custom/01HVD/html/custom-scanned-key-content.html'
    });
})();
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
            'params': param
        });
    };

    serviceObj.postAjax = function (url, jsonObj) {
        // pass primo token to header with value call token
        $http.defaults.headers.common.token = jsonObj.token;
        return $http({
            'method': 'post',
            'url': url,
            'data': jsonObj
        });
    };

    serviceObj.postData = function (url, jsonObj) {
        return $http({
            'method': 'post',
            'url': url,
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

    // when user click on advanced search from browse page
    serviceObj.advancedSearch = false;
    serviceObj.setAdvancedSearch = function (flag) {
        serviceObj.advancedSearch = flag;
    };
    serviceObj.getAdvancedSearch = function () {
        return serviceObj.advancedSearch;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 2/13/18.
 * This component is to create text sms icon by inserting it dynamic at prm-action-list-after.js
 */

angular.module('viewCustom').controller('customSmsCtrl', ['customService', function (customService) {
    var vm = this;
    var cs = customService;
    // display prm-action-container-after when a user click text sms icon
    vm.sendsms = function () {
        vm.parentCtrl.activeAction = 'textsms';
        vm.parentCtrl.selectedAction = 'textsms';
        vm.parentCtrl.expandedAction = '';
    };
}]);

angular.module('viewCustom').component('customSms', {
    bindings: { parentCtrl: '<' },
    controller: 'customSmsCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/custom-sms.html'
});

/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom').component('customThumbnail', {
    templateUrl: '/primo-explore/custom/01HVD/html/custom-thumbnail.html',
    bindings: {
        itemdata: '<',
        searchdata: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$timeout', 'prmSearchService', function ($element, $timeout, prmSearchService) {
        var vm = this;
        var sv = prmSearchService;
        vm.localScope = { 'imgclass': '', 'hideLockIcon': false, 'hideTooltip': false };
        vm.imageUrl = '/primo-explore/custom/01HVD/img/icon_image.png';
        vm.src = '';
        vm.imageCaption = '';
        vm.restricted = false;
        vm.imageFlag = false;

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {
            vm.localScope = { 'imgclass': '', 'hideLockIcon': false };
            if (vm.itemdata.image) {
                vm.imageFlag = true;
                if (vm.itemdata.image.length === 1) {
                    vm.src = vm.itemdata.image[0].thumbnail[0]._attr.href._value + '?width=150&height=150';
                    vm.restricted = vm.itemdata.image[0]._attr.restrictedImage._value;
                    if (vm.itemdata.image[0].caption) {
                        vm.imageCaption = vm.itemdata.image[0].caption[0]._text;
                    }
                }
            }

            if (vm.src && vm.imageFlag) {
                vm.imageUrl = sv.getHttps(vm.src);
                $timeout(function () {
                    var img = $element.find('img')[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if (pattern.test(vm.src)) {
                        img.src = '/primo-explore/custom/01HVD/img/icon_image.png';
                    }
                    img.onload = vm.callback;
                    if (img.clientWidth > 50) {
                        vm.callback();
                    }
                }, 300);
            }
        };
        vm.callback = function () {
            var image = $element.find('img')[0];
            if (image.height > 150) {
                vm.localScope.imgclass = 'responsivePhoto';
                image.className = 'md-card-image ' + vm.localScope.imgclass;
            }
            // show lock up icon
            if (vm.restricted) {
                vm.localScope.hideLockIcon = true;
            }
        };

        $element.bind('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });
    }]
});

/**
 * Created by samsan on 7/17/17.
 */

angular.module('viewCustom').controller('customViewAllComponentMetadataController', ['$sce', '$element', '$location', 'prmSearchService', '$window', '$stateParams', '$timeout', 'customMapXmlKeys', '$mdMedia', 'customMapXmlValues', function ($sce, $element, $location, prmSearchService, $window, $stateParams, $timeout, customMapXmlKeys, $mdMedia, customMapXmlValues) {

    var vm = this;
    var sv = prmSearchService;
    var cMap = customMapXmlKeys;
    var cMapValue = customMapXmlValues;
    vm.params = $location.search();
    // get ui-router parameters
    vm.context = $stateParams.context;
    vm.docid = $stateParams.docid;

    vm.toggleData = { 'icon': 'ic_remove_black_24px.svg', 'flag': false };
    vm.xmldata = [];
    vm.keys = [];
    vm.items = {};

    vm.toggle = function () {
        if (vm.toggleData.flag) {
            vm.toggleData.icon = 'ic_remove_black_24px.svg';
            vm.toggleData.flag = false;
        } else {
            vm.toggleData.icon = 'ic_add_black_24px.svg';
            vm.toggleData.flag = true;
        }
    };

    // ajax call to get data
    vm.getData = function () {
        var restUrl = vm.parentCtrl.searchService.cheetah.restUrl + '/' + vm.context + '/' + vm.docid;
        var params = { 'vid': 'HVD_IMAGES', 'lang': 'en_US', 'search_scope': 'default_scope', 'adaptor': 'Local Search Engine' };
        params.vid = vm.params.vid;
        params.lang = vm.params.lang;
        params.search_scope = vm.params.search_scope;
        params.adaptor = vm.params.adaptor;
        sv.getAjax(restUrl, params, 'get').then(function (result) {
            vm.items = result.data;
            if (vm.items.pnx.addata) {
                var result = sv.parseXml(vm.items.pnx.addata.mis1[0]);
                if (result.work) {
                    vm.xmldata = result.work[0];
                    if (vm.items.pnx.display) {
                        vm.keys = Object.keys(vm.items.pnx.display);
                        var removeKeys = cMap.getRemoveList();
                        for (var i = 0; i < removeKeys.length; i++) {
                            var key = removeKeys[i];
                            var index = vm.keys.indexOf(key);
                            if (index !== -1) {
                                vm.keys.splice(index, 1);
                            }
                        }
                        vm.keys = cMap.sort(vm.keys);
                    }
                }
            }
        }, function (err) {
            console.log(err);
        });
    };

    // get json key
    vm.getKeys = function (obj) {
        var keys = Object.keys(obj);
        var removeList = cMap.getRemoveList();
        for (var i = 0; i < removeList.length; i++) {
            var key = removeList[i];
            var index = keys.indexOf(key);
            if (index !== -1) {
                // remove image from the list
                keys.splice(index, 1);
            }
        }
        return cMap.getOrderList(keys);
    };

    // get json value base on dynamic key
    vm.getValue = function (obj, key) {
        var values = cMapValue.getValue(obj, key);
        return values;
    };

    // show the pop up image
    vm.gotoFullPhoto = function (index, data) {
        var filename = '';
        if (data.image) {
            var urlList = data.image[0]._attr.href._value;
            urlList = urlList.split('/');
            if (urlList.length >= 3) {
                filename = urlList[3];
            }
        } else if (data._attr) {
            filename = data._attr.componentID._value;
        }

        // go to full display page
        var url = '/primo-explore/viewcomponent/' + vm.context + '/' + vm.docid + '?vid=' + vm.params.vid + '&imageId=' + filename;
        if (vm.params.adaptor) {
            url += '&adaptor=' + vm.params.adaptor;
        }

        $window.open(url, '_blank');
    };

    vm.$onInit = function () {
        vm.parentCtrl.bannerTitle = 'FULL COMPONENT METADATA';
        // hide search bar
        var searchBar = document.getElementsByTagName('prm-search-bar')[0];
        if (searchBar) {
            searchBar.style.display = 'none';
        }
        // hide top bar
        var topBar = document.getElementsByTagName('prm-topbar')[0];
        if (topBar) {
            topBar.style.display = 'none';
        }

        vm.getData();
    };
}]);

angular.module('viewCustom').component('customViewAllComponentMetadata', {
    bindings: { parentCtrl: '<' },
    controller: 'customViewAllComponentMetadataController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/01HVD/html/custom-view-all-component-metadata.html'
});

/**
 * Created by samsan on 6/9/17.
 * This component is for a single image full display when a user click on thumbnail from a full display page
 */

angular.module('viewCustom').controller('customViewComponentController', ['$sce', '$mdMedia', 'prmSearchService', '$location', '$stateParams', '$element', '$timeout', 'customMapXmlKeys', '$window', 'customMapXmlValues', function ($sce, $mdMedia, prmSearchService, $location, $stateParams, $element, $timeout, customMapXmlKeys, $window, customMapXmlValues) {

    var vm = this;
    var sv = prmSearchService;
    var cMap = customMapXmlKeys;
    var cMapValue = customMapXmlValues;
    // get location parameter
    vm.params = $location.search();
    // get parameter from angular ui-router
    vm.context = $stateParams.context;
    vm.docid = $stateParams.docid;
    vm.recordid = '';
    vm.filename = vm.params.imageId;
    vm.index = '';
    vm.clientIp = sv.getClientIp();

    vm.photo = {};
    vm.flexsize = 80;
    vm.total = 0;
    vm.itemData = {};
    vm.imageNav = true;
    vm.xmldata = {};
    vm.keys = [];
    vm.imageTitle = '';
    vm.jp2 = false;
    vm.componentData = {}; // single component data
    vm.componentKey = [];

    // remove HVD_VIA from record id of vm.docid
    vm.removeHVD_VIA = function () {
        var pattern = /^(HVD_VIA)/;
        var docid = angular.copy(vm.docid);
        if (pattern.test(docid)) {
            vm.recordid = docid.substring(7, docid.length);
        } else {
            vm.recordid = docid;
        }
    };

    // find index base on file name
    vm.findFilenameIndex = function (arrList, filename) {
        var k = -1;
        for (var i = 0; i < arrList.length; i++) {
            var img = arrList[i];
            if (img.image) {
                var url = img.image[0]._attr.href._value;
                if (url.match(vm.filename)) {
                    k = i;
                    i = arrList.length;
                }
            } else if (img._attr) {
                var componentID = img._attr.componentID._value;
                if (componentID === vm.filename) {
                    k = i;
                    i = arrList.length;
                }
            }
        }
        return k;
    };

    // ajax call to get data
    vm.getData = function () {
        var url = vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL + '/' + vm.context + '/' + vm.docid;
        var params = { 'vid': '', 'lang': '', 'search_scope': '', 'adaptor': '' };
        params.vid = vm.params.vid;
        params.lang = vm.params.lang;
        params.search_scope = vm.params.search_scope;
        params.adaptor = vm.params.adaptor;
        sv.getAjax(url, params, 'get').then(function (result) {
            vm.item = result.data;
            // convert xml to json
            if (vm.item.pnx) {
                if (vm.item.pnx.addata) {
                    var result = sv.parseXml(vm.item.pnx.addata.mis1[0]);
                    if (result.work) {
                        vm.xmldata = result.work[0];
                        if (vm.xmldata.component) {
                            vm.total = vm.xmldata.component.length;
                        }
                        if (vm.item.pnx.display) {
                            vm.keys = Object.keys(vm.item.pnx.display);
                            // remove unwanted key
                            var removeList = cMap.getRemoveList();
                            for (var i = 0; i < removeList.length; i++) {
                                var key = removeList[i];
                                var index = vm.keys.indexOf(key);
                                if (index !== -1) {
                                    vm.keys.splice(index, 1);
                                }
                            }

                            vm.keys = cMap.sort(vm.keys);
                        }
                    }
                }
            } else {
                $window.location.href = '/primo-explore/search?vid=' + vm.params.vid;
            }

            // display photo
            vm.displayPhoto();
        }, function (error) {
            console.log(error);
        });
    };

    // get json key and remove image from the key
    vm.getKeys = function (obj) {
        var keys = Object.keys(obj);
        var removeList = cMap.getRemoveList();
        for (var i = 0; i < removeList.length; i++) {
            var key = removeList[i];
            var index = keys.indexOf(key);
            if (index !== -1) {
                // remove image from the list
                keys.splice(index, 1);
            }
        }
        return cMap.getOrderList(keys);
    };

    // get value base on json key
    vm.getValue = function (val, key) {
        return cMapValue.getValue(val, key);
    };

    // display each component value key
    vm.getComponentValue = function (key) {
        var text = '';
        if (vm.componentData && key) {
            var data = vm.componentData[key];
            text = cMapValue.getValue(data, key);
        }
        return text;
    };

    // display each photo component
    vm.displayPhoto = function () {
        vm.isLoggedIn = sv.getLogInID();
        vm.clientIp = sv.getClientIp();
        if (vm.xmldata.component && !vm.xmldata.image) {
            if (!vm.index && vm.index !== 0) {
                vm.index = vm.findFilenameIndex(vm.xmldata.component, vm.filename);
            }
            if (vm.index >= 0 && vm.index < vm.total) {
                vm.componentData = vm.xmldata.component[vm.index];
                if (vm.componentData.image) {
                    vm.photo = vm.componentData.image[0];
                    // find out if the image is jp2 or not
                    vm.jp2 = sv.findJP2(vm.photo);
                }
            }
        } else if (vm.xmldata.image) {
            vm.photo = vm.xmldata.image[0];
            vm.jp2 = sv.findJP2(vm.photo);
            vm.componentData = vm.xmldata.image[0];
        }

        if (vm.photo._attr && vm.photo._attr.restrictedImage) {
            if (vm.photo._attr.restrictedImage._value && vm.isLoggedIn === false && !vm.clientIp.status) {
                vm.imageNav = false;
            }
        }
    };

    vm.$onInit = function () {
        vm.removeHVD_VIA();
        // if the smaller screen size, make the flex size to 100.
        if ($mdMedia('sm')) {
            vm.flexsize = 100;
        } else if ($mdMedia('xs')) {
            vm.flexsize = 100;
        }
        // call ajax and display data
        vm.getData();

        vm.parentCtrl.bannerTitle = 'FULL IMAGE DETAIL';
        // hide search bar
        var searchBar = document.getElementsByTagName('prm-search-bar')[0];
        if (searchBar) {
            searchBar.style.display = 'none';
        }
        // hide top bar
        var topBar = document.getElementsByTagName('prm-topbar')[0];
        if (topBar) {
            topBar.style.display = 'none';
        }
    };

    // next photo
    vm.nextPhoto = function () {
        vm.index++;
        if (vm.index < vm.total && vm.index >= 0) {
            vm.displayPhoto();
        } else {
            vm.index = 0;
            vm.displayPhoto();
        }
    };
    // prev photo
    vm.prevPhoto = function () {
        vm.index--;
        if (vm.index >= 0 && vm.index < vm.total) {
            vm.displayPhoto();
        } else {
            vm.index = vm.total - 1;
            vm.displayPhoto();
        }
    };
}]);

angular.module('viewCustom').component('customViewComponent', {
    bindings: { item: '<', services: '<', params: '<', parentCtrl: '<' },
    controller: 'customViewComponentController',
    controllerAs: 'vm',
    'templateUrl': '/primo-explore/custom/01HVD/html/custom-view-component.html'
});

// truncate word to limit 60 characters
angular.module('viewCustom').filter('mapXmlFilter', ['customMapXmlKeys', function (customMapXmlKeys) {
    var cMap = customMapXmlKeys;
    return function (key) {
        var newKey = cMap.mapKey(key);
        return newKey.charAt(0).toUpperCase() + newKey.slice(1);
    };
}]);
(function () {
    'use strict';

    angular.module('viewCustom').controller('prmOpenJournalInFullController', [function () {
        var vm = this;
        vm.$onInit = function () {
            var resourceType = vm.parentCtrl.result.pnx.display.type[0] || '';
            if (resourceType === 'journal') {
                vm.parentCtrl.isDirectLink = function () {
                    return false;
                };
            }
        };
    }]);

    angular.module('viewCustom').component('prmOpenJournalInFull', {
        bindings: { parentCtrl: '<' },
        controller: 'prmOpenJournalInFullController'

    });
})();

/**
 * Created by samsan on 5/23/17.
 * If image has height that is greater than 150 px, then it will resize it. Otherwise, it just display what it is.
 */

angular.module('viewCustom').component('multipleThumbnail', {
    templateUrl: '/primo-explore/custom/01HVD/html/multipleThumbnail.html',
    bindings: {
        itemdata: '<',
        searchdata: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$timeout', 'prmSearchService', function ($element, $timeout, prmSearchService) {
        var vm = this;
        var sv = prmSearchService;
        vm.localScope = { 'imgclass': '', 'hideLockIcon': false, 'hideTooltip': false };
        vm.imageUrl = '/primo-explore/custom/01HVD/img/icon_image.png';
        vm.src = '';
        vm.imageTitle = '';
        vm.restricted = false;
        vm.imageFlag = false;

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {

            vm.localScope = { 'imgclass': '', 'hideLockIcon': false };
            if (vm.itemdata.image) {
                vm.imageFlag = true;
                if (vm.itemdata.image.length === 1) {
                    vm.src = vm.itemdata.image[0].thumbnail[0]._attr.href._value + '?width=150&height=150';
                    vm.restricted = vm.itemdata.image[0]._attr.restrictedImage._value;
                    if (vm.itemdata.image[0].caption) {
                        vm.imageTitle = vm.itemdata.image[0].caption[0]._text;
                    } else if (vm.itemdata.title) {
                        vm.imageTitle = vm.itemdata.title[0].textElement[0]._text;
                    }
                }
            } else if (vm.itemdata.title) {
                vm.imageTitle = vm.itemdata.title[0].textElement[0]._text;
            }

            if (vm.src && vm.imageFlag) {
                vm.imageUrl = sv.getHttps(vm.src);
                $timeout(function () {
                    var img = $element.find('img')[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if (pattern.test(vm.src)) {
                        img.src = '/primo-explore/custom/01HVD/img/icon_image.png';
                    }
                    img.onload = vm.callback;
                    if (img.clientWidth > 50) {
                        vm.callback();
                    }
                }, 300);
            }
        };
        vm.callback = function () {
            var image = $element.find('img')[0];
            if (image.height > 150) {
                vm.localScope.imgclass = 'responsivePhoto';
                image.className = 'md-card-image ' + vm.localScope.imgclass;
            }
            // show lock up icon
            if (vm.restricted) {
                vm.localScope.hideLockIcon = true;
            }
        };

        $element.bind('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });
    }]
});

/**
 * Created by samsan on 8/16/17.
 */

angular.module('viewCustom').controller('prmActionContainerAfterCtrl', ['customService', 'prmSearchService', '$window', 'customGoogleAnalytic', '$scope', function (customService, prmSearchService, $window, customGoogleAnalytic, $scope) {

    var cisv = customService;
    var cs = prmSearchService;
    var cga = customGoogleAnalytic;
    var vm = this;
    vm.restsmsUrl = '';
    vm.locations = [];
    vm.temp = { 'phone': '' };
    vm.form = { 'phone': '', 'deviceType': '', 'body': '', 'error': '', 'mobile': false, 'msg': '', 'token': '', 'ip': '', 'sessionToken': '', 'isLoggedIn': false, 'iat': '', 'inst': '', 'vid': '', 'exp': '', 'userName': '', 'iss': '', 'onCampus': false };
    vm.css = { 'class': 'textsms-info' };

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
        vm.form.msg = '';
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
            vm.form.error = 'Enter valid phone number';
        } else if (e.which === 13) {
            vm.form.error = 'Please choose a location below';
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

        $scope.$watch('vm.actionName', function () {
            if (vm.actionName === 'textsms') {
                if (vm.parentCtrl.item.delivery) {
                    vm.locations = vm.parentCtrl.item.delivery.holding;
                    for (var i = 0; i < vm.locations.length; i++) {
                        vm.locations[i].cssClass = 'textsms-row';
                    }
                }
            }
        });
    };

    vm.$doCheck = function () {
        // get action name when a user click on each action list
        if (vm.parentCtrl.actionName) {
            vm.actionName = vm.parentCtrl.actionName;
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
                                vm.form.msg = 'The message sent to ' + vm.temp.phone + '.';
                                vm.css.class = 'textsms-info';
                            } else {
                                vm.form.msg = 'We were unable to send this message. There was a problem with the phone number.';
                                vm.css.class = 'textsms-danger';
                            }
                        } else {
                            vm.form.msg = result.data.msg;
                            vm.css.class = 'textsms-danger';
                        }
                    } else {
                        vm.form.msg = 'We were unable to send this message. There was a problem with the phone number.';
                        vm.css.class = 'textsms-danger';
                    }
                }, function (error) {
                    console.log(error);
                    vm.form.msg = 'We were unable to send this message. There was a problem with the phone number.';
                    vm.css.class = 'textsms-danger';
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
        // insert custom-sms and custom-print tag when it is not in favorite section.
        if (!vm.parentCtrl.displaymode) {
            $timeout(function () {
                // if holding location is existed, then insert sms text call icon
                if (vm.parentCtrl.item.delivery) {
                    if (vm.parentCtrl.item.delivery.holding.length > 0) {
                        var textsmsExist = document.getElementById('textsms');
                        // if textsms doesn't exist, insert it.
                        if (!textsmsExist) {
                            var prmActionList = document.getElementsByTagName('prm-action-list')[0];
                            var ul = prmActionList.getElementsByTagName('ul')[0];
                            var li = ul.querySelector('#scrollActionList');
                            if (li) {
                                var smsTag = document.createElement('custom-sms');
                                smsTag.setAttribute('parent-ctrl', 'vm.parentCtrl');
                                li.insertBefore(smsTag, li.childNodes[0]);
                                $compile(li.children[0])($scope);
                            }
                        }
                    }
                }

                // if print icon exist, then add custom-print tag
                var printEl = document.getElementById('Print');
                if (printEl) {
                    // when remove it, cause javascript error
                    printEl.children[0].style.display = 'none';
                    var printTag = document.createElement('custom-print');
                    printTag.setAttribute('parent-ctrl', 'vm.parentCtrl.item');
                    printEl.appendChild(printTag);
                    $compile(printEl.children[1])($scope);
                }
            }, 2000);
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

angular.module('viewCustom').controller('prmAdvancedSearchAfterCtrl', ['$location', '$stateParams', '$element', '$compile', '$scope', function ($location, $stateParams, $element, $compile, $scope) {
    var vm = this;

    vm.form = { 'barcode': '', 'error': '', 'flag': false };
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

    vm.$onInit = function () {
        setTimeout(function () {
            var el = $element[0].parentNode.childNodes[0].children[0].children[0].children[0];
            var checkbox = document.createElement('custom-radio');
            checkbox.setAttribute('parent-ctrl', 'vm.parentCtrl');
            el.appendChild(checkbox);
            $compile(el.children[2])($scope);
        }, 1000);
    };

    vm.$doCheck = function () {
        // get checkbox value of true or false when a user click on barcode checkbox
        vm.form.flag = vm.parentCtrl.selectedBarcode;
        var el = $element[0].parentNode.childNodes[0].children[0].children[1];
        if (el) {
            if (vm.form.flag && vm.parentCtrl.selectedSearchTab == '') {
                el.style.display = 'none';
            } else {
                el.style.display = 'inline-flex';
                vm.form.flag = false;
            }
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

angular.module('viewCustom').controller('prmAuthenticationAfterController', ['customService', 'prmSearchService', function (customService, prmSearchService) {
    var vm = this;
    var psv = prmSearchService;
    // initialize custom service search
    var sv = customService;
    vm.api = {};
    // get rest endpoint Url
    vm.getUrl = function () {
        var config = sv.getEnv();
        sv.getAjax('/primo-explore/custom/01HVD/html/' + config, '', 'get').then(function (res) {
            vm.api = res.data;
            sv.setApi(vm.api);
            vm.getClientIP();
        }, function (error) {
            console.log(error);
        });
    };

    vm.form = { 'ip': '', 'status': false, 'token': '', 'sessionToken': '', 'isLoggedIn': '' };
    vm.validateIP = function () {
        vm.api = sv.getApi();
        if (vm.api.ipUrl) {
            sv.postAjax(vm.api.ipUrl, vm.form).then(function (result) {
                psv.setClientIp(result.data);
            }, function (error) {
                console.log(error);
            });
        }
    };

    vm.getClientIP = function () {
        vm.auth = sv.getAuth();
        if (vm.auth.primolyticsService.jwtUtilService) {
            vm.form.token = vm.auth.primolyticsService.jwtUtilService.storageUtil.sessionStorage.primoExploreJwt;
            vm.form.sessionToken = vm.auth.primolyticsService.jwtUtilService.storageUtil.localStorage.getJWTFromSessionStorage;
            vm.form.isLoggedIn = vm.auth.isLoggedIn;
            // decode JWT Token to see if it is a valid token
            var obj = vm.auth.authenticationService.userSessionManagerService.jwtUtilService.jwtHelper.decodeToken(vm.form.token);
            vm.form.ip = obj.ip;

            vm.validateIP();
        }
    };

    vm.$onInit = function () {
        // get primo service endpoint urls
        vm.getUrl();
    };

    // check if a user login
    vm.$onChanges = function () {
        // use for validate ip
        sv.setAuth(vm.parentCtrl);
        // use for images
        psv.setAuth(vm.parentCtrl);
    };
}]);

angular.module('viewCustom').component('prmAuthenticationAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmAuthenticationAfterController'
});

/**
 * Created by samsan on 8/10/17.
 * This component add a "Finding Aid" button and make a link
 */

(function () {

    angular.module('viewCustom').controller('prmBriefResultContainerAfterCtrl', ['$location', '$scope', function ($location, $scope) {
        var vm = this;
        var param = $location.search();
        vm.cssClass = 'marginLeftFindingAid';
        vm.findingAid = { 'displayLabel': '', 'linkURL': '', 'newLinkURL': '' };
        vm.$onInit = function () {
            // get links data from primo parent-ctrl binding data
            $scope.$watch('vm.parentCtrl.links', function () {
                // find $$Elinktofa
                if (vm.parentCtrl.links) {
                    for (var i = 0; i < vm.parentCtrl.links.length; i++) {
                        var linkItem = vm.parentCtrl.links[i];
                        var seqment = '';
                        if (linkItem.displayLabel === '$$Elinktofa') {
                            vm.findingAid = linkItem;
                            if (linkItem.linkURL) {
                                var linkStr = linkItem.linkURL;
                                linkStr = linkStr.split(':');
                                if (linkStr.length > 0) {
                                    seqment = linkStr[linkStr.length - 1];
                                    seqment = seqment.trim(' ');
                                }
                            }
                            vm.findingAid.newLinkURL = 'http://id.lib.harvard.edu/ead/' + seqment + '/catalog';
                            i = vm.parentCtrl.links.length;
                        }
                    }
                }
            });

            // add more padding when it is full display page
            if (param.docid) {
                vm.cssClass = 'marginLeftFindingAid2';
            }
        };
    }]);

    angular.module('viewCustom').component('prmBriefResultContainerAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'prmBriefResultContainerAfterCtrl',
        controllerAs: 'vm',
        templateUrl: '/primo-explore/custom/01HVD/html/prm-brief-result-container-after.html'
    });
})();
/**
 * Created by samsan on 2/28/18.
 * Add basic search and advanced search button at browse page
 */

angular.module('viewCustom').component('prmBrowseSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmBrowseSearchBarAfterCtrl',
    controllerAs: 'vm',
    templateUrl: '/primo-explore/custom/01HVD/html/prm-browse-search-bar-after.html'
});

angular.module('viewCustom').controller('prmBrowseSearchBarAfterCtrl', ['$location', 'customService', '$element', function ($location, customService, $element) {
    var vm = this;
    var cs = customService;

    vm.$onChanges = function () {
        var el = $element[0].parentNode.childNodes[0].children[2];
        if (el) {
            var left = el.offsetLeft;
            var doc = document.getElementById('browseSearchBar');
            doc.style.left = left + 20 + 'px';
        }
    };

    vm.gotoSimpleSearch = function () {
        cs.setAdvancedSearch(false);
        window.location.href = '/primo-explore/search?vid=01HVD';
    };

    vm.gotoAdvancedSearch = function () {
        cs.setAdvancedSearch(true);
        $location.path('/search');
    };
}]);
/* Author: Sam san
   This capture all data from parentCtrl. Then can use with other components.
   Hide some of the services primo
 */

(function () {

    angular.module('viewCustom').controller('prmFullViewAfterCtrl', ['prmSearchService', '$timeout', 'customGoogleAnalytic', function (prmSearchService, $timeout, customGoogleAnalytic) {
        var vm = this;
        var sv = prmSearchService;
        var cga = customGoogleAnalytic;

        vm.hideBrowseShelf = function () {
            var hidebrowseshelfFlag = false;
            var item = vm.parentCtrl.item;
            if (item.pnx.control) {
                var sourceid = item.pnx.control.sourceid;
                // find if item is HVD_VIA
                if (sourceid.indexOf('HVD_VIA') !== -1) {
                    hidebrowseshelfFlag = true;
                }
            }
            // hide browse shelf if the item is HVD_VIA is true
            if (hidebrowseshelfFlag) {
                var services = vm.parentCtrl.services;
                if (services) {
                    for (var i = 0; i < services.length; i++) {
                        if (services[i].serviceName === 'virtualBrowse') {
                            services.splice(i, 1);
                            i = services.length;
                        }
                    }
                }
            }
        };

        vm.$onChanges = function () {
            var itemData = { 'item': {}, 'searchData': {} };
            itemData.item = angular.copy(vm.parentCtrl.item);
            if (vm.parentCtrl.searchService) {
                itemData.searchData = vm.parentCtrl.searchService.$stateParams;
            }
            // pass this data to use for online section
            sv.setItem(itemData);
        };

        vm.$onInit = function () {
            // remove more section so the view online would show twice
            $timeout(function () {

                // hide browse shelf it is an image HVD_VIA
                vm.hideBrowseShelf();

                for (var i = 0; i < vm.parentCtrl.services.length; i++) {
                    // remove More section
                    if (vm.parentCtrl.services[i].scrollId === 'getit_link2') {
                        vm.parentCtrl.services.splice(i, 1);
                    }
                }

                // set up google analytic
                if (vm.parentCtrl.item.pnx.display) {
                    var title = vm.parentCtrl.item.pnx.display.title[0] + ' : ' + vm.parentCtrl.item.pnx.control.recordid[0];
                    cga.setPage('/fulldisplay', title);
                } else {
                    cga.setPage('/fulldisplay', 'Full display page');
                }
            }, 1000);
        };
    }]);

    angular.module('viewCustom').component('prmFullViewAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'prmFullViewAfterCtrl',
        controllerAs: 'vm'
    });
})();
/**
 * Created by samsan on 3/21/18.
 * This component use for scanned content key because prm-view-online-after show only when a user search for images
 */

(function () {
    angular.module('viewCustom').controller('prmFullViewServiceContainerAfterCtrl', [function () {
        var vm = this;
        vm.$onInit = function () {};
    }]);

    angular.module('viewCustom').component('prmFullViewServiceContainerAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'prmFullViewServiceContainerAfterCtrl',
        controllerAs: 'vm',
        templateUrl: '/primo-explore/custom/01HVD/html/prm-full-view-service-container-after.html'
    });
})();

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
                setTimeout(function () {
                    var el = $element[0].children[0].children[0].children[0].children[0].children[0].children[0];
                    if (el) {
                        vm.permalinkText = el.textContent;
                    }
                }, 1000);
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

angular.module('viewCustom').controller('prmSearchBarAfterCtrl', ['$element', '$location', '$compile', '$scope', '$mdMedia', 'customService', function ($element, $location, $compile, $scope, $mdMedia, customService) {
    var vm = this;
    var cs = customService;

    vm.$onInit = function () {
        var el = $element[0].parentNode.children[0].children[0].children[2];
        var button = document.createElement('button');
        button.setAttribute('id', 'browseButton');
        button.setAttribute('class', 'md-button md-primoExplore-theme browse-button switch-to-advanced');
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

    // toggle between advance search and simple search
    vm.$doCheck = function () {
        var browseBtn = document.getElementById('browseButton');
        if (vm.parentCtrl.advancedSearch) {
            if (browseBtn) {
                browseBtn.classList.remove('switch-to-advanced');
                browseBtn.classList.add('switch-to-simple');
            }
        } else {
            if (browseBtn) {
                browseBtn.classList.remove('switch-to-simple');
                browseBtn.classList.add('switch-to-advanced');
            }
        }

        if (cs.getAdvancedSearch() === true) {
            vm.parentCtrl.searchFieldsService.advancedSearch = true;
            cs.setAdvancedSearch(false);
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
            if (vm.itemPNX.pnx.addata.isbn.length > 0) {
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

                var zoom = 3;
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
                for (var k = 0; k < xmldata.work.length; k++) {
                    var subLevel = xmldata.work[k];
                    if (subLevel.component) {
                        listArray = subLevel.component;
                    } else if (subLevel.image) {
                        listArray = subLevel;
                    } else {
                        listArray = subLevel;
                    }
                }
            } else {
                listArray = xmldata;
            }
        }

        return listArray;
    };

    // store api rest url from config.html
    serviceObj.api = {};
    serviceObj.setApi = function (data) {
        serviceObj.api = data;
    };

    serviceObj.getApi = function () {
        return serviceObj.api;
    };

    // store validate client ip status
    serviceObj.clientIp = {};
    serviceObj.setClientIp = function (data) {
        serviceObj.clientIp = data;
    };
    serviceObj.getClientIp = function () {
        return serviceObj.clientIp;
    };

    return serviceObj;
}]);

/**
 * Created by samsan on 8/7/17.
 * This component is used for Digital Bookplates
 */
(function () {
    'use strict';

    angular.module('viewCustom').controller('prmServiceLinksAfterCtrl', ['customImagesService', '$timeout', function (customImagesService, $timeout) {
        var vm = this;
        var cisv = customImagesService;
        vm.itemList = [];
        vm.recordLinks = []; // keep track the original vm.parentCtrl.recordLinks

        vm.getData = function () {
            // make a copy to avoid data binding
            vm.recordLinks = angular.copy(vm.parentCtrl.recordLinks);
            // get items that have digital bookplates
            vm.itemList = cisv.extractImageUrl(vm.parentCtrl.item, vm.recordLinks);
            // delay data from parentCtrl
            $timeout(function () {
                vm.recordLinks = angular.copy(vm.parentCtrl.recordLinks);
                vm.itemList = cisv.extractImageUrl(vm.parentCtrl.item, vm.recordLinks);
                if (vm.recordLinks.length > 0 && vm.itemList.length > 0) {
                    vm.parentCtrl.recordLinks = cisv.removeMatchItems(vm.recordLinks, vm.itemList);
                }
            }, 1500);
        };

        vm.$onInit = function () {
            vm.getData();
        };
    }]);

    angular.module('viewCustom').component('prmServiceLinksAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'prmServiceLinksAfterCtrl',
        controllerAs: 'vm',
        templateUrl: '/primo-explore/custom/01HVD/html/prm-service-links-after.html'
    });
})();
/**
 * Created by samsan on 8/9/17.
 *  This component is creating white top bar, link menu on the right, and remove some doms
 */

(function () {

    angular.module('viewCustom').controller('prmTopbarAfterCtrl', ['$timeout', 'customGoogleAnalytic', function ($timeout, customGoogleAnalytic) {
        var vm = this;
        var cga = customGoogleAnalytic;

        vm.$onInit = function () {
            // initialize google analytic
            cga.init();

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
})();

/**
 * Created by samsan on 5/17/17.
 * This component is to insert images into online section and book covers.
 * If pnx.display.lds41 exist, it will display book covers. Then hide image view.
 */

(function () {

    angular.module('viewCustom').controller('prmViewOnlineAfterController', ['prmSearchService', '$mdDialog', '$timeout', '$window', '$location', '$mdMedia', function (prmSearchService, $mdDialog, $timeout, $window, $location, $mdMedia) {

        var vm = this;
        var sv = prmSearchService;
        var itemData = sv.getItem();
        vm.item = itemData.item;
        vm.searchData = itemData.searchData;
        vm.params = $location.search();
        vm.zoomButtonFlag = false;
        vm.viewAllComponetMetadataFlag = false;
        vm.singleImageFlag = false;
        vm.photo = {}; // single imae
        vm.jp2 = false;
        vm.imageTitle = '';
        vm.auth = sv.getAuth();
        vm.gridColumn = '3'; // default print view size


        vm.$onInit = function () {
            vm.isLoggedIn = sv.getLogInID();
            // get item data from service
            itemData = sv.getItem();
            vm.item = itemData.item;
            if (vm.item.pnx.addata.mis1) {
                vm.item.mis1Data = sv.getXMLdata(vm.item.pnx.addata.mis1[0]);
            }
            vm.searchData = itemData.searchData;
            vm.searchData.sortby = vm.params.sortby;
            vm.pageInfo = sv.getPage();

            if (vm.item.mis1Data) {
                if (Array.isArray(vm.item.mis1Data) === false) {
                    vm.singleImageFlag = true;
                    if (vm.item.mis1Data.image) {
                        vm.photo = vm.item.mis1Data.image[0];
                        vm.jp2 = sv.findJP2(vm.photo); // check to see if the image is jp2 or not
                    }
                    if (vm.item.mis1Data.title) {
                        vm.imageTitle = vm.item.mis1Data.title[0].textElement[0]._text;
                    }
                } else {
                    vm.viewAllComponetMetadataFlag = true;
                    vm.singleImageFlag = false;
                    vm.zoomButtonFlag = true;
                }
            }

            // show print view base on the screen size
            if ($mdMedia('xs')) {
                vm.gridColumn = '1';
            } else if ($mdMedia('sm')) {
                vm.gridColumn = '2';
            }
        };

        // view all component metadata
        vm.viewAllComponentMetaData = function () {
            var url = '/primo-explore/viewallcomponentmetadata/' + vm.item.context + '/' + vm.item.pnx.control.recordid[0] + '?vid=' + vm.params.vid;
            url += '&tab=' + vm.params.tab + '&search_scope=' + vm.params.search_scope;
            url += '&adaptor=' + vm.item.adaptor;
            $window.open(url, '_blank');
        };

        // show the pop up image
        vm.gotoFullPhoto = function ($event, item, index) {
            var filename = '';
            if (item.image) {
                var urlList = item.image[0]._attr.href._value;
                urlList = urlList.split('/');
                if (urlList.length >= 3) {
                    filename = urlList[3];
                }
            } else if (item._attr.componentID) {
                filename = item._attr.componentID._value;
            }
            // go to full display page
            var url = '/primo-explore/viewcomponent/' + vm.item.context + '/' + vm.item.pnx.control.recordid[0] + '?vid=' + vm.searchData.vid + '&imageId=' + filename;
            if (vm.item.adaptor) {
                url += '&adaptor=' + vm.item.adaptor;
            } else {
                url += '&adaptor=' + (vm.searchData.adaptor ? vm.searchData.adaptor : '');
            }
            $window.open(url, '_blank');
        };
    }]);

    angular.module('viewCustom').component('prmViewOnlineAfter', {
        bindings: { parentCtrl: '<' },
        controller: 'prmViewOnlineAfterController',
        'templateUrl': '/primo-explore/custom/01HVD/html/prm-view-online-after.html'
    });
})();
/**
 * Created by samsan on 5/23/17.
 * If image width is greater than 600pixel, it will resize base on responsive css.
 * It use to show a single image on the page. If the image does not exist, it use icon_image.png
 */

angular.module('viewCustom').component('responsiveImage', {
    templateUrl: '/primo-explore/custom/01HVD/html/responsiveImage.html',
    bindings: {
        src: '<',
        imgtitle: '<',
        restricted: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$window', '$location', 'prmSearchService', '$timeout', function ($element, $window, $location, prmSearchService, $timeout) {
        var vm = this;
        var sv = prmSearchService;
        // set up local scope variables
        vm.showImage = true;
        vm.params = $location.search();
        vm.localScope = { 'imgClass': '', 'loading': true, 'hideLockIcon': false };
        vm.isLoggedIn = sv.getLogInID();

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {

            vm.isLoggedIn = sv.getLogInID();
            if (vm.restricted && !vm.isLoggedIn) {
                vm.showImage = false;
            }
            vm.localScope = { 'imgClass': '', 'loading': true, 'hideLockIcon': false };
            if (vm.src && vm.showImage) {
                $timeout(function () {
                    var img = $element.find('img')[0];
                    // use default image if it is a broken link image
                    var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                    if (pattern.test(vm.src)) {
                        img.src = '/primo-explore/custom/01HVD/img/icon_image.png';
                    }
                    img.onload = vm.callback;
                    if (img.width > 50) {
                        vm.callback();
                    }
                }, 200);
            }

            vm.localScope.loading = false;
        };
        vm.callback = function () {
            var image = $element.find('img')[0];
            // resize the image if it is larger than 600 pixel
            if (image.width > 600) {
                vm.localScope.imgClass = 'responsiveImage';
                image.className = 'md-card-image ' + vm.localScope.imgClass;
            }

            // force to show lock icon
            if (vm.restricted) {
                vm.localScope.hideLockIcon = true;
            }
        };
        // login
        vm.signIn = function () {
            var auth = sv.getAuth();
            var params = { 'vid': '', 'targetURL': '' };
            params.vid = vm.params.vid;
            params.targetURL = $window.location.href;
            var url = '/primo-explore/login?from-new-ui=1&authenticationProfile=' + auth.authenticationMethods[0].profileName + '&search_scope=default_scope&tab=default_tab';
            url += '&Institute=' + auth.authenticationService.userSessionManagerService.userInstitution + '&vid=' + params.vid;
            if (vm.params.offset) {
                url += '&offset=' + vm.params.offset;
            }
            url += '&targetURL=' + encodeURIComponent(params.targetURL);
            $window.location.href = url;
        };
    }]
});

/**
 * Created by samsan on 5/23/17.
 * If image width is greater than 600pixel, it will resize base on responsive css.
 * It use to show a single image on the page. If the image does not exist, it use icon_image.png
 */

angular.module('viewCustom').component('singleImage', {
    templateUrl: '/primo-explore/custom/01HVD/html/singleImage.html',
    bindings: {
        src: '<',
        imgtitle: '<',
        restricted: '<',
        jp2: '<'
    },
    controllerAs: 'vm',
    controller: ['$element', '$window', '$location', 'prmSearchService', '$timeout', '$sce', function ($element, $window, $location, prmSearchService, $timeout, $sce) {
        var vm = this;
        var sv = prmSearchService;
        // set up local scope variables
        vm.imageUrl = '';
        vm.showImage = true;
        vm.params = $location.search();
        vm.localScope = { 'imgClass': '', 'loading': true, 'hideLockIcon': false };
        vm.isLoggedIn = sv.getLogInID();
        vm.clientIp = sv.getClientIp();

        // check if image is not empty and it has width and height and greater than 150, then add css class
        vm.$onChanges = function () {
            vm.clientIp = sv.getClientIp();
            vm.isLoggedIn = sv.getLogInID();

            if (vm.restricted && !vm.isLoggedIn && !vm.clientIp.status) {
                vm.showImage = false;
            }
            vm.localScope = { 'imgClass': '', 'loading': true, 'hideLockIcon': false };
            if (vm.src && vm.showImage) {
                if (vm.jp2 === true) {
                    var url = sv.getHttps(vm.src) + '?buttons=Y';
                    vm.imageUrl = $sce.trustAsResourceUrl(url);
                } else {
                    vm.imageUrl = vm.src;
                    $timeout(function () {
                        var img = $element.find('img')[0];
                        // use default image if it is a broken link image
                        var pattern = /^(onLoad\?)/; // the broken image start with onLoad
                        if (pattern.test(vm.src)) {
                            img.src = '/primo-explore/custom/01HVD/img/icon_image.png';
                        }
                        img.onload = vm.callback;
                        if (img.width > 600) {
                            vm.callback();
                        }
                    }, 300);
                }
            } else {
                vm.imageUrl = '';
            }

            vm.localScope.loading = false;
        };

        vm.callback = function () {
            var image = $element.find('img')[0];
            // resize the image if it is larger than 600 pixel
            if (image.width > 600) {
                vm.localScope.imgClass = 'responsiveImage';
                image.className = 'md-card-image ' + vm.localScope.imgClass;
            }

            // force to show lock icon
            if (vm.restricted) {
                vm.localScope.hideLockIcon = true;
            }
        };

        // login
        vm.signIn = function () {
            var auth = sv.getAuth();
            var params = { 'vid': '', 'targetURL': '' };
            params.vid = vm.params.vid;
            params.targetURL = $window.location.href;
            var url = '/primo-explore/login?from-new-ui=1&authenticationProfile=' + auth.authenticationMethods[0].profileName + '&search_scope=default_scope&tab=default_tab';
            url += '&Institute=' + auth.authenticationService.userSessionManagerService.userInstitution + '&vid=' + params.vid;
            if (vm.params.offset) {
                url += '&offset=' + vm.params.offset;
            }
            url += '&targetURL=' + encodeURIComponent(params.targetURL);
            $window.location.href = url;
        };
    }]
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