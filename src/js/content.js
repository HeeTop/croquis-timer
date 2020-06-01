const observer = new MutationObserver(mutationCallback);
const imageAEls = document.querySelectorAll(`#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd`);
const mainImageEl = document.createElement(`img`);
const layer = document.createElement(`div`);
const restTimeEl = document.createElement(`div`);
const preBtn = document.createElement(`button`);
const nextBtn = document.createElement(`button`);
let timeIds = [];
let restTimeIds = [];
let interval = 5*1000;
let preImageUrls = [];

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
  document.body.appendChild(layer);
}
initLayer();

function initRestTime() {
  restTimeEl.style.color = `white`;
  layer.appendChild(restTimeEl);
}
initRestTime();

function initMainImage() {
  mainImageEl.style.display = `block`;
  mainImageEl.style.margin = `auto`;
  mainImageEl.style.width = `50%`;
  layer.appendChild(mainImageEl);
}
initMainImage();

function initBtn() {
  preBtn.innerText = `pre`;
  nextBtn.innerText = `next`;
  layer.appendChild(preBtn);
  layer.appendChild(nextBtn);
}
initBtn();

function updateRestTime(interval) {
  while(restTimeIds.length) {
    clearInterval(restTimeIds.pop());
  }
  let restTime = 0;
  
  restTimeId = setInterval(function() {
    restTime++;
    restTimeEl.innerHTML = restTime + `s`;
    
    if (restTime * 1000 > interval) {
      restTime = 0;
    }
  }, 1000);
  restTimeIds.push(restTimeId);
}

function clickNextTimeout(index, interval) {
  updateRestTime(interval);
  if (index >= imageAEls.length || imageAEls[index].tagName !== `A`) {
    return;
  }
  const cacheImageEl = imageAEls[index].querySelector(`div.bRMDJf.islir > img`);

  imageAEls[index].click();
  if (cacheImageEl) {
    mainImageEl.src = cacheImageEl.src;
    preImageUrls.push(cacheImageEl.src);
  }

  timeId = setTimeout(()=>clickNextTimeout(index+1, interval), interval);
  timeIds.push(timeId);
}

function init(status, interval) {
  preImageUrls = [];

  if (status) {
    observer.observe(targetNode, config);
    layer.style.visibility = `visible`;
    imageAEls[0].click();
    timeId = setTimeout(()=>clickNextTimeout(1, interval), 100);
    timeIds.push(timeId);
    updateRestTime(interval);
    return;
  } else{
    observer.disconnect();
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

const targetNode = document.getElementById('Sva75c');
const imageSet = new Set();
const config = { attributes: true, subtree: true };

function mutationCallback(mutationsList, observer) {
  let lastMutaion;
  console.log("Callback!!" + mutationsList.length);
  for(let mutation of mutationsList) {
    if (mutation.type === 'attributes') {
      if (mutation.target 
        && mutation.target.tagName === `IMG`
        && mutation.target.className === `n3VNCb`
        && mutation.attributeName === `src`) {
        lastMutaion = mutation;
      }
    }
  }
  if (lastMutaion && lastMutaion.target) {
    if (!imageSet.has(lastMutaion.target.currentSrc)) {
      preImageUrls.pop();
      preImageUrls.push(lastMutaion.target.currentSrc);
      mainImageEl.src = lastMutaion.target.currentSrc;
      imageSet.add(lastMutaion.target.currentSrc);
    }
  } 
};


