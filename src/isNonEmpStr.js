/**
 * Returns true of val is a string that isnt empty
 * @module isNonEmpStr
 * @param {any} val
 * @returns {boolean}
 */
export default function isNonEmpStr (val) {
    return typeof val === 'string' && val.length > 0
}
