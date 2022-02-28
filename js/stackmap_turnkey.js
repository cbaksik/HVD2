/* StackMap: Start */
(function(){

    const a = document.querySelector("head");
    const b = document.body;

    const css1 = document.createElement("link"); 
    css1.type = "text/css";
    css1.rel = "Stylesheet";
    css1.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    css1.crossorigin = "anonymous";
    a.appendChild(css1);

    const css2 = document.createElement("link"); 
    css2.type = "text/css";
    css2.rel = "Stylesheet";
    css2.href = "https://www.stackmap.com/integration/harconstd/StackMap.css";
    a.appendChild(css2);

    const css3 = document.createElement("link"); 
    css3.type = "text/css";
    css3.rel = "Stylesheet";
    css3.href = "https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i&amp;display=swap";
    a.appendChild(css3);

    const w = document.createElement("script"); 
    w.type = "text/javascript"; 
    w.async = true;
    w.src = "https://www.stackmap.com/integration/harconstd/StackMap.js";
    b.appendChild(w);

    // Google Analytics
    const inlineCode = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-52592218-13', 'auto');ga('send', 'pageview');";

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
/* StackMap: END */