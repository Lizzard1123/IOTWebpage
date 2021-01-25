// eslint-disable-next-line no-unused-vars
function clearcookies(exeption = 'none') {
    console.log('clearing');
    console.log(document.cookie);
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        console.log(name);
        console.log(exeption);
        if (exeption == 'none') {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        } else if (!exeption.includes(name)) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }
}

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

function errorHandler(error) {
    let sessionErrors = getCookie('sessionErrors');
    if (sessionErrors == 'none' || sessionErrors == '') {
        console.log('creating new cookie');
        sessionErrors = [];
    }
    if (typeof sessionErrors == 'string') {
        sessionErrors = sessionErrors.split(',');
        console.log(sessionErrors);
        console.log(error);
        if (!sessionErrors.includes(error)) {
            console.log('doenst inclide');
            sessionErrors.push(error);
        }
    } else {
        console.log('else');
        sessionErrors.push(error);
    }

    document.cookie = `sessionErrors=${sessionErrors.toString()}; path=/`;
    console.log(document.cookie);
}

// eslint-disable-next-line no-unused-vars
function failedToLoad(elm, reload) {
    console.log('failedtoloaf.onerr');
    errorHandler(`Error loading: ${elm.src==null?elm.href:elm.src}`);
    console.log(`Error loading: ${elm.src==null?elm.href:elm.src}`);
    if (window.top.location.href != 'http://localhost:3000/login' && reload) {
        window.top.location.href = '/login';
        console.log(window.top.location.href);
    }
}
window.onerror = function(message, source, lineno, colno, error) {
    console.log('Window.onerr');
    errorHandler(error);
};