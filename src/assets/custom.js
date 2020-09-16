(function custom_auto() {
    console.log("custom_auto: this is called automatically when component imports the file"); 
})()

function custom_test() {
    console.log("custom_test: Hello!!!"); 
}

window.initMethod = function() { console.log("custom: Hello!!!"); }