/**
 * Created by samsan on 10/13/17.
 */
angular.module('viewCustom')
    .service('customMapXmlValues',[function () {
        var serviceObj = {};

        // get relatedInformation value
        serviceObj.getRelatedInformation=function (elementArray) {
            var str='';
            var elementInstance = Object.keys(elementArray);
            if(elementInstance.length > 0) {
                for(var i=0; i < elementInstance.length; i++) {
                    var nodeInstance=elementInstance[i];
                    var nodeObject=elementArray[nodeInstance];
                    for (let j=0; j<nodeInstance.length; j+=1) {
                        if( nodeObject.link !== undefined) {
                            str += "<a href='" + nodeObject.link[0]._text + "' target='_blank' />";
                            str += str + nodeObject.text[0]._text + "</a>";
                        } else {
                            str = str+nodeObject.text[0]._text+"<br />";
                        }       
                    }                        
                }
            }
            return str;
        };


        // get associatedName value
        serviceObj.getAssociatedName = function (nodeValue) {
            var result = '';
        
            function processNodeValues(values) {
                var name = Array.isArray(values.nameElement) ? values.nameElement[0]._text : values.nameElement;
                var dates = Array.isArray(values.dates) ? ', ' + values.dates[0]._text : values.dates;
                var role = Array.isArray(values.role) ? ' [' + values.role[0]._text + ']' : values.role;
        
                return name + (dates || '') + (role || '') + '<br/>';
            }
        
            if (nodeValue && typeof nodeValue === 'object') {
                if (Array.isArray(nodeValue)) {
                    for (var i = 0; i < nodeValue.length; i++) {
                        result += processNodeValues(nodeValue[i]);
                    }
                } else {
                    result += processNodeValues(nodeValue);
                }
            }
        
            if (result) {
                result = result.replace(/<br\/>$/, '');
            }
        
            return result;
        };
        

        // get image ID
        serviceObj.getAttr=function (nodeValue) {
            var str='';
            var keys = Object.keys(nodeValue);
            if(keys.length > 0) {
                var index = keys.indexOf('componentID');
                if(index !== -1) {
                    var componentID = nodeValue['componentID'];
                    if(typeof(componentID)==='object' && componentID!==null) {
                        componentID = componentID['_value'];
                    }
                    str=componentID;
                }

            }
            return str;
        };

        // get topic
        serviceObj.getTopic=function (nodeValue) {
            var str='';
            var keys = Object.keys(nodeValue);
            if(keys.length > 0) {
                for(var i=0; i < keys.length; i++) {
                    var nodeKey=keys[i];
                    var values=nodeValue[nodeKey];
                    if(typeof(values)==='object' && values!==null) {
                        var nodeKeys2=Object.keys(values);
                        for(var k=0; k < nodeKeys2.length; k++) {
                            var nodekey3=nodeKeys2[k];
                            if(nodekey3) {
                                var values2 = values[nodekey3];
                                if(typeof(values2)==='object' && values2!==null) {
                                    var nodekeys4 = Object.keys(values2);
                                    if(nodekeys4) {
                                        var values3=values2[nodekeys4];
                                        if(typeof(values3)==='object' && values3!==null) {
                                            var nodeKeys5=Object.keys(values3);
                                            for (var c = 0; c < nodeKeys5.length; c++) {
                                                var nodekey5 = nodeKeys5[c];
                                                if(values3[nodekey5]) {
                                                    str += values3[nodekey5] + ';&nbsp;';
                                                }
                                            }
                                        } else if(values3) {
                                            str+=values3 +';&nbsp;';
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        str+=values;
                    }
                }

            }
            if(str) {
                str=str.replace(/;&nbsp;$/,'');
            }
            return str;
        };

        // get notes and any other elements that don't have subelements, only values
        serviceObj.getNotesEtc=function (elementArray) {
            var str='';
            var elementInstance = Object.keys(elementArray);
            if(elementInstance.length > 0) {
                for(var i=0; i < elementInstance.length; i++) {
                    var nodeInstance=elementInstance[i];
                    var nodeObject=elementArray[nodeInstance];
                    for (let j=0; j<nodeInstance.length; j+=1) {
                            str = str+nodeObject._text+"<br />";
                    }                        
                }
            }
            return str;
        };

        // title and multiple values including display of title type if present
            serviceObj.getTitle=function (elementArray) {
            var str='';
            var elementInstance = Object.keys(elementArray);
            if(elementInstance.length > 0) {
                for(var i=0; i < elementInstance.length; i++) {
                    var nodeInstance=elementInstance[i];
                    var nodeObject=elementArray[nodeInstance];
                    for (let j=0; j<nodeInstance.length; j+=1) {
                        if( nodeObject.type !== undefined) {
                            str += nodeObject.type[0]._text + ": ";
                        }
                        str = str+nodeObject.textElement[0]._text+"<br />";
                    }                        
                }
            }
            return str;
        };

         // get relatedWork
        serviceObj.getRelatedWork=function (nodeValue) {
            var str='';
            var keys = Object.keys(nodeValue);
            if(keys.length > 0) {
                for(var i=0; i < keys.length; i++) {
                    var nodeKey=keys[i];
                    var values=nodeValue[nodeKey];
                    if(values) {
                        var nodeKeys=Object.keys(values);
                        if(typeof(nodeKeys)==='object' && nodeKeys!==null) {
                            for(var k=0; k < nodeKeys.length; k++) {
                                var key2=nodeKeys[k];
                                if(key2) {
                                    var values2=values[key2];
                                    if(typeof(values2)==='object' && values2!==null) {
                                        var nodeKeys2=Object.keys(values2);
                                        if(typeof(nodeKeys2)==='object' && nodeKeys2!==null) {
                                            for(var c=0; c < nodeKeys2.length; c++) {
                                                var key3=nodeKeys2[c];
                                                if(key3) {
                                                    var values3=values2[key3];
                                                    if(typeof(values3)==='object' && values3!==null) {
                                                        var nodeKeys3=Object.keys(values3);
                                                        for(var j=0; j < nodeKeys3.length; j++) {
                                                            var key4=nodeKeys3[j];
                                                            var values4=values3[key4];
                                                            if(values4) {
                                                                str+=values4+'<br/>';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else if(values2[nodeKeys2]) {
                                            str+=values2[nodeKeys2] + '<br/>';
                                        }
                                    } else if(values2) {
                                        str += values2 + '<br/>';
                                    }
                                }
                            }
                        } else if(values) {
                            str+=values+'<br/>';
                        }
                    }
                }

            }

            if(str){
                str=str.replace(/<br\/>$/,'');
            }
            return str;
        };

        // get xml node value
        serviceObj.getValue=function (values, key) {
            var text='';
            if(typeof(values)==='object'){
                switch(key) {
                    case 'title':    
                        text = serviceObj.getTitle(values);
                        break;
                    case 'hvd_relatedInformation':
                    case 'relatedInformation':
                        text = serviceObj.getRelatedInformation(values);
                        break;
                    case 'creator':
                    case 'hvd_creator':
                    case 'hvd_associatedName':
                    case 'associatedName':
                        text = serviceObj.getAssociatedName(values);
                        break;
                    case '_attr':
                        text = serviceObj.getAttr(values);
                        break;
                    case 'hvd_relatedWork':
                    case 'relatedWork':
                        text = serviceObj.getRelatedWork(values);
                        break;
                    case 'hvd_topic':
                    case 'topic':
                        text = serviceObj.getTopic(values);
                        break;
                    case 'notes':
                    case 'workType':    
                    case 'description':    
                        text = serviceObj.getNotesEtc(values);
                        break;
                    default:
                        text = serviceObj.getOtherValue(values,key);
                        break;
                }

            } else {
                text=values;
            }
            return text;
        };

        // get json value base on dynamic key
        serviceObj.getOtherValue=function (obj,key) {
            var text='';
            if(typeof(obj)==='object' && obj !== null) {
                if(Array.isArray(obj)) {
                    obj=obj[0];
                }
                var keys = Object.keys(obj);
                for(var k=0; k < keys.length; k++) {
                    var nodeKey=keys[k];
                    if(nodeKey) {
                        var nodeValue=obj[nodeKey];

                        if(Array.isArray(nodeValue)) {
                            nodeValue=nodeValue[0];
                        }
                        if(typeof(nodeValue)==='object' && nodeValue !== null) {

                            if(Array.isArray(nodeValue)) {
                                for(var i=0; i < nodeValue.length; i++) {
                                    var data=nodeValue[i];
                                    if(typeof(data)==='object' && data !== null) {
                                        if(Array.isArray(data)) {
                                            for(var j=0; j < data.length; j++) {
                                                var data2=data[j];
                                                if(typeof(data2)==='object' && data2 !== null){
                                                    if(Array.isArray(data2)) {
                                                        for(var c=0; c < data2.length; c++) {
                                                            var data3=data2[c];
                                                            if(typeof(data3)==='object' && data3 !== null) {
                                                                if(Array.isArray(data3)) {
                                                                    for(var w=0; w < data3.length; w++) {
                                                                        var data4=data3[w];
                                                                        if(typeof(data4)==='object' && data4!==null) {
                                                                            if(data4[0]) {
                                                                                text += data4[0] + '&nbsp;';
                                                                            }
                                                                        } else if(data4) {
                                                                            text+=data4 + '&nbsp;';
                                                                        }
                                                                    }
                                                                }
                                                            } else if(data3) {
                                                                text+=data3 + '&nbsp;';
                                                            }
                                                        }
                                                    }
                                                } else if(data2) {
                                                    text+=data2 + '&nbsp;';
                                                }
                                            }
                                        } else  {
                                            var subNodeKeys=Object.keys(data);
                                            if(Array.isArray(subNodeKeys)) {
                                                for(var b=0; b < subNodeKeys.length; b++) {
                                                    var key2=subNodeKeys[b];
                                                    if(typeof(key2)==='object' && key2 !== null) {
                                                        if(Array.isArray(key2)) {
                                                            for(var c=0; c < key2.length; c++){
                                                                var key3=key2[c];
                                                                if(typeof(key3)==='object' && key3!==null) {
                                                                    if(Array.isArray(key3)) {
                                                                        for(var x=0; x < key3.length; x++) {
                                                                            var key4=key3[x];
                                                                            if(typeof(key4)==='object' && key4!==null) {
                                                                                if(data[key4][0]) {
                                                                                    text += data[key4][0] + '&nbsp;';
                                                                                }
                                                                            } else if(data[key4]) {
                                                                                text+=data[key4] + '&nbsp;';
                                                                            }
                                                                        }
                                                                    }
                                                                } else if(data[key3]) {
                                                                    text+=data[key3] + '&nbsp;';
                                                                }
                                                            }
                                                        }
                                                    } else if(key2) {
                                                        if(data[key2]) {
                                                            text += data[key2] + '&nbsp;';
                                                        }
                                                    }
                                                }
                                            } else if(data[subNodeKeys]) {
                                                text+=data[subNodeKeys] + '&nbsp;';
                                            }
                                        }
                                    } else {
                                        text+=data;
                                    }
                                }
                            } else if(nodeKey) {
                                var nodeKey2=Object.keys(nodeValue);
                                if(typeof(nodeKey2)==='object' && nodeKey2 !== null) {
                                    if(Array.isArray(nodeKey2)) {
                                        for(var c=0; c < nodeKey2.length; c++) {
                                            var nodeKey3=nodeKey2[c];
                                            if(nodeKey3) {
                                                var nodeValue3 = nodeValue[nodeKey3];
                                                if(Array.isArray(nodeValue3)) {
                                                    nodeValue3 = nodeValue3[0];
                                                }

                                                if(typeof(nodeValue3)==='object' && nodeValue3 !== null) {
                                                    var nodeKey4 = Object.keys(nodeValue3);
                                                    if(Array.isArray(nodeKey4)) {
                                                        for (var b = 0; b < nodeKey4.length; b++) {
                                                            var nodeKey5 = nodeKey4[b];
                                                            if (nodeKey5) {
                                                                if(nodeValue3[nodeKey5]) {
                                                                    text += nodeValue3[nodeKey5] + '&nbsp;';
                                                                }
                                                            }
                                                        }
                                                    } else if(nodeValue3[nodeKey4]) {
                                                        text += nodeValue3[nodeKey4] + '&nbsp;';
                                                    }
                                                } else if(nodeValue3) {
                                                    text += nodeValue3 + '&nbsp;';
                                                }
                                            }
                                        }
                                    }
                                } else if(nodeKey2) {
                                    if(nodeValue[nodeKey2]) {
                                        text += nodeValue[nodeKey2] + '&nbsp;';
                                    }
                                }
                            }
                        } else if(nodeValue) {
                            text+=nodeValue + '&nbsp;';
                        }
                    }
                }
            } else {
                text=obj;
            }

            return text;
        };

        return serviceObj;
    }]);
