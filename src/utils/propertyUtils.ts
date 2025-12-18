
export const FIELDS_MAX = 255;

export type DestProperty = {
  codigo_unico: number;
  titulo: string;
  pais: string;
  region: string;
  ciudad: string;
  zona: string;
  area_total: number;
  area_construida: number;
  alcobas: number;
  banos: number;
  parqueaderos: number;
  estado: string;
  disponibilidad: string;
  tipo: string;
  encargado: string;
  imagen: string;
  precio_venta: number;
  precio_alquiler: number;
  moneda_venta: string;
  moneda_alquiler: string;
};

export function toDestProperty(p: any): DestProperty {
  const text = (s: any) => String(s || '').slice(0, FIELDS_MAX);
  const num = (n: any) => {
    const v = parseInt(String(n || '0'), 10);
    return Number.isFinite(v) ? v : 0;
  };
  return {
    codigo_unico: num(p?.id_property),
    titulo: text(p?.title),
    pais: text(p?.country_label || 'Colombia'),
    region: text(p?.region_label || ''),
    ciudad: text(p?.city_label || ''),
    zona: text(p?.zone_label || ''),
    area_total: num(p?.area),
    area_construida: num(p?.built_area),
    alcobas: num(p?.bedrooms),
    banos: num(p?.bathrooms),
    parqueaderos: num(p?.garages),
    estado: text(p?.property_condition_label || ''),
    disponibilidad: text(p?.availability_label || ''),
    tipo: text(p?.property_type_label || ''),
    encargado: text(p?.user_label || 'Hospelia'),
    imagen: p?.main_image?.url_original || p?.main_image?.url_big || p?.main_image?.url || '/zona-default.jpg',
    precio_venta: num(p?.sale_price),
    precio_alquiler: num(p?.rent_price),
    moneda_venta: text(p?.currency?.iso_code || p?.currency_label || 'COP'),
    moneda_alquiler: text(p?.rent_currency?.iso_code || p?.currency_label || 'COP'),
  };
}
