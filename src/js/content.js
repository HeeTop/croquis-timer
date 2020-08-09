const observer = new MutationObserver(mutationCallback);
const targetNode = document.getElementById(`Sva75c`);
const config = { attributes: true, subtree: true };
// element
const mainImageEl = document.createElement(`div`);
const layer = document.createElement(`div`);
const restTimeEl = document.createElement(`span`);
const btnWrapper = document.createElement(`div`);
const preBtn = document.createElement(`button`);
const nextBtn = document.createElement(`button`);
const stopBtn = document.createElement(`button`);
const closeBtn = document.createElement(`button`);
const timeIds = [];
const restTimeIds = [];
const date = new Date(0);

let curIndex = 0;
let imageSet = new Set();
let imageUrls = new Array(1000);
let imageAEls = document.querySelectorAll(
  `#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd`
);
const SECOND = 5;
const SEC = 1000;
let RestSecond = SECOND;

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
  restTimeEl.style.color = `gainsboro`;
  restTimeEl.style.fontFamily = `Raleway,sans-serif`;
  restTimeEl.style.fontSize = `1rem`;
}
initRestTime();

function initMainImage() {
  mainImageEl.style.display = `block`;
  mainImageEl.style.width = `50%`;
  // 마크업 완료 후 50px 그에 맞게 수정 필요
  mainImageEl.style.height = `calc(100% - 50px)`;
  mainImageEl.style.margin = `0 auto`;
  mainImageEl.style.backgroundSize = `contain`;
  mainImageEl.style.backgroundRepeat = `no-repeat`;
  mainImageEl.style.backgroundPosition = `center`;
}
initMainImage();

function initBtn() {
  closeBtn.innerText = `X`;
  closeBtn.style.position = `absolute`;
  closeBtn.style.right = `0px`;
  closeBtn.style.top = `0px`;
  closeBtn.addEventListener(`click`, () => {
    chrome.storage.local.set({ status: false });
  });
  preBtn.innerText = `pre`;
  preBtn.addEventListener(`click`, () => getPrev(interval));
  nextBtn.innerText = `next`;
  nextBtn.addEventListener(`click`, () => getNext(interval));
  stopBtn.innerText = `stop`;
  stopBtn.value = `false`;
  stopBtn.addEventListener(`click`, () => stopTimer());
  btnWrapper.style.bottom = `100px`;
  btnWrapper.style.position = `fixed`;
  btnWrapper.appendChild(preBtn);
  btnWrapper.appendChild(nextBtn);
  btnWrapper.appendChild(stopBtn);
}
initBtn();

function appendChilds() {
  layer.appendChild(restTimeEl);
  layer.appendChild(closeBtn);
  layer.appendChild(mainImageEl);
  layer.appendChild(btnWrapper);
  document.body.appendChild(layer);
}
appendChilds();

function setRestTime(second) {
  console.log(second);
  date.setSeconds(second);
  const timeString = date.toISOString().substr(14, 5);
  restTimeEl.innerHTML = timeString;
}

function clearTimes() {
  while (timeIds.length) {
    clearTimeout(timeIds.pop());
  }
  while (restTimeIds.length) {
    clearInterval(restTimeIds.pop());
  }
}

function updateImageAEl() {
  if (curIndex < imageAEls.length - 5) {
    return;
  }
  const oldLength = imageAEls.length;

  imageAEls = document.querySelectorAll(
    `#islrg > div.islrc > div > a.wXeWr.islib.nfEiy.mM5pbd`
  );
  [...imageAEls].slice(oldLength).map((imageAEl, index) => {
    imageAEl.addEventListener(`click`, () => {
      curIndex = index + oldLength;
    });
  });
}

function intervalTimer() {
  if (RestSecond < 0) {
    while (restTimeIds.length) {
      clearInterval(restTimeIds.pop());
    }
    startTimer(curIndex + 1, SECOND);
  }
  setRestTime(RestSecond);
  RestSecond--;
}

function startTimer(index, second) {
  curIndex = index;
  stopBtn.value = `false`;
  updateImageAEl();
  if (
    index >= imageAEls.length ||
    imageAEls[index] === undefined ||
    imageAEls[index].tagName !== `A`
  ) {
    clearTimeout();
    return;
  }
  const cacheImageEl = imageAEls[index].querySelector(`div.bRMDJf.islir > img`);

  if (imageUrls[curIndex]) {
    mainImageEl.style.backgroundImage = `url(${imageUrls[curIndex]})`;
  } else {
    imageAEls[index].click();
    if (cacheImageEl) {
      imageUrls[curIndex] = cacheImageEl.src;
      mainImageEl.style.backgroundImage = `url(${imageUrls[curIndex]})`;
    }
  }
  RestSecond = second;
  restTimeId = setInterval(()=>intervalTimer(), SEC);
  restTimeIds.push(restTimeId);
  return;
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

function stopTimer() {
  if (stopBtn.value === `true`) {
    // continue
    startTimer(curIndex, RestSecond);
    stopBtn.value = `false`;
  } else {
    // stop
    clearTimes();
    stopBtn.value = `true`;
  }
}

function init(status, interval, startIndex) {
  imageUrls = new Array(1000);
  imageSet = new Set();

  if (imageAEls.length === 0) {
    return;
  }
  if (status) {
    observer.observe(targetNode, config);
    layer.style.visibility = `visible`;
    startTimer(startIndex, SECOND);
  } else {
    observer.disconnect();
    layer.style.visibility = `hidden`;
    clearTimes();
  }
}

[...imageAEls].map((imageAEl, index) => {
  imageAEl.addEventListener(`click`, () => {
    curIndex = index;
  });
});

function mutationCallback(mutationsList, observer) {
  let lastMutaion;

  for (let mutation of mutationsList) {
    if (mutation.type === `attributes`) {
      if (
        mutation.target &&
        mutation.target.tagName === `IMG` &&
        mutation.target.className === `n3VNCb` &&
        mutation.attributeName === `src`
      ) {
        lastMutaion = mutation;
      }
    }
  }
  if (lastMutaion && lastMutaion.target) {
    if (!imageSet.has(lastMutaion.target.currentSrc)) {
      imageUrls[curIndex] = lastMutaion.target.currentSrc;
      mainImageEl.style.backgroundImage = `url(${imageUrls[curIndex]})`;
      imageSet.add(imageUrls[curIndex]);
    }
  }
}

chrome.storage.local.get([`status`], function (result) {
  if (result.length === 0 || result[`status`] === false) {
    init(false, SECOND, curIndex);
  } else {
    init(true, SECOND, curIndex);
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (const key in changes) {
    if (key === `status`) {
      const storageChange = changes[key];
      init(storageChange.newValue, SECOND, curIndex);
    }
  }
});
