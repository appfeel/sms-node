Node Send SMS
========

A node.js module for sender SMS.

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://npmjs.org/package/sms-node)
[![NPM version](http://img.shields.io/npm/v/sms-node.svg?style=flat)](https://npmjs.org/package/sms-node)
[![Downloads](http://img.shields.io/npm/dm/sms-node.svg?style=flat)](https://npmjs.org/package/sms-node)
[![Build Status](http://img.shields.io/travis/appfeel/sms-node.svg?style=flat)](https://travis-ci.org/appfeel/sms-node)
[![Coverage Status](https://coveralls.io/repos/github/appfeel/sms-node/badge.svg?branch=master)](https://coveralls.io/github/appfeel/sms-node?branch=master)
[![Dependencies](https://david-dm.org/appfeel/sms-node/status.svg)](https://david-dm.org/appfeel/sms-node)

- [Installation](#installation)
- [Requirements](#requirements)
- [Features](#features)
- [Usage](#usage)
- [LICENSE](#license)

## Installation

```bash
npm install sms-node --save
```

## Requirements

- [ ] Node version >= 6.x.x
- [ ] Register an account at <a href="http://converssage.com" target="_blank">converssage.com</a>

## Features

- Powerful and intuitive.
- Multi country cheap SMS.
- Automatically detects destination device type.
- Unified error handling.
- Written in ES6, compatible with ES5 through babel transpilation.

## Usage 

### 1. Import and setup sms-node module

Setup your account settings to send SMS:

```js
const SMS = require('sms-node');

const settings = {
    sms: {
        user: 'Pepe',
        password: 'xxx',
        url: 'https://gateway.plusmms.net/rest/message',
   },
};
const sender = new SMS(settings);
```

- **user**: user name from your account at <a href="http://converssage.com" target="_blank">converssage.com</a>
- **password**: your account password
- **url**: (optional) <a href="http://converssage.com" target="_blank">converssage.com</a> gateway url, should not be changed

### 2. Define message data

Create a JSON object with `title`, `body`, `to` and other fields if needed:

```js
const data = {
    from: 'New SMS', // Title for SMS
    text: 'Powered by AppFeel', // Text for SMS
    to: ['34666666666'], // Telephone numbers to whom the SMS will be sent
    encoding: 'gsm', // Optional
    fsend: null, // Optional
    parts: 1, // Optional
    trsec: false, // Optional
};

// Multiple destinations
data.to =  ['34666666666', '10646464642'];

```

- **to**: You can send an SMS to multiple devices, creating an array with different telephone numbers composed by mandatory REGION_NUMBER + PHONE_NUMBER.

### 3. Send the SMS

You can use it in node callback style:
```js
sender.sms(body, (err, result) => {
    if (err) {
        console.log(err);
    } else {
	    console.log(result);
    }
});
```

Or you can use it in promise style:
```js
sender.sms(body)
    .then((results) => { ... })
    .catch((err) => { ... });
```

- **err**: will be null if all went fine, otherwise will return an array with the errors:
```js
[
    {
        statusCode: 207, // Message status code
        accepted: false, // Shows whether the SMS has been made or not
        message: '400 - "{\\"error\\":{\\"code\\":102,\\"description\\":\\"No valid recipients\\"}}[{\\"accepted\\":false,\\"to\\":\\"34\\",\\"error\\":{\\"code\\":102,\\"description\\":\\"No valid recipients\\"}}]"', // Full error message  
        error: '{"error":{"code":102,"description":"No valid recipients"}}[{"accepted":false,"to":"34","error":{"code":102,"description":"No valid recipients"}}]', // Full string error  
    },
    ...
]
```

- `result` will contain an array with the message responses:
```js
[
    {
        statusCode: 200, // Message status code
        accepted: true, // Shows whether the SMS has been made or not
        to: '34666666666', // Number to whom the message was sent 
        id: '102648820', // Number to identify the message
    },
    ...
]
```

## LICENSE


```
The MIT License (MIT)

Copyright (c) 2018 AppFeel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

*<p style="font-size: small;" align="right"><a color="#232323;" href="http://appfeel.com">Made in Barcelona with <span color="#FCB"><3</span> and <span color="#BBCCFF">Code</span></a></p>*
