/**
 * Created by samsan on 9/25/17.
 */

 /* CB commenting this out, no longer need this */
/* angular.module('viewCustom')
    .controller('prmSearchBarAfterCtrl',['$element','$location','$compile','$scope','$mdMedia','customService',function ($element,$location,$compile,$scope,$mdMedia, customService) {
        var vm=this;
        var cs=customService;

        vm.$onInit=function () {
            var el=$element[0].parentNode.children[0].children[0].children[2];
            var button=document.createElement('button');
            button.setAttribute('id','browseButton');
            button.setAttribute('class','md-button md-primoExplore-theme browse-button switch-to-advanced');
            button.setAttribute('ng-click','vm.gotoBrowse()');
            var textNode=document.createTextNode('STARTS WITH (BROWSE BY...)');
            if($mdMedia('xs') || $mdMedia('sm')) {
                textNode=document.createTextNode('BROWSE');
            }
            button.appendChild(textNode);
            var browseBtn=document.getElementById('browseButton'); */
            // if browse button doesn't exist, add new one
/*             if(!browseBtn) {
                el.appendChild(button);
                $compile(el)($scope);
            }

        }; */

        // toggle between advance search and simple search
/*         vm.$doCheck=()=>{
            var browseBtn=document.getElementById('browseButton');
            if(vm.parentCtrl.advancedSearch) {
                if(browseBtn) {
                    browseBtn.classList.remove('switch-to-advanced');
                    browseBtn.classList.add('switch-to-simple');
                }
            } else {
                if(browseBtn) {
                    browseBtn.classList.remove('switch-to-simple');
                    browseBtn.classList.add('switch-to-advanced');
                }
            }

            if(cs.getAdvancedSearch()===true) {
                vm.parentCtrl.searchFieldsService.advancedSearch=true;
                cs.setAdvancedSearch(false);
            }
        };

        vm.gotoBrowse=function () {
            $location.path('/browse');
        };


    }]);

angular.module('viewCustom')
    .component('prmSearchBarAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmSearchBarAfterCtrl',
        controllerAs:'vm'
    });
 */
