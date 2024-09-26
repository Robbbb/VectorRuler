/* jshint asi: true*/
const ruler = {};
//dpi resolution control for different laser cut machines/applications
const dpi72 = 72;
const dpi96 = 96;
//Left and right canva added margings (px) to show all the vector rule
const leftMargingDisplacement = 10;
const rightMargingExtension = 20;

const limitTickQty = function () {
    //Prevent it from crashing if it tries to render too many linest
    ruler.ticksPerUnit = Math.pow(ruler.subUnitBase, ruler.subUnitExponent)
    ruler.masterTickQty = ruler.ticksPerUnit * ruler.width
    if (ruler.height > 100) {
        console.info("Unreasonable ruler height: " + ruler.height + " reducing height")
        ruler.height = 15
        document.getElementById("rulerHeight").value = ruler.height;
    }
    if (ruler.width > 1000) {
        console.info("Unreasonable tick quantity: " + ruler.masterTickQty + " reducing width")
        ruler.width = 500
        document.getElementById("rulerWidth").value = ruler.width;
    }
    if (ruler.masterTickQty > 10000) {
        console.info("Unreasonable tick quantity: " + ruler.masterTickQty + " reducing exponent")
        if (ruler.subUnitExponent > 1) {
            ruler.subUnitExponent = ruler.subUnitExponent - 1
            document.getElementById("subUnitExponent")[ruler.subUnitExponent].selected = true;
        }
    }
    if (ruler.ticksPerUnit > 100) {
        console.info("Unreasonable exponent: " + ruler.ticksPerUnit + " resetting to reasonable")
        ruler.subUnitExponent = 1
        document.getElementById("subUnitExponent")[ruler.subUnitExponent].selected = true;//selects resonable
    }
};

const checkUnit = function () {
    let dpi = ruler.dpi //most used for laser cut programs
    let pixelsPerCM =  dpi / 2.54
    let pixelsPerInch =  dpi


    if (ruler.units === "inches") {
        ruler.pixelsPerUnit = pixelsPerInch
        ruler.unitsAbbr = "\"in."
        document.getElementById('heightTitle').textContent = 'Height (in.):'
    } else if (ruler.units === "centimeters") {
        ruler.unitsAbbr = "cm."
        ruler.pixelsPerUnit = pixelsPerCM
        document.getElementById('heightTitle').textContent = 'Height (cm.):'
    } else {
        ruler.pixelsPerUnit = 0
        console.error("Unexpected unit value. Unit value: " + rulerUnits)
    }
    ruler.heightPixels = ruler.pixelsPerUnit * ruler.height
};

const checkSubUnitBase = function () {
    // if it is fractional, make the fractional dropdown appear
    // if it is decimal, likewise
    let suffix = " " + ruler.unitsAbbr

    let subLabelsDec = [
        "1" + suffix,
        "1/10th" + suffix,
        "1/100th" + suffix,
        "1/1000th" + suffix,
        "1/10000th" + suffix,
        "1/100000th" + suffix,
        "1/1000000th" + suffix,
    ]

    let subLabelsFrac = [
        "1" + suffix,
        "1/2" + suffix,
        "1/4" + suffix,
        "1/8" + suffix,
        "1/16" + suffix,
        "1/32" + suffix,
        "1/64" + suffix,
    ]

    if (ruler.subUnitBase === '10') {//Decimal!
        ruler.subLabels = subLabelsDec
        document.getElementById("subUnitExponent")[3].disabled = true;
        document.getElementById("subUnitExponent")[4].disabled = true;//disable the ones that crash.
        document.getElementById("subUnitExponent")[5].disabled = true;
        document.getElementById("subUnitExponent")[6].disabled = true;

        for (let i = ruler.subLabels.length - 1; i >= 0; i--) {
            document.getElementById("subUnitExponent")[i].text = ruler.subLabels[i]
        }
    } else if (ruler.subUnitBase === '2') {//Fractional!
        ruler.subLabels = subLabelsFrac

        document.getElementById("subUnitExponent")[3].disabled = false;
        document.getElementById("subUnitExponent")[4].disabled = false;
        document.getElementById("subUnitExponent")[5].disabled = false;//re-enable the ones that dont crash
        document.getElementById("subUnitExponent")[6].disabled = false;

        for (let j = ruler.subLabels.length - 1; j >= 0; j--) {
            document.getElementById("subUnitExponent")[j].text = ruler.subLabels[j]
        }
    } else {
        console.error("Impossible subUnitBase. Must be 2 or 10. is:  " + ruler.subUnitBase)
    }
};

const resizeCanvas = function () {
    document.getElementById("paintCanvas").width = ruler.width * ruler.dpi + rightMargingExtension;
    let heightAdded = 50
    document.getElementById("paintCanvas").height = heightAdded + ruler.heightPixels;
};

const tickLabel = function(x1, y2, finalTick, tickIndex, exponentIndex){
    //label the tick
    let labelTextSize = ruler.fontSize;
    console.log('font size:' + labelTextSize)

    //TODO: Improve this behaviour adding different offset options: bottom centered, right, left, etc...
    let xLabelOffset = -4    
    let yLabelOffset = 10

    if (finalTick) {xLabelOffset = -1 * xLabelOffset}//last label is right justified

    let text = new paper.PointText(new paper.Point(x1+ xLabelOffset, y2+yLabelOffset));
    text.justification = 'left';
    if (finalTick) {
        text.justification = 'right'; //TODO: Future functionality: Make this optional.
    }//last label is right justified
    
    text.fillColor = 'black';
    
    if(document.getElementById('absoluteValues').checked) 
    {
        text.content = Math.abs(tickIndex);
    } else {
        text.content = tickIndex;
    }
    
    text.style = {
    // fontFamily: 'Helvetica',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: labelTextSize}
    text.name = ruler.subLabels[exponentIndex] + " label no. " +tickIndex //label for SVG editor
};

const tick = function(tickHeight, horizPosition, tickIndex, offsetTickIndex, exponentIndex, tickSpacing, finalTick){

    //exponentIndex is 0-6, how small it is, 6 being smallest
    let x1 = leftMargingDisplacement + horizPosition + (tickSpacing * tickIndex)
    let x2 = x1 //x === x because lines are vertical
    let y1 = 0//all lines start at top of screen
    let y2 = tickHeight//downward

    if (ruler.tickArray[ruler.masterTickIndex]===undefined || ruler.redundant) {
        // if no tick exists already, or if we want redundant lines, draw the tick.
        let line = new paper.Path.Line([x1, y1], [x2, y2]);//actual line instance
        line.name = ruler.subLabels[exponentIndex]+ " Tick no. " + tickIndex //label for SVG editor
        line.strokeColor = "black";//color of ruler line
        line.strokeWidth = "1";//width of ruler line in pixels

        ruler.tickArray[ruler.masterTickIndex]=true //register the tick so it is not duplicated
        if (exponentIndex === 0) {//if is a primary tick, it needs a label
            tickLabel(x1,y2,finalTick,offsetTickIndex,exponentIndex)
        }
    }
};

const constructRuler = function () {
    ruler.tickArray = [];//for prevention of redundancy, a member for each tick
    const layerArray = new Array(ruler.subUnitExponent);//Layers in the SVG file.

    let highestTickDenominatorMultiplier;
    for (let exponentIndex = 0; exponentIndex <= ruler.subUnitExponent; exponentIndex++) {
        //loop through each desired level of ticks, inches, halves, quarters, etc....
        let tickQty = ruler.width * Math.pow(ruler.subUnitBase, exponentIndex)
        layerArray[exponentIndex] = new paper.Layer();
        layerArray[exponentIndex].name = ruler.subLabels[exponentIndex] + " Tick Group";

        let startNo = document.getElementById('startNo').value;
        let endNo = document.getElementById('endNo').value;

        highestTickDenominatorMultiplier = ruler.ticksPerUnit / Math.pow(ruler.subUnitBase, exponentIndex)

        //to prevent redundant ticks, this multiplier is applied to current units to ensure consistent indexing of ticks.
        let finalTick = false
        for (let tickIndex = 0; tickIndex <= tickQty; tickIndex++) {
            ruler.masterTickIndex = highestTickDenominatorMultiplier * tickIndex
            if (tickIndex === tickQty) {
                finalTick = true
            }
            // levelToLevelMultiplier =0.7
            let tickHeight
            tickHeight = ruler.heightPixels * Math.pow(ruler.levelToLevelMultiplier, exponentIndex)

            let tickSpacing = ruler.pixelsPerUnit / (Math.pow(ruler.subUnitBase, exponentIndex))
            //spacing between ticks, the fundemental datum on a ruler :-)
            let offsetTickIndex = parseInt(tickIndex) + parseInt(startNo)
            // Check if the ruler is inverted (from higher to lower values)
            if (startNo > endNo) {
                offsetTickIndex = parseInt(tickIndex) - parseInt(startNo)
            }
            tick(tickHeight, 0, tickIndex, offsetTickIndex, exponentIndex, tickSpacing, finalTick);
            //draws the ticks
        }
    }
};


const debug = function () {
    console.info("--All the variables---")
    console.info(ruler)//prints all attributes of ruler object
};

const updateVariables = function () {
    ruler.units = document.getElementById('rulerUnitsInches').checked ? 
        document.getElementById('rulerUnitsInches').value : 
        document.getElementById('rulerUnitsCentimeters').value;
    ruler.subUnitBase = document.getElementById('subUnitsFractional').checked ? 
        document.getElementById('subUnitsFractional').value :
        document.getElementById('subUnitsDecimal').value;
    ruler.redundant = document.getElementById('redundant').checked;
    ruler.width = Math.abs(document.getElementById('startNo').value - document.getElementById('endNo').value); //Calculate the width based on the start and end numbers.
    ruler.height = document.getElementById('rulerHeight').value;
    ruler.subUnitExponent = document.getElementById('subUnitExponent').value;
    ruler.levelToLevelMultiplier = document.getElementById('levelToLevelMultiplier').value;
    ruler.absoluteValues = document.getElementById('absoluteValues').checked;
    ruler.dpi = document.getElementById('dpi72').checked ? dpi72 : dpi96;
    ruler.cmPerInch = 2.54;
    ruler.fontSize = document.getElementById('fontSize').value;
};

const build = function () {
    // Get a reference to the canvas object
    let canvas = document.getElementById('paintCanvas');

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);


    updateVariables()
    checkUnit()
    checkSubUnitBase()
    limitTickQty()
    resizeCanvas()
    constructRuler()

    paper.view.draw();
};

const exportSvg = function () {
    //* I referenced the excellent SVG export example here: http://paperjs.org/features/#svg-import-and-export
    document.getElementById("svgexpbutton").onclick =
        function () {
            exportWidth = document.getElementById("paintCanvas").width
            exportHeight = document.getElementById("paintCanvas").height

            let downloadLink = document.getElementById('downloadSVG')
            // let svgString = paper.project.exportSVG({asString:true})
            let svgString = paper.project.exportSVG({asString: true, size: {width: exportWidth, height: exportHeight}});

            let url = URL.createObjectURL(new Blob([svgString], {
                type: 'image/svg+xml'
            }));
            downloadLink.href = url
            downloadLink.download = 'myRuler.svg';


            // viewBox ='viewBox="0 0 '+exportWidth+' '+exportHeight+'"'
            // dims = ' width= "'+exportWidth+'" height="'+exportHeight+' " '
            // let svgPrefix = '<svg x="0" y="0"'+dims+viewBox+' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
            // let svgPostfix = '</svg>';

            // let elem = document.getElementById("svgexpdata");
            // elem.value = 'data:image/svg+xml;base64,' + btoa(svg);
            // //btoa Creates a base-64 encoded ASCII string from a "string" of binary data
            // document.getElementById("svgexpform").submit();
        };

};

$(document).ready(function(){ 
    console.log("\t Welcome to the Ruler Generator │╵│╵│╵│╵│╵│╵│")
    //When document is loaded, call build once
    build()
    debug()//prints all values to browser console

    $( "#rulerParameters" ).change(function(  ) {
        //anytime anything within the form is altered, call build again
        build()
        debug()//prints all values to browser console
    });

    exportSvg()

});
