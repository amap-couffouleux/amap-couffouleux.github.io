import 'leaflet/dist/leaflet.css';

import { MapContainer as LeafletMap, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { type LatLngExpression } from 'leaflet';

import { css } from 'styled-system/css';

const coords = [43.82037, 1.72863] satisfies LatLngExpression;
const zoom = 18;

export function MapContainer() {
  return (
    <LeafletMap
      attributionControl={false}
      center={coords}
      zoom={zoom}
      scrollWheelZoom={false}
      className={css({ height: '400px' })}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={coords}>
        <Tooltip permanent>
          Distributions AMAP Couffouleux
          <br />
          Chemin du Port-Haut
        </Tooltip>
      </Marker>
    </LeafletMap>
  );
}
