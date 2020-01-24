'use strict'
import Shrine512 from '../src/main'
import randomstring from 'randomstring'
import randomNumber from 'math-random'
const make = {
	randomStrings: () => {
		let rndStrings = []
		for (let i = 1; i <= 4; i++) {
			rndStrings.push(randomstring.generate(i * 4))
		}
		return rndStrings
	},
	randomObjects: () => {
		let rndObjects = []
		for (let i = 1; i <= 4; i++) {
			rndObjects.push({ key: randomstring.generate(i * 4) })
		}
		return rndObjects
	},
	shrines: () => {
		let rndSecrets = []
		for (let i = 1; i <= 4; i++) {
			rndSecrets.push(randomstring.generate(1 + randomNumber(i) * i * 4))
		}
		let shrines = []
		for (let secret of rndSecrets) {
			shrines.push({ shrine: new Shrine512(secret), secret: secret })
		}
		return shrines
	},
}
describe(`Shrine512's runnin'-legs are just fine and dandy.`, () => {
	it('works with promises', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		const str = 'im all stringy'
		shrine.encrypt(str).then(encrypted => {
			shrine.decrypt(encrypted).then(decrypted => {
				expect(decrypted).toEqual(str)
			})
		})
	})
	it('works with random strings of random lengths between 1 and 16 with random encryption keys of random lengths between 1 and 16', () => {
		for (let shrineNSecret of make.shrines()) {
			for (let str of make.randomStrings()) {
				shrineNSecret.shrine.encrypt(str).then(encrypted => {
					shrineNSecret.shrine.decrypt(encrypted).then(decrypted => {
						expect(decrypted).toEqual(str)
					})
				})
			}
		}
	})
	it('works with objects containing a string of random length between 1 and 16 with random encryption keys of random lengths between 1 and 16', () => {
		for (let shrineNSecret of make.shrines()) {
			for (let obj of make.randomObjects()) {
				shrineNSecret.shrine.encrypt(obj).then(encrypted => {
					shrineNSecret.shrine.decrypt(encrypted).then(decrypted => {
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
	it('throws if undefined to encrypt is provided explicit', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		shrine
			.encrypt()
			.then(err =>
				expect(err).toEqual(new Error('Expected non-empty string value or object.')),
			)
	})
	it('throws if undefined to encrypt is provided', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		shrine
			.encrypt()
			.then(err =>
				expect(err).toThrowError(new Error('Expected non-empty string value or object.')),
			)
	})
	it('throws if undefined to encrypt is provided', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		shrine.encrypt().then(err => expect(err).toThrow())
	})
	it('throws if null to encrypt is provided', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		shrine
			.encrypt('')
			.then(err =>
				expect(err).toEqual(new Error('Expected non-empty string value or object.')),
			)
	})
	it('throws if undefined to decrypt is provided', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		shrine.decrypt().then(err => expect(err).toThrow())
	})
	it('throws if null to decrypt is provided', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		shrine.decrypt(null).then(err => expect(err).toThrow())
	})
	it('does not throw if something to encrypt is provided', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		shrine.encrypt('something').then(err => expect(err).not.toThrow())
	})
	it('does not throw if something to decrypt is provided', () => {
		const secret = 'unquestionably unguessable'
		const shrine = new Shrine512(secret)
		shrine.decrypt('something').then(err => expect(err).not.toThrow())
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
	it('throws and does not decrypt with a different secret than was used to encrypt', () => {
		const str = 'im all stringy'
		let shrine = new Shrine512('onehardone')
		shrine.encrypt(str).then(encrypted => {
			new Shrine512('onehardonetwo').shrine2.decrypt(encrypted).then(err => {
				expect(err).toThrowError(
					new Error('Unsupported state or unable to authenticate data'),
				)
			})
		})
	})
	it('throws on zero-length secret', () => {
		const secret = ''
		const test = () => new Shrine512(secret)
		expect(test).toThrowError(new Error('Expected non-empty string value.'))
	})
	it('throws on null secret', () => {
		const secret = null
		const test = () => new Shrine512(secret)
		expect(test).toThrowError(new Error('Expected non-empty string value.'))
	})
	it('throws on undefined secret', () => {
		const secret = undefined
		const test = () => new Shrine512(secret)
		expect(test).toThrowError(new Error('Expected non-empty string value.'))
	})
	it('throws on non- string secret', () => {
		const secret = /asd/
		const test = () => new Shrine512(secret)
		expect(test).toThrowError(new Error('Expected non-empty string value.'))
	})
	it('throws on zero-length input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const str = ''
		shrine.encrypt(str).then(encrypted => {
			expect(encrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	it('throws on null input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const str = null
		shrine.encrypt(str).then(encrypted => {
			expect(encrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	it('throws on undefined input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const str = undefined
		shrine.encrypt(str).then(encrypted => {
			expect(encrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	it('throws on zero-length input to decrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const encrypted = null
		shrine.decrypt(encrypted).then(decrypted => {
			expect(decrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	it('throws on undefined input to decrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const encrypted = undefined
		shrine.decrypt(encrypted).then(decrypted => {
			expect(decrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	it('throws on zero-length string input to decrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const encrypted = ''
		shrine.decrypt(encrypted).then(decrypted => {
			expect(decrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	it('throws on non- string input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const str = 512
		shrine.encrypt(str).then(encrypted => {
			expect(encrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
	it('throws on non- string input to encrypt', () => {
		const secret = 'not nothing'
		const shrine = new Shrine512(secret)
		const encrypted = /asd/
		shrine.encrypt(encrypted).then(decrypted => {
			expect(decrypted).toThrowError(new Error('Expected non-empty string value.'))
		})
	})
})
