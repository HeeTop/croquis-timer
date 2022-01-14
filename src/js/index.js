document.querySelector(`#start`).addEventListener(`click`, () => {
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
