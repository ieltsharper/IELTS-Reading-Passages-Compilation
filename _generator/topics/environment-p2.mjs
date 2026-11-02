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
const ECOSYSTEMS_OCEANS = 'Ecosystems & Oceans';
const CLIMATE_ENERGY_SUSTAINABILITY = 'Climate, Energy & Sustainability';

export default {
  topic: 'Environment – Passage 2',
  slug: 'environment-p2',
  numberLabel: 'Unit',
  groups: [PLANTS_GROWTH, ANIMALS_BIRDS, ECOSYSTEMS_OCEANS, CLIMATE_ENERGY_SUSTAINABILITY],
  keyFormat: 'boxes',
  questionsFile: 'IELTS_Reading_Passage2_Environment.docx',
  keyFile: 'AK IELTS_Reading_Passage2_Giai_Unit1-13.docx', // and IELTS_Reading_Passage2_Giai_Unit14-26.docx (Units 14–26, 4th argument)
  itemsWithSpace: true, // Unit 8: "23. domestic pigeon"
  // Text the owner sent as pictures (2026-11-03), typed from them; appended after the file's blocks (1192–1215).
  // Unit 5: the instructions and the List of Headings from the picture; the question lines "14 Paragraph A" …
  // "19 Paragraph F" are added (one per paragraph, in order). Unit 8: the box A–G for Questions 23–26.
  extraBlocks: [
    {
      "id": "p2u5",
      "lines": [
        "Reading Passage 2 has six paragraphs.",
        "Choose the correct heading for each paragraph from the list of headings below.",
        "List of Headings",
        "i\tSending messages underground",
        "ii\tPotential advantages for farmers",
        "iii\tThe widespread rejection of an idea",
        "iv\tOne species accelerating growth in another",
        "v\tSome obstacles to plant communication",
        "vi\tEvidence leading to renewed belief in a theory",
        "vii\tNew technologies which helped researchers",
        "viii\tA suggested benefit to the sender of plant communication",
        "14\tParagraph A",
        "15\tParagraph B",
        "16\tParagraph C",
        "17\tParagraph D",
        "18\tParagraph E",
        "19\tParagraph F"
      ]
    },
    {
      "id": "p2u8",
      "lines": [
        "A. an ability to orientate without previous training",
        "B. the speed at which birds can fly",
        "C. the ability to remember things seen previously",
        "D. the effect of age on homing ability",
        "E. the strength required to fly a great distance",
        "F. a high success rate in finding nests",
        "G. the importance of seasonal cues for migrating birds"
      ]
    }
  ],
  fixes: [
    // Unit 26 Q22: three full stops typed in front of the answer line.
    { block: 1177, find: 'plenty of ...…', replace: 'plenty of …' },
    // Unit 23: the first paragraph (A; its opening words are lost in the source) has no letter.
    { block: 1005, find: 'start by making', replace: 'A\tstart by making' },
    // Units 14–26, decision (e): question labels the PDF damaged (first letters or digits lost), restored in ⟨ ⟩,
    // and words the key restored.
    { block: 693, find: "1\tn explanation", replace: "14\t⟨A⟩n explanation" },
    { block: 693, find: " in the right quantities a", replace: " in the right quantities" },
    { block: 702, find: "1\te changed", replace: "18\t⟨W⟩e changed" },
    { block: 703, find: "W", replace: "" },
    { block: 681, find: "inthe", replace: "in the" },
    { block: 683, find: "arethe", replace: "are the" },
    { block: 684, find: "modem farming", replace: "mode⟨rn⟩ farming" },
    { block: 685, find: "lifestyle rs", replace: "lifestylers" },
    { block: 728, find: "low- oxygen", replace: "low-oxygen" },
    { block: 775, find: "dry- season", replace: "dry-season" },
    { block: 777, find: "long- term", replace: "long-term" },
    { block: 821, find: "thatthe", replace: "that the" },
    { block: 821, find: "insect- eating", replace: "insect-eating" },
    { block: 832, find: "1\taragraphA …………… P", replace: "14\t⟨P⟩aragraphA ……………" },
    { block: 842, find: "2\tIt is not clear", replace: "20\tIt is not clear" },
    { block: 913, find: "F", replace: "" },
    { block: 914, find: "The final phase", replace: "F\tThe final phase" },
    { block: 1057, find: "Ahandful", replace: "A handful" },
    { block: 1061, find: "of ifferent sizes", replace: "of ⟨d⟩ifferent sizes" },
    { block: 1061, find: "manure d as", replace: "manure as" },
    { block: 1087, find: "24\the Manatuto project aimed to set up a T A    charitable trust.", replace: "24\t⟨T⟩he Manatuto project aimed to set up a A\tcharitable trust." },
    { block: 1088, find: "B    ", replace: "B\t" },
    { block: 1089, find: "C    ", replace: "C\t" },
    { block: 1090, find: "D    ", replace: "D\t" },
    { block: 1091, find: "25\to be effective, the Flynn filters must T A     remove", replace: "25\t⟨T⟩o be effective, the Flynn filters must A\tremove" },
    { block: 1092, find: "B     ", replace: "B\t" },
    { block: 1093, find: "C     ", replace: "C\t" },
    { block: 1094, find: "D     ", replace: "D\t" },
    { block: 1095, find: "26\tlynn does not intend to patent his filter because he F A     wants", replace: "26\t⟨F⟩lynn does not intend to patent his filter because he A\twants" },
    { block: 1096, find: "B     ", replace: "B\t" },
    { block: 1097, find: "C     ", replace: "C\t" },
    { block: 1098, find: "D     ", replace: "D\t" },
    { block: 1122, find: "1\tIn Australia", replace: "14\tIn Australia" },
    { block: 1134, find: "2\turing the process", replace: "21\t⟨D⟩uring the process" },
    { block: 1135, find: "D", replace: "" },
    // Unit 5: a stray "A B" line at the end of the list of researchers.
    { block: 211, find: 'A\tB', replace: '' },
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
      unit: 5,
      group: PLANTS_GROWTH,
      slug: 'unit-05-how-do-plants-talk-to-each-other',
      title: [187, "How Do Plants Talk to "],
      standfirst: [190, "Research shows that "],
      body: [[191, "In 1983, plant scien"], [196, "Researchers believe "]],
      labelParagraphs: true, // Questions 14–19 refer to paragraphs A–F
      groups: [
        { type: 'match', title: [198, "Questions 14–19"], intro: [[1192,"Reading Passage "], [1193,"Choose the corre"]], options: [[1194,"List of Headings"], [1202,"viii\tA suggested"]], items: [[1203,"14\tParagraph A"], [1208,"19\tParagraph F"]] },
        { type: 'gap', title: [200, "Questions 20–23"], intro: [[201, "Complete the summa"], [202, "Write ONE WORD ONL"]], content: [[204, "Plant communicatio"], [204, "Plant communicatio"]] },
        { type: 'match', title: [206, "Questions 24–26"], intro: [[207, "Look at the follow"], [209, "List of researcher"]], items: [[213, "24\tIt is likely th"], [215, "26\tAttitudes towar"]], options: [211, "A\tRichard Karb"] },
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
      unit: 8,
      group: ANIMALS_BIRDS,
      slug: 'unit-08-orientation-of-birds',
      title: [329, "Orientation of birds"],
      body: [[332, "A\tFor many of us, th"], [339, "H\tThe case of starli"]],
      groups: [
        { type: 'gap', title: [341, "Questions 14–18"], intro: [[342, "Complete the summa"], [344, "Write your answers"]], content: [[346, "Types of homing be"], [346, "Types of homing be"]] },
        { type: 'match', title: [348, "Questions 19–22"], intro: [[349, "Reading Passage ha"], [352, "NB You may use any"]], items: [[353, "19\tthe effects of "], [356, "22\thow some birds'"]], letters: "ABCDEFGH" },
        // The box A–G is typed from the owner's picture (blocks 1209–1215).
        { type: 'match', title: [357, "Questions 23–26"], intro: [[358, "Look at the follow"], [359, "Choose FOUR answer"]], items: [[361, "23. domestic pige"], [364, "26. starling"]], options: [[1209,"A. an ability to"], [1215,"G. the importanc"]] },
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

    {
      unit: 14,
      group: ECOSYSTEMS_OCEANS,
      slug: 'unit-14-the-tuatara-of-new-zealand',
      title: [601, "The Tuatara of New Zea"],
      body: [[604, "Tuatara are lizard-l"], [611, "Legal protection was"]],
      groups: [
        { type: 'tfng', title: [613, "Questions 14–19"], intro: [[614, "Do the following s"], [618, "NOT GIVEN\tif there"]], items: [[619, "14\tThe two living "], [624, "19\tOnce they have "]] },
        { type: 'gap', title: [625, "Questions 20–26"], intro: [[626, "Complete the notes"], [628, "Write your answers"]], content: [[630, "The tuatara"], [630, "The tuatara"]] },
      ],
    },
    // Unit 15 (Biodiversity) is left out: the summary for Questions 21–26 stops after Q23 in the source.
    {
      unit: 16,
      group: ECOSYSTEMS_OCEANS,
      slug: 'unit-16-the-changing-face-of-farming-in-the-canterbury-region',
      title: [677, "The Changing Face of F"],
      standfirst: [680, "in the Canterbury Re"],
      body: [[681, "A\tThe landscape of t"], [686, ""]],
      footnotes: [[687, "*dairy farming: keep"], [687, "*dairy farming: keep"]],
      groups: [
        { type: 'match', title: [689, "Questions 14–17"], intro: [[690, "Reading Passage 2 "], [692, "Write the correct "]], items: [[693, "14\t⟨A⟩n explanatio"], [696, "17\ta reference to "]], letters: "ABCDEF" },
        { type: 'match', title: [697, "Questions 18–21"], intro: [[698, "Look at the follow"], [701, "NB    You may use "]], items: [[702, "18\t⟨W⟩e changed ou"], [706, "21\tThe number of n"]], options: [708, "List of people"], optionsAfter: true },
        { type: 'gap', title: [710, "Questions 22–26"], intro: [[711, "Complete the summa"], [713, "Write your answers"]], content: [[715, "The changing popul"], [715, "The changing popul"]] },
      ],
    },
    {
      unit: 17,
      group: ECOSYSTEMS_OCEANS,
      slug: 'unit-17-jellyfish-the-dominant-species',
      title: [722, "Jellyfish - The Domina"],
      body: [[725, "A\tJellyfish have bec"], [731, "G\tExperts say that a"]],
      groups: [
        { type: 'match', title: [733, "Questions 14–17"], intro: [[734, "Reading Passage 2 "], [736, "Choose the correct"]], items: [[737, "14\ta prediction as"], [740, "17\tsuggestions on "]], letters: "ABCDEFG" },
        { type: 'multi', title: [741, "Questions 18–19"], intro: [[742, "Choose TWO correct"], [743, "The list below giv"]], choose: 2, items: [[744, "Which TWO of these"], [749, "E\tThey have create"]], stemWithoutNumbers: true },
        { type: 'multi', title: [750, "Questions 20–21"], intro: [[751, "Choose TWO correct"], [751, "Choose TWO correct"]], choose: 2, items: [[752, "Which TWO of the f"], [757, "E\ta decrease in se"]], stemWithoutNumbers: true },
        { type: 'gap', title: [758, "Questions 22–26"], intro: [[759, "Complete the sente"], [760, "Write ONE WORD ONL"]], content: [[761, "22\tSome fish in th"], [765, "26\tRichardson beli"]] },
      ],
    },
    {
      unit: 18,
      group: ECOSYSTEMS_OCEANS,
      slug: 'unit-18-the-return-of-monkey-life',
      title: [771, "The return of monkey l"],
      standfirst: [774, "Rain forest trees gr"],
      body: [[775, "A\tHacienda La Pacifi"], [781, "G\tEstrada believes t"]],
      groups: [
        { type: 'match', title: [783, "Questions 14–17"], intro: [[784, "Reading Passage ha"], [787, "NB     You may use"]], items: [[788, "14\ta reason why ne"], [791, "17\tfigures relatin"]], letters: "ABCDEFG" },
        { type: 'gap', title: [792, "Questions 18–21"], intro: [[793, "Complete the summa"], [795, "Write your answers"]], content: [[797, "Why do howlers hav"], [797, "Why do howlers hav"]] },
        { type: 'match', title: [799, "Questions 22–26"], intro: [[800, "Look at the follow"], [803, "NB     You may use"]], options: [804, "Locations A Hacien"], inlineOptions: 'A Hacienda', items: [[805, "22\tIt has seen the"], [809, "26\tIts landscape w"]] },
      ],
    },
    {
      unit: 19,
      group: ECOSYSTEMS_OCEANS,
      slug: 'unit-19-surviving-city-life',
      title: [815, "Surviving city life"],
      body: [[818, "Although the colonis"], [824, "F\tIt's not just nati"]],
      groups: [
        { type: 'match', title: [826, "Questions 14–19"], intro: [[827, "Reading Passage 2 "], [828, "Choose the correct"]], items: [[832, "14\t⟨P⟩aragraphA ……"], [837, "19\tParagraphF …………"]], options: [830, "List of Headin"] },
        { type: 'match', title: [838, "Questions 20–23"], intro: [[839, "Look at the follow"], [841, "NB    You may use "]], items: [[842, "20\tIt is not clear"], [845, "23\tResearch into t"]], options: [847, "List of Resear"], optionsAfter: true },
        { type: 'gap', title: [849, "Questions 24–26"], intro: [[850, "Complete the summa"], [851, "Choose ONE WORD ON"]], content: [[853, "Seeking comfort in"], [853, "Seeking comfort in"]] },
      ],
    },
    {
      unit: 20,
      group: ECOSYSTEMS_OCEANS,
      slug: 'unit-20-the-importance-of-icebergs-to-ocean-life',
      title: [860, "The importance of iceb"],
      body: [[863, "A\tThe word iceberg r"], [871, "I\tIf you're not an o"]],
      groups: [
        { type: 'match', title: [873, "Questions 14–19"], intro: [[874, "Reading Passage 2 "], [876, "NB You may use any"]], items: [[878, "14\texamples of equ"], [883, "19\ta reference to "]], letters: "ABCDEFGHI" }, // block 877 (a row of answer letters A–I) left out
        { type: 'multi', title: [884, "Questions 20–21"], intro: [[885, "Choose TWO correct"], [885, "Choose TWO correct"]], choose: 2, items: [[886, "20-21 Which TWO of"], [891, "E\tHe was the first"]] },
        { type: 'gap', title: [892, "Questions 22–26"], intro: [[893, "Complete the summa"], [894, "Write ONE WORD ONL"]], content: [[896, "Iceberg ecosystems"], [896, "Iceberg ecosystems"]] },
      ],
    },
    {
      unit: 21,
      group: ECOSYSTEMS_OCEANS,
      slug: 'unit-21-saving-the-bittern',
      title: [903, "Saving the Bittern"],
      body: [[906, "A\tThe bittern, a Bri"], [915, "G\tBy 2004, the numbe"]],
      groups: [
        { type: 'match', title: [917, "Questions 14–20"], intro: [[918, "Reading Passage 2 "], [920, "Write the correct "]], items: [[924, "14\tParagraph A"], [930, "20\tParagraph G"]], options: [922, "List of Headin"] },
        { type: 'short', title: [931, "Questions 21–25"], intro: [[932, "Choose ONE WORD AN"], [933, "Write your answers"]], items: [[934, "21\tWhen was the bi"], [938, "25\tWhat other crea"]] },
        { type: 'mcq', title: [939, "Question 26"], intro: [[940, "Choose the correct"], [941, "Write the correct "]], items: [[942, "26\tWhat is the mai"], [946, "D\tHow research and"]] },
      ],
    },
    {
      unit: 22,
      group: CLIMATE_ENERGY_SUSTAINABILITY,
      slug: 'unit-22-the-2003-european-heatwave',
      title: [952, "The 2003 European Heat"],
      body: [[955, "People in the Northe"], [964, "His colleagues at th"]],
      groups: [
        { type: 'ynng', title: [966, "Questions 14–19"], intro: [[967, "Do the following s"], [971, "NOT GIVEN\tif there"]], items: [[972, "14\tIn 2003, the av"], [977, "19\tNew ski resorts"]] },
        { type: 'short', title: [978, "Questions 20–21"], intro: [[979, "Answer the questio"], [980, "Write your answers"]], items: [[981, "20\tIn Britain, whi"], [982, "21\tApart from the "]] },
        { type: 'gap', title: [983, "Questions 22–25"], intro: [[984, "Complete the summa"], [985, "Write your answers"]], content: [[987, "The three warmest "], [987, "The three warmest "]] },
        { type: 'mcq', title: [989, "Question 26"], intro: [[990, "Choose the correct"], [991, "Write your answer "]], items: [[992, "26\tWhich one can b"], [996, "D\tThe Year of Euro"]] },
      ],
    },
    {
      unit: 23,
      group: CLIMATE_ENERGY_SUSTAINABILITY,
      slug: 'unit-23-the-carbon-footprint-of-everyday-things',
      title: [1002, "The Carbon Footprint o"],
      body: [[1005, ""], [1011, "G\tMost of the time I"]],
      footnotes: [[1012, "life-cycle: the sta"], [1012, "life-cycle: the sta"]],
      groups: [
        { type: 'match', title: [1014, "Questions 14–19"], intro: [[1015, "The text has seven"], [1016, "NB You may choose "]], items: [[1018, "14\treference to an"], [1023, "19\ta comparison be"]], letters: "ABCDEFG" },
        { type: 'multi', title: [1024, "Questions 20–21"], intro: [[1025, "Choose TWO correct"], [1026, "The list below des"]], choose: 2, items: [[1027, "20-21 Which TWO of"], [1032, "E\tIt was first dev"]] },
        { type: 'multi', title: [1033, "Questions 22–23"], intro: [[1034, "Choose TWO correct"], [1035, "The list below des"]], choose: 2, items: [[1036, "22-23 Which TWO of"], [1041, "E\tIt can use price"]] },
        { type: 'gap', title: [1042, "Questions 24–26"], intro: [[1043, "Complete the summa"], [1044, "Write ONE WORD ONL"]], content: [[1046, "Small World Consul"], [1046, "Small World Consul"]] },
      ],
    },
    {
      unit: 24,
      group: CLIMATE_ENERGY_SUSTAINABILITY,
      slug: 'unit-24-new-filter-promises-clean-water-for-millions',
      title: [1053, "New filter promises cl"],
      standfirst: [1056, "An ingenious inventi"],
      body: [[1057, "A handful of clay,"], [1063, "With all the compone"]],
      groups: [
        { type: 'gap', title: [1065, "Question 14–19"], intro: [[1066, "Complete the flow-"], [1068, "Write your answers"]], content: [[1070, "Step-by-step guide"], [1070, "Step-by-step guide"]] },
        { type: 'tfng', title: [1072, "Questions 20–23"], intro: [[1074, "Do the following s"], [1079, "NOT GIVEN\tif there"]], items: [[1080, "20\tThe clay in the"], [1083, "23\tE-coli is the m"]] },
        { type: 'mcq', title: [1084, "Question 24–26"], intro: [[1085, "Choose the correct"], [1086, "Write the correct "]], items: [[1087, "24\t⟨T⟩he Manatuto "], [1098, "D\thas already give"]], splitItems: ['A\tcharitable trust', 'A\tremove all', 'A\twants it'] },
      ],
    },
    {
      unit: 25,
      group: CLIMATE_ENERGY_SUSTAINABILITY,
      slug: 'unit-25-renewable-energy',
      title: [1104, "Renewable Energy"],
      standfirst: [1107, "An insight into the "],
      body: [[1108, "The race is on for t"], [1114, "The diversity of for"]],
      groups: [
        { type: 'tfng', title: [1116, "Questions 14–20"], intro: [[1117, "Do the following s"], [1121, "NOT GIVEN\tif there"]], items: [[1122, "14\tIn Australia, a"], [1128, "20\tAccording to AE"]] },
        { type: 'match', title: [1129, "Questions 21–26"], intro: [[1130, "Look at the follow"], [1133, "NB    You may use "]], items: [[1134, "21\t⟨D⟩uring the pr"], [1140, "26\tOriginal estima"]], options: [1142, "List of Compan"], optionsAfter: true },
      ],
    },
    {
      unit: 26,
      group: CLIMATE_ENERGY_SUSTAINABILITY,
      slug: 'unit-26-biophilic-design',
      title: [1149, "Biophilic Design"],
      body: [[1152, "A\tBiophilic design, "], [1159, "H\tAncient architects"]],
      groups: [
        { type: 'match', title: [1161, "Questions 14–19"], intro: [[1162, "Reading Passage 2 "], [1165, "NB     You may use"]], items: [[1166, "14\ta description o"], [1171, "19\ta description o"]], letters: "ABCDEFGH" },
        { type: 'gap', title: [1172, "Questions 20–24"], intro: [[1173, "Complete the sente"], [1174, "Write ONE WORD ONL"]], content: [[1175, "20\tIn the modern w"], [1179, "24\tThere is a biop"]] },
        { type: 'multi', title: [1180, "Questions 25–26"], intro: [[1181, "Choose TWO correct"], [1181, "Choose TWO correct"]], choose: 2, items: [[1182, "Which TWO of the f"], [1187, "E\tIt provides sola"]], stemWithoutNumbers: true },
      ],
    },

  ],
};
