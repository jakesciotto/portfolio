'use client'

import Image from 'next/image'
import posthog from 'posthog-js'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const certifications = [
  { name: 'FinOps Certified: FinOps for AI', image: '/img/image7.png' },
  { name: 'FinOps for AI Trained: Level 3', image: '/img/image8.png' },
  { name: 'FinOps for AI Trained: Level 2', image: '/img/image1.png' },
  { name: 'FinOps Certified FOCUS Analyst', image: '/img/image2.png' },
  { name: 'FinOps for AI Trained: Level 1', image: '/img/image3.png' },
  { name: 'FinOps Certified Engineer', image: '/img/image4.png' },
  { name: 'FinOps Certified Practitioner', image: '/img/image5.png' },
  { name: 'AWS Certified Cloud Practitioner', image: '/img/image6.png' },
]

export default function CertStrip() {
  const handleCredlyClick = () => {
    if (typeof posthog?.capture === 'function') {
      posthog.capture('cert_badge_click')
    }
  }

  return (
    <div className="border-t border-border mt-auto pt-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {certifications.map((cert) => (
          <Tooltip key={cert.name}>
            <TooltipTrigger asChild>
              <div className="w-[30px] h-[28px] flex items-center justify-center">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  width={30}
                  height={28}
                  className="object-contain rounded max-w-full max-h-full"
                  unoptimized
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{cert.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <a
        href="https://www.credly.com/users/jake-sciotto"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleCredlyClick}
        className="text-xs text-muted-foreground font-medium hover:text-accent-primary transition-colors shrink-0"
      >
        credly
      </a>
    </div>
  )
}
