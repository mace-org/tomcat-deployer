import * as readline from 'readline';
import Interaction from '../src/interaction';

jest.mock('readline');
const questionMock = jest.fn();
const createInterfaceMock = (readline.createInterface as jest.Mock).mockImplementation(() => {
    return {
        question: questionMock,
        close: jest.fn()
    }
});

const {error, info} = console;
let interaction: Interaction;

beforeEach(() => {
    console.info = jest.fn();
    console.error = jest.fn();
    createInterfaceMock.mockClear();
    questionMock.mockClear();
    interaction = new Interaction();
});

afterEach(async () => {
    await interaction.close();
    console.info = info;
    console.error = error;
});

it('should delaying create readline.Interface instance', async () => {
    await interaction.error('error message');
    await interaction.info('info message');
    await interaction.close();
    expect(createInterfaceMock).not.toBeCalled();

    const inf1 = interaction.interface;
    const inf2 = interaction.interface;
    expect(createInterfaceMock).toBeCalledTimes(1);
    expect(inf1).toEqual(inf2);

    interaction.close();
    expect(inf1.close).toBeCalledTimes(1);
})

it('should print with console', async () => {
    const args = ['message %s', 'args'];
    await interaction.error(...args);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(...args);

    await interaction.info(...args);
    expect(console.info).toBeCalledTimes(1);
    expect(console.info).toBeCalledWith(...args);
});

it('should read correct answer', async () => {
    questionMock.mockImplementationOnce((q, cb) => cb('answer'));
    const result = await interaction.question('question');
    expect(questionMock).toBeCalledTimes(1);
    expect(questionMock.mock.calls[0][0]).toEqual('question');
    expect(questionMock.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(result).toEqual('answer');
});
