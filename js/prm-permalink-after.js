/**
 * Created by samsan on 9/18/17.
 */

angular.module('viewCustom')
    .controller('prmPermalinkAfterCtrl',['$scope','$sce','$element',function ($scope,$sce,$element) {
        var vm=this;
        vm.msg={'class':''};
        vm.$onInit=function () {
            vm.permalinkText='';
            // change perm a link to correct url, only for data where we've put a link to id.lib via norm rules
            $scope.$watch('vm.parentCtrl.permalink',function () {
                if(vm.parentCtrl.item && vm.parentCtrl.item.pnx.display.lds03){                    
                        vm.parentCtrl.permalink = vm.parentCtrl.item.pnx.display.lds03[0];                        
                        vm.permalink=$sce.trustAsHtml(vm.parentCtrl.permalink);
                        console.log(vm.permalink.innerHtml);
                    // remove parent node
                    var pNode=$element[0].parentNode.children[0];

                    if(pNode) {
                       pNode.style.display='none';
                    } 
                    // get link text
                    setTimeout(()=>{
                        var el=$element[0].children[0].children[0].children[0].children[0].children[0].children[0];
                        if(el) {
                            vm.permalinkText=el.textContent;
                        }
                    },1000);                
                }
            });


        };

        vm.selectText=function() {
            vm.msg.class = 'highlite';
        };
        vm.unSelectText=function() {
            vm.msg.class = '';
        };

    }]);

angular.module('viewCustom')
    .component('prmPermalinkAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmPermalinkAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-permalink-after.html'
    });
