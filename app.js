document.getElementById("fetchBtn").addEventListener("click", async () => {
    const link = document.getElementById("inviteLink").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "取得中…";
    let url = link;
    if (url.startsWith("https://line.me/ti/g2/")) {
        url = url;
    } else if (url.match(/^https:\/\/openchat\.line\.me\/.+/)) {
        url = url;
    } else {
        resultDiv.innerHTML = "正しいOpenChatリンクを入力してください。";
        return;
    }
    try {
        const proxy = "https://corsproxy.io/?";
        const fetchUrl = proxy + encodeURIComponent(url);
        const resp = await fetch(fetchUrl);
        const text = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const titleMeta = doc.querySelector("meta[property='og:title']");
        const title = titleMeta ? titleMeta.content : doc.title || "";
        const imageMeta = doc.querySelector("meta[property='og:image']");
        const image = imageMeta ? imageMeta.content : "";
        let members = "";
        const descMeta = doc.querySelector("meta[property='og:description']");
        if (descMeta && descMeta.content) {
            const m = descMeta.content.match(/[0-9,]+人/);
            members = m ? m[0] : "";
        }
        // 該当ページの生テキスト
        const bodyText = doc.body.innerText;
        let authInfo = "";
        if (bodyText.match(/(承認制|認証制|運営承認|管理者による承認|非公開|公開)/)) {
            const reg = /(承認制|認証制|運営承認|管理者による承認|非公開|公開)/g;
            const found = bodyText.match(reg);
            authInfo = "公開状態など: " + ([...new Set(found)].join("・"));
        } else {
            authInfo = "公開・認証状態に関する表記なし";
        }
        resultDiv.innerHTML = 
            (image ? `<img class="avatar" src="${image}" alt="アイコン"><br>` : "") +
            `タイトル：${title}<br>` +
            `参加人数：${members}<br>` +
            `${authInfo}<br>` +
            `URL：<a href="${url}" target="_blank">OpenChatリンク</a>`;
    } catch (e) {
        resultDiv.innerHTML = "エラーが発生しました。";
    }
});
