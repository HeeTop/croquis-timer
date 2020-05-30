// const imageUrls = document.querySelectorAll(`#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd > div.bRMDJf.islir > img`);
const imageTags = document.querySelectorAll(`#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd`);

[...imageTags].map(imageTags=>{
    imageTags.addEventListener("click", ()=>{
        console.log(document.querySelector(`#Sva75c > div > div > div.pxAole > div.tvh9oe.BIB1wf > c-wiz > div.OUZ5W > div.zjoqD > div > div.v4dQwb > a > img`));
    });
});

function clickTag(index, interval = 5 * 1000) {
    if (index >= imageTags.length || imageTags[index].tagName !== `A`) {
        return;
    }

    imageTags[index].click();
    setTimeout(()=>clickTag(index+1), interval);
}

setTimeout(()=>clickTag(0), 5000);
