/**
 * Created by samsan on 8/7/17.
 * This component is used for Digital Bookplates
 * 
 * CB adding tech loan as well March 2020
 */
(function(){
    'use strict';
    angular.module('viewCustom')
    .controller('prmServiceLinksAfterCtrl',['customImagesService','$timeout',function (customImagesService, $timeout) {
        let vm=this;
        let cisv=customImagesService;
        vm.itemList=[];
        vm.recordLinks=[]; // keep track the original vm.parentCtrl.recordLinks
        vm.getData=()=> {
            // make a copy to avoid data binding
            vm.recordLinks = angular.copy(vm.parentCtrl.recordLinks);            
            var searchHathiBase = 'https://catalog.hathitrust.org/Search/Home?lookfor=';
            var searchHathiLinkAppend = '%26urlappend=%3Bsignon=swle:https://fed.huit.harvard.edu/idp/shibboleth';
            vm.searchHathiLink= searchHathiBase + vm.parentCtrl.item.pnx.addata.btitle[0] + '%26type=title' + searchHathiLinkAppend;
            //vm.btitle = vm.addata.btitle[0];       
            // get items that have digital bookplates
            vm.itemList=cisv.extractImageUrl(vm.parentCtrl.item, vm.recordLinks);
            // delay data from parentCtrl
            $timeout(()=> {
                vm.recordLinks = angular.copy(vm.parentCtrl.recordLinks);                
                vm.itemList=cisv.extractImageUrl(vm.parentCtrl.item, vm.recordLinks);
                if(vm.recordLinks.length > 0 && vm.itemList.length > 0) {
                    vm.parentCtrl.recordLinks = cisv.removeMatchItems(vm.recordLinks, vm.itemList);
                }
            },1500);

        };

        vm.$onInit=()=> {
            vm.getData();
        }


    }]);


    angular.module('viewCustom')
    .component('prmServiceLinksAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmServiceLinksAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-service-links-after.html'
    });

})();