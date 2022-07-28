/**
 * Created by cbaksik 20220727 based on Sam San's text sms file
 */


angular.module('viewCustom')
    .controller('customReportProblemActionCrtl',['customService',function (customService) {
        var vm=this;
        var cs=customService;
        var currentURL = '';        
        vm.sendReportProblemAction=function () {
            var url='http://nrs.harvard.edu/urn-3:HUL.ois:hollis-v2-feedback?';
            currentURL = encodeURIComponent(window.location.href);
            url+='referrer='+currentURL;            
            window.open(url, '_blank');
        }

    }]);

angular.module('viewCustom')
    .component('customReportProblemAction',{
        bindings:{parentCtrl:'<'},
        controller: 'customReportProblemActionCrtl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/HVD2/html/custom-report-problem-action.html'
    });
