import http from 'http';
import {Tomcat} from '../src/index';
import {RequestMock} from './utils';
import fs from "fs";

const request = http.request;
const requestMock = new RequestMock();

beforeAll(() => {
    http.request = requestMock.request;
});
afterAll(() => {
    http.request = request;
});

beforeEach(() => {
    requestMock.request.mockClear();
});

afterEach(() => {

});

xdescribe('not interactive mode', function () {

    let tomcat: Tomcat;

    beforeEach(() => {
        tomcat = new Tomcat({interactiveMode: false, url: 'www.test.com', user: 'u', password: 'p'});
    });

    it('should throw when provide invalid args', () => {
        expect(() => new Tomcat({interactiveMode: false, url: '', user: '', password: ''})).toThrow();
    });

    it('should throw when request failure', async () => {
        requestMock.setOptions({reqError: new Error('request error')});
        await expect(tomcat.serverInfo()).rejects.toThrow('request error');

        requestMock.setOptions({resStatusCode: 401});
        await expect(tomcat.serverInfo()).rejects.toThrow();

        requestMock.setOptions({resError: new Error('response error')});
        await expect(tomcat.serverInfo()).rejects.toThrow('response error');

        requestMock.setOptions({resData: 'invalid content'});
        await expect(tomcat.serverInfo()).rejects.toThrow();

        requestMock.setOptions({resData: 'FAIL - error'});
        await expect(tomcat.serverInfo()).rejects.toThrow('error');

    });

    it('should return correct result when request success', async () => {
        requestMock.setOptions({resData: 'OK - success'});

        await expect(tomcat.serverInfo()).resolves.toMatch('success');

        await expect(tomcat.list()).resolves.toMatch('success');

        await expect(tomcat.unDeploy('/context')).resolves.toMatch('success');
    });

});

describe('manager method tests', () => {
    let tomcat: Tomcat;

    beforeEach(() => {
        tomcat = new Tomcat({interactiveMode: false, url: 'www.test.com', user: 'u', password: 'p'});
    });

    xtest('test serverInfo method', async () => {
        requestMock.setOptions({resData: 'OK - success'});
        await expect(tomcat.serverInfo()).resolves.toMatch('success');
        expect(requestMock.request).toBeCalledTimes(1);
        expect(requestMock.request.mock.calls[0][0]).toMatchObject({method: 'get', path: '/manager/text/serverinfo'});
    })

    xtest('test list method', async () => {
        requestMock.setOptions({resData: 'OK - success'});
        await expect(tomcat.list()).resolves.toMatch('success');
        expect(requestMock.request).toBeCalledTimes(1);
        expect(requestMock.request.mock.calls[0][0]).toMatchObject({method: 'get', path: '/manager/text/list'});
    })

    xtest('test unDeploy method', async () => {
        requestMock.setOptions({resData: 'OK - success'});
        await expect(tomcat.unDeploy('site')).resolves.toMatch('success');
        expect(requestMock.request).toBeCalledTimes(1);
        expect(requestMock.request.mock.calls[0][0]).toMatchObject({
            method: 'get',
            path: '/manager/text/undeploy?path=site'
        });
    })

    test('test deploy method with stream.Readable', async () => {
        requestMock.setOptions({resData: 'OK - success'});
        const stream = fs.createReadStream('./test/fixtures/site.war');
        try {
            await expect(tomcat.deploy('')).rejects.toThrow();
            await expect(tomcat.deploy(stream)).rejects.toThrow();

            await expect(tomcat.deploy(stream, 'site')).resolves.toMatch('success')
            expect(requestMock.request).toBeCalledTimes(1);
            expect(requestMock.request.mock.calls[0][0]).toMatchObject({
                method: 'put',
                path: '/manager/text/deploy?path=/site&update=true'
            });

        } finally {
            stream.close();
        }
    })

});


xit('should generate expected request options', () => {
    new Tomcat({interactiveMode: true,});
});
