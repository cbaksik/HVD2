/**
 * Created by samsan on 8/9/17.
 *  This component is creating white top bar, link menu on the right, and remove some doms
 */

(function () {

    angular.module('viewCustom')
    .controller('prmTopbarAfterCtrl',['$timeout',function ($timeout) {
        var vm=this;

        vm.$onInit=function() {

            $timeout(function () {
                // create script tag link leafletJS.com to use openstreetmap.org
                var bodyTag=document.getElementsByTagName('body')[0];
                var scriptTag=document.createElement('script');
                scriptTag.setAttribute('src','https://unpkg.com/leaflet@1.9.3/dist/leaflet.js');
                scriptTag.setAttribute('integrity','sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=');
                scriptTag.setAttribute('crossorigin','');
                bodyTag.append(scriptTag);
                // create link tag
                var linkTag=document.createElement('link');
                linkTag.setAttribute('href','https://unpkg.com/leaflet@1.9.3/dist/leaflet.css');
                linkTag.setAttribute('integrity','sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=');
                linkTag.setAttribute('crossorigin','');
                linkTag.setAttribute('rel','stylesheet');
                bodyTag.append(linkTag);

            },1000);

        };

    }]);


    angular.module('viewCustom')
    .component('prmTopbarAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmTopbarAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-topbar-after.html'
    });

})();
