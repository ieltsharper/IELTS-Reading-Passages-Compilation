// Education topic: where each part of each passage is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file, so a changed source stops the build instead of producing wrong pages.
// Sources (owner, 2026-10-27): L12_Education_Reading.docx (passages and questions) and
// "Lời giải One-Shot L12 Education.docx" (key, explanations in Vietnamese).
export default {
  topic: 'Education',
  slug: 'education',
  questionsFile: 'L12_Education_Reading.docx',
  keyFile: 'Lời giải One-Shot L12 Education.docx',
  passages: [
    {
      slug: 'passage-1-starting-school-later',
      head: [[1, 'READING PASSAGE 1'], [2, 'You should spend']],
      title: [3, 'Starting school later'],
      standfirst: [4, 'A growing body'],
      body: [[5, 'With classes'], [15, 'As the sleep research']],
      groups: [
        { type: 'tfng', title: [17, 'Questions 1-5'], intro: [[18, 'Do the following'], [20, '']], items: [[22, '1\t'], [26, '5\t']] },
        { type: 'gap', title: [27, 'Questions 6-13'], intro: [[28, 'Complete the notes'], [30, 'Write your answers']], content: [[31, 'The melatonin shift'], [31, '']] },
      ],
    },
    {
      slug: 'passage-2-the-gender-gap-in-new-zealand',
      head: [[34, 'PASSAGE 2'], [35, 'Read the text']],
      title: [36, 'THE GENDER GAP'],
      standfirst: [37, 'Results from'],
      body: [[38, 'A  The issue'], [45, 'H  Boys']],
      groups: [
        { type: 'gap', title: [47, 'Questions 14–16'], intro: [[48, 'Complete the summary'], [49, 'Write NO MORE']], content: [[50, 'HIGH SCHOOL'], [50, '']] },
        { type: 'grid', title: [52, 'Questions 17–20'], intro: [[53, 'Reading Passage 2 has eight'], [54, 'Choose the correct letter']], grid: [55, ' | A | B'] },
        { type: 'match', title: [57, 'Questions 21–26'], intro: [[58, 'Look at the following people'], [59, 'Choose each person']], options: [60, 'List of Statements'], items: [[62, '21\t'], [67, '26\t']] },
      ],
    },
    {
      slug: 'passage-3-literacy-and-rural-communities-in-australia',
      head: [[69, 'PASSAGE 3'], [70, 'Read the text']],
      title: [71, 'Literacy and Rural'],
      body: [[72, 'A  Little is known'], [78, 'G  The closeness']],
      groups: [
        { type: 'ynng', title: [80, 'Questions 27–32'], intro: [[81, 'Choose YES'], [81, '']], items: [[82, '27\t'], [87, '32\t']] },
        { type: 'grid', title: [88, 'Questions 33–37'], intro: [[89, 'Reading Passage 3 has seven'], [90, 'NB']], grid: [91, ' | A | B'] },
        { type: 'multi', title: [93, 'Questions 38–40'], intro: [[94, 'Choose THREE'], [94, '']], items: [[95, '38-40'], [102, '☐']], choose: 3 },
      ],
    },
    {
      slug: 'passage-4-babies-cry-in-their-mother-tongue',
      head: [[104, 'PASSAGE 2'], [105, 'Read the text']],
      title: [106, 'Babies cry'],
      standfirst: [107, 'A newborn baby'],
      body: [[108, 'A  It is already known'], [115, 'H  The results']],
      groups: [
        { type: 'match', title: [117, 'Questions 14–19'], intro: [[118, 'Reading Passage 2 has eight'], [121, 'NB']], letters: 'ABCDEFGH', items: [[122, '14\t'], [127, '19\t']] },
        { type: 'match', title: [128, 'Questions 20–23'], intro: [[129, 'Look at the following statements'], [132, 'NB']], options: [133, 'List of researchers'], items: [[135, '20\t'], [138, '23\t']] },
        { type: 'gap', title: [139, 'Questions 24–26'], intro: [[140, 'Complete the sentences'], [141, 'Write ONE WORD ONLY']], content: [[142, 'Professor Amelia'], [144, 'Early scientists']] },
      ],
    },
    {
      slug: 'passage-5-the-role-of-mother-tongue-language-in-education',
      head: [[146, 'READING PASSAGE 3'], [147, 'You should spend']],
      title: [148, 'The significant role'],
      body: [[149, 'One consequence'], [155, 'Many people marvel']],
      groups: [
        { type: 'mcq', title: [157, 'Questions 27-30'], intro: [[158, 'Choose the correct letter'], [159, 'Write the correct letter']], items: [[160, '27\t'], [179, 'D.\t']] },
        { type: 'bank', title: [180, 'Questions 31-35'], intro: [[181, 'Complete the summary using'], [182, 'Write the correct letter']], content: [[183, 'Bilingual Children'], [183, '']], options: [185, 'A | teachers'], optionsAfter: true },
        { type: 'ynng', title: [187, 'Questions 36-40'], intro: [[188, 'Do the following'], [190, '']], items: [[192, '36\t'], [196, '40\t']] },
      ],
    },
    {
      slug: 'passage-6-practical-learning-in-the-classroom',
      head: [],
      title: [198, 'Practical Learning'],
      standfirst: [199, 'A teacher describes'],
      body: [[200, 'A  The way we think'], [208, 'I  During our']],
      footnotes: [[210, '*adobe'], [211, '**stucco']],
      groups: [
        { type: 'mcq', title: [213, 'Questions 27–31'], intro: [[214, 'Choose the correct answer.'], [214, '']], items: [[215, '27\t'], [239, '☐\t']] },
        { type: 'bank', title: [240, 'Questions 32–36'], intro: [[241, 'Complete the summary using'], [241, '']], content: [[244, 'The Zuni'], [244, '']], options: [242, 'A | experts'] },
        { type: 'ynng', title: [246, 'Questions 37–40'], intro: [[247, 'Choose YES'], [249, 'or NOT GIVEN']], items: [[250, '37\t'], [253, '40\t']] },
      ],
    },
    {
      slug: 'passage-7-the-effectiveness-of-an-online-course',
      head: [[255, 'READING PASSAGE 3'], [256, 'You should spend']],
      title: [257, 'The effectiveness'],
      body: [[258, 'As access'], [266, 'The success']],
      groups: [
        { type: 'mcq', title: [268, 'Questions 27-31'], intro: [[269, 'Choose the correct letter'], [270, 'Write the correct letter']], items: [[271, '27.\t'], [295, 'D.\t']] },
        { type: 'ynng', title: [296, 'Questions 32-36'], intro: [[297, 'Do the following'], [299, '']], items: [[301, '32.\t'], [305, '36.\t']] },
        { type: 'match', title: [306, 'Questions 37-40'], intro: [[307, 'Complete each sentence'], [308, 'Write the correct letter']], items: [[309, '37.\t'], [312, '40.\t']], options: [314, 'A. is dependent'], optionsAfter: true },
      ],
    },
    {
      slug: 'passage-8-iq-scores',
      head: [],
      title: [317, 'IQ Scores'],
      standfirst: [318, 'How they are changing'],
      body: [[319, 'A  Studies'], [326, 'F  Flynn']],
      groups: [
        { type: 'grid', title: [328, 'Questions 14–18'], intro: [[329, 'Look at the following statements'], [331, 'NB']], options: [332, 'List of people'], grid: [334, ' | A | B'] },
        { type: 'grid', title: [336, 'Questions 19–22'], intro: [[337, 'Reading Passage 2 has six'], [339, 'Choose the correct letter']], grid: [340, ' | A | B'] },
        { type: 'gap', title: [342, 'Questions 23–26'], intro: [[343, 'Complete the summary'], [344, 'Write NO MORE']], content: [[345, 'James Flynn'], [345, '']] },
      ],
    },
  ],
  // Decisions agreed with the owner (2026-10-27), applied by the generator:
  // (b) options printed as ☐ get the letters the key uses (A, B, C, ... in order).
  // (d) P5 Q37: the key's keyword table shows both NOT GIVEN and NO; the answer table and explanation
  //     say NOT GIVEN, which is the only accepted answer (the answer table is the source of answers).
  // (g) completion answers written "X (Y)" in the explanation heading accept both X and Y (P1 Q11).
};
