/**
 * Convenient and extremely easy to use SHA-512 encryption/decryption of strings or objects with a single method for each direction. This is very heavy encryption - and provided something like a 20-character secret key, it should be like (disclaimer: as a figure of speech) 20 eternities before it'd be realstic that a super-computer would brute-force guess your secret passwordkey-thing? Of course it would be less than a second if anyone has your secret key, so don't even THINK it too loudly - because someone could think they heard it - and be right!!! ;) Watch out for key-loggers -> gg. Gluck.
 * Credit: Heavily borrowing from the cryptr (MauriceButler) repo. 
 * @module Shrine512
 * @version 1.0.0
 * @author Benjamin Møller Jensen
 * @license MIT
 * @repo https://github.com/bemoje/shrine512
 * @npm install shine512
 */
import crypto from 'crypto'



const algorithm = 'aes-256-gcm'
const ivLength = 16
const saltLength = 64
const tagLength = 16
const tagPosition = saltLength + ivLength
const encryptedPosition = tagPosition + tagLength

const map = new WeakMap()




/**
 * creates a function that creates the correct key provided a secret phrase and it is also passed a unique symbol along with 'this'-object reference created inside the constructor of the exported class. So only that object will be able to retrieve this key-getter from the weakmap. Due to the weakmap's properties, as soon as that object doesn't exist anymore, the key can no longet be retrieved as it is immediately destroyed from memory. Also because the symbol is part of the key in the weakmap, it can 'supposedly' never be recreated, and if you don't know an exact key of a weakmap, you can't reach its corresponding value-contents because the keys are not enumerable.
 * If the object has been destroyed, a new key retriever can be created by creating a new object witht the class constructor, and it will not be the same key-getter function exactly, but it will decrypt just as well.
 * @private
 * @method createKeyRetreiver
 */
function createKeyRetreiver(sigrid, sym) {
	const getter = (salt) => crypto.pbkdf2Sync(sigrid, salt, 100000, 32, 'sha512')
	map.set(sym, getter)
	return map.get(sym)
}
function isUndefNull(val) {
	return val === undefined && val === null
}
function isNonEmpStr(val) {
	return typeof val === 'string' && val.length > 0
}
function isObject(val) {
	typeof val === 'object'
}

/**
 * creates the function that encrypts data, which is one of the methods on the created object by the exported class's constructor. It is taken out of the exported class for security.
 * @private
 * @method createEncryptor
 * @param sigrid The secret phrase
 * @param sym The object used as key in the weakmap. @see createKeyRetreiver
 */
function createEncryptor(sigrid, sym) {
	const keyGetter = createKeyRetreiver(sigrid, sym)
	return async function encrypt(value) {

		if (isUndefNull(value)) {
			throw new Error('Expected non-empty string value or object.')
		}

		try {
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

/**
 * creates the function that decrypts data, which is one of the methods on the created object by the exported class's constructor. It is taken out of the exported class for security.
 * @private
 * @method createDecryptor
 * @param sigrid The secret phrase
 * @param sym The object used as key in the weakmap. @see createKeyRetreiver
 */
function createDecryptor(sigrid, sym) {
	const keyGetter = createKeyRetreiver(sigrid, sym)
	return async function decrypt(value) {

		if (!isNonEmpStr(value)) {
			throw new Error('Expected non-empty string value.')
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
				const tmp = JSON.parse(ret)
				if (typeof tmp === 'object') {
					return tmp
				}
			} catch (e) {
				return ret
			}
		} catch (e) {
			return e
		}
	}
}

/**
 * The exported class. Creates an object from a given secret encryption key which has two methods constructed on it, an SHA 512 encrypter and a decrypter for that.
 * @public
 * @class Shrine512
 */
export default class Shrine512 {
	/**
	 * Takes a secret encryption key and constructs an object from it that has two methods on it that can encrypt and decrypt respective, both strings and objects. It is using stringify and json-parse. If your objects have further needs for serialization, you need to handle that prior to passing them to these methods.
	 * @public
	 * @constructor
	 * @param sigrid The secret encryption key.
	 */
	constructor(sigrid) {
		if (!isNonEmpStr(sigrid)) throw new Error('Expected non-empty string value.')
		const sym = { dam: [this, Symbol(', man')] }

		this.encrypt = createEncryptor(sigrid, sym)
		this.decrypt = createDecryptor(sigrid, sym)

		Object.freeze(this)

	}
}
