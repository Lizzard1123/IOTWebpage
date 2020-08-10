var button_one = document.getElementsByName("button_one");
var button_two = document.getElementsByName("button_two");
var button_three = document.getElementsByName("button_three");
var button_four = document.getElementsByName("button_four");
var button_five = document.getElementsByName("button_five");
var button_six = document.getElementsByName("button_six");
var button_seven = document.getElementsByName("button_seven");
var button_eight = document.getElementsByName("button_eight");
var numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var custom = [true, true, true, false, true, true, false, true, true];
var normal = [true, true, true, false, true, true, false, true, true];

function defultsettings() {
    console.log("defualt");
    for (var i = 0; i < 9; i++) {
        if (normal[i] == false) {
            eval(`button_${numbers[i]}[0].click();`);
        }
    }
}

function loadsettings() {
    console.log("loading");
    if (custom == null) {
        console.log("defaulttt");
        defultsettings();
    } else {
        console.log(`getting from ${custom}`);
        for (var i = 0; i < 9; i++) {
            if (custom[i] == false) {
                eval(`button_${numbers[i]}[0].click();`);
            }
        }
    }

}

function setsettings(button) {
    var change = numbers.indexOf(button.name.split("_")[1]);
    console.log(button.name.split("_")[1]);
    var newvarr = [];
    for (var i = 0; i < 9; i++) {
        if (i == change) {
            newvarr.push(!custom[i]);
        } else {
            newvarr.push(custom[i]);
        }
    }
    console.log(newvarr);
    localStorage.setItem("custom", newvarr);
}