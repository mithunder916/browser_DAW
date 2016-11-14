// mess with this! don't use the same one
var bassSynth = new Tone.MonoSynth({
    "volume": 7,
    filter:{
        Q: 2,
        type:"lowshelf",
        frequency:200,
        gain: -24,
    },
    filter:{
        type:"lowpass",
        Q: 0.5,
        frequency:10000,
        gain: -24,
    },
    "envelope": {
        "attack": 0.001,
        "decay": 1,
        "sustain": 0.4,
        "release": 0.1,
    },
    "filterEnvelope": {
        "attack": 0.001,
        "decay": 0.31,
        "sustain": 1,
        "baseFrequency": 150,
        "octaves": 2.6
    }
})

var bassGain = new Tone.Volume(1);
bassSynth.chain(bassGain, Tone.Master);

var bassNotes = modeFunctions.major(55.0, bassNotes);

function triggerBass(bassMatrix, time, col) {
    var column = bassMatrix.matrix[col];
    for (var i = 0; i < column.length; i++) {
      if (column[i] === 1){
        bassSynth.triggerAttackRelease(bassNotes[i], "16n", time)
      }
    }
    bassMatrix.place = col;
}
