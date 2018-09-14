/* eslint-disable global-require, padded-blocks */

import fs from 'fs';

let gsettings = {
    user: '',
    password: '',
    url: '',
};
let gsettings2 = {
    user: '',
    password: '',
};

try {
    const upsettings = JSON.parse(fs.readFileSync('./settings-gateway.json'));
    gsettings = upsettings.settings;
    gsettings2 = upsettings.settings2;
} catch (e) {} // eslint-disable-line no-empty

export const settings = {
    user: gsettings.user,
    password: gsettings.password,
    url: gsettings.url,
};
export const settings2 = {
    user: gsettings2.user,
    password: gsettings2.password,
};

export const body = {
    from: 'Appfeel',
    text: 'Test',
    to: ['34635640728'],
    parts: 1,
    encoding: 'gsm',
    fsend: 20180711113030,
    trsec: true,
};
