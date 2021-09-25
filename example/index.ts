import Interaction from '../src/interaction';


async function run() {
    // connect to tomcat server
    // const tomcat = new Tomcat();
    // await tomcat.serverInfo();

    const interaction = new Interaction();
    try {
        while (true) {
            const cmd = await interaction.question('tomcat deployer > ');
            switch (cmd) {
                case 'info':
                    await interaction.info('you input info');
                    break;

                case 'list':
                    await interaction.info('you input list');
                    break;

                case 'deploy':
                    await interaction.info('you input deploy');
                    break;

                case 'force deploy':
                    await interaction.info('you input force deploy');
                    break;

                case 'undeploy':
                    await interaction.info('you input undeploy');
                    break;

                case 'quit':
                    return;

                default:
                    await interaction.error(`unknown command "${cmd}"`);
                    break;
            }
            await interaction.info('');
        }
    } finally {
        interaction.close();
    }
}

run().then();
