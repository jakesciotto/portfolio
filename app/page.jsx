import BentoGrid from './components/bento-grid'
import Tile from './components/tile'
import HeroTile from './components/hero-tile'
import SkillTags from './components/skill-tags'
import WorkAccordion from './components/work-accordion'
import GitHubTile from './components/github-tile'
import ExperienceTile from './components/experience-tile'
import WakaTimeTile from './components/wakatime-tile'
import SpotifyTile from './components/spotify-tile'
import EducationTile from './components/education-tile'
import ProjectTile from './components/project-tile'
import StravaTile from './components/strava-tile'
import AboutTile from './components/about-tile'
import ObsidianRow from './components/obsidian-row'
import TraktTile from './components/trakt-tile'
import SpotifyRecentTile from './components/spotify-recent-tile'
import { loadTileData } from './lib/sources/tile-data'

export const revalidate = 300

export default async function Page() {
  const tiles = await loadTileData()

  return (
    <div className="py-8">
      <BentoGrid>
        <Tile accent="primary" gridClass="tile-hero" tilt>
          <HeroTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-github">
          <GitHubTile initial={tiles.github} />
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

        <ObsidianRow initial={tiles.obsidian} />

        <Tile accent="amber" gridClass="tile-trakt">
          <TraktTile />
        </Tile>

        <Tile accent="primary" gridClass="tile-wakatime">
          <WakaTimeTile initial={tiles.wakatime} />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-spotify-recent">
          <SpotifyRecentTile />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-spotify">
          <SpotifyTile initial={tiles.spotifyStats} />
        </Tile>

        <Tile accent="secondary" gridClass="tile-strava">
          <StravaTile initial={tiles.strava} />
        </Tile>

        <Tile accent="tertiary" gridClass="tile-projects">
          <ProjectTile />
        </Tile>
      </BentoGrid>
    </div>
  )
}
