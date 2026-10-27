// Psychology topic, Reading Passage 3 (Questions 27–40): where each part of each unit is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file (after the fixes below), so a changed source stops the build.
// Sources (owner, 2026-10-27): IELTS_Reading_Passage3_Psychology.docx (19 units, each with its own answer table)
// and "AK IELTS_Reading_Passage3_Psychology.docx" (key: answer tables + notes + "Chẻ nhỏ câu dài khó").
// Decisions agreed with the owner (2026-10-27):
// (a) own topic "Psychology – Passage 3" (seed batch 6); (b) Unit 3 Q27 = C, as the key file says;
// (c) Unit 4 is left out until the owner sends its A–K word list; (d) not built (Unit 4);
// (e) text damaged by drop caps restored, with the restored letter in ⟨ ⟩ (Unit 9; Unit 2 has the same damage);
// (f) Unit 18's phrase list is shown as written (E twice); (g) small source slips kept as written;
// (h) the key's answer for arguable questions, with its note; (i) both written forms accepted;
// (j) the questions file's source/key notes and difficulty table are not shown; the key's Unit 18 note is left out.
const PS = 'Personality, Self-control & Social Influence';
const PB = 'Perception & the Brain';
const LS = 'Learning, Skill & Development';
const PC = 'Persuasion & Consumer Behaviour';

export default {
  topic: 'Psychology – Passage 3',
  slug: 'psychology-p3',
  numberLabel: 'Unit',
  groups: [PS, PB, LS, PC],
  keyFormat: 'tables',
  keyNotesAfterAnswers: true,
  omitKeyNotes: ['Ghi chú: bài này cũng nằm trong VOL 4'],
  questionsFile: 'IELTS_Reading_Passage3_Psychology.docx',
  keyFile: 'AK IELTS_Reading_Passage3_Psychology.docx',
  fixes: [
    // Decision (e): a drop cap took the first letter of the question and left it at the end (Unit 2) or on its own line (Unit 9).
    { block: 74, find: '33\the writer', replace: '33\t⟨T⟩he writer' },
    { block: 74, find: 'to mean T', replace: 'to mean' },
    { block: 79, find: '34\the writer', replace: '34\t⟨T⟩he writer' },
    { block: 79, find: 'actions T', replace: 'actions' },
    { block: 84, find: '35\the writer', replace: '35\t⟨T⟩he writer' },
    { block: 84, find: 'sport is to T', replace: 'sport is to' },
    { block: 452, find: '27\that', replace: '27\t⟨W⟩hat' },
    { block: 452, find: 'first W paragraph', replace: 'first paragraph' },
    { block: 457, find: '28\that', replace: '28\t⟨W⟩hat' },
    { block: 458, find: 'W', replace: '' },
    { block: 462, find: '29\that', replace: '29\t⟨W⟩hat' },
    { block: 462, find: 'musical W ability', replace: 'musical ability' },
    { block: 472, find: '31\that', replace: '31\t⟨W⟩hat' },
    { block: 473, find: 'W', replace: '' },
    // Option-list headings run into the last question; the heading is dropped so the question reads correctly.
    { block: 401, find: " List of Claims", replace: '' },
    { block: 426, find: ' Lists of Endings', replace: '' },
    // Unit 18's subtitle starts with the article "A", which the source set off with a tab like a paragraph letter.
    { block: 997, find: 'A\tNew Zealand', replace: 'A New Zealand' },
  ],
  passages: [
    {
      unit: 1,
      group: PS,
      slug: 'unit-01-conformity',
      title: [8, "Conformity"],
      standfirst: [11, "A review of"],
      body: [[12, "During your"], [18, "So why is it that we"]],
      groups: [
        { type: 'ynng', title: [20, "Questions 27–30"], intro: [[21, "Do the following"], [25, "NOT GIVEN\tif it is"]], items: [[26, "27\tChildhood crazes"], [29, "30\tCrutchfield's"]] },
        { type: 'gap', title: [30, "Questions 31–35"], intro: [[31, "Complete the summary"], [32, "Choose ONE WORD ONLY"]], content: [[34, "Studies on conformity"], [36, "answer."]], alsoAccept: {34: ['wrong']} },
        { type: 'gap', title: [37, "Questions 36–40"], intro: [[38, "Complete the notes"], [40, "Write your answers in"]], content: [[42, "Kelman's processes of"], [42, "Kelman's processes of"]], gapOrder: [36, 38, 37, 39, 40], alsoAccept: {37: ['internalisation']} },
      ],
    },
    {
      unit: 2,
      group: PS,
      slug: 'unit-02-inside-the-mind-of-a-fan',
      title: [49, "Inside the mind of a"],
      standfirst: [52, "How watching sport"],
      body: [[53, "A\tAt about the same"], [58, "F\tBut how many of us"]],
      groups: [
        { type: 'match', title: [60, "Questions 27–32"], intro: [[61, "Reading Passage 3 has"], [64, "NB You may use any"]], letters: 'ABCDEF', items: [[65, "27\tAn explanation of"], [70, "32\ta claim linking"]] },
        { type: 'mcq', title: [71, "Questions 33–35"], intro: [[72, "Choose the correct"], [73, "Write your answers in"]], items: [[74, "33\t⟨T⟩he writer"], [88, "D\trealize what skill"]] },
        { type: 'ynng', title: [89, "Questions 36–40"], intro: [[90, "Do the following"], [94, "NOT GIVEN\tif the"]], items: [[95, "36\tInexpert sports"], [99, "40\tThe mu system is"]] },
      ],
    },
    {
      unit: 3,
      group: PS,
      slug: 'unit-03-the-art-of-deception',
      title: [105, "The art of deception"],
      standfirst: [108, "Do tiny changes of"],
      body: [[109, "Forty years ago, the"], [115, "Ekman, incidentally,"]],
      groups: [
        { type: 'mcq', title: [117, "Questions 27–31"], intro: [[118, "Choose the correct"], [119, "Write the correct"]], items: [[120, "27\tAccording to the"], [144, "D\tThey can be used by"]] },
        { type: 'bank', title: [145, "Questions 32–36"], intro: [[146, "Complete the summary"], [147, "Write the correct"]], content: [[149, "The television series"], [149, "The television series"]], inlineOptions: ' A consequences' },
        { type: 'tfng', title: [151, "Questions 37–40"], intro: [[152, "Do the following"], [156, "NOT GIVEN\tif there is"]], items: [[157, "37\tEkman regrets the"], [160, "40\tEkman is more"]] },
      ],
    },
    {
      unit: 5,
      group: PS,
      slug: 'unit-05-willpower',
      title: [219, "Willpower"],
      body: [[222, "Although willpower"], [227, "Willpower is clearly"]],
      groups: [
        { type: 'tfng', title: [229, "Questions 27–33"], intro: [[230, "Do the following"], [234, "NOT GIVEN\tif there is"]], items: [[235, "27\tWillpower is the"], [241, "33\tRegular physical"]] },
        { type: 'match', title: [242, "Questions 34–39"], intro: [[243, "Look at the following"], [246, "NB You may use some"]], options: [254, "List of People"], items: [[247, "34\tidentified a key"], [252, "39\tfound that"]], optionsAfter: true },
        { type: 'mcq', title: [256, "Questions 40"], items: [[257, "40\tWhich of the"], [261, "D\tenvironmental cues"]] },
      ],
    },
    {
      unit: 6,
      group: PB,
      slug: 'unit-06-when-the-senses-mix-together',
      title: [267, "When the senses mix"],
      body: [[270, "A\tWhat is the colour"], [278, "I\tSo which is it? At"]],
      groups: [
        { type: 'match', title: [280, "Questions 27–30"], intro: [[281, "Look at the following"], [284, "NB You may use any"]], options: [286, "List of People"], items: [[288, "27\tFor synesthetes,"], [291, "30\tBecause"]] },
        { type: 'match', title: [292, "Questions 31–35"], intro: [[293, "Reading Passage 3 has"], [296, "NB You may use any"]], letters: 'ABCDEFGHI', items: [[297, "31\tan investigation"], [301, "35\ta reason why some"]] },
        { type: 'tfng', title: [302, "Questions 36–40"], intro: [[303, "Choose TRUE if the"], [303, "Choose TRUE if the"]], items: [[304, "36\tThe painter"], [308, "40\tIt is possible"]] },
      ],
    },
    {
      unit: 7,
      group: PB,
      slug: 'unit-07-the-placebo-effect',
      title: [314, "The Placebo Effect"],
      standfirst: [317, "With the right"],
      body: [[318, "Want to devise a new"], [325, "Warm, friendly and"]],
      groups: [
        { type: 'match', title: [327, "Questions 27–31"], intro: [[328, "Complete each"], [329, "Write the correct"]], options: [[335, "A\tshould be easy to"], [342, "H\tshould be able to"]], items: [[330, "27\tAn appointment"], [334, "31\tConventional"]], optionsAfter: true },
        { type: 'mcq', title: [343, "Questions 32–34"], intro: [[344, "Choose the correct"], [345, "Write the correct"]], items: [[346, "32\tIn the third"], [360, "D\tTheir pain-relieving"]] },
        { type: 'ynng', title: [361, "Questions 35–40"], intro: [[362, "Do the following"], [366, "NOT GIVEN\tif it is"]], items: [[367, "35\tScientists now"], [372, "40\tAlternative"]] },
      ],
    },
    {
      unit: 8,
      group: PB,
      slug: 'unit-08-blind-to-change',
      title: [378, "Blind to Change"],
      standfirst: [381, "How much of the world"],
      body: [[382, "Picture the following"], [394, "According to O'Regan,"]],
      groups: [
        { type: 'match', title: [396, "Questions 27–30"], intro: [[397, "Look at the following"], [397, "Look at the following"]], options: [[402, "A\tPeople overlook"], [408, "G\tImagining a scene"]], items: [[398, "27\tDaniel Dennett"], [401, "30\tKevin O'Regan"]], optionsAfter: true },
        { type: 'tfng', title: [409, "Questions 31–35"], intro: [[410, "Do the following"], [414, "NOT GIVEN\tif there is"]], items: [[415, "31\tOne expert"], [419, "35\tOur eyes are only"]] },
        { type: 'match', title: [420, "Questions 36–40"], intro: [[421, "Complete each"], [421, "Complete each"]], options: [[427, "A\tis not backed by"], [433, "G\thelps us see the"]], items: [[422, "36\tConcentrating on a"], [426, "40\tResearch into the"]], optionsAfter: true },
      ],
    },
    {
      unit: 9,
      group: PB,
      slug: 'unit-09-when-people-are-deaf-to-music',
      title: [439, "When People Are"],
      body: [[442, "A\tMusic has long been"], [448, "G\tWhile the idea of"]],
      groups: [
        { type: 'mcq', title: [450, "Questions 27–31"], intro: [[451, "Choose the correct"], [451, "Choose the correct"]], items: [[452, "27\t⟨W⟩hat does"], [475, "A\tclaiming that"]] },
        { type: 'ynng', title: [477, "Questions 32–35"], intro: [[478, "Do the following"], [482, "NOT GIVEN\tif it is"]], items: [[483, "32\tPeretz's research"], [486, "35\tPeople with amusia"]] },
        { type: 'match', title: [487, "Questions 36–40"], intro: [[488, "Complete each"], [488, "Complete each"]], options: [[494, "A\tan inability to"], [501, "H\tassociated with"]], items: [[489, "36\tThe reason why"], [493, "40\tIn most cultures,"]], optionsAfter: true },
      ],
    },
    {
      unit: 10,
      group: PB,
      slug: 'unit-10-mapping-the-mind',
      title: [507, "Mapping the Mind"],
      standfirst: [510, "Dr. Simon Hanson"],
      body: [[511, "The often-used phrase"], [518, "From our unique place"]],
      groups: [
        { type: 'ynng', title: [520, "Questions 27–32"], intro: [[521, "Do the following"], [525, "NOT GIVEN\tif it is"]], items: [[526, "27\tOur sense of what"], [531, "32\tMapping the Mind"]] },
        { type: 'mcq', title: [532, "Questions 33–37"], intro: [[533, "Choose the correct"], [534, "Write the correct"]], items: [[535, "33\tAccording to the"], [559, "D\tits illustrations"]] },
        { type: 'match', title: [560, "Questions 38–40"], intro: [[561, "Complete each"], [562, "Write the correct"]], options: [[566, "A\tmakes a background"], [572, "G\thas no clear"]], items: [[563, "38\tA book that uses"], [565, "40\tThe inclusion of"]], optionsAfter: true },
      ],
    },
    {
      unit: 11,
      group: LS,
      slug: 'unit-11-looking-for-inspiration',
      title: [578, "Looking for"],
      standfirst: [581, "Helen Phillips asks"],
      body: [[582, "People have"], [591, "Another often"]],
      groups: [
        { type: 'match', title: [593, "Questions 27–32"], intro: [[594, "Look at the following"], [597, "NB You may use any"]], options: [605, "List of People"], items: [[598, "27\tCreative people"], [603, "32\tCreative people"]], optionsAfter: true },
        { type: 'gap', title: [607, "Questions 33–36"], intro: [[608, "Complete the summary"], [610, "Write your answers in"]], content: [[612, "Colin Martindale"], [612, "Colin Martindale"]], pairs: [34], alsoAccept: {33: ['electrodes', 'scalp electrodes']} },
        { type: 'tfng', title: [614, "Questions 37–40"], intro: [[615, "Do the following"], [618, "NOT GIVEN\tif there is"]], items: [[619, "37\tPeople with very"], [622, "40\tLanguage skills"]] },
      ],
    },
    {
      unit: 12,
      group: LS,
      slug: 'unit-12-understanding-symbols',
      title: [628, "Understanding symbols"],
      standfirst: [631, "Judy DeLoache"],
      body: [[632, "A\tAbout 20 years ago"], [641, "J\tPresumably, the"]],
      groups: [
        { type: 'mcq', title: [643, "Questions 27–32"], intro: [[644, "Choose the correct"], [644, "Choose the correct"]], items: [[645, "27\tIn the first"], [674, "D\t3-D books help"]] },
        { type: 'match', title: [675, "Questions 33–35"], intro: [[676, "Complete each"], [676, "Complete each"]], options: [678, "List of Endings"], items: [[680, "33\tThe test involving"], [682, "35\tThe maths"]] },
        { type: 'ynng', title: [683, "Questions 36–40"], intro: [[684, "Choose YES if the"], [684, "Choose YES if the"]], items: [[685, "36\tThe results of the"], [689, "40\tChildren enjoy"]] },
      ],
    },
    {
      unit: 13,
      group: LS,
      slug: 'unit-13-jean-piaget',
      title: [695, "Jean Piaget 1896-1980"],
      standfirst: [698, "Seymour Papert looks"],
      body: [[699, "Jean Piaget spent"], [708, "The core of Piaget is"]],
      groups: [
        { type: 'mcq', title: [710, "Questions 27–31"], intro: [[711, "Choose the correct"], [712, "Write the correct"]], items: [[713, "27\tIn the second"], [737, "D\texpress doubts"]] },
        { type: 'bank', title: [738, "Questions 32–36"], intro: [[739, "Complete the summary"], [740, "Write the correct"]], content: [[742, "Piaget maintained"], [742, "Piaget maintained"]], inlineOptions: ' A. correct', optionsAnyOrder: true },
        { type: 'ynng', title: [744, "Questions 37–40"], intro: [[745, "Do the following"], [749, "NOT GIVEN\tif it is"]], items: [[750, "37\tPiaget's early"], [753, "40\tWe still have much"]] },
      ],
    },
    {
      unit: 14,
      group: LS,
      slug: 'unit-14-what-makes-a-musical-expert',
      title: [759, "What makes a musical"],
      standfirst: [762, "How does someone"],
      body: [[763, "Does that class of"], [770, "The classic rebuttal"]],
      groups: [
        { type: 'mcq', title: [772, "Questions 27–30"], intro: [[773, "Choose the correct"], [774, "Write the correct"]], items: [[775, "27\tIn the first"], [794, "D\texpertise may be"]] },
        { type: 'ynng', title: [795, "Questions 31–36"], intro: [[796, "Do the following"], [800, "NOT GIVEN\tif it is"]], items: [[801, "31\tAnders Ericsson's"], [806, "36\tExisting knowledge"]] },
        { type: 'bank', title: [807, "Questions 37–40"], intro: [[808, "Complete the summary"], [809, "Write the correct"]], content: [[811, "Mozart"], [811, "Mozart"]], inlineOptions: ' A popular', footnotesFrom: {at: '[1] Pleistocene', split: ['[2] individuals']} },
      ],
    },
    {
      unit: 15,
      group: LS,
      slug: 'unit-15-the-benefits-of-learning-an-instrument',
      title: [818, "The benefits of"],
      standfirst: [821, "Studies show that"],
      body: [[822, "A\tAre music lessons"], [827, "F\tIn another study at"]],
      groups: [
        { type: 'tfng', title: [829, "Questions 27–30"], intro: [[830, "Choose TRUE if the"], [830, "Choose TRUE if the"]], items: [[831, "27\tMany parents"], [834, "30\tEvidence about the"]] },
        { type: 'mcq', title: [835, "Questions 31–35"], intro: [[836, "Choose the correct"], [836, "Choose the correct"]], items: [[837, "31\tThe studies"], [861, "D\tLevel of education"]] },
        { type: 'match', title: [862, "Questions 36–40"], intro: [[863, "Complete each"], [863, "Complete each"]], options: [865, "List of Endings"], items: [[867, "36\tBrenda"], [871, "40\tJennifer Bugos's"]] },
      ],
    },
    {
      unit: 16,
      group: PC,
      slug: 'unit-16-the-psychology-of-new-product-adoption',
      title: [877, "The psychology of new"],
      standfirst: [880, "John Gourville"],
      body: [[881, "An American"], [888, "In a perfect world,"]],
      groups: [
        { type: 'mcq', title: [890, "Questions 27–32"], intro: [[891, "Choose the correct"], [891, "Choose the correct"]], items: [[892, "27\tIn the first"], [921, "D\tHalf of the"]] },
        { type: 'bank', title: [922, "Questions 33–35"], intro: [[923, "Complete each"], [923, "Complete each"]], options: [[925, "A\tconsumers do not"], [927, "F \"loss aversion\" can"]], content: [[928, "The theory of"], [928, "The theory of"]] },
        { type: 'ynng', title: [929, "Questions 36–40"], intro: [[930, "Choose YES if the"], [930, "Choose YES if the"]], items: [[931, "36\tEverett Rogers'"], [935, "40\tA product champion"]] },
      ],
    },
    {
      unit: 17,
      group: PC,
      slug: 'unit-17-the-science-of-shopping',
      title: [941, "The Science of"],
      body: [[944, "You may have wondered"], [951, "This ‘shopping"]],
      groups: [
        { type: 'mcq', title: [953, "Questions 27–30"], intro: [[954, "Choose the correct"], [954, "Choose the correct"]], items: [[955, "27\tWhat does the"], [974, "D\tThey are confused"]] },
        { type: 'ynng', title: [975, "Questions 31–35"], intro: [[976, "Choose YES if the"], [976, "Choose YES if the"]], items: [[977, "31\tCheaper products"], [981, "35\tTechnology is the"]] },
        { type: 'bank', title: [982, "Questions 36–40"], intro: [[983, "Complete the summary"], [983, "Complete the summary"]], options: [987, "A  brain scans | B"], content: [[985, "New technology could"], [985, "New technology could"]], optionsAfter: true },
      ],
    },
    {
      unit: 18,
      group: PC,
      slug: 'unit-18-the-power-of-persuasion',
      title: [994, "The Power of"],
      standfirst: [997, "A New Zealand"],
      body: [[998, "Some scientists peer"], [1004, "Many of Cialdini's"]],
      groups: [
        { type: 'mcq', title: [1006, "Questions 27–31"], intro: [[1007, "Choose the correct"], [1008, "Write the correct"]], items: [[1009, "27\tWhat point is the"], [1033, "D\tresponded more"]] },
        { type: 'bank', title: [1034, "Questions 32–36"], intro: [[1035, "Complete the summary"], [1036, "Write the correct"]], content: [[1038, "The six principles of"], [1038, "The six principles of"]], inlineOptions: ' A rare opportunity' },
        { type: 'ynng', title: [1040, "Questions 37–40"], intro: [[1041, "Do the following"], [1045, "NOT GIVEN\tif it is"]], items: [[1046, "37\tThe writer sees"], [1049, "40\tOlder New"]] },
      ],
    },
    {
      unit: 19,
      group: PC,
      slug: 'unit-19-marketing-and-mind-control',
      title: [1055, "Marketing and Mind"],
      standfirst: [1058, "How marketing and"],
      body: [[1059, "While there had been"], [1066, "Imitation is"]],
      groups: [
        { type: 'mcq', title: [1068, "Questions 27–31"], intro: [[1069, "Choose the correct"], [1070, "Write the correct"]], items: [[1071, "27\tAccording to the"], [1095, "D\tIt features"]] },
        { type: 'ynng', title: [1096, "Questions 32–36"], intro: [[1097, "Do the following"], [1101, "NOT GIVEN\tif it is"]], items: [[1102, "32\tThe diamond"], [1106, "36\tConsumers make a"]] },
        { type: 'match', title: [1107, "Questions 37–40"], intro: [[1108, "Complete each"], [1109, "Write the correct"]], options: [[1114, "A\tpeople imitated"], [1120, "G\tincentives are"]], items: [[1110, "37\tThe behaviour of"], [1113, "40\tA feature of some"]], optionsAfter: true },
      ],
    },
  ],
};
