import React from 'react';
import AddressLink from './AddressLink';

const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-slate-300">
    <span className="text-slate-400">{icon}</span>
    <span className="text-slate-100 font-medium">{value}</span>
    {label ? <span className="text-slate-400 text-sm">{label}</span> : null}
  </div>
);

const LocationCard = ({ place }) => {
  if (!place) return null;

  const address = place.address || place.location?.formattedAddress;
  const city = place.location?.city;
  const country = place.location?.country;
  const lat = Array.isArray(place.location?.coordinates) ? place.location.coordinates[1] : undefined;
  const lng = Array.isArray(place.location?.coordinates) ? place.location.coordinates[0] : undefined;
  const locationRating = place.ratings?.location;

  const mapsQuery = encodeURIComponent(address || `${city || ''} ${country || ''}`.trim());
  const mapsEmbed = mapsQuery
    ? `https://www.google.com/maps?q=${mapsQuery}&output=embed`
    : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Location</h3>

        {address ? (
          <AddressLink placeAddress={address} className="mb-3 text-slate-700" />
        ) : (
          <p className="text-slate-500 mb-3">Address not provided</p>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-4">
          {city || country ? (
            <Stat
              icon={(
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
                </svg>
              )}
              value={[city, country].filter(Boolean).join(', ')}
            />
          ) : null}

          {typeof locationRating === 'number' && locationRating > 0 ? (
            <Stat
              icon={(
                <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              )}
              value={locationRating.toFixed(1)}
              label="location"
            />
          ) : null}

          {typeof lat === 'number' && typeof lng === 'number' ? (
            <Stat
              icon={(
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 11l9-9 9 9-9 9-9-9z"/>
                </svg>
              )}
              value={`${lat.toFixed(4)}, ${lng.toFixed(4)}`}
              label="coords"
            />
          ) : null}
        </div>

        {mapsEmbed ? (
          <div className="w-full overflow-hidden rounded-xl border border-slate-200">
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                title="Location map"
                src={mapsEmbed}
                className="absolute left-0 top-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(address || '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Open in Google Maps
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z"/>
              <path d="M5 5h5V3H3v7h2V5z"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
