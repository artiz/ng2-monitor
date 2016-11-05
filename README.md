


App is based on Angular 2 Universal Starter - a minimal Angular 2 starter for Universal JavaScript using TypeScript 2 and Webpack 2
[https://github.com/angular/universal-starter](https://github.com/angular/universal-starter)



# License
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)


> Original documentation

## Universal "Gotchas"

 - To use `templateUrl` or `stylesUrl` you must use **`angular2-template-loader`** in your TS loaders.
    - This is already setup within this starter repo. Look at the webpack.config file [here](https://github.com/angular/universal-starter/blob/master/webpack.config.ts) for details & implementation.
 - **`window`** & **`document`** do not exist on the server - so using them, or any library that uses them (jQuery for example) will not work.
    - If you need to use them, consider limiting them to only your main.client and wrapping them situationally with the imported *isBrowser / isNode* features from Universal.  `import { isBrowser, isNode } from 'angular2-universal';
 - The application runs XHR requests on the server & once again on the Client-side (when the application bootstraps)
    - Use a [UniversalCache](https://github.com/angular/universal-starter/blob/master/src/app/universal-cache.ts) to save certain requests so they aren't re-ran again on the Client.
 
## Installation

* `npm install`

## Serve

* `npm start` to build your client app and start a web server
* `npm run build` to prepare a distributable bundle

## Development
* run `npm start` and `npm run watch` in two separate terminals to build your client app, start a web server, and allow file changes to update in realtime

## Watch files
* `npm run watch` to build your client app and start a web server

## Edge case of server compatibility with Promise polyfills

If you have node modules with promise polyfill dependency on server - there is chance to get the following exception:
```
Error: Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.
```
It occurs because [Zone.js](https://github.com/angular/zone.js/) Promise implementation is not 
detected as Promise by some polyfills (e.g. [es6-promise](https://github.com/stefanpenner/es6-promise) before 4.x).

To sort it out, you need such polyfills initialized before zone.js. Zone.js is initialized in 'angular2-universal-polyfills' 
import of [server.ts](https://github.com/angular/universal-starter/blob/master/src/server.ts#L4). So import problematic
modules before this line.

### Documentation
[Design Doc](https://docs.google.com/document/d/1q6g9UlmEZDXgrkY88AJZ6MUrUxcnwhBGS0EXbVlYicY)
