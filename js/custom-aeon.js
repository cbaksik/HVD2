/**
 * Created by samsan on 2/8/18.
 * This component get aeon (alma) data by passing mss_id in rest url
 */

angular.module('viewCustom')
    .controller('customAeonCtrl',['customService','$scope',function (customService, $scope) {
        var sv=customService;
        var vm=this;
        vm.api=sv.getApi();
        vm.dataList=[];
        vm.holdingItems=[];
        vm.ajaxLoader=false;
        vm.$onInit=()=> {
            // hide top bar and search box
            let prmTopbar=document.getElementsByTagName('prm-topbar')[0];
            if(prmTopbar){
                prmTopbar.style.display='none';
            }
            let prmSearchBar=document.getElementsByTagName('prm-search-bar')[0];
            if(prmSearchBar){
                prmSearchBar.style.display='none';
            }

            // get question mark parameters
            vm.params=vm.parentCtrl.$location.$$search;
            // watch for api variable changing
            $scope.$watch('vm.api.aeonApiUrl',()=> {
                vm.getData();
            });


        };

        // build url to send to aeon
        var buildUrl=function (data,item) {
            let url='https://aeon.hul.harvard.edu/remoteauth/aeon.dll?action=10&form=30&sid=Via AEON';
            let keyList=Object.keys(data);
            for(let key of keyList) {
                if (key==='callNumber') {
                    url += '&callnum=' + data[key];
                }
                if (key==='libraryCode') {
                    url += '&sublib=' + data[key];
                }
                if (key==='locationCode') {
                    url += '&collection=' + data[key];
                }
            }

            if (item.description) {
                url += '&description=' + item.description;
            }
            if (item.barCode) {
                url += '&barcode=' + item.barCode;
            }

            keyList = Object.keys(vm.dataList);
            for(let key of keyList) {
                if (key==='author' || key==='title' || key==='genre' || key==='publisher') {
                    url += '&'+key+'=' + vm.dataList[key];
                }
                if(key==='mmsId') {
                    url += '&hollisnum='+vm.dataList[key];
                }
            }

            return url;
        };

        vm.$doCheck=()=>{
            // get config-dev.html api url from prm-topbar-after.js
            vm.api=sv.getApi();
        };

        // get data from primo-service
        vm.getData=()=>{
            if(vm.api.aeonApiUrl && vm.params) {
                vm.ajaxLoader=true;
                let url = vm.api.aeonApiUrl + '/' + vm.params['rft.local_attribute'];
                sv.getAjax(url, '', 'get')
                    .then((res) => {
                        let data=res.data;
                        vm.dataList=data;
                        vm.ajaxLoader=false;
                        if(data.holdingItems) {
                            vm.holdingItems = data.holdingItems;
                        }
                        },
                        (err) => {
                            console.log(err);
                            vm.ajaxLoader=false;
                        }
                    )
            }
        };

        // open a new window when a user click on the link
        vm.goto=(data,item)=>{
            let url = buildUrl(data,item);
            window.open(encodeURI(url),'_blank');
        };

        // when a user press enter, call this function
        vm.pressLink=(e,data,item)=>{
            if(e.which===13) {
                vm.goto(data,item);
            }
        }

    }]);

angular.module('viewCustom')
    .component('customAeon',{
        bindings:{parentCtrl:'<'},
        controller: 'customAeonCtrl',
        controllerAs:'vm',
        templateUrl:'/primo-explore/custom/01HVD/html/custom-aeon.html'
    });