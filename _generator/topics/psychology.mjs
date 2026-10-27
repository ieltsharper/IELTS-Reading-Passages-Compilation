// Psychology topic (Reading Passage 1): where each part of each passage is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file, so a changed source stops the build instead of producing wrong pages.
// Sources (owner, 2026-10-27): IELTS_Reading_Passage1_Psychology.docx (9 units) and
// IELTS_Reading_Psychology_Giai_Chi_Tiet.docx (key: answer tables + "Chẻ nhỏ câu dài khó", in Vietnamese).
// Decisions agreed with the owner (2026-10-27):
// (a) damaged sentences and name typos are kept as written; (b) Unit 3's subtitle is Unit 6's and is left off;
// (c) Unit 3 Q4–5 accept the two words in either order; (d) Unit 7 Q1 has two blanks worth one mark;
// (e) Unit 5's jumbled table is shown as written; (f) Unit 9 Q10 and Q13 also accept "the …";
// (g) the key's Unit 9 note is shown, its Unit 5 "ĐỐI CHIẾU" note (a chat leftover) is left out, and the key's
// "Các bẫy lặp lại trong đề" list is shown on the topic page; (h) one Materials link per unit (seed batch 5).
const EW = 'Emotion & Wellbeing';
const DA = 'Development & Ageing';
const LI = 'Learning & Intelligence';
const AP = 'Attention & Perception';

export default {
  topic: 'Psychology',
  slug: 'psychology',
  numberLabel: 'Unit',
  groups: [EW, DA, LI, AP],
  keyFormat: 'tables',
  omitKeyNotes: ['ĐỐI CHIẾU Q8'],
  questionsFile: 'IELTS_Reading_Passage1_Psychology.docx',
  keyFile: 'IELTS_Reading_Psychology_Giai_Chi_Tiet.docx',
  passages: [
    {
      unit: 1,
      group: EW,
      slug: 'unit-01-optimism-and-health',
      title: [3, 'Optimism and Health'],
      standfirst: [6, 'If you have a positive outlook'],
      body: [[7, 'Medical studies'], [16, 'Myers is sceptical']],
      groups: [
        { type: 'gap', title: [18, 'Questions 1–5'], intro: [[19, 'Complete the summary'], [20, 'Write NO MORE']], content: [[22, 'Studies at Yale'], [22, '']] },
        { type: 'match', title: [24, 'Questions 6–10'], intro: [[25, 'Complete each sentence'], [25, '']], options: [27, 'List of Endings'], items: [[29, '6\t'], [33, '10\t']] },
        { type: 'ynng', title: [34, 'Questions 11–13'], intro: [[35, 'Choose YES'], [35, '']], items: [[36, '11\t'], [38, '13\t']] },
      ],
    },
    {
      unit: 2,
      group: EW,
      slug: 'unit-02-how-to-be-happy',
      title: [41, 'How to be Happy'],
      standfirst: [44, 'Some recent developments'],
      body: [[45, 'A\t'], [50, 'F\t']],
      groups: [
        { type: 'match', title: [52, 'Questions 1–4'], intro: [[53, 'Reading Passage 1 has six'], [55, 'NB']], letters: 'ABCDEF', items: [[56, '1\t'], [59, '4\t']] },
        { type: 'match', title: [60, 'Questions 5–8'], intro: [[61, 'Look at the following statements'], [62, 'Write the correct letter']], items: [[63, '5\t'], [66, '8\t']], options: [68, 'List of People'], optionsAfter: true },
        { type: 'gap', title: [70, 'Questions 9–13'], intro: [[71, 'Complete the summary'], [72, 'Choose ONE WORD']], content: [[74, 'Auckland University'], [74, '']] },
      ],
    },
    {
      unit: 3,
      group: DA,
      slug: 'unit-03-how-the-mind-ages',
      title: [78, 'How the mind ages'],
      // Decision (b): block 81, the subtitle printed here, is Unit 6's ("John McCrone explains …") and is left off.
      body: [[82, 'The way mental function'], [89, 'On a more optimistic']],
      groups: [
        { type: 'mcq', title: [90, 'Questions 1–3'], intro: [[91, 'Choose the correct letter'], [92, 'Write the correct letter']], items: [[93, '1\t'], [108, 'D\t']] },
        // Decision (c): 4 and 5 (semantic / episodic) may be given in either order.
        { type: 'gap', title: [109, 'Questions 4–9'], intro: [[110, 'Complete the summary'], [112, 'Write your answers']], content: [[114, 'Types of memory'], [114, '']], unordered: [[4, 5]] },
        { type: 'match', title: [116, 'Questions 10–13'], intro: [[117, 'Look at the following statements'], [119, 'Write the correct letter']], items: [[120, '10\t'], [123, '13\t']], options: [125, 'List of People'], optionsAfter: true },
      ],
    },
    {
      unit: 4,
      group: DA,
      slug: 'unit-04-developmental-tasks-of-normal-adolescence',
      title: [128, 'Developmental tasks'],
      body: [[131, 'Some years ago'], [141, 'The adolescent must develop increased']],
      groups: [
        { type: 'match', title: [143, 'Questions 1–6'], intro: [[144, 'Classify the following'], [144, '']], letters: 'ABC', typeName: 'classification', items: [[145, '1\t'], [150, '6\t']] },
        { type: 'match', title: [151, 'Questions 7–10'], intro: [[152, 'Complete each sentence'], [153, 'Write the correct letter']], items: [[154, '7\t'], [157, '10\t']], options: [[158, 'A\t'], [162, 'E\t']], optionsAfter: true },
        { type: 'tfng', title: [163, 'Questions 11–13'], intro: [[164, 'Do the following'], [168, 'NOT GIVEN']], items: [[169, '11\t'], [171, '13\t']] },
      ],
    },
    {
      unit: 5,
      group: LI,
      slug: 'unit-05-multiple-intelligences',
      title: [174, 'Multiple Intelligences'],
      standfirst: [177, 'The Implications'],
      body: [[178, 'The first intelligence test'], [208, 'The fluid theory']],
      subs: [187, 205],
      groups: [
        { type: 'tfng', title: [209, 'Questions 1–4'], intro: [[210, 'Do the following'], [214, 'NOT GIVEN']], items: [[215, '1\t'], [218, '4\t']] },
        { type: 'gap', title: [219, 'Questions 5–10'], intro: [[220, 'Complete the table'], [222, 'Write your answer']], content: [[224, 'Intelligence type'], [224, '']] },
        { type: 'gap', title: [226, 'Questions 11–13'], intro: [[227, 'Complete the sentences'], [229, 'Write your answers']], content: [[230, '11\t'], [232, '13\t']] },
      ],
    },
    {
      unit: 6,
      group: LI,
      slug: 'unit-06-mental-gymnastics',
      title: [235, 'Mental Gymnastics'],
      standfirst: [238, 'John McCrone explains'],
      body: [[239, 'The working day'], [250, 'Nevertheless, Claxton']],
      groups: [
        { type: 'ynng', title: [252, 'Questions 1–5'], intro: [[253, 'Do the following'], [257, 'NOT GIVEN']], items: [[258, '1\t'], [262, '5\t']] },
        { type: 'match', title: [263, 'Questions 6–13'], intro: [[264, 'Look at the following statements'], [267, 'NB']], items: [[268, '6\t'], [275, '13\t']], options: [277, 'List of People'], optionsAfter: true },
      ],
    },
    {
      unit: 7,
      group: LI,
      slug: 'unit-07-becoming-an-expert',
      title: [281, 'Becoming an Expert'],
      standfirst: [284, 'What is the nature of expertise'],
      body: [[285, 'Expertise is commitment'], [297, 'The very method']],
      subs: [293],
      groups: [
        // Decision (d): question 1 has two blanks ("1 …… and ……"), one mark when both are right, either order.
        { type: 'gap', title: [299, 'Questions 1–5'], intro: [[300, 'Complete the flow-chart'], [302, 'Write your answers']], content: [[304, 'Novices'], [304, '']], pairs: [1] },
        { type: 'tfng', title: [306, 'Questions 6–10'], intro: [[307, 'Do the following'], [311, 'NOT GIVEN']], items: [[312, '6\t'], [316, '10\t']] },
        { type: 'gap', title: [317, 'Questions 11–13'], intro: [[318, 'Complete the following summary'], [320, 'Write your answers']], content: [[322, 'The Contradiction'], [322, '']] },
      ],
    },
    {
      unit: 8,
      group: AP,
      slug: 'unit-08-sorry-who-are-you',
      title: [326, 'Sorry - Who Are You'],
      standfirst: [329, 'Prosopagnosia is a medical'],
      body: [[330, 'It was Jacob Hodes'], [338, 'Thomas Gruter']],
      groups: [
        { type: 'tfng', title: [340, 'Question 1–7'], intro: [[341, 'Do the following'], [345, 'NOT GIVEN']], items: [[346, '1\t'], [352, '7\t']] },
        { type: 'gap', title: [353, 'Questions 8–13'], intro: [[354, 'Complete the notes'], [355, 'Choose ONE WORD']], content: [[357, 'The challenges'], [357, '']] },
      ],
    },
    {
      unit: 9,
      group: AP,
      slug: 'unit-09-advertising-needs-attention',
      title: [361, 'Advertising Needs Attention'],
      standfirst: [364, 'The harder advertisers'],
      body: [[365, 'Rane Raymond'], [371, 'This contradicts']],
      groups: [
        { type: 'tfng', title: [372, 'Questions 1–7'], intro: [[373, 'Do the following'], [377, 'NOT GIVEN']], items: [[378, '1\t'], [384, '7\t']] },
        // Decision (f): the passage says "the secondary images" and "the holiday season".
        { type: 'short', title: [385, 'Questions 8–13'], intro: [[386, 'Answer the questions'], [387, 'Choose NO MORE']], items: [[388, '8\t'], [393, '13\t']], alsoAccept: { 10: ['the secondary images'], 13: ['the holiday season'] } },
      ],
    },
  ],
};
