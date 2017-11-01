/**
 * Created by samsan on 9/25/17.
 */

angular.module('viewCustom')
    .controller('prmSearchBarAfterCtrl',['$element','$location','$compile','$scope','$mdMedia',function ($element,$location,$compile,$scope,$mdMedia) {
        var vm=this;

        vm.$onInit=function () {
            var el=$element[0].parentNode.children[0].children[0].children[2];
            var button=document.createElement('button');
            button.setAttribute('id','browseButton');
            button.setAttribute('class','md-button md-primoExplore-theme browse-button');
            button.setAttribute('ng-click','vm.gotoBrowse()');
            var textNode=document.createTextNode('STARTS WITH (BROWSE BY...)');
            if($mdMedia('xs') || $mdMedia('sm')) {
                textNode=document.createTextNode('BROWSE');
            }
            button.appendChild(textNode);
            var browseBtn=document.getElementById('browseButton');
            // if browse button doesn't exist, add new one
            if(!browseBtn) {
                el.appendChild(button);
                $compile(el)($scope);
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

