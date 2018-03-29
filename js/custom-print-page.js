/**
 * Created by samsan on 9/5/17.
 * This is an actually print page. it hide action list, browse, search box, top menu section.
 */

(function () {
    angular.module('viewCustom')
    .controller('customPrintPageCtrl',['$element','$stateParams','customService','$timeout','$window',function ($element,$stateParams,customService,$timeout,$window) {
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
            },
            function (error) {
                console.log(error);
            }
          )

        };


        vm.$onInit=function () {
            // capture the parameter from UI-Router
            vm.docid=$stateParams.docid;
            vm.context=$stateParams.context;
            vm.vid=$stateParams.vid;
            vm.getItem();

            $timeout(function () {
                // remove top menu and search bar
                var el=$element[0].parentNode.parentNode;

                if(el) {
                    el.children[0].style.display='none';
                }

                var topMenu=document.getElementById('customTopMenu');
                if(topMenu) {
                    topMenu.style.display='none';
                }

                // hide action list
                var actionList=document.getElementById('action_list');
                if(actionList) {
                    actionList.style.display='none';
                }

                // hide right column of the page
                var el2=$element[0].children[1].children[0].children[1];
                if(el2) {
                    el2.style.display='none';
                }

                var browse = document.getElementById('virtualBrowse');
                if(browse) {
                    browse.style.display = 'none';
                }


            },1000)
        };

        vm.$postLink=function () {
            $timeout(function () {
                $window.print();
            },3000)
        }


    }]);

    angular.module('viewCustom')
    .component('customPrintPage',{
        bindings:{parentCtrl:'<'},
        controller: 'customPrintPageCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/01HVD/html/custom-print-page.html'
    });

})();