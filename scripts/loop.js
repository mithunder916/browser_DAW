var numSeqPasses = 0;

var loop = new Tone.Sequence(function(time, col) {
  triggerDrums(drumMatrix, time, col);
  triggerSynth(synthMatrix, time, col);
  triggerBass(bassMatrix, time, col)

  if (col === 15) {
      numSeqPasses++;
      realignView(drumMatrix);
      realignView(synthMatrix);
      realignView(bassMatrix);
  }
}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

function realignView(matrix) {
  matrix.sequence(Tone.Transport.bpm.value * 4)
}
