/**
 * Adds the chat widget. CB added 6/29/18 per 
 * https://developers.exlibrisgroup.com/blog/Embedding-SpringShare-LibChat-Widget-into-the-Primo-NUI
 * 
 */


(function() {

    var chat = document.createElement('script'); chat.type = 'text/javascript'; chat.async = 'true';

    chat.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'v2.libanswers.com/load_chat.php?hash=10372f999a1c3953ffde50858ead4611';

    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(chat, s);

    })();

