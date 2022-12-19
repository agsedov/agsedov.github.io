let command = document.querySelectorAll('.command');
const White = 'var(--white)',
   Yellow = 'var(--yellow)',
   Orange = 'var(--orange)',
   Red = 'var(--red)',
   Green = 'var(--green)',
   Blue = 'var(--blue)';
   let a = new Array();
function Color(){
   let i = 0;
   for(i = 1; i<55; i++){
      if(i <= 9){
         a[i] = White;
      }
      else if (i <= 18){
         a[i] = Yellow;
      }
      else if (i<=27){
         a[i] = Orange;
      }
      else if (i<=36){
         a[i] = Red;
      }
      else if(i<=45){
         a[i] = Green;
      }
      else if (i<=54){
         a[i] = Blue;
      }
   }
   Print();
}
function Print(){
   let i = 0,
   str = '';
   for(i = 1; i < 55; i++){
      str = '.block';
      str += String(i);
      block = document.querySelector(str);
      block.style.background = a[i];
   }
}

(function (){
   Color();
   let rotateY = 0,
   rotateX = 0;
   document.onkeydown = function(e){
      if(e.keyCode === 37) rotateY -= 6;
      else if (e.keyCode === 38) rotateX += 6
      else if(e.keyCode ===39) rotateY += 6
      else if (e.keyCode === 40) rotateX -= 6
      document.querySelector('.cube').style.transform = 
      'rotateY(' + rotateY + 'deg)'+
      'rotateX(' + rotateX + 'deg)';
   }
})();
let toggle = document.querySelector('.toggle');
let menu = document.querySelector('.menu');
toggle.onclick = function(){
   menu.classList.toggle('active');
}
function getEventType(event) {
   const log = document.getElementById('log');
   log.innerText = `${event.type}\n${log.innerText}`;
 }

function Rotation(rot){
     let k = 1,
     f = 1;
     if (rot == 'LS'){
      for(let i = 0; i <3; i++){
         	let t = a[k];
            a[k] = a[k + 45];
            a[k + 45] = a[19 - k];
            a[19 - k] = a[36 + k];
            a[36 + k] = t;
            k+=3;
      }
   }
   if (rot == 'L'){
      for(let i = 0; i <3; i++){
         	let t = a[k];
            a[k] = a[k + 36];
            a[k + 36] = a[19 - k];
            a[19 - k] = a[45 + k];
            a[45 + k] = t;
            k+=3;
      }
   }
   if (rot == 'F'){
      for(let i = 0; i <3; i++){
         	let t = a[k + 18];
            a[k + 18] = a[f + 42];
            a[42 + f] = a[37 - k];
            a[37 - k] = a[49 - f];
            a[49 - f] = t;
            k += 3;
            f += 1;
      }
   }
   if (rot == 'FS'){
      for(let i = 0; i <3; i++){
         let t = a[k + 18];
         a[k + 18] = a[49 - f];
         a[49 - f] = a[37 - k];
         a[37 - k] = a[42 + f];
         a[42 + f] = t;
         k += 3;
         f += 1;
   }
   }
   if (rot == 'RS'){
      k += 2;
      for(let i = 0; i <3; i++){
         	let t = a[k];
            a[k] = a[k + 36];
            a[k + 36] = a[19 - k];
            a[19 - k] = a[45 + k];
            a[45 + k] = t;
            k+=3;
      }
   }
   if (rot == 'R'){
      k += 2;
      for(let i = 0; i <3; i++){
         	let t = a[k];
            a[k] = a[k + 45];
            a[k + 45] = a[19 - k];
            a[19 - k] = a[36 + k];
            a[36 + k] = t;
            k+=3;
      }
   }
   if (rot == 'BS'){
      k += 2;
      for(let i = 0; i <3; i++){
         	let t = a[k + 18];
            a[k + 18] = a[f + 42 - 6];
            a[42 + f - 6] = a[37 - k];
            a[37 - k] = a[49 - f + 6];
            a[49 - f + 6] = t;
            k += 3;
            f += 1;
      }
   }
   if (rot == 'B'){
      k += 2;
      for(let i = 0; i <3; i++){
         let t = a[k + 18];
         a[k + 18] = a[49 - f + 6];
         a[49 - f + 6] = a[37 - k];
         a[37 - k] = a[42 + f - 6];
         a[42 + f - 6] = t;
         k += 3;
         f += 1;
   }
   }
   if(rot == 'U'){
      for(i = 0; i<3; i++){
         let t = a[f];
         a[f] = a[f + 18];
         a[f + 18] = a[f + 9];
         a[f + 9]  = a[f + 27];
         a[f + 27] = t;
         f += 1;
      }
   }
   if(rot == 'US'){
      for(i = 0; i<3; i++){
         let t = a[f];
         a[f] = a[f + 27];
         a[f + 27] = a[f + 9];
         a[f + 9]  = a[f + 18];
         a[f + 18] = t;
         f += 1;
      }
   }
   if (rot =='D'){
      f += 6;
      for(i = 0; i<3; i++){
         let t = a[f];
         a[f] = a[f + 27];
         a[f + 27] = a[f + 9];
         a[f + 9]  = a[f + 18];
         a[f + 18] = t;
         f += 1;
      }
   }
   if(rot == 'DS'){
      f += 6;
      for(i = 0; i<3; i++){
         let t = a[f];
         a[f] = a[f + 18];
         a[f + 18] = a[f + 9];
         a[f + 9]  = a[f + 27];
         a[f + 27] = t;
         f += 1;
      }
   }
   Print();
}
let F = document.getElementById("F");
F.onclick = function(){
   Rotation('F');
   document.body.classList.toggle("active");
}
let FS = document.getElementById("FS");
FS.onclick = function(){
   Rotation('FS');
   document.body.classList.toggle("active");
}
let B = document.getElementById("B");
B.onclick = function(){
   Rotation('B');
   document.body.classList.toggle("active");
}
let BS = document.getElementById("BS");
BS.onclick = function(){
   Rotation('BS');
   document.body.classList.toggle("active");
}
let L = document.getElementById("L");
L.onclick = function(){
   Rotation('L');
   document.body.classList.toggle("active");
}
let LS = document.getElementById("LS");
LS.onclick = function(){
   Rotation('LS');
   document.body.classList.toggle("active");
}
let R = document.getElementById("R");
R.onclick = function(){
   Rotation('R');
   document.body.classList.toggle("active");
}
let RS = document.getElementById("RS");
RS.onclick = function(){
   Rotation('RS');
   document.body.classList.toggle("active");
}
let U = document.getElementById("U");
U.onclick = function(){
   Rotation('U');
   document.body.classList.toggle("active");
}
let US = document.getElementById("US");
US.onclick = function(){
   Rotation('US');
   document.body.classList.toggle("active");
}
let D = document.getElementById("D");
D.onclick = function(){
   Rotation('D');
   document.body.classList.toggle("active");
}
let DS = document.getElementById("DS");
DS.onclick = function(){
   Rotation('DS');
   document.body.classList.toggle("active");
}
let reset = document.querySelector(".reset");
reset.onclick = function(){
   Color();
}