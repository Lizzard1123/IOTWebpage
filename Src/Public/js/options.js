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
var custom;
var normal = ["true", "true", "true", "true", "true", "true", "false", "true", "true"];
var slider = document.getElementById("switcherselector");
var switches = document.getElementsByClassName("switchpages");
var titles = ['content one', 'content two', 'Home', 'content four', 'TODO'];
var pagelink = ["content_1", "content_2", "Home", "content_4", "ToDo"];
var numberofpages = titles.length;
var maxdivbox = 100 / numberofpages;

function givetitles() {
    for (var i = 0; i < numberofpages; i++) {
        switches[i].innerHTML = titles[i];
    }
}

function setintoplace() {
    for (var i = 0; i < numberofpages; i++) {
        switches[i].style.left = `${maxdivbox * i}%`;
        givetitles();
    }
}

function closesttomiddle() {
    var closest = 100;
    var indexnumber;
    for (var i = 0; i < numberofpages; i++) {
        var value = parseInt(switches[i].style.left) - 40;
        if (Math.abs(value) < closest) {
            closest = Math.abs(value);
            indexnumber = i;
        }
    }
    return indexnumber;
}

function updateslider() {
    var value = slider.value - 50;
    for (var i = 0; i < numberofpages; i++) {
        var newval = (i * maxdivbox) + value;
        switches[i].style.left = `${newval}%`;
    }
}

function updatesliderbar() {
    slider.value = 50;
    var targetmiddle = titles[closesttomiddle()];
    while (titles[2] != targetmiddle) {
        titles.unshift(titles.pop());
        pagelink.unshift(pagelink.pop());
    }
    setintoplace();

    document.getElementById("embeded").src = `privatestatic/html/${pagelink[2]}.html`;
    document.getElementById("Title").innerHTML = titles[2];
}

function getinfo(number) {
    var numbertoreturn = numbers.indexOf(number);
    if (custom[numbertoreturn] == 'false') {
        return false;
    } else {
        return true;
    }

}

function addtoall() {
    for (var i = 0; i < 9; i++) {
        eval(`button_${numbers[i]}[0].setAttribute("onchange", "setsettings(this)");`);
    }
}

function defultsettings() {
    custom = normal;
    for (var i = 0; i < 9; i++) {
        if (custom[i] == "false") {
            eval(`button_${numbers[i]}[0].click();`);
        }
    }
}
var artificalmove;

function resetPage() {
    if (getinfo('one')) {
        document.getElementById("pagebody").setAttribute("onmousemove", "timeoutScreen()");
    } else {
        if (custom[1] == "true") {
            button_two[0].click();
        }
        clearTimeout(notMovingTimer);
        document.getElementById("pagebody").removeAttribute("onmousemove");
    }
    if (getinfo("seven")) {
        clearInterval(randomizeTriangles);
        artificalmove = setInterval(randomcolorTriangles, randomizeTime);
    } else {
        clearInterval(artificalmove);
    }
}

function loadsettings(titleset) {
    try {
        custom = localStorage.getItem("custom").split(",");
    } catch { console.log("going defauult"); } finally {
        if (custom == undefined) {
            defultsettings();
        } else {
            for (var i = 0; i < 9; i++) {
                if (custom[i] == 'false') {
                    eval(`button_${numbers[i]}[0].click();`);
                }
            }
        }
        addtoall();
        resetPage();
        if (titleset) {
            setintoplace();
        } else {
            switchsubmit();
        }
    }
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
    resetPage();
}
var customcookies = ['token'];

function clearcookies() {
    for (var i = 0; i < customcookies.length; i++) {
        document.cookie = `${customcookies[i]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

function pageClose() {
    clearcookies();
}