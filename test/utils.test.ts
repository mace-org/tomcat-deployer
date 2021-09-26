import * as readline from 'readline';
import {question} from '../src/utils';

jest.mock('readline');
const questionMock = jest.fn();
const closeMock = jest.fn();
const createInterfaceMock = (readline.createInterface as jest.Mock).mockImplementation(() => {
    return {
        question: questionMock,
        close: closeMock
    };
});

test('test question function', async () => {
    questionMock.mockImplementationOnce((q, cb) => cb('answer'));
    const result = await question('question');

    expect(createInterfaceMock).toBeCalledTimes(1);

    expect(questionMock).toBeCalledTimes(1);
    expect(questionMock.mock.calls[0][0]).toEqual('question');

    expect(closeMock).toBeCalledTimes(1);

    expect(result).toEqual('answer');
});
