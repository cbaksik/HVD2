/**
 * Created by samsan on 9/22/17.
 */

angular.module('viewCustom')
    .service('customGoogleAnalytic',['$timeout',function ($timeout) {
       let svObj={};
       // initialize google analytic
        svObj.init=function () {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function()
                { (i[r].q=i[r].q||[]).push(arguments)}
                ,i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            ga('create', 'UA-52592218-13', 'auto','HVD2');
            ga('send', 'pageview');
        };

        // set up page
        svObj.setPage=function (urlPath, title) {
            $timeout(function () {

                var loc=window.location.href;
                ga('create', 'UA-52592218-13', 'auto',title);
                ga('send',{'hitType':'pageview','page':urlPath,'title':title,location:loc});

            },500);

        };

        return svObj;
    }]);


