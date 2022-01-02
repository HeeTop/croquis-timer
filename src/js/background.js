chrome.storage.local.set({status: false}, function() {
  console.log('init storage');
});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.local.get(['status'], function(result) {
    if (result.length === 0) {
      chrome.storage.local.set({status: false}, function() {
        console.log('init storage');
      });
      return;
    }

    chrome.storage.local.set({status: !result[`status`]}, function() {
      console.log('switch status');
    });
  });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  const statusChange = changes[`status`];
  if (statusChange) {
    if (statusChange.oldValue == statusChange.newValue) {
      return
    }
    // 전체 화면 설정
    chrome.windows.getCurrent(function(curWindow) {
      // 크로키 시작
      if (statusChange.newValue) {
        // 전체 화면 여부 저장
        chrome.storage.local.set({winStatus: curWindow.state});
        chrome.windows.update(curWindow.id, { state: `fullscreen` });
      } else {
        chrome.storage.local.get(['winStatus'], function(result) {
          if (result.length === 0) {
            return;
          }
          chrome.windows.update(curWindow.id, { state: result[`winStatus`] });
        });
      }
    });
  }
});
