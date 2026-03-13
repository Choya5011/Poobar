Readme contents: waveform | spectrum analyzer | background | colors | queue button
UI panel which displays a control panel with Segoe Fluent Icons.
This short readme contains instructions on items that are not fully self-explanatory.

Waveform:
--------
The waveform is nested inside the control panel & MUST be the TOPMOST panel inside the control panel, see:
* To delete: Preferences -> Columns UI -> Layout -> Bottommost JSplitter -> Right-Click -> Remove Panel
* To replace: Delete (previous instruct) -> JSplitter it was nested in -> Insert panel -> Panels -> Waveform minibar (mod)
* To configure: Right click the waveform area
If deleted the Fluent Control Panel will show an error, simply switch the seekbar mode from waveform to normal.
It is recommended to delete it if it's not in use as it speeds up start-up times & removes useless background processing.

Spectrum Analyzer:
-----------------
It is possible to plug in a foo_vis_spectrum_analyzer, it will replace the art thumbnail at the bottom left.
For this panel placement within the control panel does not matter, unlike the waveform that must be at the top.

Background:
----------
Disable the background if a solid color is desired, for solid colors see the color modes.
The "Shadow" option is a transparent overlay for the background image that uses the color set by the color mode (e.g. system/dynamic/custom).
Selecting "Default" uses the custom image at path\to\custom\image. If this path hasn’t been changed, the properties window opens automatically.
Click Apply to save changes after changing path, leaving the default string will make it fall back on a default image or cause drawing issues.

Colors:
------
Color mode decides background color if Background Wallpaper is not enabled. Besides that it also affects the buttons in all modes.

Queue button:
------------
* left click: add
* right click: remove
* middle click: clear
* select multiple tracks -> double click then right click: adds tracks randomly
    * reason for combo: bugged/incomplete
