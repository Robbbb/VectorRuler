VectorRuler
===========
[
![Screenshot Of applet](AppletScreenshot.png?raw=true "Screenshot Of applet")](http://robbbb.github.io/VectorRuler/)

A Javascript-based generator of laser cutter friendly etchable rulers
### Features
+  **SVG** Genrates fully vector based rulers ready for laser-etching, printing, plotting, or CAD applications
+ Similar lines are grouped as labeled SVG layers when opened in Adobe Illustrator or Inkscape.
+ Each line is labeled by its resolution and number as an SVG object
+ Code is well-commented and sylistically sound allowing for easy modifications and pull requests
+ Uses [Paper.js](http://paperjs.org/) for drawing and export
+ I referenced the [excellent SVG export example here](http://paperjs.org/features/#svg-import-and-export)
- The default fort is not ideal for laser cutting, as it is not a true [single-line font.](https://www.google.com/search?q=single+line+font&oq=single+line+font&aqs=chrome..69i57j69i60j69i65j69i59j69i61j69i60.2077j0j7&sourceid=chrome&es_sm=91&ie=UTF-8)
+ The text is editable as text, so it can easily be changed in Illustrator or Inkscape.


Viewing the very well organized document tree of an exported ruler in Illustrator:

Open the [Layers] Palette (Window > Layers)
click the [ ►Layer 1] arrow to view its children
There will be a group for each tick level (1"in, ½:"in, ¼"in, ⅛"in... or 1cm. 0.1cm, 0.01cm...)▼
All the labels can easily be changed in terms of size or font

### Contributing
Pull requests, corrections, translations & fixes are welcome. Any contributions must be submitted under the same license as the original piece of work (see below). Take a look at any open issues or submit new ones if there is something that needs to be fixed or added.

Watch this video on how to contribute to open source for a complete overview -> https://www.youtube.com/watch?v=UWA4wyacY2A

### License
Unless otherwise specified, everything in this repository is covered by the following licence:

Content is available under the [MIT license](https://github.com/Robbbb/VectorRuler/blob/master/LICENSE.txt).
