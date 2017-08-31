/**
 * Created by samsan on 7/18/17.
 * This is a service component and use to store data, get data, ajax call, compare any logic.
 */

angular.module('viewCustom')
    .service('customService',['$http',function ($http) {
        var serviceObj={};

        serviceObj.getAjax=function (url,param,methodType) {
            return $http({
                'method':methodType,
                'url':url,
                'params':param
            })
        };

        serviceObj.postAjax=function (url,jsonObj) {
            return $http({
                'method':'post',
                'url':url,
                'data':jsonObj
            })
        };


        return serviceObj;
    }]);
