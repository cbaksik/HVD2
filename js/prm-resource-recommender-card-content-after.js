/**
 * Created by samsan on 11/16/17.
 * It display the recommend resource above the search result list - search for fake news
 * It insert harvard shield in front of the word if resourceType is library_guide
 */

angular.module('viewCustom')
    .controller('prmResourceRecommenderCardContentAfterCtrl',['$element',function ($element) {
        var vm=this;
        vm.$onInit=function () {
           if(vm.parentCtrl.resource) {
               if(vm.parentCtrl.resource.resourceType==='library_guide') {
                   var el = $element[0].parentNode.children[0];
                   if(el) {
                       el.style.display='none';
                   }
               }
           }
        };

    }]);

angular.module('viewCustom')
    .component('prmResourceRecommenderCardContentAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmResourceRecommenderCardContentAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-resource-recommender-card-content-after.html'
    });

