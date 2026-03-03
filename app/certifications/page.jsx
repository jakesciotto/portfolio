import CertificationsList from "./certifications-list";

export const metadata = {
  title: "certifications",
  description: "professional certifications",
};

export default function CertificationsPage() {
  return (
    <div className="mt-12 max-w-5xl px-4">
      <h1 className="font-semibold text-6xl mb-4 tracking-tighter gradient-text">
        certifications
      </h1>
      <p className="text-sm text-muted-foreground mb-8">if you even care</p>
      <CertificationsList />
    </div>
  );
}
