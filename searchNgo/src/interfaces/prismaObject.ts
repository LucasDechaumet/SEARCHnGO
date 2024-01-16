interface Compagny {
  q_parameter: string;
  compagny_name: string;
  title: string;
  location: string;
  address: string | undefined;
  coords: { lat: number; lng: number } | undefined;
  met: boolean;
  important: boolean;
}
