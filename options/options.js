const scaleValue = document.querySelector("#scaleValue");
const numpadState = document.querySelector("#numpadState");

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        };

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    };
};

/*
 Get current values in the fields and update the storage.
 */
function updateStorage() {    
    browser.storage.local.set({
        scaleValue: scaleValue.value,
		numpadState: numpadState.value
    });
}

/*
 Update the options UI with the settings values retrieved from storage,
 or the default settings if the stored settings are empty.
 */
function updateUI(restoredSettings) {
    scaleValue.value = restoredSettings.scaleValue || 90;
    numpadState.value = restoredSettings.numpadState || "auto";
}

function onError(e) {
    console.error(e);
}

/*
 On opening the options page, fetch stored settings and update the UI with them.
 */
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
 On blur, save the currently selected settings.
 */
scaleValue.addEventListener("blur", updateStorage);
numpadState.addEventListener("blur", updateStorage);