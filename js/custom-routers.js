/**
 * Created by samsan on 3/20/18.
 * List all custom routers for images component and images details
 */

(function () {
    angular.module('viewCustom')
        .config(function ($stateProvider) {
            $stateProvider
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
