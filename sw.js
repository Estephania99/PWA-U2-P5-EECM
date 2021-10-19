const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

var _window = this || self || window;
let url = _window.location.href;
const PATH = '/PWA-U2-P5-EECM';

function cleanCache(cacheName, sizeItem){
    caches.open(cacheName).then((cache)=>{
        cache.keys().then((keys)=>{
            console.log(keys);
            if(keys.length >= sizeItem){
                cache.delete(keys[0]).then(
                    cleanCache(cacheName, sizeItem)
                );
            }
        });
    });
}

self.addEventListener('install', (event)=>{
    // Crear caché y almacenar nuestro APPSHELL (tdo lo que ocupa la app para que se pueda ejecutar)
    const promesaCache = caches.open(CACHE_STATIC_NAME).then((cache)=>{
        if(url.includes('localhost')){
            return cache.addAll([
                '/',
                '/index.html',
                '/css/page.css',
                '/img/inicio.jpg',
                '/img/noimage.jpg',
                '/js/app.js',
                '/pages/view-offline.html'
            ]);
        }else{
            return cache.addAll([
                PATH + '/',
                PATH + 'index.html',
                PATH + 'css/page.css',
                PATH + 'img/inicio.jpg',
                PATH + 'img/noimage.jpg',
                PATH + 'js/app.js',
                PATH + 'pages/view-offline.html'
            ]);
        }
    });

    const promInmutable = caches.open(CACHE_INMUTABLE_NAME).then((cacheIn)=>{
        return cacheIn.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css'
        ]);
    });

    

    event.waitUntil(Promise.all([promesaCache, promInmutable]));
});

self.addEventListener('activate', (event)=>{
    const resDelCache = caches.keys().then((keys) =>{
        keys.forEach(key => {
            if(key !== CACHE_STATIC_NAME && key.includes('static')){
                return caches.delete(key);
            }
        })

    });

    event.waitUntil(resDelCache)
})

self.addEventListener('fetch', (event)=>{

    // 3.- Nerwork with cache fallback
    /*const respuesta = fetch(event.request).then((res) =>{
        if(!res){
            //aquí se retorno la respuesta generica
            return caches.match(event.request).then((resCache) =>{
                console.log(resCache);
                return resCache;
            }).catch((error) =>{
                console.log(error);
            })
        }

        caches.open(CACHE_DYNAMIC_NAME).then((cache) =>{
            cache.put(event.request, res);
            cleanCache(CACHE_DYNAMIC_NAME, 5);
        })
        return res.clone();
    }).catch((error) =>{
        // Excepción en el fetch
        // Tratar de retornar algo que está en caché

        //aquí se retorno la respuesta generica
        return caches.match(event.request).then((resCache) =>{
            console.log(resCache);
            return resCache;
        }).catch((error) =>{
            console.log(error);
        })
    });

    event.respondWith(respuesta);*/

    // 2.- Cache with network fallback
    // Primero busca caché y si no lo encuentra va a la red
    const respuestaCache = caches.match(event.request).then((resp)=>{
        // Si mi request existe en cache
        console.log(event.request);
        if(resp){
            //respondemos con cache
            return resp;
        }
        console.log('No está en caché', event.request.url);
        // voy a la red
        return fetch(event.request).then((respuestaNetwork)=>{
            // abro cache
            caches.open(CACHE_DYNAMIC_NAME).then((cache)=>{
                // guardo la respuesta de la red en cache
                cache.put(event.request, respuestaNetwork).then(()=>{
                    cleanCache(CACHE_DYNAMIC_NAME, 4)
                });
                
            });
            // respondo con el response de la red
            return respuestaNetwork.clone();
        }).catch(()=>{
            console.log('Error al solicitar el recurso');

            if(event.request.headers.get('accept').includes('text/html')){
                return caches.match('/pages/view-offline.html')
            }

            if(event.request.headers.get('accept').includes('image')){
                console.log('Imagen no encontrada');
                return caches.match('/img/noimage.jpg')
            }

        });
    });
    event.respondWith(respuestaCache);


    // 1.- Only cache
    //event.respondWith(caches.match(event.request));
});