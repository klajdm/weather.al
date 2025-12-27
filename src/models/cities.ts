// Albania cities with coordinates for weather API
export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const albanianCities: City[] = [
  { id: '1', name: 'Tirana', latitude: 41.3275, longitude: 19.8187 },
  { id: '2', name: 'Durrës', latitude: 41.3236, longitude: 19.4564 },
  { id: '3', name: 'Vlorë', latitude: 40.4686, longitude: 19.4914 },
  { id: '4', name: 'Shkodër', latitude: 42.0683, longitude: 19.5125 },
  { id: '5', name: 'Elbasan', latitude: 41.1125, longitude: 20.0822 },
  { id: '6', name: 'Korçë', latitude: 40.6186, longitude: 20.7803 },
  { id: '7', name: 'Fier', latitude: 40.7239, longitude: 19.5564 },
  { id: '8', name: 'Berat', latitude: 40.7058, longitude: 19.9522 },
  { id: '9', name: 'Lushnjë', latitude: 40.9419, longitude: 19.7050 },
  { id: '10', name: 'Kavajë', latitude: 41.1850, longitude: 19.5569 },
  { id: '11', name: 'Pogradec', latitude: 40.9028, longitude: 20.6522 },
  { id: '12', name: 'Gjirokastër', latitude: 40.0761, longitude: 20.1375 },
  { id: '13', name: 'Sarandë', latitude: 39.8753, longitude: 20.0050 },
  { id: '14', name: 'Kukës', latitude: 42.0772, longitude: 20.4217 },
  { id: '15', name: 'Laç', latitude: 41.6353, longitude: 19.7136 },
];
