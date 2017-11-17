/**
 * Created by samsan on 11/17/17.
 */


angular.module('viewCustom')
    .controller('prmFullViewAfterCtrl',['$element',function ($element) {
        var vm=this;
        vm.$onChanges=function () {

            console.log('**** prm-full-view-after ***');
            console.log(vm);
        };

        vm.onChangeTabEvent=function (e) {
            console.log(e);
        }

    }]);

angular.module('viewCustom')
    .component('prmFullViewAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmFullViewAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/01HVD/html/prm-full-view-after.html'
    });