import * as readline from 'readline';

export function question(query: string) {
    return new Promise<string>((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(query, answer => {
            rl.close();
            resolve(answer);
        });
    });
}