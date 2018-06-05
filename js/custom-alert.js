/**
 * Created by samsan on 3/19/18.
 * This custom alert component is used for home page on the right side splash
 * If you need to turn off or on, just set status in json file to on or off
 */

(function () {
    angular.module('viewCustom')
        .controller('customAlertCtrl',['customService','$scope',function (customService, $scope) {
            let vm=this;
            let cs=customService;
            vm.apiUrl={};
            vm.alertMsg={};

            vm.$onInit=()=> {
                vm.apiUrl=cs.getApi();
                $scope.$watch('vm.apiUrl.alertUrl',()=>{
                   if(vm.apiUrl.alertUrl) {
                       cs.getAjax(vm.apiUrl.alertUrl,'','get')
                           .then((res)=>{
                                vm.alertMsg = res.data;
                           },
                               (err)=>{
                                    console.log(err);
                               }
                           )
                   }
                });
            };
            
        }]);

    angular.module('viewCustom')
        .component('customAlert',{
            bindings:{parentCtrl:'<'},
            controller: 'customAlertCtrl',
            controllerAs:'vm',
            templateUrl:'/primo-explore/custom/HVD2/html/custom-alert.html'
        });
})();
