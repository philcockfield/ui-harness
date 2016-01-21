import { lorem } from "./util";

const LONG_MARKDOWN = `
  # Title
  ## H2 My Subtitle of the thing about the thing.
  ---
  Lorem \`ipsum dolor\` sit amet, consectetur adipisicing elit, sed do.

  - One
  - Two
  - Three


  Text: ${ lorem(30) }

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

`;



describe("Header/Footer", function() {
  this.header(`
  # Title
  ## Subtitle of \`the\` component.
  ---
  `);
  // this.header(LONG_MARKDOWN);
  this.footer(LONG_MARKDOWN);

  it("`null`", () => {
    this.header(null);
    this.footer(null);
  });

  const contentOptions = (method) => {
    it("title only <h1>", () => { method("# My Header"); });
    it("subtitle only <h2>", () => { method(`## ${ lorem(10) } \n---`); });
    it("title `.hr(true)`", () => { method(`# My Title`).hr(true) });
    it("subtitle `.hr(true)`", () => { method(`## ${ lorem(10) }`).hr(true) });
    it("subtitle ---`.hr(true)`", () => { method(`## ${ lorem(10) }\n---`).hr(true) });
    it("subtitle ---`.hr(false)`", () => { method(`## ${ lorem(10) }\n---`).hr(false) });

    it("title / subtitle (short)", () => {
      method(`
      # Title
      ## Subtitle of the thing as a thing.
      ---
      `);
    });

    it("title / subtitle (long)", () => {
      method(`
        # Title
        ## Subtitle \`lorem ipsum dolor\` sit amet, ${ lorem(60) }
        ---
      `);
    });

    it("long", () => { method(LONG_MARKDOWN); });
    it("long `.hr(true)`", () => { method(LONG_MARKDOWN).hr(true); });
    it("long `.hr(false)`", () => { method(LONG_MARKDOWN).hr(false); });
  };

  section("header", () => contentOptions(this.header));
  section("footer", () => contentOptions(this.footer));


  section("backdrop", () => {
    it("`backdrop:0`", () => { this.backdrop(0) });
    it("`backdrop:0.6`", () => { this.backdrop(0.6) });
    it("`backdrop:1`", () => { this.backdrop(1) });
    it("`backdrop:red`", () => { this.backdrop("red") });
  });
});
