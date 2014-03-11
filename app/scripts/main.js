/*global d3: true */
'use strict';

//http://bl.ocks.org/mbostock/4341417

(function()
{
/**
 * Generates radial isosceles trapezoid - like arc, bud with straight bases
 * Based on d3.svg.arc
 * https://github.com/mbostock/d3/blob/master/src/svg/arc.js
 */

  d3.svg.trapezoid = function(arc)
  {
    var innerRadius = d3_svg_arcInnerRadius,
      outerRadius = d3_svg_arcOuterRadius,
      startAngle = d3_svg_arcStartAngle,
      endAngle = d3_svg_arcEndAngle;

    var line = d3.svg.line();

    var vertices = function(d)
    {
      var r0 = innerRadius.apply(this, arguments),
        r1 = outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) + ARC_OFFSET,
        a1 = endAngle.apply(this, arguments) + ARC_OFFSET,
        c0 = Math.cos(a0),
        s0 = Math.sin(a0),
        c1 = Math.cos(a1),
        s1 = Math.sin(a1);

      return [[r1 * c0, r1 * s0], [r1 * c1, r1 * s1], [r0 * c1, r0 * s1], [r0 * c0, r0 * s0]];
    };

    var trapezoid = function(d)
    {
      var points = vertices(d);
      return line(points);
    };

    var centerPoint = function(a, b, edge) {
      var c = (a + b) / 2;
      var d = Math.abs(a - edge);
      // console.log(c, a+edge);

      return (c - a) / d;



      //var max = Math.max(a, b);

      // var d = Math.abs(a - edge);
      // var p = (c - a) / d;

      // console.log(p);
      // return p;
    };

    var centerPoints = function() {

      var abs = Array.prototype.slice.call(arguments); // [].map.call(arguments, Math.abs);

      console.log('->', abs);

      // Identify bounding box edges
      var lmin = Math.min.apply(this, abs),
          rmax = Math.max.apply(this, abs);
      // absolute length of the bounding box
      var length = rmax - lmin;



      var a = abs[0],
          b = abs[1],
          c = abs[2],
          d = abs[3];

      // Calculate middle points of edges
      var m1 = (a + b) / 2,
          m2 = (c + d) / 2;

      console.log('m1', m1);

      var x1 = Math.abs(m1 - lmin) / length,
          x2 = Math.abs(m2 - lmin) / length;
      console.log(x1, x2);
      return [x1, x2];

    };

    trapezoid.axis = function(data)
    {
      var p = vertices(data);

      /*var x1 = (p[0][0] + p[1][0]) / 2,
        y1 = (p[0][1] + p[1][1]) / 2;

      var x2 = (p[2][0] + p[3][0]) / 2,
        y2 = (p[2][1] + p[3][1]) / 2;*/
      var getDimension = function(i) {
        return function(arr) { return arr[i]; };
      };

      // Grab only X and Y dimensions from the points array
      var xs = p.map(getDimension(0)),
          ys = p.map(getDimension(1));

      // Get relative middle points [x1, x2] and [y1, y2]
      var cx = centerPoints.apply(this, xs),
          cy = centerPoints.apply(this, ys);
      // console.log(cx, cy);
      return d3.zip(cx, cy);

      //return [[x1 - p[0][0], y1 - p[0][1]],
      //        [x2 - p[0][1], y2 - p[2][1]]];
    };

    trapezoid.relativeCentroid = function() {
      var r = (outerRadius.apply(this, arguments) - innerRadius.apply(this, arguments)),
          a = (startAngle.apply(this, arguments) + endAngle.apply(this, arguments)) / 2 + ARC_OFFSET;
      var c = 0.5;
      return [Math.cos(a) * c, Math.sin(a) * c];
    };

    trapezoid.innerRadius = function(v) {
      if (!arguments.length)
        return innerRadius;
      innerRadius = d3.functor(v);
      return trapezoid;
    };

    trapezoid.outerRadius = function(v) {
      if (!arguments.length)
        return outerRadius;
      outerRadius = d3.functor(v);
      return trapezoid;
    };

    trapezoid.startAngle = function(v) {
      if (!arguments.length)
        return startAngle;
      startAngle = d3.functor(v);
      return trapezoid;
    };

    trapezoid.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3.functor(v);
      return trapezoid;
    };

    return trapezoid;
  };

  var ARC_OFFSET = -(Math.PI / 2); //-halfπ

  function d3_svg_arcInnerRadius(d)
  {
    return d.innerRadius;
  }

  function d3_svg_arcOuterRadius(d)
  {
    return d.outerRadius;
  }

  function d3_svg_arcStartAngle(d)
  {
    return d.startAngle;
  }

  function d3_svg_arcEndAngle(d)
  {
    return d.endAngle;
  }
}());

function toDeg(radians)
{
  return radians * (180 / Math.PI);
}

function clamp(a,b,c) {
  return Math.max(b,Math.min(c,a));
}

var chapterColorRef = function(i)
{
  return 'chapterColor' + i;
};

var colorGenerator = function(inChapters)
{
  var chapters = inChapters;

  var toRgb = function(colorSet)
  {
    return 'rgb(' + colorSet[0] + ',' + colorSet[1] + ',' + colorSet[2] + ')';
  };

  var colorDefs = function()
  {

    var totalFrames = function(previousVal, colorSet)
    {
      return previousVal + colorSet[3];
    };

    var zipColors = function(total)
    {
      return function(colorSet)
      {
        return [toRgb(colorSet), colorSet[3] / total];
      };
    };

    return chapters.map(function(chapterColors)
    {
      var total = chapterColors.reduce(totalFrames, 0);
      return chapterColors.map(zipColors(total));
    });
  };

  return {
    colorDefs: colorDefs
  };
};

var preferredValue = function(pref, key) {
  return function(d) {
    return d[key] || pref;
  };
};

var movieChart = function(data, options)
{
  //Width and height
  var w = options.w || 400;
  var h = options.h || 400;
  var dataset = data.durations;
  var motions = data.motions;

  var outerRadius = Math.min(w, h) * 0.4;
  var innerRadius = outerRadius * 0.5;
  var END_ANGLE = 1.8; // of 2Pi

  var motionmax = d3.max(motions);
  var trapezoid = d3.svg.trapezoid()
                  .innerRadius(preferredValue(innerRadius, 'innerRadius'))
                  .outerRadius(preferredValue(outerRadius, 'outerRadius'));
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
  for (var i = 0; i < colorDefs.length; i++)
  {
    // One gradient per chapter
    var chapter = colorDefs[i];
    var segment = dataPie[i];

    var angle = (segment.startAngle + segment.endAngle) / 2 + Math.PI / 2;
    // console.log(trapezoid.relativeCentroid(segment));
    var axis = trapezoid.axis(segment);
    // console.log(axis);
    var chapterDef = svgDefs.append('svg:linearGradient')
      .attr('id', chapterColorRef(i))
      //.attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', axis[0][0])
      .attr('y1', axis[0][1])
      .attr('x2', axis[1][0])
      .attr('y2', axis[1][1]);

      // .attr('gradientTransform', 'rotate('+ (toDeg(angle)) +' 0.5 0.5)');


    var totalOffset = 0;
    for (var j = 0; j < chapter.length; j++)
    {
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
    .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')');

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

  function slide(d, i)
  {
    var m = motions[i],
      segment = d3.select(this);

    var trBase = m * outerRadius,
        duration = clamp(2000 - m * 10000, 500, 2000);

    (function repeat()
    {
      segment.transition()
        .ease('linear')
        .duration(duration)
        .attrTween('d', tweenTrapezoid(function(d, i)
        {
          return {
            innerRadius: innerRadius,
            outerRadius: outerRadius + trBase
          };
        }))
        .transition()
        .attrTween('d', tweenTrapezoid(function(d, i)
        {
          return {

            innerRadius: innerRadius - trBase,
            outerRadius: outerRadius
          };
        }))
        .each('end', repeat);
    })();
  }


  function tweenTrapezoid(b)
  {
    return function(a, i)
    {
      var d = b.call(this, a, i),
        i = d3.interpolate(a, d);
      for (var k in d)
      {
        a[k] = d[k]; // update received data
      }
      return function(t)
      {
        return trapezoid(i(t));
      };
    };
  }


  return container;
};

var loadChart = function(targetSel)
{
  var target = d3.select(targetSel);

  target.html('');
  var dataSrc = target.attr('data-src'),
      w = target.attr('data-w'),
      h = target.attr('data-h');
  d3.json(dataSrc, function(error, json)
  {
    if (error)
    {
      target.textContent = error;
      return console.warn(error);
    }

    var chart = movieChart(json, {w: w, h: h});
    target[0][0].appendChild(chart); //d3 plz
  });
};

loadChart('[data-cinemetrics]');
