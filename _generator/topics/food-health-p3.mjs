// Food & Health topic, Reading Passage 3: where each part of each unit is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file (after the fixes below), so a changed source stops the build.
// Sources (owner, 2026-11-09): IELTS_Reading_Passage3_Food_Health.docx and
// Giai_chi_tiet_Food_Health_Passage3_Unit1-6.docx (key: BƯỚC 1–3 with an answer box per question).
// As for Environment: the Source / Topic / Key-source lines and the difficulty table are not shown; the key's notes
// go in the collapsed "Hướng dẫn One-Shot"; the key's alternatives are accepted.
const FOOD_DIET = 'Food & Diet';
const BODY_MIND = 'Body, Mind & Development';
const PUBLIC_HEALTH = 'Public Health';

export default {
  topic: 'Food & Health – Passage 3',
  slug: 'food-health-p3',
  numberLabel: 'Unit',
  groups: [FOOD_DIET, BODY_MIND, PUBLIC_HEALTH],
  keyFormat: 'boxes',
  questionsFile: 'IELTS_Reading_Passage3_Food_Health.docx',
  keyFile: 'Giai_chi_tiet_Food_Health_Passage3_Unit1-6.docx',
  // Agreed with the owner (2026-11-09): the key's readings of these source slips are used (restored text in ⟨ ⟩).
  fixes: [
    // Unit 1: dashes joined to the words around them.
    { block: 14, find: 'variety-but', replace: 'variety - but' },
    { block: 16, find: 'low- glycemic-load', replace: 'low-glycemic-load' },
    { block: 18, find: 'obese- chickens', replace: 'obese - chickens' },
    { block: 18, find: 'cells-but', replace: 'cells - but' },
    // Unit 2: the flow-chart lost its arrows between the steps inside a box.
    { block: 88, find: 'Seeds classifying, cleaning, and roasting stripping', replace: 'Seeds → classifying, cleaning, and roasting → stripping' },
    { block: 88, find: 'Crushing producing', replace: 'Crushing → producing' },
    { block: 88, find: '…………… mixing with', replace: '…………… → mixing with' },
    { block: 88, find: 'Crumb blending crushing finely to obtain a smooth texture manufacturing', replace: 'Crumb → blending → crushing finely to obtain a smooth texture → manufacturing' },
    // Unit 4: "toots" for the mats; two closing quote marks missing.
    { block: 163, find: 'walk on the toots', replace: 'walk on the ⟨mats⟩' },
    { block: 163, find: 'older adults, as', replace: "older adults⟨'⟩, as" },
    { block: 163, find: 'paths of the senses -', replace: "paths of the senses⟨'⟩ -" },
    // Unit 4: the blank's number is joined to the word before it ("physical35 ……").
    { block: 202, find: 'physical35 ', replace: 'physical 35 ' },
    // Unit 5: the end of the instruction ("each answer.") was printed inside the summary box.
    { block: 258, find: 'from the passage for', replace: 'from the passage for each answer.' },
    { block: 260, find: 'each answer. ', replace: '' },
  ],
  passages: [
    {
      unit: 1,
      group: FOOD_DIET,
      slug: 'unit-01-stealth-forces-in-weight-loss',
      title: [8, "Stealth Forces in Weig"],
      body: [[11, "The field of weight "], [18, "G\tHe later moved to "]],
      groups: [
        { type: 'match', title: [20, "Questions 27–31"], intro: [[21, "This Reading Passa"], [23, "Write the correct "]], items: [[24, "27\tEvaluation on t"], [28, "31\tA research rela"]], letters: "ABCDEFG" },
        { type: 'match', title: [29, "Questions 32–36"], intro: [[30, "Look at the follow"], [32, "NB     You may use"]], items: [[36, "32\tA person's weig"], [40, "36\tResearchers sho"]], options: [34, "A\tRobert Berko"] },
        { type: 'gap', title: [41, "Questions 37–40"], intro: [[42, "Complete the summa"], [42, "Complete the summa"]], content: [[44, "In Bombay Clinic, "], [44, "In Bombay Clinic, "]] },
      ],
    },
    {
      unit: 2,
      group: FOOD_DIET,
      slug: 'unit-02-the-history-of-chocolate',
      title: [51, "The History of Chocola"],
      body: [[54, "A\tChocolate is now p"], [61, "H\tChocolate holds si"]],
      groups: [
        { type: 'match', title: [63, "Questions 27–31"], intro: [[64, "Reading Passage 3 "], [67, "NB     You may use"]], items: [[68, "27\tthe part of coc"], [72, "31\tan approach by "]], letters: "ABCDEFGH" },
        { type: 'tfng', title: [73, "Questions 32–36"], intro: [[74, "Do the following s"], [78, "NOT GIVEN\tif there"]], items: [[79, "32\tThe Mayan rulin"], [83, "36\tChocolate enjoy"]] },
        { type: 'gap', title: [84, "Questions 37–40"], intro: [[85, "Complete the flow-"], [86, "Write NO MORE THAN"]], content: [[88, "From Cocoa Beans t"], [88, "From Cocoa Beans t"]] },
      ],
    },
    {
      unit: 3,
      group: BODY_MIND,
      slug: 'unit-03-the-dunedin-study',
      title: [95, "The Dunedin Study"],
      body: [[98, "The New Zealand city"], [105, "Today, more than a q"]],
      groups: [
        { type: 'mcq', title: [107, "Questions 27–32"], intro: [[108, "Choose the correct"], [108, "Choose the correct"]], items: [[109, "27\tWhat does the w"], [138, "D\tTo highlight that"]] },
        { type: 'ynng', title: [139, "Questions 33–36"], intro: [[140, "Choose YES if the "], [140, "Choose YES if the "]], items: [[141, "33\tRecent results "], [144, "36\tThe findings of"]] },
        { type: 'bank', title: [145, "Questions 37–40"], intro: [[146, "Complete the summa"], [146, "Complete the summa"]], options: [147, "A  generalisab"], content: [[150, "A model study"], [150, "A model study"]] },
      ],
    },
    {
      unit: 4,
      group: BODY_MIND,
      slug: 'unit-04-learning-to-walk',
      title: [157, "Learning to Walk"],
      body: [[160, "These days the feet "], [166, "However, for many mo"]],
      groups: [
        { type: 'tfng', title: [168, "Questions 27–31"], intro: [[169, "Do the following s"], [173, "NOT GIVEN\tif there"]], items: [[174, "27\tBrantingham and"], [178, "31\tThe Masai Baref"]] },
        { type: 'mcq', title: [179, "Questions 32–34"], intro: [[180, "Choose the correct"], [181, "Write the correct "]], items: [[182, "32\tThe writer sugg"], [196, "D\tThe natural envi"]] },
        { type: 'gap', title: [197, "Questions 35–40"], intro: [[198, "Complete the summa"], [200, "Write your answers"]], content: [[202, "In their research,"], [202, "In their research,"]] },
      ],
    },
    {
      unit: 5,
      group: BODY_MIND,
      slug: 'unit-05-the-analysis-of-fear',
      title: [209, "The Analysis of Fear"],
      standfirst: [212, "Researchers are inve"],
      body: [[213, "Over the years, the "], [218, "Having identified th"]],
      groups: [
        { type: 'mcq', title: [220, "Questions 27–30"], intro: [[221, "Choose the correct"], [222, "Write the correct "]], items: [[223, "27\tIn the first pa"], [242, "D\twere graded in t"]] },
        { type: 'match', title: [243, "Questions 31–35"], intro: [[244, "Look at the follow"], [247, "NB        You may "]], items: [[251, "31\tAggressive faci"], [255, "35\tThe production "]], options: [249, "List of Condit"] },
        { type: 'gap', title: [256, "Questions 36–40"], intro: [[257, "Complete the summa"], [258, "Choose NO MORE THA"]], content: [[260, "Once they had iden"], [260, "Once they had iden"]] },
      ],
    },
    {
      unit: 6,
      group: PUBLIC_HEALTH,
      slug: 'unit-06-the-fluoridation-controversy',
      title: [267, "The Fluoridation Contr"],
      standfirst: [270, "The long-standing de"],
      body: [[271, "Fluoridation is the "], [279, "From the sociologica"]],
      groups: [
        { type: 'mcq', title: [281, "Questions 27–31"], intro: [[282, "Choose the correct"], [282, "Choose the correct"]], items: [[283, "27\tThe optimum amo"], [307, "D\tThey cannot reac"]] },
        { type: 'ynng', title: [308, "Questions 32–35"], intro: [[309, "Do the following s"], [313, "NOT GIVEN\tif it is"]], items: [[314, "32\tScientific know"], [317, "35\tThere are valid"]] },
        { type: 'match', title: [318, "Questions 36–40"], intro: [[319, "Complete each sent"], [320, "Write the correct "]], items: [[321, "36\tThe traditional"], [325, "40\tThe writer sugg"]], options: [[326, "A\tthe results of s"], [332, "G\tscientific knowl"]], optionsAfter: true },
      ],
    },
  ],
};
