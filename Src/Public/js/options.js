var button_one = document.getElementsByName("button_one");
var button_two = document.getElementsByName("button_two");
var button_three = document.getElementsByName("button_three");
var button_four = document.getElementsByName("button_four");
var button_five = document.getElementsByName("button_five");
var button_six = document.getElementsByName("button_six");
var button_seven = document.getElementsByName("button_seven");
var button_eight = document.getElementsByName("button_eight");
var button_nine = document.getElementsByName("button_nine");
var numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var custom = localStorage.getItem("custom").split(",");
var normal = [true, true, true, false, true, true, false, true, true];

function addtoall() {
    for (var i = 0; i < 9; i++) {
        eval(`button_${numbers[i]}[0].setAttribute("onchange", "setsettings(this)");`);
    }
}

function defultsettings() {
    for (var i = 0; i < 9; i++) {
        if (normal[i] == "false") {
            eval(`button_${numbers[i]}[0].click();`);
        }
    }
}

function loadsettings() {
    if (custom == null) {
        defultsettings();
    } else {
        for (var i = 0; i < 9; i++) {
            if (custom[i] == 'false') {
                eval(`button_${numbers[i]}[0].click();`);
            }
        }
    }
    addtoall();
}

function setsettings(button) {
    var change = numbers.indexOf(button.name.split("_")[1]);
    var newvarr = [];
    for (var i = 0; i < 9; i++) {
        if (i == change) {
            if (custom[i] == "false") {
                newvarr.push('true');
            } else {
                newvarr.push('false');
            }
        } else {
            newvarr.push(custom[i]);
        }
    }
    localStorage.setItem("custom", newvarr);
    custom = localStorage.getItem("custom").split(",");
}