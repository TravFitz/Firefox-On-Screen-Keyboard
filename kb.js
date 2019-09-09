browser.webNavigation.onCompleted.addListener(function (details) {
    browser.tabs.sendMessage(details.tabId,"insertKeyboard");
});