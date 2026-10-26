// Socio-cultural & Global Issues topic: where each part of each passage is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file, so a changed source stops the build instead of producing wrong pages.
// Sources (owner, 2026-10-27): IELTS_Reading_Passage3_Socio-cultural_Global.docx (15 units, Passage 3) and
// "AK L15- P3 Socio-cultural & Global.docx" (key for Units 3–15, explanations in Vietnamese).
// Units 1–2 have no key yet and are not built (owner's decision (a)).
const CH = 'Culture & Heritage';
const LC = 'Language & Communication';
const ES = 'Education & Society';
const WE = 'Work, Economy & Development';

export default {
  topic: 'Socio-cultural & Global Issues',
  slug: 'socio-cultural',
  numberLabel: 'Unit',
  groups: [CH, LC, ES, WE],
  keyFormat: 'units',
  questionsFile: 'IELTS_Reading_Passage3_Socio-cultural_Global.docx',
  keyFile: 'AK L15- P3 Socio-cultural & Global.docx',

  // Corrections approved by the owner (2026-10-27, decision (b)): text damaged when the passages were
  // copied from the PDF, replaced by the wording the key quotes from the original test. Unit 9's missing
  // words are the key's reconstruction and keep the key's ⟨ ⟩ brackets.
  fixes: [
    { block: 153, find: 'these remote island in the Pacific', replace: 'these remote islands in the Pacific' },
    { block: 155, find: 'identify the marker.', replace: 'identify the maker.' },
    { block: 158, find: 'fulfilled some domestic often keep offcuts from their purpose', replace: 'fulfilled some domestic purpose' },
    { block: 159, find: 'keep offcuts their dressmaking', replace: 'keep offcuts from their dressmaking' },
    { block: 160, find: 'a wish for ideals and imaginations, although both something better', replace: 'a wish for something better' },
    { block: 220, find: 'To consider if condescending is', replace: 'To call it condescending is' },
    {
      block: 447,
      find: 'its pronunciation, including that of Russian, which',
      replace: 'its pronunciation ⟨may gain or lose prestige: after the Russian Revolution, for example,⟩ ⟨the upper-class pronunciation⟩ of Russian, which',
    },
    { block: 771, find: 'required to draft a ‘sweatshops', replace: 'required to draft a letter. In these electronic ‘sweatshops' },
  ],

  passages: [
    {
      unit: 3,
      group: CH,
      slug: 'unit-03-grimms-fairy-tales',
      title: [89, 'Grimm'],
      body: [[92, 'The Brothers Grimm'], [100, 'Fairy tales provide']],
      groups: [
        { type: 'ynng', title: [102, 'Questions 27–32'], intro: [[103, 'Do the following'], [107, 'NOT GIVEN']], items: [[108, '27\t'], [113, '32\t']] },
        { type: 'mcq', title: [114, 'Questions 33–35'], intro: [[115, 'Choose the correct'], [116, 'Write your answers']], items: [[117, '33\t'], [131, 'D\t']] },
        // The instruction does not say "ending", so the question type is named here for the topic page.
        { type: 'match', typeName: 'matching sentence endings', title: [132, 'Questions 36–40'], intro: [[133, 'Write the correct letter'], [133, '']], items: [[134, '36\t'], [138, '40\t']], options: [[139, 'A\t'], [146, 'H\t']], optionsAfter: true },
      ],
    },
    {
      unit: 4,
      group: CH,
      slug: 'unit-04-new-zealand-home-textile-crafts',
      title: [149, 'New Zealand home textile'],
      standfirst: [152, 'Objects made'],
      body: [[153, 'Domestic crafts'], [160, 'These may sound']],
      groups: [
        { type: 'mcq', title: [162, 'Questions 27–32'], intro: [[163, 'Choose the correct'], [164, 'Write the correct letter in bores']], items: [[165, '27\t'], [194, 'D\t']] },
        { type: 'bank', title: [196, 'Questions 33–36'], intro: [[197, 'Complete the summary'], [198, 'Write the correct letter']], content: [[200, 'Needlework'], [200, '']], options: [202, 'A  skillful'], optionsAfter: true },
        { type: 'ynng', title: [204, 'Questions 37–40'], intro: [[205, 'Do the following'], [209, 'NOT GIVEN']], items: [[210, '37\t'], [213, '40\t']] },
      ],
    },
    {
      unit: 5,
      group: CH,
      slug: 'unit-05-australian-landscapes-at-the-royal-academy',
      title: [216, '200 Years'],
      body: [[219, 'This exhibition'], [225, 'I\t']],
      // Decision (b): paragraph A was merged into the subtitle and C, D into B in the source.
      splits: [
        { block: 219, at: ['A For the casual viewer'], first: 'standfirst', kinds: [{ letter: 'A' }] },
        { block: 220, at: ['C What Mendelssohn', 'D Because of colonial'], kinds: [{ letter: 'C' }, { letter: 'D' }] },
      ],
      groups: [
        { type: 'ynng', title: [227, 'Questions 27–31'], intro: [[228, 'Choose YES'], [228, '']], items: [[229, '27\t'], [233, '31\t']] },
        { type: 'mcq', title: [234, 'Questions 32–36'], intro: [[235, 'Choose the correct answer'], [235, '']], items: [[236, '32\t'], [260, 'D\t']] },
        { type: 'bank', title: [262, 'Questions 37–40'], intro: [[263, 'Complete each sentence'], [263, '']], options: [265, 'A\treflects'], content: [[267, 'In spite'], [267, '']] },
      ],
    },
    {
      unit: 6,
      group: CH,
      slug: 'unit-06-daily-life-in-ancient-rome',
      title: [270, 'Looking at daily life'],
      standfirst: [273, 'In this preface'],
      body: [[274, 'If our ideas'], [278, 'To perform']],
      groups: [
        { type: 'mcq', title: [280, 'Questions 27–30'], intro: [[281, 'Choose the correct letter'], [281, '']], items: [[282, '27\t'], [301, 'D\t']] },
        { type: 'ynng', title: [302, 'Questions 31–36'], intro: [[303, 'Do the following'], [307, 'NOT GIVEN']], items: [[308, '31\t'], [313, '36\t']] },
        { type: 'bank', title: [314, 'Questions 37–40'], intro: [[315, 'Complete the summary'], [316, 'Write the correct letter']], content: [[318, 'The scope'], [318, '']], options: [320, 'A  emperors'], optionsAfter: true },
      ],
    },
    {
      unit: 7,
      group: LC,
      slug: 'unit-07-the-origin-of-ancient-writing',
      title: [324, 'The Origin of Ancient Writing'],
      body: [[327, 'A\tThe Sumerians'], [336, 'J\t']],
      groups: [
        { type: 'mcq', title: [338, 'Questions 27–30'], intro: [[339, 'Choose the correct letter'], [339, '']], items: [[340, '27\t'], [359, 'D\t']] },
        { type: 'match', title: [360, 'Questions 31–36'], intro: [[361, 'Match each statement'], [362, 'NB']], options: [364, 'List of people'], items: [[366, '31\t'], [371, '36\t']] },
        { type: 'bank', title: [372, 'Questions 37–40'], intro: [[373, 'Complete the summary'], [373, '']], content: [[375, 'The earliest form'], [375, '']], options: [377, 'A  cuneiform'], optionsAfter: true },
      ],
    },
    {
      unit: 8,
      group: LC,
      slug: 'unit-08-the-origin-of-language',
      title: [381, 'The origin of language'],
      body: [[384, 'Theories on the origin'], [391, 'My book']],
      groups: [
        { type: 'mcq', title: [392, 'Questions 27–31'], intro: [[393, 'Choose the correct answer'], [393, '']], items: [[394, '27\t'], [418, 'D\t']] },
        { type: 'match', title: [419, 'Questions 32–37'], intro: [[420, 'Complete each sentence'], [420, '']], options: [422, 'List of Endings'], items: [[424, '32\t'], [429, '37\t']] },
        { type: 'multi', title: [430, 'Questions 38–40'], intro: [[431, 'Choose THREE'], [431, '']], items: [[432, '38-40'], [439, 'G\t']], choose: 3 },
      ],
    },
    {
      unit: 9,
      group: LC,
      slug: 'unit-09-the-cause-of-linguistic-change',
      title: [442, 'The Cause of Linguistic Change'],
      body: [[445, 'A\t'], [450, 'F\t']],
      groups: [
        { type: 'gap', title: [451, 'Questions 27–30'], intro: [[452, 'Complete the summary'], [454, 'Write your answers']], content: [[456, 'The pronunciation'], [456, '']] },
        { type: 'ynng', title: [458, 'Questions 31–37'], intro: [[459, 'Do the following'], [463, 'NOT GIVEN']], items: [[464, '31\t'], [470, '37\t']] },
        { type: 'match', title: [471, 'Questions 38–40'], intro: [[472, 'Look at the following sentences'], [475, 'Statements']], options: [477, 'A\tSince'], items: [[479, '38\t'], [481, '40\t']] },
      ],
    },
    {
      unit: 10,
      group: LC,
      slug: 'unit-10-verbal-and-non-verbal-messages',
      title: [484, 'A closer examination'],
      standfirst: [486, 'A study of non-verbal'],
      body: [[487, 'Description of the Study'], [500, 'Since this']],
      subs: [487, 490, 494, 499],
      groups: [
        { type: 'bank', title: [502, 'Questions 27–30'], intro: [[503, 'Complete the summary'], [504, 'Write the correct letter']], content: [[506, 'Mehrabian'], [506, '']], options: [508, 'A  facial'], optionsAfter: true },
        { type: 'ynng', title: [510, 'Questions 31–35'], intro: [[511, 'Do the following'], [515, 'NOT GIVEN']], items: [[516, '31\t'], [520, '35\t']] },
        { type: 'mcq', title: [521, 'Questions 36–40'], intro: [[522, 'Choose the correct letter'], [523, 'Write the correct letter']], items: [[524, '36\t'], [548, 'D\t']] },
      ],
    },
    {
      unit: 11,
      group: ES,
      slug: 'unit-11-how-should-reading-be-taught',
      title: [551, 'How should reading be taught'],
      standfirst: [554, 'By Keith Rayner'],
      body: [[555, 'A\t'], [565, 'Teachers need']],
      groups: [
        // Decision (c): the 8th heading is printed "vii" (a second time) and is shown as "viii".
        { type: 'match', title: [566, 'Questions 27–31'], intro: [[567, 'Reading Passage 3 has six'], [569, 'Write the correct number']], options: [571, 'List of Headings'], relabel: { 8: 'viii' }, extra: [[573, 'Example'], [573, '']], items: [[574, '27\t'], [578, '31\t']] },
        { type: 'tfng', title: [579, 'Questions 32–36'], intro: [[580, 'Do the following'], [584, 'NOT GIVEN']], items: [[585, '32\t'], [589, '36\t']] },
        { type: 'bank', title: [591, 'Questions 37–40'], intro: [[592, 'Complete the summary'], [593, 'Write the correct letter']], content: [[595, 'In the teaching'], [595, '']], inlineOptions: 'A the phonics method' },
      ],
    },
    {
      unit: 12,
      group: ES,
      slug: 'unit-12-humanities-and-the-health-professional',
      title: [599, 'Humanities And'],
      standfirst: [601, 'Professor Jock Murray'],
      body: [[602, 'In a recent meeting'], [610, 'Will involvement']],
      groups: [
        { type: 'ynng', title: [611, 'Questions 27–31'], intro: [[612, 'Do the following'], [616, 'NOT GIVEN']], items: [[617, '27\t'], [621, '31\t']] },
        { type: 'mcq', title: [622, 'Questions 32–35'], intro: [[623, 'Choose the correct letter'], [624, 'Write the correct letter']], items: [[625, '32\t'], [644, 'D\t']] },
        { type: 'match', title: [646, 'Questions 36–40'], intro: [[647, 'Complete each sentence'], [648, 'Write the correct letter']], items: [[649, '36\t'], [653, '40\t']], options: [[654, 'A\t'], [660, 'G\t']], optionsAfter: true },
      ],
    },
    {
      unit: 13,
      group: ES,
      slug: 'unit-13-an-enterprise-education-programme-in-hong-kong',
      title: [663, 'An enterprise education'],
      body: [[665, 'The Teen Entrepreneurs'], [673, 'The third aim']],
      groups: [
        { type: 'bank', title: [675, 'Questions 27–32'], intro: [[676, 'Complete the summary'], [676, '']], content: [[678, 'The Teen Entrepreneurs'], [678, '']], options: [680, 'A  management'], optionsAfter: true },
        { type: 'ynng', title: [682, 'Questions 33–36'], intro: [[683, 'Choose YES'], [683, '']], items: [[684, '33\t'], [687, '36\t']] },
        { type: 'mcq', title: [688, 'Questions 37–40'], intro: [[689, 'Choose the correct answer'], [689, '']], items: [[690, '37\t'], [709, 'D\t']] },
      ],
    },
    {
      unit: 14,
      group: WE,
      slug: 'unit-14-changes-to-the-soviet-unions-working-week',
      title: [712, 'Changes to the Soviet'],
      body: [[714, '27 '], [729, 'In November 1931']],
      // Decision (d): the example paragraph 3 (heading "iii An attempt …?") was merged into paragraph 2.
      splits: [{ block: 717, at: ['iii An attempt to create better working conditions?', 'The goals of Communism'], kinds: ['example', null] }],
      groups: [
        { type: 'headings', title: [730, 'Questions 27–34'], intro: [[731, 'Reading Passage 3 has nine'], [733, 'Example']], options: [734, 'List of Headings'] },
        { type: 'mcq', title: [736, 'Questions 35–37'], intro: [[737, 'Choose the correct answer'], [737, '']], items: [[738, '35\t'], [752, 'D\t']] },
        { type: 'short', title: [754, 'Questions 38–40'], intro: [[755, 'Answer the questions'], [756, 'Write NO MORE']], items: [[757, '38\t'], [759, '40\t']] },
      ],
    },
    {
      unit: 15,
      group: WE,
      slug: 'unit-15-the-dark-side-of-the-technological-boom',
      title: [762, 'The dark side'],
      standfirst: [765, 'What are the effects'],
      body: [[766, 'Changes in the way'], [774, 'In addition']],
      groups: [
        { type: 'match', title: [776, 'Questions 27–29'], intro: [[777, 'Complete each sentence'], [778, 'Write the correct letter']], options: [780, 'A\trequires'], items: [[781, '27\t'], [783, '29\t']] },
        { type: 'match', title: [784, 'Questions 30–35'], intro: [[785, 'Look at the following statements'], [788, 'NB']], items: [[789, '30\t'], [794, '35\t']], options: [796, 'List of people'], optionsAfter: true },
        { type: 'tfng', title: [798, 'Questions 36–40'], intro: [[799, 'Do the following'], [803, 'NOT GIVEN']], items: [[804, '36\t'], [808, '40\t']] },
      ],
    },
  ],
  // Other decisions (2026-10-27): (e) Unit 14 Q40 accepts the key's "colour-coding / colour coding / colours";
  // (f) other source typos are kept; (g) option letters added by the compiler (Units 8, 13) are kept;
  // (h) explanations + "Hướng dẫn One-Shot" + "Phân tích từng đoạn"; (i) one link per passage in Harper's Materials.
};
