// 원본 이미지 observer
const originImageObserver = new MutationObserver(originMutationCallback);
const originImageTargetNode = document.getElementById(`Sva75c`);
const config = { attributes: true, subtree: true };
// 무한 스크롤 observer
const scrollObserver = new MutationObserver(scrollMutationCallback);
const scrollTargetNode = document.querySelector(`#islmp`);
const scrollConfig = { attributes: true, subtree: true };
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

const SEC = 1000;
// 구글 이미지 검색 페이지에서만 동작하도록
const imageSeletor = `#islrg > div.islrc > div > a.wXeWr.islib.nfEiy > div.bRMDJf.islir > img`;
const originImageSeletor = `#Sva75c > div > div > div.pxAole > div.tvh9oe.BIB1wf > c-wiz > div > div.OUZ5W > div.zjoqD > div.qdnLaf.isv-id > div > a > img`;
  
// global variable
const RestTimeIds = [];
let START_STATUS=false;
let CUR_INDEX = 0;
let SETTING_TIME = 5;
let REST_SEC = SETTING_TIME;
let CacheImageEls = document.querySelectorAll(imageSeletor);


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

function initRestTime() {
  restTimeEl.style.color = `gainsboro`;
  restTimeEl.style.fontFamily = `Raleway,sans-serif`;
  restTimeEl.style.fontSize = `1rem`;
}

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
    startTimer(CUR_INDEX, SETTING_TIME);
  });
}

function appendChilds() {
  layer.appendChild(restTimeEl);
  layer.appendChild(closeBtn);
  layer.appendChild(mainImageEl);
  layer.appendChild(btnWrapper);
  layer.appendChild(timeSelectEl);
  document.body.appendChild(layer);
}

function parseTime(second) {
  let minute = Math.floor(second / 60);
  let sec = second % 60;
  minute = minute.toString().padStart(2, '0');
  sec = sec.toString().padStart(2, `0`);
  time = minute + `:` + sec + `   index : ` + CUR_INDEX.toString();
  return time;
}

function setRestTime(second) {
  restTimeEl.innerHTML = parseTime(second);
}

function clearTimes() {
  while (RestTimeIds.length) {
    clearInterval(RestTimeIds.pop());
  }
}
// 1초마다 시간 시간 감소 -> 0 이면 다음 이미지 실행
function intervalTimer() {
  if (REST_SEC <= 0) {
    // 다음 이미지에서 시작
    clearTimes();
    startTimer(CUR_INDEX + 1, SETTING_TIME);
    return;
  }
  REST_SEC--;
  setRestTime(REST_SEC);
}

function startInterval(second) {
  clearTimes();
  REST_SEC = second;
  const restTimeId = setInterval(() => intervalTimer(), SEC);
  RestTimeIds.push(restTimeId);
}

function startTimer(index, second) {
  setRestTime(second);
  CUR_INDEX = index;
  stopBtn.value = `false`;

  if (
    index >= CacheImageEls.length ||
    CacheImageEls[index] === undefined
  ) {
    clearTimeout();
    return;
  }
  CacheImageEls[index].click();
  startInterval(second);
  return;
}

function getPrev() {
  if (CUR_INDEX === 0) {
    return;
  }
  CUR_INDEX--;
  clearTimes();
  startTimer(CUR_INDEX, SETTING_TIME);
}

function getNext() {
  if (CUR_INDEX >= CacheImageEls.length) {
    return;
  }
  CUR_INDEX++;
  clearTimes();
  startTimer(CUR_INDEX, SETTING_TIME);
}

function stopTimer() {
  if (stopBtn.value === `true`) {
    // continue
    startTimer(CUR_INDEX, REST_SEC);
    stopBtn.value = `false`;
  } else {
    // stop
    clearTimes();
    stopBtn.value = `true`;
  }
}

function init(status, startIndex) {
  if (CacheImageEls.length === 0) {
    return;
  }
  if (status) {
    layer.style.visibility = `visible`;
    document.body.style.overflow = 'hidden';
    startTimer(startIndex, SETTING_TIME);
  } else {
    layer.style.visibility = `hidden`;
    document.body.style.overflow = 'visible';
    clearTimes();
  }
}

function setCacheImageEls() {
  CacheImageEls = document.querySelectorAll(imageSeletor);
  [...CacheImageEls].map((imageAEl, index) => {
    imageAEl.addEventListener(`click`, () => {
      CUR_INDEX = index;
      mainImageEl.style.backgroundImage = `url(${CacheImageEls[index].src})`;
    });
  });
}

function originMutationCallback(mutationsList, observer) {
  let originImageMutaion;

  for (let mutation of mutationsList) {
    if (mutation.type === `attributes`) {
      if (
        mutation.target &&
        mutation.target.tagName === `IMG` &&
        mutation.target.className === `n3VNCb` &&
        mutation.attributeName === `src`
      ) {
        originImageMutaion = mutation;
      }
    }
  }

  if (originImageMutaion?.target) {
    setTimeout(()=>{
      mainImageEl.style.backgroundImage = `url(${originImageMutaion.target.currentSrc})`;
    },10);
  }
}

function scrollMutationCallback(mutationsList, observer) {
  let scroollMutaion;
  for (let mutation of mutationsList) {
    if (
      mutation.target &&
      mutation.attributeName === `data-os`
    ) {
      scroollMutaion = mutation;
    }
  }

  if (scroollMutaion) {
    let tmpImageEls = document.querySelectorAll(
      imageSeletor
    );
    if (tmpImageEls?.length > CacheImageEls.length) {
      console.log(`more`);
      setCacheImageEls() ;
    }
  }
}

// 옵저버 시작 & 초기화
if (CacheImageEls.length) {
  initLayer();
  initRestTime();
  initMainImage();
  initBtn();
  initSelectBox();
  appendChilds();
  setCacheImageEls();
  originImageObserver.observe(originImageTargetNode, config);
  scrollObserver.observe(scrollTargetNode, scrollConfig);
}
  
chrome.storage.local.get([`status`], function (result) {
  if (result.length === 0 || result[`status`] === false) {
    START_STATUS = false;
  } else {
    START_STATUS = true;
  }
  init(START_STATUS, CUR_INDEX);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (const key in changes) {
    if (key === `status`) {
      const storageChange = changes[key];
      START_STATUS = storageChange.newValue;
      init(START_STATUS, CUR_INDEX);
    }
  }
});
