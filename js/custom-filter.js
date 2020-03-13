/**
 * Created by samsan on 3/20/18.
 */


(function () {

    // custom filter to remove $$U infront of url in pnx.links
    angular.module('viewCustom').filter('urlFilter',function () {
        return function (url) {
            var newUrl='';
            var pattern=/^(\$\$U)/;
            if(url){
                newUrl=url[0];
                if(pattern.test(newUrl)){
                    newUrl = newUrl.substring(3,newUrl.length);
                }
            }

            return newUrl;
        }

    });


    // extract [6 images] from pnx.display.lds28 field
    angular.module('viewCustom').filter('countFilter',function () {
        return function (qty) {
            var nums='';
            var pattern=/[\[\]]+/g;
            if(qty){
                nums=qty.replace(pattern,'');
            }

            return nums;
        }

    });

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


    // truncate word to limit 60 characters
    angular.module('viewCustom').filter('mapXmlFilter',['customMapXmlKeys',function (customMapXmlKeys) {
        var cMap=customMapXmlKeys;
        return function (key) {
            var newKey=cMap.mapKey(key);
            return newKey.charAt(0).toUpperCase() + newKey.slice(1);
        }

    }]);


})();
