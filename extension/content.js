const scriptElement = document.createElement('script');
scriptElement.src = chrome.runtime.getURL('fdc3-glue42.js');
(document.head || document.documentElement).appendChild(scriptElement);
