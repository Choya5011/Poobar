### Contents
1. [Difference between OL & ESL presets](#difference-between-ol--esl-presets)
2. [Preset naming convention](#preset-naming-convention-)
3. [Strip](#strip)

After setup the theme is typically set to the ESLyric ```poobar_lib_naws.fcl``` preset.  
```_lib``` presets typically consume more RAM, if 'as light as possible' is desired swap to a ```_fil``` preset.  
This can be done by importing another fcl layout:
Preferences -> Columns UI -> Main -> Import configuration -> poobar_fil_naws.

### Difference between OL & ESL presets
The OpenLyric presets are legacy or if OpenLyrics is preferred.

Memory usage of the theme increases when playing tracks with high-res album art (e.g., 3k).  
Following stats are at 1440p monitor res & numbers are higher than *completely* idle.

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

### Preset naming convention  
```_lib```: genre browsing tab will be set to the library tree JSplitter package  
```_fil```: genre browsing tab will be set to the default foobar Filter panel, generally lighter  
```_naws```: Fluent Control Panel waveform will be set to Not-A-Waveform-Seekbar-SMP  
```_wmm```: Fluent Control Panel waveform will be set to Waveform minibar (mod)

### Strip
To fully strip the theme from optional features simply delete the associated tabs from the tabstack.  
These tabs are:
- **Tab 3:** Library Tree (if ```_lib```)
- **Tab 5:** Lyrics
- **Tab 6:** Biography  

See theme structure [wiki](https://github.com/Choya5011/Poobar/wiki/Poobar#theme-structure) page for an image which points out the tabstacks location in the CUI layout editor.  

The ```lightweight``` OpenLyrics preset is an example of a stripped setup, 4 tabs instead of 6.  
The ESlyric presets don't have a ```lightweight``` option since these are already more lightweight in nature.