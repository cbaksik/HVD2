/**
 * Created by samsan on 2/28/18.
 * Add basic search and advanced search button at browse page
 */

angular.module('viewCustom')
    .component('prmBrowseSearchBarAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmBrowseSearchBarAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/01HVD/html/prm-browse-search-bar-after.html'
    });


angular.module('viewCustom')
    .controller('prmBrowseSearchBarAfterCtrl',['$location','customService','$element',function ($location,customService,$element) {
        var vm=this;
        var cs=customService;

        vm.$onChanges=()=>{
            var el=$element[0].parentNode.childNodes[0].children[2];
            if(el) {
                var left=el.offsetLeft;
                var doc=document.getElementById('browseSearchBar');
                doc.style.left=(left + 20) + 'px';
            }
        };

        vm.gotoSimpleSearch=()=>{
            cs.setAdvancedSearch(false);
            window.location.href='/primo-explore/search?vid=01HVD'
        };

       vm.gotoAdvancedSearch=()=>{
           cs.setAdvancedSearch(true);
           $location.path('/search');
       }


    }]);