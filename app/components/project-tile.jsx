"use client";

import { Badge } from "./ui/badge";
import posthog from "posthog-js";

const projects = [
  {
    name: "recall",
    description: "templated rag setup for all your data w/ embedding engine",
    pill: "beta",
    pillVariant: "tertiary",
    link: "https://github.com/jakesciotto/recall",
  },
  {
    name: "easton leaderboard",
    description: "kids bjj program leaderboard and dashboarding tool",
    pill: "live",
    pillVariant: "primary",
    link: "https://eastonpodium.com",
  },
  {
    name: "aidatasucks.com",
    description: "working with ai vendors made me mad so i did this",
    pill: "live",
    pillVariant: "primary",
    link: "https://aidatasucks.com",
  },
  {
    name: "easton+",
    description: "drag and drop jiu jitsu curriculum builder",
    pill: "beta",
    pillVariant: "tertiary",
    link: "https://eastonplus.com",
  },
  {
    name: "duels app",
    description: "kids jiu jitsu comp sidecar app",
    pill: "pre-release",
    pillVariant: "secondaryAccent",
    link: "https://github.com/jakesciotto/easton-duels",
  },
];

export default function ProjectTile() {
  const handleClick = (name) => {
    if (typeof posthog?.capture === "function") {
      posthog.capture("tile_click", { project: name });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-3">
        projects
      </h3>
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.name}>
            <div className="flex items-center justify-between gap-3">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(project.name)}
                  className="min-w-0 truncate text-sm font-semibold text-foreground hover:text-accent-primary transition-colors"
                >
                  {project.name}
                </a>
              ) : (
                <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                  {project.name}
                </span>
              )}
              <Badge
                variant={project.pillVariant}
                className="shrink-0 translate-y-[1px]"
              >
                {project.pill}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground font-medium">
              {project.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
