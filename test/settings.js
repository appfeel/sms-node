import { settings as gsettings, settings2 as gsettings2 } from './settings-gateway';

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
