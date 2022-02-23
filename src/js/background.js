const URL_HEAD = `https://www.google.com/search?q=`;
const URL_TAIL = `&newwindow=1&hl=en&sxsrf=APq-WBvDEv1q59l71d9a-17jhvopn1ZQmw:1645615769499&source=lnms&tbm=isch&sa=X&ved=2ahUKEwizuIK73JX2AhUG4WEKHcVmBDgQ_AUoAXoECAEQAw&biw=2560&bih=1304&dpr=2`;

chrome.storage.onChanged.addListener(function(changes, namespace) {
  const queryChange = changes[`query`];
  if (queryChange.newValue) {
    if (queryChange.oldValue == queryChange.newValue) {
      return;
    }
    const requestURL = [URL_HEAD, queryChange?.newValue, URL_TAIL].join(``);
    chrome.tabs.create({ url: requestURL}, tab=>{
      chrome.storage.local.set({tab: tab});
      // 쿼리 초기화
      chrome.storage.local.set({query: null});
    });
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.q == `requestTabId`) {
      sendResponse(sender.tab.id);
   }
});
