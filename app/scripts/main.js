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

  function vertices(d)
  {
    var r0 = d.innerRadius,
        r1 = d.outerRadius,
        a0 = startAngle.apply(this, arguments) + ARC_OFFSET,
        a1 = endAngle.apply(this, arguments) + ARC_OFFSET,
      // da = (a1 < a0 && (da = a0, a0 = a1, a1 = da), a1 - a0),
      // df = da < Math.PI ? '0' : '1',
        c0 = Math.cos(a0),
        s0 = Math.sin(a0),
        c1 = Math.cos(a1),
        s1 = Math.sin(a1);

    return [ [r1 * c0, r1 * s0], [r1 * c1, r1 * s1], [r0 * c1, r0 * s1], [r0 * c0, r0 * s0]];
  }

  function trapezoid(d)
  {
    var points = vertices(d);
    // console.log(points);
    return line(points);
  }

  trapezoid.axis = function(d) {
    var p = vertices(d),
        r0 = innerRadius.apply(this, arguments);

    var x1 = (p[0][0] + p[1][0]) / 2,
        y1 = (p[0][1] + p[1][1]) / 2;

    var x2 = (p[2][0] + p[3][0]) / 2,
        y2 = (p[2][1] + p[3][1]) / 2;

    return [ [x1, y1], [x2, y2] ];
  };

  trapezoid.translate = function(d, volume) {
    var a0 = startAngle.apply(this, arguments) + ARC_OFFSET,
        a1 = endAngle.apply(this, arguments) + ARC_OFFSET;
    var middle = (a0 + a1) / 2;
    var sx = Math.cos(middle),
        sy = Math.sin(middle);

    var v = volume;

    return [sx * v, sy * v];
  };

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
  var w = 400;
  var h = 400;
  var dataset = data.durations;
  var motions = data.motions;

  var rratio = 0.35;
  var outerRadius = w * rratio;
  var innerRadius = w * rratio / 2;
  var END_ANGLE = 1.8; // of 2Pi

  var motionmax = d3.max(motions);
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

  // TODO: this should be totally reimplemented with data bindings
  for (var i = 0; i < colorDefs.length; i++) {
    // One gradient per chapter
    var chapter = colorDefs[i];
    var segment = dataPie[i];

    var axis = trapezoid.axis(segment);

    var chapterDef = svgDefs.append('svg:linearGradient')
        .attr('id', chapterColorRef(i))
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', axis[0][0])
        .attr('y1', axis[0][1])
        .attr('x2', axis[1][0])
        .attr('y2', axis[1][1]);
        // .attr('gradientTransform', 'rotate('+ toDeg(rot) + ')');


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

  var topGroup = svg.append('g')
      .attr('transform', 'translate('+ w/2 + ',' + h/2 +')');

  //Set up groups
  var segmentGroups = topGroup.selectAll('g.segment')
    .data(dataPie)
    .enter()
    .append('g')
    .attr('class', 'segment');

  // paths
  var segments = segmentGroups.append('path').attr('fill', function(d, i)
  {
    //return color(i);
    return 'url(#' + chapterColorRef(i) + ')';
  }).attr('d', trapezoid)
    .transition()
      //.delay(function(d) { return d * 40; })
      .each(slide);

  function slide(d, i) {
    var m = motions[i],
        segment = d3.select(this);

    var tr = trapezoid.translate(d, m * innerRadius *3);


    (function repeat() {
      segment.transition()
          .ease('sin')
          .duration(m*10000)
          .attrTween('d', tweenTrapezoid(function(d, i) {
            return {
              innerRadius: (innerRadius + outerRadius) / 2,
              outerRadius: (innerRadius + outerRadius)
            };
          }))
        .transition()
          .attrTween('d', tweenTrapezoid(function(d, i) {
            return {
              innerRadius: innerRadius,
              outerRadius: outerRadius
            };
          }))
          .each('end', repeat);
    })();
  }


  function tweenTrapezoid(b) {
    return function(a, i) {
      var d = b.call(this, a, i),
          i = d3.interpolate(a, d);
      for (var k in d) {
        a[k] = d[k]; // update received data
      }
      return function(t) {
        return trapezoid(i(t));
      };
    };
  }


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
