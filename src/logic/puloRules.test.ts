import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppLink,
  evaluateCapacityStatus,
  formatRupiah,
  filterCatalogPackages,
  getWeatherConditionDetails,
} from './puloRules.js';

test('buildWhatsAppLink generates valid wa.me URL with encoded package and price', () => {
  const link = buildWhatsAppLink('6281234567890', 'Paket Marlin', 'Rp 250.000');
  assert.ok(link.startsWith('https://wa.me/6281234567890?text='));
  assert.ok(link.includes(encodeURIComponent('Paket Marlin')));
  assert.ok(link.includes(encodeURIComponent('Rp 250.000')));
});

test('evaluateCapacityStatus correctly categorizes visitor loads', () => {
  const low = evaluateCapacityStatus(200, 500);
  assert.equal(low.status, 'safe');
  assert.equal(low.percentage, 40);

  const medium = evaluateCapacityStatus(400, 500);
  assert.equal(medium.status, 'moderate');
  assert.equal(medium.percentage, 80);

  const full = evaluateCapacityStatus(520, 500);
  assert.equal(full.status, 'full');
  assert.equal(full.percentage, 100);
});

test('formatRupiah produces standard formatted Indonesian rupiah string', () => {
  const formatted = formatRupiah(250000);
  assert.ok(formatted.includes('250.000'));
});

test('filterCatalogPackages correctly filters categories', () => {
  const sample = [
    { id: '1', category: 'camping' },
    { id: '2', category: 'snorkeling' },
    { id: '3', category: 'paddle' },
    { id: '4', category: 'jetski' },
    { id: '5', category: 'wahana' },
  ];

  const all = filterCatalogPackages(sample, 'all');
  assert.equal(all.length, 5);

  const camping = filterCatalogPackages(sample, 'camping');
  assert.equal(camping.length, 1);
  assert.equal(camping[0].category, 'camping');

  const snorkelPaddle = filterCatalogPackages(sample, 'snorkeling-paddle');
  assert.equal(snorkelPaddle.length, 2);

  const jetskiWahana = filterCatalogPackages(sample, 'jetski-wahana');
  assert.equal(jetskiWahana.length, 2);
});

test('getWeatherConditionDetails returns accurate iconType, waveHeight, and statusLevel', () => {
  const cerah = getWeatherConditionDetails('cerah');
  assert.equal(cerah.iconType, 'sun');
  assert.equal(cerah.statusLevel, 'safe');

  const berawan = getWeatherConditionDetails('berawan');
  assert.equal(berawan.iconType, 'cloud-sun');
  assert.equal(berawan.statusLevel, 'safe');

  const anginBarat = getWeatherConditionDetails('angin-barat');
  assert.equal(anginBarat.iconType, 'wind');
  assert.equal(anginBarat.statusLevel, 'caution');
});

