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
let finished_lerp;
let colors = ["#1B2021", "#112d22", "#450156", "#4c0c0c", "#0f1e4f"];
let mouse_multiplier = 0;
let target_multiplier = 0;
let mouse_lerp = 0;
let mouse_power = 2
let font;
let cnv; 
function preload() {
    font = loadFont('font/Ubuntu-B.ttf');
}

function setup() {
   cnv = createCanvas(displayWidth, displayHeight);
   cnv.mouseWheel(changeMultiplier);
   maxDistance = dist(0, 0, displayWidth, displayHeight);

   currentColor = color(colors[0]);
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
  let tempC = colors.pop();
  reverse(colors);
  colors.push(tempC);
  reverse(colors);
  recolor(colors[0]); 
}

function changeMultiplier(event) {
  mouse_lerp = 0.01;
  if (event.deltaY > 0 && target_multiplier < 1.5)
    target_multiplier += 0.1;
  else if (event.deltaY < 0 && target_multiplier > -1.5)
    target_multiplier -= 0.1;
}

function recolor(c) {
  lerpAmount = 0.01;
  targetColor = color(c); 
}

function draw() {
  background(currentColor);


  if (lerpAmount < 1) {
    currentColor = lerpColor(currentColor, targetColor, lerpAmount);
    lerpAmount = (lerpAmount * colorRate) * (1 + lerpAmount); 
  }
  else
    lerp_finished = true;

  if (mouse_lerp < 1) {
    mouse_multiplier = lerp(mouse_multiplier, target_multiplier, mouse_lerp);
    mouse_lerp = (mouse_lerp * 1.3); //* (1 + mouse_lerp);
  }
  if (abs(mouseX - mx) > 0.1)
    mx = mx + (mouseX - mx) * easing;

  if (abs(mouseY - my) > 0.1)
    my = my + (mouseY - my) * easing;
  for (let x = 0; x < width; x += spacer) {
    for (let y = 0; y < height; y += spacer) {
      let mouseVector = createVector(mx - x, my - y).normalize();
      let mouseDistance = dist(x, y, mx, my) / spacer;
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

