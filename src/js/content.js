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

const image = document.createElement("img");
image.src = `https://lh3.googleusercontent.com/proxy/xmxrPSyYqHbwTKMHCyebJnkcjjb-wFZl_bj6cA922jhh4JgTrI_ku9gXfDgyy1M0G2lqIBgomf5bajhu9SO5keWsKlPjO0kFtcHKXKQICuNIpY36OlvlftwWM-FoJkhlPqdrX5JBn23eIZrYbSAsvcDD3UlNX6jjtKW1lmsw8ggLI3BDgrRD0iV5tJVOQ_Heue22Yc7V2y76yyMpgbQ0M5A8HB-jqn32OUHnKZpaB1QW7fZomojbuFf79IQEVNh9XmIcetezPL1AbsbNKg2_XJhqvk1QyAXzxwrUpnQDdNOnlY7JHek1khQNhUbYM_Go69S0NhJUhQ`;
// document.body.appendChild(layer);
// layer.appendChild(image);
