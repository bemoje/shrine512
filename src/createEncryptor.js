import crypto from 'crypto'
import isUndefined from './isUndefined'
import isObject from './isObject'
import isNonEmpStr from './isNonEmpStr'
import createKeyRetreiver from './createKeyRetreiver'

const algorithm = 'aes-256-gcm'
const ivLength = 16
const saltLength = 64

/**
 * Returns the function that performs the encryption.
 * @module createEncryptor
 * @param {string} sigrid The secret phrase
 * @param {object} sym The object used as key in the weakmap. @see createKeyRetreiver
 * @returns {object}
 */
export default function createEncryptor (sigrid, sym) {
	const keyGetter = createKeyRetreiver(sigrid, sym)
	return async function encrypt (value) {
        try {
            if (isUndefined(value)) {
                throw new Error('Expected non-empty string value or object.')
            }
			let val
			let isObj = isObject(value)
			if (!isObj) {
				if (!isNonEmpStr(value)) {
					val = { value }
					isObj = true
				} else {
					val = value
				}
			} else {
				val = value
			}
			const iv = crypto.randomBytes(ivLength)
			const salt = crypto.randomBytes(saltLength)
			const key = keyGetter(salt)
			const cipher = crypto.createCipheriv(algorithm, key, iv)
			val = isObj ? JSON.stringify(value) : value
			const encrypted = Buffer.concat([cipher.update(String(val), 'utf8'), cipher.final()])
			const tag = cipher.getAuthTag()
			const ret = Buffer.concat([salt, iv, tag, encrypted]).toString('hex')
			return ret
		} catch (e) {
			return e
		}
	}
}
