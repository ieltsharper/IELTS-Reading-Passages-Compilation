// History topic, Reading Passage 1 (Questions 1–13): where each part of each passage is in the source PDF.
// Block numbers come from `node _generator/list-blocks.mjs <questions.pdf>` (the PDF is read by pdf-blocks.py);
// each [index, 'start of text'] pair is checked against the file, so a changed source stops the build.
// Sources (owner, 2026-10-28): "L9 History P1.pdf" (LESSON 9 INTENSIVE; passages and questions) and
// "Lời giải One-Shot – Đề 2 History P1.docx" (key: answer table, Bước 1–3, keyword table per passage).
// Decisions agreed with the owner (2026-10-28):
// (a) own topic "History – Passage 1" (seed batch 7);
// (b) the PDF's silk (Test 1) and tea (Test 6) passages, not in the key and printed as pictures of text, were
//     added later (2026-10-28) as Passages 8 and 9: their text is the Windows OCR of the page images (two runs
//     at different resolutions agree word for word), checked against the pages, in transcripts/history-p1/;
//     their answers and explanations were pasted by the owner from an AI chat (keys/history-p1-ai.md), shown
//     with a note saying so;
// (c) the olive oil flow-chart (Q7–9) is a picture in the PDF: shown as it is, answer boxes 7–9 under it;
// (d) source slips kept as written ("applications for America", "into goods to wear fed to livestock",
//     "A modem chicken", "Can be soften", "Ingredient were mixed with water pressed", the repeated
//     "as different types of plastics", "Pencil manufactures", "READING PASSSAGE");
// (e) each question shows the key's explanation (Bước 3) and its quote from the keyword table; Bước 1–2 and
//     the keyword table are in the collapsed "Hướng dẫn One-Shot".
const letters = (from, list) => Object.fromEntries([...list].map((l, i) => [from + i, l]));

export default {
  topic: 'History – Passage 1',
  slug: 'history-p1',
  numberLabel: 'Passage',
  keyStep3: 'cau',
  keyTableInStrategy: true,
  itemsWithSpace: true,
  transcripts: 'history-p1',
  aiKeyFile: 'history-p1-ai.md',
  questionsFile: 'L9 History P1.pdf',
  keyFile: 'Lời giải One-Shot – Đề 2 History P1.docx',
  passages: [
    {
      slug: 'passage-1-the-history-of-the-pencil',
      head: [[49, 'READING PASSAGE 1'], [50, 'You should spend']],
      title: [51, 'The History of the Pencil'],
      body: [[52, 'The history of the pencil'], [58, 'The pencil has turned out']],
      groups: [
        { type: 'gap', title: [59, 'Questions 1-6'], intro: [[60, 'Complete the notes'], [62, 'Write your answers']], content: [[63, 'The early history'], [73, '-\tThe government passed']] },
        { type: 'tfng', title: [74, 'Questions 7-13'], intro: [[75, 'Do the following'], [79, 'NOT GIVEN\tif']], items: [[80, '7\tThe Italians'], [86, '13\tThe use of']] },
      ],
    },
    {
      slug: 'passage-2-the-origin-of-paper',
      head: [[129, 'READING PASSAGE 1'], [130, 'You should spend']],
      title: [131, 'The Origin of Paper'],
      body: [[132, 'The word paper'], [141, 'Printing technology']],
      groups: [
        { type: 'tfng', title: [142, 'Questions 1-7'], intro: [[143, 'Do the following'], [146, 'NOT GIVEN\tif']], items: [[147, '1\tIn Ancient China'], [153, '7\tThe end of']] },
        { type: 'gap', title: [154, 'Questions 8-13'], intro: [[155, 'Complete the table'], [156, 'Choose ONE WORD']], content: [[157, 'The development of paper'], [158, '']] },
      ],
    },
    {
      slug: 'passage-3-the-early-history-of-olive-oil',
      head: [[159, 'READING PASSSAGE 1']],
      title: [160, 'THE EARLY HISTORY OF OLIVE OIL'],
      body: [[161, 'A Olive oil'], [166, 'F The waste water']],
      letters: letters(161, 'ABCDEF'),
      groups: [
        { type: 'tfng', title: [167, 'Questions 1–6'], intro: [[168, 'Choose TRUE'], [168, 'Choose TRUE']], items: [[169, '1 In the cultivation'], [174, '6 North African']] },
        { type: 'gap', title: [175, 'Questions 7–9'], intro: [[176, 'Complete the flow-chart'], [177, 'Write ONE WORD']], content: [[178, ''], [178, '']], gapsBelowPicture: true, imageAlt: 'Flow-chart "Ancient olive oil processing" for Questions 7–9, as printed in the test' },
        { type: 'gap', title: [179, 'Questions 10–13'], intro: [[180, 'Complete the notes'], [181, 'Write ONE WORD']], content: [[182, 'Amurca'], [187, '• used on farms']] },
      ],
    },
    {
      slug: 'passage-4-the-history-of-the-guitar',
      head: [[188, 'READING PASSAGE 1']],
      title: [189, 'The history of the guitar'],
      standfirst: [190, 'An overview of the origins'],
      body: [[191, 'A The earliest'], [200, 'J At the end']],
      letters: letters(191, 'ABCDEFGHIJ'),
      footnotes: [[201, 'tanbur:'], [202, 'fan-braced top:']],
      groups: [
        { type: 'tfng', title: [203, 'Questions 1-6'], intro: [[204, 'Do the following'], [208, 'NOT GIVEN if']], items: [[209, '1 The instrument'], [214, '6 The different']] },
        { type: 'gap', title: [215, 'Questions 7-13'], intro: [[216, 'Complete the table'], [217, 'Write ONE WORD']], content: [[218, 'The development of the guitar'], [219, '']] },
      ],
    },
    {
      slug: 'passage-5-dolls-through-the-ages',
      head: [[221, 'READING PASSAGE 1']],
      title: [222, 'Dolls through the ages'],
      body: [[223, 'A\tWhat is today'], [233, 'K\tAfter World War I']],
      groups: [
        { type: 'gap', title: [234, 'Questions 1-6'], intro: [[235, 'Complete the notes'], [236, 'Write ONE WORD']], content: [[237, 'Dolls'], [254, '● recipes']] },
        { type: 'tfng', title: [255, 'Questions 7-13'], intro: [[256, 'Do the following'], [259, 'NOT GIVEN\tif']], items: [[260, '7\tBisque dolls'], [266, '13\tDoll collectors']] },
      ],
    },
    {
      slug: 'passage-6-the-history-of-the-chicken',
      title: [267, 'The History of the Chicken'],
      standfirst: [268, 'The story begins'],
      body: [[269, 'Chicken is the universal'], [277, 'All in all']],
      groups: [
        { type: 'tfng', title: [278, 'Questions 1–7'], intro: [[279, 'Choose TRUE'], [279, 'Choose TRUE']], items: [[280, '1 Chicken is globally'], [286, '7 In the USA']] },
        { type: 'gap', title: [287, 'Questions 8–13'], intro: [[288, 'Complete the notes'], [289, 'Write ONE WORD']], content: [[290, 'The domestication'], [301, '•    Chickens were kept']] },
      ],
    },
    {
      slug: 'passage-7-the-development-of-plastics',
      head: [[302, 'READING PASSSAGE 1']],
      title: [303, 'THE DEVELOPMENT OF PLASTICS'],
      body: [[304, 'The first plastics'], [311, 'Plastics can be made']],
      groups: [
        { type: 'gap', title: [312, 'Questions 1–7'], intro: [[313, 'Complete the table'], [314, 'Write NO MORE']], content: [[315, 'Early types of plastic'], [316, '']] },
        { type: 'tfng', title: [317, 'Questions 8–13'], intro: [[318, 'Choose TRUE'], [318, 'Choose TRUE']], items: [[319, '8 The chemical'], [324, '13 Containers']] },
      ],
    },
    {
      slug: 'passage-8-the-development-of-the-silk-industry',
      head: [[2, 'READING PASSAGE 1'], [3, 'You should spend']],
      title: [4, 'The development of the silk industry'],
      standfirst: [5, 'Silk, a natural fibre'],
      body: [[6, 'When silk was first'], [12, 'World silk production']],
      aiKey: 'silk',
      note: 'Đáp án và giải thích của bài này do AI giải (file đáp án gốc không có bài này), đã được đối chiếu với bài đọc.',
      groups: [
        { type: 'gap', title: [13, 'Questions 1-7'], intro: [[14, 'Complete the notes'], [16, 'Write your answers']], content: [[17, 'Chinese silk'], [34, '●	silk objects']] },
        { type: 'tfng', title: [35, 'Questions 8-13'], intro: [[36, 'Do the following'], [40, 'NOT GIVEN	if']], items: [[41, '8	Their first'], [46, '13	Global silk']] },
      ],
    },
    {
      slug: 'passage-9-history-of-tea',
      head: [[89, 'READING PASSAGE 1'], [90, 'You should spend']],
      title: [91, 'History of Tea'],
      body: [[92, 'The story of tea'], [103, 'Individual merchants']],
      aiKey: 'tea',
      note: 'Đáp án và giải thích của bài này do AI giải (file đáp án gốc không có bài này), đã được đối chiếu với bài đọc.',
      groups: [
        { type: 'gap', title: [104, 'Questions 1-7'], intro: [[105, 'Complete the sentences'], [107, 'Write your answers']], content: [[108, '1	Researchers'], [114, '7	In order']] },
        { type: 'tfng', title: [115, 'Questions 8-13'], intro: [[116, 'Do the following'], [120, 'NOT GIVEN	if']], items: [[121, '8	Tea was popular'], [126, '13	The fastest']] },
      ],
    },
  ],
};
