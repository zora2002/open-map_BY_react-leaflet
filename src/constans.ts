import L from 'leaflet'
import userIcon from './assets/user.png'
import locationIcon from './assets/location.png'

export const TILE_LAYERS = {
  example: L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png?bar',
    {
      noWrap: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ),
  humanitarian: L.tileLayer(
    'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    {
      noWrap: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }
  ),
}

export const DEFAULT_MAP_CENTER: L.LatLngLiteral = {
  lat: 22.9926,
  lng: 120.2050,
}
export const USER_DEFAULT_LOCATION: L.LatLngLiteral = { ...DEFAULT_MAP_CENTER }

export const USER_ICON = new L.Icon({
  iconUrl: userIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [1, -34],
})

export const LOCATION_ICON = new L.Icon({
  iconUrl: locationIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [1, -34],
})
