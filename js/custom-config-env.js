(function () {
    angular.module('viewCustom')
    .service('customConfigEnv',[()=>{
        const services = {};
        const envUrl = {
            'local': 'localhost',
            'dev': 'harvard-primoalma-stage.hosted.exlibrisgroup.com',
            'qa': 'qa.hollis.harvard.edu',
            'prod': ''
        };
        services.getEnvUrl=()=>{
            return envUrl;
        };

        return services;
    }]);
})();