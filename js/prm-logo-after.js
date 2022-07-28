/**
 * Created by samsan on 8/9/17.
 * It remove old logo and replace it with new logo
 */

angular.module('viewCustom')
    .controller('prmLogoAfterCtrl',[function () {
        var vm=this;
        var brokenLink = [];        
        var currentURL = '';
        //var pageTitle = '';
        vm.$onInit=function () {
            brokenLink = document.querySelectorAll("a[href^='https://asklib-its-harvard.libanswers.com/form?queue_id=6017']");
            //pageTitle = document.getElementById('ogTitle').getAttribute('content');            
            //console.log(brokenLink[0].href);
            currentURL = encodeURIComponent(window.location.href);
            //pageTitle = encodeURIComponent(window.document.title);
            //console.log(pageTitle);
            brokenLink[0].href = brokenLink[0].href + '&referrer=' + currentURL;
        };

    }]);

angular.module('viewCustom')
    .component('prmLogoAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmLogoAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-logo-after.html'
    });
