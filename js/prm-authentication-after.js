/**
 * Created by samsan on 8/7/17.
 */

angular.module('viewCustom')
    .controller('prmAuthenticationAfterController', ['customService','prmSearchService', function (customService, prmSearchService) {
        let vm=this;
        let psv = prmSearchService;
        // initialize custom service search
        let sv=customService;
        vm.api={};
        // get rest endpoint Url
        vm.getUrl=function () {
            var config = sv.getEnv();
            sv.getAjax('/primo-explore/custom/HVD2/html/' + config,'','get')
                .then(function (res) {
                        vm.api=res.data;
                        sv.setApi(vm.api);
                        vm.getClientIP();
                    },
                    function (error) {
                        console.log(error);
                    }
                )
        };

        vm.form={'ip':'','status':false,'token':'','sessionToken':'','isLoggedIn':''};
        vm.validateIP=function () {
            vm.api = sv.getApi();
            if(vm.api.ipUrl) {
                sv.postAjax(vm.api.ipUrl, vm.form)
                    .then(function (result) {
                            psv.setClientIp(result.data);
                        },
                        function (error) {
                            console.log(error);
                        })
            }
        };

        vm.getClientIP=function() {
            vm.auth = sv.getAuth();
            if(vm.auth.primolyticsService.jwtUtilService) {
                vm.form.token=vm.auth.primolyticsService.jwtUtilService.storageUtil.sessionStorage.primoExploreJwt;
                vm.form.sessionToken=vm.auth.primolyticsService.jwtUtilService.storageUtil.localStorage.getJWTFromSessionStorage;
                vm.form.isLoggedIn=vm.auth.isLoggedIn;
                // decode JWT Token to see if it is a valid token
                let obj=vm.auth.authenticationService.userSessionManagerService.jwtUtilService.jwtHelper.decodeToken(vm.form.token);
                vm.form.ip=obj.ip;
                if(vm.auth.isLoggedIn) {
                    // user is login
                    vm.form.status=true;
                    let status={'ip':'0.0.0.0','status':true};
                    psv.setClientIp(status);
                    psv.setLogInID(vm.auth.isLoggedIn);
                } else {
                    // user is not login
                    vm.validateIP();
                }

            }
        };

        vm.$onInit=()=>{
            // get primo service endpoint urls
            vm.getUrl();
        };

        // check if a user login
        vm.$onChanges=function(){
            // use for validate ip
            sv.setAuth(vm.parentCtrl);
            // use for images
            psv.setAuth(vm.parentCtrl);

        };

    }]);



angular.module('viewCustom')
    .component('prmAuthenticationAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmAuthenticationAfterController'
    });
