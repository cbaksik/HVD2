/**
 * Created by cbaksik on 1/23/23.
 * This component used to add a block on the My Account Reuqests page. Same as blurb on overview
 * 
 * prm-messages-and-blocks-after
 */

(function () {
    angular.module('viewCustom')
        .controller('prmRequestsAfterCtrl',[function() {
            var vm=this;        
            
        }]);

    angular.module('viewCustom')
        .component('prmRequestsAfter',{
            bindings:{parentCtrl:'<'},
            controller: 'prmRequestsAfterCtrl',
            templateUrl:'/primo-explore/custom/HVD2/html/prm-my-account-other.html'
            //template: '<h2>TESTING</h2>'
        });

})();
