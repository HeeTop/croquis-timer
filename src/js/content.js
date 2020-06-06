const observer = new MutationObserver(mutationCallback);
const targetNode = document.getElementById(`Sva75c`);
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
let imageUrls = new Array(1000);
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

function clearTimes() {
  while(timeIds.length) {
    clearTimeout(timeIds.pop());
  }
  while(restTimeIds.length) {
    clearInterval(restTimeIds.pop());
  }
}

function startTimer(index, interval) {
  curIndex = index;
  updateRestTime(interval);
  if (index >= imageAEls.length || imageAEls[index] === undefined || imageAEls[index].tagName !== `A`) {
    clearTimes();
    return;
  }
  const cacheImageEl = imageAEls[index].querySelector(`div.bRMDJf.islir > img`);

  if (imageUrls[curIndex]) {
    mainImageEl.src = imageUrls[curIndex];
  } else {
    imageAEls[index].click();
    if (cacheImageEl) {
      imageUrls[curIndex] = cacheImageEl.src;
      mainImageEl.src = imageUrls[curIndex];
    }
  }
  timeId = setTimeout(()=>startTimer(index+1, interval), interval);
  timeIds.push(timeId);
}

function getPrev(interval) {
  if (curIndex === 0) {
    return;
  }
  curIndex--;
  clearTimes();
  startTimer(curIndex, interval);
}

function getNext(interval) {
  if (curIndex >= imageAEls.length) {
    return;
  }
  curIndex++;
  clearTimes();
  startTimer(curIndex, interval);
}

function init(status, interval, startIndex = 0) {
  imageUrls = new Array(1000);
  imageSet = new Set();
  if (imageAEls.length === 0) {
    return;
  }
  if (status) {
    observer.observe(targetNode, config);
    layer.style.visibility = `visible`;
    imageAEls[startIndex].click();
    startTimer(startIndex, interval);
  } else{
    observer.disconnect();
    layer.style.visibility = `hidden`;
    clearTimes();
  }
}

function mutationCallback(mutationsList, observer) {
  let lastMutaion;

  for(let mutation of mutationsList) {
    if (mutation.type === `attributes`) {
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
      imageUrls[curIndex] = lastMutaion.target.currentSrc;
      mainImageEl.src = imageUrls[curIndex];
      imageSet.add(imageUrls[curIndex]);
    }
  } 
};

chrome.storage.local.get([`status`], function(result) {
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
