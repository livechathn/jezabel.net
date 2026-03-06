(function () {
    var token = sessionStorage.getItem('jezabel_token');
    if (!token) {
        var base = (location.pathname.match(/^(.*\/docs\/)/) || ['', '/'])[1];
        window.location.replace(base + 'login/');
    }
})();
