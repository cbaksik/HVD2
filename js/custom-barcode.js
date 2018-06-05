/**
 * Created by samsan on 8/29/17.
 */



angular.module('viewCustom')
    .controller('customBarcodeCtrl',['customService','$stateParams','$scope',function (customService, $stateParams,$scope) {
        var vm=this;
        vm.result={}; // store data from alma
        vm.item={}; // store data from pnx
        vm.barcode=$stateParams.code;
        vm.almaBarcodeUrl=''; // get rest end point url from config.text file
        vm.errorMsg='';
        var cs=customService;

        // get relative path rest end point url
        vm.getUrl=function () {
          var config=cs.getEnv();
          cs.getAjax('/primo-explore/custom/HVD2/html/'+config,'','get')
              .then(function (result) {
                    if(result.data) {
                        vm.almaBarcodeUrl=result.data.almaBarcodeUrl;
                    }
                },
                function (error) {
                    console.log(error);
                }
              )
        };

        vm.searchPNX=function () {
            // search for pnx item base on isbn number so it will get pnx/control/recordid
            var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL;
            var params={'addfields':'','Inst':'HVD2','lang':'en_US','limit':10,'offset':0,'getMore':0,'mode':'advanced','pcAvailability':true,'q':'isbn,exact,0062020447,AND','vid':'HVD2','sort':'rank','rtaLinks':true,'scope':'everything','tab':'everything'}
            params.vid=vm.parentCtrl.vid;
            params.Inst=vm.parentCtrl.searchService.cheetah.inst;
            params.q='any,contains,'+vm.result.bib_data.mms_id;
            cs.getAjax(url,params,'get').then(
                function (result) {
                    if(result.data.docs) {
                        vm.item = result.data.docs[0];
                    }
                },
                function (error) {
                    console.log(error);
                }
            )
        };

        // get result of barcode
        vm.getResult=function () {
            vm.determinateValue=50;
            var param={'barcode':''};
            param.barcode=$stateParams.code;
            cs.postAjax(vm.almaBarcodeUrl,param)
                .then(function (result) {
                    vm.determinateValue=100;
                    if(result.status===200) {
                        var data=result.data;
                        if(data.errorList) {
                            vm.errorMsg=data.errorList.error[0].errorMessage;
                        } else {
                            vm.result=data;
                            vm.searchPNX();
                        }

                    }
                    },
                       function (error) {
                       vm.errorMsg=error;
                    }
                )

        };

        vm.$onInit=function () {
            // get rest end point url from config.text file
            vm.getUrl();
            $scope.$watch('[vm.almaBarcodeUrl,vm.barcode]',function () {
               if(vm.almaBarcodeUrl && vm.barcode) {
                   vm.getResult();
               }
            });
        };

    }]);

angular.module('viewCustom')
    .component('customBarcode',{
        bindings:{parentCtrl:'<'},
        controller: 'customBarcodeCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/custom-barcode.html'
    });
