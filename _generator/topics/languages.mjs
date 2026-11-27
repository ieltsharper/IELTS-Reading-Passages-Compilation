// Languages topic (Reading Passages 1–3 of one intensive test): where each part of each passage is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file, so a changed source stops the build.
// Sources (owner, 2026-11-27): "L9 Reading Languages.docx" (LESSON 9 INTENSIVE; 5 passages) and
// "Lời giải One-Shot – Đề 4 Reading Languages.docx" (key: answer table, Bước 1–3, keyword table per passage).
// Handling (same as the earlier topics): the source's wording is kept as printed, including its book labels
// ("V6T2- READING PASSAGE 1") and slips (e.g. "boxes 14-19" under Questions 14–18, "boxes 1-5" under 14-18);
// "The world's first cities" numbers its statements with Word's automatic list (autoNumber);
// Questions 27–30 and 31–36 of "The Origin of Ancient Writing" are printed without option letters: A, B, C… are
// added in the printed order, as the key does (A Pittman, B Damerow, C Schmandt-Besserat, D Michalowski, E Vernus);
// the word list of Questions 37–40 is printed in three columns and is listed A–N one per line;
// each question shows the key's explanation (Bước 3) and its quote from the keyword table; Bước 1–2 are in the
// collapsed "Hướng dẫn One-Shot".
export default {
  topic: 'Languages',
  slug: 'languages',
  numberLabel: 'Passage',
  keyStep3: 'cau',
  itemsWithSpace: true,
  questionsFile: 'L9 Reading Languages.docx',
  keyFile: 'Lời giải One-Shot – Đề 4 Reading Languages.docx',
  passages: [
    {
      slug: 'passage-1-an-important-language-development',
      head: [[0, 'READING PASSAGE 1'], [1, 'You should spend']],
      title: [2, 'An important language'],
      body: [[3, 'Cuneiform, the'], [10, 'Rawlinson took']],
      groups: [
        { type: 'tfng', title: [11, 'Questions 1-5'], intro: [[12, 'Do the following'], [16, 'NOT GIVEN']], items: [[17, '1\tCuneiform'], [21, '5\tCuneiform']] },
        { type: 'gap', title: [28, 'Questions 6-13'], intro: [[29, 'Complete the notes'], [31, 'Write your answers']], content: [[32, 'The development'], [32, 'The development']] },
      ],
    },
    {
      slug: 'passage-2-the-worlds-first-cities',
      head: [[35, 'V6T2- READING'], [36, 'You should spend']],
      title: [37, 'The world'],
      body: [[39, 'The creation'], [65, 'We know a surprising']],
      subs: [39, 49, 55, 59, 63],
      groups: [
        { type: 'tfng', title: [67, 'Questions 1-6'], intro: [[68, 'Do the following'], [72, 'NOT GIVEN']], items: [[74, 'Some physical'], [79, 'When there']], autoNumber: true },
        { type: 'gap', title: [82, 'Questions 7-13'], intro: [[83, 'Complete the notes'], [85, 'Write your answers']], content: [[87, 'Early changes'], [104, 'written records']] },
      ],
    },
    {
      slug: 'passage-3-the-history-of-celtic-language',
      head: [[105, '\nV9T7']],
      title: [106, 'THE HISTORY OF CELTIC'],
      body: [[107, 'A In November'], [113, 'G Dr April']],
      letters: { 107: 'A', 108: 'B', 109: 'C', 110: 'D', 111: 'E', 112: 'F', 113: 'G' },
      groups: [
        { type: 'match', title: [114, 'Questions 14–18'], intro: [[115, 'Reading Passage 2'], [117, 'Choose the correct']], items: [[118, '14 a difference'], [122, '18 the reason']], letters: 'ABCDEFG' },
        { type: 'match', title: [124, 'Questions 19–22'], intro: [[125, 'Look at the following'], [128, 'NB']], options: [129, 'List of Researchers'], items: [[130, '19 An approach'], [133, '22 The use']] },
        { type: 'gap', title: [135, 'Questions 23–26'], intro: [[136, 'Complete the sentence'], [137, 'Write ONE WORD']], content: [[138, 'The script'], [141, 'For social']] },
      ],
    },
    {
      slug: 'passage-4-ancient-storytelling',
      head: [[142, '\nV6T8'], [143, 'You should spend']],
      title: [144, 'Ancient Storytelling'],
      body: [[145, 'A\tThe first'], [153, 'I\tSo what']],
      groups: [
        { type: 'match', title: [154, 'Questions 14-18'], intro: [[155, 'Reading Passage 2 has'], [156, 'Write the correct']], items: [[157, '14\tan example'], [161, '18\ta reference']], letters: 'ABCDEFGHI' },
        { type: 'mcq', title: [163, 'Questions 19-22'], intro: [[165, 'Choose the correct'], [165, 'Choose the correct']], items: [[166, '19\tIn paragraph B'], [185, 'D\tto examine']] },
        { type: 'match', title: [186, 'Questions 23-26'], intro: [[187, 'Complete each sentence'], [188, 'Write the correct']], options: [190, 'A\tdramas'], items: [[192, '23\tStorytellers'], [195, '26\tHomer made']] },
      ],
    },
    {
      slug: 'passage-5-the-origin-of-ancient-writing',
      head: [[196, '\nV2T9'], [197, 'You should spend']],
      title: [198, 'The Origin of Ancient'],
      body: [[199, 'A\tThe Sumerians'], [208, 'J\tYet other']],
      groups: [
        { type: 'mcq', title: [209, 'Questions 27-30'], intro: [[210, 'Choose the correct'], [210, 'Choose the correct']], items: [[211, '27\tThe researchers'], [230, 'was unlikely']], autoLetters: true },
        { type: 'match', title: [231, 'Questions 31-36'], intro: [[232, 'Match each'], [233, 'NB']], options: [234, 'List of people'], autoLetters: true, items: [[236, '31\tThere is'], [241, '36\tThe uses']] },
        { type: 'bank', title: [243, 'Questions 37-40'], intro: [[244, 'Complete the summary'], [244, 'Complete the summary']], content: [[245, 'The earliest form'], [246, 'Most archaeological']], options: [247, 'A\tcuneiform'], tabColumns: true, optionsAfter: true },
      ],
    },
  ],
};
