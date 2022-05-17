/**
 * Created by mferrarini on 2/24/22.
 * Adds placeholder text below the search bar.
 */

 angular.module('viewCustom')
 .controller('prmSearchBarAfterCtrl',[function () {
		 var vm=this;
		 vm.parentCtrl.showTabsAndScopes = true;
		 vm.$onInit=function () {

		 };

 }]);

angular.module('viewCustom')
 .component('prmSearchBarAfter',{
		 bindings:{parentCtrl:'<'},
		 controller: 'prmSearchBarAfterCtrl',
		 controllerAs:'vm',
		 templateUrl:'/primo-explore/custom/HVD2/html/prm-search-bar-after.html'
 });