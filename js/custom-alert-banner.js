/**
 * Created by samsan on 3/19/18.
 * This custom alert component is used for home page on the right side splash
 * If you need to turn off or on, just set status in json file to on or off
 */

(function () {
    angular.module('viewCustom')
        .controller('customAlertBannerCtrl',['customService','$scope',function (customService, $scope) {
            let vm=this;
            let cs=customService;
            vm.apiUrl={};
            vm.alertBannerMsg={};

            vm.$onInit=()=> {
                vm.apiUrl=cs.getApi();
                $scope.$watch('vm.apiUrl.alertBannerUrl',()=>{
                   if(vm.apiUrl.alertBannerUrl) {
                       cs.getAjax(vm.apiUrl.alertBannerUrl,'','get')
                           .then((res)=>{
                                vm.alertBannerMsg = res.data;
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
        .component('customAlertBanner',{
            bindings:{parentCtrl:'<'},
            controller: 'customAlertBannerCtrl',
            controllerAs:'vm',
            templateUrl:'/primo-explore/custom/HVD2/html/custom-alert-banner.html'
        });
})();
