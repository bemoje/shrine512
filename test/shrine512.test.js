'use strict'

import Shrine512 from '../index'
import randomstring from 'randomstring'
import randomNumber from 'math-random'
// randomstring.generate() // >> "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT"
// randomstring.generate(7) // >> "xqm5wXX"
// randomstring.generate({ length: 12, charset: 'alphabetic' }) // >> "AqoTIzKurxJi"
// randomstring.generate({ charset: 'abc' }) // >> "accbaabbbbcccbccccaacacbbcbbcbbc"

function makeRndStrings() {
	let rndStrings = []
	for (let i = 1; i <= 5; i++) {
		rndStrings.push(randomstring.generate(i * 8))
	}
	return rndStrings
}
function makeRndObjects() {
	let rndObjects = []
	for (let i = 1; i <= 5; i++) {
		rndObjects.push({ key: randomstring.generate(i * 8) })
	}
	return rndObjects
}
function makeShrines() {
	let rndSecrets = []
	for (let i = 1; i <= 21; i += 4) {
		rndSecrets.push(randomstring.generate(1 + (randomNumber(i) * i)))
	}
	let shrines = []
	for (let secret of rndSecrets) {
		shrines.push({ shrine: new Shrine512(secret), secret: secret })
	}
	return shrines
}

describe('Shrine512 works fine', () => {
	// beforeAll(() => {})
	// afterAll(() => {})
	// beforeEach(() => {})
	// afterEach(() => {})
	it('works with promises', () => {
		expect.assertions(1)
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		const str = 'im all stringy'
		shrine.encrypt(str).then(encrypted => {
			shrine.decrypt(encrypted).then(decrypted => {
				console.log({ encrypt: str, secret: secret, encrypted: encrypted, decrypted: decrypted, match: str === decrypted })
				expect(decrypted).toEqual(str)
			})
		})
	})
	it('works with random strings of random lengths between 1 and 40 with random encryption keys of random lengths between 1 and 21', () => {
		expect.assertions(6 * 5)
		for (let shrineNSecret of makeShrines()) {
			for (let str of makeRndStrings()) {
				shrineNSecret.shrine.encrypt(str).then(encrypted => {
					shrineNSecret.shrine.decrypt(encrypted).then(decrypted => {
						console.log({ encrypt: str, secret: shrineNSecret.secret, encrypted: encrypted, decrypted: decrypted })
						expect(decrypted).toEqual(str)
					})
				})
			}
		}
	})
	it('works with objects containing a string of random length between 1 and 40 with random encryption keys of random lengths between 1 and 21', () => {
		expect.assertions(6 * 5)
		for (let shrineNSecret of makeShrines()) {
			for (let obj of makeRndObjects()) {
				shrineNSecret.shrine.encrypt(obj).then(encrypted => {
					shrineNSecret.shrine.decrypt(encrypted).then(decrypted => {
						console.log({ encrypt: obj, secret: shrineNSecret.secret, encrypted: encrypted, decrypted: decrypted })
						expect(decrypted).toEqual(obj)
					})
				})
			}
		}
	})
	it('works with async/await', async () => {
		expect.assertions(1)
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		const str = 'im all stringy'
		const encrypted = await shrine.encrypt(str)
		const decrypted = await shrine.decrypt(encrypted)
		expect(decrypted).toEqual(str)
	})
	it('works with async/await and resolves', async () => {
		expect.assertions(1)
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		const str = 'im all stringy'
		const encrypted = await shrine.encrypt(str)
		const decrypted = shrine.decrypt(encrypted)
		expect(decrypted).resolves.toEqual(str)
	})
	it('decrypts with a different shrine object than it was encrypted with, provided identical secret', async () => {
		const secret = 'unquestionably unguessable'
		const shrineEnc = new Shrine512(secret)
		const shrineDec = new Shrine512(secret)
		const str = 'im all stringy'
		const encrypted = await shrineEnc.encrypt(str)
		const decrypted = await shrineDec.decrypt(encrypted)
		expect(decrypted).toEqual(str)
	})
	test('throws and does not decrypt with a different secret than was used to encrypt', () => {
		const str = 'im all stringy'
		let shrine = new Shrine512('onehardone')
		shrine.encrypt(str).then(encrypted => {
			new Shrine512('onehardonetwo')
				.shrine2.decrypt(encrypted)
				.then(err => {
					expect(err).toThrowError(new Error('Unsupported state or unable to authenticate data'))
				})
		})
	})
	test('throws on zero-length secret', () => {
		const secret = ''
		const test = () => new Shrine512(secret)
		expect(test).toThrowError(new Error('Expected non-empty string value.'))
	})
	test('throws on null secret', () => {
		const secret = null
		const test = () => new Shrine512(secret)
		expect(test).toThrowError(new Error('Expected non-empty string value.'))
	})
	test('throws on undefined secret', () => {
		const secret = undefined
		const test = () => new Shrine512(secret)
		expect(test).toThrowError(new Error('Expected non-empty string value.'))
	})
	test('throws on non- string secret', () => {
		const secret = /asd/
		const test = () => new Shrine512(secret)
		expect(test).toThrowError(new Error('Expected non-empty string value.'))
	})
	test('throws on zero-length input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const str = ''
		shrine.encrypt(str).then(encrypted => {
			expect(encrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	test('throws on null input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const str = null
		shrine.encrypt(str).then(encrypted => {
			expect(encrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	test('throws on undefined input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const str = undefined
		shrine.encrypt(str).then(encrypted => {
			expect(encrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	test('throws on zero-length input to decrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const encrypted = null
		shrine.decrypt(encrypted).then(decrypted => {
			expect(decrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	test('throws on undefined input to decrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const encrypted = undefined
		shrine.decrypt(encrypted).then(decrypted => {
			expect(decrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	test('throws on zero-length string input to decrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const encrypted = ''
		shrine.decrypt(encrypted).then(decrypted => {
			expect(decrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	test('throws on non- string input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const str = 512
		shrine.encrypt(str).then(encrypted => {
			expect(encrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	test('throws on non- string input to decrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const encrypted = /asd/
		shrine.encrypt(encrypted).then((decrypted) => {
			expect(decrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
})
