import { ImageResponse } from 'next/og'

export const alt = 'Troebel Brewing Co.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1C1C1C',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D4A017',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Troebel Brewing Co.
        </div>
        <div
          style={{
            fontSize: 48,
            color: '#FFFDF7', // Cream color from design system
            fontWeight: 400,
          }}
        >
          Hopmerkelijke Brouwsels
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
