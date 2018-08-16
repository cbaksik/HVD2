/**
 * Created by samsan on 8/16/17.
 */


angular.module('viewCustom')
    .controller('prmActionContainerAfterCtrl',['customService','prmSearchService','$window','customGoogleAnalytic','$scope',function (customService,prmSearchService,$window, customGoogleAnalytic, $scope) {

        var cisv=customService;
        var cs=prmSearchService;
        var cga=customGoogleAnalytic;
        var vm=this;
        vm.restsmsUrl='';
        vm.locations=[];
        vm.temp = {'phone':''};
        vm.form={'phone':'','deviceType':'','body':'','error':'','mobile':false,'msg':'','token':'','ip':'','sessionToken':'','isLoggedIn':false,'iat':'','inst':'','vid':'','exp':'','userName':'','iss':'','onCampus':false};
        vm.css = {'class':'textsms-info'};

        vm.$onChanges=function(){
            vm.auth=cisv.getAuth();
            if(vm.auth.primolyticsService.jwtUtilService) {
                vm.form.token=vm.auth.primolyticsService.jwtUtilService.storageUtil.sessionStorage.primoExploreJwt;
                vm.form.sessionToken=vm.auth.primolyticsService.jwtUtilService.storageUtil.localStorage.getJWTFromSessionStorage;
                vm.form.isLoggedIn=vm.auth.isLoggedIn;
                // decode JWT Token to see if it is a valid token
                let obj=vm.auth.authenticationService.userSessionManagerService.jwtUtilService.jwtHelper.decodeToken(vm.form.token);
                vm.form.ip=obj.ip;
                vm.form.iss=obj.iss;
                vm.form.userName=obj.userName;
                vm.form.iat=obj.iat;
                vm.form.exp=obj.exp;
                vm.form.vid=obj.viewId;
                vm.form.inst=obj.viewInstitutionCode;
                vm.form.onCampus=obj.onCampus;

            }
        };

        vm.keyChange=function (e) {
            vm.form.msg='';
            if(e.which > 47 && e.which < 58) {
                vm.form.error = '';
                var phone = angular.copy(vm.temp.phone);
                phone = phone.replace(/[\(\)\-]/g, '');
                if (phone.length > 2 && phone.length < 5) {
                    vm.temp.phone = '(' + phone.substring(0, 3) + ')' + phone.substring(3, phone.length);
                } else if (phone.length > 5 && phone.length < 14) {
                    vm.temp.phone = '(' + phone.substring(0, 3) + ')' + phone.substring(3, 6) + '-' + phone.substring(6, phone.length);
                }
            } else if(e.which > 96 && e.which < 123) {
                vm.form.error = 'Enter valid phone number';
            } else if(e.which === 13) {
                vm.form.error = 'Please choose a location below';
            }
        };


        vm.$onInit=function() {
            // check if a user is using mobile phone or laptop browser
            vm.form.deviceType=cs.getPlatform();
            if(vm.form.deviceType) {
                vm.form.mobile=true;
            } else {
                vm.form.deviceType=cs.getBrowserType();
            }

            $scope.$watch('vm.actionName',()=>{
                if(vm.actionName==='textsms') {
                    if (vm.parentCtrl.item.delivery) {
                        vm.locations = vm.parentCtrl.item.delivery.holding;
                        for (let i = 0; i < vm.locations.length; i++) {
                            vm.locations[i].cssClass = 'textsms-row';
                        }
                    }
                }
            });

        };

        vm.$doCheck=function(){
            // get action name when a user click on each action list
            if(vm.parentCtrl.actionName) {
                vm.actionName = vm.parentCtrl.actionName;
            }

        };

        // this function is trigger only if a user is using laptop computer
        vm.sendText=function (k) {
            // get rest endpoint from config.html file. It's preload in prm-topbar-after.js
            vm.api=cisv.getApi();
            if(vm.api) {
                vm.restsmsUrl=vm.api.smsUrl;
            }

            // reset the row css class
            for(let i=0; i < vm.locations.length; i++) {
                vm.locations[i].cssClass='textsms-row';
            }
            // set select row highlite
            vm.locations[k].cssClass='textsms-row-visited';

            var phone = '';

            if(vm.temp.phone.length > 0) {
                phone = angular.copy(vm.temp.phone);
                phone = phone.replace(/[\(\)\-]/g, '');
            }

            vm.form.error = '';
            vm.form.msg='';
            var count=0;
            if(!phone) {
                vm.form.error = 'Enter your phone number';
                count++;
            } else if(isNaN(phone) || phone.length < 10) {
                vm.form.error = 'Enter a valid phone number';
                count++;
            }

            // get the library name and call number
            var el=document.getElementById('smsLocation');
            if(el) {
                vm.form.body = el.children[k].innerText;
            }
            if(count===0) {
                vm.form.phone = phone;
                let title='';
                if(vm.parentCtrl.item.pnx.display.title) {
                    title = vm.parentCtrl.item.pnx.display.title[0];
                    var pattern=/[:]/;
                    if(pattern.test(title)) {
                        let arr=title.split(':');
                        title=arr[0];
                        if(title.length > 30) {
                            title=title.substring(0,30);
                        }
                        title=title.trim();
                        title+='... ';
                    } else if(title.length > 30) {
                        title=title.substring(0,30);
                        title+='... ';
                    } else {
                        title+='... ';
                    }

                    vm.form.body=title+vm.form.body;

                    var sendTitle=vm.form.userName + ' : ' + vm.form.body;
                    cga.setPage('/sendsms', sendTitle);

                }

                if (vm.form.mobile) {
                    var url = 'sms:' + vm.form.phone + '&body=' + vm.form.body;
                    $window.open(url, '_blank');
                } else {
                    cisv.postAjax(vm.restsmsUrl, vm.form).then(function (result) {
                            if(result.status===200) {
                               if(result.data.status) {
                                   var data = JSON.parse(result.data.msg);
                                   data = data.data.message[0];
                                   if (data.accepted) {
                                       vm.form.msg = 'The message was sent to ' + vm.temp.phone + '.';
                                       vm.css.class='textsms-info';
                                   } else {
                                       vm.form.msg = 'We were unable to send this message. There was a problem with the phone number.';
                                       vm.css.class='textsms-danger';
                                   }
                               } else {
                                   vm.form.msg = result.data.msg;
                                   vm.css.class='textsms-danger';
                               }
                            } else {
                                vm.form.msg='We were unable to send this message. There was a problem with the phone number.';
                                vm.css.class='textsms-danger';
                            }
                        }, function (error) {
                            console.log(error);
                            vm.form.msg='We were unable to send this message. There was a problem with the phone number.';
                        vm.css.class='textsms-danger';
                        }
                    )

                }
            }
        };

    }]);


angular.module('viewCustom')
    .component('prmActionContainerAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmActionContainerAfterCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/prm-action-container-after.html'
    });
