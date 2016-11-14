// first arg is starting frequency (key), second arg is number of semitones from root
const semiToneRatio = Math.pow(2,1/12);
function noteSetter(rootFreq, distanceFromRoot){
  // const semiToneRatio = Math.pow(2,1/12);
  while (distanceFromRoot > 0){
    rootFreq *= semiToneRatio
    distanceFromRoot--;
  }
  return rootFreq;
}

// functions that will fill an array with values corresponding to that scale
var modeFunctions = {
  major: function majorMode(rootFreq, scaleArray){
    scaleArray = [];
    scaleArray.push(noteSetter(rootFreq, 0),noteSetter(rootFreq, 2), noteSetter(rootFreq, 4), noteSetter(rootFreq, 5), noteSetter(rootFreq, 7), noteSetter(rootFreq, 9), noteSetter(rootFreq, 11), noteSetter(rootFreq, 12))
    return scaleArray;
  },

  dorian: function dorianMode(rootFreq, scaleArray){
    scaleArray = [];
    scaleArray.push(noteSetter(rootFreq, 0),noteSetter(rootFreq, 2), noteSetter(rootFreq, 3), noteSetter(rootFreq, 5), noteSetter(rootFreq, 7), noteSetter(rootFreq, 9), noteSetter(rootFreq, 10), noteSetter(rootFreq, 12))
    return scaleArray;
  },

  phyrgian: function phrygianMode(rootFreq, scaleArray){
    scaleArray = [];
    scaleArray.push(noteSetter(rootFreq, 0),noteSetter(rootFreq, 1), noteSetter(rootFreq, 3), noteSetter(rootFreq, 5), noteSetter(rootFreq, 7), noteSetter(rootFreq, 8), noteSetter(rootFreq, 10), noteSetter(rootFreq, 12))
    return scaleArray;
  },

  lydian: function lydianMode(rootFreq, scaleArray){
    scaleArray = [];
    scaleArray.push(noteSetter(rootFreq, 0),noteSetter(rootFreq, 2), noteSetter(rootFreq, 4), noteSetter(rootFreq, 6), noteSetter(rootFreq, 7), noteSetter(rootFreq, 9), noteSetter(rootFreq, 11), noteSetter(rootFreq, 12))
    return scaleArray;
  },

  mixolydian: function mixolydianMode(rootFreq, scaleArray){
    scaleArray = [];
    scaleArray.push(noteSetter(rootFreq, 0),noteSetter(rootFreq, 2), noteSetter(rootFreq, 4), noteSetter(rootFreq, 5), noteSetter(rootFreq, 7), noteSetter(rootFreq, 9), noteSetter(rootFreq, 10), noteSetter(rootFreq, 12))
    return scaleArray;
  },

  minor: function minorMode(rootFreq, scaleArray){
    scaleArray = [];
    scaleArray.push(noteSetter(rootFreq, 0),noteSetter(rootFreq, 2), noteSetter(rootFreq, 3), noteSetter(rootFreq, 5), noteSetter(rootFreq, 7), noteSetter(rootFreq, 8), noteSetter(rootFreq, 10), noteSetter(rootFreq, 12))
    return scaleArray;
  },

  locrian: function locrianMode(rootFreq, scaleArray){
    scaleArray = [];
    scaleArray.push(noteSetter(rootFreq, 0),noteSetter(rootFreq, 1), noteSetter(rootFreq, 3), noteSetter(rootFreq, 5), noteSetter(rootFreq, 6), noteSetter(rootFreq, 8), noteSetter(rootFreq, 10), noteSetter(rootFreq, 12))
    return scaleArray;
  }
}

// creates synth instrument
var polySynth = new Tone.PolySynth(6, Tone.Synth, {
  "oscillator" : {
    "partials" : [0, 2, 3, 4],
  },
  "volume": 3
});

// effects; will only be connected when button events are triggered
var bitcrusher = new Tone.BitCrusher({
  "bits": 8,
  "wet": 0
  }).toMaster();

var freeverb = new Tone.Freeverb({
  "roomSize": 0.75,
  "dampening": 2000,
  "wet": 0
  }).toMaster();

var autofilter = new Tone.AutoFilter({
  "frequency": 3,
  "wet": 0,
  "type": "sine",
  "depth": 1,
  "baseFrequency": 200,
  "octaves": 3.6,
  "filter": {
    "type": "lowpass",
    "rolloff": -12,
    "Q": 4
  }
}).toMaster();

var phaser = new Tone.Phaser({
  "frequency" : 0.2,
	"octaves" : 5,
	"baseFrequency" : 200,
  "Q": 15,
  "wet": 0
}).toMaster();

var chorus = new Tone.Chorus({
  "frequency": 2.5,
  "delayTime": 0.5,
  "depth": 1,
  "feedback": 0.3,
  "wet": 0
}).toMaster();


polySynth.chain(bitcrusher, autofilter, phaser, chorus, freeverb, Tone.Master);

// initializes with major scale from root A3
var synthNotes = modeFunctions.major(220.0, synthNotes);
// console.log("STARTING NOTES", synthNotes)

function triggerSynth(synthMatrix, time, col) {
    var column = synthMatrix.matrix[col];
    for (var i = 0; i < column.length; i++) {
      if (column[i] === 1){
        polySynth.triggerAttackRelease(synthNotes[i], "16n", time)
      }
    }
    synthMatrix.place = col;
}
