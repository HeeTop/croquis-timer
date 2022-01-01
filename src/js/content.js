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
const timeSelectEl = document.createElement(`select`);

const imageSeletor = `#islrg > div.islrc > div > a.wXeWr.islib.nfEiy > div.bRMDJf.islir > img`
const originImageSeletor = `#Sva75c > div > div > div.pxAole > div.tvh9oe.BIB1wf > c-wiz > div > div.OUZ5W > div.zjoqD > div.qdnLaf.isv-id > div > a > img`
const restTimeIds = [];
const SEC = 1000;
const originImageUrls = {}
const imageUrls = {};
let curIndex = 0;
let cacheImageEls = document.querySelectorAll(
  imageSeletor
);
let SETTING_TIME = 5;
let RestTime = SETTING_TIME;

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
  preBtn.addEventListener(`click`, () => getPrev());
  nextBtn.innerText = `next`;
  nextBtn.addEventListener(`click`, () => getNext());
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

function initSelectBox() {
  timeSelectEl.innerHTML = `<option value=15>15 sec</option>
                            <option value=30>30 sec</option>
                            <option value=60>1 min</option>
                            <option value=120>2 min</option>
                            <option value=300>5 min</option>
                            <option value=600>10 min</option>
                            <option value=900>15 min</option>
                            <option value=1800>30 min</option>`;
  timeSelectEl.addEventListener(`change`, ({ target: { selectedIndex } }) => {
    SETTING_TIME = parseInt(timeSelectEl.options[selectedIndex].value);
    startTimer(curIndex, SETTING_TIME);
  });
}
initSelectBox();

function appendChilds() {
  layer.appendChild(restTimeEl);
  layer.appendChild(closeBtn);
  layer.appendChild(mainImageEl);
  layer.appendChild(btnWrapper);
  layer.appendChild(timeSelectEl);
  document.body.appendChild(layer);
}
appendChilds();

function parseTime(second) {
  let minute = Math.floor(second / 60);
  let sec = second % 60;
  minute = minute.toString().padStart(2, '0');
  sec = sec.toString().padStart(2, `0`);
  time = minute + `:` + sec + `   index : ` + curIndex.toString();
  return time;
}
function setRestTime(second) {
  restTimeEl.innerHTML = parseTime(second);
}

function clearTimes() {
  while (restTimeIds.length) {
    clearInterval(restTimeIds.pop());
  }
}

function intervalTimer() {
  if (RestSecond <= 0) {
    // next image
    clearTimes();
    startTimer(curIndex + 1, SETTING_TIME);
    return;
  }
  RestSecond--;
  setRestTime(RestSecond);
}

function startInterval(second) {
  clearTimes();
  RestSecond = second;
  restTimeId = setInterval(() => intervalTimer(), SEC);
  restTimeIds.push(restTimeId);
}

function startTimer(index, second) {
  setRestTime(second);
  curIndex = index;
  stopBtn.value = `false`;
  // updateImageAEl();
  if (
    index >= cacheImageEls.length ||
    cacheImageEls[index] === undefined
  ) {
    clearTimeout();
    return;
  }
  const cacheImageEl = cacheImageEls[index];
  console.log(index)
  if (!(index in originImageUrls)) {
    console.log("no cache!!");
    if (imageUrls[index]) {
      mainImageEl.style.backgroundImage = `url(${imageUrls[index]})`;
    } else {
      cacheImageEls[index].click();
      // 중간에서 처음 시작한 경우 원본 이미지 열려있음
      let originImageEl = document.querySelector(originImageSeletor);
      
      if (originImageEl) {
        originImageUrls[index] = originImageEl.src;
      } else if (cacheImageEl) {
        originImageUrls[index] = cacheImageEl.src;
      }
    }
  } 
  imageUrls[index] = originImageUrls[index];
  mainImageEl.style.backgroundImage = `url(${imageUrls[index]})`;

  startInterval(second);
  return;
}

function getPrev() {
  if (curIndex === 0) {
    return;
  }
  curIndex--;
  clearTimes();
  startTimer(curIndex, SETTING_TIME);
}

function getNext() {
  if (curIndex >= cacheImageEls.length) {
    return;
  }
  curIndex++;
  clearTimes();
  startTimer(curIndex, SETTING_TIME);
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
  if (cacheImageEls.length === 0) {
    return;
  }
  if (status) {
    layer.style.visibility = `visible`;
    startTimer(startIndex, SETTING_TIME);
  } else {
    // observer.disconnect();
    layer.style.visibility = `hidden`;
    clearTimes();
  }
}

[...cacheImageEls].map((imageAEl, index) => {
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
    imageUrls[curIndex] = lastMutaion.target.currentSrc;
    mainImageEl.style.backgroundImage = `url(${imageUrls[curIndex]})`;
    originImageUrls[curIndex] = imageUrls[curIndex];
  }
}
observer.observe(targetNode, config);
  
chrome.storage.local.get([`status`], function (result) {
  if (result.length === 0 || result[`status`] === false) {
    init(false, SETTING_TIME, curIndex);
  } else {
    init(true, SETTING_TIME, curIndex);
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (const key in changes) {
    if (key === `status`) {
      const storageChange = changes[key];
      init(storageChange.newValue, SETTING_TIME, curIndex);
    }
  }
});
