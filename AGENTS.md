# portfolio: map for agents

Read `CLAUDE.md` for the rules and the design record, and `docs/design.md` for the rationale by component. The rules live in the coherence specs: `portfolio.spec.md` at the root and one `*.spec.md` in each component folder.

| Component | Folder | Spec |
| --- | --- | --- |
| jakesciotto.com | `.` | `portfolio.spec.md` |
| API routes | `app/api` | `app/api/api.spec.md` |
| Tiles and chart primitives | `app/components` | `app/components/components.spec.md` |
| View math | `app/lib` | `app/lib/lib.spec.md` |
| Spotify collector | `services/spotify-collector` | `services/spotify-collector/collector.spec.md` |

`npx --no -- coherence spec --check` lists every invariant with its state. `npx --no -- coherence query status` lists the structural defects and the open requirements.
