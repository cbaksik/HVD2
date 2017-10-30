/**
 * Created by samsan on 8/7/17.
 */

angular.module('viewCustom')
    .controller('prmAuthenticationAfterController', ['customService', function (customService) {
        let vm=this;
        // initialize custom service search
        let sv=customService;
        // check if a user login
        vm.$onChanges=function(){
            sv.setAuth(vm.parentCtrl);

        };

    }]);



angular.module('viewCustom')
    .component('prmAuthenticationAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmAuthenticationAfterController'
    });
