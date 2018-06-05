/**
 * Created by samsan on 8/9/17.
 *  This component is creating white top bar, link menu on the right, and remove some doms
 */

(function () {

    angular.module('viewCustom')
    .controller('prmTopbarAfterCtrl',['$timeout','customGoogleAnalytic',function ($timeout, customGoogleAnalytic) {
        var vm=this;
        var cga=customGoogleAnalytic;

        vm.$onInit=function() {
            // initialize google analytic
            cga.init();

            $timeout(function () {
                // create script tag link leafletJS.com to use openstreetmap.org
                var bodyTag=document.getElementsByTagName('body')[0];
                var scriptTag=document.createElement('script');
                scriptTag.setAttribute('src','https://unpkg.com/leaflet@1.2.0/dist/leaflet.js');
                scriptTag.setAttribute('integrity','sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log==');
                scriptTag.setAttribute('crossorigin','');
                bodyTag.append(scriptTag);
                // create link tag
                var linkTag=document.createElement('link');
                linkTag.setAttribute('href','https://unpkg.com/leaflet@1.2.0/dist/leaflet.css');
                linkTag.setAttribute('integrity','sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ==');
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
