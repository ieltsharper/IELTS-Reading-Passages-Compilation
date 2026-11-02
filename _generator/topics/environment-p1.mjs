// Environment topic, Reading Passage 1: where each part of each unit is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file (after the fixes below), so a changed source stops the build.
// Sources (owner, 2026-11-02): IELTS_Reading_Passage1_Environment.docx and "AK IELTS_Reading_Passage1_Giai_Unit1-16.docx" (key: BƯỚC 1–3 with an answer box per question).
// Decisions agreed with the owner (2026-11-02): (a) own topic "Environment – Passage 1" (seed batch 14);
// (b) Passage 2 Units 14–26 wait for their explanation key; (c) where the questions file's answer table and the key
// differ, the key's answer (it explains each choice); Passage 1 Unit 16 Q12 = "maintenance"; (d) units with parts
// that exist only in pictures are left out until the owner sends them (Passage 1 Unit 5; Passage 2 Units 1, 5, 8);
// (e) words the PDF damaged are restored where the key already worked them out, marked ⟨ ⟩; small slips kept;
// (f) the handout's Vietnamese glosses in Passage 1 Unit 13 are removed from the passage; (g) the Source / Topic /
// Key-source lines and the difficulty table are not shown; the key's notes go in the collapsed "Hướng dẫn One-Shot";
// (h) the key's alternatives are accepted.
// (d, 2026-11-03) the owner sent the missing parts of P1 Unit 5 and P2 Units 5 and 8 as pictures; their text is
// typed from those pictures (paragraph A; the list of headings; the box A–G) and marked as such below.
const PLANTS_BOTANY = 'Plants & Botany';
const MARINE_OCEAN_LIFE = 'Marine & Ocean Life';
const ANIMALS_WILDLIFE = 'Animals & Wildlife';
const LAND_SOIL_RESOURCES = 'Land, Soil & Resources';

export default {
  topic: 'Environment – Passage 1',
  slug: 'environment-p1',
  numberLabel: 'Unit',
  groups: [PLANTS_BOTANY, MARINE_OCEAN_LIFE, ANIMALS_WILDLIFE, LAND_SOIL_RESOURCES],
  keyFormat: 'boxes',
  questionsFile: 'IELTS_Reading_Passage1_Environment.docx',
  keyFile: 'AK IELTS_Reading_Passage1_Giai_Unit1-16.docx',
  fixes: [
    // Unit 5: paragraph A is missing from the file; typed from the owner's picture (2026-11-03) and put before B
    // (the block is then split into A and B, see the unit's splits).
    { block: 154, find: 'B\tDuring the past month', replace: "A\tLeatherback turtles follow the general sea turtle body plan of having a large, flattened, round body with two pairs of very large flippers and a short tail. Like other sea turtles, the leatherback's flattened forelimbs are specially adapted for swimming in the open ocean. Claws are noticeably absent from both pairs of flippers. The leatherback's flippers are the largest in proportion to its body among the extant sea turtles. Leatherback front flippers can grow up to 2.7 meters in large specimens, the largest flippers (even in comparison to its body) of any sea turtle. As the last surviving member of its family, the leatherback turtle has several distinguishing characteristics that differentiate it from other sea turtles. Its most notable feature is that it lacks the bony carapace of the other extant sea turtles. B\tDuring the past month" },
    // Decision (e): words the PDF damaged, as the key restored them (restored letters in ⟨ ⟩).
    { block: 17, find: "five- hundredth", replace: "five-hundredth" },
    { block: 194, find: "predator- prey", replace: "predator-prey" },
    { block: 302, find: "self- medication", replace: "self-medication" },
    { block: 374, find: "four- chambered", replace: "four-chambered" },
    { block: 402, find: "ail bovid", replace: "⟨all⟩ bovid" },
    { block: 537, find: "distinctiye", replace: "⟨distinctive⟩" },
    // Decision (f): the handout's Vietnamese glosses in Unit 13 paragraph B are not part of the passage.
    { block: 493, find: " (a means of : phương tiện)", replace: "" },
    { block: 493, find: " (hồi xưa)", replace: "" },
    { block: 493, find: " (ngoằn nghèo)", replace: "" },
    { block: 493, find: " = limit, stop, halt", replace: "" },
    // Unit 14: the first blank of the notes is numbered 6 instead of 7 (Questions 7–13).
    { block: 556, find: 'because of 6 ', replace: 'because of 7 ' },
  ],
  passages: [
    {
      unit: 1,
      group: PLANTS_BOTANY,
      slug: 'unit-01-carnivorous-plant',
      title: [8, "Carnivorous plant"],
      standfirst: [11, "They attract insects"],
      body: [[12, "The naturalist and a"], [20, "Unfortunately, the a"]],
      groups: [
        { type: 'gap', title: [22, "Questions 1–5"], intro: [[23, "Complete the notes"], [24, "Write ONE WORD ONL"]], content: [[26, "Carnivorous Plants"], [26, "Carnivorous Plants"]] },
        { type: 'tfng', title: [28, "Questions 6–13"], intro: [[29, "Do the following s"], [33, "NOT GIVEN\tif there"]], items: [[34, "6\tPitcher plants i"], [41, "13\tPreventing wild"]] },
      ],
    },
    {
      unit: 2,
      group: PLANTS_BOTANY,
      slug: 'unit-02-a-brief-introduction-to-pepper',
      title: [47, "A Brief Introduction t"],
      body: [[50, "Pepper, the spice, c"], [56, "The huge demand for "]],
      groups: [
        { type: 'tfng', title: [58, "Questions 1–6"], intro: [[59, "Do the following s"], [63, "NOT GIVEN\tif there"]], items: [[64, "1\tCarl Linnaeus's "], [69, "6\tPink peppercorns"]] },
        { type: 'gap', title: [70, "Questions 7–13"], intro: [[71, "Complete the notes"], [72, "Choose ONE WORD ON"]], content: [[74, "The Many Uses of P"], [78, "– in wealthy house"]] },
      ],
    },
    {
      unit: 3,
      group: PLANTS_BOTANY,
      slug: 'unit-03-seaweed',
      title: [85, "Seaweed"],
      body: [[88, "since prehistoric ti"], [94, "A 2016 report from t"]],
      groups: [
        { type: 'tfng', title: [96, "Questions 1–5"], intro: [[97, "Choose TRUE if the"], [97, "Choose TRUE if the"]], items: [[98, "1\tSeaweed has been"], [102, "5\tDr Kathleen Drew"]] },
        { type: 'gap', title: [103, "Questions 6–13"], intro: [[104, "Complete the table"], [105, "Write ONE WORD ONL"]], content: [[107, "Japanese seaweed i"], [107, "Japanese seaweed i"]] },
      ],
    },
    {
      unit: 4,
      group: MARINE_OCEAN_LIFE,
      slug: 'unit-04-deep-sea-discovery',
      title: [114, "Deep sea discovery"],
      standfirst: [117, "Recent research has "],
      body: [[118, "A\tNico Michiels is a"], [125, ""]],
      footnotes: [[126, "*pigments: a pigment"], [126, "*pigments: a pigment"]],
      groups: [
        { type: 'tfng', title: [128, "Questions 1–6"], intro: [[129, "Do the following s"], [133, "NOT GIVEN\tif there"]], items: [[134, "1\tDuring his 2007 "], [139, "6\tMichiels remains"]] },
        { type: 'gap', title: [140, "Questions 7–13"], intro: [[141, "Complete the notes"], [142, "Write ONE WORD ONL"]], content: [[144, "Michiels's finding"], [144, "Michiels's finding"]] },
      ],
    },
    {
      unit: 5,
      group: MARINE_OCEAN_LIFE,
      slug: 'unit-05-leatherback-turtles',
      title: [151, "Leatherback Turtles"],
      body: [[154, "A\tLeatherback turtl"], [159, "G\tWe are often unabl"]],
      splits: [{ block: 154, at: ['B\tDuring the past month'] }],
      // The key gives Q7 only in its unit summary ("7 bony carapace"); the questions file's table: "(the) bony carapace".
      answerOverride: { 7: 'bony carapace' },
      groups: [
        { type: 'match', title: [161, "Questions 1–6"], intro: [[162, "Reading Passage 1 "], [164, "Write the correct "]], items: [[168, "1\tParagraph B"], [173, "6\tParagraph G Save"]], options: [166, "List of Headin"] },
        { type: 'short', title: [174, "Questions 7–13"], intro: [[175, "Choose words from "], [176, "Write NO MORE THAN"]], items: [[177, "7\tWhat is the most"], [183, "13\tWhat kind of sp"]], alsoAccept: { 7: ['the bony carapace'] } },
      ],
    },
    {
      unit: 6,
      group: MARINE_OCEAN_LIFE,
      slug: 'unit-06-reef-fish-study',
      title: [189, "Reef fish study"],
      standfirst: [192, "Tom Holmes examines "],
      body: [[193, "It is a widely held "], [199, "At the time of settl"]],
      groups: [
        { type: 'tfng', title: [201, "Questions 1–4"], intro: [[202, "Do the following s"], [206, "NOT GIVEN\tif there"]], items: [[207, "1\tResearch to date"], [210, "4\tFully developed "]] },
        { type: 'gap', title: [211, "Questions 5–7"], intro: [[212, "Complete the flow-"], [213, "Write NO MORE THAN"]], content: [[215, "Life cycle of fish"], [215, "Life cycle of fish"]] },
        { type: 'gap', title: [217, "Questions 8–13"], intro: [[218, "Complete the notes"], [219, "Write NO MORE THAN"]], content: [[221, "Lizard Island stud"], [221, "Lizard Island stud"]] },
      ],
    },
    {
      unit: 7,
      group: MARINE_OCEAN_LIFE,
      slug: 'unit-07-listening-to-the-ocean',
      title: [228, "Listening to the Ocean"],
      standfirst: [231, "The results of some "],
      body: [[232, "A\tThe oceans cover m"], [239, "Nystuen, for example"]],
      groups: [
        { type: 'tfng', title: [241, "Questions 1–4"], intro: [[242, "Do the following s"], [246, "NOT GIVEN\tif there"]], items: [[247, "1\tIn the past, it "], [250, "4\tHydrophones can "]] },
        { type: 'match', title: [251, "Questions 5–8"], intro: [[252, "Reading Passage 1 "], [255, "NB       You may u"]], items: [[256, "5\texamples of thin"], [259, "8\treference to a l"]], letters: "ABCDEFG" },
        { type: 'mcq', title: [260, "Questions 9–13"], intro: [[261, "Choose the correct"], [262, "Write the correct "]], items: [[263, "9\tAccording to the"], [287, "D\tmeasure variatio"]] },
      ],
    },
    {
      unit: 8,
      group: ANIMALS_WILDLIFE,
      slug: 'unit-08-health-in-the-wild',
      title: [293, "Health in the Wild"],
      standfirst: [296, "Many animals seem ab"],
      body: [[297, "For the past decade,"], [304, "Africans brought to "]],
      groups: [
        { type: 'tfng', title: [306, "Questions 1–4"], intro: [[307, "Choose TRUE if the"], [307, "Choose TRUE if the"]], items: [[308, "1\tDr Engel has spe"], [311, "4\tWild animals tak"]] },
        { type: 'gap', title: [312, "Questions 5–9"], intro: [[313, "Complete the table"], [313, "Complete the table"]], content: [[315, "Researchers | Subj"], [315, "Researchers | Subj"]], after: [[317, "Write ONE WORD ONL"], [317, "Write ONE WORD ONL"]] }, // block 319 (the table's header row printed again on its own) left out,
        { type: 'gap', title: [321, "Questions 10–13"], intro: [[322, "Complete the summa"], [323, "Write ONE WORD ONL"]], content: [[325, "Soil as medication"], [325, "Soil as medication"]] },
      ],
    },
    // Unit 9 (The Mountain Gorillas) is left out: its Questions 8–13 are scrambled in the source (the list of people
    // is mixed into the statements), which cannot be repaired by restoring letters alone. Waiting for the owner's picture.
    {
      unit: 10,
      group: ANIMALS_WILDLIFE,
      slug: 'unit-10-new-understanding-of-giraffes-in-the-wild',
      title: [370, "New Understanding of G"],
      body: [[373, "Even as the tallest "], [374, "Physical features of"]],
      groups: [
        { type: 'tfng', title: [376, "Questions 1–7"], intro: [[377, "Choose TRUE if the"], [377, "Choose TRUE if the"]], items: [[378, "1\tThe amount of re"], [384, "7\tMale giraffes ha"]] },
        { type: 'gap', title: [385, "Questions 8–13"], intro: [[386, "Complete the table"], [387, "Write ONE WORD ONL"]], content: [[389, "Physical features "], [389, "Physical features "]] },
      ],
    },
    {
      unit: 11,
      group: ANIMALS_WILDLIFE,
      slug: 'unit-11-bovids',
      title: [396, "Bovids"],
      body: [[399, "The family of mammal"], [407, "The pronghorn is the"]],
      groups: [
        { type: 'mcq', title: [409, "Questions 1–3"], intro: [[410, "Choose the correct"], [411, "Write your answers"]], items: [[412, "1\tIn which region "], [426, "D\tTheir hooves are"]] },
        { type: 'match', title: [427, "Questions 4–8"], intro: [[428, "Look at the follow"], [431, "NB You may use any"]], items: [[432, "4\tcan endure very "], [436, "8\tdoes not defend "]], columnOptions: ['List of sub-families', 'A Antelope', 'B Bovinae', 'C Caprinae', 'D Cephalophinae'] },
        { type: 'short', title: [437, "Questions 9–13"], intro: [[438, "Answer the questio"], [440, "Write your answers"]], items: [[441, "9\tWhat is the smal"], [445, "13\tWhat is the onl"]] },
      ],
    },
    {
      unit: 12,
      group: LAND_SOIL_RESOURCES,
      slug: 'unit-12-dust-and-the-american-west',
      title: [451, "Dust and the American "],
      body: [[454, "A\tImages of deserts "], [462, "I\tThe loss of snow a"]],
      groups: [
        { type: 'tfng', title: [464, "Questions 1–7"], intro: [[465, "Do the following s"], [469, "NOT GIVEN\tif there"]], items: [[470, "1\tJason Neff disco"], [476, "7\tMost of the land"]] },
        { type: 'gap', title: [477, "Questions 8–13"], intro: [[478, "Complete the notes"], [479, "Write NO MORE THAN"]], content: [[481, "American Southwest"], [481, "American Southwest"]] },
      ],
    },
    {
      unit: 13,
      group: LAND_SOIL_RESOURCES,
      slug: 'unit-13-keeping-the-water-away',
      title: [488, "Keeping the water away"],
      standfirst: [491, "New approaches to fl"],
      body: [[492, "A\tRecently, winter f"], [498, "G\tCould this be expa"]],
      groups: [
        { type: 'match', title: [500, "Questions 14–19"], intro: [[501, "Reading Passage 2 "], [503, "Write the correct "]], items: [[504, "14\thow legislation"], [509, "19\tthe writer's co"]], letters: "ABCDEFG" },
        { type: 'multi', title: [510, "Questions 20–21"], intro: [[511, "Choose TWO letters"], [512, "Write the correct "]], choose: 2, items: [[513, "According to the a"], [518, "E\tIt has been test"]], stemWithoutNumbers: true },
        { type: 'gap', title: [519, "Questions 22–26"], intro: [[520, "Complete the sente"], [522, "Write your answers"]], content: [[523, "22\tSome of the mos"], [527, "26\tA proposal for "]] },
      ],
    },
    {
      unit: 14,
      group: LAND_SOIL_RESOURCES,
      slug: 'unit-14-the-baobabs-of-madagascar',
      title: [533, "The Baobabs of Madagas"],
      standfirst: [536, "The ancient baobabs "],
      body: [[537, "The island of Madaga"], [541, ""]],
      footnotes: [[542, "* Malagasy: of Madag"], [542, "* Malagasy: of Madag"]],
      groups: [
        { type: 'tfng', title: [544, "Questions 1–6"], intro: [[545, "Choose TRUE if the"], [545, "Choose TRUE if the"]], items: [[546, "1\tAll of the baoba"], [551, "6\tThere is general"]] },
        { type: 'gap', title: [552, "Questions 7–13"], intro: [[553, "Complete the notes"], [554, "Write ONE WORD ONL"]], content: [[556, "Baobabs under thre"], [556, "Baobabs under thre"]] },
      ],
    },
    {
      unit: 15,
      group: LAND_SOIL_RESOURCES,
      slug: 'unit-15-wood-a-valuable-resource-in-new-zealands-economy',
      title: [563, "Wood: a valuable resou"],
      body: [[566, "During the settlemen"], [574, ""]],
      footnotes: [[575, "pulp*: wood which is"], [575, "pulp*: wood which is"]],
      groups: [
        { type: 'tfng', title: [577, "Questions 1–6"], intro: [[578, "Do the following s"], [582, "NOT GIVEN\tif there"]], items: [[583, "1\tSettlers realise"], [588, "6\tIn future, the e"]] },
        { type: 'gap', title: [589, "Questions 7–13"], intro: [[590, "Answer the questio"], [591, "Write NO MORE THAN"]], content: [[592, "7\tApart from excha"], [598, "13\tWhich group of "]] },
      ],
    },
    {
      unit: 16,
      group: LAND_SOIL_RESOURCES,
      slug: 'unit-16-cranberry-fruit',
      title: [604, "Cranberry Fruit"],
      body: [[607, "The story of a uniqu"], [612, "As autumn nears, rip"]],
      groups: [
        { type: 'tfng', title: [614, "Questions 1–7"], intro: [[615, "Choose TRUE if the"], [615, "Choose TRUE if the"]], items: [[616, "1\tThe cranberry re"], [628, "7\tIt took a long t"]] },
        { type: 'gap', title: [630, "Questions 8–13"], intro: [[631, "Complete the notes"], [632, "Write ONE WORD ONL"]], content: [[634, "The Cycle of Cranb"], [634, "The Cycle of Cranb"]] },
      ],
    },

  ],
};
