import crypto from 'crypto'
import isNonEmpStr from './isNonEmpStr'
import createKeyRetreiver from './createKeyRetreiver'

const tagLength = 16
const algorithm = 'aes-256-gcm'
const ivLength = 16
const saltLength = 64
const tagPosition = saltLength + ivLength
const encryptedPosition = tagPosition + tagLength

/**
 * Returns the function that performs decryption.
 * @module createDecryptor
 * @param {string} sigrid The secret phrase
 * @param {object} sym The object used as key in the weakmap. @see createKeyRetreiver
 * @returns {object}
 */
export default function createDecryptor (sigrid, sym) {
	const keyGetter = createKeyRetreiver(sigrid, sym)
	return async function decrypt (value) {
		if (!isNonEmpStr(value)) {
			throw new TypeError('Expected non-empty string value.')
		}
		try {
			const stringValue = Buffer.from(String(value), 'hex')
			const salt = stringValue.slice(0, saltLength)
			const iv = stringValue.slice(saltLength, tagPosition)
			const tag = stringValue.slice(tagPosition, encryptedPosition)
			const encrypted = stringValue.slice(encryptedPosition)
			const key = keyGetter(salt)
			const decipher = crypto.createDecipheriv(algorithm, key, iv)
			decipher.setAuthTag(tag)
			let ret = decipher.update(encrypted) + decipher.final('utf8')
			try {
				return JSON.parse(ret)
			} catch (e) {
				return ret
			}
		} catch (e) {
			return e
		}
	}
}
