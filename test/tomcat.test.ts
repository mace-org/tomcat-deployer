import {Tomcat} from "../src";
import nock from 'nock';

beforeAll(() => {
    nock('http://test.com:8080')
        .get('/manager/text/serverinfo')
        .basicAuth({user: 'user', pass: 'pass'})
        .reply(200, 'OK - server info');

})

test("serverInfo", async () => {
    const tomcat = new Tomcat({url: 'test.com', user: 'user', password: 'pass', interactiveMode: false});
    await expect(tomcat.serverInfo()).resolves.toMatch('server info');
    await expect(tomcat.serverInfo()).rejects.toThrow();
})
