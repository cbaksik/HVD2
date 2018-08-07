/**
 * Created by samsan on 7/17/17.
 */

angular.module('viewCustom')
    .controller('customViewAllComponentMetadataController', [ '$sce','$element','$location','prmSearchService','$window','$stateParams','$timeout','customMapXmlKeys','$mdMedia','customMapXmlValues', function ($sce, $element,$location, prmSearchService, $window, $stateParams, $timeout, customMapXmlKeys, $mdMedia, customMapXmlValues) {

        var vm = this;
        var sv=prmSearchService;
        var cMap=customMapXmlKeys;
        var cMapValue=customMapXmlValues;
        vm.params=$location.search();
        // get ui-router parameters
        vm.context=$stateParams.context;
        vm.docid=$stateParams.docid;

        vm.toggleData={'icon':'ic_remove_black_24px.svg','flag':false};
        vm.xmldata=[];
        vm.keys=[];
        vm.items={};

        vm.toggle=function () {
          if(vm.toggleData.flag) {
              vm.toggleData.icon='ic_remove_black_24px.svg';
              vm.toggleData.flag=false;
          } else {
              vm.toggleData.icon='ic_add_black_24px.svg';
              vm.toggleData.flag=true;
          }
        };

        // ajax call to get data
        vm.getData=function () {
          var restUrl=vm.parentCtrl.searchService.cheetah.restUrl+'/'+vm.context+'/'+vm.docid;
          var params={'vid':'HVD_IMAGES','lang':'en_US','search_scope':'default_scope','adaptor':'Local Search Engine'}
          params.vid=vm.params.vid;
          params.lang=vm.params.lang;
          params.search_scope=vm.params.search_scope;
          params.adaptor=vm.params.adaptor;
          sv.getAjax(restUrl,params,'get')
              .then(function (result) {
                  vm.items=result.data;
                  if(vm.items.pnx.addata) {
                      var result = sv.parseXml(vm.items.pnx.addata.mis1[0]);
                      if(result.work) {
                          vm.xmldata = result.work[0];
                          if(vm.items.pnx.display) {
                              vm.keys = Object.keys(vm.items.pnx.display);
                              var removeKeys = cMap.getRemoveList();
                              for (var i = 0; i < removeKeys.length; i++) {
                                  var key = removeKeys[i];
                                  var index = vm.keys.indexOf(key);
                                  if (index !== -1) {
                                      vm.keys.splice(index, 1);
                                  }
                              }
                              vm.keys=cMap.sort(vm.keys);
                          }
                      }

                  }

              },function (err) {
                  console.log(err);
              })

        };

        // get json key
        vm.getKeys=function (obj) {
            var keys=Object.keys(obj);
            var removeList = cMap.getRemoveList();
            for(var i=0; i < removeList.length; i++) {
                var key=removeList[i];
                var index = keys.indexOf(key);
                if (index !== -1) {
                    // remove image from the list
                    keys.splice(index, 1);
                }
            }
            return cMap.getOrderList(keys);
        };

        // get json value base on dynamic key
        vm.getValue=function (obj,key) {
            var values = cMapValue.getValue(obj,key);
            return values;
        };

        // show the pop up image
        vm.gotoFullPhoto=function (index,data) {
            var filename='';
            if(data.image){
                var urlList = data.image[0]._attr.href._value;
                urlList = urlList.split('/');
                if(urlList.length >=3) {
                    filename = urlList[3];
                }
            } else if(data._attr) {
                filename = data._attr.componentID._value;
            }

            // go to full display page
            var url='/primo-explore/viewcomponent/'+vm.context+'/'+vm.docid + '?vid='+vm.params.vid +'&imageId='+filename;
            if(vm.params.adaptor) {
                url+='&adaptor='+vm.params.adaptor;
            }

            $window.open(url,'_blank');
        };

        vm.$onInit=function() {
            vm.parentCtrl.bannerTitle='FULL IMAGE COMPONENT METADATA';
            // hide search bar
            let searchBar = document.getElementsByTagName('prm-search-bar')[0];
            if(searchBar) {
                searchBar.style.display='none';
            }
            // hide top bar
            let topBar = document.getElementsByTagName('prm-topbar')[0];
            if(topBar) {
                topBar.style.display='none';
            }

            vm.getData();

        };

    }]);


angular.module('viewCustom')
    .component('customViewAllComponentMetadata', {
        bindings: {parentCtrl: '<'},
        controller: 'customViewAllComponentMetadataController',
        controllerAs:'vm',
        'templateUrl':'/primo-explore/custom/HVD2/html/custom-view-all-component-metadata.html'
    });

