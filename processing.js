var durations = [
						195554,
						163457,
						191473,
						130050,
						125278,
						145545,
						73074,
						117182,
						172878,
						216381,
						113119,
						145347,
						110967,
						132264,
						109457,
						125616,
						130839,
						251708,
						163769,
						148711,
						168234,
						150188,
						243006
					];
	 
var colors = [
	[
		[8, 8, 8, 406], [36, 28, 33, 215], [55, 58, 73, 88], [70, 105, 146, 22], [105, 146, 159, 39], [149, 136, 117, 27], [92, 92, 92, 78], [159, 81, 61, 14], [85, 27, 25, 54], [173, 188, 189, 57]
	],
	[
		[11, 9, 15, 365], [20, 24, 40, 150], [38, 50, 74, 49], [33, 30, 34, 129], [45, 41, 47, 106], [89, 90, 91, 59], [68, 107, 152, 19], [114, 137, 154, 28], [172, 174, 180, 43], [69, 65, 65, 52]
	],
	[
		[15, 11, 15, 268], [36, 24, 30, 221], [47, 40, 48, 135], [68, 65, 83, 75], [84, 80, 100, 91], [86, 100, 146, 52], [130, 122, 136, 32], [186, 188, 200, 20], [44, 52, 78, 53], [80, 37, 30, 53]
	],
	[
		[19, 15, 11, 173], [35, 25, 19, 163], [48, 38, 24, 155], [84, 75, 56, 78], [64, 57, 52, 79], [51, 50, 43, 111], [95, 98, 88, 157], [134, 129, 118, 29], [114, 136, 118, 28], [163, 173, 159, 27]
	],
	[
		[34, 21, 14, 161], [50, 40, 24, 158], [73, 52, 41, 84], [82, 72, 52, 106], [54, 48, 44, 126], [145, 111, 99, 30], [115, 114, 142, 45], [183, 163, 173, 43], [96, 84, 94, 183], [64, 60, 70, 64]
	],
	[
		[20, 20, 20, 350], [48, 48, 48, 228], [74, 74, 74, 153], [95, 95, 95, 89], [114, 114, 114, 65], [129, 129, 129, 54], [142, 142, 142, 37], [155, 155, 155, 15], [178, 178, 178, 9]
	],
	[
		[32, 40, 32, 202], [47, 73, 51, 86], [87, 73, 53, 135], [143, 111, 89, 46], [91, 96, 88, 138], [112, 134, 126, 43], [159, 159, 149, 35], [77, 56, 37, 85], [42, 79, 82, 133], [38, 56, 72, 88]
	],
	[
		[19, 19, 11, 197], [40, 29, 16, 163], [50, 38, 18, 161], [83, 49, 19, 132], [105, 74, 43, 80], [150, 87, 38, 80], [161, 112, 75, 61], [190, 144, 92, 48], [186, 166, 148, 42], [87, 82, 77, 36]
	],
	[
		[8, 8, 8, 451], [47, 47, 47, 143], [79, 79, 79, 92], [110, 110, 110, 65], [127, 129, 129, 1], [149, 149, 149, 78], [201, 200, 202, 19], [94, 97, 98, 59], [62, 63, 66, 1], [31, 27, 41, 91]
	],
	[
		[16, 15, 10, 199], [40, 33, 24, 144], [73, 57, 47, 64], [79, 70, 57, 87], [51, 47, 43, 141], [143, 108, 101, 51], [121, 120, 154, 49], [166, 163, 185, 53], [96, 84, 88, 158], [57, 60, 73, 54]
	],
	[
		[94, 47, 32, 130], [94, 71, 50, 97], [148, 87, 56, 55], [156, 111, 88, 281], [192, 143, 110, 114], [205, 166, 147, 88], [208, 173, 156, 59], [123, 125, 137, 49], [111, 115, 141, 55], [74, 68, 64, 72]
	],
	[
		[9, 10, 11, 240], [77, 49, 35, 100], [42, 36, 34, 264], [74, 67, 62, 87], [98, 90, 90, 86], [151, 102, 73, 42], [177, 144, 107, 37], [158, 160, 159, 71], [201, 202, 194, 54], [114, 130, 142, 19]
	],
	[
		[20, 28, 24, 161], [49, 85, 74, 161], [100, 90, 28, 113], [89, 42, 11, 92], [147, 95, 43, 67], [68, 144, 81, 59], [158, 147, 74, 62], [83, 151, 149, 92], [114, 108, 144, 85], [160, 166, 154, 108]
	],
	[
		[11, 8, 16, 337], [16, 21, 40, 250], [31, 47, 79, 89], [50, 77, 92, 47], [74, 99, 150, 37], [104, 145, 176, 17], [148, 125, 102, 20], [77, 80, 76, 25], [39, 32, 31, 162], [182, 189, 192, 16]
	],
	[
		[11, 15, 17, 212], [29, 35, 35, 179], [45, 48, 44, 147], [63, 66, 62, 95], [90, 98, 95, 157], [98, 119, 142, 22], [127, 135, 135, 15], [147, 143, 119, 44], [153, 154, 152, 92], [202, 213, 214, 37]
	],
	[
		[13, 15, 13, 174], [42, 37, 30, 245], [69, 64, 53, 101], [99, 100, 96, 188], [138, 116, 102, 48], [154, 140, 112, 50], [158, 155, 150, 85], [115, 144, 149, 34], [112, 123, 128, 19], [208, 205, 202, 56]
	],
	[
		[33, 35, 19, 243], [88, 57, 26, 130], [97, 78, 39, 116], [144, 92, 40, 50], [76, 50, 12, 173], [150, 116, 78, 80], [165, 144, 103, 57], [106, 136, 111, 16], [182, 176, 150, 57], [75, 89, 65, 78]
	],
	[
		[19, 15, 11, 121], [38, 30, 26, 199], [72, 55, 48, 73], [138, 114, 102, 33], [152, 140, 116, 34], [119, 127, 173, 30], [166, 179, 198, 58], [97, 85, 86, 146], [69, 61, 65, 115], [50, 44, 45, 191]
	],
	[
		[33, 19, 13, 213], [85, 44, 21, 229], [108, 76, 44, 166], [141, 87, 45, 25], [39, 70, 75, 61], [92, 126, 148, 38], [162, 144, 108, 42], [146, 110, 82, 84], [101, 94, 87, 88], [187, 175, 159, 54]
	],
	[
		[42, 35, 22, 202], [86, 49, 24, 242], [105, 75, 41, 128], [148, 89, 44, 73], [179, 79, 29, 45], [159, 117, 75, 119], [192, 150, 94, 90], [91, 163, 171, 13], [217, 200, 161, 74], [63, 81, 78, 14]
	],
	[
		[16, 15, 17, 176], [43, 53, 75, 77], [78, 68, 69, 105], [138, 132, 134, 41], [97, 111, 149, 32], [144, 102, 84, 36], [97, 90, 89, 123], [43, 34, 33, 215], [80, 49, 36, 160], [174, 182, 182, 35]
	],
	[
		[14, 10, 10, 144], [42, 28, 26, 182], [73, 52, 47, 96], [148, 110, 98, 41], [87, 100, 153, 62], [135, 133, 157, 53], [175, 168, 182, 45], [95, 83, 90, 139], [65, 59, 77, 93], [52, 42, 44, 145]
	],
	[
		[46, 38, 41, 111], [81, 81, 47, 79], [103, 118, 54, 274], [89, 108, 44, 301], [177, 86, 47, 24], [110, 140, 72, 30], [159, 149, 81, 20], [103, 106, 76, 70], [70, 54, 54, 81], [134, 132, 152, 10],
	]
];

var motions = [
	0.0390211272078,
	0.106393015166,
	0.169737746142,
	0.0845930817455,
	0.0831516372148,
	0.089441526071,
	0.131592949927,
	0.0617178385674,
	0.0844390335728,
	0.109191555663,
	0.245246501658,
	0.179778906603,
	0.0842190596213,
	0.0525412841665,
	0.113387241145,
	0.0948028286524,
	0.136915883796,
	0.145307150099,
	0.0970977737179,
	0.111546159854,
	0.0730158208269,
	0.12596121818,
	0.193470763026
];


var x0;
var y0;

var angles;
//var motions;

var SCALE = 2.0;
var RADIUS = 70 * SCALE;
var AMPLITUDE = 8 * SCALE;
var THICKNESS = 35 * SCALE;


void setup() {
  size(400, 400-35);
  frameRate(20);
  
  x0 = width / 2;
  y0 = height / 2 + 20; //+ 35;
  
  //motions = new Array(durations.length);
  for (var i = 0; i < durations.length; i++) {
	motions[i] = motions[i] * 5;
  }
  
  var total_duration = 0
  for (var i = 0; i < durations.length; i++) {
	total_duration += durations[i];
  }
  
  angles = new Array(durations.length);
  total_angle = 0.925 * TWO_PI;
  angle_counter = 0;
  for (var i = 0; i < durations.length; i++) {
	var a = total_angle * (durations[i] / total_duration);
	angles[i] = angle_counter + a;
	angle_counter += a;
  }
}


void draw() {
  background(230);
  
  // performance optimization:
  var frm_cnt = 0.15 * frameCount;
  
  for (var i = 0; i < angles.length; i++) {
	var total_offset = 0;
	var color_list = colors[i];
	
	for (c = 0; c < color_list.length; c++) {
		var r = RADIUS - total_offset;
		r += (motions[i] * AMPLITUDE) * sin(frm_cnt * motions[i]);
		
		var color = color_list[c];
		var offset = (color[3] / 1000) * THICKNESS;
		
		var x1, y1, x3, y3;
		var angle_1, angle_2;
		if (i == 0) {
			angle_1 = 0;
		}
		else {
			angle_1 = angles[i-1];
		}
		angle_2 = angles[i];
		
		// performance optimization:
		var sin1 = sin(angle_1);
		var cos1 = cos(angle_1);
		var sin2 = sin(angle_2);
		var cos2 = cos(angle_2);
		
		x1 = x0 + (r * sin1);
		y1 = y0 - (r * cos1);
		x3 = x0 + ((r-offset) * sin1);
		y3 = y0 - ((r-offset) * cos1);

		var x2 = x0 + (r * sin2);
		var y2 = y0 - (r * cos2);
		var x4 = x0 + ((r-offset) * sin2);
		var y4 = y0 - ((r-offset) * cos2);
		
		fill(color[0], color[1], color[2]);
		noStroke();

		beginShape(QUADS);
		vertex(x1, y1);
		vertex(x3, y3);
		vertex(x4, y4);
		vertex(x2, y2);
		endShape(CLOSE);
		
		total_offset += offset;
	}
  }
}
