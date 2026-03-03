"use client";

import Image from "next/image";
import posthog from "posthog-js";
import AnimatedSection from "../components/animated-section";
import { GlassCard } from "@/app/components/ui/glass-card";
import { Badge } from "@/app/components/ui/badge";

const certifications = [
  {
    name: "FinOps Certified: FinOps for AI",
    issuer: "FinOps Foundation",
    earned: "Feb 2026",
    expires: null,
    image: "/img/image7.png",
    credly: "https://www.credly.com/users/jake-sciotto",
    glowColor: "magenta",
  },
  {
    name: "FinOps for AI Trained: Level 3",
    issuer: "FinOps Foundation",
    earned: "Feb 2026",
    expires: null,
    image: "/img/image8.png",
    credly: "https://www.credly.com/users/jake-sciotto",
    glowColor: "cyan",
  },
  {
    name: "FinOps for AI Trained: Level 2",
    issuer: "FinOps Foundation",
    earned: "Dec 2025",
    expires: null,
    image: "/img/image1.png",
    credly: "https://www.credly.com/users/jake-sciotto",
    glowColor: "cyan",
  },
  {
    name: "FinOps Certified FOCUS Analyst",
    issuer: "FinOps Foundation",
    earned: "Oct 2025",
    expires: "Oct 2027",
    image: "/img/image2.png",
    credly: "https://www.credly.com/users/jake-sciotto",
    glowColor: "green",
  },
  {
    name: "FinOps for AI Trained: Level 1",
    issuer: "FinOps Foundation",
    earned: "Oct 2025",
    expires: null,
    image: "/img/image3.png",
    credly: "https://www.credly.com/users/jake-sciotto",
    glowColor: "amber",
  },
  {
    name: "FinOps Certified Engineer",
    issuer: "FinOps Foundation",
    earned: "Dec 2024",
    expires: "Dec 2026",
    image: "/img/image4.png",
    credly: "https://www.credly.com/users/jake-sciotto",
    glowColor: "green",
  },
  {
    name: "FinOps Certified Practitioner",
    issuer: "FinOps Foundation",
    earned: "Dec 2024",
    expires: null,
    image: "/img/image5.png",
    credly: "https://www.credly.com/users/jake-sciotto",
    glowColor: "purple",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    earned: "2025",
    expires: null,
    image: "/img/image6.png",
    credly: "https://www.credly.com/users/jake-sciotto",
    glowColor: "amber",
  },
];

export default function CertificationsList() {
  const handleCertClick = (cert) => {
    posthog.capture("certification_clicked", {
      cert_name: cert.name,
      cert_issuer: cert.issuer,
      cert_earned: cert.earned,
      url: cert.credly,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {certifications.map((cert, index) => (
          <AnimatedSection key={cert.name} delay={100 + index * 80}>
            <a
              href={cert.credly}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
              onClick={() => handleCertClick(cert)}
            >
              <GlassCard
                glowColor={cert.glowColor}
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
                  <Badge variant="neonCyan">earned {cert.earned}</Badge>
                  {cert.expires && (
                    <Badge variant="outline">expires {cert.expires}</Badge>
                  )}
                </div>
              </GlassCard>
            </a>
          </AnimatedSection>
        ))}
      </div>

      <div className="mt-12 mb-8 text-center">
        <a
          href="https://www.credly.com/users/jake-sciotto"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors"
          onClick={() =>
            posthog.capture("certification_clicked", {
              cert_name: "verify_all",
              cert_issuer: "Credly",
              url: "https://www.credly.com/users/jake-sciotto",
            })
          }
        >
          verify on credly &rarr;
        </a>
      </div>
    </>
  );
}
