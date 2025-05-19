import JavaScriptObfuscator from "javascript-obfuscator"

let handler = async (m, { args }) => {
    try {
        const modes = ["low", "medium", "high", "extreme"]
        const usage = "Reply Codenyanya!!!\n\n*Example:*\n.obfuscate low/medium/high/extreme"
        if (!m.quoted) return m.reply(usage)
        const type = args.shift().toLowerCase()
        if (!modes.includes(type)) return m.reply(usage)
        
        const message = await Encrypt(m.quoted.text, type)
        
        if (args.length >= 2) {
            const texts = args.slice(1).join(" ")
            const response = await Encrypt(texts, type)
            return m.reply(response)
        }

        return m.reply(message)

    } catch (e) {
        await m.reply(e.message || "Terjadi kesalahan.")
    }
}
handler.help = ['encrypt']
handler.tags = ['tools']
handler.command = /^(encrypt|enc)$/i
handler.limit = true
export default handler

async function Encrypt(query, level) {
    let obfuscationResult
    switch (level) {
        case "low":
            obfuscationResult = JavaScriptObfuscator.obfuscate(query, {
                compact: true,
                controlFlowFlattening: false,
                stringArray: false,
            })
            break
        case "medium":
            obfuscationResult = JavaScriptObfuscator.obfuscate(query, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                stringArray: true,
                stringArrayThreshold: 0.75,
            })
            break
        case "high":
            obfuscationResult = JavaScriptObfuscator.obfuscate(query, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                numbersToExpressions: true,
                simplify: true,
                stringArrayShuffle: true,
                splitStrings: true,
                stringArrayThreshold: 1,
            })
            break
        case "extreme":
            obfuscationResult = JavaScriptObfuscator.obfuscate(query, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 1,
                numbersToExpressions: true,
                simplify: true,
                stringArrayShuffle: true,
                splitStrings: true,
                stringArrayThreshold: 1,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 1,
                debugProtection: true,
                debugProtectionInterval: true,
                disableConsoleOutput: true
            })
            break
        default:
            throw new Error("Invalid encryption level")
    }

    return obfuscationResult.getObfuscatedCode()
}