// Environment topic, Reading Passage 2: where each part of each unit is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file (after the fixes below), so a changed source stops the build.
// Sources (owner, 2026-11-02): IELTS_Reading_Passage2_Environment.docx and "AK IELTS_Reading_Passage2_Giai_Unit1-13.docx" (key: BƯỚC 1–3 with an answer box per question).
// Decisions agreed with the owner (2026-11-02): (a) own topic "Environment – Passage 2" (seed batch 14);
// (b) Passage 2 Units 14–26 wait for their explanation key; (c) where the questions file's answer table and the key
// differ, the key's answer (it explains each choice); Passage 1 Unit 16 Q12 = "maintenance"; (d) units with parts
// that exist only in pictures are left out until the owner sends them (Passage 1 Unit 5; Passage 2 Units 1, 5, 8);
// (e) words the PDF damaged are restored where the key already worked them out, marked ⟨ ⟩; small slips kept;
// (f) the handout's Vietnamese glosses in Passage 1 Unit 13 are removed from the passage; (g) the Source / Topic /
// Key-source lines and the difficulty table are not shown; the key's notes go in the collapsed "Hướng dẫn One-Shot";
// (h) the key's alternatives are accepted.
const PLANTS_GROWTH = 'Plants & Growth';
const ANIMALS_BIRDS = 'Animals & Birds';

export default {
  topic: 'Environment – Passage 2',
  slug: 'environment-p2',
  numberLabel: 'Unit',
  groups: [PLANTS_GROWTH, ANIMALS_BIRDS],
  keyFormat: 'boxes',
  questionsFile: 'IELTS_Reading_Passage2_Environment.docx',
  keyFile: 'AK IELTS_Reading_Passage2_Giai_Unit1-13.docx',
  fixes: [
    // Decision (e): words the PDF damaged, as the key restored them (restored letters in ⟨ ⟩).
    { block: 108, find: "time- consuming", replace: "time-consuming" },
    { block: 152, find: "disease- resistant", replace: "disease-resistant" },
    { block: 294, find: "prey on the chicks", replace: "⟨preen⟩ the chicks" },
    { block: 289, find: "white- winged", replace: "white-winged" },
    { block: 291, find: "re- use", replace: "re-use" },
    { block: 377, find: "st Petersburg", replace: "⟨St⟩ Petersburg" },
    { block: 473, find: "disappeared .Their", replace: "disappeared. Their" },
    { block: 476, find: "Ross DE MacPhee", replace: "Ross D E MacPhee" },
    { block: 477, find: "Macphee", replace: "MacPhee" },
    { block: 509, find: "waggle ances", replace: "waggle ⟨d⟩ances" },
    { block: 509, find: "the d breakaway", replace: "the breakaway" },
    { block: 509, find: "reliable ,with", replace: "reliable, with" },
    { block: 554, find: "the tropic and", replace: "the ⟨tropics⟩ and" },
    { block: 555, find: "Mercatormade", replace: "Mercator made" },
    { block: 556, find: "Dueto", replace: "Due to" },
    { block: 556, find: "parrots riginated", replace: "parrots ⟨o⟩riginated" },
    { block: 556, find: "before it o broke", replace: "before it broke" },
    { block: 557, find: "shrinkingrainforests", replace: "shrinking rainforests" },
    { block: 558, find: "breaks are made", replace: "⟨beaks⟩ are made" },
    { block: 559, find: "and physical a example", replace: "and physical ⟨adaptations of the birds. For⟩ example" },
    { block: 560, find: "settlement forest telling created", replace: "settlement. ⟨Forest clearing⟩ created" },
    { block: 561, find: "comforted by", replace: "⟨confronted⟩ by" },
    // Decision (e): question labels the PDF damaged (a drop cap or a digit lost); restored letters in ⟨ ⟩.
    // Unit 12
    { block: 521, find: '1	ara graph A P', replace: '14	⟨P⟩aragraph A' },
    { block: 531, find: '2	ertain', replace: '20	⟨C⟩ertain' },
    { block: 532, find: 'C', replace: '' },
    { block: 534, find: '2	The more', replace: '22	The more' },
    { block: 544, find: 'home has been24 A ', replace: 'home has been 24 ' },
    // Unit 13
    { block: 568, find: '1	n example', replace: '14	⟨A⟩n example' },
    { block: 568, find: '…………… A', replace: '……………' },
    { block: 576, find: '20	he writer believes that most parrot species T', replace: '20	⟨T⟩he writer believes that most parrot species' },
    { block: 581, find: '21	hat does', replace: '21	⟨W⟩hat does' },
    { block: 582, find: 'W', replace: '' },
    { block: 586, find: '2	Which', replace: '22	Which' },
  ],
  passages: [
    {
      unit: 2,
      group: PLANTS_GROWTH,
      slug: 'unit-02-photovoltaics-on-the-rooftop',
      title: [52, "Photovoltaics on the r"],
      standfirst: [55, "A natural choice for"],
      body: [[56, "A\tIn the past, urban"], [64, ""]], // "Figure 1" (blocks 65–67: caption, two pictures, caption) left out, as in the key
      groups: [
        { type: 'match', title: [69, "Questions 14–19"], intro: [[70, "The Reading Passag"], [72, "NB You may use any"]], items: [[73, "14\texamples of cou"], [78, "19\ta reference to "]], letters: "ABCDEFGHI" }, // the passage has paragraphs A–I (the instructions say A–H); Q18 = I
        { type: 'tfng', title: [79, "Questions 20–26"], intro: [[80, "Do the following s"], [84, "NOT GIVEN\tif the i"]], items: [[85, "20\tPhotovoltaics a"], [91, "26\tEnergy-saving m"]] },
      ],
    },
    {
      unit: 3,
      group: PLANTS_GROWTH,
      slug: 'unit-03-natures-useful-designs',
      title: [97, "Nature’s Useful Design"],
      body: [[100, "A\tWhat has fins like"], [108, "I\tFor all the power "]],
      groups: [
        { type: 'match', title: [110, "Questions 14–19"], intro: [[111, "Reading Passage 2 "], [113, "Write the correct "]], items: [[114, "14\tHow an organism"], [119, "19\tSituations wher"]], letters: "ABCDEFGHI" },
        { type: 'match', title: [120, "Questions 20–22"], intro: [[121, "Look at the follow"], [123, "Write the correct "]], items: [[124, "20\tAll living thin"], [126, "22\tBiomimetics ach"]], options: [128, "List of People"], optionsAfter: true },
        { type: 'gap', title: [130, "Questions 23–26"], intro: [[131, "Complete the sente"], [133, "Write your answers"]], content: [[134, "23\tAndrew Parker i"], [137, "26\tOne scientist i"]] },
      ],
    },
    {
      unit: 4,
      group: PLANTS_GROWTH,
      slug: 'unit-04-the-constant-evolution-of-the-humble-tomato',
      title: [143, "The Constant Evolution"],
      standfirst: [146, "Heirloom tomatoes - "],
      body: [[147, ""], [152, "F\tIn 1996, a tomato "]],
      groups: [
        { type: 'match', title: [154, "Questions 14–17"], intro: [[155, "Reading Passage 2 "], [157, "Write the correct "]], items: [[158, "14\tan explanation "], [161, "17\ta reference to "]], letters: "ABCDEF" },
        { type: 'match', title: [162, "Questions 18–21"], intro: [[163, "Look at the follow"], [165, "Write the correct "]], items: [[166, "18\tThe transplanti"], [169, "21\tThe wide variet"]], options: [171, "List of resear"], optionsAfter: true },
        { type: 'gap', title: [173, "Questions 22–26"], intro: [[174, "Complete the sente"], [176, "Write your answers"]], content: [[177, "There is little in"], [181, "26 …………… are a pro"]] },
      ],
    },
    {
      unit: 6,
      group: ANIMALS_BIRDS,
      slug: 'unit-06-the-tasmanian-tiger',
      title: [221, "The Tasmanian Tiger"],
      body: [[224, "Although it was call"], [238, "Could the thylacine "]],
      groups: [
        { type: 'gap', title: [240, "Questions 14–17"], intro: [[241, "Complete the summa"], [243, "Write your answers"]], content: [[245, "------------------"], [245, "------------------"]] },
        { type: 'match', title: [247, "Questions 18–23"], intro: [[248, "Look at the follow"], [251, "NB You may use any"]], items: [[252, "18\tHis report of s"], [257, "23\tThe interpretat"]], options: [259, "List of People"], optionsAfter: true },
        { type: 'mcq', title: [261, "Questions 24–26"], intro: [[262, "Choose the correct"], [263, "Write the correct "]], items: [[264, "24\tHans Naarding's"], [278, "D\tquestioned and c"]] },
      ],
    },
    {
      unit: 7,
      group: ANIMALS_BIRDS,
      slug: 'unit-07-intelligent-behaviour-in-birds',
      title: [284, "Intelligent behaviour "],
      standfirst: [287, "Many people are awar"],
      body: [[288, "A\tFor centuries, man"], [294, "G\tWhat better way to"]],
      footnotes: [[295, "preening*: cleaning"], [295, "preening*: cleaning"]],
      groups: [
        // The source prints this group's title in the same paragraph as an empty line ("\nQuestions 14–20").
        { type: 'match', title: [296, "\nQuestions 14–20"], intro: [[297, "Reading Passage 2 "], [299, "Choose the correct"]], options: [301, "List of Headin"], items: [[303, "14\tParagraph A   "], [309, "20\tParagraph G   "]] },
        { type: 'match', title: [310, "Questions 21–26"], intro: [[311, "Look at the follow"], [314, "NB     You may use"]], items: [[318, "21\tkeeping tools t"], [323, "26\tengaging in cer"]], options: [316, "List of Birds"] },
      ],
    },
    {
      unit: 9,
      group: ANIMALS_BIRDS,
      slug: 'unit-09-the-discovery-of-a-baby-mammoth',
      title: [371, "The Discovery of a Bab"],
      standfirst: [374, "A near-perfect froze"],
      body: [[375, "A\tOn a May morning i"], [380, "F\tStudies are ongoin"]],
      groups: [
        { type: 'match', title: [382, "Questions 14–18"], intro: [[383, "Reading Passage ha"], [385, "Write the correct "]], items: [[386, "14\tSimilarities be"], [390, "18\tA comparison be"]], letters: "ABCDEF" },
        { type: 'match', title: [391, "Questions 19–23"], intro: [[392, "Match each stateme"], [394, "NB You may use any"]], items: [[395, "19\tThe indications"], [399, "23\tMammoths often "]], options: [401, "List of People"], optionsAfter: true },
        { type: 'gap', title: [403, "Questions 24–26"], intro: [[404, "Complete the sente"], [406, "Write your answers"]], content: [[407, "Mammoth extinction"], [407, "Mammoth extinction"]] },
      ],
    },
    {
      unit: 10,
      group: ANIMALS_BIRDS,
      slug: 'unit-10-australias-camouflaged-creatures',
      title: [413, "Australia's Camouflage"],
      standfirst: [416, "Many species of anim"],
      body: [[417, "A\tMost species use c"], [423, "G\tIn Queensland's Ta"]],
      groups: [
        { type: 'match', title: [425, "Questions 14–18"], intro: [[426, "Reading Passage 2 "], [428, "Write the correct "]], items: [[429, "14\ta species that "], [433, "18\texamples of ani"]], letters: "ABCDEFG" },
        { type: 'match', title: [434, "Questions 19–23"], intro: [[435, "Look at the follow"], [437, "Write the correct "]], items: [[438, "19\tOne species has"], [442, "23\tCamouflage can "]], options: [444, "List of people"], optionsAfter: true },
        { type: 'gap', title: [446, "Questions 24–26"], intro: [[447, "Complete the summa"], [449, "Write your answers"]], content: [[451, "The bluestriped fa"], [451, "The bluestriped fa"]] }, // blocks 453–463 (part of another test pasted in by mistake) left out
      ],
    },
    {
      unit: 11,
      group: ANIMALS_BIRDS,
      slug: 'unit-11-mammoth-kill',
      title: [469, "Mammoth Kill"],
      standfirst: [472, "What led to the disa"],
      body: [[473, "Although it's hard t"], [479, "For his part, Alroy "]],
      groups: [
        { type: 'gap', title: [481, "Questions 14–20"], intro: [[482, "Complete the summa"], [483, "Choose NO MORE THA"]], content: [[485, "Three theories hav"], [485, "Three theories hav"]] },
        { type: 'match', title: [487, "Questions 21–26"], intro: [[488, "Look at the allowi"], [490, "Write the correct "]], items: [[494, "21\tToo little evid"], [499, "26\tEnvironmental c"]], options: [492, "List of People"] },
      ],
    },
    {
      unit: 12,
      group: ANIMALS_BIRDS,
      slug: 'unit-12-insect-decision-making',
      title: [505, "Insect decision-making"],
      body: [[508, "A\tIt has long been h"], [513, "F\tOnce the suitable "]],
      groups: [
        { type: 'match', title: [515, "Questions 14–19"], intro: [[516, "Reading Passage ha"], [517, "Write the correct "]], items: [[521, "14\t⟨P⟩aragraph A  "], [526, "19\tParagraph F    "]], options: [519, "List of Headin"] },
        { type: 'match', title: [527, "Questions 20–23"], intro: [[528, "Look at the follow"], [530, "NB     you may use"]], items: [[531, "20\t⟨C⟩ertain membe"], [535, "23\tThe decision-ma"]], options: [537, "List of Academ"], optionsAfter: true },
        { type: 'gap', title: [539, "Questions 24–26"], intro: [[540, "Complete the summa"], [542, "Write your answers"]], content: [[544, "A study of insect "], [544, "A study of insect "]] },
      ],
    },
    {
      unit: 13,
      group: ANIMALS_BIRDS,
      slug: 'unit-13-australian-parrots',
      title: [551, "Australian Parrots"],
      body: [[554, "A\tParrots are found "], [563, "J\tThere may be no fi"]],
      groups: [
        { type: 'match', title: [565, "Questions 14–19"], intro: [[566, "Reading Passage ha"], [567, "Write the correct "]], items: [[568, "14\t⟨A⟩n example of"], [573, "19\tAn example of a"]], letters: "ABCDEFGHIJ" },
        { type: 'mcq', title: [574, "Questions 20–22"], intro: [[575, "Choose the correct"], [575, "Choose the correct"]], items: [[576, "20\t⟨T⟩he writer be"], [590, "D\tThey are too few"]] },
        { type: 'gap', title: [591, "Questions 23–26"], intro: [[592, "Complete the summa"], [592, "Complete the summa"]], content: [[594, "Parrots in Austral"], [594, "Parrots in Austral"]] },
      ],
    },

  ],
};
