import http from 'http';
import {Tomcat} from '../src/index';
import {RequestMock} from './utils';

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

describe('not interactive mode', function () {

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

describe('manager method tests', () =>{
    let tomcat: Tomcat;

    beforeEach(() => {
        tomcat = new Tomcat({interactiveMode: false, url: 'www.test.com', user: 'u', password: 'p'});
    });

    test('test serverInfo method', async ()=>{
        requestMock.setOptions({resData: 'OK - success'});

        await expect(tomcat.serverInfo()).resolves.toMatch('success');

        expect(requestMock.request).toBeCalledTimes(1);
        expect(requestMock.request).toBeCalledWith()
    })



});


xit('should generate expected request options', () => {
    new Tomcat({interactiveMode: true,});
});