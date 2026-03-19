import BentoGrid from './components/bento-grid'
import Tile from './components/tile'
import HeroTile from './components/hero-tile'
import SkillTags from './components/skill-tags'
import WorkAccordion from './components/work-accordion'
import GitHubTile from './components/github-tile'
import ExperienceTile from './components/experience-tile'
import OuraTile from './components/oura-tile'
import WakaTimeTile from './components/wakatime-tile'
import SpotifyTile from './components/spotify-tile'
import EducationTile from './components/education-tile'
import CertStrip from './components/cert-strip'
import ProjectTile from './components/project-tile'
import FunStatsTile from './components/fun-stats-tile'
import AboutTile from './components/about-tile'

export default function Page() {
  return (
    <div className="py-8">
      <BentoGrid>
        <Tile accent="primary" gridClass="tile-hero" tilt>
          <HeroTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-github">
          <GitHubTile />
        </Tile>

        <Tile accent="secondary" gridClass="tile-experience">
          <ExperienceTile />
        </Tile>

        <Tile accent="secondary" gridClass="tile-skills">
          <SkillTags />
        </Tile>

        <Tile accent="primary" gridClass="tile-work">
          <WorkAccordion />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-about">
          <AboutTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-oura">
          <OuraTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-wakatime">
          <WakaTimeTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-education">
          <EducationTile />
        </Tile>

        <Tile accent="secondary" gridClass="tile-certs">
          <CertStrip />
        </Tile>

        <Tile accent="secondary" gridClass="tile-spotify">
          <SpotifyTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-projects">
          <ProjectTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-funstats">
          <FunStatsTile />
        </Tile>
      </BentoGrid>
    </div>
  )
}
