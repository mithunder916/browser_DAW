const context = new (window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();

// object within which settings are store
var audioSettings = {
  hihat: "0",
  snare: "0",
  kick: "0",
  hihatvol: 7,
  snarevol: 7,
  kickvol: 7
}
// console.log('global', tempo.val)
//defines properties of nx elements
nx.onload = function(){
  drumMatrix.col = 16;
  drumMatrix.row = 3;
  nx.labelSize(70);
  drumVolume.setNumberOfSliders(3)
  drumMatrix.init();
}


// [hiHatSelector, snareSelector, kickSelector]forEach(selector => {
//   selector.onclick = function(e){
//     audioSettings.
//   }
// })

drumVolume.onmouseup = function(e){
  audioSettings.hihatvol = drumVolume.val[0] * 5;
  audioSettings.snarevol = drumVolume.val[1] * 5;
  audioSettings.kickvol = drumVolume.val[2] * 5;
  $('#drumVolume').unbind('mouseleave');
}

drumVolume.onmousedown = function(){
  $('#drumVolume').bind('mouseleave', function (){
    $('body').one('mouseup', function () {
      $('#drumVolume').mouseup()
    })
  })
}

// should try and refactor into one function
hiHatSelector.onclick = function(e){
  audioSettings.hihat = hiHatSelector.val.index.toString();
}
snareSelector.onclick = function(e){
  audioSettings.snare = snareSelector.val.index.toString();
}
kickSelector.onclick = function(e){
  audioSettings.kick = kickSelector.val.index.toString();
}



// var vol0, vol1, vol2, vol3, vol4, vol5 = 0;
// drumVolume.onmouseup = function(e){
//   drumVolume.val.forEach((sliderValue, index) => {
//     var volume = `vol${index}`;
//     volume = sliderValue
//     console.log(volume)
//   })
//   console.log("VOL0", vol0)
//   // console.log(drumVolume.val)
//
// }

// changes global tempo when tempo dial changes
tempo.onmouseup = function(){
  Tone.Transport.bpm.value = tempo.val.value;
  $('#tempo').unbind('mouseleave');
}

// allows mouseup event to trigger even when mouseup is triggered outside of the dial
tempo.onmousedown = function(){
  $('#tempo').bind('mouseleave', function (){
    $('body').one('mouseup', function () {
      $('#tempo').mouseup()
    })
  })
}

$('#startButton').on('click', function(){
  Tone.Transport.start();
  loop.start()
})

$('#stopButton').on('click', function(){
  Tone.Transport.stop()
  drumMatrix.stop()
})
