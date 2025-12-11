### Difference between OL & ESL presets
Memory usage of the theme increases when playing tracks with high-res album art (e.g., 3k).  
Following stats are at 1440p monitor res & numbers are higher than *completely* idle.

The OpenLyric presets are legacy or if OpenLyrics is preferred.

**ESLyric**  
The ESLyric presets use a slightly modified tab script.  
Lyric background is handled by the tab script & not by the component through pesudo transparency.

| AA Res | Mem (MB) |
|--------|----------|
| 600    | ~120     |
| 1200   | ~140     |
| 3000   | ~190     |
| 3600   | ~220     |

**OpenLyrics**  
The OpenLyrics presets generally consume more RAM if OpenLyric album art is enabled.

| AA Res | Mem (MB) | OpenLyrics AA |
|--------|----------|---------------|
| 600    | ~140     | yes           |
| 1200   | ~160     | yes           |
| 3000   | ~220     | yes           |
| 3600   | ~290     | no            |
| 3600   | ~340     | yes           |