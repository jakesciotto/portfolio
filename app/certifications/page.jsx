import Image from 'next/image'
import AnimatedSection from '../components/animated-section'
import SectionTitle from '../components/section-title'
import { Card } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'

export const metadata = {
  title: 'certifications',
  description: 'professional certifications',
}

const accentCycle = ['primary', 'secondary', 'tertiary']

const certifications = [
  {
    name: 'FinOps Certified: FinOps for AI',
    issuer: 'FinOps Foundation',
    earned: 'Feb 2026',
    expires: null,
    image: '/img/image7.png',
    credly: 'https://www.credly.com/users/jake-sciotto',
  },
  {
    name: 'FinOps for AI Trained: Level 3',
    issuer: 'FinOps Foundation',
    earned: 'Feb 2026',
    expires: null,
    image: '/img/image8.png',
    credly: 'https://www.credly.com/users/jake-sciotto',
  },
  {
    name: 'FinOps for AI Trained: Level 2',
    issuer: 'FinOps Foundation',
    earned: 'Dec 2025',
    expires: null,
    image: '/img/image1.png',
    credly: 'https://www.credly.com/users/jake-sciotto',
  },
  {
    name: 'FinOps Certified FOCUS Analyst',
    issuer: 'FinOps Foundation',
    earned: 'Oct 2025',
    expires: 'Oct 2027',
    image: '/img/image2.png',
    credly: 'https://www.credly.com/users/jake-sciotto',
  },
  {
    name: 'FinOps for AI Trained: Level 1',
    issuer: 'FinOps Foundation',
    earned: 'Oct 2025',
    expires: null,
    image: '/img/image3.png',
    credly: 'https://www.credly.com/users/jake-sciotto',
  },
  {
    name: 'FinOps Certified Engineer',
    issuer: 'FinOps Foundation',
    earned: 'Dec 2024',
    expires: 'Dec 2026',
    image: '/img/image4.png',
    credly: 'https://www.credly.com/users/jake-sciotto',
  },
  {
    name: 'FinOps Certified Practitioner',
    issuer: 'FinOps Foundation',
    earned: 'Dec 2024',
    expires: null,
    image: '/img/image5.png',
    credly: 'https://www.credly.com/users/jake-sciotto',
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    earned: '2025',
    expires: null,
    image: '/img/image6.png',
    credly: 'https://www.credly.com/users/jake-sciotto',
  },
]

export default function CertificationsPage() {
  return (
    <div className="mt-12 max-w-5xl px-4">
      <SectionTitle text="certs" />
      <div className="relative z-10 mb-8">
        <p className="text-sm text-muted-foreground">if you even care</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {certifications.map((cert, index) => (
          <AnimatedSection key={cert.name} delay={100 + index * 80}>
            <a
              href={cert.credly}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card
                accent={accentCycle[index % 3]}
                className="h-full flex flex-col items-start text-left"
              >
                <Image
                  src={cert.image}
                  alt={cert.name}
                  width={96}
                  height={96}
                  className="object-contain mb-4"
                  unoptimized
                />
                <h3 className="text-sm font-semibold text-card-foreground mb-1">
                  {cert.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {cert.issuer}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Badge variant="primary">earned {cert.earned}</Badge>
                  {cert.expires && (
                    <Badge variant="outline">expires {cert.expires}</Badge>
                  )}
                </div>
              </Card>
            </a>
          </AnimatedSection>
        ))}
      </div>

      <div className="mt-12 mb-8 text-center">
        <a
          href="https://www.credly.com/users/jake-sciotto"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-accent-primary transition-colors"
        >
          verify on credly &rarr;
        </a>
      </div>
    </div>
  )
}
