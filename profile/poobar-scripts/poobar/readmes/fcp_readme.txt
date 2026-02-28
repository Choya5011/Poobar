UI panel which displays a control panel with Segoe Fluent Icons.
This short readme contains instructions on items that are not fully self-explanatory.

Background:
----------
If the background is enabled and not blurred it is recommended to use the default color mode (for the buttons).
Disable the background if a solid color is desired, for solid colors see the color modes.
The "Shadow" option is a transparent overlay for the background image that uses the color set by the color mode (e.g. system/dynamic/custom).
Selecting "Default" uses the custom image at path\to\custom\image. If this path hasn’t been changed, the properties window opens automatically so you can set the correct path. Click Apply to save changes, leaving the default string will make it fall back on a default image or cause drawing issues.

Waveform:
--------
The waveform is nested inside the control panel, see:
* To delete: Preferences -> Columns UI -> Layout -> Bottommost JSplitter -> Right-Click -> Remove Panel
* To replace: Delete (previous instruct) -> JSplitter it was nested in -> Insert panel -> Panels -> Waveform minibar (mod)
If deleted the Fluent Control Panel will show an error, simply switch the seekbar mode from waveform to normal.
It is recommended to delete it if it's not in use as it speeds up start-up times & removes useless background processing.

Queue button:
------------
* left click: add
* right click: remove
* middle click: clear
* select multiple tracks -> double click then right click: adds tracks randomly
    * reason for combo: bugged/incomplete
