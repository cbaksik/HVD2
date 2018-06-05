/**
 * Created by samsan on 3/21/18.
 * This component use for scanned content key because prm-view-online-after show only when a user search for images
 */

(function () {
    angular.module('viewCustom')
        .controller('prmFullViewServiceContainerAfterCtrl',[function () {
            let vm=this;
            vm.$onInit=()=>{

            }

        }]);

    angular.module('viewCustom')
        .component('prmFullViewServiceContainerAfter',{
            bindings:{parentCtrl:'<'},
            controller: 'prmFullViewServiceContainerAfterCtrl',
            controllerAs:'vm',
            templateUrl:'/primo-explore/custom/HVD2/html/prm-full-view-service-container-after.html'
        });

})();
