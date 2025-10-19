A shitty [Spider Monkey Panel](https://github.com/TheQwertiest/foo_spider_monkey_panel) based foobar2000 theme (CUI).  
This theme is supported in foobar2000 32-bit & 64-bit.  
Scripts can easily be used as individual panels.

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

Note: Not-A-Waveform-Seekbar-SMP can be heavier to run than Waveform minibar (mod)

# Installation Instructions
1.  Install required components if not yet installed: Preferences -> Components -> Install -> Restart
2.  Set display to CUI if not yet set: Preferences -> Display -> User Interface Module -> Columns UI -> restart
3.  Import required packages: place a Jsplitter in fb2k -> configure -> package -> package manager -> import -> select package zip file
4.  Place the files in their respective directories. "foobar2000-v2" is typically located at:
    - C:\Users\yourUserName\AppData\Roaming\foobar2000-v2\user-components-x64\foo_uie_jsplitter\samples
6.  Copy each file into their respective directory (samples subfolders):
    - samples\complete
    - samples\js-smooth
    - samples\poobar  
    - Alternatively store them elsewhere, this requires adjusting the scripts.
9.  Import layout: Preferences -> Columns UI -> Import configuration -> poobar_filter
    - _library if LibTree is desired
    - _wfmm if waveform minibar (mod) is desired
    Errors/issues pertaining step 6:
    - _library & _filter contain a jsplitter that will throw an error if Not-A-Waveform-Seekbar-SMP isn't present
    - remove this splitter if Not-A-Waveform-Seekbar-SMP is not desired. Splitter is located inside the Fluent Control Panel splitter
    - Not-A-Waveform-Seekbar-SMP & waveform minibar (mod) are swappable, as long as the panel is named "Waveform minibar (mod)"

# Useful to know
* Tabs have a horizontal & vertical mode
* Playcount toggle in PL view: foo_playcount or lastfm_playcount. Both store a local DB.
* The font used for OpenLyrics in this theme is "UD Digi Kyokasho NP-R" size 12
    * To change font: Preferences -> Tools -> OpenLyrics -> Display -> check Custom font -> select font
* When using the like/heart buttons make sure both the fluent control panel (seekbar section) and the PL are set to the same mode.
* queue button instructions:
    * left click: add
    * right click: remove
    * middle click: clear
    * double click then right click (reason for weird combo is it's bugged/incomplete): add randomly (requires selecting multiple tracks)

# Issues
1. If there is a pop-up about the rating each time the Fluent Control Panel script is loaded: Right click the rating stars & set mode to foo_playcount. This will eliminate the popup.
2. If ever locked out of access to preferences button: ctrl + p

---
Credits to the original authors of any modified scripts.
