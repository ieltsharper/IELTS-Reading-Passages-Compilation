// Archaeology & History topic, Reading Passages 2 and 3 (Questions 14–26 / 27–40): where each part of each
// passage is in the source PDF. Block numbers come from `node _generator/list-blocks.mjs <questions.pdf>`
// (the PDF is read by pdf-blocks.py); each [index, 'start of text'] pair is checked against the file.
// Sources (owner, 2026-11-27): "L9 Archaeology & History P2&3.pdf" (LESSON 9 INTENSIVE) and
// "Lời giải One-Shot – Đề 1 Archaeology & History P2-3.docx" (key: answer table, Bước 1–3, keyword table).
// Decisions:
// (a) the key covers four of the six passages in the PDF; the two printed as pictures of text with no key
//     ("Preserving Antarctic History" Q14–26, "Australia's Megafauna Controversy" Q27–40) are not on the site;
// (b) the word list of Patagonia Q36–40 is a picture in the PDF (ten chips A–J); typed from it (extraBlocks)
//     and checked against the key's answers (D, B, C, H, J);
// (c) the source's wording is kept as printed, slips included ("READING PASSSAGE 2", "Reading Passage has seven
//     paragraphs", "Choose the correct answer."); a paragraph the PDF cut at a page break (Patagonia G) and a
//     statement cut at a line break (Q17 "…Shelley's sonnet / Ozymandias.") are joined again (joins);
// (d) Patagonia Q27–31 print their options without letters (and Q28's four options on one line): A, B, C, D are
//     added in the printed order, as the key does;
// (e) each question shows the key's explanation (Bước 3) and its quote from the keyword table; Bước 1–2 and the
//     keyword table are in the collapsed "Hướng dẫn One-Shot".
export default {
  topic: 'Archaeology & History – Passages 2–3',
  slug: 'archaeology-history-p2-3',
  numberLabel: 'Passage',
  keyStep3: 'cau',
  itemsWithSpace: true,
  joins: [9, 75],
  questionsFile: 'L9 Archaeology & History P2&3.pdf',
  keyFile: 'Lời giải One-Shot – Đề 1 Archaeology & History P2-3.docx',
  extraBlocks: [
    {
      id: 'patagonia-words',
      lines: ['A\tfixed date', 'B\trandom collection', 'C\tsimilar properties', 'D\tgood condition', 'E\tscientific evaluation', 'F\thuge quantities', 'G\tnew samples', 'H\treliable connection', 'I\tskilled preservation', 'J\timmediate surroundings'],
    },
  ],
  passages: [
    {
      slug: 'passage-1-the-peopling-of-patagonia',
      title: [0, 'The peopling of Patagonia'],
      standfirst: [1, 'Anthropologists continue'],
      body: [[2, 'A.'], [10, 'H.']],
      letters: { 2: 'A', 3: 'B', 4: 'C', 5: 'D', 6: 'E', 7: 'F', 8: 'G', 10: 'H' },
      footnotes: [[11, '*radiocarbon'], [11, '*radiocarbon']],
      groups: [
        {
          type: 'mcq', title: [12, 'Questions 27–31'], intro: [[13, 'Choose the correct answer.'], [13, 'Choose the correct answer.']], items: [[14, '27 In the first'], [35, 'Streams exposed']], autoLetters: true,
          splitItems: ['to propose', 'to summarise', 'to suggest'],
        },
        { type: 'ynng', title: [36, 'Questions 32–35'], intro: [[37, 'Choose YES'], [37, 'Choose YES']], items: [[38, '32 The conditions'], [41, '35 Archaeological']] },
        { type: 'bank', title: [42, 'Questions 36–40'], intro: [[43, 'Complete the summary'], [43, 'Complete the summary']], content: [[45, 'The archaeological'], [46, 'Building remains']], options: [[179, 'A\tfixed date'], [188, 'J\timmediate']] },
      ],
    },
    {
      slug: 'passage-2-drawing-lessons-from-history',
      head: [[47, 'READING PASSSAGE 2']],
      title: [48, 'Drawing Lessons'],
      body: [[49, 'Numerous'], [54, 'Questions like these']],
      groups: [
        { type: 'mcq', title: [55, 'Questions 14–16'], intro: [[56, 'Choose the correct answer.'], [56, 'Choose the correct answer.']], items: [[57, '14 In describing'], [71, 'D. ordinary people']] },
        { type: 'ynng', title: [72, 'Questions 17–21'], intro: [[73, 'Choose YES'], [73, 'Choose YES']], items: [[74, '17 The impressive'], [79, '21 We should']] },
        { type: 'match', title: [80, 'Questions 22-26'], intro: [[81, 'Complete each sentence'], [81, 'Complete each sentence']], options: [[82, 'A. are not'], [87, 'F. have']], items: [[88, '22. Evidence'], [92, '26. Reflections']] },
      ],
    },
    {
      slug: 'passage-3-the-animal-connection',
      head: [[93, 'READING PASSAGE 3']],
      title: [94, 'The Animal Connection'],
      standfirst: [95, 'Professor of anthropology'],
      body: [[96, 'Travel anywhere'], [103, 'As our ancestors']],
      groups: [
        { type: 'ynng', title: [104, 'Questions 27-31'], intro: [[105, 'Do the following'], [108, 'NOT GIVEN']], items: [[109, '27\tTravellers'], [113, '31\tThere are']] },
        { type: 'bank', title: [114, 'Questions 32-36'], intro: [[115, 'Complete the summary'], [116, 'Write the correct']], content: [[117, 'Hunting and'], [119, 'However, the more']], options: [[120, 'List of Words'], [121, 'A']], optionsAfter: true },
        { type: 'mcq', title: [122, 'Questions 37-40'], intro: [[123, 'Choose the correct letter'], [123, 'Choose the correct letter']], items: [[124, '37\tWhat is'], [143, 'D\tis based']] },
      ],
    },
    {
      slug: 'passage-4-a-new-stage-in-the-study-and-teaching-of-history',
      head: [[144, 'READING PASSAGE 3'], [145, 'You should spend']],
      title: [146, 'A new stage'],
      body: [[147, 'For hundreds'], [154, 'G']],
      letters: { 148: 'A', 149: 'B', 150: 'C', 151: 'D', 152: 'E', 153: 'F', 154: 'G' },
      groups: [
        { type: 'match', title: [155, 'Questions 27-35'], intro: [[156, 'Reading Passage has'], [159, 'NB']], items: [[160, '27\tan overview'], [168, '35\ta list']], letters: 'ABCDEFG' },
        { type: 'ynng', title: [169, 'Questions 36-40'], intro: [[170, 'Do the following'], [173, 'NOT GIVEN']], items: [[174, '36\tThe needs'], [178, '40\tDevelopments']] },
      ],
    },
  ],
};
