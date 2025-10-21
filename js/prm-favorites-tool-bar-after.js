/**
 * Created by cbaksik on 3/29/19.
 * This component used to add a block on the My Account overview page
 * 
 * prm-messages-and-blocks-after
 */

(function () {
    angular.module('viewCustom')
        .controller('prmFavoritesToolBarAfterCtrl',[function() {
            var vm=this;        
            
        }]);

    angular.module('viewCustom')
        .component('prmFavoritesToolBarAfter',{
            bindings:{parentCtrl:'<'},
            controller: 'prmFavoritesToolBarAfterCtrl',
            templateUrl:'/primo-explore/custom/HVD2/html/prm-favorites-tool-bar-after.html'
        });

})();
