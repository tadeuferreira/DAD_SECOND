"use strict";
var HandlerSettings = (function () {
    function HandlerSettings(wsServer, security, prefix) {
        if (prefix === void 0) { prefix = '/api/v1/'; }
        this.wsServer = null;
        this.security = null;
        this.prefix = '/api/v1/';
        this.wsServer = wsServer;
        this.security = security;
        this.prefix = prefix;
    }
    return HandlerSettings;
}());
exports.HandlerSettings = HandlerSettings;
