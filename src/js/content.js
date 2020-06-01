const imageAEls = document.querySelectorAll(`#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd`);
const mainImageEl = document.createElement(`img`);
const layer = document.createElement(`div`);
const restTimeEl = document.createElement(`div`);
let timeIds = [];
let restTimeIds = [];
let interval = 30*1000;

function initLayer() {
  layer.id = `croquisTimerLayer`;
  layer.style.position = `absolute`;
  layer.style.top = `0`;
  layer.style.left = `0`;
  layer.style.width = `100%`;
  layer.style.height = `100%`;
  layer.style.zIndex = `1147483646`;
  layer.style.backgroundColor = `black`;
  layer.style.visibility = `hidden`;
  layer.style.position = `fixed`;
}
initLayer();

function initRestTime() {
  restTimeEl.style.color = `white`;
}
initRestTime();

function initMainImage() {
  mainImageEl.style.display = `block`;
  mainImageEl.style.margin = `auto`;
  mainImageEl.style.width = `50%`;
}
initMainImage();

document.body.appendChild(layer);
layer.appendChild(restTimeEl);
layer.appendChild(mainImageEl);

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

function updateRestTime() {
  while(restTimeIds.length) {
    clearInterval(restTimeIds.pop());
  }
  let restTime = 0;
  
  restTimeId = setInterval(function() {
    restTime++;
    restTimeEl.innerHTML = restTime + `s`;
    
    if (restTime * 1000 >= interval) {
      restTime = 0;
    }
  }, 1000);
  restTimeIds.push(restTimeId);
}

function clickNextTimeout(index, interval) {
  console.log(interval);
  if (index >= imageAEls.length || imageAEls[index].tagName !== `A`) {
    return;
  }
  imageAEls[index].click();
  timeId = setTimeout(()=>clickNextTimeout(index+1, interval), interval);
  timeIds.push(timeId);
}

function init(status, interval) {
  console.log(interval);
  if (status) {
    imageAEls[0].click();
    timeId = setTimeout(()=>clickNextTimeout(1, interval), 100);
    timeIds.push(timeId);
    updateRestTime();

    layer.style.visibility = `visible`;
    return;
  } else{
    layer.style.visibility = `hidden`;

    while(timeIds.length) {
      clearTimeout(timeIds.pop());
    }
    while(restTimeIds.length) {
      clearInterval(restTimeIds.pop());
    }
  }
}

chrome.storage.local.get(['status'], function(result) {
  if (result.length === 0 || result[`status`] === false) {
    init(false, interval);
  } else {
    init(true, interval);
  }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (const key in changes) {
    if (key === `status`) {
      const storageChange = changes[key];
      init(storageChange.newValue, interval);
    }
  }
});
