/**
 * Created by samsan on 9/13/17.
 */

angular.module('viewCustom')
    .service('customMapService',[function () {
        var serviceObj={};
        serviceObj.getRegexMatches=function(string, regex, index) {
            index || (index = 1); // default to the first capturing group
            var matches = [];
            var match;
            while (match = regex.exec(string)) {
                matches.push(match[index]);
            }
            return matches;
        };

        serviceObj.buildCoordinatesArray=function (inputString) {
            var coordinates;
            //Populate array with Minutes format converstion
            if (RegExp(/\$\$D([a-zA-Z])/).test(inputString)) {
                coordinates = serviceObj.getRegexMatches(inputString, /\$\$[DEFG](.{8})/g);
                for (var i = 0; i < coordinates.length; i++) {
                    var hemisphere = coordinates[i].substr(0, 1);
                    var degrees = parseInt(coordinates[i].substr(1, 3));
                    var minutes = parseInt(coordinates[i].substr(4, 2));
                    var seconds = parseInt(coordinates[i].substr(6, 2));

                    var decimalValue;
                    if (hemisphere == "N" || hemisphere == "E")
                        coordinates[i] = degrees + ((minutes + (seconds / 60)) / 60);
                    else
                        coordinates[i] = 0 - (degrees + ((minutes + (seconds / 60)) / 60));


                }
            }

            //Populate array with Degrees values
            else if (RegExp(/\$\$D(\d|-)/).test(inputString)) {
                coordinates = serviceObj.getRegexMatches(inputString, /\$\$\w([\d\.-]+)/g);
            }

            //Round the numbers to 6 decimal points
            if(coordinates) {
                for (var i = 0; i < coordinates.length; i++) {
                    coordinates[i] = (Math.round(coordinates[i] * 1000000) / 1000000);
                }
            }
            return coordinates;

        };

        return serviceObj;
    }]);

