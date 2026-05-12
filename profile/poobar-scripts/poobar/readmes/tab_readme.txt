UI panel which creates tabs based on window size and tab count.
This short readme contains instructions on items that are not fully self-explanatory.

Note: Background refers to the tab strips background in this script.

Tab Mode:
--------
Each mode has its own visual behavior.
This section describes the modes,
see the tab section in the wiki for usage instructions.

* Normal:
    * Functions like a normal tabstack.
    * Most user-friendly. Other modes bring more layers to background
      rendering.
* Overlap:
    * Applies pseudo transparency to selected child-panels/tabs
      (see properties).
    * Changes Background settings (see 'Background' entry).
    * Delegates background rendering for selected tabs to the script.
    * Default selected tabs: album art, playlist manager, eslyric.
    * Requires pre-requisites.
* Transparent:
    * Applies transparent background to tabstack (parent-panel).
    * Applies pseudo transparency to selected child-panels.
    * Can borrow Overlap features.
    * Requires pre-requisites, see Transparency readme.

Note: See PanelObject SupportPseudoTransparency member in JSplitter docs.

Transparency:
------------
These settings allow usage of individual overlap mode features in transparent mode.

Background:
----------
The "Shadow" option is a transparent overlay for the background image that uses the color set by the color mode (e.g. system/dynamic/custom).

Selecting "Default" uses the custom image at path\to\custom\image. If this path hasn’t been changed, the properties window opens automatically.
Click Apply to save changes after changing path, leaving the default string will make it fall back on a default image or cause drawing issues.

In *Overlap* mode the following applies:

"Enable" shifts the album art away or to the tabs depending on its status:
* When enabled the art will take the full window size with the tabs and transparent overlay sitting on top of it.
* When disabled the album art will take the full window size minus the tab size & the tabs will switch to a solid color set by the color mode.
    * This shift away from the tabs will also happen when the "Blur"
      or "Default" options are picked.

Wiki link:
---------
https://github.com/Choya5011/Poobar/wiki/Poobar#poobar-tabs