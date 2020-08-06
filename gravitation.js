let maxDistance;
let spacer = 30;
let grav_max = 2000;
let mx = 1;
let my = 1;
let easing = 0.5;
let scale = 0.5;

let currentColor;
let targetColor;
let lerpAmount = 0;
let colorRate = 1.1;
let x_slider;
let y_slider;
let z_slider;
let finished_lerp;
let color_slider;
let colors = ["#1B2021", "#112d22", "#450156", "#4c0c0c", "#0f1e4f"];
let font;
function preload() {
    font = loadFont('font/Ubuntu-B.ttf');
}

function setup() {
   createCanvas(displayWidth, displayHeight);
   maxDistance = dist(0, 0, displayWidth, displayHeight);

   x_slider = createSlider(0, 1.5, 0, 0.05);
   x_slider.position(20, 20);
   y_slider = createSlider(1, 3, 2);
   y_slider.position(20, 40);
   z_slider = createSlider(25, 50, 30);
   z_slider.position(20, 60);
   color_slider = createSlider(0, 4, 0);
   color_slider.position(20, 80);

   currentColor = color(colors[color_slider.value()]);
   targetColor = currentColor;
   lerp_finished = true;
   fill(255);
   fullscreen();
   textFont(font);
   //textAlign(CENTER);
}

function windowResized() {
    resizeCanvas(displayWidth, displayHeight);
}


function mouseClicked() {
 // let tempC = colors.pop();
 // reverse(colors);
 // colors.push(tempC);
 // reverse(colors);
 recolor(colors[color_slider.value()]); 
}

function recolor(c) {
  lerpAmount = 0.01;
  targetColor = color(c); 
}

function draw() {
  background(currentColor);

  strokeWeight(0);
  text('offset: ' + x_slider.value(), x_slider.width + x_slider.x * 2, x_slider.y + x_slider.height / 2 + 5);
  text('power: ' + y_slider.value(), y_slider.width + y_slider.x * 2, y_slider.y + y_slider.height / 2 + 5);
  text('scale: ' + z_slider.value(), z_slider.width + z_slider.x * 2, z_slider.y + z_slider.height / 2 + 5);
  text('color: ' + colors[color_slider.value()], color_slider.width + color_slider.x * 2, color_slider.y + color_slider.height / 2 + 5);
  
  if (targetColor.value == currentColor.value && lerp_finished) {
    lerp_finished = false;
    recolor(colors[color_slider.value()]); 
  }

  if (lerpAmount < 1) {
    currentColor = lerpColor(currentColor, targetColor, lerpAmount);
    lerpAmount = (lerpAmount * colorRate) * (1 + lerpAmount); 
  }
  else
    lerp_finished = true;
  if (abs(mouseX - mx) > 0.1)
    mx = mx + (mouseX - mx) * easing;

  if (abs(mouseY - my) > 0.1)
    my = my + (mouseY - my) * easing;
  spacer = z_slider.value();
  for (let x = 0; x < width; x += spacer) {
    for (let y = 0; y < height; y += spacer) {
      let mouseVector = createVector(mx - x, my - y).normalize();
      let mouseDistance = dist(x, y, mx, my) / spacer;
      let mouse_multiplier = x_slider.value();
      let mouse_power = y_slider.value();
      let gravity_scaler =  -mouseDistance * mouse_multiplier + pow(mouseDistance, mouse_power) / (spacer / 2) ;
      let t_x = x - mouseVector.x * 100 * gravity_scaler;
      let t_y = y - mouseVector.y * 100 * gravity_scaler;
      if ((t_x >= 0 && t_x <= width) && (t_y >= 0 && t_y <= height)) {
        let strokeAlpha = 255;
        let strokeColor = color(255,255,255, strokeAlpha);
        stroke(strokeColor);
        strokeWeight(constrain(4/mouseDistance + 2, 2, 4));
        if (strokeAlpha > 1) {
          point(t_x, t_y);
          }
      }
    }
  } 
}

