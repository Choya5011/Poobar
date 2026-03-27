UI panel which displays a control panel with Segoe Fluent Icons.
This short readme contains instructions on items that are not fully self-explanatory.

Waveform:
--------
Waveform is nested inside the control panel & MUST be the TOPMOST panel inside the control panel.
It is recommended to delete it if it's not in use.
* To delete:
    * Preferences -> Columns UI -> Layout -> Bottommost JSplitter ->
      Right-Click -> Remove Panel
    * Right-Click control panel -> Bars -> seekbar-mode = seekbar
* To replace:
    * Delete (previous instruct) -> JSplitter it was nested in ->
      Insert panel -> Panels -> Waveform minibar (mod)
* To configure:
    * Right click the waveform area

Spectrum Analyzer:
-----------------
plugin: foo_vis_spectrum_analyzer. Replaces art thumbnail at bottom left.
For this, panel placement within the control panel does not matter.
Unlike the waveform that must be at the top.

Background:
1---------
Disable background for solid color background, for colors see the color modes.
Option "Shadow": overlay for background img that uses the color set by the color mode.
2---------
Option "Default" uses custom image at path\to\custom\image.
Leaving the default path makes it fall back to a default img or cause drawing issues.

Colors:
------
Color mode sets button and background color if Background Wallpaper is not enabled.
Color modes: system, dynamic, custom.

Queue button:
------------
* left click: add
* right click: remove
* middle click: clear
* select multiple tracks -> double-click then right-click: adds tracks randomly
    * combo reason: bugged/incomplete
