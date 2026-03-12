Unified Background:
------------------
This is a main panel setting that enabled the SupportPseudoTransparency flag for all child panels & changes background drawing logic of the main panel.
Note that the below instructions need to be followed for the child panels to make this work.

Transparency:
------------
Enabling transparency will make the background of the child panel transparent and leave background painting to the parent JSplitter.
A few required settings to make this work are:
* ticking 'Use pseudo-transparency' in the panel configurations appearance tab
* ticking the SupportPseudoTransparency flag, the parent (poo_mp) does this automatically if 'Unified Background' is enabled.

NOTE:
----
Enabling transparency will cause drawing issues if the pre-requisites are not done. Simply disable if this happens.