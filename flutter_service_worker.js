'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "5a59fb544bc7cd1bf906eaaa1de69a70",
"assets/AssetManifest.bin.json": "3887b5ec254b5c6097784d7625776736",
"assets/AssetManifest.json": "b4f3a7985b5e4b20feda18cd735c746d",
"assets/assets/fonts/DancingScript-VariableFont_wght.ttf": "d58bb592345e95e81157b07c2db7bc00",
"assets/assets/fonts/Forum-Regular.ttf": "6ca25d5c8e19ff749003734658816b42",
"assets/assets/fonts/PinyonScript-Regular.ttf": "c53b60da0010fe5f8809ab053b2a08e3",
"assets/assets/images/BeauxBells.png": "8a1bf4147c86aa3b7d5a7dd004a198f2",
"assets/assets/images/CandS.jpg": "25b70907c22836e1d91f9a2082af745d",
"assets/assets/images/Finger.jpg": "ded34cf17d84a60f4f6edd8ff60aa660",
"assets/assets/images/HotP.jpg": "fe28c6ebad9068f294310849cb46e333",
"assets/assets/images/Party.jpg": "bd6cae11808e10467b29a7145d397ad0",
"assets/assets/images/Sarah%2520+%2520Chris%2520-001.jpg": "48d2393e385c8c091455cc9dbd4230e9",
"assets/assets/images/Sarah%2520+%2520Chris%2520-002.jpg": "6501158a73939c9e3ba045cb3df54f8f",
"assets/assets/images/Sarah%2520+%2520Chris%2520-003.jpg": "1e06d9cdc3c7ae999b489ac97a46bddc",
"assets/assets/images/Sarah%2520+%2520Chris%2520-004.jpg": "f1aaca98fad8f83a407dae73e72df022",
"assets/assets/images/Sarah%2520+%2520Chris%2520-005.jpg": "218640f616ace5611384dea40f034385",
"assets/assets/images/Sarah%2520+%2520Chris%2520-006.jpg": "cd1701f27c973b532b0c96f48d0d1944",
"assets/assets/images/Sarah%2520+%2520Chris%2520-007.jpg": "f58add1cbd189807f8927532868c843f",
"assets/assets/images/Sarah%2520+%2520Chris%2520-008.jpg": "509399357a62e48801133e4a92b60212",
"assets/assets/images/Sarah%2520+%2520Chris%2520-009.jpg": "04411a94b5a6f95521238408b7ea922b",
"assets/assets/images/theof.png": "66b1af3e22b56e207e4f0f273b51a0be",
"assets/assets/images/theof.svg": "7599270d4f97234d57560b202a68f1f7",
"assets/assets/images/tort.jpg": "79c4337b86ad20c49497f414309c6a3c",
"assets/FontManifest.json": "8641a436dd0d04ca612983986ac8a0b2",
"assets/fonts/MaterialIcons-Regular.otf": "5e8227e42765ca50cb349f778c317128",
"assets/NOTICES": "ad93942f95b4f402ade130229d300976",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/flutter_map/lib/assets/flutter_map_logo.png": "208d63cc917af9713fc9572bd5c09362",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "ad5fb2701cc2e90dad46047dff2c8719",
"/": "ad5fb2701cc2e90dad46047dff2c8719",
"main.dart.js": "eac0ee8e5f7e3a949782a1774288d754",
"manifest.json": "1459ab07de0eef5b9bcb8a4d18c9e9f0",
"version.json": "a532dec2c337db2165c36d7aaef3ad2f"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
