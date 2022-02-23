document.querySelector(`#start`).addEventListener(`click`, () => {
  chrome.storage.local.set({query: 'bar'});
});
