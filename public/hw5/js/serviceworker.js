if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../sw.js')
    .then(function(registration) {
    })
    .catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
}
