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
import ProjectTile from './components/project-tile'
import StravaTile from './components/strava-tile'
import AboutTile from './components/about-tile'
import ObsidianRow from './components/obsidian-row'
import TraktTile from './components/trakt-tile'

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

        <Tile accent="primary" gridClass="tile-work">
          <WorkAccordion />
        </Tile>

        <Tile accent="primary" gridClass="tile-skills">
          <SkillTags />
        </Tile>

        <Tile accent="violet" gridClass="tile-about">
          <AboutTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-education">
          <EducationTile />
        </Tile>

        <ObsidianRow />

        <Tile accent="amber" gridClass="tile-trakt">
          <TraktTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-wakatime">
          <WakaTimeTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-spotify">
          <SpotifyTile />
        </Tile>

        <Tile accent="secondary" gridClass="tile-strava">
          <StravaTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-projects">
          <ProjectTile />
        </Tile>

        <Tile accent="violet" gridClass="tile-oura">
          <OuraTile />
        </Tile>
      </BentoGrid>
    </div>
  )
}
