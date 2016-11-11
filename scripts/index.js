const context = new (window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();

// object within which settings are store
var audioSettings = {
  hihat: "0",
  snare: "0",
  kick: "0",
  hihatvol: 5,
  snarevol: 5,
  kickvol: 5,
  rootFreq: 220.0,
  currentScale: modeFunctions.major,
  currentOctave: 3
}

//defines properties of nx elements
nx.onload = function(){
  [bassMatrix, synthMatrix].forEach(matrix => {
    matrix.col = 16;
    matrix.row = 8;
    matrix.init();
  })
  drumMatrix.col = 16;
  drumMatrix.row = 3;
  drumMatrix.init();
  // synthMatrix.col = 16;
  // synthMatrix.row = 8;
  // synthMatrix.init();
  // nx.labelSize(70);
  drumVolume.setNumberOfSliders(3)
}

function accidentalChecker(){
  if ($('#accidentalSelector option:selected').val() === '#') {
    audioSettings.rootFreq *= semiToneRatio;
    synthNotes = audioSettings.currentScale(audioSettings.rootFreq, synthNotes);
  }
  else if ($('#accidentalSelector option:selected').val() === 'b') {
    audioSettings.rootFreq /= semiToneRatio;
    synthNotes = audioSettings.currentScale(audioSettings.rootFreq, synthNotes);
  }
  else {
    synthNotes = audioSettings.currentScale(audioSettings.rootFreq, synthNotes);
  }
}

modeSelector.onchange = function(){
  audioSettings.currentScale = modeFunctions[$('#modeSelector option:selected').val()];
  synthNotes = audioSettings.currentScale(audioSettings.rootFreq, synthNotes)
}

function octaveMod(rootFreq){
  switch (audioSettings.currentOctave){
    case 1: return rootFreq / 4;
    case 2: return rootFreq / 2;
    case 3: return rootFreq;
    case 4: return rootFreq * 2;
    case 5: return rootFreq * 4;
    case 6: return rootFreq * 8;
    default: console.log('octaveMod')
  }
}

// needs to check octave
keySelector.onchange = function(){
  audioSettings.rootFreq = octaveMod(Number($('#keySelector option:selected').val()));
  accidentalChecker();
  console.log(audioSettings.rootFreq, audioSettings.currentOctave)
}

accidentalSelector.onchange = function (){
  accidentalChecker();
}

octaveUp.onclick = function(){
  if (audioSettings.rootFreq <= 1661.24){
    audioSettings.rootFreq *= 2;
    synthNotes = audioSettings.currentScale(audioSettings.rootFreq, synthNotes)
    audioSettings.currentOctave += 1;
  }
}

octaveDown.onclick = function(){
  if (audioSettings.rootFreq >= 110.0){
    audioSettings.rootFreq /= 2;
    synthNotes = audioSettings.currentScale(audioSettings.rootFreq, synthNotes);
    audioSettings.currentOctave -= 1;
  }
}

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
// [hiHatSelector, snareSelector, kickSelector]forEach(selector => {
//   selector.onclick = function(e){
//     audioSettings.
//   }
// })

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
  Tone.Transport.stop();
  [drumMatrix, synthMatrix, bassMatrix].forEach(matrix => matrix.stop())
})
