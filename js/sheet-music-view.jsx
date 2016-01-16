var React = require('react');
var ReactDOM = require('react-dom');

/**
 * Visual display of a snippet of sheet music (wraps an engraving library)
 */
class SheetMusicView extends React.Component {
  constructor(props) {
    super(props);

    // Prebind custom methods
    this.drawMusic = this.drawMusic.bind(this);
  }

  componentDidMount() {
    this.drawMusic();
  }

  componentDidUpdate(prevProps, prevState) {
    this.drawMusic();
  }

  /**
   * Redraw the contents of the canvas
   */
  drawMusic() {
    // Clear the canvas
    var container = ReactDOM.findDOMNode(this);
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }

    // Prepare drawing objects
    var renderer = new Vex.Flow.Renderer(
      container,
      Vex.Flow.Renderer.Backends.SVG
    );
    var ctx = renderer.getContext();
    ctx.resize(this.props.width, this.props.height);

    // Set up and draw stave/clef/key
    var stave = new Vex.Flow.Stave(0, 0, this.props.width-1);
    stave.addClef(this.props.clef);
    var keySig = new Vex.Flow.KeySignature(this.props.keySignature);
        keySig.addToStave(stave);
    stave.setContext(ctx).draw();

    // Create the notes
    var notes = [
      new Vex.Flow.StaveNote({ clef: this.props.clef, keys: this.props.keys, duration: "q" }),
    ];

    // Create a voice in 1/4
    var voice = new Vex.Flow.Voice({
      num_beats: 1,
      beat_value: 4,
      resolution: Vex.Flow.RESOLUTION
    });

    // Add notes to voice
    voice.addTickables(notes);

    // Format and justify the notes to 500 pixels
    var formatter = new Vex.Flow.Formatter().
      joinVoices([voice]).format([voice], (this.props.width-1)/2);

    // Render voice
    voice.draw(ctx, stave);
  }

  render() {
    return (
      <div className="rx-sheet-music-view"></div>
    );
  }
}
SheetMusicView.defaultProps = {
  width: 150,
  height: 125,
  clef: "treble"
};
module.exports = SheetMusicView;