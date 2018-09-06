/**
 * Created by samsan on 9/5/18.
 */

angular.module('viewCustom')
    .service('customConfig',[function () {
        let primo={};
        primo.param={'vid':'HVD2'};

        primo.getParam=function () {
            return primo.param;
        };

        return primo;

    }]);
