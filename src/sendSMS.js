import btoa from 'btoa';
import request from 'request-promise';

class SMS {
    constructor(settings) {
        this.settings = settings;
    }

    sms(body) {
        let result = [];
        const {
            user, password, url,
        } = this.settings;
        const auth = btoa(`${user}:${password}`);
        const authorization = `Basic ${auth}`;
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            authorization,
        };
        const defaultUrl = 'https://gateway.plusmms.net/rest/message';
        result = request.post({
            url: url || defaultUrl,
            headers,
            body: JSON.stringify(body),
        });
        return result;
    }
}

module.exports = SMS;
