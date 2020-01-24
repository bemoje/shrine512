

# shrine512
![link](https://img.shields.io/npm/dt/shrine512?label=downloads)
![link](https://img.shields.io/npm/dm/shrine512?label=over%20time)
![link](https://img.shields.io/github/forks/bemoje/shrine512)



## Introduction

Convenient and <b>beginner-friendly </b> module for <b>encryption</b>. It is very very <b>easy to use</b> and perform '[AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)' (SHA-512) encryption/decryption of strings, objects, filecontent, etc. It is using Node.js' native crypto API, which is very good, but not very self-explanatory or at all easy to use unless you are quite familiar with the many concepts of cryptography prior to using it. If you just want to get started with encrypting something, this module makes it as accessible as is possible.

<b>Fun fact</b>: The encryption algorithm itself was originally [developed by the NSA](https://en.wikipedia.org/wiki/NSA_Suite_B_Cryptography) of the US government.

For those who aren't sure when less could be enough, this module offers a very <b>heavy</b> type of <b>encryption</b>. However, this heaviness is also obvious from a computational point of view, meaning that it <b>takes a lot longer</b> to encrypt and decrypt data with this module compared to other methods whenever a little or even sometimes much less computational effort would otherwise suffice - that is, in terms of protecting against [brute-force](https://en.wikipedia.org/wiki/Brute-force_attack) attacks to a degree where that kind of attack is no longer practically feasable. To summarize: it's easy. It's always a secure type of encryption, but often way more than neccessary - and therefore slow.


<i>Disclaimer! The success of brute-force attacks are a <b>matter of chance</b> by nature, so even though it is neither practically relevant to worry about when sufficiently encrypted, nor realistic to randomly guess a strong encryption key, it is, however <b>theoretically possible</b> to correctly guess any secret, incl. any encryption key.</i>

###### [Benjamin Møller Jensen](mailto:bemoje@gmail.com)

---


## Why make this?
1. Many encryption libraries / tools <b>require</b> a lot of <b>prior knowledge</b> to know how to even use them. This does not. It's so simple, it's basically just an on/off switch. I might just be half-blind or unlucky, but I have not come across any module that is just absolutely simple with good defaults or fixed settings out of the box, so I thought to fill the gap as to help javascript on its never-ending way to becoming ever more friendly to newcomers than it already is.

2. Although other means of encryption can be 'good enough' in various specific use-cases, this tool consistently offers somewhere between 'way too much' and 'definately enough' encryption, assuming your encryption key is not (figuratively and not isolated to) just "1234".


---

# Features
- A single exposed class with only <b>two</b> simple instance methods, <b>encrypt</b> &  <b>decrypt</b>.

- Support for both <b>strings</b> & <b>objects</b>. So anything JSON.stringify-parsable, basically. In most cases, that means anything from file-contents to whatever.


- Tested with Mark Sugarburger's testing framework, <b>[Jest](https://jestjs.io/)</b> indeed with <b>100 % code-coverage</b>.


- A <b>128-bit</b> (maximum) <b>auth-tag length</b> is always used and is <b>automatic</b> and not configurable. [See this](http://csrc.nist.gov/publications/nistpubs/800-38D/SP-800-38D.pdf) if you should be confused as to why tag-length is important.


- Serializes with JSON.stringify and unserializes with JSON.parse. If that should not suffice, consider handling serialization yourself prior to passing your data to the encryption method. More universal serialization is a todo :)


- Encryption is <b>undeterministic</b>, meaning that the <b>same data</b> encrypted multiple times <b>does not produce identical output</b>, so that it's not just obvious and self-revealing the fact that it was so.


- <b>Salt (IV) is automatic</b> and also <b>very random</b>. This is to avoid being open to plaintext-checking attacks. The basics of this form of attack being that an attacker can predict the IV if the same one is used repeatedly. In certain scenarios, an attacker can even use the encryption operation as an 'oracle' and can thereby deduce the value of low entropy plaintext-blocks if encrypted by the same encryption key (of which the IV is part, along with the encryption key). So it's a way to indistinguisly imitate yourself creating a new unique key every time you encrypt something. This happens natively in t


- This and the encryption key are both stored so that it is inaccesible at runtime to all except the instance methods themselves, and can thereby be <b>used multiple times</b> without having to pass the encryption key around in an insecure way, potentially exposing it by accident. When the instance is garbage-collected by the runtime environment (V8, for instance), the encryption key is also destroyed simultaneously and to date inevitably, and to date with no possible means of recovery.


- The used algorithm natively attempts to <b>compensate for short encryption keys</b>, but please create long encryption keys instead of relying on that.

---

# Table of Contents
- [shrine512](#shrine512)
  - [Introduction](#introduction)
          - [Benjamin Møller Jensen](#benjamin-m%c3%b8ller-jensen)
  - [Why make this?](#why-make-this)
- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
        - [Compatibility](#compatibility)
        - [Dependencies](#dependencies)
        - [Package](#package)
- [Usage](#usage)
      - [Import](#import)
      - [Require](#require)
      - [Example](#example)
- [Tests](#tests)
      - [Coverage](#coverage)
    - [PASS  __tests__/shrine-512t.est.js (6.195s)](#pass-testsshrine-512testjs-6195s)
      - [Shrine512 works fine](#shrine512-works-fine)
  - [Trivial, but Important Disclaimers and Warnngs About Encryption Security](#trivial-but-important-disclaimers-and-warnngs-about-encryption-security)
  - [Support](#support)
  - [Contributing](#contributing)
  - [BSD-3 License](#bsd-3-license)
- [Source Code](#source-code)
  - [Table of Contents](#table-of-contents-1)
    - [createDecryptor](#createdecryptor)
      - [Parameters](#parameters)
    - [createEncryptor](#createencryptor)
      - [Parameters](#parameters-1)
    - [isNonEmpStr](#isnonempstr)
      - [Parameters](#parameters-2)
    - [isObject](#isobject)
      - [Parameters](#parameters-3)
    - [isUndefined](#isundefined)
      - [Parameters](#parameters-4)
  - [Shrine512](#shrine512-1)
- [main.js](#mainjs)
      - [Module entry point](#module-entry-point)
  - [Shrine512.js](#shrine512js)
  - [isUndefined.js](#isundefinedjs)
  - [isObject.js](#isobjectjs)
  - [isNonEmpStr.js](#isnonempstrjs)
  - [createKeyRetreiver.js](#createkeyretreiverjs)
  - [createEncryptor.js](#createencryptorjs)
  - [createDecryptor.js](#createdecryptorjs)
  - [shrine512.test.js](#shrine512testjs)





---

# Installation
##### Compatibility
![CommonJS](https://img.shields.io/badge/language-CJS-green.svg?label=compatible)
![ES6](https://img.shields.io/badge/language-ES6-green.svg?label=compatible)
![Electron](https://img.shields.io/badge/language-electron-red.svg?label=incompatible)
![Browser](https://img.shields.io/badge/language-browser-red.svg?label=incompatible)

##### Dependencies
[![dependencies Status](https://david-dm.org/bemoje/shrine512/status.svg)](https://david-dm.org/dwyl/bemoje/shrine512)
[![devDependencies Status](https://david-dm.org/repo/shrine512/dev-status.svg)](https://david-dm.org/dwyl/bemoje/shrine512?type=dev)

##### Package
```sh
npm install --save shrine512
```
---
# Usage
#### Import
```javascript
import Shrine512 from 'shrine512'
```
#### Require
```javascript
const Shrine512 = require('shrine512')
```
#### Example
```javascript
import Shrine512 from 'shrine512'
import assert from 'assert'

(async () => {
    try {
        //for simpler syntax
        const str = JSON.stringify
        const log = console.log

		//pass secret to new instance
		const shrine = new Shrine512('sum sickret, huh')

		//encrypt
		const enStr = await shrine.encrypt('a string')
		const enObj = await shrine.encrypt({ an: 'object' })

		//decrypt
		const deStr = await shrine.decrypt(enStr)
		const deObj = await shrine.decrypt(enObj)

		//assert
		assert(deStr === 'a string')
		assert(str(deObj) === str({ an: 'object' }))

		//console
        log({ enStr, enObj, deStr, deObj })

	} catch (e) { }
})()

/**
 * Console output:
 * ------------------
 * {
 *    enStr: '6abf361826ff8268a0dc60f77b9a8868145441ee921077c00b4 (...)',
 *    enObj: 'f8ab65f0bac60aa070c3649dca602c818fe364a39d0219d8ceb (...)',
 *    deStr: 'a string',
 *    deObj: { an: 'object' }
 * }
 */

```
---
# Tests
```sh
npm run test
```
#### Coverage
| File                  |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
|-----------------------|----------|----------|----------|----------|-------------------|
| All files             |      100 |      100 |      100 |      100 |                   |
| Shrine512.js          |      100 |      100 |      100 |      100 |                   |
| createDecryptor.js    |      100 |      100 |      100 |      100 |                   |
| createEncryptor.js    |      100 |      100 |      100 |      100 |                   |
| createKeyRetreiver.js |      100 |      100 |      100 |      100 |                   |
| isNonEmpStr.js        |      100 |      100 |      100 |      100 |                   |
| isObject.js           |      100 |      100 |      100 |      100 |                   |
| isUndefined.js        |      100 |      100 |      100 |      100 |                   |
| main.js               |        0 |        0 |        0 |        0 |                   |

### PASS  __tests__/shrine-512t.est.js (6.195s)
- Test Suites: 1 passed, 1 total
- Tests:       27 passed, 27 total
- Snapshots:   0 total
- Time:        7.155s
- Ran all test suites.



####  Shrine512 works fine
-  ? works with promises (129ms)

-  ? works with random strings of random lengths between 1 and 40 with random encryption keys of random lengths between 1 and 16 (1 (1997ms)

- ? works with objects containing a string of random length between 1 and 40 with random encryption keys of random lengths betweeneen 1 and 16 (1993ms)

- ? works with async/await (124ms)

- ? works with async/await and resolves (125ms)

- ? throws if undefined to encrypt is provided explicit

- ? throws if undefined to encrypt is provided (1ms)

- ? throws if undefined to encrypt is provided

- ? throws if null to encrypt is provided (63ms)

- ? throws if undefined to decrypt is provided

- ? throws if null to decrypt is provided

- ? does not throw if something to encrypt is provided (62ms)

- ? does not throw if something to decrypt is provided (62ms)

- ? decrypts with a different shrine object than it was encrypted with, provided identical secret (126ms)

- ? throws and does not decrypt with a different secret than was used to encrypt (63ms)

- ? throws on zero-length secret (3ms)

- ? throws on null secret

- ? throws on undefined secret (1ms)

- ? throws on non- string secret

- ? throws on zero-length input to encrypt (63ms)

- ? throws on null input to encrypt

- ? throws on undefined input to encrypt

- ? throws on zero-length input to decrypt

- ? throws on undefined input to decrypt

- ? throws on zero-length string input to decrypt (1ms)

- ? throws on non- string input to encrypt (63ms)

- ? throws on non- string input to encrypt (62ms)



---
## Trivial, but Important Disclaimers and Warnngs About Encryption Security
- In too many cases, the cause of data loss is forgetting one's own password/key.
- In too many cases, the cause of privacy loss (leaked data or unintended attacker access) is storing one's password/key somewhere that is not secure.
- Please do not forget the fact that anyone with the correct encryption key can access any encrypted data as easily as its owner.
- Please do remember that short key are far less secure. 16 characters is recommeneded.
- It's not important to create an unreadable key, such as this: "js9JkwusS73KSks.__sa7S". It's important that it's 16 characters LONG... AND non-trivial. The point is to make it unguessable by automatic/programmatical means, even if any given person/software has detailed information about you. Hint: It's impossible for anyone/thing to ever obtain certain information, such as someone's daughter's birtdate, so it's best to always use that whenever you can (sarcasm).
- Do always stay on top of present time threats that may exist that could comprimise or expoose your encryption key. For instance, watch out for [keyloggers](https://en.wikipedia.org/wiki/Keystroke_logging). But would you just get [a few things in order](https://www.privateinternetaccess.com/helpdesk/kb/articles/security-best-practices), and it should, however, be an extremely secure form of achieving data-privacy.




---
## Support
Please [open an issue](https://github.com/bemoje/shrine512/issues/new) for support.

---
## Contributing
Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/bemoje/shrine512/compare/).

---
## [BSD-3](https://opensource.org/licenses/BSD-3-Clause) License

© Copyright 2019 [Benjamin Møller Jensen](https://github.com/bemoje/) <<bemoje@gmail.com>>

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

---

# Source Code







-   **version**: 1.0.0
-   **author**: Benjamin Moeller Jensen &lt;bemoje@gmail.com>
-   **license**: BSD-3 Clause

---


## Table of Contents

-   [createDecryptor][1]
    -   [Parameters][2]
-   [createEncryptor][3]
    -   [Parameters][4]
-   [isNonEmpStr][5]
    -   [Parameters][6]
-   [isObject][7]
    -   [Parameters][8]
-   [isUndefined][9]
    -   [Parameters][10]
-   [Shrine512][11]
-   [Shrine512][12]

---
### createDecryptor

Returns the function that performs decryption.

#### Parameters

-   `sigrid` **[string][13]** The secret phrase
-   `sym` **[object][14]** The object used as key in the weakmap. @see createKeyRetreiver

Returns **[object][14]**

---
### createEncryptor

Returns the function that performs the encryption.

#### Parameters

-   `sigrid` **[string][13]** The secret phrase
-   `sym` **[object][14]** The object used as key in the weakmap. @see createKeyRetreiver

Returns **[object][14]**

---
### isNonEmpStr

Returns true of val is a string that isnt empty

#### Parameters

-   `val` **any**

Returns **[boolean][15]**

---
### isObject

Returns true if val is of type object

#### Parameters

-   `val` **any**

Returns **[boolean][15]**

---
### isUndefined

Returns true if val is undefined or null

#### Parameters

-   `val` **any**

Returns **[boolean][15]**



---
## Shrine512

The only public export. The constructor takes a secret encryption key and constructs an object from it that has two methods on it that can encrypt and decrypt respective, both strings and objects.

[1]: #createdecryptor

[2]: #parameters

[3]: #createencryptor

[4]: #parameters-1

[5]: #isnonempstr

[6]: #parameters-2

[7]: #isobject

[8]: #parameters-3

[9]: #isundefined

[10]: #parameters-4

[11]: #shrine512

[12]: #shrine512-1

[13]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[14]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[15]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

---
# main.js
#### Module entry point


```javascript
/**
 * Convenient and very VERY very easy to use 'AES-256-GCM' (SHA-512) encryption/decryption of strings, objects, filecontent, etc.
 * @module Shrine512
 * @version 1.0.0
 * @author Benjamin Moeller Jensen <bemoje@gmail.com>
 * @license BSD-3 Clause
 */
import Shrine512 from './Shrine512'
export default Shrine512
```
## Shrine512.js
```javascript
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

```
## isUndefined.js
```javascript
/**
 * Returns true if val is undefined or null
 * @module isUndefined
 * @param {any} val
 * @returns {boolean}
 */
export default function isUndefined (val) {
    return val === undefined || val === null
}

```

## isObject.js
```javascript
/**
 * Returns true if val is of type object
 * @module isObject
 * @param {any} val
 * @returns {boolean}
 */
export default function isObject (val) {
    return typeof val === 'object'
}

```
## isNonEmpStr.js
```javascript
/**
 * Returns true of val is a string that isnt empty
 * @module isNonEmpStr
 * @param {any} val
 * @returns {boolean}
 */
export default function isNonEmpStr (val) {
    return typeof val === 'string' && val.length > 0
}

```
## createKeyRetreiver.js
```javascript
import crypto from 'crypto'
const map = new WeakMap()

/**
 * Creates a function that creates the correct key provided a encryption key and it is also passed a unique symbol along with 'this'-object reference created inside the constructor of the exported class. So only that object will be able to retrieve this key-getter from the weakmap.
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

```
## createEncryptor.js
```javascript
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
 * @param {string} sigrid The encryption key
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

```
## createDecryptor.js
```javascript
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
 * @param {string} sigrid The encryption key
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

```
## shrine512.test.js
```javascript
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
```
