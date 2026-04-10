import { ImageResponse } from 'next/og'
 
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: '#1C1C1C',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D4A017',
          borderRadius: '18%', // Standard apple icon rounding
          fontWeight: 900,
          fontFamily: 'sans-serif',
        }}
      >
        T.
      </div>
    ),
    {
      ...size,
    }
  )
}
