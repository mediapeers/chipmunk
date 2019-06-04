"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "@context": {
        "@id": "https://tuco.api.mediapeers.mobi/context/request",
        "@context": "https://tuco.api.mediapeers.mobi/context/context",
        "@type": "context",
        "properties": {},
        "collection_actions": {
            "get": {
                "method": "POST",
                "expects": null,
                "resource": "https://tuco.api.mediapeers.mobi/context/request",
                "response": "https://tuco.api.mediapeers.mobi/context/collection",
                "template": "https://tuco.api.mediapeers.mobi"
            },
            "proxy": {
                "method": "POST",
                "expects": null,
                "resource": "https://tuco.api.mediapeers.mobi/context/request",
                "response": "https://tuco.api.mediapeers.mobi/context/collection",
                "template": "https://tuco.api.mediapeers.mobi/proxy"
            }
        },
        "member_actions": {
            "get": {
                "method": "POST",
                "expects": null,
                "resource": "https://tuco.api.mediapeers.mobi/context/request",
                "response": "https://tuco.api.mediapeers.mobi/context/collection",
                "template": "https://tuco.api.mediapeers.mobi"
            }
        }
    }
};
//# sourceMappingURL=tuco.context.js.map