/**
 * Created by samsan on 8/15/17.
 * This component will insert textsms and its icon into the action list
 */


angular.module('viewCustom')
    .controller('prmActionListAfterCtrl',['$element','$compile','$scope','$timeout','customService',function ($element,$compile,$scope,$timeout, customService) {
        var vm=this;
        var cisv=customService;
        var url='https://harvard-lts.libanswers.com/form?queue_id=5895&';
        var currentURL = "https://hollis.harvard.edu/primo-explore/fulldisplay?docid="; 
        var currentURLtail = "&vid=HVD2&search_scope=default_scope&tab=default_tab&lang=en_US";    
        vm.$onInit=function () {


                    // report a problem
                    
                    // console.log(vm.parentCtrl);
                    // console.log('******************************** prm-action-list-after.js');
                    // console.log(vm.parentCtrl.actionLabelNamesMap);
                    // console.log(Object.keys(vm.parentCtrl.actionLabelNamesMap).length);
                    vm.parentCtrl.actionLabelNamesMap["report_a_problem"] = "Report a Problem";
                    vm.parentCtrl.actionIconNamesMap["report_a_problem"] = "report_a_problem";
                    vm.parentCtrl.actionIcons["report_a_problem"] = {
                        icon: "ic_report_problem_24px",
                        iconSet: "action",
                        type: "svg"
                      };
                      if (!vm.parentCtrl.actionListService.actionsToIndex["report_a_problem"]) {
                        vm.parentCtrl.actionListService.requiredActionsList.push("report_a_problem");
                        vm.parentCtrl.actionListService.actionsToDisplay.push("report_a_problem");
                        vm.parentCtrl.actionListService.actionsToIndex["report_a_problem"] = 9;
                      } 
                      
                      var primoContext = '&context=' + vm.parentCtrl.item.context[0];
                      if (vm.parentCtrl.item.context[0] === 'P') {
                        primoContext = '&context=PC';
                      }
                      //console.log(primoContext);

                      var nativePerma = vm.parentCtrl.item.pnx.control.recordid[0];    
                      //console.log(nativePerma);
                      if (nativePerma.includes("dedup")) {                        
                        nativePerma = vm.parentCtrl.item.pnx.control.sourceid[0].substring(16);
                      }                      
                      //console.log(currentURL+nativePerma+currentURLtail+primoContext);
                      url+='referrer='+currentURL+nativePerma+currentURLtail+primoContext;  
                      if (vm.parentCtrl.actionListService.onToggle) {
                        vm.parentCtrl.actionListService.onToggle["report_a_problem"] = function () {
                          window.open(url, '_blank');
                        };
                      }
                      if (vm.parentCtrl.onToggle) {
                        vm.parentCtrl.onToggle["report_a_problem"] = function () {
                          window.open(url, '_blank');
                        };
                      }
                      // let bullhorn = document.getElementById('report_a_problemButton');
                      // let position = 'beforeend';
                      // bullhorn.insertAdjacentHTML(position, '<img src="/primo-explore/custom/HVD2/img/ic_bullhorn_24px.svg"></img>')
                      // let rptButton = document.getElementById('report_a_problemButton');
                      // var bullhorn = document.createElement("img");
                      // bullhorn.setAttribute('src','/primo-explore/custom/HVD2/img/ic_bullhorn_24px.svg');
                      // console.log(rptButton);
                      // console.log(bullhorn);
                      // let rptImg = document.querySelectorAll("md-icon[md-svg-icon^='action:ic_bullhorn_24px']");
                      // console.log(rptImg);
                      // document.querySelectorAll("md-icon[md-svg-icon^='action:ic_bullhorn_24px']").insertAdjacentHTML('afterbegin', '<span>test</span>');
                      
        
        
                    // end report a problem                

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

