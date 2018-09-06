const fetch = require('cross-fetch');

class Backend {
    constructor(services, options = {}) {
        this.init(services, options);
        this.type = 'backend';
    }

    init(services, backendOptions = {}, i18nextOptions) {
        this.services = services;
        this.options = {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
            addPath: '/locales/add/{{lng}}/{{ns}}',
            ...this.options || {},
            ...backendOptions,
        };
    }

    read(language, namespace, callback) {
        var loadPath = this.options.loadPath;
        if (typeof this.options.loadPath === 'function') {
            loadPath = this.options.loadPath([language], [namespace]);
        }

        let url = this.services.interpolator.interpolate(loadPath, { lng: language, ns: namespace });

        this.loadUrl(url, callback);
    }

    readMulti(languages, namespaces, callback) {
        var loadPath = this.options.loadPath;
        if (typeof this.options.loadPath === 'function') {
            loadPath = this.options.loadPath(languages, namespaces);
        }

        let url = this.services.interpolator.interpolate(loadPath, { lng: languages.join('+'), ns: namespaces.join('+') });

        this.loadUrl(url, callback);
    }

    loadUrl(url, callback) {
        fetch(url)
            .then(res => res.json())
            .then(data => callback(null, data))
            .catch(err => {
                if (err.status >= 500 && err.status < 600) return callback('failed loading ' + url, true /* retry */);
                if (err.status >= 400 && err.status < 500) return callback('failed loading ' + url, false /* no retry */);
                callback(`failed parsing ${url} to json`, false);
            });
    }
}

Backend.type = 'backend';

module.exports = Backend;