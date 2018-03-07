/**
 * Created by samsan on 9/20/17.
 */


angular.module('viewCustom')
    .service('customHathiTrustService',['$http',function ($http) {
        var serviceObj={};

        serviceObj.doGet=function (url,param) {
            return $http({
                'method':'get',
                'url':url,
                'timeout':5000,
                'params':param
            })
        };

        serviceObj.doPost=function (url,param) {
            return $http({
                'method':'post',
                'url':url,
                'timeout':5000,
                'data':param
            })
        };


        serviceObj.validateHathiTrust=function (pnxItem) {
          var item={'flag':false,'isbn':'','oclcid':'','data':{}};
          if(pnxItem.pnx.control.sourceid && pnxItem.pnx.delivery.delcategory && pnxItem.pnx.addata) {
              if (pnxItem.pnx.control.sourceid[0] === '01HVD_ALMA' && pnxItem.pnx.delivery.delcategory[0] !== 'Online Resource') {
                  item.flag = true;
                  if(pnxItem.pnx.addata.oclcid) {
                      item.oclcid=pnxItem.pnx.addata.oclcid[0];
                  } else if(pnxItem.pnx.addata.isbn){
                      item.isbn=pnxItem.pnx.addata.isbn[0];
                  }
              }
          }
          return item;
        };

        // validate if orig data is harvard
        serviceObj.validateHarvard=function (arrList) {
          var item={};
          for(var i=0; i < arrList.length; i++) {
              if(arrList[i].orig==='Harvard University' && arrList[i].usRightsString==='Full view') {
                item=arrList[i];
                item.huflag=true;
                item.fullview=true;
                i=arrList.length;
              } else if(arrList[i].usRightsString==='Full view') {
                  item=arrList[i];
                  item.huflag=false;
                  item.fullview=true;
                  i=arrList.length;
              } else if(arrList[i].usRightsString==='Limited (search-only)') {
                  item=arrList[i];
                  item.huflag=false;
                  item.fullview=false;
                  i=arrList.length;
              }
          }
          return item;
        };

        return serviceObj;
    }]);

