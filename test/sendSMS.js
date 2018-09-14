/* eslint-env mocha */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import request from 'request-promise';
import sinon from 'sinon';
import SMS from '../src/sendSMS';

import { settings, body, settings2 } from './settings';

let method;

const errr400 = {
    statusCode: 400,
    message: '400 - "{\\"error\\":{\\"code\\":102,\\"description\\":\\"No valid recipients\\"}}[{\\"accepted\\":false,\\"to\\":\\"34\\",\\"error\\":{\\"code\\":102,\\"description\\":\\"No valid recipients\\"}}]"',
    error: '{"error":{"code":102,"description":"No valid recipients"}}[{"accepted":false,"to":"34","error":{"code":102,"description":"No valid recipients"}}]',
};

const errr401 = {
    statusCode: 401,
    message: '401 - "{\\"error\\":{\\"code\\":103,\\"description\\":\\"Username or password unknown\\"}}"',
    error: '{"error":{"code":103,"description":"Username or password unknown"}}',
};

const errr402 = {
    statusCode: 402,
    message: '402 - "{\\"error\\":{\\"code\\":111,\\"description\\":\\"Not enough credits\\"}}"',
    error: '{"error":{"code":111,"description":"Not enough credits"}}',
};

const errr500 = {
    statusCode: 500,
};

const urlError = {
    name: 'RequestError',
    message: 'Error: getaddrinfo ENOTFOUND sms.appfeel.com sms.appfeel.com:443',
    error: 'RequestError: Error: getaddrinfo ENOTFOUND sms.appfeel.com sms.appfeel.com:443',
};

function sendData(settingsData, bodyData) {
    expect(settingsData).to.be.an('object');
    expect(settingsData.user).to.be.an('string');
    expect(settingsData.password).to.be.an('string');
    expect(body).to.be.an('object');
    expect(bodyData.from).to.be.an('string');
    expect(bodyData.text).to.be.an('string');
    expect(bodyData.to).to.be.an('array');
    expect(bodyData.parts).to.be.an('number');
    expect(bodyData.encoding).to.be.an('string');
    expect(bodyData.fsend).to.be.an('number');
    expect(bodyData.trsec).to.be.an('boolean');
}
function resulterror(result) {
    expect(result).to.be.an('object').includes.keys(['statusCode', 'message', 'error']);
    expect(result.statusCode).to.be.an('number');
    expect(result.message).to.be.an('string');
    expect(result.error).to.be.an('string');
}

describe('send SMS', () => {
    describe('Send sms succesfully', () => {
        before(() => {
            method = sinon.stub(request, 'post', () => Promise.resolve([{
                statusCode: 202, accepted: true, to: '34635640728', id: '102648820',
            }]));
        });
        after(() => {
            method.restore();
        });
        it(('send'), () => {
            sendData(settings, body);
            const sender = new SMS(settings);
            sender.sms(body)
                .then((result) => {
                    result.forEach((element) => {
                        expect(element).to.be.an('object').includes.keys(['statusCode', 'accepted', 'to', 'id']);
                        expect(element.statusCode).to.be.an('number');
                        expect(element.statusCode).to.equal(202);
                        expect(element.accepted).to.be.an('boolean');
                        expect(element.accepted).to.equal(true);
                        expect(element.to).to.be.an('string');
                        expect(element.to).to.equal(body.to[0]);
                        expect(element.id).to.be.an('string');
                        expect(element.id).to.equal('102648820');
                    });
                });
        });
    });

    describe('Send sms failed the second number', () => {
        before(() => {
            method = sinon.stub(request, 'post', () => Promise.resolve([{
                statusCode: 207, accepted: true, to: '34635640728', id: '102648820',
            }, {
                statusCode: 207,
                accepted: false,
                to: '34',
                error: { code: 102, description: 'No valid recipients' },
            }]));
        });
        after(() => {
            method.restore();
        });
        it(('send tel 34626690739 and 34'), () => {
            sendData(settings, body);
            const sender = new SMS(settings);
            sender.sms(body)
                .then((result) => {
                    expect(result[0]).to.be.an('object').includes.keys(['statusCode', 'accepted', 'to', 'id']);
                    expect(result[0].statusCode).to.be.an('number');
                    expect(result[0].statusCode).to.equal(207);
                    expect(result[0].accepted).to.be.an('boolean');
                    expect(result[0].accepted).to.equal(true);
                    expect(result[0].to).to.be.an('string');
                    expect(result[0].to).to.equal(body.to[0]);
                    expect(result[0].id).to.be.an('string');
                    expect(result[0].id).to.equal('102648820');
                    expect(result[1]).to.be.an('object').includes.keys(['statusCode', 'accepted', 'to', 'error']);
                    expect(result[1].statusCode).to.be.an('number');
                    expect(result[0].statusCode).to.equal(207);
                    expect(result[1].accepted).to.be.an('boolean');
                    expect(result[1].accepted).to.equal(false);
                    expect(result[1].to).to.be.an('string');
                    expect(result[1].to).to.equal('34');
                    expect(result[1].error).to.be.an('object').includes.keys(['code', 'description']);
                    expect(result[1].error.code).to.be.an('number');
                    expect(result[1].error.code).to.equal(102);
                    expect(result[1].error.description).to.be.an('string');
                    expect(result[1].error.description).to.equal('No valid recipients');
                });
        });
    });

    describe('Send sms URL error', () => {
        before(() => {
            method = sinon.stub(request, 'post', () => Promise.resolve(urlError));
        });
        after(() => {
            method.restore();
        });
        it(('send URL error'), () => {
            sendData(settings, body);
            const sender = new SMS(settings);
            sender.sms(body)
                .then((result) => {
                    expect(result).to.be.an('object').includes.keys(['name', 'message', 'error']);
                    expect(result.name).to.be.an('string');
                    expect(result.name).to.equal(urlError.name);
                    expect(result.message).to.be.an('string');
                    expect(result.message).to.equal(urlError.message);
                    expect(result.error).to.be.an('string');
                    expect(result.error).to.equal(urlError.error);
                });
        });
    });

    describe('send SMS error 400', () => {
        before(() => {
            method = sinon.stub(request, 'post', () => Promise.resolve(errr400));
        });
        after(() => {
            method.restore();
        });
        it(('error 102 (No valid recipients)'), () => {
            sendData(settings, body);
            const sender = new SMS(settings);
            sender.sms(body)
                .then((result) => {
                    resulterror(result);
                    expect(result.statusCode).to.equal(errr400.statusCode);
                    expect(result.message).to.equal(errr400.message);
                    expect(result.error).to.equal(errr400.error);
                });
        });
    });

    describe('send SMS error 401', () => {
        before(() => {
            method = sinon.stub(request, 'post', () => Promise.resolve(errr401));
        });
        after(() => {
            method.restore();
        });
        it(('error 103 (Username and password unknown)'), () => {
            sendData(settings, body);
            const sender = new SMS(settings);
            sender.sms(body)
                .then((result) => {
                    resulterror(result);
                    expect(result.statusCode).to.equal(errr401.statusCode);
                    expect(result.message).to.equal(errr401.message);
                    expect(result.error).to.equal(errr401.error);
                });
        });
    });

    describe('send SMS error 402', () => {
        before(() => {
            method = sinon.stub(request, 'post', () => Promise.resolve(errr402));
        });
        after(() => {
            method.restore();
        });
        it(('error 111 (Not enough credits)'), () => {
            sendData(settings, body);
            const sender = new SMS(settings);
            sender.sms(body)
                .then((result) => {
                    resulterror(result);
                    expect(result.statusCode).to.equal(errr402.statusCode);
                    expect(result.message).to.equal(errr402.message);
                    expect(result.error).to.equal(errr402.error);
                });
        });
    });

    describe('send SMS error 500', () => {
        before(() => {
            method = sinon.stub(request, 'post', () => Promise.resolve(errr500));
        });
        after(() => {
            method.restore();
        });
        it(('error 500 (Internal error)'), () => {
            sendData(settings, body);
            const sender = new SMS(settings);
            sender.sms(body)
                .then((result) => {
                    expect(result).to.be.an('object').includes.keys(['statusCode']);
                    expect(result.statusCode).to.be.an('number');
                    expect(result.statusCode).to.equal(errr500.statusCode);
                });
        });
    });

    describe('sender SMS without url ', () => {
        before(() => {
            method = sinon.stub(request, 'post', () => Promise.resolve([{
                statusCode: 202, accepted: true, to: '34635640728', id: '102648820',
            }]));
        });
        after(() => {
            method.restore();
        });
        it(('without url'), () => {
            sendData(settings2, body);
            const sender = new SMS(settings2);
            sender.sms(body)
                .then((result) => {
                    result.forEach((element) => {
                        expect(element).to.be.an('object').includes.keys(['statusCode', 'accepted', 'to', 'id']);
                        expect(element.statusCode).to.be.an('number');
                        expect(element.statusCode).to.equal(202);
                        expect(element.accepted).to.be.an('boolean');
                        expect(element.accepted).to.equal(true);
                        expect(element.to).to.be.an('string');
                        expect(element.to).to.equal(body.to[0]);
                        expect(element.id).to.be.an('string');
                        expect(element.id).to.equal('102648820');
                    });
                });
        });
    });
});
