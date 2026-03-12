UI panel that controls panel placement within a JSplitter.
This short readme contains instructions on items that are not fully self-explanatory.

Unified Background:
------------------
This settings makes it so the background is drawn over the whole main panel & sets any panels within it to support pseudotransparency.
To make this setting work properly with the other panels it still requires going into the child panels' configuration appearance tab and ticking 'Use pseudo-transparency'.
As well as enabling the 'Enable Transparency' property.
Unified background renders all below instructions invalid.

Background (miniplayer tabs only):
----------
Disable the background if a solid color is desired, for solid colors see the color modes.
The "Shadow" option is a transparent overlay for the background image that uses the color set by the color mode (e.g. system/dynamic/custom).
Selecting "Default" uses the custom image at path\to\custom\image. If this path hasn’t been changed, the properties window opens automatically so you can set the correct path. Click Apply to save changes, leaving the default string will make it fall back on a default image or cause drawing issues.

Colors:
------
The tabstack is hidden and paused when resizing the window to reduce resizing stutter, during this short window the background will be a solid color that is also affected by the color mode (e.g. system/dynamic/custom).