/*
 FxKeyboard
 Version: 1.0.0
 Author:  Travis Fitzgerald
 Date:    20 February 2019
 Purpose: A virtual keyboard for Firefox
 */

var openstate = false;

var FxKeyboardLocale = '{'+
    '"name": "English",'+
    '"locale": "en",'+
    '"defaultFlex": "10",'+
    '"main": [['+
            '["`", "~"],'+
            '["1", "!"],'+
            '["2", "@"],'+
            '["3", "#"],'+
            '["4", "$"],'+
            '["5", "%"],'+
            '["6", "^"],'+
            '["7", "&"],'+
            '["8", "*"],'+
            '["9", "("],'+
            '["0", ")"],'+
            '["-", "_"],'+
            '["=", "+"],'+
            '[{"label": "Delete", "special": 8, "flex": 10, "type": "repeat"}]'+ // backspace
        '], ['+
            '[{"label": "Tab", "string": "\\t", "flex": 10}],'+ // TAB
            '["q", "Q"],'+
            '["w", "W"],'+
            '["e", "E"],'+
            '["r", "R"],'+
            '["t", "T"],'+
            '["y", "Y"],'+
            '["u", "U"],'+
            '["i", "I"],'+
            '["o", "O"],'+
            '["p", "P"],'+
            '["&#91;", "&#123;"],'+
            '["&#93;", "&#125;"],'+
            '["\\\\","|"]'+
        "], ["+
            '[{"label": "@", "string":"@", "flex": 10}],'+
            '["a", "A"],'+
            '["s", "S"],'+
            '["d", "D"],'+
            '["f", "F"],'+
            '["g", "G"],'+
            '["h", "H"],'+
            '["j", "J"],'+
            '["k", "K"],'+
            '["l", "L"],'+
            '[";", ":"],'+
            '["\'", "\\""],'+
            '[{"label": "Enter", "flex": 15, "special": 13}]'+
        '], ['+
            '[{"label": "Shift", "flex": 20, "special": "shift"}],'+
            '["z", "Z"],'+
            '["x", "X"],'+
            '["c", "C"],'+
            '["v", "V"],'+
            '["b", "B"],'+
            '["n", "N"],'+
            '["m", "M"],'+
            '[",", "<"],'+
            '[".", ">"],'+
            '["/", "?"],'+
            '[{"label": "Close","special": "closeFX","flex": 10}]'+
        '], ['+
            '[{"label": "Space", "flex": 5, "char": 32}],'+ // space
            '[{"label":".com", "flex": 1}],'+
            '[{"label":".au", "flex": 1}]'+
        ']]'+
'}';

var fxKeyboard = {

    settings: {
        repeat_all: true,
        keep_closed: false,
        locale_default: 'en',
        secScaleX: 0,
        secScaleY: 0,
        scale: 0,
        preScale: 0,
        key_height: 55,
        padding: 8,
        main_max_width: 1065,
        main_max_height: 375
    },

    _toggleOpen: function (open) {
        var kb = document.getElementById('fxkeyboard');
        if (open) {
            kb.style.display = "block";
        } else {
            kb.style.display = "none";
        }
    },

    /*
     states:
     0 - normal
     1 - shift on
     2 - shift lock
     */
    state: 0,
    lastPress: "null",
    keepOpen: false,
    
    _setSpecialFunctions: function(keyD,obj) {
        keyD.onmousedown = function(){keyD.style.backgroundColor = "rgb(150,150,150)";};
        keyD.onmouseenter = function(){keyD.style.backgroundColor = "rgb(200,200,200)";};
        keyD.onmouseout = function(){keyD.style.backgroundColor = "rgb(255,255,255)";};
        
        if (obj.label === "Shift") {
            keyD.onmouseup = function(){
                if (fxKeyboard.state === 0) {
                    keyD.style.backgroundColor = "rgb(200,200,200)";
                    keyD.onmouseout = function(){keyD.style.backgroundColor = "rgb(200,200,200)";};
                    fxKeyboard.state++;
                } else if (fxKeyboard.state === 1) {
                    keyD.onmouseout = function(){keyD.style.backgroundColor = "rgb(150,150,150)";};
                    keyD.style.backgroundColor = "rgb(150,150,150)";
                    fxKeyboard.state++;
                } else if (fxKeyboard.state === 2) {
                    fxKeyboard.state = 0;
                } 
                fxKeyboard._setShift();
            };
        } else if (obj.label === "Delete") {
            keyD.onmouseup = function () {
                var ele = document.activeElement;
                ele.value = ele.value.slice(0, -1);
                keyD.style.backgroundColor = "rgb(255,255,255)";
            };
        } else if (obj.label in {"@":"",".com":"",".au":""}) {
            keyD.onmouseup = function () {
                fxKeyboard._sendKey(obj.label);
                keyD.style.backgroundColor = "rgb(255,255,255)";
            };
        } else if (obj.label === "Space") {
            keyD.onmouseup = function () {
                fxKeyboard._sendKey(" ");
                keyD.style.backgroundColor = "rgb(255,255,255)";
            };
        } else if (obj.label === "Close") {
            keyD.onmouseup = function () {
                fxKeyboard._toggleOpen(false);
                keyD.style.backgroundColor = "rgb(255,255,255)";
                fxKeyboard.lastPress = "close";
            };
        } else if (obj.label === "Enter") {
            keyD.onmouseup = function () {
                var input = document.activeElement;
                input.dispatchEvent(new KeyboardEvent("beforeinput", {bubbles: true, cancelable: true, keyCode: 13}));
                input.dispatchEvent(new KeyboardEvent("keydown", {bubbles: true, cancelable: true, keyCode: 13}));
                input.dispatchEvent(new KeyboardEvent("keyup", {bubbles: true, cancelable: true, keyCode: 13}));
                input.dispatchEvent(new Event('change',{'bubbles':true,'cancelable':true}));
                keyD.style.backgroundColor = "rgb(255,255,255)";
            };
        }
        return keyD;
    },
    
    _setShift: function () {
        if (fxKeyboard.state > 0) {
            var secElements = document.getElementsByClassName("fxkey-secondary");
            var priElements = document.getElementsByClassName("fxkey-primary");
            for (var i = 0; secElements.length > i; i++) {
                secElements[i].style.display = "flex";
            }
            for (var i = 0; priElements.length > i; i++) {
                priElements[i].style.display = "none";
            }
        } else if (fxKeyboard.state === 0) {
            var secElements = document.getElementsByClassName("fxkey-secondary");
            var priElements = document.getElementsByClassName("fxkey-primary");
            var shiftK = document.getElementById("fxkey-shift");
            shiftK.style.backgroundColor = "rgb(255,255,255)";
            shiftK.onmouseout = function(){shiftK.style.backgroundColor = "rgb(255,255,255)";};
            for (var i = 0; secElements.length > i; i++) {
                secElements[i].style.display = "none";
            }
            for (var i = 0; priElements.length > i; i++) {
                priElements[i].style.display = "flex";
            }
        }
    },
    
    _sendKey: function (char) {
        var ele = document.activeElement;
        var cval = ele.value;
        ele.value = cval+char;
    },
    
    _buildKey: function (char,primary) {
        var key = document.createElement("div");
        key.style.width = this.settings.key_height*this.settings.scale + "px";
        key.style.height = this.settings.key_height*this.settings.scale + "px";
        key.style.margin = this.settings.padding*this.settings.scale + "px";
        if (primary) {
            key.id = "fxkey-primary";
            key.className = "fxkey-primary";
            key.style.display = "flex";
        } else {
            key.id = "fxkey-secondary";
            key.className = "fxkey-secondary";
            key.style.display = "none";
        }
        key.style.alignItems = "center";
        key.style.justifyContent = "center";
        key.style.borderRadius = 5*this.settings.scale+"px";
        key.style.cursor = "pointer";
        key.style.backgroundColor = "rgb(255,255,255)";
        key.innerHTML = char;
        key.onmouseenter = function(){key.style.backgroundColor = "rgb(200,200,200)";};
        key.onmouseout = function(){key.style.backgroundColor = "rgb(255,255,255)";};
        key.onmousedown = function () {
            key.style.backgroundColor = "rgb(150,150,150)";
        };
        key.onmouseup = function () {
            key.style.backgroundColor = "rgb(200,200,200)";
            if (char.indexOf("&#") !== -1) {
                char = key.innerHTML;
            }
            fxKeyboard._sendKey(char);
            if (fxKeyboard.state === 1) {
                fxKeyboard.state = 0;
                fxKeyboard._setShift();
            }
        };
        return key;
    },
    
    _buildSpecialKey: function (obj) {
        var key = document.createElement("div");
        key.style.width = this.settings.key_height*this.settings.scale + "px";
        key.style.height = this.settings.key_height*this.settings.scale + "px";
        key.style.margin = this.settings.padding*this.settings.scale + "px";
        key.style.display = "flex";
        key.style.alignItems = "center";
        key.style.justifyContent = "center";
        key.style.cursor = "pointer";
        key.style.flexGrow = obj.flex;
        key.id = "fxkey-"+obj.label.toLowerCase();
        key.style.borderRadius = 5*this.settings.scale + "px";
        key.style.backgroundColor = "rgb(255,255,255)";
        key = this._setSpecialFunctions(key,obj);
        key.innerHTML = obj.label;
        return key;
    },

    insertKeyboard: function () {
        this.settings.setScaleX = window.innerWidth/1920;
        this.settings.setScaleY = window.innerHeight/1080;
        if (this.settings.setScaleX > this.settings.setScaleY) {
            this.settings.scale = this.settings.setScaleX;
        } else {
            this.settings.scale = this.settings.setScaleY;
        }
        // parse keyboard keys JSON
        var keys = JSON.parse(FxKeyboardLocale);
        //create main Div
        var keyb;
        if (document.getElementById("fxkeyboard")) {
            keyb = document.getElementById("fxkeyboard");
        } else {
            keyb = document.createElement("div");
        }
        keyb.setAttribute("tabIndex","-1");
        keyb.style.backgroundColor = "rgba(0,0,0,0.6)";
        keyb.style.width = this.settings.main_max_width*this.settings.scale + "px";
        keyb.style.height = this.settings.main_max_height*this.settings.scale + "px";
        keyb.style.padding = this.settings.padding*this.settings.scale + "px";
        keyb.style.fontFamily = "arial,sans-serif";
        keyb.style.color = "#000000";
        keyb.style.fontSize = 24*this.settings.scale+"pt";
        keyb.style.borderRadius = 5*this.settings.scale+"px";
        keyb.style.textAlign = "center";
        keyb.style.position = "fixed"; 
        keyb.style.left = "50%";
        keyb.style.top = ((window.innerHeight - (this.settings.main_max_height*this.settings.scale))/window.innerHeight)*100 + "%";
        keyb.style.transform = "translateX(-50%)";
        keyb.id = "fxkeyboard";
        keyb.style.zIndex = "9999";
        keyb.style.display = "none"; //hidden on insert.
        if (!document.getElementById("fxkeyboard") || this.settings.preScale !== this.settings.scale) {
            if (this.settings.preScale !== this.settings.scale) {
                var rows = document.getElementsByClassName("fxkeyboard-r");
                if (rows.length > 0) {
                    for (var row in rows) {
                        document.body.removeChild(rows[row]);
                    }
                }
            }
            for (var row in keys.main) {
                var nrow = document.createElement("div");
                nrow.style.display = "flex";
                nrow.style.justifyContent = "center";
                nrow.id = 'fxkeyboard-r';
                nrow.class = 'fxkeyboard-r';
                for (var button in keys.main[row]) {
                    if (keys.main[row][button][0].constructor === {}.constructor) {
                        var nkey = this._buildSpecialKey(keys.main[row][button][0]);
                        nrow.appendChild(nkey);
                    } else {
                        var nkeyprimary = this._buildKey(keys.main[row][button][0], true);
                        var nkeysecondary = this._buildKey(keys.main[row][button][1], false);
                        nrow.appendChild(nkeyprimary);
                        nrow.appendChild(nkeysecondary);
                    }
                }
                keyb.appendChild(nrow);
            }
        }
        document.body.appendChild(keyb);
        this.settings.preScale = this.settings.scale;
        this._toggleOpen(false);
    }
};

browser.runtime.onMessage.addListener(function begin(message) {
    if (message === "insertKeyboard") {
        fxKeyboard.insertKeyboard();
    }
});

document.addEventListener("mousedown", function load(clicked) {
    if (clicked.target.id.indexOf("fxkey") !== -1) {
        clicked.preventDefault();
    }
});

document.addEventListener("focus", function load(clicked) {
    if (clicked.target.id.indexOf("fxkey") !== -1) {
        clicked.preventDefault();
    }
    var focus = document.activeElement;
    console.log(focus);
    console.log("clicked but no data");
    if (focus.type in {
        'input': '', 'select': '', 'option': '', 'textarea': '', 'textbox': '',
        'text': '', 'password': '', 'url': '', 'color': '', 'date': '', 'datetime': '',
        'datetime-local': '', 'email': '', 'month': '', 'number': '', 'range': '',
        'search': '', 'tel': '', 'time': '', 'week': ''
    } && fxKeyboard.lastPress !== "close") {
        fxKeyboard._toggleOpen(true);
    } else {
        if (clicked.target.id.indexOf("fxkey") === -1) {
            fxKeyboard._toggleOpen(false);
            fxKeyboard.lastPress = "null";
        }   
    }
},true);

document.addEventListener("mouseup", function load(clicked) {
    if (clicked.target.id.indexOf("fxkey") !== -1) {
        clicked.preventDefault();
    }
    var focus = document.activeElement;
    console.log(focus);
    console.log("clicked but no data");
    if (focus.type in {
        'input': '', 'select': '', 'option': '', 'textarea': '', 'textbox': '',
        'text': '', 'password': '', 'url': '', 'color': '', 'date': '', 'datetime': '',
        'datetime-local': '', 'email': '', 'month': '', 'number': '', 'range': '',
        'search': '', 'tel': '', 'time': '', 'week': ''
    } && fxKeyboard.lastPress !== "close") {
        fxKeyboard._toggleOpen(true);
    } else {
        if (clicked.target.id.indexOf("fxkey") === -1) {
            fxKeyboard._toggleOpen(false);
            fxKeyboard.lastPress = "null";
        }   
    }
});

document.addEventListener("dragstart", function load(clicked) {
    if (clicked.target.id.indexOf("fxkey") !== -1) {
        clicked.preventDefault();
    }
});

document.addEventListener("dragend", function load(clicked) {
    if (clicked.target.id.indexOf("fxkey") !== -1) {
        clicked.preventDefault();
    }
});

document.addEventListener("keydown", function kd(keyPressed) {
    
});