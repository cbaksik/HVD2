/**
 * Created by cbaksik on 3/29/19.
 * This component used to add a block on the My Account overview page
 * 
 * prm-messages-and-blocks-after
 */

(function () {
    angular.module('viewCustom')
        .controller('prmMessagesAndBlocksOverviewAfterCtrl',[function() {
            var vm=this;        
            
        }]);

    angular.module('viewCustom')
        .component('prmMessagesAndBlocksOverviewAfter',{
            bindings:{parentCtrl:'<'},
            controller: 'prmMessagesAndBlocksOverviewAfterCtrl',
            templateUrl:'/primo-explore/custom/HVD2/html/prm-my-account-other.html'
            //template: '<h2>TESTING</h2>'
        });

})();
