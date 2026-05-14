import { useEffect, useRef } from 'preact/hooks';
import type { BucketListItem } from '../lib/bucketlist';
import { path } from '../lib/site';

interface Props {
  destinations: BucketListItem[];
}

export default function BucketListMap({ destinations }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Dynamically import Leaflet only on client
    import('leaflet').then((L) => {
      // Initialize map centered on Europe/North Africa
      map.current = L.default.map(mapContainer.current).setView([30, 5], 3);

      // Add OpenStreetMap tiles
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      // Status colors
      const colorMap = {
        visited: '#10b981',
        'in-progress': '#f59e0b',
        pending: '#9ca3af',
      };

      // Add markers for each destination
      destinations.forEach((dest) => {
        const color = colorMap[dest.status];

        // Create custom marker HTML
        const markerHtml = `
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          ">
            ${dest.status === 'visited' ? '✓' : dest.status === 'in-progress' ? '⟳' : '○'}
          </div>
        `;

        const customIcon = L.default.divIcon({
          html: markerHtml,
          iconSize: [32, 32],
          className: 'bucket-list-marker',
        });

        const marker = L.default.marker([dest.latitude, dest.longitude], {
          icon: customIcon,
        }).addTo(map.current);

        // Create popup content
        const popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600;">
              ${dest.title}
            </h3>
            <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #666;">
              <strong>${dest.region}</strong> • ${dest.countries.join(', ')}
            </p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">
              ${dest.description}
            </p>
            <a href="${path(`/bucketlist/${dest.slug}`)}" style="
              display: inline-block;
              margin-top: 0.75rem;
              padding: 0.5rem 1rem;
              background-color: ${color};
              color: white;
              text-decoration: none;
              border-radius: 0.25rem;
              font-size: 0.875rem;
              font-weight: 500;
            ">
              View Details →
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'bucket-list-popup',
        });

        // Show popup on hover for desktop
        marker.on('mouseover', function () {
          this.openPopup();
        });
        marker.on('mouseout', function () {
          this.closePopup();
        });
      });

      // Fit bounds to show all markers
      if (destinations.length > 0) {
        const group = new L.default.FeatureGroup(
          destinations.map(
            (d) => L.default.marker([d.latitude, d.longitude])
          )
        );
        map.current.fitBounds(group.getBounds().pad(0.1));
      }
    });

    return () => {
      // Cleanup on unmount
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [destinations]);

  return (
    <div>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '0.5rem',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem',
        }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
          <span style={{ fontSize: '0.875rem' }}>Visited</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#f59e0b',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
          <span style={{ fontSize: '0.875rem' }}>In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#9ca3af',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
          <span style={{ fontSize: '0.875rem' }}>Pending</span>
        </div>
      </div>
    </div>
  );
}
