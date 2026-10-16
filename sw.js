var C="budget-v3";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(["./","index.html","manifest.json"].map(function(u){return c.add(u).catch(function(){})}));
  }));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(function(r){
      if(r)return r;
      return fetch(e.request).then(function(res){
        if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(e.request,cp)})}
        return res;
      }).catch(function(){
        return caches.match("index.html").then(function(x){return x||caches.match("./")});
      });
    })
  );
});
