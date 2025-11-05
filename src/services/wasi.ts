// Servicio para integración con Wasi CRM
interface WasiClientData {
  id_company: number;
  wasi_token: string;
  id_user: number;
  first_name: string;
  last_name?: string;
  email: string;
  cell_phone: string;
  id_client_origin: number;
  id_country: number; // Obligatorio - Colombia = 1
  id_region: number; // Obligatorio - Valle del Cauca = 32
  id_city: number; // Obligatorio - Cali = 132
  comment?: string;
  // Campos adicionales del formulario
  phone?: string;
  address?: string;
  query?: string;
  reference?: string;
  send_information?: boolean;
}

interface WasiClientResponse {
  id_client: number;
  status: string;
}

interface WasiClientOrigin {
  id_client_origin: number;
  name: string;
  public: boolean;
}

interface WasiClientOriginsResponse {
  [key: string]: WasiClientOrigin | string;
  status: string;
}

// Interfaces para Etiquetas de Wasi
interface WasiLabel {
  id_label: number;
  label: string;
  label_color: string;
  status: string;
}

interface WasiLabelResponse {
  id_label: number;
  label: string;
  label_color: string;
  status: string;
}

interface WasiCreateLabelData {
  name: string;
  color: string;
}

// Interfaces para Propiedades de Wasi
interface WasiPropertyImage {
  id: string;
  url: string;
  url_big: string;
  url_original: string;
  description: string;
  position: string;
}

interface WasiPropertyGallery {
  id: string;
  [key: string]: WasiPropertyImage | string;
}

interface WasiPropertyFeature {
  id: string;
  nombre: string;
  name: string;
}

interface WasiPropertyFeatures {
  internal: WasiPropertyFeature[];
  external: WasiPropertyFeature[];
}

interface WasiProperty {
  id_property: number;
  id_company: number;
  id_user: number;
  for_sale: string;
  for_rent: string;
  for_transfer: string;
  id_property_type: number;
  id_country: number;
  country_label: string;
  id_region: number;
  region_label: string;
  id_city: number;
  city_label: string;
  id_location: number;
  location_label: string;
  id_zone: number;
  zone_label: string;
  id_currency: number;
  iso_currency: string;
  name_currency: string;
  title: string;
  address: string;
  tv_share: number;
  half_bathrooms: number;
  area: string;
  id_unit_area: string;
  unit_area_label: string;
  built_area: string;
  id_unit_built_area: string;
  unit_built_area_label: string;
  private_area: string;
  id_unit_private_area: string;
  unit_private_area_label: string;
  maintenance_fee: string;
  sale_price: string;
  sale_price_label: string;
  rent_price: string;
  rent_price_label: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  floor: string;
  furnished?: string;
  observations: string;
  video: string;
  id_property_condition: string;
  property_condition_label: string;
  id_status_on_page: string;
  status_on_page_label: string;
  map: string;
  latitude: string;
  longitude: string;
  building_date: string;
  network_share: boolean;
  visits: number;
  created_at: string;
  updated_at: string;
  reference: string;
  comment: string;
  id_rents_type: string;
  rents_type_label: string;
  zip_code: string;
  id_availability: string;
  availability_label: string;
  id_publish_on_map: string;
  publish_on_map_label: string;
  main_image: WasiPropertyImage;
  galleries: WasiPropertyGallery[];
  features: WasiPropertyFeatures;
  label: string;
  owner: string;
}

interface WasiPropertiesResponse {
  total: number;
  status: string;
  [key: string]: WasiProperty | number | string;
}

interface WasiPropertySearchParams {
  // Filtros básicos
  match?: string;
  id_property?: number;
  id_user?: number;
  title?: string;
  
  // Ubicación
  id_country?: number;
  id_region?: number;
  id_city?: number;
  id_location?: number;
  id_zone?: number | string; // Puede ser múltiples IDs separados por coma
  
  // Tipo y negocio
  id_property_type?: number;
  for_sale?: boolean;
  for_rent?: boolean;
  for_transfer?: boolean;
  
  // Características
  min_bedrooms?: number;
  max_bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  building_date?: number;
  
  // Precios
  min_price?: number;
  max_price?: number;
  
  // Áreas
  min_private_area?: number;
  max_private_area?: number;
  min_built_area?: number;
  max_built_area?: number;
  min_area?: number;
  max_area?: number;
  
  // Estados
  id_status_on_page?: number;
  id_availability?: number;
  id_property_condition?: number;
  
  // Configuraciones especiales
  scope?: number; // 1=privado, 2=aliados, 3=todas, 4=grupo
  short?: boolean; // true para versión reducida sin galerías/características
  lax_business_type?: boolean; // true para filtrado flexible de tipo de negocio
  
  // Paginación y ordenamiento
  skip?: number;
  take?: number;
  order?: 'asc' | 'desc';
  order_by?: 'id_property' | 'title' | 'id_country' | 'id_region' | 'id_city' | 
            'id_property_type' | 'id_business_type' | 'sale_price' | 'rent_price' | 
            'visits' | 'id_status_on_page' | 'created_at' | 'max_price' | 'min_price';
}

class WasiService {
  private readonly baseUrl: string;
  private readonly companyId: number;
  private readonly wasiToken: string;
  private readonly defaultUserId: number;
  private readonly colombiaCountryId: number = 1; // Colombia
  private readonly valleDelCaucaRegionId: number = 32; // Valle del Cauca
  private readonly caliCityId: number = 132; // Cali

  constructor() {
    this.baseUrl = process.env.WASI_API_URL || 'https://api.wasi.co';
    this.companyId = parseInt(process.env.WASI_COMPANY_ID || '26226712');
    this.wasiToken = process.env.WASI_API_KEY || 'S0KH_Fr25_vJXr_3Ugo';
    this.defaultUserId = parseInt(process.env.WASI_USER_ID || '265659');
  }

  /**
   * Obtiene todas las propiedades desde Wasi API
   */
  async searchProperties(filters: WasiPropertySearchParams = {}): Promise<WasiPropertiesResponse> {
    try {
      const payload = {
        id_company: this.companyId,
        wasi_token: this.wasiToken,
        ...filters
      };

      const response = await fetch(`${this.baseUrl}/v1/property/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener propiedades: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene propiedades disponibles para venta
   */
  async getPropertiesForSale(filters: Omit<WasiPropertySearchParams, 'for_sale'> = {}): Promise<WasiPropertiesResponse> {
    return this.searchProperties({
      ...filters,
      for_sale: true,
      id_availability: 1, // Disponible
      scope: 3, // Todas las propiedades (propias y aliados)
      order: 'desc',
      order_by: 'created_at'
    });
  }

  /**
   * Obtiene propiedades disponibles para renta
   */
  async getPropertiesForRent(filters: Omit<WasiPropertySearchParams, 'for_rent'> = {}): Promise<WasiPropertiesResponse> {
    return this.searchProperties({
      ...filters,
      for_rent: true,
      id_availability: 1, // Disponible
      scope: 3, // Todas las propiedades (propias y aliados)
      order: 'desc',
      order_by: 'created_at'
    });
  }

  /**
   * Obtiene propiedades por ubicación específica
   */
  async getPropertiesByLocation(
    city?: number,
    region?: number,
    country?: number,
    additionalFilters: WasiPropertySearchParams = {}
  ): Promise<WasiPropertiesResponse> {
    return this.searchProperties({
      ...additionalFilters,
      id_country: country || this.colombiaCountryId,
      id_region: region || this.valleDelCaucaRegionId,
      id_city: city || this.caliCityId,
      id_availability: 1, // Disponible
      scope: 3, // Todas las propiedades
      order: 'desc',
      order_by: 'created_at'
    });
  }

  /**
   * Busca propiedades por texto
   */
  async searchPropertiesByText(
    searchText: string,
    additionalFilters: WasiPropertySearchParams = {}
  ): Promise<WasiPropertiesResponse> {
    return this.searchProperties({
      ...additionalFilters,
      match: searchText,
      id_availability: 1, // Disponible
      scope: 3, // Todas las propiedades
      order: 'desc',
      order_by: 'visits' // Ordenar por popularidad
    });
  }

  /**
   * Obtiene propiedades por rango de precio
   */
  async getPropertiesByPriceRange(
    minPrice: number,
    maxPrice: number,
    forSale: boolean = true,
    additionalFilters: WasiPropertySearchParams = {}
  ): Promise<WasiPropertiesResponse> {
    return this.searchProperties({
      ...additionalFilters,
      min_price: minPrice,
      max_price: maxPrice,
      for_sale: forSale,
      for_rent: !forSale,
      id_availability: 1, // Disponible
      scope: 3, // Todas las propiedades
      order: 'asc',
      order_by: forSale ? 'sale_price' : 'rent_price'
    });
  }

  /**
   * Obtiene todos los medios de captación disponibles
   * Nota: El endpoint requiere método GET según documentación, no POST
   */
  async getClientOrigins(): Promise<WasiClientOriginsResponse> {
    try {
      const payload = {
        id_company: this.companyId,
        wasi_token: this.wasiToken
      };

      // Intentar primero con POST (método anterior)
      let response = await fetch(`${this.baseUrl}/v1/client-origin/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Si falla con POST, intentar con GET
      if (!response.ok && response.status === 405) {
        const urlWithParams = `${this.baseUrl}/v1/client-origin/all?id_company=${this.companyId}&wasi_token=${this.wasiToken}`;
        response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener medios de captación: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca el ID del medio de captación por nombre
   */
  async findClientOriginByName(name: string): Promise<number> {
    try {
      const origins = await this.getClientOrigins();
      
      // Buscar por nombre exacto o similar
      const originEntry = Object.values(origins).find((origin: any) => 
        origin && 
        typeof origin === 'object' && 
        'name' in origin &&
        typeof origin.name === 'string' &&
        origin.name.toLowerCase().includes(name.toLowerCase())
      ) as WasiClientOrigin | undefined;

      if (originEntry && 'id_client_origin' in originEntry) {
        return originEntry.id_client_origin;
      }

      // Si no encuentra el nombre, usar "Portal Inmobiliario" por defecto (ID 124)
      return 124;
    } catch (error) {
      // Retornar ID por defecto en caso de error
      return 124;
    }
  }

  /**
   * Crea un nuevo cliente en Wasi CRM
   */
  async createClient(clientData: Omit<WasiClientData, 'id_company' | 'wasi_token'>, labelId?: number): Promise<WasiClientResponse> {
    try {
      const dataToSend = {
        id_company: this.companyId,
        wasi_token: this.wasiToken,
        ...clientData
      };

      // Intentar agregar etiqueta si se proporciona
      if (labelId) {
        console.log(`🏷️ Intentando asignar etiqueta ID ${labelId} al crear cliente...`);
        // Intentar diferentes nombres de parámetro para la etiqueta
        (dataToSend as any).tag = labelId;
        (dataToSend as any).label_id = labelId;
        (dataToSend as any).id_label = labelId;
      }

      const response = await fetch(`${this.baseUrl}/v1/client/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      // Intentar obtener el JSON de respuesta sin importar el status
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        const textResponse = await response.text();
        throw new Error(`Respuesta inválida de Wasi: ${textResponse}`);
      }

      if (!response.ok || responseData.status === 'error') {
        // Intentar extraer el mensaje de error más específico
        const errorMessage = responseData?.message || responseData?.error || responseData?.details || JSON.stringify(responseData);
        throw new Error(`Error al crear cliente en Wasi: ${response.status} - ${errorMessage}`);
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  // ====================== FUNCIONES DE ETIQUETAS ======================

  /**
   * Crear una nueva etiqueta en Wasi
   */
  async createLabel(labelData: WasiCreateLabelData): Promise<WasiLabelResponse> {
    try {
      const url = `${this.baseUrl}/v1/property/label/add`;
      
      const body = new FormData();
      body.append('id_company', this.companyId.toString());
      body.append('wasi_token', this.wasiToken);
      body.append('name', labelData.name);
      body.append('color', labelData.color);

      console.log('🏷️ Creando etiqueta en Wasi:', labelData);

      const response = await fetch(url, {
        method: 'POST',
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status !== 'success') {
        throw new Error(`Error al crear etiqueta: ${JSON.stringify(result)}`);
      }

      console.log('✅ Etiqueta creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al crear etiqueta en Wasi:', error);
      throw error;
    }
  }

  /**
   * Actualizar una etiqueta existente
   */
  async updateLabel(labelId: number, labelData: WasiCreateLabelData): Promise<WasiLabelResponse> {
    try {
      const url = `${this.baseUrl}/v1/property/label/update/${labelId}`;
      
      const body = new FormData();
      body.append('id_company', this.companyId.toString());
      body.append('wasi_token', this.wasiToken);
      body.append('name', labelData.name);
      body.append('color', labelData.color);

      console.log('🏷️ Actualizando etiqueta en Wasi:', { labelId, ...labelData });

      const response = await fetch(url, {
        method: 'POST',
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status !== 'success') {
        throw new Error(`Error al actualizar etiqueta: ${JSON.stringify(result)}`);
      }

      console.log('✅ Etiqueta actualizada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al actualizar etiqueta en Wasi:', error);
      throw error;
    }
  }

  /**
   * Eliminar una etiqueta
   */
  async deleteLabel(labelId: number): Promise<{ status: string }> {
    try {
      const url = `${this.baseUrl}/v1/property/label/delete/${labelId}`;
      
      const body = new FormData();
      body.append('id_company', this.companyId.toString());
      body.append('wasi_token', this.wasiToken);

      console.log('🗑️ Eliminando etiqueta en Wasi:', labelId);

      const response = await fetch(url, {
        method: 'POST',
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.status !== 'success') {
        throw new Error(`Error al eliminar etiqueta: ${JSON.stringify(result)}`);
      }

      console.log('✅ Etiqueta eliminada exitosamente');
      return result;
    } catch (error) {
      console.error('❌ Error al eliminar etiqueta en Wasi:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las etiquetas disponibles (propiedades)
   */
  async getAllLabels(): Promise<WasiLabel[]> {
    try {
      const url = `${this.baseUrl}/v1/property/label/all?id_company=${this.companyId}&wasi_token=${this.wasiToken}`;
      
      console.log('🔍 Obteniendo todas las etiquetas de propiedades...');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        // Convertir el objeto numerado a array
        const labels: WasiLabel[] = [];
        Object.keys(result).forEach(key => {
          if (key !== 'status' && result[key].id_label) {
            labels.push({
              id_label: result[key].id_label,
              label: result[key].label,
              label_color: result[key].label_color,
              status: 'success'
            });
          }
        });
        console.log('✅ Etiquetas de propiedades obtenidas:', labels.length);
        return labels;
      } else {
        throw new Error(`Error de Wasi: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error('❌ Error al obtener etiquetas de propiedades:', error);
      return [];
    }
  }

  /**
   * Obtener etiquetas de clientes desde clientes existentes
   */
  async getClientLabels(): Promise<Array<{id: number, etiqueta: string, color: string}>> {
    try {
      const payload = {
        id_company: this.companyId,
        wasi_token: this.wasiToken,
        take: 100 // Obtener más clientes para encontrar etiquetas
      };

      console.log('🔍 Obteniendo etiquetas de clientes desde clientes existentes...');

      const response = await fetch(`${this.baseUrl}/v1/client/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status !== 'success') {
        throw new Error(`Error al obtener clientes: ${JSON.stringify(result)}`);
      }

      // Extraer todas las etiquetas únicas de los clientes
      const clientLabels = new Map<number, {id: number, etiqueta: string, color: string}>();
      
      Object.keys(result).forEach(key => {
        if (key !== 'status' && key !== 'total' && typeof result[key] === 'object') {
          const client = result[key];
          if (client.tag && Array.isArray(client.tag)) {
            client.tag.forEach((tag: any) => {
              if (tag.id && tag.etiqueta) {
                clientLabels.set(tag.id, {
                  id: tag.id,
                  etiqueta: tag.etiqueta,
                  color: tag.color || '#333'
                });
              }
            });
          }
        }
      });

      const labels = Array.from(clientLabels.values());
      console.log(`✅ Etiquetas de clientes encontradas: ${labels.length}`, labels.map(l => `"${l.etiqueta}" (ID: ${l.id})`));
      return labels;
    } catch (error) {
      console.error('❌ Error al obtener etiquetas de clientes:', error);
      return [];
    }
  }

  /**
   * Buscar ID de etiqueta por nombre (busca en etiquetas de clientes y propiedades)
   */
  async findLabelByName(labelName: string): Promise<number | null> {
    try {
      // Buscar primero en etiquetas de clientes
      const clientLabels = await this.getClientLabels();
      
      // Mostrar todas las etiquetas de clientes disponibles para debug
      console.log('🏷️ Etiquetas de clientes disponibles:', clientLabels.map(l => `"${l.etiqueta}" (ID: ${l.id})`));
      
      const clientLabel = clientLabels.find(l => 
        l.etiqueta.toLowerCase().trim() === labelName.toLowerCase().trim()
      );
      
      if (clientLabel) {
        console.log(`🎯 Etiqueta de cliente "${labelName}" encontrada con ID:`, clientLabel.id);
        return clientLabel.id;
      }
      
      // Si no se encuentra en clientes, buscar en etiquetas de propiedades
      console.log(`🔍 Buscando "${labelName}" en etiquetas de propiedades...`);
      const propertyLabels = await this.getAllLabels();
      
      console.log('🏷️ Etiquetas de propiedades disponibles:', propertyLabels.map(l => `"${l.label}" (ID: ${l.id_label})`));
      
      const propertyLabel = propertyLabels.find(l => 
        l.label.toLowerCase().trim() === labelName.toLowerCase().trim()
      );
      
      if (propertyLabel) {
        console.log(`🎯 Etiqueta de propiedad "${labelName}" encontrada con ID:`, propertyLabel.id_label);
        return propertyLabel.id_label;
      }
      
      console.log(`⚠️ Etiqueta "${labelName}" no encontrada en ningún lado`);
      return null;
    } catch (error) {
      console.error(`❌ Error al buscar etiqueta "${labelName}":`, error);
      return null;
    }
  }

  /**
   * Asignar etiqueta a un cliente después de crearlo
   */
  async assignLabelToClient(clientId: number, labelId: number): Promise<boolean> {
    try {
      // Intentar actualizar el cliente incluyendo la etiqueta con diferentes parámetros
      const url = `${this.baseUrl}/v1/client/update/${clientId}`;
      
      const body = new FormData();
      body.append('id_company', this.companyId.toString());
      body.append('wasi_token', this.wasiToken);
      
      // Intentar múltiples nombres de parámetro para la etiqueta
      body.append('id_label', labelId.toString());
      body.append('label_id', labelId.toString());
      body.append('tag', labelId.toString());
      body.append('tags[]', labelId.toString());

      console.log(`🏷️ Asignando etiqueta ${labelId} al cliente ${clientId}`);

      const response = await fetch(url, {
        method: 'POST',
        body: body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`⚠️ Error HTTP al asignar etiqueta: ${response.status} - ${errorText}`);
        
        // Intentar método alternativo con JSON
        return await this.assignLabelToClientJSON(clientId, labelId);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        console.log('✅ Etiqueta asignada exitosamente al cliente');
        return true;
      } else {
        console.warn('⚠️ No se pudo asignar la etiqueta con FormData, intentando JSON:', result);
        return await this.assignLabelToClientJSON(clientId, labelId);
      }
    } catch (error) {
      console.error('❌ Error al asignar etiqueta al cliente:', error);
      return await this.assignLabelToClientJSON(clientId, labelId);
    }
  }

  /**
   * Método alternativo para asignar etiqueta usando JSON
   */
  private async assignLabelToClientJSON(clientId: number, labelId: number): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/v1/client/update/${clientId}`;
      
      const requestData = {
        id_company: this.companyId,
        wasi_token: this.wasiToken,
        id_label: labelId,
        label_id: labelId,
        tag: labelId,
        tags: [labelId]
      };

      console.log(`🏷️ Intentando asignar etiqueta ${labelId} al cliente ${clientId} con JSON`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`⚠️ Error HTTP JSON al asignar etiqueta: ${response.status} - ${errorText}`);
        return false;
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        console.log('✅ Etiqueta asignada exitosamente al cliente (JSON)');
        return true;
      } else {
        console.warn('⚠️ No se pudo asignar la etiqueta con JSON:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error al asignar etiqueta al cliente (JSON):', error);
      return false;
    }
  }

  /**
   * Crear etiqueta de cliente si no existe
   */
  async createClientLabel(name: string, color: string): Promise<number | null> {
    try {
      // Intentar crear la etiqueta como etiqueta de propiedad (que luego se puede usar para clientes)
      const labelData: WasiCreateLabelData = {
        name: name,
        color: color
      };

      console.log(`🏷️ Creando etiqueta "${name}" con color ${color}...`);
      const result = await this.createLabel(labelData);
      console.log(`✅ Etiqueta "${name}" creada con ID:`, result.id_label);
      return result.id_label;
    } catch (error) {
      console.error(`❌ Error al crear etiqueta "${name}":`, error);
      return null;
    }
  }

  /**
   * Buscar y obtener ID de etiqueta "Anfitrión" (crear si no existe)
   */
  async getHostLabelId(): Promise<number | null> {
    let labelId = await this.findLabelByName('Anfitrión');
    
    if (!labelId) {
      console.log('🏷️ Etiqueta "Anfitrión" no encontrada, creándola...');
      labelId = await this.createClientLabel('Anfitrión', '#10B981'); // Verde
    }
    
    return labelId;
  }

  /**
   * Buscar y obtener ID de etiqueta "Cliente" (crear si no existe)
   */
  async getClientLabelId(): Promise<number | null> {
    let labelId = await this.findLabelByName('Cliente');
    
    if (!labelId) {
      console.log('🏷️ Etiqueta "Cliente" no encontrada, creándola...');
      labelId = await this.createClientLabel('Cliente', '#3B82F6'); // Azul
    }
    
    return labelId;
  }

  /**
   * Convierte los datos del formulario de Hospelia al formato de Wasi
   */
  async processFormData(formData: any, originName: string = 'Portal Inmobiliario'): Promise<WasiClientData> {
    const id_client_origin = await this.findClientOriginByName(originName);
    
    // Separar nombre completo en first_name y last_name
    const fullName = formData.nombres || formData.nombre || formData.name || '';
    const nameParts = fullName.trim().split(' ');
    const first_name = nameParts[0] || 'Sin nombre';
    const last_name = nameParts.slice(1).join(' ') || '';
    
    // Construir comentarios con la información del formulario
    const comments = [];
    
    if (formData.ubicacion || formData.location) {
      comments.push(`Ubicación preferida: ${formData.ubicacion || formData.location}`);
    }
    
    if (formData.tipoAlojamiento || formData.accommodation_type) {
      comments.push(`Tipo de alojamiento: ${formData.tipoAlojamiento || formData.accommodation_type}`);
    }
    
    if (formData.habitaciones) {
      comments.push(`Habitaciones: ${formData.habitaciones}`);
    }
    
    if (formData.presupuesto) {
      comments.push(`Presupuesto: ${formData.presupuesto}`);
    }
    
    if (formData.fechas) {
      comments.push(`Fechas requeridas: ${formData.fechas}`);
    }

    if (formData.mensaje || formData.message) {
      comments.push(`Mensaje: ${formData.mensaje || formData.message}`);
    }

    comments.push(`Fuente: Formulario web Hospelia`);
    comments.push(`Fecha de captura: ${new Date().toLocaleString('es-CO')}`);

    const processedData = {
      id_company: this.companyId,
      wasi_token: this.wasiToken,
      id_user: this.defaultUserId,
      first_name: first_name,
      last_name: last_name,
      email: formData.email,
      cell_phone: formData.telefono_completo || formData.telefono || formData.phone || '0000000000',
      id_client_origin,
      id_country: this.colombiaCountryId, // Colombia = 1
      id_region: this.valleDelCaucaRegionId, // Valle del Cauca = 32
      id_city: this.caliCityId, // Cali = 132
      comment: comments.join('\n'),
      phone: formData.telefono || formData.phone,
      address: formData.ubicacion || formData.location || '',
      query: `Interesado en ${formData.tipoAlojamiento || 'alojamiento'} - ${formData.habitaciones || ''} - ${formData.presupuesto || ''}`,
      reference: 'Web Hospelia',
      send_information: true
    };

    return processedData;
  }

  /**
   * Obtiene una propiedad específica por ID
   */
  async getPropertyById(propertyId: number): Promise<WasiProperty | null> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/property/get/${propertyId}?id_company=${this.companyId}&wasi_token=${this.wasiToken}`);
      if (!response.ok) {
        console.error(`Error fetching property ${propertyId}: ${response.statusText}`);
        return null;
      }
      const data = await response.json();
      if (data.status === 'success') {
        return data as WasiProperty;
      }
      return null;
    } catch (error) {
      console.error('Error in getPropertyById:', error);
      return null;
    }
  }

  /**
   * Busca una propiedad por slug o términos del título
   * El slug puede contener el ID al final (formato: titulo-de-propiedad-123)
   */
  async searchPropertyBySlug(slug: string): Promise<WasiProperty | null> {
    try {

      // Intentar extraer ID del slug (formato: titulo-123)
      const idMatch = slug.match(/-(\d+)$/);
      if (idMatch) {
        const propertyId = parseInt(idMatch[1]);
        
        // Buscar primero por ID exacto
        const propertyById = await this.getPropertyById(propertyId);
        if (propertyById) {
          return propertyById;
        }
      }

      // Si no se encuentra por ID, buscar por texto del slug
      const searchTerms = slug
        .replace(/-\d+$/, '') // Remover ID del final si existe
        .replace(/-/g, ' ') // Reemplazar guiones con espacios
        .trim();


      const response = await this.searchPropertiesByText(searchTerms, {
        scope: 3,
        take: 10
      });

      if (response.total > 0) {
        // Extraer propiedades del objeto de respuesta
        const propertyKeys = Object.keys(response).filter(key => !isNaN(parseInt(key)));
        
        // Si hay ID en el slug, buscar coincidencia exacta
        if (idMatch) {
          const targetId = parseInt(idMatch[1]);
          for (const key of propertyKeys) {
            const property = response[key] as WasiProperty;
            if (property.id_property === targetId) {
              return property;
            }
          }
        }

        // Si no hay ID o no se encuentra por ID, devolver la primera coincidencia
        if (propertyKeys.length > 0) {
          const property = response[propertyKeys[0]] as WasiProperty;
          return property;
        }
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
}

// Exportar instancia singleton
export const wasiService = new WasiService();
export type { 
  WasiClientData, 
  WasiClientResponse, 
  WasiClientOrigin,
  WasiProperty,
  WasiPropertiesResponse,
  WasiPropertySearchParams,
  WasiPropertyImage,
  WasiPropertyGallery,
  WasiPropertyFeatures,
  WasiLabel,
  WasiLabelResponse,
  WasiCreateLabelData
}; 
