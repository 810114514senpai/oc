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
        const title = doc.querySelector("meta[property='og:title']") ? doc.querySelector("meta[property='og:title']").content : doc.title || "";
        const image = doc.querySelector("meta[property='og:image']") ? doc.querySelector("meta[property='og:image']").content : "";
        let members = "";
        const memberElem = doc.querySelector("meta[property='og:description']");
        if (memberElem && memberElem.content) {
            const m = memberElem.content.match(/[0-9,]+人/);
            members = m ? m[0] : "";
        }
        resultDiv.innerHTML = `
            <img class="avatar" src="${image}" alt="アイコン"><br>
            名前：${title}<br>
            参加人数：${members}<br>
            URL：<a href="${url}" target="_blank">OpenChatリンク</a>
        `;
    } catch (e) {
        resultDiv.innerHTML = "エラーが発生しました。";
    }
});
