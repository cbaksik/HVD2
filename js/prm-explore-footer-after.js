/**
 * Created by mferrarini on 2/9/22.
 * Standard HL footer
 */

angular.module('viewCustom')
.controller('prmExploreFooterAfterCtrl',[function () {
		var vm=this;
		vm.$onInit=function () {
			setTimeout(()=>{
				const showFooter = angular.element(document.querySelector('footer'));
				showFooter.addClass("display");
			}, 2000)
		};

}]);

angular.module('viewCustom')
.component('prmExploreFooterAfter',{
		bindings:{parentCtrl:'<'},
		controller: 'prmExploreFooterAfterCtrl',
		controllerAs:'vm',
		templateUrl:'/primo-explore/custom/HVD2/html/prm-explore-footer-after.html'
});