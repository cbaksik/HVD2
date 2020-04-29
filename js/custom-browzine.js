/**
 * from browzine
 * https://gist.githubusercontent.com/tiandavis/26078a3a56fbfa55590e10e020845ea4/raw/1eeafc1053438397944af35d33bb2da0a3ed8090/custom-browzine-component.js
 * */
function isBrowzineLoaded() {
    var validation = false;
    var scripts = document.head.querySelectorAll("script");
  
    if (scripts) {
      Array.prototype.forEach.call(scripts, function(script) {
        if (script.src.indexOf("browzine-primo-adapter") > -1) {
          validation = true;
        }
      });
    }
  
    return validation;
  }
  
  angular.module('viewCustom')
  .controller('browzineController', function($scope) {
    if (!isBrowzineLoaded()) {
      window.browzine = {
        api: "https://public-api.thirdiron.com/public/v1/libraries/215",
        apiKey: "c9131e27-f594-4c02-a152-6496f5dbf79e",

        journalCoverImagesEnabled: true,

        journalBrowZineWebLinkTextEnabled: false,
        journalBrowZineWebLinkText: "LATEST ISSUES",
    
        articleBrowZineWebLinkTextEnabled: false,
        articleBrowZineWebLinkText: "View issue contents",
    
        articlePDFDownloadLinkEnabled: true,
        articlePDFDownloadLinkText: "VIEW PDF",
    
        printRecordsIntegrationEnabled: true,
      };
  
      window.browzine.script = document.createElement("script");
      window.browzine.script.type = "text/javascript";
      window.browzine.script.async = true;
      window.browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
      window.document.head.appendChild(window.browzine.script);
    }
  
    (function poll() {
      if (isBrowzineLoaded() && window.browzine.primo) {
        window.browzine.primo.searchResult($scope);
      } else {
        requestAnimationFrame(poll);
      }
    })();
  });
  
  angular.module('viewCustom')
  .component('browzine', {
    bindings: {
      parentCtrl: '<'
    },
    controller: 'browzineController'
  });