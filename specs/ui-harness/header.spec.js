import { lorem } from "js-util/test";

const LONG_HEADER = `
  # Title
  ## H2 My Subtitle of the thing about the thing.
  ---
  Lorem \`ipsum dolor\` sit amet, consectetur adipisicing elit, sed do.

  - One
  - Two
  - Three

  ${ lorem(30) }

  ## Another H2 Section
  ${ lorem(15) }

  ### H3 Section
  ${ lorem(40) }

      <Markdown
            display="block"
            trimIndent={true}>
        { this.props.markdown }
      </Markdown>


  #### H4 Section
  ${ lorem(40) }

  ---
`;



describe("Header", function() {
  this.header(`
  # Title
  ## Subtitle of the thing as a thing.
  ---
  `);

  this.header(LONG_HEADER);


  it("`null`", () => { this.header(null) });
  it("short", () => { this.header("# My Header"); });

  it("title / subtitle (short)", () => {
    this.header(`
      # Title
      ## Subtitle of the thing as a thing.
      ---
    `);
  });

  it("title / subtitle (long)", () => {
    this.header(`
      # Title
      ## Subtitle \`lorem ipsum dolor\` sit amet, ${ lorem(60) }
      ---
    `);
  });

  it("long", () => { this.header(LONG_HEADER); });
});
