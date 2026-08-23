// scale card size + radius up on smaller screens so photos stay readable on phones
var vw = window.innerWidth;
var scaleFactor = vw < 480 ? 2.2 : (vw < 900 ? 1.25 : 1);

var radius = Math.round(240 * scaleFactor);
var autoRotate = true; 
var rotateSpeed = -60; 
var imgWidth = Math.round(120 * scaleFactor);
var imgHeight = Math.round(170 * scaleFactor);
var bgMusicURL = 'https://user-images.githubusercontent.com/151072490/283747943-7b08424b-8647-4bdc-996c-965063dbb5e3.mp4';
var bgMusicControls = true; 
var minRadius = Math.round(120 * scaleFactor);
var maxRadius = Math.round(500 * scaleFactor);
setTimeout(init, 1000);
var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid];
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";
function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}
function applyTranform(obj) {
 
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}
function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}
var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}
if (bgMusicURL) {
  document.getElementById('music-container').innerHTML += `
<audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop>    
<p>If you are reading this, it is because your browser does not support the audio element.</p>
</audio>
`;
}
document.onpointerdown = function (e) {
  e = e || window.event;
  // don't hijack rotation when the touch/drag starts on the zoom slider
  if (e.target.closest && e.target.closest('#zoom-container')) {
    return;
  }
  clearInterval(odrag.timer);
  var sX = e.clientX,
      sY = e.clientY;
  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };
  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };
  return false;
};
document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  if (radius < minRadius) radius = minRadius;
  if (radius > maxRadius) radius = maxRadius;
  init(1);
  syncZoomSlider();
};

// ---------- zoom dragger (mobile) ----------
var zoomSlider = document.getElementById('zoom-slider');
if (zoomSlider) {
  zoomSlider.value = radius;
  zoomSlider.addEventListener('input', function () {
    radius = Number(this.value);
    init(1);
  });
  // stop the slider's own drag from bubbling into the carousel rotate handler
  zoomSlider.addEventListener('pointerdown', function (e) {
    e.stopPropagation();
  });
}
function syncZoomSlider() {
  if (zoomSlider) zoomSlider.value = radius;
}

// recompute card size if the phone is rotated
window.addEventListener('resize', function () {
  var newVw = window.innerWidth;
  var newScale = newVw < 480 ? 2.2 : (newVw < 900 ? 1.25 : 1);
  imgWidth = Math.round(120 * newScale);
  imgHeight = Math.round(170 * newScale);
  ospin.style.width = imgWidth + "px";
  ospin.style.height = imgHeight + "px";
  radius = Math.round(240 * newScale);
  minRadius = Math.round(120 * newScale);
  maxRadius = Math.round(500 * newScale);
  ground.style.width = radius * 3 + "px";
  ground.style.height = radius * 3 + "px";
  init(1);
  syncZoomSlider();
  if (zoomSlider) {
    zoomSlider.min = minRadius;
    zoomSlider.max = maxRadius;
  }
});
