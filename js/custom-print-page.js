/**
 * Created by samsan on 9/5/17.
 * This is an actually print page. it hide action list, browse, search box, top menu section.
 */

(function () {
    angular.module('viewCustom')
    .controller('customPrintPageCtrl',['$stateParams','customService','$timeout','$window','$state','customConfig',function ($stateParams,customService,$timeout,$window, $state, customConfig) {
        var vm=this;
        vm.item={};
        var cs=customService;
        // get item data to display on full view page
        vm.getItem=function () {
          var url=vm.parentCtrl.searchService.cheetah.restBaseURLs.pnxBaseURL+'/'+vm.context+'/'+vm.docid;
          url+='?vid='+vm.vid;
          cs.getAjax(url,'','get').then(
              function (result) {
              vm.item=result.data;
              vm.goto();

            },
            function (error) {
                console.log(error);
            }
          )

        };

        vm.goto=function() {
            var obj={docid:vm.item.pnx.control.recordid[0],vid:'HVD2',lang:'en_US'};
            $state.go('fulldisplay',obj,{location:false, reload:true,notify:true});

        };



        vm.$onInit=function () {
            // capture the parameter from UI-Router
            vm.docid=$stateParams.docid;
            vm.context=$stateParams.context;
            vm.vid=customConfig.getParam().vid;
            vm.getItem();

            $timeout(function () {
                // remove top menu and search bar
                var el=document.getElementsByTagName('body')[0];

                if(el) {
                    el.setAttribute('id','printView');
                }

            },50);

            $window.onafterprint=()=>{
                // if needed for debugging, comment out line below to prevent closure of printable page
                $window.close();
            }
        };

        vm.$postLink=function () {
            $timeout(function () {
                // comment out line below when troubleshooting so that print dialog does't open
                $window.print();
            },3000)
        }


    }]);

    angular.module('viewCustom')
    .component('customPrintPage',{
        bindings:{parentCtrl:'<'},
        controller: 'customPrintPageCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/custom-print-page.html'
    });

})();