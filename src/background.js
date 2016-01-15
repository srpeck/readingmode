// Consider pairing with user-specified custom stylesheet based on your reading preferences (e.g., font, wrapping/centering, day/night mode, etc.)
var disabledTabs=[],currentTab;
chrome.webRequest.onBeforeRequest.addListener(
    function(x){
        // Consider adding a list of rules/URLs based on your browsing habits (e.g., Gmail never goes to reading mode, allow images from base domain, etc.)
        if(disabledTabs.indexOf(x.tabId)>=0)return; // Reading mode on by default, toggled off by tab
        if(x.url.indexOf("chrome-extension://")===0)return; // Allow button icon to be updated
        if(x.type!=="main_frame"){return{cancel:true};}
    },
    {urls:["<all_urls>"],},
    ["blocking"]
);
chrome.browserAction.onClicked.addListener(toggleMode);
chrome.commands.onCommand.addListener(function(x){if(x==="toggle-reading")toggleMode();});
chrome.tabs.onUpdated.addListener(function(_,p,t){if(p.status==="loading"&&t.selected)updateIcon();});
chrome.tabs.onHighlighted.addListener(function(){updateIcon();});
chrome.windows.onFocusChanged.addListener(function(){updateIcon();});
chrome.windows.getCurrent(function(){updateIcon();});
function setIcon(mode){chrome.browserAction.setIcon({path:"icon"+mode+".png"});}
function toggleMode(){
    var x=disabledTabs.indexOf(currentTab);
    if(x<0){
        disabledTabs.push(currentTab);
        setIcon("off");
    }else{
        disabledTabs.splice(x,1);
        setIcon("");
    }
    chrome.tabs.reload(currentTab,{bypassCache:false});
}
function updateIcon(){
    chrome.tabs.query({'active':true,'windowId':chrome.windows.WINDOW_ID_CURRENT},
        function(t){if(t[0])setIcon(disabledTabs.indexOf(currentTab=t[0].id)<0?"off":"");});
}
