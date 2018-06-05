/**
 * Created by samsan on 10/23/17.
 * Create Map it link, place icon, and display the library name
 */

angular.module('viewCustom')
    .controller('customLibraryMapCtrl',['customService','$window','$location','$scope','$sce',function (customService, $window, $location,$scope, $sce) {
        var vm=this;
        var sv=customService;
        vm.params=$location.search();
        vm.api=sv.getApi();
        vm.mapLocData={};

        vm.getMapIt=function () {
            vm.api=sv.getApi();
            if(vm.api.mapUrl) {
                let url = vm.api.mapUrl + '/' + vm.params.library;
                url += '/' + vm.params.location + '?callNumber=' + encodeURI(vm.params.callnum);
                sv.getAjax(url,'','get').then(
                    function (result) {
                        vm.mapLocData=result.data;
                    },
                    function (error) {
                        console.log(error);
                    }
                )
            }
        };

        vm.$onInit=function() {
           $scope.$watch('vm.api',function () {
               vm.getMapIt();
           });
        };

        vm.$doCheck=function(){
            vm.api=sv.getApi();
        };

        vm.goPlace=function(loc,e){
            e.stopPropagation();
            var url='http://nrs.harvard.edu/urn-3:hul.ois:' + loc.mainLocation;
            $window.open(url,'_blank');
            return true;
        };

    }]);

angular.module('viewCustom')
    .component('customLibraryMap',{
        bindings:{loc:'<'},
        controller: 'customLibraryMapCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/custom-library-map.html'
    });


// map letter to specific word in floor
angular.module('viewCustom').filter('mapFilter',[function () {
    return function (str) {
        var newStr='';
        if(str.length===2) {
            var loc=str.substring(0,1);
            var loc2=str.substring(1,str.length);
            newStr='Floor ' + loc;
            if(loc2==='E') {
                newStr+=' East';
            } else if(loc2==='W') {
                newStr+=' West';
            } else if(loc2==='N') {
                newStr+=' North';
            } else if(loc2==='S') {
                newStr+=' South';
            }
        } else if(str.length===1) {
            newStr='Floor ' + str;
        } else {
            newStr=str;
        }
        return newStr;
    }

}]);


// remove 2 forward slash from the url
angular.module('viewCustom').filter('mapFilterUrl',['$sce',function ($sce) {
    return function (str) {
        var newStr='';
        if(str) {
            var urlList=str.split('//');
            if(urlList.length > 2){
                newStr=urlList[0]+'//'+urlList[1]+'/'+urlList[2];
            } else {
                newStr=str;
            }
        } else {
            newStr=str;
        }
        newStr=$sce.trustAsResourceUrl(newStr);
        return newStr;
    }

}]);