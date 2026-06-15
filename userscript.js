// ==UserScript==
// @name            Auto Redirect SacHiepVien Link
// @namespace       https://hexros.qzz.io
// @version         1.1
// @match           https://sachiepvien.net/redirect.html*
// @run-at          document-start
// @grant           none
// @author          Hexros Raymond
// @downloadURL     https://raw.githubusercontent.com/hexros-dev/shv-redirect/refs/heads/master/userscript.js?token=GHSAT0AAAAAAD6RQUQGNDWNAA2T6IKSBWCC2RPY7HA
// ==/UserScript==

(function () {
    "use strict";

    function tryRedirect() {
        const link = document.getElementById("redirectLink");
        if (!link) return false;

        const href = link.href;
        if (!href) return false;

        try {
            const url = new URL(href);
            let targetUrl = url.searchParams.get("url");

            if (!targetUrl) return false;

            targetUrl = decodeURIComponent(targetUrl);

            if (/^https:\/\/link\.sachiepvien\.net\//i.test(targetUrl)) {
                location.replace(targetUrl);
                return true;
            }
        } catch (e) {}

        return false;
    }

    if (tryRedirect()) return;

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
