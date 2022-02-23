document.querySelector(`#start`).addEventListener(`click`, () => {
  const query = document.querySelector(`#searchbar`).value;
  if (query) {
    chrome.storage.local.set({query: query});
  }
});
