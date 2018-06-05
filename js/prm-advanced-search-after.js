/**
 * Created by samsan on 8/28/17.
 */

angular.module('viewCustom')
    .controller('prmAdvancedSearchAfterCtrl',['$location','$stateParams','$element','$compile','$scope',function ($location,$stateParams,$element,$compile,$scope) {
        var vm=this;

        vm.form={'barcode':'','error':'','flag':false};
        if($stateParams.code) {
            vm.form.barcode=$stateParams.code;
        }

        // route to barcode page if there is no error
        vm.searchByBarcode=function () {
           vm.form.error='';
           if(!vm.form.barcode) {
              vm.form.error='Enter the barcode number';
           } else {
               $location.path('/barcode/'+vm.form.barcode);
           }
        };

        vm.keypressSearch=function (e) {
            if(e.which===13) {
                vm.searchByBarcode();
            }
        };

        vm.$onInit=()=>{
            setTimeout(()=>{
                let el=$element[0].parentNode.childNodes[0].children[0].children[0].children[0];
                let checkbox=document.createElement('custom-radio');
                checkbox.setAttribute('parent-ctrl','vm.parentCtrl');
                el.appendChild(checkbox);
                $compile(el.children[2])($scope);
            },1000);

        };

        vm.$doCheck=()=>{
            // get checkbox value of true or false when a user click on barcode checkbox
            vm.form.flag=vm.parentCtrl.selectedBarcode;
            let el=$element[0].parentNode.childNodes[0].children[0].children[1];
            if(el) {
                if(vm.form.flag && vm.parentCtrl.selectedSearchTab=='') {
                    el.style.display='none';
                } else {
                    el.style.display='inline-flex';
                    vm.form.flag=false;
                }
            }
        }

    }]);

angular.module('viewCustom')
    .config(function ($stateProvider) {
        $stateProvider
            .state('exploreMain.barcode', {
                    url: '/barcode/:code',
                    views:{
                        '': {
                            template: `<custom-barcode parent-ctrl="$ctrl"></custom-barcode>`
                        }
                    }
                }

            )
    })
    .component('prmAdvancedSearchAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmAdvancedSearchAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-advanced-search-after.html'
    });
