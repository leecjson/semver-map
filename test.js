'use strict';

const SemverMap = require('./index');

test('usage test', () => {
  const map = new SemverMap();
  map.add('myname@1.0.0', 'star lord');
  expect(map.get('myname@1.0.0')).toBe('star lord');

  map.add('myname@1.0.1', 'haha');
  expect(map.get('myname@1.0.1')).toBe('haha');

  map.add('myname@1.0.2', 'hehe');
  expect(map.get('myname@^1.0.1')).toBe('hehe');
  expect(map.get('myname@^1.0.1@max')).toBe('hehe');
  expect(map.get('myname@^1.0.1@min')).toBe('haha');

  map.add('myname@1.4.5', 'pppp');
  expect(map.get('myname@1.x')).toBe('pppp');
  expect(map.get('myname@1.x@max')).toBe('pppp');
  expect(map.get('myname@1.x@min')).toBe('star lord');

  map.add('myname@1.4.6', 'kkkk');
  expect(map.get('myname@1.4.6@max')).toBe('kkkk');
  expect(map.get('myname@1.4.6@min')).toBe('kkkk');

  map.add('myname@1.4.7', null);
  map.add('myname@1.4.8', undefined);
  map.add('myname@1.4.9', 0);
  expect(map.get('myname@1.4.7')).toBe(null);
  expect(map.get('myname@1.4.7')).toBe(null);
  expect(map.get('myname@1.4.8')).toBe(undefined);
  expect(map.get('myname@1.4.8')).toBe(undefined);
  expect(map.get('myname@1.4.x')).toBe(0);
  expect(map.get('myname@1.4.x')).toBe(0);

  map.add('webpack@7.4.3', [1, 2, 3]);
  expect(map.get('webpack@^7.4.1')).toEqual([1, 2, 3]);
  map.add('loadash@4.2.3-rc.1', 555);
  expect(map.get('loadash@4.2.3-rc.1')).toBe(555);
});