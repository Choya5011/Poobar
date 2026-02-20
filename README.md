A crappy responsive [JSplitter](https://hydrogenaudio.org/index.php/topic,126743.0.html) based 64-bit CUI foobar2000 theme.

## Contents
1. [Preview](#preview)
2. [Modularity](#modularity)
3. [Components & Packages](#components--packages)
4. [Installation](#installation)
5. [Gallery](#gallery)

## Preview
![Preview](gallery/preview.png)  
![Preview_2](gallery/preview_2.png)  
Responds to window size & seamlessly snaps to Windows 11 snap layouts.  
[Gallery](#gallery)

## Modularity
This repository provides a basic JSplitter/SMP customization guide for foobar2000, as well as a showcase of JSplitter’s capabilities. It includes some basic scripts and component recommendations to help achieve these customizations.

* All panel scripts can easily be used individually for other themes
* The main panel script is the blueprint for the layout & controls panel placement within the main JSplitter
    * Can be used to easily make other themes responsive with some modding
    * Panels can be swapped out if the same title is kept or if the script is modified
    * It currently comes with two pre-configured transforming layouts as can be seen in the preview.
* Panels within the tab panel are not hardcoded, they can easily be edited.

Refer to the wiki's [script descriptions](https://github.com/Choya5011/Poobar/wiki/Poobar#script-descriptions) for further info

## Components & Packages
**Fonts**  
Standard already on Windows 11: [Segoe Fluent Icons](https://learn.microsoft.com/en-us/windows/apps/design/downloads/#fonts)  
Optional (For Biography): [Fontawesome](https://github.com/FortAwesome/Font-Awesome/blob/4.x/fonts/fontawesome-webfont.ttf)  
Optional (Lyrics): UD Digi Kyokasho (NP-B)

**Components**  
[Columns UI](https://www.foobar2000.org/components/view/foo_ui_columns) | [JSplitter](https://hydrogenaudio.org/index.php/topic,126743.msg1063721.html#msg1063721) (4.0.4) | [Playback Statistics](https://www.foobar2000.org/components/view/foo_playcount) | [Waveform minibar (mod)](https://www.foobar2000.org/components/view/foo_wave_minibar_mod) | [OpenLyrics](https://www.foobar2000.org/components/view/foo_openlyrics) alternatively [ESLyric](https://github.com/ESLyric/release)   

**Packages**  
[Biography](https://hydrogenaudio.org/index.php/topic,112914.msg1071222.html#msg1071222) | [Library Tree](https://github.com/regorxxx/Library-Tree-SMP) | [Not-A-Waveform-Seekbar-SMP](https://github.com/regorxxx/Not-A-Waveform-Seekbar-SMP)

## Installation
**Fonts**  
Install fonts if not yet on system. Segoe Fluent Icons is already on Windows 11 by default.

**Portable Instructions**  
1. Install Foobar as portable (clean install)
2. Download Poobar from the [main branch](https://github.com/Choya5011/Poobar/archive/refs/heads/main.zip)
3. Extract the 'profile' folder from the zip into Foobar's root folder.
2. Start Foobar & pick 'Columns UI' if prompted.

**Standard non-portable Instructions**
1. Install Foobar as a standard installation.
2. Download Poobar from the [main branch](https://github.com/Choya5011/Poobar/archive/refs/heads/main.zip)
3. Extract the contents of the 'profile' folder into Foobar's root folder. This is typically located at:
   - C:\Users\\[Username]\AppData\Roaming\foobar2000-v2
4. Start Foobar & pick 'Columns UI' if prompted.

**Notes**  
After setup the theme is also usually set to the Not-A-Waveform-Seekbar-SMP waveform seekbar (```_naws``` presets). If this is not desired:  
- To delete: Preferences -> Columns UI -> Layout -> Bottommost JSplitter -> Right-Click -> Remove Panel  
- To replace: Delete (previous instruct) -> JSplitter it was nested in -> Insert panel -> Panels -> Waveform minibar (mod)  

If deleted the Fluent Control Panel will show an error, simply switch the seekbar mode from waveform to normal.

**Useful To Know**  
Refer to the [wiki](https://github.com/Choya5011/Poobar/wiki/Poobar) for further info. Such as customization or for troubleshooting.

## Gallery
**Fluent Control Panel**  

![Control Panel: Seekbar](gallery/control_panel_sb.png)
![Control Panel: Waveform](gallery/control_panel_wf.png)
[wiki](https://github.com/Choya5011/Poobar/wiki/Poobar#fluent-control-panel)

**Tabs**

![Tabs: Vertical/Horizontal](gallery/tabs.png)
[wiki](https://github.com/Choya5011/Poobar/wiki/Poobar#poobar-tabs)

**Mini Player**  
If window gets small enough. Smallest state is Fluent Control Panel only.
![Mini player](gallery/mini_player.png)

## Credits
Credits to the original authors of any modified scripts. Names can be found in their respective scripts.

Themes in this repo are inspired by:
* Classic Poobar: [Eureka Theme](https://www.reddit.com/r/foobar2000/comments/1mhdyy5/comment/n6ve749/)  | [Georgia Reborn](https://github.com/TT-ReBORN/Georgia-ReBORN) 
* Amethyst-like (WIP): [Amethyst](https://github.com/Geoxor/amethyst)
