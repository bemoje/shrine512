import assert from 'assert'
import Shrine512 from '../src/main'
//import Shrine512 from 'shrine512'

(async () => {
    try {
        const str = JSON.stringify
        const log = console.log.bind(console, arguments)
		//pass secret to new instance
		const shrine = new Shrine512('sum sickret, huh')

		//encrypt
		const enStr = await shrine.encrypt('a string')
		const enObj = await shrine.encrypt({ an: 'object' })

		//decrypt
		const deStr = await shrine.decrypt(enStr)
		const deObj = await shrine.decrypt(enObj)

		//check
		assert(deStr === 'a string')
		assert(str(deObj) === str({ an: 'object' }))

		//console
		log({ enStr, enObj, deStr, deObj })
	} catch (e) {}
})()

/**
 * The above outputs
 * ------------------
 * {
 *    enStr: '6abf361826ff8268a0dc60f77b9a8868145441ee921077c00b4 (...)',
 *    enObj: 'f8ab65f0bac60aa070c3649dca602c818fe364a39d0219d8ceb (...)',
 *    deStr: 'a string',
 *    deObj: { an: 'object' }
 * }
 */
