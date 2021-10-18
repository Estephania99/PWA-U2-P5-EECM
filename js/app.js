let url = window.location.href;
let swDirectory = "/PWA-U2-P5-EECM/sw.js"


if(navigator.serviceWorker){
    if(url.includes('localhost')){
        navigator.serviceWorker.register('/sw.js');
    }else{
        navigator.serviceWorker.register(swDirectory);
    }
}

/*
Los caches son a nivel de contexto de dominio
    localhost
        prueba
        prueba-v2
        chache-v1
    elinacadenas.com
        prueba
        pruebav2
        cache-v1
*/
/*
if(window.caches){
    console.log('Tenemos caché');

    // lo abre o lo crea en caso de no existir
    caches.open('prueba');
    caches.open('prueba-v2');

    caches.has('prueba').then((result)=>{
        console.log(result)
    });

    caches.open('cache-v1').then((cache) =>{
        //cache.add('/index.html');

        cache.addAll([
            '/index.html',
            '/css/page.css',
            '/img/inicio.jpg',
            'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css'
        ]).then(()=>{
            //cache.delete('/css/page.css');
            //cache.put('index.html', new Response('Actualizado desde caché'))
        });

        cache.match('index.html').then((resp) =>{
            resp.text().then((text)=>{
                console.log(text)
            })
            console.log(resp);
        });
        
    });

    caches.keys().then((keys)=>{
        console.log(keys);
    });
    
}*/