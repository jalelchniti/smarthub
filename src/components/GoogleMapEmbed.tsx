
interface GoogleMapEmbedProps {
  mapSrc: string;
  title: string;
  mapHeight: string;
  ariaLabel: string;
}

const GoogleMapEmbed = ({
  mapSrc,
  title,
  mapHeight,
  ariaLabel
}: GoogleMapEmbedProps) => {
  return (
    <div className="w-full">
      <iframe
        src={mapSrc}
        width="100%"
        height={mapHeight}
        style={{ border: 0, borderRadius: '1rem' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        aria-label={ariaLabel}
        className="shadow-lg"
      />
    </div>
  );
};

export default GoogleMapEmbed;