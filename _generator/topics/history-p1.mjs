// History topic, Reading Passage 1 (Questions 1–13): where each part of each passage is in the source PDF.
// Block numbers come from `node _generator/list-blocks.mjs <questions.pdf>` (the PDF is read by pdf-blocks.py);
// each [index, 'start of text'] pair is checked against the file, so a changed source stops the build.
// Sources (owner, 2026-10-28): "L9 History P1.pdf" (LESSON 9 INTENSIVE; passages and questions) and
// "Lời giải One-Shot – Đề 2 History P1.docx" (key: answer table, Bước 1–3, keyword table per passage).
// Decisions agreed with the owner (2026-10-28):
// (a) own topic "History – Passage 1" (seed batch 7);
// (b) the PDF's silk (Test 1) and tea (Test 6) passages are left out: no answers in the key, and their pages
//     are pictures of text (nothing to copy without retyping);
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
  questionsFile: 'L9 History P1.pdf',
  keyFile: 'Lời giải One-Shot – Đề 2 History P1.docx',
  passages: [
    {
      slug: 'passage-1-the-history-of-the-pencil',
      head: [[2, 'READING PASSAGE 1'], [3, 'You should spend']],
      title: [4, 'The History of the Pencil'],
      body: [[5, 'The history of the pencil'], [11, 'The pencil has turned out']],
      groups: [
        { type: 'gap', title: [12, 'Questions 1-6'], intro: [[13, 'Complete the notes'], [15, 'Write your answers']], content: [[16, 'The early history'], [26, '-\tThe government passed']] },
        { type: 'tfng', title: [27, 'Questions 7-13'], intro: [[28, 'Do the following'], [32, 'NOT GIVEN\tif']], items: [[33, '7\tThe Italians'], [39, '13\tThe use of']] },
      ],
    },
    {
      slug: 'passage-2-the-origin-of-paper',
      head: [[42, 'READING PASSAGE 1'], [43, 'You should spend']],
      title: [44, 'The Origin of Paper'],
      body: [[45, 'The word paper'], [54, 'Printing technology']],
      groups: [
        { type: 'tfng', title: [55, 'Questions 1-7'], intro: [[56, 'Do the following'], [59, 'NOT GIVEN\tif']], items: [[60, '1\tIn Ancient China'], [66, '7\tThe end of']] },
        { type: 'gap', title: [67, 'Questions 8-13'], intro: [[68, 'Complete the table'], [69, 'Choose ONE WORD']], content: [[70, 'The development of paper'], [71, '']] },
      ],
    },
    {
      slug: 'passage-3-the-early-history-of-olive-oil',
      head: [[72, 'READING PASSSAGE 1']],
      title: [73, 'THE EARLY HISTORY OF OLIVE OIL'],
      body: [[74, 'A Olive oil'], [79, 'F The waste water']],
      letters: letters(74, 'ABCDEF'),
      groups: [
        { type: 'tfng', title: [80, 'Questions 1–6'], intro: [[81, 'Choose TRUE'], [81, 'Choose TRUE']], items: [[82, '1 In the cultivation'], [87, '6 North African']] },
        { type: 'gap', title: [88, 'Questions 7–9'], intro: [[89, 'Complete the flow-chart'], [90, 'Write ONE WORD']], content: [[91, ''], [91, '']], gapsBelowPicture: true, imageAlt: 'Flow-chart "Ancient olive oil processing" for Questions 7–9, as printed in the test' },
        { type: 'gap', title: [92, 'Questions 10–13'], intro: [[93, 'Complete the notes'], [94, 'Write ONE WORD']], content: [[95, 'Amurca'], [100, '• used on farms']] },
      ],
    },
    {
      slug: 'passage-4-the-history-of-the-guitar',
      head: [[101, 'READING PASSAGE 1']],
      title: [102, 'The history of the guitar'],
      standfirst: [103, 'An overview of the origins'],
      body: [[104, 'A The earliest'], [113, 'J At the end']],
      letters: letters(104, 'ABCDEFGHIJ'),
      footnotes: [[114, 'tanbur:'], [115, 'fan-braced top:']],
      groups: [
        { type: 'tfng', title: [116, 'Questions 1-6'], intro: [[117, 'Do the following'], [121, 'NOT GIVEN if']], items: [[122, '1 The instrument'], [127, '6 The different']] },
        { type: 'gap', title: [128, 'Questions 7-13'], intro: [[129, 'Complete the table'], [130, 'Write ONE WORD']], content: [[131, 'The development of the guitar'], [132, '']] },
      ],
    },
    {
      slug: 'passage-5-dolls-through-the-ages',
      head: [[134, 'READING PASSAGE 1']],
      title: [135, 'Dolls through the ages'],
      body: [[136, 'A\tWhat is today'], [146, 'K\tAfter World War I']],
      groups: [
        { type: 'gap', title: [147, 'Questions 1-6'], intro: [[148, 'Complete the notes'], [149, 'Write ONE WORD']], content: [[150, 'Dolls'], [167, '● recipes']] },
        { type: 'tfng', title: [168, 'Questions 7-13'], intro: [[169, 'Do the following'], [172, 'NOT GIVEN\tif']], items: [[173, '7\tBisque dolls'], [179, '13\tDoll collectors']] },
      ],
    },
    {
      slug: 'passage-6-the-history-of-the-chicken',
      title: [180, 'The History of the Chicken'],
      standfirst: [181, 'The story begins'],
      body: [[182, 'Chicken is the universal'], [190, 'All in all']],
      groups: [
        { type: 'tfng', title: [191, 'Questions 1–7'], intro: [[192, 'Choose TRUE'], [192, 'Choose TRUE']], items: [[193, '1 Chicken is globally'], [199, '7 In the USA']] },
        { type: 'gap', title: [200, 'Questions 8–13'], intro: [[201, 'Complete the notes'], [202, 'Write ONE WORD']], content: [[203, 'The domestication'], [214, '•    Chickens were kept']] },
      ],
    },
    {
      slug: 'passage-7-the-development-of-plastics',
      head: [[215, 'READING PASSSAGE 1']],
      title: [216, 'THE DEVELOPMENT OF PLASTICS'],
      body: [[217, 'The first plastics'], [224, 'Plastics can be made']],
      groups: [
        { type: 'gap', title: [225, 'Questions 1–7'], intro: [[226, 'Complete the table'], [227, 'Write NO MORE']], content: [[228, 'Early types of plastic'], [229, '']] },
        { type: 'tfng', title: [230, 'Questions 8–13'], intro: [[231, 'Choose TRUE'], [231, 'Choose TRUE']], items: [[232, '8 The chemical'], [237, '13 Containers']] },
      ],
    },
  ],
};
