(function(){

    const a = document.querySelector("head");
    const b = document.body;

    // Google Analytics
    const inlineCode = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-52592218-13', 'auto');ga('send', 'pageview');";

    const trackingId = 'UA-52592218-13';

    const defaultCode = `window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${trackingId}');`;
    const defaultURL = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;

    // GA external script tag in <head>
    const externalScriptTag = document.createElement('script');
    externalScriptTag.src = defaultURL;
    a.appendChild(externalScriptTag);

    // GA inline code in <head>

    // const inlineScriptTag = document.createElement('script');
    // inlineScriptTag.type = 'text/javascript';
    //  // Methods of adding inner text sometimes don't work across browsers.
    // try {
    //     inlineScriptTag.appendChild(document.createTextNode(defaultCode));
    // } catch (e) {
    //     inlineScriptTag.text = defaultCode;
    // }
    // a.appendChild(inlineScriptTag);


    const ga = document.createElement("script"); 
    ga.type = "text/javascript";

    // Methods of adding inner text sometimes don't work across browsers.
    try {
        ga.appendChild(document.createTextNode(inlineCode));
    } catch (e) {
        ga.text = inlineCode;
    }
    a.appendChild(ga);

})();


// <!-- Tracking  code found in dashboard -->
// <!-- Global site tag (gtag.js) - Google Analytics -->
// <script async src="https://www.googletagmanager.com/gtag/js?id=UA-52592218-13"></script>
// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());

//   gtag('config', 'UA-52592218-13');
// </script>


// function buildConfig({ externalScriptURL, inlineScript, trackingId, target }) {
//     const defaultCode = `window.dataLayer = window.dataLayer || [];
//                             function gtag(){dataLayer.push(arguments);}
//                             gtag('js', new Date());
//                             gtag('config', '${trackingId}');`;
//     const defaultURL = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;

//     return {
//         externalSource: externalScriptURL === undefined ? defaultURL : externalScriptURL,
//         inlineCode: inlineScript || defaultCode,
//         target: target || 'head',
//     };
// }



// what you see on NYU's site

// <head>

// <!-- Google Tag Manager -->

// ...

// HAVE IT <script async="" src="//www.google-analytics.com/analytics.js"></script>
// HAVE IT <script async="" src="https://www.googletagmanager.com/gtm.js?id=GTM-KBMBJL7"></script>
// NEED IT GTM <script>
//     (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//     })(window,document,'script','dataLayer','GTM-KBMBJL7');
// </script>
// <!-- End Google Tag Manager -->

// ...

// HAVE IT <script>
//     (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//     })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

//     ga('create', 'UA-55461631-15', 'auto');
//     ga('send', 'pageview');
// </script>

// </head>

// <body>
// <!-- Google Tag Manager (noscript) -->
// <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KBMBJL7"
// height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
// <!-- End Google Tag Manager (noscript) -->

// ...

// </body>
