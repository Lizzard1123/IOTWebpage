// holds global info for js pages
function clearcookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
}

// eslint-disable-next-line no-unused-vars
function pageClose(clearcook, top) {
    if (clearcook) {
        clearcookies();
    }
    if (top) {
        location.reload();
    } else {
        window.top.location.reload();
    }
}
// thx to w3 schools for this oen
function getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return 'none';
}
// LAMPS

// eslint-disable-next-line no-unused-vars
function globalUserData() {
    if (getCookie('token') == 'none') {
        return {};
    } else {
        // eslint-disable-next-line no-unused-vars
        return JSON.parse(window.atob(getCookie('token').split('.')[1]));
    }
}

// eslint-disable-next-line no-unused-vars
function isEmpty(obj) {
    console.log(obj);
    return Object.keys(obj).length === 0;
}