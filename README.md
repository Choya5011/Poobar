A crappy responsive [Spider Monkey Panel](https://github.com/TheQwertiest/foo_spider_monkey_panel) based foobar2000 theme (CUI).  
This theme is supported in foobar2000 32-bit & 64-bit.

# Preview
![Preview](gallery/preview.png)  
Responds to window size & seamlessly snaps to win11 snap layouts. Manual resizing of the window however is a bit more taxing.  

# Modularity
* All panels can be used individually for other themes
* The main panel is the blueprint for the layout & controls panel placement within the main JSplitter
    * Can be used to easily make other themes responsive with some modding
    * Relies on (custom) panel title to place panels. These are accessible inside the CUI layout editor
    * Panels can be swapped out if the same title is kept or if the script is modified
    * Refer to [Useful to know](#useful-to-know) for further info on main panel
* Panels within the tab script are not hardcoded, they can be edited.

# Install
## Fonts
Standard on win11: [Segoe Fluent Icons](https://learn.microsoft.com/en-us/windows/apps/design/downloads/#fonts)  
Optional (For Biography): [Fontawesome](https://github.com/FortAwesome/Font-Awesome/blob/4.x/fonts/fontawesome-webfont.ttf)

## Components
[Columns UI](https://www.foobar2000.org/components/view/foo_ui_columns)  
[OpenLyrics](https://www.foobar2000.org/components/view/foo_openlyrics)  
[JSplitter](https://hydrogenaudio.org/index.php/topic,126743.msg1063721.html#msg1063721) (4.0.4)  

Optional:  
[Waveform minibar (mod)](https://www.foobar2000.org/components/view/foo_wave_minibar_mod)  
[Playback Statistics](https://www.foobar2000.org/components/view/foo_playcount) (alternatively foo_lastfm_playcount_sync)  
[Scrobble](https://www.foobar2000.org/components/view/foo_scrobble) (if last.fm sync is desired)

## Packages
[Biography](https://github.com/Wil-B/Biography)  

Optional:  
[Library Tree](https://github.com/Wil-B/Library-Tree)  
[Not-A-Waveform-Seekbar-SMP](https://github.com/regorxxx/Not-A-Waveform-Seekbar-SMP) (3.0.0)

# Installation Instructions
1.  Install required components if not yet installed: Preferences -> Components -> Install -> Restart
2.  Set display to CUI if not yet set: Preferences -> Display -> User Interface Module -> Columns UI -> restart=
3.  Place the "Poobar" folder in the samples directory. Typically located at:
    - Normal: C:\Users\[Username]\AppData\Roaming\foobar2000-v2\user-components-x64\foo_uie_jsplitter\samples
    - Portable: foobar2000\profile\user-components-x64\foo_uie_jsplitter\samples
6.  Import fcl layout: Preferences -> Columns UI -> Import configuration -> poobar_filter
    - _library if LibTree is desired else _filter  
    If waveform is desired:
    - _wmm contains Waveform minibar (mod)
    - _naws contains a JSplitter with NAWS-SMP  
   Note:
   - Waveform minibar (mod) Transparency: preferences -> tools -> Waveform Minibar (mod) -> Transparent background (requires Columns UI) 
   - NAWS-SMP can be more taxing than Waveform minibar (mod). Configure it to use the least resources.
   - It also seems incapable of analyzing tracks whose titles contain characters (JP,KR,CN) in Audiowaveform mode.
7. _library & _naws presets contain JSplitters that will throw an error if their respective packages aren't present:
   - Import required packages: right click problem JSplitter -> configure -> package -> package manager -> import -> select package zip file
   - Alternatively: preferences -> display -> columns UI -> layout -> select problem JSplitter -> configure panel -> package -> package manager -> import -> select package zip file

# Useful to know
## General
* Tabs support vertical & horizontal orientation.
* Playcount toggle in PL view: foo_playcount or lastfm_playcount. Both store a local DB.
* The font used for OpenLyrics in this theme is "UD Digi Kyokasho NP-R" size 12
    * To change font: Preferences -> Tools -> OpenLyrics -> Display -> check Custom font -> select font
* When using the like/heart buttons make sure both the fluent control panel (seekbar section) and the PL are set to the same mode.
* queue button instructions:
    * left click: add
    * right click: remove
    * middle click: clear
    * double click then right click (reason for combo is it's bugged/incomplete): add randomly (requires selecting multiple tracks)

## Main Panel
All panels are placed inside one main JSplitter with the MP script as panel placement script.  
This method can be taxing on the CPU when resizing the window. Win11 snap layouts make this less noticeable.  

The main panel currently has 4 panels it looks out for titled:
* 'Fluent Control Panel'
* '' (Playlist View: Segoe Fluent Icons MusicNote, unicode: ec4f)
* '' (Tab Stack: Segoe Fluent Icons MapLayers, unicode: e81e)
* 'Smooth Browser'

If the title of any of these are changed & the MP script isn't adjusted for it the MP can not fetch the panel.

# Issues
Memory usage spikes when playing tracks with high res (example: 3k) album art.  
This has been partially optimized by removing redundant panels in the latest update.  

Troubleshooting:
1. If there is a pop-up about the rating each time the Fluent Control Panel script is loaded: Right click the rating stars & set mode to foo_playcount. This will eliminate the popup.
2. If monitor resolution is changed while foobar is open restart to refresh.
3. If ever locked out of access to preferences button: ctrl + p

---
Credits to the original authors of any modified scripts. Names can be found in their respective scripts.
