/**
 * Created by samsan on 7/18/17.
 * This is a service component and use to store data, get data, ajax call, compare any logic.
 */

angular.module('viewCustom')
    .service('customService',['$http','$sce','$window',function ($http, $sce,$window) {
        var serviceObj={};

        // get environment to run config.html
        serviceObj.getEnv=function () {
            var host = $window.location.hostname;
            var config='config-prod.html';
            if(host.toLowerCase()==='localhost'){
                config='config-local.html';
            } else if(host.toLowerCase()==='harvard-primoalma-stage.hosted.exlibrisgroup.com'||host.toLowerCase()==='qa.hollis.harvard.edu') {
                config='config-dev.html';
            }

            return config;
        };

        serviceObj.getAjax=function (url,param,methodType) {
            return $http({
                'method':methodType,
                'url':url,
                'params':param
            })
        };

        serviceObj.postAjax=function (url,jsonObj) {
            // pass primo token to header with value call token
            $http.defaults.headers.common.token=jsonObj.token;
            return $http({
                'method':'post',
                'url':url,
                'data':jsonObj
            })
        };

        // setter and getter for text msg data
        serviceObj.textData={};
        serviceObj.setTextData=function (data) {
            serviceObj.textData=data;
        };

        serviceObj.getTextData=function () {
            return serviceObj.textData;
        };

        // action list selected
        serviceObj.actionName='none';
        serviceObj.setActionName=function (actionName) {
            serviceObj.actionName=actionName;
        };
        serviceObj.getActionName=function () {
            return serviceObj.actionName;
        };

        // setter and getter
        serviceObj.items={};
        serviceObj.setItems=function (data) {
            serviceObj.items=data;
        };
        serviceObj.getItems=function () {
            return serviceObj.items;
        };

        // replace & . It cause error in firefox;
        serviceObj.removeInvalidString=function (str) {
            var pattern = /[\&]/g;
            return str.replace(pattern, '&amp;');
        };

        //parse xml
        serviceObj.convertXML=function (str) {
            var listItems=[];
            str=serviceObj.removeInvalidString(str);
            var xmldata=xmlToJSON.parseString(str);
            if(xmldata.requestlinkconfig) {
                listItems=xmldata.requestlinkconfig[0].mainlocationcode;
            }

            return listItems;
        };

        // setter and getter for library list data logic from xml file
        serviceObj.logicList=[];
        serviceObj.setLogicList=function (arr) {
            serviceObj.logicList=arr;
        };

        serviceObj.getLogicList=function () {
            return serviceObj.logicList;
        };

        // compare logic
        serviceObj.getLocation=function (currLoc) {
            var item='';
            for (var i = 0; i < serviceObj.logicList.length; i++) {
                var data = serviceObj.logicList[i];
                if (data._attr.id._value === currLoc.location.mainLocation) {
                    item = data;
                    i = serviceObj.logicList.length;
                }
            }

            return item;
        };

        // setter and getter for parent locations data
        serviceObj.parentData={};
        serviceObj.setParentData=function (data) {
            serviceObj.parentData=data;
        };
        serviceObj.getParentData=function () {
            return serviceObj.parentData;
        };

        serviceObj.auth={};
        serviceObj.setAuth=function (data) {
            serviceObj.auth=data;
        };

        serviceObj.getAuth=function () {
           return serviceObj.auth;
        };

        // get url api from config.html file
        serviceObj.api={};
        serviceObj.setApi=function (data) {
            serviceObj.api=data;
        };

        serviceObj.getApi=function () {
            return serviceObj.api;
        };

        // when user click on advanced search from browse page
        serviceObj.advancedSearch=false;
        serviceObj.setAdvancedSearch=function (flag) {
            serviceObj.advancedSearch=flag;
        };
        serviceObj.getAdvancedSearch=function () {
            return serviceObj.advancedSearch;
        };

        return serviceObj;
    }]);
