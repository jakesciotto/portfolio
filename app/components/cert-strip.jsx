'use client'

import Image from 'next/image'
import posthog from 'posthog-js'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip'

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
    <div>
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-3">
        certifications
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {certifications.map((cert) => (
          <Tooltip key={cert.name}>
            <TooltipTrigger asChild>
              <div className="shrink-0">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  width={48}
                  height={48}
                  className="object-contain rounded"
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
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">
          {certifications.length} certifications
        </span>
        <a
          href="https://www.credly.com/users/jake-sciotto"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCredlyClick}
          className="text-xs text-muted-foreground hover:text-accent-primary transition-colors"
        >
          verify on credly
        </a>
      </div>
    </div>
  )
}
