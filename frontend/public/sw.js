console.log('Service worker: cargado - version 1');

self.addEventListener('install', function (event) {
    console.log('Evento install del Service Worker');
});

self.addEventListener('activate', (event) => {
    console.log('Evento activate del Service Worker');
})

self.addEventListener('fetch', (event) => {
    console.log('Evento fetch: ', event.request.url);
})