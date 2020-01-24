//import commonjs from 'rollup-plugin-commonjs'
//import resolve from 'rollup-plugin-node-resolve'
//import sourceMaps from 'rollup-plugin-sourcemaps'
//import { terser } from 'rollup-plugin-terser'
//import pkg from './package.json'

var packageName = require('./package.json').name

module.exports = {
    input: './src/main.js',
    external: [ 'crypto' ],
	output: [
        {
            globals: {crypto:'crypto'},
			file: 'dist/' + packageName + '.es.js',
            format: 'esm',
            external: [ 'crypto' ],
		},
        {
            globals: {crypto:'crypto'},
			file: 'dist/' + packageName + '.umd.js',
			format: 'umd',
            name: packageName,
            external: [ 'crypto' ],
		},
        {
            globals: {crypto:'crypto'},
			file: 'dist/' + packageName + '.cjs.js',
			format: 'cjs',
            name: packageName,
            external: [ 'crypto' ],
		},
	],
}
