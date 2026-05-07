interface PixelArcLogoProps {
  size?: 'sm' | 'md';
  dark?: boolean;
}

export default function PixelArcLogo({ size = 'md', dark = false }: PixelArcLogoProps) {
  const iconSize = size === 'sm' ? 28 : 32;
  const fontSize = size === 'sm' ? 18 : 24;

  return (
    <div className="flex items-center gap-2">
      <svg width={iconSize} height={iconSize} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 4C9.373 4 4 9.373 4 16"
          stroke={dark ? '#F7F8FA' : '#111318'}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M16 4C22.627 4 28 9.373 28 16"
          stroke="#E8321C"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="14" y="2" width="4" height="4" rx="1" fill="#E8321C" />
        <rect x="6" y="12" width="3" height="3" rx="0.5" fill={dark ? '#F7F8FA' : '#111318'} />
        <rect x="23" y="12" width="3" height="3" rx="0.5" fill="#E8321C" />
        <rect x="10" y="22" width="2.5" height="2.5" rx="0.5" fill={dark ? '#F7F8FA' : '#111318'} />
        <rect x="19.5" y="22" width="2.5" height="2.5" rx="0.5" fill="#E8321C" />
        <rect x="15" y="26" width="2" height="2" rx="0.5" fill="#E8321C" />
      </svg>
      <span
        className="font-extrabold tracking-tight"
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: `${fontSize}px`,
          color: dark ? '#F7F8FA' : '#111318',
        }}
      >
        Tech<span style={{ color: '#E8321C' }}>Nest</span>
      </span>
    </div>
  );
}
