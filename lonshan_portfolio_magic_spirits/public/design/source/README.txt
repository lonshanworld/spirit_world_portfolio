Place your source-of-truth board image here as one of:
source-board.png
source-board.jpg
source-board.jpeg
source-board.webp
source-board.svg
spirits_and_spell_designs.png
spirits_and_spell_designs.jpg
spirits_and_spell_designs.jpeg
spirits_and_spell_designs.webp
spirits_and_spell_designs.svg
spirits_and_magic_seals.svg

If none of those names are used, the extractor will pick the first image file found in this folder.
It also checks the default attachment path:
..\spirits_and_magic_seals.svg

Then run:
npm run design:extract

Optional absolute-path override:
DESIGN_SOURCE="C:\path\to\your\board.png" npm run design:extract

This generates literal extracted assets in:
- public/design/spirits/*.png + *.svg
- public/design/seals/*.png + *.svg
