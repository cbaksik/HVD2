/**
 * Created by samsan on 8/7/17.
 * This service is used for Digital Bookplates
 */

(function () {
    'use strict';

    angular.module('viewCustom')
    .service('customImagesService',[function () {
        let serviceObj={};

        // validate url start with $$U and contain $$D, then return new item list
        serviceObj.extractImageUrl=(item, recordLinks)=> {
            let itemList=[];
            if(item.pnx.links) {
                let lln02=item.pnx.links.lln02;
                let k=0;
                if(lln02) {
                    for (let i = 0; i < lln02.length; i++) {
                        let patternUrl = /^(\$\$U)/;
                        let patternWord = /(\$\$D)/;
                        let url = lln02[i];
                        if (patternUrl.test(url) && patternWord.test(url)) {
                            let newStr = url.split(' ');
                            newStr = newStr[0];
                            let newUrl = newStr.substring(3, newStr.length);

                            for (let j = 0; j < recordLinks.length; j++) {
                                let record = recordLinks[j];
                                let linkURL = record.linkURL;
                                if (linkURL) {
                                    linkURL = linkURL.trim(' ');
                                    newUrl = newUrl.trim(' ');
                                    if (newUrl === linkURL) {
                                        // replace old url with word EBKPLL with EBKPLT
                                        linkURL = linkURL.replace(/(EBKPLL)/, 'EBKPLT');
                                        record.linkNewURL = linkURL + '?width=155&height=205';
                                        itemList[k] = record;
                                        k++;
                                        j = recordLinks.length;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return itemList;
        };

        // remove json object from json array
        serviceObj.removeMatchItems=(arrayList, targetList)=> {
            let itemsList=[];
            if(arrayList.length > 0 && targetList.length > 0) {
                for (let i = 0; i < arrayList.length; i++) {
                    let arr=arrayList[i];
                    let flag=true;
                    // find item that match
                    for(let k=0; k < targetList.length; k++) {
                        let target=targetList[k];
                        if(arr['@id']===target['@id']) {
                            flag=false;
                            k=targetList.length;
                        }
                    }
                    // push item into list if it is not match
                    if(flag) {
                        itemsList.push(arr);
                    }
                }
            }
            return itemsList;
        };

        return serviceObj;
    }]);

})();