const imageAEls = document.querySelectorAll(`#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd`);
const mainImageEl = document.createElement(`img`);
const layer = document.createElement(`div`);

layer.id = `croquisTimerLayer`;
layer.style.position = `absolute`;
layer.style.top = `0`;
layer.style.left = `0`;
layer.style.width = `100%`;
layer.style.height = `100%`;
layer.style.zIndex = `1147483646`;
layer.style.backgroundColor = `green`;
layer.style.visibility = `visible`;
layer.style.position = `fixed`;

mainImageEl.style.display = `block`;
mainImageEl.style.margin = `auto`;
mainImageEl.style.width = `50%`;

[...imageAEls].map(imageAEl=>{
    imageAEl.addEventListener(`click`, ()=>{
        const previewEl = document.querySelector(`#Sva75c > div > div > div.pxAole > div.tvh9oe.BIB1wf > \
        c-wiz > div.OUZ5W > div.zjoqD > div > div.v4dQwb > a > img`);
        if (!previewEl) {
            return;
        }

        mainImageEl.src = previewEl.src;
    });
});

function clickTag(index, interval = 5 * 1000) {
    if (index >= imageAEls.length || imageAEls[index].tagName !== `A`) {
        return;
    }

    imageAEls[index].click();
    setTimeout(()=>clickTag(index+1), interval);
}

function init(on = true, interval = 5 * 1000) {
    if (!on) {
        return;
    }
    setTimeout(()=>clickTag(0, interval), 5);

    document.body.appendChild(layer);
    layer.appendChild(mainImageEl);
}

init();
