/**
 * Created by samsan on 11/21/17.
 * Implement ui-router so it can load new pages and new component
 */

(function () {

    angular.module('viewCustom')
    .config(function ($stateProvider) {
        $stateProvider
            .state('exploreMain.almaMapIt', {
                    url: '/almaMapIt',
                    views:{
                        '': {
                            template: `<custom-library-map loc="$ctrl"></custom-library-map>`
                        }
                    }
                }

            )
            .state('exploreMain.aeon', {
                url: '/aeon/:mmsid',
                    views:{
                    '': {
                        template: `<custom-aeon parent-ctrl="$ctrl"></custom-aeon>`
                        }
                    }
                }
            )
            .state('exploreMain.viewallcomponentdata', {
                    url: '/viewallcomponentmetadata/:context/:docid',
                    views:{
                        '': {
                            template: `<custom-view-all-component-metadata parent-ctrl="$ctrl"></custom-view-all-component-metadata>`
                        }
                    }
                }

            )
            .state('exploreMain.viewcomponent', {
                    url:'/viewcomponent/:context/:docid',
                    views:{
                        '':{
                            template:`<custom-view-component parent-ctrl="$ctrl" item="$ctrl.item" services="$ctrl.services" params="$ctrl.params"></custom-view-component>`
                        }
                    }
                }

            )
            .state('exploreMain.printPage', {
                    url: '/printPage/:context/:docid',
                    views:{
                        '': {
                            template: `<custom-print-page parent-ctrl="$ctrl"></custom-print-page>`
                        }
                    }
                }

            )
    });


})();