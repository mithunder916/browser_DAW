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
  bassvol: 3,
  rootFreq: 220.0,
  bassFreq: 55.0,
  currentScale: modeFunctions.major,
  currentOctave: 3,
  effects: {
    bitcrusher: "off",
    freeverb: "off",
    autofilter: "off",
    phaser: "off",
    chorus: "off"
  }
}

//defines properties of nx elements
nx.onload = function(){
  [bassMatrix, synthMatrix].forEach(matrix => {
    matrix.col = 32;
    matrix.row = 8;
  })
  synthMatrix.init();
  bassMatrix.colors.accent = "#58C278"
  bassMatrix.init();
  drumMatrix.col = 32;
  drumMatrix.row = 3;
  drumMatrix.colors.accent = "#87DEFF";
  drumMatrix.init();
  drumVolume.colors.accent = "#35C9FF";
  drumVolume.setNumberOfSliders(3)
  bassVolume.colors.accent = "#58C278";
  bassVolume.init()
  hiHatSelector.colors.accent = "#3BB9FF"
  hiHatSelector.font = "open sans"
  hiHatSelector.init();
  snareSelector.colors.accent = "#3BB9FF"
  snareSelector.init();
  kickSelector.colors.accent = "#3BB9FF"
  kickSelector.init();

  volume.colors.accent = "#FFC51F"
  tempo.colors.accent = "#FFC51F"
  volume.init();
  tempo.init();
  // [hiHatSelector, snareSelector, kickSelector].forEach(tab => {
  //   console.log("TAB", tab)
  //   tab.colors.accent = "#3891FF";
  //   tab.init();
  // })
}

//effects handlers; function takes a Tone.js effect and a button, and changes the wet signal and button color when the effect is turned on/off
function effectHandler(effect, effectSelector){
  let effectString = `${effect}`.toLowerCase();
  if (audioSettings.effects[effectString] === "off"){
    effect.wet.value = 0.8;
    audioSettings.effects[effectString] = "on";
    effectSelector.style.backgroundColor = '#ff5500';
  } else {
    effect.wet.value = 0;
    audioSettings.effects[effectString] = "off"
    effectSelector.style.backgroundColor = 'white'
  }
}

bitcrusherSelect.onclick = function(){
  effectHandler(bitcrusher, bitcrusherSelect)
}

freeverbSelect.onclick = function(){
  effectHandler(freeverb, freeverbSelect)
}

autofilterSelect.onclick = function(){
  effectHandler(autofilter, autofilterSelect)
}

phaserSelect.onclick = function(){
  effectHandler(phaser, phaserSelect)
}

chorusSelect.onclick = function(){
  effectHandler(chorus, chorusSelect)
}

function accidentalChecker(){
  if ($('#accidentalSelector option:selected').val() === '#') {
    audioSettings.rootFreq *= semiToneRatio;
    audioSettings.bassFreq *= semiToneRatio;
  } else if ($('#accidentalSelector option:selected').val() === 'b') {
    audioSettings.rootFreq /= semiToneRatio;
    audioSettings.bassFreq /= semiToneRatio;
  }

  synthNotes = audioSettings.currentScale(audioSettings.rootFreq, synthNotes);
  bassNotes = audioSettings.currentScale(audioSettings.bassFreq, bassNotes);
}

modeSelector.onchange = function(){
  audioSettings.currentScale = modeFunctions[$('#modeSelector option:selected').val()];
  synthNotes = audioSettings.currentScale(audioSettings.rootFreq, synthNotes);
  bassNotes = audioSettings.currentScale(audioSettings.bassFreq, bassNotes);
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
  audioSettings.bassFreq = audioSettings.rootFreq / 4;
  accidentalChecker();
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

bassVolume.onmouseup = function(){
  bassGain.volume.value = bassVolume.val.value;
  $('#bassVolume').unbind('mouseleave');
}

bassVolume.onmousedown = function(){
  $('#bassVolume').bind('mouseleave', function (){
    $('body').one('mouseup', function () {
      $('#bassVolume').mouseup()
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

volume.onmouseup = function(){
  Tone.Master.volume.value = volume.val.value;
  $('#volume').unbind('mouseleave');
}

volume.onmousedown = function(){
  $('#volume').bind('mouseleave', function (){
    $('body').one('mouseup', function () {
      $('#volume').mouseup()
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
