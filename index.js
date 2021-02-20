const frame_width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const frame_height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;

var MAX_ITER = 100;
var BAILOUT = 100;
var zoom = 400;
var padding = 20;
var W = frame_width - padding;
var H = frame_height - padding;
var lookAt = { 'x': -0.75, 'y': 0.0 };
var x_min=(lookAt.x - W/2/zoom);
var x_max=(lookAt.x + W/2/zoom);
var y_min=(lookAt.y - H/2/zoom);
var y_max=(lookAt.y + H/2/zoom);

function setCamera(x, y) {
  console.log(zoom);
  lookAt.x = x;
  lookAt.y = y;
  x_min=(lookAt.x - W/2/zoom);
  x_max=(lookAt.x + W/2/zoom);
  y_min=(lookAt.y - H/2/zoom);
  y_max=(lookAt.y + H/2/zoom);
  // console.log({
  //   'lookAt.x': lookAt.x,
  //   'lookAt.y': lookAt.y,
  //   'x_min': x_min,
  //   'x_max': x_max,
  //   'y_min': y_min,
  //   'y_max': y_max
  // });
}

var _palette = [];
function genPalette(n) {
  _palette.length = 0;
  for(let i=0; i<n; i++) {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    _palette.push([r,g,b]);
  }
}

const __palette = [
    [66,  30,  15],
    [25,  7,   26],
    [9,   1,   47],
    [4,   4,   73],
    [0,   7,   100],
    [12,  44,  138],
    [24,  82,  177],
    [57,  125, 209],
    [134, 181, 229],
    [211, 236, 248],
    [241, 233, 191],
    [248, 201, 95],
    [255, 170, 0],
    [204, 128, 0],
    [153, 87,  0],
    [106, 52,  3]];

if(Math.random() < 0.1) {
  _palette=__palette;
} else {
  genPalette(100);
}

function palette(i) {
  return _palette[i % _palette.length];
}

function linear_interp(a, b, t) {
  let cr = (1-t) * a[0] + t * b[0];
  let cg = (1-t) * a[1] + t * b[1];
  let cb = (1-t) * a[2] + t * b[2];
  return [cr,cg,cb];
}

function mandelbrot() {
  let x_min=(lookAt.x - W/2/zoom),
      x_max=(lookAt.x + W/2/zoom),
      y_min=(lookAt.y - H/2/zoom),
      y_max=(lookAt.y + H/2/zoom);

  var canvas = document.getElementById("canvas");
  canvas.width = W;
  canvas.height = H;
  var ctx = canvas.getContext("2d");
  var imgData = ctx.createImageData(W,H);

  let start = end = performance.now();
  for(let h=0; h<H; h++) {
    for(let w=0; w<W; w++) {
      let x0 = w / W * (x_max - x_min) + x_min;
      let y0 = h / H * (y_max - y_min) + y_min;
      var x=0, y=0, xx=0, yy=0, i=0;
      var idx = 4 * (h*W + w);
      while (xx + yy <= BAILOUT && i < MAX_ITER) {
        y = 2*x*y + y0;
        x = xx - yy + x0;
        xx = x*x;
        yy = y*y;
        i++;
      }
      if(i == MAX_ITER) {
        imgData.data[idx+0] = 0;
        imgData.data[idx+1] = 0;
        imgData.data[idx+2] = 0;
        imgData.data[idx+3] = 255;
      } else {
        let log_zn = Math.log(xx + yy)/2;
        let mu = Math.log(log_zn / Math.log(2)) / Math.log(2);
        i = i + 1 - mu;
        let color_idx = Math.floor(i);
        let c = linear_interp(palette(color_idx), palette(color_idx+1), i-Math.floor(i));
        imgData.data[idx+0] = c[0];
        imgData.data[idx+1] = c[1];
        imgData.data[idx+2] = c[2];
        imgData.data[idx+3] = 255;
      }
    }
  }
  ctx.putImageData(imgData,0,0);
  end = performance.now();
  console.log("rendered mandelbrot set in " + (end-start) + " milliseconds.");
}

var canvas = document.getElementById("canvas");
canvas.addEventListener("click", function(event) {
  if(event.shiftKey) {
    zoom *= 2;
  } else if(event.ctrlKey) {
    zoom /= 2;
    if(zoom < 100) {
      zoom = 100;
    }
  }
  render(event.clientX, event.clientY);
});

canvas.addEventListener("wheel", function(event) {
  if(event.deltaY < 0) {
    zoom *= 2;
  } else {
    zoom /= 2;
    if(zoom < 100) {
      zoom = 100;
    }
  }
  render(event.clientX, event.clientY);
});

function render(clientX, clientY) {
  let x = x_min + (clientX / W) * (x_max - x_min);
  let y = y_min + (clientY / H) * (y_max - y_min);
  setCamera(x,y);
  mandelbrot();
}

//mandelbrot(-2.5, 1, -1, 1);
// mandelbrot(-0.75, 0, W, H);
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function go() {
//   while (true) {
//     genPalette(20);
//     mandelbrot(-0.75, 0, W, H);
//     await sleep(1);
//   }
// }

// go();
mandelbrot();

