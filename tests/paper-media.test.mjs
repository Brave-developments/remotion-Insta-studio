import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseCommons, choosePexels, slug, validateBrief} from '../scripts/paper-media.mjs';

const scene = {id: 'opening', seconds: 6, layout: 'photo', headline: 'Real photo', photoQuery: 'garden'};
test('validates an image-based brief', () => {
  assert.equal(validateBrief({title: 'Documentary', scenes: [scene]}).totalSeconds, 6);
});
test('refuses malformed or duplicate scenes', () => {
  assert.throws(() => validateBrief({title: 'X', scenes: [scene, scene]}), /unique/);
  assert.throws(() => validateBrief({title: 'X', scenes: [{...scene, photoQuery: ''}]}), /photoQuery/);
  assert.throws(() => validateBrief({title: 'X', scenes: [{...scene, seconds: 0}]}), /seconds/);
});
test('metric must have documented source and actual value', () => {
  assert.throws(() => validateBrief({title: 'X', scenes: [{...scene, layout: 'metric'}]}), /sourceUrl/);
});
test('Pexels photos preserve the author and original link', () => {
  const photo = choosePexels({photos: [{
    id: 2, photographer: 'A. Photographer', url: 'https://www.pexels.com/photo/123',
    src: {large: 'https://images.pexels.com/photos/2/example.jpeg'}
  }]});
  assert.equal(photo.provider, 'pexels');
  assert.match(photo.attribution, /A. Photographer/);
});
test('Commons refuses unknown licences and only selects eligible raster images', () => {
  const bad = {title:'File:No.jpg',imageinfo:[{mime:'image/jpeg',width:2000,height:1800,
    thumburl:'https://upload.wikimedia.org/a.jpg',extmetadata:{LicenseShortName:{value:'All rights reserved'}}}]};
  const good = {title:'File:Yes.jpg',imageinfo:[{mime:'image/jpeg',width:2000,height:1800,
    thumburl:'https://upload.wikimedia.org/b.jpg',descriptionurl:'https://commons.wikimedia.org/wiki/File:Yes.jpg',
    extmetadata:{LicenseShortName:{value:'CC BY-SA 4.0'},Artist:{value:'Photo author'}}}]};
  const item = chooseCommons({query:{pages:{a:bad,b:good}}});
  assert.equal(item.title, 'File:Yes.jpg');
  assert.equal(chooseCommons({query:{pages:{a:bad}}}), null);
});
test('safe slug cannot escape the asset folder', () => {
  assert.equal(slug('../../a b//'), 'a-b');
});
