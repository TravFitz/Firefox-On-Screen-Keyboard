browser.tabs.onUpdated.addListener(function (tabid, changeInfo, tab) {
    if (changeInfo.status === "complete" || changeInfo.status === "highlighted") {
        browser.tabs.sendMessage(tabid,"insertKeyboard");
    } 
});