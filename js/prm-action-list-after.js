/**
 * Created by samsan on 8/15/17.
 * This component will insert textsms and its icon into the action list
 */


angular.module('viewCustom')
    .controller('prmActionListAfterCtrl',['$element','$compile','$scope','$timeout','customService',function ($element,$compile,$scope,$timeout, customService) {
        var vm=this;
        var cisv=customService;
        vm.$onInit=function () {
            // insert custom-sms and custom-print tag when it is not in favorite section.
            if(!vm.parentCtrl.displaymode) {
                $timeout(function () {
                    // if holding location is existed, then insert sms text call icon
                    if (vm.parentCtrl.item.delivery) {                    
                        if(vm.parentCtrl.item.delivery.holding.length > 0) {
                            let textsmsExist = document.getElementById('textsms');
                            // if textsms doesn't exist, insert it.
                            if (!textsmsExist) {
                                let prmActionList = document.getElementsByTagName('prm-action-list')[0];
                                let ul = prmActionList.getElementsByTagName('ul')[0];
                                let li = ul.querySelector('#scrollActionList');
                                if (li) {
                                    let smsTag = document.createElement('custom-sms');
                                    smsTag.setAttribute('parent-ctrl', 'vm.parentCtrl');
                                    li.insertBefore(smsTag, li.childNodes[0]);
                                    $compile(li.children[0])($scope);
                                }
                            }
                        }
                    }
                    // if print icon exist, then add custom-print tag
                    var printEl = document.getElementById('Print');
                    if (printEl) {
                        // when remove it, cause javascript error
                        printEl.children[0].style.display = 'none';
                        var printTag = document.createElement('custom-print');
                        printTag.setAttribute('parent-ctrl', 'vm.parentCtrl.item');
                        printEl.appendChild(printTag);
                        $compile(printEl.children[1])($scope);
                    }

                    // report a problem 
                    if (vm.parentCtrl) {               
                        //console.log("*************************** report a problem function")     
                        let reportProbExist = document.getElementById('reportProb');
                        // if reportProb doesn't exist, insert it.
                        if (!reportProbExist) {
                            //console.log(document.getElementsByTagName('prm-action-list')[0]);
                            let prmActionList = document.getElementsByTagName('prm-action-list')[0];
                            let ul = prmActionList.getElementsByTagName('ul')[0];
                            let li = ul.querySelector('#scrollActionList');
                            if (li) {
                                let reportProbTag = document.createElement('custom-report-problem-action');
                                reportProbTag.setAttribute('parent-ctrl', 'vm.parentCtrl');
                                li.insertBefore(reportProbTag, li.childNodes[0]);
                                $compile(li.children[0])($scope);
                            }
                        }
                        // 
                         /* customize url for your libanswers url, primo url, and primo VID */
                        //var url = "http://nrs.harvard.edu/urn-3:HUL.ois:hollis-v2-feedback&resource=" + vm.prmActionCtrl.item.pnx.display.title[0] + " (https://hollis.harvard.edu/primo-explore/fulldisplay?" + encodeURIComponent("docid=" + vm.prmActionCtrl.item.pnx.control.recordid + "&context=L&vid=HVD2&search_scope=default_scope&tab=default_tab&lang=en_US") + ")";
                  

                    }

                }, 0);  // changing this to zero per basecamp discussion with Lynn and Jim from ExL  
            }
        };


    }]);

angular.module('viewCustom')
    .component('prmActionListAfter',{
        bindings:{parentCtrl:'<'},
        controller: 'prmActionListAfterCtrl',
        controllerAs:'vm'
    });

