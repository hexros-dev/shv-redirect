// ==UserScript==
// @name            Auto Redirect SacHiepVien Link
// @namespace       https://hexros.qzz.io
// @version         1.3
// @match           https://sachiepvien.net/redirect.html*
// @run-at          document-start
// @grant           GM_xmlhttpRequest
// @connect         link.sachiepvien.net
// @connect         mega.nz
// @author          Hexros Raymond
// @downloadUrl     https://raw.githubusercontent.com/hexros-dev/shv-redirect/refs/heads/master/userscript.js
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
    
    if (tryRedirect()) {
        return;
    }
    
    const observer = new MutationObserver(() => {
        if (tryRedirect()) {
            observer.disconnect();
        }
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
