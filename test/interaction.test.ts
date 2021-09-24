import * as readline from 'readline';
import Interaction from '../src/interaction';

const mockInterface = {
    question: jest.fn(),
    close: jest.fn()
};
jest.mock('readline', () => {
    return {
        createInterface: jest.fn(() => mockInterface)
    };
});
const mockReadline = readline as jest.Mocked<typeof readline>;

const {error, info} = console;
let interaction: Interaction;

beforeEach(() => {
    console.info = jest.fn();
    console.error = jest.fn();
    mockReadline.createInterface.mockClear();
    mockInterface.question.mockClear();
    mockInterface.close.mockClear();
    interaction = new Interaction();
});

afterEach(async () => {
    await interaction.close();
    console.info = info;
    console.error = error;
});

test('should not create readline.Interface instance', async () => {
    await interaction.error('error message');
    await interaction.info('info message');
    await interaction.close();

    expect(mockReadline.createInterface).not.toBeCalled();
});

test('should created readline.Interface instance', async () => {
    const inf1 = interaction.interface;
    const inf2 = interaction.interface;
    expect(mockReadline.createInterface).toBeCalledTimes(1);
    expect(inf1).toEqual(mockInterface);
    expect(inf1).toEqual(inf2);

    interaction.close();
    expect(inf1.close).toBeCalledTimes(1);
});

test('should print with console', async () => {
    const args = ['message %s', 'args'];
    await interaction.error(...args);
    expect(console.error).toBeCalledTimes(1);
    expect(console.error).toBeCalledWith(...args);

    await interaction.info(...args);
    expect(console.info).toBeCalledTimes(1);
    expect(console.info).toBeCalledWith(...args);
});

test('should read correct answer', async () => {
    mockInterface.question.mockImplementationOnce((q, cb) => cb('answer'));
    const result = await interaction.question('question');
    expect(mockReadline.createInterface).toBeCalledTimes(1);
    expect(mockInterface.question).toBeCalledTimes(1);
    expect(mockInterface.question.mock.calls[0][0]).toEqual('question');
    expect(mockInterface.question.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(result).toEqual('answer');
});
