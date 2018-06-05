/**
 * Created by samsan on 9/7/17.
 * This is for scanned content key. Some items have scan images.
 * If any pnx/display/lds41, then it has scan images
 */

(function () {

    angular.module('viewCustom')
    .controller('customScannedKeyContentCtrl',[function () {
        var vm=this;
        vm.lds41=[];

        vm.$onChanges=function () {
            // re-construct json obj if lds41 is existed
            if(vm.item.pnx.display.lds41) {
                let lds41=vm.item.pnx.display.lds41;
                for(let i=0; i < lds41.length; i++){
                    let str=lds41[i];
                    let arr=str.split('--');
                    if(arr.length > 0) {
                        let obj={'title':'','url':''};
                        obj.title=arr[0];
                        obj.url=arr[1];
                        vm.lds41.push(obj);
                    }
                }
            }

        };


    }]);


    angular.module('viewCustom')
    .component('customScannedKeyContent',{
        bindings:{item:'<'},
        controllerAs:'vm',
        controller: 'customScannedKeyContentCtrl',
        templateUrl: '/primo-explore/custom/HVD2/html/custom-scanned-key-content.html'
    });

})();