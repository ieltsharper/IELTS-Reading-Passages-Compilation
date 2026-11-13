// Tourism topic, Reading Passage 3 (two units): see tourism-p1.mjs. Key units 7–8 of the shared key.
const DESTINATIONS = 'Destinations & Heritage Sites';

export default {
  topic: 'Tourism – Passage 3',
  slug: 'tourism-p3',
  numberLabel: 'Unit',
  groups: [DESTINATIONS],
  keyFormat: 'boxes',
  questionsFile: 'IELTS_Reading_Passage3_Tourist_Attractions.docx',
  keyFile: 'IELTS_Tourist_Attractions_One-shot_Answer_Key.docx',
  passages: [
    {
      unit: 1,
      keyUnit: 7,
      group: DESTINATIONS,
      slug: 'unit-01-world-heritage-designation',
      title: [8, "World Heritage Des"],
      body: [[11, "Almost all culture"], [22, "Although the 1972 "]],
      footnotes: [[23, "*The United Nation"], [23, "*The United Nation"]],
      groups: [
        { type: 'match', title: [25, "Questions 28–31"], intro: [[26, "Look at the follow"], [28, "Write the correct "]], items: [[29, "28\tIt has the most"], [32, "31\tThere was inter"]], options: [34, "List of countries\n"], optionsAfter: true },
        { type: 'gap', title: [36, "Questions 32–35"], intro: [[37, "Complete the flowc"], [39, "Write your answers"]], content: [[41, "SITE REGISTRATION\n"], [41, "SITE REGISTRATION\n"]], alsoAccept: { 34: ['1'] } },
        { type: 'match', title: [43, "Questions 36–40"], intro: [[44, "Complete each sent"], [45, "Write the correct "]], items: [[46, "36\tThe Convention "], [50, "40\tCritics of the "]], options: [52, "A\tchanges to or di"], optionsAfter: true },
      ],
    },
    {
      unit: 2,
      keyUnit: 8,
      group: DESTINATIONS,
      slug: 'unit-02-mystery-in-easter-island',
      title: [59, "Mystery in Easter "],
      body: [[62, "A\tOne of the world"], [68, "G\tThe faulty notio"]],
      groups: [
        { type: 'match', title: [70, "Questions 27–30"], intro: [[71, "The reading passag"], [74, "NB There are more "]], options: [76, "List of headings\ni"], items: [[78, "Example: Paragraph"], [83, "30\tParagraph G"]], examplesInItems: true },
        { type: 'tfng', title: [84, "Questions 31–36"], intro: [[85, "Do the following s"], [89, "NOT GIVEN\tif the i"]], items: [[90, "31\tThe first inhab"], [95, "36\tthe theory that"]] },
        // Q38–40: the handout accepts both the key's and the passage's spellings.
        { type: 'gap', title: [96, "Questions 37–40"], intro: [[97, "Complete the follo"], [99, "Write your answers"]], content: [[101, "Many theories spec"], [101, "Many theories spec"]], alsoAccept: { 38: ['racist assumptions'], 39: ['archeological and historical'], 40: ['inhuman behavior'] } },
      ],
    },
  ],
};
