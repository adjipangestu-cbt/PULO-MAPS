/**
 * Pure logic functions for PULO-MAPS (Pulau Merak Kecil).
 * Decoupled from UI for ultra-mode deterministic unit testing.
 */

export interface PackageItem {
  id: string;
  name: string;
  category: 'camping' | 'snorkeling' | 'paddle' | 'jetski' | 'wahana';
  price: number;
  unit: string;
  capacity?: string;
  features: string[];
}

export function buildWhatsAppLink(
  phoneNumber: string,
  packageName: string,
  priceText: string,
  extraNotes?: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  let message = `Halo Admin Anak Pulo, saya ingin memesan *${packageName}* seharga *${priceText}*.`;
  if (extraNotes) {
    message += ` Catatan: ${extraNotes}`;
  }
  message += ` Mohon konfirmasi ketersediaan slot tanggal kunjungan saya. Terima kasih!`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function evaluateCapacityStatus(currentVisitors: number, maxCapacity = 500): {
  status: 'safe' | 'moderate' | 'full';
  label: string;
  percentage: number;
} {
  const percentage = Math.min(100, Math.round((currentVisitors / maxCapacity) * 100));
  if (percentage < 70) {
    return { status: 'safe', label: 'Terkendali (Ideal)', percentage };
  } else if (percentage < 95) {
    return { status: 'moderate', label: 'Mendekati Batas DDK', percentage };
  } else {
    return { status: 'full', label: 'Kapasitas Penuh (Batas DDK Tercapai)', percentage };
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
}

export function filterCatalogPackages<T extends { category: string }>(
  items: T[],
  selectedCategory: string
): T[] {
  if (!selectedCategory || selectedCategory === 'all') {
    return items;
  }
  if (selectedCategory === 'snorkeling-paddle') {
    return items.filter(
      (item) => item.category === 'snorkeling' || item.category === 'paddle'
    );
  }
  if (selectedCategory === 'jetski-wahana') {
    return items.filter(
      (item) => item.category === 'jetski' || item.category === 'wahana'
    );
  }
  return items.filter((item) => item.category === selectedCategory);
}

export type WeatherConditionKey = 'cerah' | 'berawan' | 'angin-barat';

export interface WeatherConditionDetail {
  key: WeatherConditionKey;
  label: string;
  temp: string;
  waveHeight: string;
  windSpeed: string;
  iconType: 'sun' | 'cloud-sun' | 'wind';
  statusLevel: 'safe' | 'caution';
  advisory: string;
}

export function getWeatherConditionDetails(key: WeatherConditionKey): WeatherConditionDetail {
  switch (key) {
    case 'cerah':
      return {
        key: 'cerah',
        label: 'Cerah Tropis',
        temp: '31°C · UV 8',
        waveHeight: '0.1 — 0.3 Meter',
        windSpeed: '5–8 Knot (Timur)',
        iconType: 'sun',
        statusLevel: 'safe',
        advisory: 'Sangat Aman untuk Berenang, Snorkeling & Paddleboard.',
      };
    case 'angin-barat':
      return {
        key: 'angin-barat',
        label: 'Angin Barat Kencang',
        temp: '27°C · Berangin',
        waveHeight: '0.8 — 1.3 Meter',
        windSpeed: '15–20 Knot (Barat)',
        iconType: 'wind',
        statusLevel: 'caution',
        advisory: 'Waspada Gelombang Barat! Hanya berenang di Pantai Timur.',
      };
    case 'berawan':
    default:
      return {
        key: 'berawan',
        label: 'Cerah Berawan',
        temp: '29°C · Teduh',
        waveHeight: '0.2 — 0.4 Meter',
        windSpeed: '7–10 Knot (Barat)',
        iconType: 'cloud-sun',
        statusLevel: 'safe',
        advisory: 'Aman untuk Berenang, Snorkeling & Paddleboard.',
      };
  }
}

