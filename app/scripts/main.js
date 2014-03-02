/*global d3: true */
'use strict';
/**
 * Generates radial isosceles trapezoid - like arc, bud with straight bases
 * Based on d3.svg.arc
 * https://github.com/mbostock/d3/blob/master/src/svg/arc.js
 */

var ARC_OFFSET = -(Math.PI / 2); //-halfπ

d3.svg.trapezoid = function(arc)
{
  var innerRadius = arc.innerRadius(),
    outerRadius = arc.outerRadius(),
    startAngle = arc.startAngle(),
    endAngle = arc.endAngle();

  var line = d3.svg.line();

  function trapezoid(d)
  {
    var r0 = innerRadius.apply(this, arguments),
        r1 = outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) + ARC_OFFSET,
        a1 = endAngle.apply(this, arguments) + ARC_OFFSET,
      // da = (a1 < a0 && (da = a0, a0 = a1, a1 = da), a1 - a0),
      // df = da < Math.PI ? '0' : '1',
      c0 = Math.cos(a0),
      s0 = Math.sin(a0),
      c1 = Math.cos(a1),
      s1 = Math.sin(a1);

    var points = [ [r1 * c0, r1 * s0], [r1 * c1, r1 * s1], [r0 * c1, r0 * s1], [r0 * c0, r0 * s0]];
    return line(points);
  }
  return trapezoid;
};


function toDeg(radians){
  return radians * (180 / Math.PI);
}

var chapterColorRef = function(i) {
  return 'chapterColor' + i;
};

var colorGenerator = function(inChapters) {
  var chapters = inChapters;

  function toRgb(colorSet) {
    return 'rgb(' + colorSet[0] + ',' + colorSet[1] + ',' + colorSet[2] + ')';
  }


  function colorDefs() {

    var totalFrames = function (previousVal, colorSet) {
      return previousVal + colorSet[3];
    };

    var zipColors = function(total) {
      return function(colorSet) {
        return [toRgb(colorSet), colorSet[3] / total];
      };
    };

    return chapters.map(function(chapterColors){
      var total = chapterColors.reduce(totalFrames, 0);
      return chapterColors.map(zipColors(total));
    });
  }

  return {
    colorDefs: colorDefs
  };
};

var movieChart = function(data)
{
  //Width and height
  var w = 300;
  var h = 300;
  var dataset = data.durations;
  var outerRadius = w / 2;
  var innerRadius = w / 4;
  var END_ANGLE = 1.8; // of 2Pi

  var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  var trapezoid = d3.svg.trapezoid(arc);
  var pie = d3.layout.pie().endAngle(Math.PI * END_ANGLE).sort(null);

  var dataPie = pie(dataset);

  //Easy colors accessible via a 10-step ordinal scale
  // var color = d3.scale.category10();
  var color = colorGenerator(data.colors);

  //Create SVG element
  var container = document.createElement('div');
  var svg = d3.select(container).append('svg').attr('width', w).attr('height', h);


  var svgDefs = svg.append('svg:defs');
  var colorDefs = color.colorDefs();

  for (var i = 0; i < colorDefs.length; i++) {
    // One gradient per chapter
    var chapter = colorDefs[i];
    var segment = dataPie[i];

    var rot = ((segment.startAngle + segment.endAngle) / 2) + ARC_OFFSET;
    console.log(trapezoid(segment));

    var chapterDef = svgDefs.append('svg:linearGradient')
        .attr('id', chapterColorRef(i))
        .attr('gradientUnits', 'objectBoundingBox')
        .attr('gradientTransform', 'rotate('+ toDeg(rot) + ')');


    var totalOffset = 0;
    for(var j = 0; j < chapter.length; j++) {
      // Two stops per chapter: prevents color blending
      var colorSet = chapter[j];
      var currentColor = colorSet[0],
          currentRatio = colorSet[1];

      chapterDef.append('svg:stop')
            .attr('stop-color', currentColor)
            .attr('offset', totalOffset);

      totalOffset += currentRatio;

      chapterDef.append('svg:stop')
            .attr('stop-color', currentColor)
            .attr('offset', totalOffset);
    }
  }

  //Set up groups
  var arcs = svg.selectAll('g.arc')
    .data(dataPie)
    .enter()
    .append('g')
    .attr('class', 'arc')
    .attr('transform', 'translate(' + outerRadius + ',' + outerRadius + ')');

  //Draw arc paths
  arcs.append('path').attr('fill', function(d, i)
  {
    //return color(i);
    return 'url(#' + chapterColorRef(i) + ')';
  }).attr('d', trapezoid);
  //Labels
  // arcs.append('text').attr('transform', function(d)
  // {
  //   return 'translate(' + arc.centroid(d) + ')';
  // }).attr('text-anchor', 'middle').text(function(d)
  // {
  //   return d.value;
  // });

  return container;
};

var loadChart = function(targetSel)
{
  var target = document.querySelector(targetSel);
  target.innerHtml = '';
  var dataSrc = target.getAttribute('data-src');
  d3.json(dataSrc, function(error, json)
  {
    if (error)
    {
      target.textContent = error;
      return console.warn(error);
    }

    var chart = movieChart(json);
    target.appendChild(chart);
  });
};

loadChart('#serenity-chart');
