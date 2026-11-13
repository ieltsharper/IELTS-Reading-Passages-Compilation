// Tourism topic, Reading Passage 1: where each part of each unit is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file, so a changed source stops the build.
// Sources (owner, 2026-11-13): IELTS_Reading_Passage1_Tourist_Attractions.docx (5 units, the handout's own text
// corrections already made) and IELTS_Tourist_Attractions_One-shot_Answer_Key.docx (UNIT 1–8 for all three
// handouts; Passage 1 = key units 1–5). As before: the Source / Topic lines, the difficulty table and the
// handout's answer table are not shown; the extra answers in the handout's table are accepted (alsoAccept).
const DESTINATIONS = 'Destinations & Heritage Sites';
const MUSEUMS = 'Museums & Cultural Attractions';
const ECOTOURISM = 'Ecotourism & Resorts';
const SPACE = 'Space Tourism';

export default {
  topic: 'Tourism – Passage 1',
  slug: 'tourism-p1',
  numberLabel: 'Unit',
  groups: [DESTINATIONS, MUSEUMS, ECOTOURISM, SPACE],
  keyFormat: 'boxes',
  questionsFile: 'IELTS_Reading_Passage1_Tourist_Attractions.docx',
  keyFile: 'IELTS_Tourist_Attractions_One-shot_Answer_Key.docx',
  passages: [
    {
      unit: 1,
      keyUnit: 1,
      group: DESTINATIONS,
      slug: 'unit-01-bondi-beach',
      title: [8, "Bondi Beach"],
      body: [[11, "A\tBondi Beach, Aus"], [19, "I\t\"They're prepare"]],
      groups: [
        { type: 'tfng', title: [21, "Questions 1–5"], intro: [[22, "Do the following s"], [26, "NOT GIVEN\tif there"]], items: [[27, "1\tThe name of the "], [31, "5\tLiving near Bond"]] },
        { type: 'short', title: [32, "Questions 6–9"], intro: [[33, "Answer the questio"], [34, "Write your answers"]], items: [[35, "6\tAt the end of 19"], [38, "9\tWhat would be da"]] },
        { type: 'gap', title: [39, "Questions 10–13"], intro: [[40, "Complete the follo"], [41, "Write your answers"]], content: [[43, "Bondi beach holds "], [43, "Bondi beach holds "]] },
      ],
    },
    {
      unit: 2,
      keyUnit: 2,
      group: MUSEUMS,
      slug: 'unit-02-museum-blockbuster',
      title: [50, "Museum Blockbuster"],
      body: [[53, "A\tSince the 1980s,"], [60, "H\tPerhaps the best"]],
      groups: [
        { type: 'match', title: [62, "Questions 1–4"], intro: [[63, "The Reading Passag"], [66, "NB You may use any"]], items: [[67, "1\tA reason for cha"], [70, "4\tThere was some c"]], letters: 'ABCDEFGH' },
        // Q7: the handout's table gives "museology / (the new) museology".
        { type: 'gap', title: [71, "Questions 5–8"], intro: [[72, "Complete the follo"], [73, "Write your answers"]], content: [[75, "Instead of being v"], [75, "Instead of being v"]], alsoAccept: { 7: ['the new museology', 'new museology'] } },
        { type: 'multi', title: [77, "Questions 9–10"], intro: [[78, "Choose TWO letters"], [80, "The list below giv"]], items: [[81, "Which TWO advantag"], [86, "E\tBeing beneficial"]], choose: 2, stemWithoutNumbers: true },
        { type: 'multi', title: [88, "Questions 11–13"], intro: [[89, "Choose THREE lette"], [91, "The list below giv"]], items: [[92, "Which THREE disadv"], [98, "F\tExposing staff t"]], choose: 3, stemWithoutNumbers: true },
      ],
    },
    {
      unit: 3,
      keyUnit: 3,
      group: ECOTOURISM,
      slug: 'unit-03-eco-resort-management-practices',
      title: [105, "Eco-Resort Managem"],
      body: [[108, "A\tEcotourism is of"], [116, "D\tWe examined a ca"]],
      subs: [110, 113, 115],
      groups: [
        { type: 'mcq', title: [118, "Questions 1–5"], intro: [[119, "Choose the correct"], [120, "Write your answers"]], items: [[121, "1\tthe Stradbroke b"], [145, "D\tsuccessful imple"]] },
        { type: 'gap', title: [146, "Questions 6–10"], intro: [[147, "Complete the follo"], [148, "Write your answers"]], content: [[150, "Being located away"], [150, "Being located away"]], alsoAccept: { 7: ['bicycles'], 8: ['fan'], 9: ['air-conditioner'], 10: ['mosquito'] } },
        { type: 'multi', title: [152, "Questions 11–13"], intro: [[153, "Choose THREE corre"], [154, "Write your answers"]], items: [[155, "What is true as to"], [160, "E\tits carrying cap"]], choose: 3, stemWithoutNumbers: true },
      ],
    },
    {
      unit: 4,
      keyUnit: 4,
      group: ECOTOURISM,
      slug: 'unit-04-world-ecotourism-in-the-developing-countries',
      title: [167, "World Ecotourism i"],
      body: [[170, "A\tThe Ecotourism S"], [185, "H\tKodai is an ulti"]],
      subs: [171, 177, 180, 182],
      groups: [
        { type: 'match', title: [187, "Questions 1–5"], intro: [[188, "Use the informatio"], [190, "NB You may use any"]], options: [192, "A\tCuba\nB\tEast Afri"], items: [[194, "1\ta place to impro"], [198, "5\ta place where th"]] },
        { type: 'match', title: [199, "Questions 6–9"], intro: [[200, "Use the informatio"], [201, "Write the appropri"]], options: [203, "A\teating the local"], items: [[205, "6\tVisiting the che"], [208, "9\tThe residents in"]] },
        // Q13: the handout shows both the official key's "illegal killing" and the passage's "illegal hunting".
        { type: 'gap', title: [209, "Questions 10–13"], intro: [[210, "Complete the follo"], [211, "Write your answers"]], content: [[213, "Ecotourism is not "], [213, "Ecotourism is not "]], alsoAccept: { 12: ['tropical forest'], 13: ['illegal killing'] } },
      ],
    },
    {
      unit: 5,
      keyUnit: 5,
      group: SPACE,
      slug: 'unit-05-the-final-frontier-for-tourism',
      title: [220, "The Final Frontier"],
      body: [[223, "A\tFor some reason,"], [227, "E\tOther companies "]],
      groups: [
        { type: 'match', title: [229, "Questions 1–5"], intro: [[230, "Reading Passage 1 "], [232, "Write the correct "]], options: [234, "List of Headings\ni"], items: [[236, "1\tParagraph A"], [240, "5\tParagraph E"]] },
        { type: 'match', title: [241, "Questions 6–9"], intro: [[242, "Look at the follow"], [244, "Write the correct "]], items: [[245, "6\tDennis Tito"], [248, "9\tGene Meyers"]], options: [250, "A\ttouched down on "], optionsAfter: true },
        { type: 'tfng', title: [252, "Questions 10–13"], intro: [[253, "Do the following s"], [257, "NOT GIVEN\tif there"]], items: [[258, "10\tBigelow Aerospa"], [261, "13\tAt the moment, "]] },
      ],
    },
  ],
};
