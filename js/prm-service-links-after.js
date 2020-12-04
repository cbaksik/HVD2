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
            /* START hathi section */    
            var searchHathiBase = 'https://catalog.hathitrust.org/Search/Home?adv=1&lookfor%5B%5D=';
            var searchHathiLinkAppend = '&urlappend=%3Bsignon=swle:https://fed.huit.harvard.edu/idp/shibboleth';
            //console.log(vm.parentCtrl.item.pnx.addata);
            console.log(vm.parentCtrl.item.pnx.display.type[0]);
            // only present hathi link for book, music, journal
            var format = vm.parentCtrl.item.pnx.display.type[0];  
            var title = vm.parentCtrl.item.pnx.display.title[0]; 
            var author = '';
            var year = '';            
            if (vm.parentCtrl.item.pnx.addata.aulast) {
                author = vm.parentCtrl.item.pnx.addata.aulast[0];
            }
            if (!format == 'journal' && !author && vm.parentCtrl.item.pnx.addata.addau) {
                author = vm.parentCtrl.item.pnx.addata.addau[0];
            }
            if (vm.parentCtrl.item.pnx.addata.risdate){
                year = vm.parentCtrl.item.pnx.addata.risdate[0];       
            }                       
            if (format == 'book' || format == 'journal' || format == 'music') {
                vm.showHathiLink = "true";                
            }
            //console.log(vm.showHathiLink );
            vm.searchHathiLink = searchHathiBase + author + '&type%5B%5D=author&bool%5B%5D=AND&lookfor%5B%5D='  + title + '&type%5B%5D=title&bool[]=AND&lookfor[]=' + year + '&type[]=year&bool[]=AND&yop=after' + searchHathiLinkAppend;  
            /* END hathi section */                  
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