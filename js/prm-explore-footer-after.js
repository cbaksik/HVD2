/**
 * Created by mferrarini on 2/9/22.
 * Standard HL footer
 * Footer delayed 5 seconds for full record view pages to give other page content time to load
 */

angular.module('viewCustom')
.controller('prmExploreFooterAfterCtrl',[function () {
		var vm=this;
		vm.footer = angular.element(document.querySelector('footer'));

		var exploreMain = angular.element(document.querySelector('prm-explore-main')); // main content block on all pages except full record view pages

		vm.$onInit=function () {
			if (exploreMain.length) {
				vm.footer.addClass("display");
			} else {
				setTimeout(()=>{
					vm.footer.addClass("display");
				}, 5000)
			}
		};
}]);

angular.module('viewCustom')
.component('prmExploreFooterAfter',{
		bindings:{parentCtrl:'<'},
		controller: 'prmExploreFooterAfterCtrl',
		controllerAs:'vm',
		templateUrl:'/primo-explore/custom/HVD2/html/prm-explore-footer-after.html'
});