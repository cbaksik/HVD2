/* Author: Sam san
   This capture all data from parentCtrl. Then can use with other components.
   Hide some of the services primo
 */

(function () {

    angular.module('viewCustom')
    .controller('prmFullViewAfterCtrl',['prmSearchService','$timeout','customGoogleAnalytic',function (prmSearchService,$timeout, customGoogleAnalytic) {
        var vm=this;
        var sv=prmSearchService;
        var cga=customGoogleAnalytic;

        vm.hideBrowseShelf=function () {
            var hidebrowseshelfFlag=false;
            var item=vm.parentCtrl.item;
            if(item.pnx.control) {
                var sourceid=item.pnx.control.sourceid;
                // find if item is HVD_VIA
                if(sourceid.indexOf('HVD_VIA')!== -1) {
                    hidebrowseshelfFlag=true;
                }
            }
            // hide browse shelf if the item is HVD_VIA is true
            if(hidebrowseshelfFlag) {
                var services=vm.parentCtrl.services;
                if(services) {
                    for (var i = 0; i < services.length; i++) {
                        if (services[i].serviceName === 'virtualBrowse') {
                            services.splice(i, 1);
                            i = services.length;
                        }
                    }
                }
            }

        };

        vm.$onChanges=function () {
            var itemData={'item':{},'searchData':{}};
            itemData.item=angular.copy(vm.parentCtrl.item);
            if(vm.parentCtrl.searchService) {
                itemData.searchData = vm.parentCtrl.searchService.$stateParams;
            }
            // pass this data to use for online section
            sv.setItem(itemData);


        };

        vm.$onInit=function() {
            // remove more section so the view online would show twice
            $timeout(function () {

                // hide browse shelf it is an image HVD_VIA
                vm.hideBrowseShelf();

                for(let i=0; i < vm.parentCtrl.services.length; i++) {
                    // remove More section
                    if(vm.parentCtrl.services[i].scrollId==='getit_link2') {
                        vm.parentCtrl.services.splice(i,1);
                    }
                }
                
                // set up google analytic
                if(vm.parentCtrl.item.pnx.display) {
                    var title=vm.parentCtrl.item.pnx.display.title[0] + ' : ' + vm.parentCtrl.item.pnx.control.recordid[0];
                    cga.setPage('/fulldisplay', title);
                } else {
                    cga.setPage('/fulldisplay', 'Full display page');
                }
            },1000);

        };


    }]);

    angular.module('viewCustom')
    .component('prmFullViewAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmFullViewAfterCtrl',
        controllerAs:'vm'
    });

})();