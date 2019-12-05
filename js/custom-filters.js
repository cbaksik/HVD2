/**
 * Created by samsan on 3/21/18.
 * This custom filters are using with component to filter out data
 */


(function () {
    // truncate word to limit 60 characters
    angular.module('viewCustom').filter('truncatefilter',function () {
        return function (str) {
            var newstr=str;
            var index=45;
            if(str) {
                if (str.length > 45) {
                    newstr = str.substring(0, 45);
                    for (var i = newstr.length; i > 20; i--) {
                        var text = newstr.substring(i - 1, i);
                        if (text === ' ') {
                            index = i;
                            i = 20;
                        }
                    }
                    newstr = str.substring(0, index) + '...';

                }

            }

            return newstr;
        }
    });


})();
