/**
 * Created by samsan on 8/9/17.
 *  This component is creating white top bar, link menu on the right, and remove some doms
 */

angular.module('viewCustom')
    .controller('prmTopbarAfterCtrl',['$element','$timeout','customService','customGoogleAnalytic',function ($element,$timeout,customService, customGoogleAnalytic) {
        var vm=this;
        var cs=customService;
        var cga=customGoogleAnalytic;
        vm.api={};

        // get rest endpoint Url
        vm.getUrl=function () {
            cs.getAjax('/primo-explore/custom/01HVD/html/config.html','','get')
                .then(function (res) {
                        vm.api=res.data;
                        cs.setApi(vm.api);
                    },
                    function (error) {
                        console.log(error);
                    }
                )
        };


        vm.topRightMenus=[{'title':'Research Guides','url':'http://nrs.harvard.edu/urn-3:hul.ois:portal_resguides','label':'Go to Research guides'},
            {'title':'Libraries / Hours','url':'http://nrs.harvard.edu/urn-3:hul.ois:bannerfindlib','label':'Go to Library hours'},
            {'title':'All My Accounts','url':'http://nrs.harvard.edu/urn-3:hul.ois:banneraccounts','label':'Go to all my accounts'},
            {'title':'Feedback','url':'http://nrs.harvard.edu/urn-3:HUL.ois:hollis-v2-feedback','label':'Go to Feedback'},
            {'title':'Ask Us','url':'http://nrs.harvard.edu/urn-3:hul.ois:dsref','label':'Go to Ask Us'}
        ];

        vm.$onInit=function() {
            // initialize google analytic
            cga.init();

            // pre-load config.html file
            vm.getUrl();

            $timeout(function () {
                // create new div for the top white menu
                var el=$element[0].parentNode.parentNode.parentNode.parentNode.parentNode;
                var div=document.createElement('div');
                div.setAttribute('id','customTopMenu');
                div.setAttribute('class','topMenu');
                // if the topMenu class does not exist, add it.
                var topMenu=document.getElementById('customTopMenu');
                if(topMenu===null) {
                    el.prepend(div);
                }
                var el2=$element[0].parentNode.children[1].children;
                if(el2) {
                    // remove menu
                    el2[2].remove();
                    el2[2].remove();
                }

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


            },500);

        };

    }]);


angular.module('viewCustom')
    .component('prmTopbarAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmTopbarAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/01HVD/html/prm-topbar-after.html'
    });
