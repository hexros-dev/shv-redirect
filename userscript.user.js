// ==UserScript==
// @name            Auto Redirect SacHiepVien Link
// @namespace       https://hexros.qzz.io
// @version         1.7
// @match           https://sachiepvien.net/redirect.html*
// @run-at          document-body
// @grant           GM_xmlhttpRequest
// @connect         link.sachiepvien.net
// @connect         mega.nz
// @author          Hexros Raymond
// @icon            https://raw.githubusercontent.com/hexros-dev/shv-redirect/refs/heads/master/assets/logo.png
// @updateURL       https://raw.githubusercontent.com/hexros-dev/shv-redirect/refs/heads/master/userscript.meta.js
// @downloadURL     https://raw.githubusercontent.com/hexros-dev/shv-redirect/refs/heads/master/userscript.user.js
// ==/UserScript==

(function () {
    "use strict";

    function resolveAndRedirect(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            timeout: 10000,
            onload(response) {
                const finalUrl = response.finalUrl;
                if (finalUrl && finalUrl !== url) {
                    location.replace(finalUrl);
                    return;
                }
                location.replace(url);
            },
            onerror() {
                location.replace(url);
            },
            ontimeout() {
                location.replace(url);
            }
        });
    }

    function tryRedirect() {
        const link = document.getElementById("redirectLink");
        if (!link?.href) {
            return false;
        }
        try {
            const url = new URL(link.href);
            let targetUrl = url.searchParams.get("url");
            if (!targetUrl) {
                return false;
            }
            targetUrl = decodeURIComponent(targetUrl);
            if (!/^https:\/\/link\.sachiepvien\.net\//i.test(targetUrl)) {
                return false;
            }
            resolveAndRedirect(targetUrl);
            return true;
        } catch {
            return false;
        }
    }


    const CHECK_INTERVAL = 500;
    const endTime = Date.now() + 10000;

    const timer = setInterval(() => {
        if (tryRedirect() || Date.now() >= endTime) {
            clearInterval(timer);
        }
    }, CHECK_INTERVAL);

    // if (tryRedirect()) {
    //     return;
    // }

    // const observer = new MutationObserver(() => {
    //     if (tryRedirect()) {
    //         observer.disconnect();
    //     }
    // });

    // observer.observe(document.documentElement, {
    //     childList: true,
    //     subtree: true
    // });
})();
