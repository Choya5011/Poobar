# v2.4.0.mod.33
### Added
- Full rework of sorting logic for tree view.
  - 4 custom sorting methods: 
    * library tree (original): original behaviour of Library Tree (2023 version).
    * library tree (updated): modified behaviour following TT's Georgia Reborn logic.
    * windows (simple): simple method to partially follow Windows behaviour.
    * windows (advanced): advanced logic to mimic Windows behavior in most cases.
  - Sorting methods are applied recursively to entire string, not only to first char.
  - These sorting methods can be applied to views by TF and Folders, with independent settings.
  - Additional setting to apply transliteration of Cyrillic, Greek and Japanese (Katakana and Hiragana) language to Latin script.
  - For library sources, a new setting allows to directly use the sorting provided by foobar2000. This built-in sorting should 100% match Windows behaviour, but it only works for tracked items on library.
  - Can be tweaked at 'Behaviour' tab (HTML options panel) or 'View By Sorting...' and 'View By Folder Sorting...' (properties panel).
- Added Japanese romanization (Katakana and Hiragana) support to quick-search.
- Added non-official flag 't' to search RegExp support, which will apply transliteration to tag values before matching. i.e. /[expression]/[flags], where flags can be any of 'gimsuyt'. Transliteration supports Cyrillic, Greek and Japanese (Katakana and Hiragana), like quick-search and sorting. Note it only works for RegExp because standard searches uses queries, so they are directly processed by foobar2000.
### Changed
- Code cleanup.
- Updated help text at HTML options panel to reflect the new changes.
### Fixed
- Fixed logic, on original script, related to View sorting identification. It now find matches for %YEAR%, %DATE% and %ALBUM% (case insensitive), instead of only matching lowercase values, ensuring it works with default and user-added TF patterns.

<br>

# v2.4.0.mod.32
### Changed
- Minor HTML options panel improvements.
### Fixed
- Fixed bug, on original script, when changing currently in use view or filter TF pattern and any other setting afterwards. When the first condition is met, the panel is reloaded after clicking the apply button and the HTML options panel is no longer a valid instance. As workaround, after panel reloading, the HTML options panel is automatically closed and reopened at the same page. This allows further settings editing without errors.
- Fix logic of View By Folder Structure sorting (fix from Library-Tree-v2.4.0.mod.2 was not being applied).

<br>

# v2.4.0.mod.31
### Changed
- Changed default prefixes to Strip or Swap setting to 'A|The|Las|Los|Les|La|El|Le'.
### Fixed
- Handled errors in case user inputs wrong values into drag n' drop tags settings.
- Minor HTML options panel improvements and fixes.

<br>

# v2.4.0.mod.30
### Fixed
- Fixed bug, on original script, related to 'Prefixes to Strip or Swap (| Separator)' setting not being applied without a panel reload.
- Minor HTML options panel improvements and fixes.

<br>

# v2.4.0.mod.29
### Changed
- Changed how Auto-refreshing search when using $selected{} and similar functions works. Now is only available when 'Require pressing Enter to search' is not enabled, since it would be undesirable to have automatic searches in such case. The HTML options panel checkboxes behavior has been adjusted to reflect this change.
### Fixed
- Fixed bug, on original script, related to Playlist sort setting changes not being applied without a panel reload.
- Minor HTML options panel improvements and fixes.
- Fixed checkboxes behaviour, on original script, at HTML options panel.

<br>

# v2.4.0.mod.28
### Changed
- Moved all licenses to 'assets\licenses'.
- HTML options panel code cleanup.
### Removed
- Removed license popup on first installations.
### Fixed
- Fixed bug on original script within HTML options panel on dropdown layout when opening help boxes. Now they are placed relative to the buttons which open them. Also fixed global overflow problems on every element, substituting previous hacks with proper CSS formatting.
- Fixed Album Art not working on 'Group:auto' mode for 'View by Album' default pattern.

<br>

# v2.4.0.mod.27
### Fixed
- Fixed bug, on original script, related to pressing 'Reset all' on HTML options panel, which did not reset custom Views and Filters added.
- Removed extra separator on settings menu.
<br>
# v2.4.0.mod.26
### Fixed
- Fixed multiple bugs, on original script, related to pressing 'Reset all' on HTML options panel, which broke a lot of settings only fixed on panel reload.
- Fixed overflow problems within HTML options panel for thumbnail size dropdown.

<br />

# v2.4.0.mod.25
### Added
- Added alerts to HTML options panel in case an input box or checkbox doesn't match the associated property. This is a non-functional change which will help debugging possible errors like the ones fixed at top.
### Fixed
- Fixed bug, on original script, related to pressing 'Reset page' at 'Album Art' tab on HTML options panel, which broke a lot of settings if pressing apply afterwards. There was some misplaced code related to 'Behaviour' tab, which broke the rest of the tab logic.
- Fixed bug, on original script, related to pressing 'Reset page' at 'Album Art' tab on HTML options panel, which applied the image index instead of the icon for art stub lists.
- Fixed bug, on original script, related to pressing 'Reset page' at 'Behaviour' tab on HTML options panel, with  some default values never being applied and others being applied to wrong keys.
- Fixed text errors at 'Reset all' button popup, on original script,  on HTML options panel.
- Fixed multiple errors related to 'Reset page' usage on HTML options panel.

<br />

# v2.4.0.mod.24
### Fixed
- Fixed 'Send top tracks' and 'Add top tracks' mouse actions for M. Click not being shown on HTML options panel (although they worked if manually set via properties panel).

<br />

# v2.4.0.mod.23
### Fixed
- Fixed bug on original script within HTML options panel on dropdown layout when opening help boxes. Now they are placed relative to the buttons which open them. Also fixed global overflow problems.

<br>

# v2.4.0.mod.22
### Added
- Added R. click on links, within HTML options panel, to copy the URL. As a workaround for links always opening within IE.
- Added tooltips to links within HTML options panel.
### Removed
- Removed code on original script related to 'UserInterface.id.local' references which was never set, used nor called.
### Fixed
- Fixed bug on original script related to throttle helper.
- Fixed bug on older foobar versions (v1.6.x) and newer SMP/JSplitter releases during playback.
- Fixed bug with high DPI settings on HTML message popup. See [here](https://hydrogenaudio.org/index.php/topic,111060.msg1072346.html#msg1072346).
- Fixed bug on playback. See [here](https://hydrogenaudio.org/index.php/topic,111060.msg1073010.html#msg1073010).
- Fixed double click bug on original script while using the search box and playlist as source. Item played was different than the one selected. See [here](https://hydrogenaudio.org/index.php/topic,111060.msg1073020.html#msg1073020).

<br />

# v2.4.0.mod.21
### Changed
- Search expressions using $selected{}, etc. are now updated on playback or selection changes, instead of only being evaluated the first time (requiring pressing Enter to update). With this change they behave exactly the same than 'Filters', but being directly editable on the UI (and applied on top of them). Note this feature has a great performance impact if used (compared to filters); is preferable to directly use a Filter pattern than permanently using the search box with a dynamic expression, since its much faster. Obviously this warning only applies to $selected{} and $nowplayingorselected{} expressions during normal usage (since selection will change a lot), and it can be ignored for any other expression. It will not have any performance impact if you don't use the extended TF expressions at all. The behaviour can be switched at 'Search' tab (HTML options panel) or 'Search Auto-refresh TF Expressions' (properties panel).
- Filters and search expressions using $selected{}, etc. are now only checked to associated changes, instead of playback or selection triggering a check to all of them.
- Panel uses DPI setting exposed by JS host if available, instead of using Windows registry. This will probably be irrelevant for most users except those using Wine.
- Tooltip text size is now 1 point smaller by default (it can be customized anyway).
- Internal changes (for future development).

<br />

# v2.4.0.mod.20
### Added
- Added $nowplaying{}, $nowplayingorselected{} and $selected{} support at search input box.
- Added 'Statistics' tab at HTML options panel. Moved multiple settings from 'Display' tab into it. Added multiple help texts from new and previously added settings.
- Added custom statistics slot names to 'Statistics' tab at HTML options panel.
- Added number of decimals shown setting to 'Statistics' tab at HTML options panel.
- Added profiling logging for library loading setting to 'Advanced' tab at HTML options panel.
- Added facets chained source notifications setting to 'Advanced' tab at HTML options panel (along help texts).
- Added facets internal cache setting to 'Advanced' tab at HTML options panel (along help texts).
- Added help text related to RegExp usage to 'Search' tab at HTML options panel.
### Changed
- Changed the way quick-search works for non ASCII characters, similar to foobar2000 asymmetric search where 'á' or 'a' are equivalent when pressing 'a' key. As result, jumping by letter across the panel will not skip anymore words starting with accents, etc. Additionally, there is internal transliteration between Greek and Cyrillic letters to Latin script, so 'Σ' or 'σ' are also matched with 's', 'п' to 'p', etc.
- Expanded help text related to Drag n' drop usage on 'Search' tab at HTML options panel.
- Minor improvements and cleanup at HTML options panel.
- Internal changes (for future development).
### Fixed
- Fixed search history not being updated immediately when pressing Enter, but waiting 3 seconds before adding the new expression (so later changes affected or even skipped saving it). Any other kind of search still uses the delay as originally intended.
- Minor fixes to HTML options panel. In some cases initial values after opening the window were not properly updated on original script or checkboxes were enabled when they shouldn't.

<br />

# v2.4.0.mod.19
### Added
- New 'Send top tracks' and 'Add top tracks' mouse actions for Alt + L. Click and M. Click. Available for current and default playlist.
### Changed
- Reverted changes to selection type at FbUiSelectionHolder because it conflicts with other settings, resulting in bugs when adding items (instead of replacing them). It will be reimplemented on future versions, replacing the current Library Tree code and using the native library viewer playlist.
- Default action for Alt + L. Click is now 'Send Top tracks to default playlist'.
- Internal changes (for future development).

<br />

# v2.4.0.mod.18
### Added
- New 'Send top tracks' and 'Add top tracks' contextual menu entries which filter and sort the current selection on panel with customizable expressions. Note this custom filter is totally independent to the view/filter patterns being used on the panel, and is applied on top of them.
	* Target playlist follows the 'Target playlist for send to playlist' setting (HTML options panel)  or 'Playlist: Send to Current' (properties panel).
	* Send entry replaces all tracks on destination, while Add entry inserts them at the end.
	* Customizable query and TF expressions can be found at 'Behaviour\Top tracks selection' (HTML options panel) or 'Playlist: Top tracks filter' and 'Playlist: Top tracks sorting' (properties panel). 
	* Support for $nowplaying{}, $nowplayingorselected{} and $selected{}.
	* By default it uses '%RATING% GREATER 3 OR %FEEDBACK% IS 1 OR %2003_LOVED% IS 1' as filter and '$rand()' as sorting.
### Changed
- Changed panel selection type at FbUiSelectionHolder so it properly identifies as 'media_library_viewer'.
- Minor improvements and cleanup at HTML options panel.
- Internal changes (for future development).

<br />

# v2.4.0.mod.17
### Changed
- New behavior when sending items to playlist: now items are also selected on the destination playlist. This ensures other panels/scripts tracking selection changes work properly with Library Tree. A new setting has been added in case the legacy behavior is desired at 'Behaviour\Playlist selection behaviour' (HTML options panel) or 'Playlist: Select added items' (properties panel).

<br />

# v2.4.0.mod.16
### Added
- New contextual menu entry to show previously played track.
### Changed
- Internal changes (for future development).

<br />

# v2.4.0.mod.15
### Fixed
- Fixed Drag n' drop queries for tags with no values.
- Fixed error on HTML options panel.

<br />

# v2.4.0.mod.14
### Added
- Added support for $nowplayingorselected{} TF expressions which uses the focused track as fallback while not playing anything. This allows filters which should work for both playing and selected tracks.
- Added Syntax help to HTML options panel Filters tab.
### Changed
- All default filter presets using $nowplaying{} have been tweaked to use $nowplayingorselected{} instead, so they always work with selection as fallback. Restore filter defaults to use them.
### Removed
- Removed 'Selected Artist' filter preset, since it's now provided with nowplaying presets too as fallback.
### Fixed
- Fixed Drag n' drop queries for tags with no values.
- Fixed queries with /.../ patterns being recognized as RegExp in some cases and displaying 'invalid search expression'.

<br />

# v2.4.0.mod.13
### Added
- New tab at HTML options panel named 'Search' which contains all settings related to the search input box (including the new drag n' drop feature).
### Changed
- Modified Drag n' Drop into search box. Dropping any selection will be modified by keyboard key pressed. The modifiers can be adjusted with different tags, multi-value tag, inter-tags, inter-tracks and inter-query operators at the HTML options panel (or looking for 'Search Drag n' Drop ... ' at the properties panel).
	* None
	* Alt
	* Ctrl
	* Shift
- Statistics custom slots TF can also be modified at the HTML options panel. The labels can only be modified at the properties panel.
- Drag n' drop over search box text is now modified according to action being used, indicating if query will be joined or replaced and the tags used. Note multi-value tag and inter-tracks operators are not displayed, only inter-tag operator.

<br />

# v2.4.0.mod.12
### Added
- Added tooltip over search input box which displays the entire search string (useful for long queries) along the found tracks count.
- Added 6 slots for custom statistics, 3 for averaged values and 3 for summed ones. it uses the decimals setting found at 'Statistics Rating/Popularity Decimals' property. Slots can be modified at 'Statistics Titleformat Custom-X (sum)' and 'Statistics Titleformat Custom-X (avg)' properties, and their labels at 'Statistics Titleformat Custom labels' property. By default the panel includes custom expressions as example.
- Added new external integration callbacks (name -> arg):
	* 'Library Tree: Switch view'		-> { window: [string], viewName: string, viewIdx: number }, viewIdx = -1 for folder view, names follow menu names
	* 'Library Tree: Switch filter'		-> { window: [string], filterName: string, filterIdx: number }, filterIdx = -1 or 0 for no filter, names follow menu names
	* 'Library Tree: Switch source'		-> { window: [string], sourceName: string, sourceIdx: number, sourcePlaylistName: string, sourcePlaylistIdx: number, sourcePanel: string }, sourceIdx = -1 or 0 for library, sourcePlaylistIdx = -1 for active playlist, names follow menu names
	* 'Library Tree: Switch art type'	-> { window: [string], artName: string, artIdx: number }, artIdx = -1 or 0 for front art, names follow menu names
	* 'Library Tree: Switch statistics'	-> { window: [string], statisticsName: string, statisticsIdx: number }, statisticsIdx = -1 or 0 for default stats (usually # tracks), names follow menu names and can be matched by entire label (all), user label only or 'custom-X (...)' labels (custom entries only)
### Changed
- Simplified and unified code at multiple places, replacing hardcoding with easier to maintain alternatives (and less prone to bugs). Multiple console warnings have also been set when errors are found.
### Fixed
- Track count is now shown on album art mode for loved, hated and feedback statistics. i.e. the 'X tracks' label at the top right of the image.
- Fixed crash editing any value at display options tab while using loved, hated and feedback statistics.

<br />

# v2.4.0.mod.11
### Added
- Added Drag n' Drop support into search box. Dropping any selection will now perform a search based on file tags (or filenames), according to your settings. 2 new properties have been added to tweak the behavior:
	* Search Drag n' Drop Method (Auto=0, Tags=1, Disabled=-1)': 0 to use filenames on view by Folder Structure (with RegExp) and tags (with queries) otherwise. 1 will force tags usage on any view.
	* Search Drag n' Drop Tags: accepts an array of tags or TF expressions. By default it's set to use 'ALBUM ARTIST'.
- Added external integration via window.NotifyOthers(callback, arg) with other scripts. Window arg property should be an array with desired target panel names. All panels execute the action if it is not provided, otherwise only the matching panels. Note panel notifications only work within the same JS host component (i.e. no SMP <-> JSplitter). Currently available callbacks (name -> arg):
	* 'Library Tree: Show now playing'	-> { window: [string] }
	* 'Library Tree: Show handle'		-> { window: [string], handle: FbMetadbHandle }
	* 'Library Tree: Switch show art'	-> { window: [string] }
	* 'Library Tree: Show art'		-> { window: [string] }
	* 'Library Tree: Show tree'		-> { window: [string] }
	* 'Library Tree: Switch show artists / albums'	-> { window: [string], forceShowArt: boolean }
	* 'Library Tree: Show artists'		-> { window: [string], forceShowArt: boolean }
	* 'Library Tree: Show albums'		-> { window: [string], forceShowArt: boolean }
	* 'Library Tree: Collapse all'		-> { window: [string] }
	* 'Library Tree: Quicksearch'		-> { window: [string], search: string }
	* 'Library Tree: Search'		-> { window: [string], search: string }
	* 'Library Tree: Clear'			-> { window: [string] }
### Fixed
- Fixed crashes due to division by zero and NaN indexes at some points of the code. For ex. clicking on panel with no items being shown on album art mode. See [here](https://hydrogenaudio.org/index.php/topic,111060.msg1072121.html#msg1072121).
- Fixed multiple bugs on automatic group handling for default view patterns and cases where a default group was not found. See [here](https://hydrogenaudio.org/index.php/topic,111060.msg1072121.html#msg1072121).

<br />

# v2.4.0.mod.10
### Changed
- Simplified background grid settings (see v2.4.0.mod.9 ) with a new menu entry at quick setup which allows to easily set every panel via input popups.

<br />

# v2.4.0.mod.9
### Added
- Added new settings to adjust the portion of the art used (x and width) to draw the background. These 2 settings may be used to split the image and draw an art grid. They can be found as properties ('Image Background x-offset (%)', 'Image Background w-offset (%)'). It will probably look much better using blur, minimizing minor offset errors due to layout differences. As example, to set a 3-panel grid with artwork filling, they must be set as: x: -66%, w: 0% | x: 34%, w: 34% | x: 66%, w: 0%
### Changed
 - For facets mode (panel source), if chained source notifications (see v2.4.0.mod.8 ) is enabled and more than one source is set, the different sources are merged and deduplicated, instead of replaced by the last one selected. This way is now possible to merge selections from different panels, even with total different views, for ex. selecting one artist in one panel and all Rock tracks at other panel. The destination panel will sort and display the selection according to the panel settings (not following any source sorting).

<br />

# v2.4.0.mod.8
### Added
- Added new default view patterns: Album (year) and Album (facets).
### Changed
- Expanded previous feature of hidden cached playlists to use panel notifications as fallback if saving handle lists is not supported on JS host component. It should now work with any SMP version, one way or another. Users with newest SMP/JSplitter should experience no changes compared to previous package version. Remember there is a property to restore original behavior if desired ('Playlist: Prefer internal cache (if supported)').
- For facets mode (panel source), now every panel sends updates to other panels when being refreshed. i.e. there is no need to set multiple sources, only the most immediate parent's name, since the entire chain will be updated if needed; for ex. for a Genre|Artist|Album 3-panel layout (Album would use Artist as source, and Artist uses Genre). Multiple sources should only be needed if they are fully independent sources; for ex. 2 Artists trees with different filter views in an Artist1|Artist2|Album layout (Album would use Artist1|Artist2 as sources). A new property has been added to disable this behavior, if desired ('Library Source: Chained source notifications'), thus requiring an active selection on a panel to send it to immediate child panels (instead of automatic refreshing the entire chain).
- Show selection action is now disabled if the focused item is not tracked by the panel. Menu entry will be grayed out and a 'not found' tip added.
- The default associated playlist to panel selection is now named 'Library Viewer Selection' to match DUI and CUI album list panels default setting. Note it can be changed at the options panel if desired.

<br />

# v2.4.0.mod.7
### Changed
- Removed unnecessary usage of cache playlists while using Facets mode (panel source) on newest JSplitter and SMP versions. Selection is now sent to other panels on real time and saved to a playlist file at package data folder for loading on startup, without the need of cluttering the UI with a visible playlist. On non supported JS host components, the previous behavior will be used as fallback. A new property has been added to disable it, if desired ('Playlist: Prefer internal cache (if supported)').
- Performance improvements retrieving items from library, playlist or panel source. Previously it always retrieved all and then the selected one was chosen, now only the selected one is computed. In most cases the library is the biggest one, so it may only be noticeable when using the other sources on huge libraries. It should also reduce peak memory usage.

<br />

# v2.4.0.mod.6
### Added
- Added double click action to scrollbar buttons to jump to top/bottom of the list.
- Added double click action to scrollbar current bar position to show now playing item (while playing) or focused item (while stopped).
- Added new menu entry at contextual menu to show the currently focused item.
### Changed
- Changed default view pattern 'Artist initial' to be compatible with Japanese/Chinese chars along some minor improvements.

<br />

# v2.4.0.mod.5
### Added
- Added new default view patterns: Decade, Genre, Style, Genre tree, Artist initial (asciified values).
### Changed
- Changed default view patterns to create branches for multi-value artist tags and also swap prefixes. i.e. The Rolling Stones -> Rolling Stones, The
- Changed default view patterns to split/sort albums with different %COMMENT% or %MUSICBRAINZ_ALBUMID% (if the first doesn't exist). Previously multiple versions of the same album were just joined together, which was undesirable. Now proper tagging may fix it.
- Changed default view Date pattern to only use the year part of the tag (intended usage). This should only affect people who put full dates on %DATE% tag.
- Cleanup of default view/filter pattern, so they are now auto-numbered, which makes it much easier to reorder them or add new ones.

<br />

# v2.4.0.mod.4
### Added
- Added separators support at views menu. To insert one, a view named 'separator' must be created (the pattern must be anything but empty, like a '.').
- Added tips about separators at options panel.
- Added 'Nowplaying Similar' filter which can be used like Spotify similar artists recommendations (*). Tries to match at least a genre, an style, within a range of 10 years and not the same artist. (*) For ex. with 'Album art/Artist' in flow mode.
- Added 'Nowplaying Decade' filter which displays results within a range of 10 years.
### Changed
- Revamped 'Played often' filter to take into consideration play rate since a track was added and being played on last year. Previously it was just a simple check of playcount over 9 times (which was not adjusted to user listen habits).
- Revamped 'Nowplaying Genre' and 'Nowplaying Style' filter to ommit other matches with live, instrumental, ... tags. It also ommits currently playing artist, so it shows only other similar artists.

<br />

# v2.4.0.mod.3
### Added
- Added separators support at filter menu. To insert one, a filter named 'separator' must be created (the query must be anything but empty, like a '.').
- Added new default filter query expressions like: 'Nowplaying Similar Artists' (*), 'Nowplaying Genre', 'Nowplaying Style', 'Selected Artist'. (*) Needs previous tagging with other scripts like [Listenbrainz-SMP](https://hydrogenaudio.org/index.php/topic,124384.0.html) or [Search-By-Distance-SMP](https://hydrogenaudio.org/index.php/topic,120982.0.html).
### Changed
- Changed default filter query expressions to be compatible with foo_playcount, foo_enhanced_playcount and foo_playcount_2003.
- Changed default filter query expressions to be compatible with foo_truepeak.
- Changed default filter query expressions to be compatible with multi-valued tags (like Nowplaying Artist).

<br />

# v2.4.0.mod.2
### Added
- Added profiling logging for library loading (properties panel). Enabled by default.
- Added number of decimals setting for popularity/rating statistics (can be changed at the properties panel). 1 by default.
- Added Loved, Hated and Feedback (loved - hated) statistics. Nodes show the sum of loved/hated tracks within its subnodes.
- RegExp support at search input box. They must be written in /[expression]/[flags] form. Tags used for lookup are those present on the current View TF expression, ignoring those related to track and disc number; on folder view, paths are used instead. RegExps and queries can not be mixed.
### Changed
- Changed default TF expressions to be compatible with foo_playcount, foo_enhanced_playcount and foo_playcount_2003.
- Cleanup of search history menu. Added RegExp reference.
- Helpers code cleanup.
### Fixed
- Fixed quick-search not working when looking for a word whose first letter is the same than currently focused one. i.e. can't look for "bad ..." when you are at "b". Now advancing works only when you press the key on rapid succession, otherwise does quick-search.
- Fix sorting under View By Folder Structure for all levels, by TT.

<br />

# v2.4.0.mod.1
### Changed
- Changed how built-in icons paths are handled, using relative paths.
### Fixed
- Fix sorting under View By Folder Structure by jimmywan https://github.com/Wil-B/Library-Tree/pull/3

<br />

# v2.4.0

### Added
- **New facets / multi-panel mode** (for guidance on set-up, see help in options > views tab)
	- each panel can contain a facet, tree view or album art
	- panels needn't be contiguous
	- no longer restricted to two panels
	- **BREAKING change**: if two panel mode previously used, source panel name now has to be entered (menu > source > select source panel)

- **Mode presets** (options > behaviour tab)
	- Browser
		- keeps playing playlist
		- easy to browse track lists without interfering with playing playlist, e.g. in album art or facet modes
		- works best with playback follows cursor OFF & playlist visible
		- double-click status bar to view playing playlist (custom themes may have a different method)
	- Player
		- play and manage without a playlist
		- easy management options
	- Default
		 - free choice as before

- **Statistics** (menu)
	- bitrate
	- duration
	- total size
	- rating
	- popularity
	- date
	- playback queue
	- playcount
	- first played
	- last played
	- date added

- **Album art drop shadow** (options > album art > thumbnail drop shadow)

- **$selected**
	- for use in filters
	- works like $nowplaying except applies to selected (focused) track
	- example, artist IS $selected{$meta(artist,0)} displays tracks by selected artist.

- **Before search memory option**: original state shows on clearing search (options > behaviour tab)

- **Shortcut keys**: more added to search box: ctrl+backspace etc

### Changed
- Library initialisation:
	- optimisations for foobar2000 v2
	- no longer initialises for invisible panels, waits until panel shown
- Jump search improved: repeat presses of same letter advance position
- Albumart: reinstated ability to set number of index characters that show on scrollbar drag (album art tab)
- Follow selection (playlist) option now applies to tree and facet views as well as album art (setting now in behaviour tab). Uses foobar2000 preferences  > display > selection viewers setting
- Made calculating durations more efficient

### Fixed
- various minor draw and alignment issues

<br />

# v2.3.4

### Added
- Some compatibility fixes for foobar2000 v2.0

### Changed
- Arrow & triangle node styles reworked for improved look on foobar2000 v2.0. The previous styles, now called arrows light and triangles light, can be set on the display tab\node style

<br />

# v2.3.3

### Added
- Display of item durations for tree and album art views (enable on display tab)
- Intelligent group level sort by year
	- this automatically adjusts the view pattern to enable sorting in different ways, e.g. to enable reverse sorting $nodisplay snipetts are inserted into the view pattern. This is reversible by selecting the default sort provided the view isn't manually edited to alter the snippetts
- Wine: font check

### Fixed
- Search text was difficult to read with certain theme and colour combinations

<br />

# v2.3.2

### Added
- Album art view: hover frame can now be displayed as an image border (display tab)
- Menu configure that opens Spider Monkey Configuration (right click + shift)

### Changed
- Settings are now always added to the context menu if shift is pressed

### Fixed
- Occasional issues with the options dialog not opening due to the feature checker wrongly reporting Spider Monkey Panel Show HTML Dialog as unsupported. In such cases there is now a confirm to guard against false negatives. Additionally, there is a manual setting in the first panel property
- Minor colour selection and draw issues

<br />

# v2.3.1

### Fixed
Issue with getting album art index character

### Added
Checks to test if ShowHtmlDialog is supported, with fallback to an alternative where possible (thx to regor)

<br />

# v2.3.0

### Changed
- Album art index character(s) that show on scrollbar drag are now configurable:
    - No limit to number, e.g. can be single letter up to full name (album art tab)
    - Year can be autodetected and 4 digits shown, if number above is less than 4 (album art tab)
- Improved horizontal flow mode metrics
- Removed the ability to auto-update from old versions (v2.1.3 or earlier)

### Added
- New clean preset with alternative selection model and new node style (menu\quicksetup)
	- info: alternative selection model is automatically used if selection\full line is enabled (behaviour tab) & hover effect (background) is set to none (display tab). It works best with highlight text on hover enabled (display tab)
- New random colour dark theme (display tab)
- Ability to show source at root, e.g. library, playlist name, panel etc (display tab). Default off. Useful if you don't use a constant source
- Option to customise the name of 'Library Tree Panel Selection' playlist (panel properties: 'Playlist: Panel Selection'): it's used to save the contents of the 2nd panel between foobar2000 restarts.
- Hover effect: tree / album art: option to always use mouse pointer (no hand) (display tab)

### Fixed
- Album art: draw issue with dark overlay labels (compact/grid mode)
- Keystroke navigation irregularities
- No display sorting of albums starting with numbers
- plman.GetPlaylistLockedActions(playlistIndex) error when playlistIndex is invalid
- Lines sometimes overdrawing expanded [-] square icon
- Rare library update crash
- Wine stabilisation: library tree should no longer give errors in Wine, but some limitations remain:
    - copy & paste into search box may not work. It can be fixed by installing [this version of Spider Monkey Panel (v1.6.2-dev+7c0928bf)](https://github.com/Wil-B/Find-and-Play/files/8575143/foo_spider_monkey_panel.zip) which includes marc2k3's utils.GetClipboardText/utils.SetClipboardText (thx to marc2k3)
    - recycler is unlikely to work: it's used when refreshing images: windows explorer can be used to remove images from the cache instead
    - options dialog may not load: menu now indicates there was a problem & console explains what can be done instead
- Miscellaneous fixes

<br />

# v2.2.0
### Added
- Album art
- Playlist source
- Two panel mode (optional)
- Album art flow mode
- '¦' soft splitter that combines different fields into same branch level, e.g.
	`%album artist%¦%artist% or %<album artist>%¦%<artist>%`
- New options dialog

### Changed
- Send to new playlist now checks playlist lock status
- Smooth scroll: enhanced smoothness when using scrollbar
- Refactored code
