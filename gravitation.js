let maxDistance;
let spacer = 30;
let targetMouseX = 1;
let targetMouseY = 1;
let easing = 0.5;
let scale = 0.5;

let strokeColor;
let currentColor;
let mouseMultiplier = 0;
let targetMultiplier = 0;
let mouseLerp = 0;
let mousePower = 2;

let multiplierSlider;
let font;
let cnv; 

// Preload font
function preload() {
    font = loadFont('font/Ubuntu-B.ttf');
}

function setup() {
  // Set canvas size
  cnv = createCanvas(1080, 720);
  // Attach listener to canvas for mouseWheel events
  cnv.mouseWheel(changeMultiplier);
  // Calc the largest vector possible based on canvas size
  maxDistance = dist(0, 0, width, height);
  multiplierSlider = createSlider(-1.5, 1.5, 0, 0.05);
  multiplierSlider.position(20, 30);
  multiplierSlider.style('width', width - 40);
  multiplierSlider.class('slider');
  currentColor = color("#6e04a9");
  fill(255);
  strokeColor = color(255);
  fullscreen();
  textFont(font);
}

// MouseWheel callback, increase/decrease targetMultipler based on scroll direction
function changeMultiplier(event) {
  mouseLerp = 0.01;
  if (event.deltaY > 0 && targetMultiplier < 1.5)
    targetMultiplier += 0.1;
  else if (event.deltaY < 0 && targetMultiplier > -1.5)
    targetMultiplier -= 0.1;
  // Update slider with current multiplier
  multiplierSlider.value(-targetMultiplier);
}

// Main draw function
function draw() {
  background(currentColor);

  // trigger a multiplier lerp if slider is modified
  if (targetMultiplier != -multiplierSlider.value()) {
    targetMultiplier = -multiplierSlider.value();
    mouseLerp = 0.01;
  }
  // Lerp towards targetMultiplier
  if (mouseLerp < 1) {
    mouseMultiplier = lerp(mouseMultiplier, targetMultiplier, mouseLerp);
    mouseLerp = (mouseLerp * 1.3); //* (1 + mouseLerp);
  }


  // Ease towards tracked mouse location, speed decays based on distance
  if (abs(mouseX - targetMouseX) > 0.1)
    targetMouseX = targetMouseX + (mouseX - targetMouseX) * easing;
  if (abs(mouseY - targetMouseY) > 0.1)
    targetMouseY = targetMouseY + (mouseY - targetMouseY) * easing;

  // Draw a 2d array of points 
  for (let x = 0; x < width; x += spacer) {
    for (let y = 0; y < height; y += spacer) {
      // Calculate a normalized direction between mouse pointer and current point[x,y]
      let mouseVector = createVector(targetMouseX - x, targetMouseY - y).normalize();
      // Calculate the real distance between mouse pointer and point[x,y]
      let mouseDistance = dist(x, y, targetMouseX, targetMouseY) / spacer;
      // Calculate a scaler roughly based on the square law (anti-grav) = -distance * modifier + distance^2 / constant
      let gravityScaler =  -mouseDistance * mouseMultiplier + pow(mouseDistance, mousePower) / (spacer / 2) ;

      // Calculate a modified x,y, moving the point away from mouse using the gravityScaler 
      let tempX = x - mouseVector.x * 100 * gravityScaler;
      let tempY = y - mouseVector.y * 100 * gravityScaler;
      // Only draw a point if its within canvas bounds
      if ((tempX >= 0 && tempX <= width) && (tempY >= 0 && tempY <= height)) {
        stroke(strokeColor);
        // Modify size of point based on mouseDistance
        strokeWeight(constrain(8/mouseDistance + 4, 4, 8));
        // Draw point
        point(tempX, tempY);
      }
    }
  } 
}

