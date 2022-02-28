/* StackMap: Start */
(function(){

    var a = document.querySelector("head");
    var b = document.body;

    var css1 = document.createElement("link"); 
    css1.type = "text/css";
    css1.rel = "Stylesheet";
    css1.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    css1.crossorigin = "anonymous";
    a.appendChild(css1);

    var css2 = document.createElement("link"); 
    css2.type = "text/css";
    css2.rel = "Stylesheet";
    css2.href = "https://www.stackmap.com/integration/harvard/StackMap.css";
    a.appendChild(css2);

    var css3 = document.createElement("link"); 
    css3.type = "text/css";
    css3.rel = "Stylesheet";
    css3.href = "https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i&amp;display=swap";
    a.appendChild(css3);

    var w = document.createElement("script"); 
    w.type = "text/javascript"; 
    w.async = true;
    w.src = "https://www.stackmap.com/integration/harvard/StackMap.js";
    b.appendChild(w);
    
})();
/* StackMap: END */