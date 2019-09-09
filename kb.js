browser.webNavigation.onCompleted.addListener(function (details) {
    console.log(details);
    browser.tabs.sendMessage(details.tabId,"insertKeyboard");
});