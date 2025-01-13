import {
  Document,
  Paragraph,
  TextRun,
  LevelFormat,
  AlignmentType,
  convertInchesToTwip,
  TabStopPosition,
  TabStopType,
} from "docx";

const createDocx = (
  data,
  { studyingClass, subject, term, schoolName, language }
) => {
  console.log(language);
  const questions = data.flatMap((question) => {
    const options =
      question.type === "mcq/fitb/mqna/mtf"
        ? question.options.map((option) => {
            return new Paragraph({
              style: "optionStyle",
              text: option.replace("<MTFSpace>", " ".repeat(35)),
              numbering: {
                level: 1,
                reference: "questionNumbering",
              },
            });
          })
        : [];
    const dashes =
      question.type === "adash"
        ? [
            new TextRun({
              text: "\n",
              break: true,
            }),
            new TextRun({
              text: "_".repeat(474),
            }),
          ]
        : [];
    return [
      new Paragraph({
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        style: "questionStyle",
        numbering: {
          level: 0,
          reference: "questionNumbering",
        },
        children: [
          new TextRun({
            text: `${question.title}`,
            bold: true,
          }),
          new TextRun({
            text: `\t(${question.marks})`,
            bold: true,
          }),
          ...dashes,
        ],
      }),
      ...options,
      new Paragraph({
        style: "moreSpacing",
        text: "",
      }),
    ];
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: schoolName,
            alignment: "center",
            style: "schoolNamePara",
          }),
          new Paragraph({
            text: term,
            alignment: "center",
            style: "subHeading",
          }),
          new Paragraph({
            text: "",
            style: "lineBreak",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: language === "hindi" ? "कक्षा: " : "Class: ",
                bold: true,
              }),
              new TextRun({
                text: studyingClass,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: language === "hindi" ? "विषय: " : "Subject: ",
                bold: true,
              }),
              new TextRun({
                text: subject,
              }),
            ],
          }),
          new Paragraph({
            text: "",
            style: "lineBreak",
          }),
          ...questions,
          new Paragraph({
            text: "",
            style: "lineBreak",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "-------- * --------",
                bold: true,
              }),
            ],
            alignment: "center",
          }),
        ],
      },
    ],
    numbering: {
      config: [
        {
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START,
              style: {
                run: {
                  bold: true,
                },
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.35),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
            {
              level: 1,
              format: LevelFormat.HINDI_VOWELS,
              text: "(%2)",
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.78),
                    hanging: convertInchesToTwip(0.3),
                  },
                },
              },
            },
          ],
          reference: "questionNumbering",
        },
      ],
    },
    styles: {
      default: {
        document: {
          paragraph: {
            spacing: {
              after: 175,
            },
          },
          run: {
            size: 24,
            font: language === "hindi" ? "Mangal" : "Arial",
          },
        },
      },
      paragraphStyles: [
        {
          id: "schoolNamePara",
          name: "school name para",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            bold: true,
            size: 36,
            font: "Arial Black",
          },
        },
        {
          id: "subHeading",
          name: "sub heading",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            bold: true,
            size: 32,
            font: "Arial Black",
          },
        },
        {
          id: "lineBreak",
          name: "line break",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24,
          },
        },
        {
          id: "moreSpacing",
          name: "more spacing",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: {
            spacing: {
              after: 10,
            },
          },
        },
        {
          id: "optionStyle",
          name: "option style",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: {
            spacing: {
              after: 60,
            },
          },
        },
        {
          id: "questionStyle",
          name: "question style",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          paragraph: {
            spacing: {
              after: 100,
            },
          },
        },
      ],
    },
  });

  return doc;
};

export default createDocx;
