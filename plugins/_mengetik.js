const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms));

global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/!#$Oo%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^Oo$+*?.\-\^]/g, '\\$&') + ']');

export async function all(m) {
    if (m.message && global.prefix.test(m.text)) {
        await this.readMessages([m.key]);
        await this.sendPresenceUpdate('composing', m.chat);
        await delay(1000);
        await this.sendPresenceUpdate('paused', m.chat);
    }
}