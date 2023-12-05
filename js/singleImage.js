/**
 * Created by samsan on 5/23/17.
 * If image width is greater than 600pixel, it will resize base on responsive css.
 * It use to show a single image on the page. If the image does not exist, it use icon_image.png
 */

angular.module('viewCustom')
    .component('singleImage', {
        templateUrl:'/primo-explore/custom/HVD2/html/singleImage.html',
        bindings: {
          src:'<',
          imgtitle: '<',
          restricted:'<',
          jp2:'<'
        },
        controllerAs:'vm',
        controller:['$element','$window','$location','prmSearchService','$timeout','$sce','$scope',function ($element,$window,$location,prmSearchService, $timeout,$sce,$scope) {
            var vm=this;
            var sv=prmSearchService;
            // set up local scope variables
            vm.imageUrl='';
            vm.showImage=true;
            vm.params=$location.search();
            vm.localScope={'imgClass':'','loading':true,'hideLockIcon':false};
            vm.isLoggedIn=sv.getLogInID();
            vm.clientIp=sv.getClientIp();
            //console.log("singleImage.js");

            // check if image is not empty and it has width and height and greater than 150, then add css class
            vm.$onChanges=function () {
                vm.clientIp=sv.getClientIp();
                vm.isLoggedIn=sv.getLogInID();

                // CB 20200601 made showImage true b/c login test is failing so it never shows image
                if(vm.restricted && !vm.isLoggedIn && !vm.clientIp.status) {
                    //vm.showImage=false;
                    vm.showImage=true;
                    //console.log('Restrict image: A user is not login or client IP address is not in  the list');
                }
                
                vm.localScope={'imgClass':'','loading':true,'hideLockIcon':false};
                if(vm.src && vm.showImage) {
                    vm.items={};
                    vm.urn = vm.src.split('/').pop();
                    const restUrl = 'https://embed.lib.harvard.edu/api/nrs'
                    var params={'urn':vm.urn,'prod':1}
                    sv.getAjax(restUrl,params,'get')
                    .then(function (result) {
                        vm.items=result.data;
                        vm.iframeHtml = vm.items.html;
                        const doc = new DOMParser().parseFromString(vm.iframeHtml, 'text/html');
                        const element = doc.body.children[0];
                        vm.iframeAttributes = {};
                        for (var i = 0; i < element.attributes.length; i++) {
                            var attrib = element.attributes[i];
                            if (attrib.name == 'src') {
                                vm.iframeAttributes[attrib.name] = $sce.trustAsResourceUrl(attrib.value);
                            }
                            else {
                                vm.iframeAttributes[attrib.name] = attrib.value;  
                            }
                        }                 
                    },function (err) {
                        console.log(err);
                    });
                    const url = sv.getHttps(vm.src) + '?buttons=y';
                    vm.imageUrl = $sce.trustAsResourceUrl(url);
                }
                vm.localScope.loading=false;

            };

            vm.callback=function () {
                var image=$element.find('img')[0];
                // resize the image if it is larger than 600 pixel
                if(image.width > 600){
                    vm.localScope.imgClass='responsiveImage';
                    image.className='md-card-image '+vm.localScope.imgClass;
                }

                // force to show lock icon
                if(vm.restricted) {
                    vm.localScope.hideLockIcon=true;
                }
            };

            // login
            vm.signIn=function () {
                var auth=sv.getAuth();
                var params={'vid':'','targetURL':''};
                params.vid=vm.params.vid;
                params.targetURL=$window.location.href;
                var url='/primo-explore/login?from-new-ui=1&authenticationProfile='+auth.authenticationMethods[0].profileName+'&search_scope=default_scope&tab=default_tab';
                //url+='&Institute='+auth.authenticationService.userSessionManagerService.userInstitution+'&vid='+params.vid;
                url+='&Institute='+auth.userSessionManagerService.userInstitution+'&vid='+params.vid;
                if(vm.params.offset) {
                    url+='&offset='+vm.params.offset;
                }
                url+='&targetURL='+encodeURIComponent(params.targetURL);
                $window.location.href=url;
            };

        }]
    });
