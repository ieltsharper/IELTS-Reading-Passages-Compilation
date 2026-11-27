// Archaeology topic, Reading Passage 1 (Questions 1–13): where each part of each passage is in the source file.
// Block numbers come from `node _generator/list-blocks.mjs <questions.docx>`; each [index, 'start of text'] pair
// is checked against the file, so a changed source stops the build.
// Sources (owner, 2026-11-27): "L9 Reading Archaeology P1.docx" (LESSON 9 INTENSIVE; 7 passages) and
// "Lời giải One-Shot – Đề 3 Reading Archaeology P1.docx" (key: answer table, Bước 1–3, keyword table per passage).
// Handling (same as the earlier topics): the source's wording is kept as printed, including its book labels
// ("V3T5- READING PASSAGE 1") and slips; the handout numbers some statements with Word's automatic list, so those
// items take the numbers of their question range (autoNumber); each question shows the key's explanation (Bước 3)
// and its quote from the keyword table; Bước 1–2 are in the collapsed "Hướng dẫn One-Shot"; the extra answers the key
// accepts (Fishbourne Q7 "army", Q9 "floors", Q13 "modern museum") are accepted.
export default {
  topic: 'Archaeology – Passage 1',
  slug: 'archaeology-p1',
  numberLabel: 'Passage',
  keyStep3: 'cau',
  itemsWithSpace: true,
  questionsFile: 'L9 Reading Archaeology P1.docx',
  keyFile: 'Lời giải One-Shot – Đề 3 Reading Archaeology P1.docx',
  passages: [
    {
      slug: 'passage-1-caral-an-ancient-south-american-city',
      head: [[0, 'V3T5- READING'], [1, 'You should spend']],
      title: [3, 'Caral: an ancient'],
      body: [[5, 'Huge earth'], [17, 'It was evidence']],
      groups: [
        { type: 'tfng', title: [20, 'Questions 1-6'], intro: [[21, 'Do the following'], [24, 'NOT GIVEN']], items: [[26, '1\tCaral'], [31, '6 \tThe remains']] },
        { type: 'gap', title: [34, 'Questions 7-13'], intro: [[35, 'Complete the notes'], [37, 'Write your answers']], content: [[39, 'Caral as a trading'], [51, 'dried squash']] },
      ],
    },
    {
      slug: 'passage-2-the-pyramid-of-cestius',
      head: [[53, 'V6T9- READING'], [54, 'You should spend']],
      title: [55, 'The Pyramid of Cestius'],
      standfirst: [56, 'A 2000-year-old'],
      body: [[58, 'Though Rome draws'], [72, 'Only one problem']],
      groups: [
        { type: 'tfng', title: [75, 'Questions 1-7'], intro: [[76, 'Do the following'], [80, 'NOT GIVEN']], items: [[81, 'The Pyramid of Cestius has'], [87, 'Most of the original']], autoNumber: true },
        { type: 'gap', title: [89, 'Questions 8-13'], intro: [[90, 'Complete the notes'], [92, 'Write your answers']], content: [[93, 'History of the pyramid'], [107, 'Climbers']] },
      ],
    },
    {
      slug: 'passage-3-fishbourne-roman-palace',
      head: [[108, '\nV3T1- READING'], [109, 'You should spend']],
      title: [111, 'Fishbourne Roman Palace'],
      standfirst: [112, 'The largest Roman villa'],
      body: [[114, 'Fishbourne Roman Palace is'], [126, 'A modern museum']],
      groups: [
        { type: 'tfng', title: [129, 'Questions 1–6'], intro: [[130, 'Do the following'], [135, 'NOT GIVEN']], items: [[137, '1\tFishbourne'], [142, '6\tFishbourne']] },
        { type: 'gap', title: [144, 'Questions 7–13'], intro: [[145, 'Complete the notes'], [146, 'Choose NO MORE']], content: [[148, 'Fishbourne Palace'], [163, 'A 13']], alsoAccept: { 7: ['army'], 9: ['floors'], 13: ['modern museum'] } },
      ],
    },
    {
      slug: 'passage-4-the-iceman',
      head: [[165, 'V2T9- READING'], [166, 'You should spend']],
      title: [167, 'The Iceman'],
      body: [[168, 'A\tIt was late'], [175, 'H\tTaken together']],
      groups: [
        { type: 'match', title: [176, 'Questions 1-5'], intro: [[177, 'The reading passage'], [180, 'NB']], items: [[181, '1\tThe last area'], [185, '5\tThe Iceman']], letters: 'ABCDEFGH' },
        { type: 'tfng', title: [186, 'Questions 6-9'], intro: [[187, 'Do the following'], [191, 'NOT GIVEN']], items: [[193, '6\tAccording'], [196, '9\tBy testing']] },
        { type: 'gap', title: [198, 'Question 10-13'], intro: [[199, 'Complete the sentences'], [201, 'Write your answers']], content: [[202, 'The Iceman has been'], [205, 'The route of']] },
      ],
    },
    {
      slug: 'passage-5-mungo-lady-and-mungo-man',
      head: [[207, 'V6T7- READING'], [208, 'You should spend']],
      title: [209, 'Mungo Lady and Mungo Man'],
      standfirst: [210, 'Controversies in'],
      body: [[212, 'Fifty thousand years'], [228, 'Flannery praises']],
      groups: [
        { type: 'match', title: [230, 'Questions 1 - 8'], intro: [[231, 'Look at the following'], [234, 'NB']], options: [244, 'List of Researchers'], optionsAfter: true, items: [[235, 'Our human ancestors'], [242, 'The earliest evidence']], autoNumber: true },
        { type: 'tfng', title: [246, 'Questions 9-13'], intro: [[247, 'Do the following'], [251, 'NOT GIVEN']], items: [[253, ' Objects found'], [257, 'Bowler has criticised']], autoNumber: true },
      ],
    },
    {
      slug: 'passage-6-what-lucy-taught-us',
      head: [[259, 'V2T7- READING'], [260, 'You should spend']],
      title: [261, 'What Lucy Taught Us'],
      standfirst: [262, 'A scientific finding'],
      body: [[263, 'On a Sunday morning'], [271, 'It also seems']],
      groups: [
        { type: 'tfng', title: [274, 'Questions 1-5'], intro: [[275, 'Do the following'], [279, 'NOT GIVEN']], items: [[281, '1\tDonald'], [285, '5\tThe skeleton']] },
        { type: 'gap', title: [287, 'Questions 6-13'], intro: [[288, 'Complete the notes'], [290, 'Write your answers']], content: [[291, 'Lucy'], [291, 'Lucy']] },
      ],
    },
    {
      slug: 'passage-7-the-olmec-and-their-great-stone-heads',
      head: [[294, 'V9T10- READING']],
      title: [296, 'The Olmec and their'],
      body: [[297, 'The Olmec civilisation'], [309, 'The Olmec left']],
      groups: [
        { type: 'tfng', title: [312, 'Questions 1–6'], intro: [[313, 'Choose TRUE'], [313, 'Choose TRUE']], items: [[314, '1 Many Olmec'], [319, '6 The Olmec fought']] },
        { type: 'gap', title: [321, 'Questions 7–13'], intro: [[322, 'Complete the notes'], [323, 'Write ONE WORD']], content: [[324, 'Discovery'], [324, 'Discovery']] },
      ],
    },
  ],
};
