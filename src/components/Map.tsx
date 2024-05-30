import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ReactDOMServer from 'react-dom/server'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import MapPopup from './MapPopup'
import { TILE_LAYERS, DEFAULT_MAP_CENTER, USER_DEFAULT_LOCATION, USER_ICON, LOCATION_ICON } from '../constans'

enum LocationType {
  Store = 'store',
  Station = 'station',
}

interface LocationInfo extends L.LatLngLiteral {
  name: string
  type: LocationType
}

const locationTypeList: LocationType[] = [LocationType.Store, LocationType.Station]
const userLatLng: L.LatLngLiteral = USER_DEFAULT_LOCATION
const locationInfo: LocationInfo[] = [
  {
    name: '林百貨',
    lat: 22.9918,
    lng: 120.2025,
    type: LocationType.Store,
  },
  {
    name: '新天地',
    lat: 22.987,
    lng: 120.1982,
    type: LocationType.Store,
  },
  {
    name: '台南火車站',
    lat: 22.9972,
    lng: 120.2124,
    type: LocationType.Station,
  },
  {
    name: '台南高鐵站',
    lat: 22.9246,
    lng: 120.2856,
    type: LocationType.Station,
  },
]

class FlyToCenterButtonControl extends L.Control {
  options: L.ControlOptions = {
    position: 'topleft' as L.ControlPosition,
  }

  onAdd(map: L.Map) {
    const button = L.DomUtil.create('button', 'leaflet-control-button')
    button.innerHTML = 'Fly to Center'

    L.DomEvent.on(button, 'click', () => {
      map.flyTo(DEFAULT_MAP_CENTER, 18)
    })

    return button
  }
}

const Map = () => {
  const mapRef = useRef<L.Map>()
  const locationLayerRef = useRef<L.LayerGroup>()
  const userMarkerRef = useRef<L.Marker>()
  const [checked, setChecked] = useState<LocationType[]>([])

  useEffect(() => {
    // 建立地圖和圖資(OSM)
    mapRef.current = L.map('map', {
      center: DEFAULT_MAP_CENTER,
      zoom: 14,
      zoomControl: true,
      layers: [TILE_LAYERS.humanitarian],
      tap: false, // https://github.com/Leaflet/Leaflet/issues/3184
    })

    // 圖層加到地圖
    locationLayerRef.current = L.markerClusterGroup()
    locationLayerRef.current.addTo(mapRef.current)

    // user marker 加到地圖
    userMarkerRef.current = L.marker(userLatLng, { icon: USER_ICON })
    userMarkerRef.current.addTo(mapRef.current)

    // 選單
    L.control
      .layers(
        {
          example: TILE_LAYERS.example,
          humanitarian: TILE_LAYERS.humanitarian,
        },
        {
          userMarkerRef: userMarkerRef.current,
          locationLayerRef: locationLayerRef.current,
        }
      )
      .addTo(mapRef.current)

    // 自定義按鈕
    const centerButton = new FlyToCenterButtonControl()
    centerButton.addTo(mapRef.current)

    return () => {
      mapRef.current && mapRef.current.remove()
    }
  }, [])

  useEffect(() => {
    if (!locationLayerRef.current) return
    const matchs = locationInfo.filter(i => checked.includes(i.type))
    matchs.forEach(i => {
      L.marker([i.lat, i.lng], {
        icon: LOCATION_ICON,
      })
        .addTo(locationLayerRef.current as L.LayerGroup)
        .bindPopup(ReactDOMServer.renderToString(MapPopup({ name: i.name })))
        .on('click', e => {
          mapRef.current && mapRef.current.flyTo(e.latlng, 18)
        })
        .on('popupopen', e => {
          console.log('on popupopen', e)
        })
    })
    return () => {
      locationLayerRef.current && locationLayerRef.current.clearLayers()
    }
  }, [checked])

  const changeHandler = (type: LocationType) => {
    const isHasType = checked.includes(type)
    const copy = [...checked]
    if (isHasType) {
      const index = checked.findIndex(i => i === type)
      copy.splice(index, 1)
      setChecked([...copy])
      return
    }
    copy.push(type)
    setChecked([...copy])
  }

  return (
    <div style={{ width: '60vw', margin: '5vh auto 0' }}>
      {locationTypeList?.map(type => (
        <label key={type}>
          <input
            type="checkbox"
            id="type"
            checked={checked.includes(type)}
            onChange={() => {
              changeHandler(type)
            }}
          />
          {type}
        </label>
      ))}
      <div id="map" style={{ height: '70vh', width: '100%', margin: '5vh auto 0' }}></div>
    </div>
  )
}

export default Map
