import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="OnlyWorks"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
