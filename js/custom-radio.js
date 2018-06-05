/**
 * Created by samsan on 3/2/18.
 * It create a checkbox in advance search section
 */


angular.module('viewCustom')
    .controller('customRadioCtrl',[function () {
        var vm=this;
        vm.form={'checked':false,'class':'md-off'};

        vm.check=()=>{
            vm.parentCtrl.selectedSearchTab='';
            vm.form.checked=true;
            vm.form.class='md-checked md-on';
            vm.parentCtrl.selectedBarcode=vm.form.checked;
        };

        vm.$doCheck=()=>{
            if(vm.parentCtrl.selectedSearchTab) {
                vm.form.checked=false;
                vm.form.class='md-unchecked md-off';
            }
        }

    }]);

angular.module('viewCustom')
    .component('customRadio',{
        bindings:{parentCtrl:'<'},
        controller: 'customRadioCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/custom-radio.html'
    });

