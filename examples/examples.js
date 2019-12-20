import Shrine512 from '../src/shrine512'
//import Shrine512 from 'shrine512'

/**
 * usage example
 */
(async () => {
	try {
		/**
		 * secret key and create encryption tool
		 */
		const secret = 'sickret'
		const shrine = new Shrine512(secret)

		/**
		 * test subjects, string and object
		 */
		const str = 'str'
		const obj = { im_the: 'objective 1' }

		/**
		 * encrypting each
		 */
		const encStr = await shrine.encrypt(str)
		const encObj = await shrine.encrypt(obj)

		/**
		 * decrypting each
		 */
		const decStr = await shrine.decrypt(encStr)
		const decObj = await shrine.decrypt(encObj)

		/**
		 * values -> console
		 */
		console.log({
			unencried: {
				string: str,
				object: obj
			},
			crying: {
				string: encStr,
				object: encObj
			},
			decried: {
				string: decStr,
				object: decObj
			}
		})
	} catch (err) { console.log(err) }
})()

/**
 * => OUTPUTS /*
 * {
 *   unencried: { string: 'im a string', object: { im_the: 'objective 1' } },
 *   crying: {
 *     string: 'cfbac27f1909cc436952045ed4d5d1f7d6493901786bc070ecb01809d312aeca3c9e8aa6c31708e219c611bc49bd055bad9a04e1724cec07b79280189caadaab20bd312de6024198be066d8594933fc1afff15ad04229cc24c462fb556bc9c408a681bb1f82d677880ab52',
 *     object: 'dc04104a8962d2b203cecb61c7bc72eb584941785005624faed2f9849f0a065777d76e37a3df61d96b13454f45aa0109dedf431235503f273f5170bf815a61b776386874ff6f366871a4951c1170448ff2dad3f813651f2093cd9789bf9290975cb999534e25730f0c5036949ba7459e6919577aed5ed330'
 *   },
 *   tearDried: { string: 'im a string', object: { im_the: 'objective 1' } }
 * }
 *
*/