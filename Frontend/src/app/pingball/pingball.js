
(function pingball_autoCalled() {
  console.log('pingball_autoCalled: this is called automatically when component imports the file');
  //console.log('pingball.js:autoCalled: p1 content is: "' + document.getElementById('p1').innerHTML + '"');
})()

function pingball_Test2() {
  console.log("pingball_Test2: " + document.getElementById("p1").innerHTML + '"');
}


console.log("pingball.js: this is called automatically when component imports the file");
//console.log('pingball.js: p = "' + document.getElementById('p1').innerHTML + '"');
