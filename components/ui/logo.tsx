import Image from 'next/image'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="OnlyWorks"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
