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
    });
