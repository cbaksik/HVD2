angular.module('viewCustom').controller('prmSmMoreRecords', ['$timeout', 'customService', '$q', 'prmSearchService', function ($timeout, customService, $q, prmSearchService) {
    /** IMPORTANT */
    /** this file was written for us by Stack Map in 2019 to support two important customizations */
    /** 1. if there are multiple participating libraries, show map it link for both (e.g. 990112632530203941/catalog  has law and wid */
    /** 2. if participating library is  not the one shown in the brief AVA summary line, still show a map it link, e.g. 990098601480203941 at toz and wid */
    /** a corresponding js file is also required */
    /** a corresponding js file is also required */
    
    /**
     * A starting point for clients to be able to affect and use additional records
     * in the brief record display.
     *
     * options
     * omitFirstResult  (Boolean)
     *  true: removes the first result from each holdings list - so far has always been
     *  a duplicate in brief testing.
     *  false: allows the possible duplicate to be displayed
     *
     * availableOnly  (Boolean)
     *  true: Filters results that do not have the status of available.
     *  NB: Overwrites vm.whitelist.statusCodes
     *
     * vm.whitelist (Object)
     *  string additions to the lists within each list will only display records
     *  that have the provided values corresponding
     *     libraryCodes  Array: codes that new primo internally uses to determine displayed name
     *     sublocations: codes that new primo internally uses to determine displayed name
     *     statusCodes: codes that new primo internally uses to determine displayed name
     *     _availableOnlyCodes: internally used for options.availablOnly flag
     *
     * Granular Filter Control Example:
     *  var options = {
     *      omitFirstResult: false,     true shows every record including duplicates, false omits the first record as
     *                                  often this is a duplicate. The default is left to false for testing on a per
     *                                  implementation basis.
     *
     *      availableOnly: false,       true filters to only use records with the corresponding codes in
     *                                  vm.whitelist._availableCodes. This will override other filters. false will
     *                                  attempt other filters.
     *
     *
     *      visible: false,             true to display records, false to visually hide them from brief record view.
     *                                  NOTE StackMap.js will handle reading the documents record data either way.
     *  };
     *
     *  vm.whitelist = {
     *      libraryCodes: ['WID', 'GEN', 'WIDLC']
     *      subLocations: ['GEN', 'Old Widener', 'LAM']
     *      statusCodes: ['available', 'available_at_institution','check_holdings', 'unavailable']
     *  };
    */
 
     var vm = this;
     
     var options = {
         omitFirstResult: true,
         availableOnly: false, 
         visible: false
     };
 
     vm.whitelist = {
         libraryCodes: [],
         subLocations: [],
         statusCodes: [],
         _availableCodes: ['available', 'available_at_institution'],
     };

    this.$onInit=function () { 
        vm.delivery = this.parentCtrl.result.delivery;
        if (vm.delivery.holding.length > 0) {
            vm.sm_holdings = vm.delivery.holding.map(function (entry, i) {
                entry.toTranslate = entry.libraryCode;
                entry.subLocation = entry.subLocation;
                entry.callNumber = entry.callNumber;
                entry.availabilityStatus = entry.availabilityStatus;
                entry.availability = vm.parentCtrl.getPlaceHolders(entry);
                entry.availabilityDisplay = function () {
                    // could not find hook to get display text, so this tries to leverage
                    // the built in translate directive that gets some of the display text but not all
                    return 'delivery.code.' + entry.availabilityStatus;
                };
                return entry;
            })
            .filter(function (entry, i) {
                if (options.omitFirstResult && i === 0) {
                    return false;
                }
                if (options.availableOnly && vm.whitelist._availableCodes.length > 0 && entry.availabilityStatus) {
                    if (!vm.whitelist._availableCodes.includes(entry.availabilityStatus)) return false;
                }
                if (vm.whitelist.libraryCodes.length > 0 && entry.libraryCode) {
                    if (!vm.whitelist.libraryCodes.includes(entry.libraryCode)) return false;
                }
                if (vm.whitelist.subLocations.length > 0 && entry.subLocation) {
                    if (!vm.whitelist.subLocations.includes(entry.subLocation)) return false;
                }
                if (vm.whitelist.statusCodes.length > 0 && entry.availabilityStatus) {
                    if (!vm.whitelist.statusCodes.includes(entry.availabilityStatus)) return false;
                }
                return true;
            });
        }
    };
 
     vm.onCustomLinkClick = function (availability) {
         // your link click code goes here.
         return false;
     };
 
     vm.getDisplay = function () {
         if (options.visible === false) {
             return 'none';
         }
         if (options.visible === true) {
             return 'block';
         }
     };
 }]);
 
 angular.module('viewCustom').component('prmSmMoreRecords', {
     bindings: { parentCtrl: '<' },
     controller: 'prmSmMoreRecords',
     controllerAs: 'vm',
     templateUrl: '/primo-explore/custom/HVD2/html/prm-sm-more-records.html'
 });