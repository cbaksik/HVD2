// CB 20200417 turned this off, using flag in Alma config now for contrlling whethere direct linking happens for journals 
/* (function(){
'use strict';

    angular.module('viewCustom').controller('prmOpenJournalInFullController', [function () {
        var vm = this;
        vm.$onInit = function () {
        var resourceType = vm.parentCtrl.result.pnx.display.type[0] || '';
            if (resourceType === 'journal') {
                vm.parentCtrl.isDirectLink = function () {
                    return false;
                };
            }
        };
    }]);

    angular.module('viewCustom').component('prmOpenJournalInFull', {
        bindings: { parentCtrl: '<' },
        controller: 'prmOpenJournalInFullController'

    });
})();
 */