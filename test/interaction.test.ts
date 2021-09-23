jest.mock('readline');
import Interaction from '../src/interaction';

test("sss", async ()=>{
    const interaction = new Interaction();
    await interaction.question("aresdfe");
})