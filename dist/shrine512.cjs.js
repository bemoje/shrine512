'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = _interopDefault(require('crypto'));

/**
 * Returns true of val is a string that isnt empty
 * @module isNonEmpStr
 * @param {any} val
 * @returns {boolean}
 */
function isNonEmpStr (val) {
    return typeof val === 'string' && val.length > 0
}

const map = new WeakMap();

/**
 * Creates a function that creates the correct key provided a secret phrase and it is also passed a unique symbol along with 'this'-object reference created inside the constructor of the exported class. So only that object will be able to retrieve this key-getter from the weakmap.
 * If the object has been destroyed, a new key retriever can be created by creating a new object witht the class constructor, and it will not be the same key-getter function exactly, but it will decrypt just as well.
 * @private
 * @module createKeyRetreiver
 * @param {string} sigrid
 * @param {Symbol} sym
 */
function createKeyRetreiver (sigrid, sym) {
	const getter = salt => crypto.pbkdf2Sync(sigrid, salt, 100000, 32, 'sha512');
	map.set(sym, getter);
	return map.get(sym)
}

const tagLength = 16;
const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 64;
const tagPosition = saltLength + ivLength;
const encryptedPosition = tagPosition + tagLength;

/**
 * Returns the function that performs decryption.
 * @module createDecryptor
 * @param {string} sigrid The secret phrase
 * @param {object} sym The object used as key in the weakmap. @see createKeyRetreiver
 * @returns {object}
 */
function createDecryptor (sigrid, sym) {
	const keyGetter = createKeyRetreiver(sigrid, sym);
	return async function decrypt (value) {
		if (!isNonEmpStr(value)) {
			throw new TypeError('Expected non-empty string value.')
		}
		try {
			const stringValue = Buffer.from(String(value), 'hex');
			const salt = stringValue.slice(0, saltLength);
			const iv = stringValue.slice(saltLength, tagPosition);
			const tag = stringValue.slice(tagPosition, encryptedPosition);
			const encrypted = stringValue.slice(encryptedPosition);
			const key = keyGetter(salt);
			const decipher = crypto.createDecipheriv(algorithm, key, iv);
			decipher.setAuthTag(tag);
			let ret = decipher.update(encrypted) + decipher.final('utf8');
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

/**
 * Returns true if val is undefined or null
 * @module isUndefined
 * @param {any} val
 * @returns {boolean}
 */
function isUndefined (val) {
    return val === undefined || val === null
}

/**
 * Returns true if val is of type object
 * @module isObject
 * @param {any} val
 * @returns {boolean}
 */
function isObject (val) {
    return typeof val === 'object'
}

const algorithm$1 = 'aes-256-gcm';
const ivLength$1 = 16;
const saltLength$1 = 64;

/**
 * Returns the function that performs the encryption.
 * @module createEncryptor
 * @param {string} sigrid The secret phrase
 * @param {object} sym The object used as key in the weakmap. @see createKeyRetreiver
 * @returns {object}
 */
function createEncryptor (sigrid, sym) {
	const keyGetter = createKeyRetreiver(sigrid, sym);
	return async function encrypt (value) {
        try {
            if (isUndefined(value)) {
                throw new Error('Expected non-empty string value or object.')
            }
			let val;
			let isObj = isObject(value);
			if (!isObj) {
				if (!isNonEmpStr(value)) {
					val = { value };
					isObj = true;
				} else {
					val = value;
				}
			} else {
				val = value;
			}
			const iv = crypto.randomBytes(ivLength$1);
			const salt = crypto.randomBytes(saltLength$1);
			const key = keyGetter(salt);
			const cipher = crypto.createCipheriv(algorithm$1, key, iv);
			val = isObj ? JSON.stringify(value) : value;
			const encrypted = Buffer.concat([cipher.update(String(val), 'utf8'), cipher.final()]);
			const tag = cipher.getAuthTag();
			const ret = Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
			return ret
		} catch (e) {
			return e
		}
	}
}

/**
 * The only public export. The constructor takes a secret encryption key and constructs an object from it that has two methods on it that can encrypt and decrypt respective, both strings and objects.
 * @public
 * @class Shrine512
 */
class Shrine512 {
	/**
	 * @constructor
	 * @param {string} sigrid The secret encryption key.
	 */
	constructor (sigrid) {
		if (!isNonEmpStr(sigrid)) throw new TypeError('Expected non-empty string value.')
		const sym = { dam: [this, Symbol(', man')] };

		this.encrypt = createEncryptor(sigrid, sym);
		this.decrypt = createDecryptor(sigrid, sym);

		Object.freeze(this);
	}
}

/**
 * Convenient and very VERY very easy to use 'AES-256-GCM' (SHA-512) encryption/decryption of strings, objects, filecontent, etc.
 * @module Shrine512
 * @version 1.0.0
 * @author Benjamin Moeller Jensen <bemoje@gmail.com>
 * @license BSD-3 Clause
 */

module.exports = Shrine512;
