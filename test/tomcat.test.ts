import {Tomcat} from '../src';
import nock from 'nock';
import path from 'path';
import * as fs from 'fs';
import * as utils from '../src/utils';

jest.mock('../src/utils');

const {error} = console;

beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = error;
});

describe('options tests', () => {

    test('test constructor params', () => {
        expect(() => new Tomcat({interactiveMode: true})).toBeTruthy();
        expect(() => new Tomcat({interactiveMode: false, url: '', user: '', password: ''})).toThrow();
        expect(() => new Tomcat({interactiveMode: false, url: 'test.com', user: '', password: ''})).toThrow();
        expect(() => new Tomcat({interactiveMode: false, url: '', user: 'user', password: ''})).toThrow();
    });

    test('test default options', async () => {
        nock('http://test.com:8080')
            .get('/manager/text/serverinfo')
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - default options');

        const tomcat = new Tomcat({url: 'test.com', user: 'user', password: 'pass', interactiveMode: false});
        await expect(tomcat.serverInfo()).resolves.toMatch('default options');
    });

    test('test special options', async () => {
        nock('http://my.test.com:8050')
            .get('/manager/text/serverinfo')
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - special options');

        const tomcat = new Tomcat({
            url: 'http://my.test.com:8050',
            user: 'user',
            password: 'pass',
            interactiveMode: false
        });
        await expect(tomcat.serverInfo()).resolves.toMatch('special options');
    });

    test('test set options', () => {
        const tomcat = new Tomcat({url: 'test.com', user: 'user', password: 'pass', interactiveMode: false});

        expect(tomcat.setUrl('ftp://test.com')).toBeFalsy();
        expect(tomcat.setUrl('http://test.com:8080')).toBeFalsy();
        expect(tomcat.setUrl('')).toBeTruthy();
        expect(tomcat.setUrl('')).toBeFalsy();

        expect(tomcat.setAuth('')).toBeTruthy();
        expect(tomcat.setAuth('')).toBeFalsy();
        expect(tomcat.setAuth('user', 'pass')).toBeTruthy();
    });
});

describe('request tests', () => {
    beforeAll(() => {
        nock('http://invalid.com:8080')
            .get('/manager/text/serverinfo')
            .replyWithError('invalid tomcat service');

        nock('http://test.com:8080')
            .get('/manager/text/serverinfo')
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'invalid content')
            .get('/manager/text/serverinfo')
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - success')
            .get('/manager/text/serverinfo')
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'FAIL - error');
    });

    test('test request', async () => {
        const tomcat = new Tomcat({url: 'invalid.com', user: 'invalid', password: 'invalid', interactiveMode: false});
        await expect(tomcat.serverInfo()).rejects.toThrow();

        tomcat.setUrl('');
        tomcat.setAuth('');
        await expect(tomcat.serverInfo()).rejects.toThrow();

        tomcat.setUrl('test.com');
        await expect(tomcat.serverInfo()).rejects.toThrow();

        tomcat.setAuth('user', 'pass');
        await expect(tomcat.serverInfo()).rejects.toThrow();
        await expect(tomcat.serverInfo()).resolves.toMatch('success');
        await expect(tomcat.serverInfo()).rejects.toThrow('error');
    });
});

describe('manager method tests', () => {
    let tomcat: Tomcat;

    beforeEach(() => {
        tomcat = new Tomcat({url: 'test.com', user: 'user', password: 'pass', interactiveMode: false});
    });

    test('test serverInfo method', async () => {
        nock('http://test.com:8080')
            .get('/manager/text/serverinfo')
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - server info');

        await expect(tomcat.serverInfo()).resolves.toMatch('server info');
    });

    test('test list method', async () => {
        nock('http://test.com:8080')
            .get('/manager/text/list')
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - list');

        await expect(tomcat.list()).resolves.toMatch('list');
    });

    test('test unDeploy method', async () => {
        nock('http://test.com:8080')
            .get('/manager/text/undeploy')
            .query({path: '/test'})
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - un deploy');

        await expect(tomcat.unDeploy('')).rejects.toThrow();
        await expect(tomcat.unDeploy('test')).rejects.toThrow();
        await expect(tomcat.unDeploy('/test')).resolves.toMatch('un deploy');
    });

    test('test deploy method', async () => {
        nock('http://test.com:8080')
            .put('/manager/text/deploy', 'text file war for test')
            .query({path: '/test', update: true})
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - force deploy /test')

            .put('/manager/text/deploy', 'text file war for test')
            .query({path: '/tests', update: true})
            .basicAuth({user: 'user', pass: 'pass'})
            .times(2)
            .reply(200, 'OK - force deploy /tests')

            .put('/manager/text/deploy', 'text file war for test')
            .query({path: '/tests', update: false})
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - normal deploy /tests')

            .put('/manager/text/deploy', 'text file war for test')
            .query({path: '/tests', update: false})
            .basicAuth({user: 'user', pass: 'pass'})
            .times(2)
            .reply(200, 'FAIL - already exists /tests');

        const file = path.join(__dirname, '/fixtures/test.war');
        const wrongFile = path.join(__dirname, '/fixtures/test.zip');

        await expect(tomcat.deploy('')).rejects.toThrow();
        await expect(tomcat.deploy('not exists file path')).rejects.toThrow();
        await expect(tomcat.deploy(wrongFile)).rejects.toThrow();
        await expect(tomcat.deploy(file, 'tests')).rejects.toThrow();

        await expect(tomcat.deploy(file)).resolves.toMatch('force deploy /test');
        await expect(tomcat.deploy(file, '/tests')).resolves.toMatch('force deploy /tests');
        await expect(tomcat.deploy(file, '/tests', true)).resolves.toMatch('force deploy /tests');
        await expect(tomcat.deploy(file, '/tests', false)).resolves.toMatch('normal deploy /tests');
        await expect(tomcat.deploy(file, '/tests', false)).rejects.toThrow('already exists /tests');

        const stream = fs.createReadStream(file);
        try {
            await expect(tomcat.deploy(stream, '/tests', false)).rejects.toThrow('already exists /tests');
        } finally {
            stream.close();
        }
    });
});

describe('interactive mode tests', () => {
    test('test interactive mode', async () => {
        const file = path.join(__dirname, '/fixtures/test.war');

        nock('http://test.com:8080')
            .put('/manager/text/deploy')
            .query(true)
            .basicAuth({user: 'invalid', pass: ''})
            .replyWithError('error')
            .put('/manager/text/deploy')
            .query(true)
            .basicAuth({user: 'invalid', pass: ''})
            .reply(401, 'auth')
            .put('/manager/text/deploy')
            .query(true)
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'FAIL - error')
            .put('/manager/text/deploy')
            .query(true)
            .basicAuth({user: 'user', pass: 'pass'})
            .reply(200, 'OK - deploy');

        (utils.question as jest.Mock)
            .mockResolvedValueOnce('') // url
            .mockResolvedValueOnce('test.com') // url
            .mockResolvedValueOnce('') // user
            .mockResolvedValueOnce('invalid') // user
            .mockResolvedValueOnce('') // pass

            .mockResolvedValueOnce('test.com') // url

            .mockResolvedValueOnce('user') // user
            .mockResolvedValueOnce('pass'); // pass

        const tomcat = new Tomcat({interactiveMode: true});
        await expect(tomcat.deploy(file)).rejects.toThrow();
        await expect(tomcat.deploy(file)).resolves.toBeTruthy();
    });
});
