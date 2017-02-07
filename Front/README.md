<center>[![License](https://img.shields.io/badge/License-GPL3.0-blue.svg)](https://github.com/Arctic76/Sharing-System/blob/master/LICENSE) [ ![Node](https://img.shields.io/badge/Node-7.4.0-blue.svg)](https://nodejs.org/en/) [ ![Vue](https://img.shields.io/badge/Vue.js-2.0.5-blue.svg)](https://vuejs.org/) [ ![Web Push](https://img.shields.io/badge/Web%20Push%20Notification-OneSignal-blue.svg)](https://onesignal.com/) <br/><br/>![build](https://img.shields.io/badge/build-passing-brightgreen.svg)</center>


**QuickShare**
=============

(Node.js / Express.js / Vue.js / MongoDB)
-----------------------------------------

**FRONT:**


**Installation:**

To install the application, you have to follow these instructions :

 Go to the Front folder.
 Open a terminal and tape the following command to instal dependencies:

    npm install

If you have errors during installation, make sure that python and node are installed and that PATH environment values are set.
Then, you have to create a config.js file into the /src folder:

**src/config.js:**

    'use strict';
    
    export default {

	domain: '.<your_domain>',
	urlAPI: '<your_API_URL>', 	// without the /api/...
	contactEmail: <your_@Mail>,
	infoTTL: <value> 					//in days
	notifAppId: <OneSignal API KEY>,
	recaptchaPublicKey: <key>
	};

NOTE : If your front-end is served on HTTPS you must provide HTTPS API URL.

**Serve & Build:**
``` bash
# serve with hot reload at sharinfo.io:80: (dev)

    npm run dev

To change the port or the domain with the webpack dev server, please modify the webpack.config.js 

# build for production with minification:

	npm run build
```
For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).


> Written with [StackEdit](https://stackedit.io/).