import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  ArrowLeft,
  LocateFixed,
  BedDouble,
  Bath,
  Square,
} from 'lucide-react';

import BottomNav from '../components/BottomNav';
import type { Property, Amenity, AmenityType } from '../types/index';
import './InteractiveMapScreen.scss';

interface InteractiveMapScreenProps {
  centerProperty: Property;
  nearbyProperties: Property[];
  amenities: Amenity[];
  onBack: () => void;
  onViewDetails: (propertyId: string) => void;
}

type FilterTab = 'all' | AmenityType;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'school', label: 'Schools' },
  { id: 'hospital', label: 'Hospitals' },
  { id: 'market', label: 'Markets' },
  { id: 'filling_station', label: 'Fuel Stations' },
];

function priceMarkerIcon(price: number) {
  const label =
    price >= 1_000_000
      ? `₦${(price / 1_000_000).toFixed(1)}M`
      : `₦${Math.round(price / 1000)}k`;

  return L.divIcon({
    className: 'price-pin',
    html: `<div class="price-pin__inner">${label}</div>`,
    iconSize: [0, 0],
  });
}

function LocateButton({
  setUserLocation,
}: {
  setUserLocation: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
}) {
  const map = useMap();

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];

        setUserLocation(coords);
        map.flyTo(coords, 15);
      },
      (err) => {
        console.error('Location error:', err);
        alert('Unable to get your location');
      }
    );
  };

  return (
    <button className="map-screen__locate-btn" onClick={handleLocate}>
      <LocateFixed size={20} />
    </button>
  );
}

function BackToPropertyButton({
  lat, lng
}: { lat: number; lng: number }) {
  const map = useMap();

  const handleClick = () => {
    map.flyTo([lat, lng], 15)
  }
  return (
    <button
      className="map-screen__back-to-property"
      onClick={handleClick}
    >
      <ArrowLeft size={18} />
      Property
    </button>
  );
}


export function InteractiveMapScreen({
  centerProperty,
  nearbyProperties,
  amenities,
  onBack,
  onViewDetails,
}: InteractiveMapScreenProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const [userLocation, setUserLocation] = useState<
    [number, number] | null
  >(null);
  const navigate = useNavigate();

  const visibleAmenities = useMemo(
    () =>
      activeFilter === 'all'
        ? amenities
        : amenities.filter((a) => a.type === activeFilter),
    [activeFilter, amenities]
  );

  return (
    <div className="map-screen">

      <header className="map-screen__header">
        <button
          className="map-screen__icon-btn"
          onClick={onBack}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="map-screen__title">Nearby & Map</h1>
      </header>


      <div className="map-screen__filters">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`filter-chip ${activeFilter === tab.id ? 'filter-chip--active' : ''
              }`}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>


      <div className="map-screen__map">
        <MapContainer
          center={[centerProperty.lat, centerProperty.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <BackToPropertyButton
            lat={centerProperty.lat}
            lng={centerProperty.lng}
          />


          <Circle
            center={[centerProperty.lat, centerProperty.lng]}
            radius={350}
            pathOptions={{
              color: '#3D35D1',
              fillColor: '#3D35D1',
              fillOpacity: 0.08,
              weight: 1,
            }}
          />


          <Marker
            position={[centerProperty.lat, centerProperty.lng]}
            icon={priceMarkerIcon(centerProperty.price)}
          >
            <Popup>{centerProperty.listingTitle}</Popup>
          </Marker>


          {nearbyProperties.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={priceMarkerIcon(p.price)}
            >
              <Popup>{p.listingTitle}</Popup>
            </Marker>
          ))}


          {visibleAmenities.map((a) => (
            <Marker key={a.id} position={[a.lat, a.lng]}>
              <Popup>{a.name}</Popup>
            </Marker>
          ))}


          {userLocation && (
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}


          <LocateButton setUserLocation={setUserLocation} />
        </MapContainer>
      </div>


      <div className="property-sheet">
        <img
          src={centerProperty.coverImageUrl}
          alt={centerProperty.listingTitle}
          className="property-sheet__image"
        />

        <div className="property-sheet__body">
          <span className="property-sheet__badge">Verified</span>

          <p className="property-sheet__title">
            {centerProperty.listingTitle}
          </p>

          <p className="property-sheet__location">
            {centerProperty.neighborhood}
          </p>

          <div className="property-sheet__specs">
            <span>
              <BedDouble size={14} /> {centerProperty.bedrooms} Beds
            </span>
            <span>
              <Bath size={14} /> {centerProperty.bathrooms} Baths
            </span>
            {centerProperty.areaSqm && (
              <span>
                <Square size={14} /> {centerProperty.areaSqm} sqm
              </span>
            )}
          </div>

          <p className="property-sheet__price">
            ₦{centerProperty.price.toLocaleString('en-NG')}
            <span> / {centerProperty.pricePeriod}</span>
          </p>

          <button
            className="property-sheet__cta"
            onClick={() => onViewDetails(centerProperty.id)}
          >
            View Details
          </button>
        </div>
      </div>

      <BottomNav active="map" onChange={(tab) => navigate(`/${tab}`)}
      />
    </div>
  );
}