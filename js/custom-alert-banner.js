/**
 * Created by mferrarini on 2/19/22.
 * This custom alert banner component is used to display general alerts for the library (i.e. snow closings)
 * If you need to turn off or on, just set status in json file to on or off
 */

(function () {
    angular.module('viewCustom')
        .controller('customAlertBannerCtrl',['customService','$scope', '$document', function (customService, $scope, $document) {
            let vm=this;
            let cs=customService;
            vm.apiUrl={};
            vm.alertBannerMsg={};

            $scope.class = "showAlert"

            $scope.dismissAlert = function(id) {
                var alertBanner = angular.element($document[0].querySelector('#hl__site-alert-banner'));
                alertBanner.remove();;
            };

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
