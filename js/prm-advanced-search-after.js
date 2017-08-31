/**
 * Created by samsan on 8/28/17.
 */

angular.module('viewCustom')
    .controller('prmAdvancedSearchAfterCtrl',['$location','$stateParams',function ($location,$stateParams) {
        var vm=this;
        vm.form={'barcode':'','error':''};
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
        templateUrl:'/primo-explore/custom/01HVD/html/prm-advanced-search-after.html'
    });
