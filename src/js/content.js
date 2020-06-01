const observer = new MutationObserver(mutationCallback);
const targetNode = document.getElementById('Sva75c');
const config = { attributes: true, subtree: true };
// element
const imageAEls = document.querySelectorAll(`#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd`);
const mainImageEl = document.createElement(`img`);
const layer = document.createElement(`div`);
const restTimeEl = document.createElement(`div`);
const btnWrapper = document.createElement(`div`);
const preBtn = document.createElement(`button`);
const nextBtn = document.createElement(`button`);
const timeIds = [];
const restTimeIds = [];
let curIndex = 0;
let imageSet = new Set();
let imageUrls = [];
let interval = 5*1000;

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
  preBtn.addEventListener(`click`, ()=>getPrev(interval));
  nextBtn.innerText = `next`;
  nextBtn.addEventListener(`click`, ()=>getNext(interval));
  btnWrapper.style.bottom = `100px`;
  btnWrapper.style.position = `fixed`;
  layer.appendChild(btnWrapper);
  btnWrapper.appendChild(preBtn);
  btnWrapper.appendChild(nextBtn);
}
initBtn();

function updateRestTime(interval) {
  while(restTimeIds.length) {
    clearInterval(restTimeIds.pop());
  }
  let restTime = 0;
  
  restTimeId = setInterval(function() {
    restTime++;
    restTimeEl.innerHTML = (interval/1000 - restTime) + `s`;
    
    if (restTime * 1000 > interval) {
      restTime = 0;
    }
  }, 1000);
  restTimeIds.push(restTimeId);
}

function clickNextTimeout(index, interval) {
  curIndex = index - 1;
  updateRestTime(interval);
  if (index >= imageAEls.length || imageAEls[index].tagName !== `A`) {
    return;
  }
  const cacheImageEl = imageAEls[index].querySelector(`div.bRMDJf.islir > img`);

  if (curIndex >= imageUrls.length) {
    imageAEls[index].click();
    if (cacheImageEl) {
      mainImageEl.src = cacheImageEl.src;
      imageUrls.push(cacheImageEl.src);
    }
  } else{
    mainImageEl.src = imageUrls[curIndex];
  }
  timeId = setTimeout(()=>clickNextTimeout(index+1, interval), interval);
  timeIds.push(timeId);
}

function getPrev(interval) {
  if (curIndex === 0) {
    return;
  }
  curIndex--;
  while(timeIds.length) {
    clearTimeout(timeIds.pop());
  }
  while(restTimeIds.length) {
    clearInterval(restTimeIds.pop());
  }
  mainImageEl.src = imageUrls[curIndex];
  timeId = setTimeout(()=>clickNextTimeout(curIndex + 1, interval), 100);
  timeIds.push(timeId);
  updateRestTime(interval);
}

function getNext(interval) {
  if (curIndex >= imageAEls.length) {
    return;
  }
  curIndex++;
  while(timeIds.length) {
    clearTimeout(timeIds.pop());
  }
  while(restTimeIds.length) {
    clearInterval(restTimeIds.pop());
  }
  if (curIndex >= imageUrls.length) {
    imageAEls[curIndex].click();
  } else {
    mainImageEl.src = imageUrls[curIndex];
  }
  timeId = setTimeout(()=>clickNextTimeout(curIndex + 1, interval), 100);
  timeIds.push(timeId);
  updateRestTime(interval);
}

function init(status, interval, startIndex = 0) {
  imageUrls = [];
  imageSet = new Set();
  if (imageAEls.length === 0) {
    return;
  }
  if (status) {
    observer.observe(targetNode, config);
    layer.style.visibility = `visible`;
    imageAEls[startIndex].click();
    timeId = setTimeout(()=>clickNextTimeout(startIndex + 1, interval), 100);
    timeIds.push(timeId);
    updateRestTime(interval);
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

function mutationCallback(mutationsList, observer) {
  let lastMutaion;

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
      imageUrls.pop();
      imageUrls.push(lastMutaion.target.currentSrc);
      mainImageEl.src = lastMutaion.target.currentSrc;
      imageSet.add(lastMutaion.target.currentSrc);
    }
  } 
};

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
