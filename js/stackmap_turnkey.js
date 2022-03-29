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

    var w = document.createElement("script"); 
    w.type = "text/javascript"; 
    w.async = true;
    w.src = "https://www.stackmap.com/integration/harconstd/StackMap.js";
    b.appendChild(w);

})();
/* StackMap: END */