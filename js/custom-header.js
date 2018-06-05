/**
 * Created by samsan on 3/26/18.
 * This header will use for image component page and image detail page
 */


(function () {

    angular.module('viewCustom')
        .controller('customHeaderCtrl',[function () {
            let vm=this;

        }]);

    angular.module('viewCustom')
        .component('customHeader',{
            bindings:{parentCtrl:'<'},
            controller: 'customHeaderCtrl',
            controllerAs:'vm',
            templateUrl:'/primo-explore/custom/HVD2/html/custom-header.html'
        });

})();
