/**
 * Created by samsan on 9/20/17.
 */

angular.module('viewCustom')

    .service('customHathiTrustService',['$http',function ($http) {
        var serviceObj={};

        /* bypassing primo-services app 2021-02-22, calling hathi directly */
        serviceObj.doGet=function (isbn,oclc) {                 
            if (isbn) {
                return $http({
                    method: 'GET',
                    headers: {
                        'Token': undefined
                      },
                    url: 'https://catalog.hathitrust.org/api/volumes/brief/isbn/'+isbn+'.json', 
                    timeout:5000               
                })   
            } else if (oclc) {
                return $http({
                    method: 'GET',
                    headers: {
                        'Token': undefined
                      },
                    url: 'https://catalog.hathitrust.org/api/volumes/brief/oclc/'+oclc+'.json', 
                    timeout:5000                  
                })                  
            };
        }; 

        /* the call to this function has been commented out in prm-search-result-availability-line-after.js
            because we're now bypassing primo-services app for hathitrust  */
        serviceObj.doPost=function (url,param) {
            return $http({
                'method':'post',
                'url':url,
                'timeout':5000,
                'data':param
            })
        };

        /* test whether we want to call Hathi API, and if so, grab params we want to send */
        serviceObj.validateHathiTrust=function (pnxItem) {
          var item={'flag':false,'isbn':'','oclcid':'','data':{}};
          if(pnxItem.pnx.control.sourceid && pnxItem.pnx.delivery.delcategory && pnxItem.pnx.addata) {
              if (pnxItem.pnx.control.sourceid[0] === '01HVD_ALMA' && pnxItem.pnx.delivery.delcategory[0] !== 'Online Resource' && pnxItem.pnx.delivery.delcategory[0] !== 'Alma-E' && pnxItem.pnx.delivery.delcategory[0] !== 'Alma-D') {
                  item.flag = true;
                  if(pnxItem.pnx.addata.oclcid) {
                      item.oclcid=pnxItem.pnx.addata.oclcid[0];
                  }
                  if(pnxItem.pnx.addata.isbn){
                      item.isbn=pnxItem.pnx.addata.isbn[0];
                  }
              }
          }
          return item;
        };

        // validate if orig data is harvard, if so, present our copy, otherwise present any full-view, else limited search
        serviceObj.validateHarvard=function (arrList) {
            //console.log(arrList);
            //console.log("review content of what hathi api returned to check for full view or limited search");
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

