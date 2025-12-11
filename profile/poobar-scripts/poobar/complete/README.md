## Script Descriptions
Most visual scripts support system, dynamic & custom colors. Dynamic album art background & custom image background.

### Fluent Control Panel  
A control panel that uses the Segoe Fluent Icons font for its icons & the panel this theme is centered around.  
Modified from the original Fluent Control Panel by eurekagliese.  
Adjusts item placement based on panel size.  
Clicking the album art will perform a media library search on the artist. The rest is self-explanatory.

### Poobar Main Panel
All panels are placed inside one main JSplitter with the MP script as panel placement script.

Relies on (custom) panel title to place panels. These are accessible inside the CUI layout editor.  
The main panel currently has 4 panels it looks out for titled:
* 'Fluent Control Panel'
* '' (Playlist View: Segoe Fluent Icons MusicNote, unicode: ec4f)
* '' (Tab Stack: Segoe Fluent Icons MapLayers, unicode: e81e)
* 'Smooth Browser'

If the title of any of these are changed & the MP script isn't adjusted for it the MP can not fetch the panel.

**Customization:**
* The script contains 5 elif blocks for 5 different window states, what's set in these blocks determines panel placement per window state.
* For basic layout adjustment such as adjusting control panel height the main panels properties need to be accessed:
    * Preferences -> Display -> Columns UI -> Layout -> select topmost JSplitter -> Configure panel... -> Properties
    * This provides 4 basic adjustments, deeper layout adjustment requires editing the script.

### poobar tabs
A tab script that scales with tab panel size & adjusts tabs to take all horizontal/vertical space.

### poobar tabs pt
A slightly modified version of 'poobar tabs' meant for the ESLyric presets.  
Behaves slightly different in terms of visuals & uses pseudo transparency.  
Use 'poobar tabs' for custom themes unless this ones features are desired.