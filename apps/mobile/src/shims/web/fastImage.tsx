import React from 'react'
import { Image, ImageProps } from 'react-native'

interface FastImageProps extends Omit<ImageProps, 'source' | 'resizeMode'> {
  source: { uri?: string; headers?: Record<string, string>; priority?: string } | number
  resizeMode?: any
}

const FastImage: React.FC<FastImageProps> & {
  priority: Record<string, string>
  resizeMode: Record<string, string>
  preload: (sources: unknown[]) => void
} = ({ source, resizeMode, ...props }) => {
  const src = typeof source === 'object' && 'uri' in source && source.uri ? { uri: source.uri } : (source as number)
  return <Image source={src} resizeMode={(resizeMode as ImageProps['resizeMode']) ?? 'cover'} {...props} />
}
FastImage.priority = { low: 'low', normal: 'normal', high: 'high' }
FastImage.resizeMode = { contain: 'contain', cover: 'cover', stretch: 'stretch', center: 'center' }
FastImage.preload = () => {}

export default FastImage
