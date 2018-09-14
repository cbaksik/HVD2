/**
 * Created by samsan on 8/10/17.
 * This component add a "Finding Aid" button and make a link
 */

(function () {

    angular.module('viewCustom')
    .controller('prmBriefResultContainerAfterCtrl',['$location','$scope',function ($location,$scope) {
        var vm=this;
        var param=$location.search();
        vm.cssClass='marginLeftFindingAid';
        vm.findingAid={'displayLabel':'','linkURL':'','newLinkURL':''};
        vm.$onInit=()=>{
            // get links data from primo parent-ctrl binding data
            $scope.$watch('vm.parentCtrl.links',()=>{
                // find $$Elinktofa
                if(vm.parentCtrl.links) {
                    for(var i=0; i < vm.parentCtrl.links.length; i++) {
                        var linkItem=vm.parentCtrl.links[i];
                        var seqment='';
                        if(linkItem.displayLabel==='$$Elinktofa') {
                            vm.findingAid=linkItem;
                            if(linkItem.linkURL){
                                var linkStr=linkItem.linkURL;
                                linkStr=linkStr.split(' ');
                                if(linkStr.length > 0) {
                                    seqment=linkStr[linkStr.length - 2];
                                    console.log(linkStr);
                                    seqment=seqment.trim(' ');
                                }
                            }
                            //vm.findingAid.newLinkURL='http://id.lib.harvard.edu/ead/'+seqment+'/catalog';
                            vm.findingAid.newLinkURL=seqment;
                            i=vm.parentCtrl.links.length;
                        }
                    }
                }
            });

            // add more padding when it is full display page
            if(param.docid) {
                vm.cssClass='marginLeftFindingAid2';
            }
        };

    }]);

    angular.module('viewCustom')
    .component('prmBriefResultContainerAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmBriefResultContainerAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-brief-result-container-after.html'
    });

})();