import createDecryptor from './createDecryptor'
import createEncryptor from './createEncryptor'
import isNonEmpStr from './isNonEmpStr'
/**
 * The only public export. The constructor takes a secret encryption key and constructs an object from it that has two methods on it that can encrypt and decrypt respective, both strings and objects.
 * @public
 * @class Shrine512
 */
export default class Shrine512 {
	/**
	 * @constructor
	 * @param {string} sigrid The secret encryption key.
	 */
	constructor (sigrid) {
		if (!isNonEmpStr(sigrid)) throw new TypeError('Expected non-empty string value.')
		const sym = { dam: [this, Symbol(', man')] }

		this.encrypt = createEncryptor(sigrid, sym)
		this.decrypt = createDecryptor(sigrid, sym)

		Object.freeze(this)
	}
}
