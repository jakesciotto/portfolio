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
import StravaTile from './components/strava-tile'
import AboutTile from './components/about-tile'
import TodoistTile from './components/todoist-tile'
import TraktTile from './components/trakt-tile'

export default function Page() {
  return (
    <div className="py-8">
      <BentoGrid>
        <Tile accent="primary" gridClass="tile-hero" tilt>
          <HeroTile />
        </Tile>

        <Tile accent="secondary" gridClass="tile-github">
          <GitHubTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-experience">
          <ExperienceTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-work">
          <WorkAccordion />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-skills">
          <SkillTags />
        </Tile>

        <Tile accent="secondary" gridClass="tile-about">
          <AboutTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-oura">
          <OuraTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-wakatime">
          <WakaTimeTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-education">
          <EducationTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-certs">
          <CertStrip />
        </Tile>

        <Tile accent="secondary" gridClass="tile-spotify">
          <SpotifyTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-todoist">
          <TodoistTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-trakt">
          <TraktTile />
        </Tile>

        <Tile accent="secondary" gridClass="tile-projects">
          <ProjectTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-strava">
          <StravaTile />
        </Tile>
      </BentoGrid>
    </div>
  )
}
