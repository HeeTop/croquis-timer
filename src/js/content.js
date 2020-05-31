const imageAEls = document.querySelectorAll(`#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd`);
const mainImageEl = document.createElement("img");
const layer = document.createElement("div");

layer.id = "croquisTimerLayer";
layer.style.position = "absolute";
layer.style.top = "0";
layer.style.left = "0";
layer.style.width = "100%";
layer.style.height = "100%";
layer.style.zIndex = "1147483646";
layer.style.backgroundColor = "green";
layer.style.visibility = "visible";

[...imageAEls].map(imageAEl=>{
    imageAEl.addEventListener("click", ()=>{
        const previewEl = document.querySelector(`#Sva75c > div > div > div.pxAole > div.tvh9oe.BIB1wf > \
        c-wiz > div.OUZ5W > div.zjoqD > div > div.v4dQwb > a > img`);
        if (!previewEl) {
            return;
        }

        mainImageEl.src = previewEl.src;
        setTimeout(()=>window.scrollTo(0,0),1000);
    });
});

function clickTag(index, interval = 5 * 1000) {
    if (index >= imageAEls.length || imageAEls[index].tagName !== `A`) {
        return;
    }

    imageAEls[index].click();
    setTimeout(()=>clickTag(index+1), interval);
}

function init(on = true) {
    if (!on) {
        return;
    }
    setTimeout(()=>clickTag(0), 5);

    document.body.appendChild(layer);
    layer.appendChild(mainImageEl);
}
init();