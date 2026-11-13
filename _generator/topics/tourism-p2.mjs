// Tourism topic, Reading Passage 2 (one unit): see tourism-p1.mjs. Key unit 6 of the shared key.
const SPACE = 'Space Tourism';

export default {
  topic: 'Tourism – Passage 2',
  slug: 'tourism-p2',
  numberLabel: 'Unit',
  groups: [SPACE],
  keyFormat: 'boxes',
  questionsFile: 'IELTS_Reading_Passage2_Tourist_Attractions.docx',
  keyFile: 'IELTS_Tourist_Attractions_One-shot_Answer_Key.docx',
  passages: [
    {
      unit: 1,
      keyUnit: 6,
      group: SPACE,
      slug: 'unit-01-space-flight-tourism',
      title: [8, "Space Flight Touri"],
      body: [[11, "Falcon 1's success"], [23, "Before launching, "]],
      groups: [
        { type: 'gap', title: [25, "Questions 14–20"], intro: [[26, "Complete the summa"], [28, "Write your answers"]], content: [[30, "On 28 September th"], [30, "On 28 September th"]] },
        { type: 'match', title: [32, "Questions 21–26"], intro: [[33, "Complete each sent"], [34, "Write the correct "]], items: [[35, "21\tCivilian space "], [40, "26\tCritics"]], options: [42, "A\tassisted some mi"], optionsAfter: true },
      ],
    },
  ],
};
