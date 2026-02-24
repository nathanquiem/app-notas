// VaultMind Crypto Utils - Para backend Node.js ONLY. Não exportar para cliente.
import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

// Usa a chave do .env, requer exatamente 32 bytes (64 hex characters)
// Como o user quer uma senha genérica vamos criar um hash SHA256 para normalizar a string
const getSecretKey = () => {
    const rawKey = process.env.APP_ENCRYPTION_KEY || 'vaultmind-default-insecure-key'
    return crypto.createHash('sha256').update(String(rawKey)).digest('base64').substr(0, 32)
}

/**
 * Criptografa um texto em claro. Retorna o texto cifrado, o iv (vetor inicial) e o auth_tag separados por ":"
 */
export function encryptText(text: string): string {
    const iv = crypto.randomBytes(16)
    const key = getSecretKey()

    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag().toString('hex')

    // Formato: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

/**
 * Descriptografa uma string fornecida gerada pelo encryptText.
 */
export function decryptText(hash: string): string {
    const parts = hash.split(':')
    if (parts.length !== 3) throw new Error('Formato de hash de senha inválido')

    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const encryptedText = Buffer.from(parts[2], 'hex')
    const key = getSecretKey()

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encryptedText, undefined, 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}
