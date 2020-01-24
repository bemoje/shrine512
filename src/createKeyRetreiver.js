import crypto from 'crypto'
const map = new WeakMap()

/**
 * Creates a function that creates the correct key provided a secret phrase and it is also passed a unique symbol along with 'this'-object reference created inside the constructor of the exported class. So only that object will be able to retrieve this key-getter from the weakmap.
 * If the object has been destroyed, a new key retriever can be created by creating a new object witht the class constructor, and it will not be the same key-getter function exactly, but it will decrypt just as well.
 * @private
 * @module createKeyRetreiver
 * @param {string} sigrid
 * @param {Symbol} sym
 */
export default function createKeyRetreiver (sigrid, sym) {
	const getter = salt => crypto.pbkdf2Sync(sigrid, salt, 100000, 32, 'sha512')
	map.set(sym, getter)
	return map.get(sym)
}
