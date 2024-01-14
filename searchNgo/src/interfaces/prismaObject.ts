interface Compagny {
  q_parameter: string;
  compagny_name: string;
  title: string;
  location: string;
  address: string;
  coords: { lat: number; lng: number };
  met: boolean;
  important: boolean;
}
