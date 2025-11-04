A crappy responsive [Spider Monkey Panel](https://github.com/TheQwertiest/foo_spider_monkey_panel) based foobar2000 theme (CUI).  
This theme is supported in foobar2000 32-bit & 64-bit.

# Preview
![Preview](gallery/preview.png)  
Responds to window size & seamlessly snaps to Windows 11 snap layouts.

# Modularity
This repo aims to provide a basic customization guide for fb2k & component suggestions for achieving this.  

* All panel scripts can easily be used individually for other themes
* The main panel is the blueprint for the layout & controls panel placement within the main JSplitter
    * Can be used to easily make other themes responsive with some modding
    * Panels can be swapped out if the same title is kept or if the script is modified
    * Refer to [Useful to know](#useful-to-know) for further info on main panel
* Panels within the tab script/panel are not hardcoded, they can be edited.

# Components & Packages
**Fonts**
Standard already on Windows 11: [Segoe Fluent Icons](https://learn.microsoft.com/en-us/windows/apps/design/downloads/#fonts)  
Optional (For Biography): [Fontawesome](https://github.com/FortAwesome/Font-Awesome/blob/4.x/fonts/fontawesome-webfont.ttf)

**Components**
Required: [Columns UI](https://www.foobar2000.org/components/view/foo_ui_columns) | [Playback Statistics](https://www.foobar2000.org/components/view/foo_playcount) | [OpenLyrics](https://www.foobar2000.org/components/view/foo_openlyrics) alternatively [ESLyric](https://github.com/ESLyric/release) | 
[JSplitter](https://hydrogenaudio.org/index.php/topic,126743.msg1063721.html#msg1063721) (4.0.4)  

Optional: [Waveform minibar (mod)](https://www.foobar2000.org/components/view/foo_wave_minibar_mod) | [Scrobble](https://www.foobar2000.org/components/view/foo_scrobble) if last.fm sync is desired | foo_lastfm_playcount_sync

**Packages**
Required: [Biography](https://github.com/Wil-B/Biography)  

Optional: [Library Tree](https://github.com/Wil-B/Library-Tree) | [Not-A-Waveform-Seekbar-SMP](https://github.com/regorxxx/Not-A-Waveform-Seekbar-SMP) (3.0.0)

# Installation
**Instructions**
Skip to step 3 if required components are already installed.  

1.  Install required components if not yet installed: Preferences -> Components -> Install -> Restart  
2.  Set display to CUI if not yet set: Preferences -> Display -> User Interface Module -> Columns UI -> restart  
3.  Place the "Poobar" folder in the samples directory. Typically located at:
    - Normal: C:\Users\[Username]\AppData\Roaming\foobar2000-v2\user-components-x64\foo_uie_jsplitter\samples
    - Portable: foobar2000\profile\user-components-x64\foo_uie_jsplitter\samples  
4.  Import fcl layout: Preferences -> Columns UI -> Import configuration -> poobar_filter
    - _library if LibTree is desired else _filter
    - _wmm contains Waveform minibar (mod)
    - _naws contains a JSplitter with NAWS-SMP  

**Errors**
_library & _naws presets contain JSplitters that will throw an error if their respective packages aren't present:
   - Import required packages: right click problem JSplitter -> configure -> package -> package manager -> import -> select package zip file
   - Alternatively: preferences -> display -> columns UI -> layout -> select problem JSplitter -> configure panel -> package -> package manager -> import -> select package zip file  

**Waveform Notes**
   - Waveform minibar (mod) Transparency: preferences -> tools -> Waveform Minibar (mod) -> Transparent background (requires Columns UI) 
   - NAWS-SMP can be more taxing than Waveform minibar (mod). Configure it to use the least resources.
   - NAWS-SMP also seems incapable of analyzing tracks whose titles contain characters (JP,KR,CN) in Audiowaveform mode.

# Useful to know
## General
Memory usage spikes when playing tracks with high res (example: 3k) album art. This has been partially optimized by removing redundant panels in a previous update.  

**Customizing**
* Right click panels to see the context menu options for that panel. If panel has searchbar or scrollbar preferably right click there to get correct menu.
* Tabs support vertical & horizontal orientation.  

**Tracking stats**
* Playcount toggle in PL view: foo_playcount or lastfm_playcount. Both components store their own local DB.
* The foo_lastfm_playcount_sync compnent includes the option of syncing likes to last.fm.
* When using the like/heart buttons make sure both the control panel (seekbar section) and the PL are set to the same mode. 
* foo_scrobble is a component that syncs playcount/scrobbles to last.fm.  

**Queue button instructions:**
    * left click: add
    * right click: remove
    * middle click: clear
    * double click then right click (reason for combo is it's bugged/incomplete): add randomly (requires selecting multiple tracks)  

**Lyric Components:**
* OpenLyrics: more plug & play, included in fcl presets
* ESLyric: extremely customizable, not included in fcl presets
* The font used for Lyrics in this theme is "UD Digi Kyokasho NP-R". To change font:
    * OpenLyrics: Preferences -> Tools -> OpenLyrics -> Display -> check Custom font -> select font
    * ESLyric: Richt Click -> Panel Options... -> Font & Color  

**Troubleshooting:**
1. If there is a pop-up about the rating each time the Fluent Control Panel script is loaded: Right click the rating stars & set mode to foo_playcount or another mode of choice. This will eliminate the popup.
2. If monitor resolution is changed while foobar is open restart to refresh.
3. If ever locked out of access to preferences button: ctrl + p

## Main Panel
All panels are placed inside one main JSplitter with the MP script as panel placement script.  
This method can be a bit taxing on the CPU when resizing the window. Windows 11 snap layouts make this less noticeable.  

Relies on (custom) panel title to place panels. These are accessible inside the CUI layout editor.  
The main panel currently has 4 panels it looks out for titled:
* 'Fluent Control Panel'
* '' (Playlist View: Segoe Fluent Icons MusicNote, unicode: ec4f)
* '' (Tab Stack: Segoe Fluent Icons MapLayers, unicode: e81e)
* 'Smooth Browser'

If the title of any of these are changed & the MP script isn't adjusted for it the MP can not fetch the panel.

---
Credits to the original authors of any modified scripts. Names can be found in their respective scripts.
