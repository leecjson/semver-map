'use strict';

const semver = require('semver');
const assert = require('assert');

/**
 * @property {Map} _dict
 */
class SemverMap {
  constructor() {
    this._dict = new Map();
  }

  /**
   * 
   * @param {string} key 
   * @param {*} val 
   * @throws {*} invalid input
   */
  add(key, val) {
    const [id, rawver] = this._parseKey(key);
    const ver = new semver.SemVer(rawver);
    ver._extra = val;
    const site = this._dict.get(id);
    if (site) {
      const last = site.vers[site.vers.length - 1];
      assert(ver.compare(last) > 0, 'expect increasing version!');
      site.vers.push(ver);
      site.cached.clear();
    } else {
      this._dict.set(id, {
        vers: [ver], cached: new Map(),
      });
    }
  }

  /**
   * 
   * @param {string} key
   * @throws {*} invalid input
   */
  get(key) {
    const [id, rawRange, flag] = this._parseKeyAsRange(key);
    const site = this._dict.get(id);
    if (site) {
      const trait = rawRange + '@' + flag;
      const val = site.cached.get(trait);
      if (typeof (val) !== 'undefined') {
        return val;
      }
      const range = new semver.Range(rawRange);
      const satisfy = flag === 'max' ?
        semver.maxSatisfying : semver.minSatisfying;
      const ver = satisfy(site.vers, range);
      if (ver) {
        site.cached.set(trait, ver._extra);
        return ver._extra;
      }
    }
  }

  _parseKey(key) {
    assert(typeof (key) === 'string', 'invalid key');
    const items = key.split('@');
    assert(items.length === 2  && items[0].length > 0 && items[1].length > 0, 'invalid key');
    return items;
  }

  _parseKeyAsRange(key) {
    assert(typeof (key) === 'string', 'invalid key');
    const items = key.split('@');
    assert((items.length === 2 || items.length === 3) &&
      items[0].length > 0 &&
      items[1].length > 0, 'invalid key');
    if (items.length === 2) {
      items.push('max');
    } else if (items.length === 3) {
      const s = items[2];
      assert(s === 'max' || s === 'min', 'invalid key');
    }
    return items;
  }
}

module.exports = SemverMap;


// const map = new SemverMap();
// map.add('myname@1.4.2-alpha', 1);
// map.add('myname@1.4.2-beta', 2);
// map.add('myname@1.4.4', 3);
// map.get('myname@^1.4.1-alpha');