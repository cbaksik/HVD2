/**
 * Created by samsan on 11/1/17.
 */

angular.module('viewCustom')
    .controller('prmFullViewServiceContainerAfterCtrl',['$element',function ($element) {
        var vm=this;
        vm.$onChanges=function () {
            console.log('**** prm-full-view-service-container-after ****');
            console.log(vm);
        };

    }]);

angular.module('viewCustom')
    .component('prmFullViewServiceContainerAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmFullViewServiceContainerAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/01HVD/html/prm-full-view-service-container-after.html'
    });
