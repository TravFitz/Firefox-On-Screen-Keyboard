browser.webNavigation.onCompleted.addListener(function (details) {
    browser.tabs.sendMessage(details.tabId,JSON.stringify({"directive":"insertKeyboard"}));
});