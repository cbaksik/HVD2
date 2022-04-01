(function () {
    // tracking IDs
    const trackingId_GA4 = 'G-3CXC97RWEK';
    // const trackingId_GTM= 'GTM-1234567';


    // Google Analytyics code
    const defaultCode = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${trackingId_GA4}');`;

    const defaultURL = `https://www.googletagmanager.com/gtag/js?id=${trackingId_GA4}`;


    // Google Tag Manager code
    // const gtmHeadCode =
    //     `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    //     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    //     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    //     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    //     })(window,document,'script','dataLayer','${trackingId_GTM}');`;

    // const gtmBodyCode = `<iframe src="https://www.googletagmanager.com/ns.html?id=${trackingId_GTM}"
    //     height="0" width="0" style="display:none;visibility:hidden"></iframe>`;


    // Add GA4 external script tag in <head>
    const externalScriptTag = document.createElement('script');
    externalScriptTag.async = true;
    externalScriptTag.src = defaultURL;
    document.querySelector("head").appendChild(externalScriptTag);
    
    // Add inline script tags
    function addInlineScript(inlineCode, scriptType='script', target='head'){
        const inlineScriptTag = document.createElement(scriptType);
        inlineScriptTag.type = 'text/javascript';

        // Methods of adding inner text sometimes don't work across browsers.
        try {
            inlineScriptTag.appendChild(document.createTextNode(inlineCode));
        } catch (e) {
            inlineScriptTag.text = inlineCode;
        }

        document.querySelector(target).appendChild(inlineScriptTag);
    }

    addInlineScript(defaultCode);
    // addInlineScript(gtmHeadCode);
    // addInlineScript(gtmBodyCode, 'noscript', 'body');
})();