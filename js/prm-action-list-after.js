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
                    // add check hathi link
/*                     console.log("prmActionListAfter");
                    let prmActionList = document.getElementsByTagName('prm-action-list')[0];
                    let ul = prmActionList.getElementsByTagName('ul')[0];
                    let li = ul.querySelector('#scrollActionList');
                    var checkHathiLink = 'https://catalog.hathitrust.org/Search/Home?lookfor=' + vm.parentCtrl.item.pnx.addata.btitle + '%26urlappend=%3Bsignon=swle:https://fed.huit.harvard.edu/idp/shibboleth';
                    console.log("test hathi link " + checkHathiLink);
                    var citationEl = document.getElementById('Citation');
                    if (citationEl) {
                        var checkHathiTag = document.createElement('custom-hathiActionLink');
                        
                        checkHathiTag.setAttribute('parent-ctrl', 'vm.parentCtrl.item');
                        citationEl.appendChild(checkHathiTag);
                        li.insertBefore(checkHathiTag, li.childNodes[0]);
                        $compile(citationEl.children[1])($scope);
                    } */


                // }, 2000);
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

