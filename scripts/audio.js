Tone.Transport.bpm.value = 90;

var drums = new Tone.MultiPlayer({
			urls : {
				"hihat0" : "../samples/hihat.wav",
        "hihat1" : "../samples/hihat2.wav",
        "hihat2" : "../samples/hihat3.wav",
        "snare0": "../samples/snare.wav",
        "snare1" : "../samples/snare2.wav",
        "snare2" : "../samples/snare3.wav",
        "kick0": "../samples/kick.wav",
        "kick1" : "../samples/kick2.wav",
        "kick2" : "../samples/kick3.wav"
			},
			volume : -10,
			fadeOut : 0.1,
		}).toMaster();

var numSeqPasses = 0;

var loop = new Tone.Sequence(function(time, col) {
  triggerDrums(drumMatrix, time, col);
  if (col === 15) {
      numSeqPasses++;
      realignView(drumMatrix);
  }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

function triggerDrums(drumMatrix, time, col) {
    var column = drumMatrix.matrix[col];
    for (var i = 0; i < column.length; i++) {
      if (column[0] === 1) {
        drums.start('hihat' + audioSettings.hihat, time, 0, "16n", 0, audioSettings.hihatvol)
      }
      if (column[1] === 1) {
        drums.start('snare' + audioSettings.snare, time, 0, "16n", 0, audioSettings.snarevol)
      }
      if (column[2] === 1) {
        drums.start('kick' + audioSettings.kick, time, 0, "16n", 0, audioSettings.kickvol)
      }
    }
    drumMatrix.place = col;
}

function realignView(matrix) {
  matrix.sequence(Tone.Transport.bpm.value * 4)
}
