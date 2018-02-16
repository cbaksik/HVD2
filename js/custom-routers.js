/**
 * Created by samsan on 11/21/17.
 */

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
                url: '/aeon',
                    views:{
                    '': {
                        template: `<custom-aeon parent-ctrl="$ctrl"></custom-aeon>`
                        }
                    }
                }
            )
    });
