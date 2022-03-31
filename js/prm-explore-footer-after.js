/**
 * Created by mferrarini on 2/9/22.
 * This header will use for image component page and image detail page
 */

 angular.module('viewCustom')
 .controller('prmExploreFooterAfterCtrl',[function () {
		 var vm=this;
		 vm.$onInit=function () {

		 };

 }]);

angular.module('viewCustom')
 .component('prmExploreFooterAfter',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmExploreFooterAfterCtrl',
		 controllerAs:'vm',
		 templateUrl:'/primo-explore/custom/HVD2/html/prm-explore-footer-after.html'
 });
