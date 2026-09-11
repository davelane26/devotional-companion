/**
 * Precomputed Chapter & Paragraph Audio Map for Zac Poonen's Basic Christian Teachings.
 * Maps every reading date (72 days, Mon-Sat) to its full chapter broadcast audio and paragraph timestamps.
 */

export interface ChapterAudioTrack {
  chapterNumber: number;
  chapterTitle: string;
  audioUrl: string;
  studyUrl: string;
  startOffsetSec: number;
  endOffsetSec: number;
  paragraphIndices: number[];
  paragraphStartTimes: number[];
}

export interface DayAudioSchedule {
  date: string;
  tracks: ChapterAudioTrack[];
}

export const BOOK_AUDIO_SCHEDULE_MAP: Record<string, DayAudioSchedule> = {
  "2026-09-07": {
    "date": "2026-09-07",
    "tracks": [
      {
        "chapterNumber": 1,
        "chapterTitle": "The Origin Of Evil",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/01-the-origin-of-evil.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/01-the-origin-of-evil",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ],
        "paragraphStartTimes": [
          0.0,
          41.8,
          69.7,
          245.9,
          518.2,
          607.8,
          661.4,
          747.2
        ]
      }
    ]
  },
  "2026-09-08": {
    "date": "2026-09-08",
    "tracks": [
      {
        "chapterNumber": 2,
        "chapterTitle": "God Makes Evil Work For Good",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/02-god-makes-evil-work-for-good.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/02-god-makes-evil-work-for-good",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ],
        "paragraphStartTimes": [
          0.0,
          36.3,
          94.7,
          155.4,
          225.4,
          284.6,
          393.9,
          492.4,
          576.9,
          701.1
        ]
      }
    ]
  },
  "2026-09-09": {
    "date": "2026-09-09",
    "tracks": [
      {
        "chapterNumber": 3,
        "chapterTitle": "The Power Of Choice",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/03-the-power-of-choice.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/03-the-power-of-choice",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          15.3,
          50.5,
          105.9,
          189.2,
          293.7,
          346.5,
          418.6,
          507.4,
          613.1,
          646.8,
          736.9
        ]
      }
    ]
  },
  "2026-09-10": {
    "date": "2026-09-10",
    "tracks": [
      {
        "chapterNumber": 4,
        "chapterTitle": "Sin Comes From Unbelief",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/04-sin-comes-from-unbelief.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/04-sin-comes-from-unbelief",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          31.0,
          99.4,
          176.3,
          252.2,
          324.7,
          392.1,
          446.8,
          489.8,
          547.1,
          601.9,
          695.8,
          735.2
        ]
      }
    ]
  },
  "2026-09-11": {
    "date": "2026-09-11",
    "tracks": [
      {
        "chapterNumber": 5,
        "chapterTitle": "The Function Of Conscience",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/05-the-function-of-conscience.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/05-the-function-of-conscience",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          15.5,
          73.3,
          154.5,
          210.8,
          277.4,
          336.5,
          420.1,
          493.2,
          544.5,
          609.4,
          697.5
        ]
      }
    ]
  },
  "2026-09-12": {
    "date": "2026-09-12",
    "tracks": [
      {
        "chapterNumber": 6,
        "chapterTitle": "Why Christ Has To Die",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/06-why-christ-has-to-die.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/06-why-christ-has-to-die",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ],
        "paragraphStartTimes": [
          0.0,
          11.9,
          87.0,
          160.6,
          237.3,
          371.7,
          449.1,
          549.3,
          644.8,
          727.0
        ]
      }
    ]
  },
  "2026-09-14": {
    "date": "2026-09-14",
    "tracks": [
      {
        "chapterNumber": 7,
        "chapterTitle": "Repentance",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/07-repentance.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/07-repentance",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10
        ],
        "paragraphStartTimes": [
          0.0,
          46.3,
          115.3,
          211.8,
          299.7,
          335.8,
          406.2,
          488.1,
          565.1,
          654.8,
          731.6
        ]
      }
    ]
  },
  "2026-09-15": {
    "date": "2026-09-15",
    "tracks": [
      {
        "chapterNumber": 8,
        "chapterTitle": "Faith",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/08-faith.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/08-faith",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          17.6,
          90.9,
          167.0,
          251.3,
          315.7,
          372.5,
          454.8,
          535.9,
          627.6,
          716.9,
          755.0
        ]
      }
    ]
  },
  "2026-09-16": {
    "date": "2026-09-16",
    "tracks": [
      {
        "chapterNumber": 9,
        "chapterTitle": "The Gift Of The Holy Spirit",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/09-the-gift-of-the-holy-spirit.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/09-the-gift-of-the-holy-spirit",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8
        ],
        "paragraphStartTimes": [
          0.0,
          68.0,
          129.6,
          241.2,
          331.4,
          397.4,
          470.0,
          559.4,
          673.1
        ]
      }
    ]
  },
  "2026-09-17": {
    "date": "2026-09-17",
    "tracks": [
      {
        "chapterNumber": 10,
        "chapterTitle": "God\u2019s Word Is Our Food",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/10-gods-word-is-our-food.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/10-gods-word-is-our-food",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10
        ],
        "paragraphStartTimes": [
          0.0,
          14.7,
          81.1,
          171.2,
          255.1,
          365.3,
          407.2,
          491.2,
          567.8,
          632.3,
          691.3
        ]
      }
    ]
  },
  "2026-09-18": {
    "date": "2026-09-18",
    "tracks": [
      {
        "chapterNumber": 11,
        "chapterTitle": "God\u2019s Word Helps Us Overcome Satan",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/11-gods-word-helps-us-overcome-satan.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/11-gods-word-helps-us-overcome-satan",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          12.6,
          49.3,
          102.4,
          151.3,
          202.0,
          263.7,
          293.6,
          323.8,
          363.4,
          420.4,
          468.7,
          526.2,
          604.3,
          699.0,
          775.3
        ]
      }
    ]
  },
  "2026-09-19": {
    "date": "2026-09-19",
    "tracks": [
      {
        "chapterNumber": 12,
        "chapterTitle": "God\u2019s Word Renews Our Mind",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/12-gods-word-renews-our-mind.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/12-gods-word-renews-our-mind",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          10.0,
          75.1,
          131.1,
          168.1,
          209.1,
          255.3,
          299.0,
          332.0,
          384.9,
          419.8,
          494.2,
          533.9,
          588.6,
          640.2,
          708.7
        ]
      }
    ]
  },
  "2026-09-21": {
    "date": "2026-09-21",
    "tracks": [
      {
        "chapterNumber": 13,
        "chapterTitle": "Religiosity And Spirituality",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/13-religiosity-and-spirituality.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/13-religiosity-and-spirituality",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13
        ],
        "paragraphStartTimes": [
          0.0,
          16.9,
          108.2,
          166.3,
          257.0,
          320.7,
          389.8,
          429.0,
          473.4,
          544.3,
          607.5,
          648.0,
          702.1,
          749.2
        ]
      }
    ]
  },
  "2026-09-22": {
    "date": "2026-09-22",
    "tracks": [
      {
        "chapterNumber": 14,
        "chapterTitle": "Maximum Or Minimum For The Lord",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/14-maximum-or-minimum-for-the-lord.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/14-maximum-or-minimum-for-the-lord",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17
        ],
        "paragraphStartTimes": [
          0.0,
          14.7,
          79.2,
          116.8,
          154.6,
          199.1,
          252.6,
          299.6,
          353.5,
          388.1,
          432.5,
          470.7,
          520.8,
          593.3,
          616.3,
          662.6,
          715.3,
          764.4
        ]
      }
    ]
  },
  "2026-09-23": {
    "date": "2026-09-23",
    "tracks": [
      {
        "chapterNumber": 15,
        "chapterTitle": "A Son Or A Servant",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/15-a-son-or-a-servant.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/15-a-son-or-a-servant",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          12.5,
          39.0,
          91.5,
          165.2,
          227.6,
          297.1,
          336.3,
          378.8,
          458.9,
          512.8,
          548.4,
          614.1,
          667.5,
          707.2,
          759.6
        ]
      }
    ]
  },
  "2026-09-24": {
    "date": "2026-09-24",
    "tracks": [
      {
        "chapterNumber": 16,
        "chapterTitle": "Keeping The Tenth Commandment",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/16-keeping-the-tenth-commandment.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/16-keeping-the-tenth-commandment",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17
        ],
        "paragraphStartTimes": [
          0.0,
          18.5,
          63.2,
          98.2,
          141.3,
          179.3,
          222.0,
          267.3,
          327.0,
          373.1,
          435.2,
          487.8,
          554.3,
          589.6,
          624.6,
          665.7,
          701.9,
          730.2
        ]
      }
    ]
  },
  "2026-09-25": {
    "date": "2026-09-25",
    "tracks": [
      {
        "chapterNumber": 17,
        "chapterTitle": "Dead Works",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/17-dead-works.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/17-dead-works",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          11.1,
          72.8,
          111.7,
          163.9,
          202.8,
          253.5,
          281.2,
          343.3,
          408.6,
          474.0,
          524.5,
          561.6,
          659.5,
          711.9,
          770.6
        ]
      }
    ]
  },
  "2026-09-26": {
    "date": "2026-09-26",
    "tracks": [
      {
        "chapterNumber": 18,
        "chapterTitle": "More On Dead Works",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/18-more-on-dead-works.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/18-more-on-dead-works",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18
        ],
        "paragraphStartTimes": [
          0.0,
          44.0,
          53.0,
          102.9,
          178.2,
          208.6,
          264.8,
          298.7,
          338.3,
          389.2,
          454.9,
          500.7,
          538.4,
          564.0,
          613.5,
          653.7,
          693.1,
          745.3,
          774.4
        ]
      }
    ]
  },
  "2026-09-28": {
    "date": "2026-09-28",
    "tracks": [
      {
        "chapterNumber": 19,
        "chapterTitle": "Some More On Dead Works",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/19-some-more-on-dead-works.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/19-some-more-on-dead-works",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          14.8,
          50.9,
          72.3,
          111.5,
          183.5,
          218.2,
          289.2,
          372.5,
          427.7,
          476.1,
          508.2,
          564.7,
          635.2,
          681.0,
          755.0
        ]
      }
    ]
  },
  "2026-09-29": {
    "date": "2026-09-29",
    "tracks": [
      {
        "chapterNumber": 20,
        "chapterTitle": "Still More On Dead Works",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/20-still-more-on-dead-works.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/20-still-more-on-dead-works",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          15.5,
          56.6,
          150.3,
          194.7,
          236.3,
          242.0,
          305.7,
          366.3,
          430.8,
          485.8,
          548.2,
          621.9,
          678.3,
          723.4,
          752.4
        ]
      }
    ]
  },
  "2026-09-30": {
    "date": "2026-09-30",
    "tracks": [
      {
        "chapterNumber": 21,
        "chapterTitle": "Law And Grace",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/21-law-and-grace.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/21-law-and-grace",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          26.9,
          79.3,
          131.1,
          214.5,
          274.9,
          321.2,
          379.8,
          420.6,
          481.5,
          521.2,
          566.4,
          616.9,
          650.4,
          687.8,
          747.6
        ]
      }
    ]
  },
  "2026-10-01": {
    "date": "2026-10-01",
    "tracks": [
      {
        "chapterNumber": 22,
        "chapterTitle": "One Reason For Failure",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/22-one-reason-for-failure.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/22-one-reason-for-failure",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13
        ],
        "paragraphStartTimes": [
          0.0,
          11.7,
          54.5,
          123.4,
          207.6,
          254.4,
          318.9,
          382.5,
          424.4,
          478.4,
          535.4,
          591.9,
          671.3,
          741.2
        ]
      }
    ]
  },
  "2026-10-02": {
    "date": "2026-10-02",
    "tracks": [
      {
        "chapterNumber": 23,
        "chapterTitle": "Another Reason For Failure",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/23-another-reason-for-failure.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/23-another-reason-for-failure",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          13.5,
          59.6,
          90.6,
          143.0,
          198.4,
          247.4,
          305.7,
          352.8,
          427.0,
          502.3,
          568.3,
          607.6,
          678.3,
          746.1
        ]
      }
    ]
  },
  "2026-10-03": {
    "date": "2026-10-03",
    "tracks": [
      {
        "chapterNumber": 24,
        "chapterTitle": "More Reasons For Failure",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/24-more-reasons-for-failure.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/24-more-reasons-for-failure",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          10.3,
          71.2,
          152.2,
          220.3,
          270.3,
          292.6,
          323.7,
          366.8,
          413.5,
          472.2,
          506.4,
          577.6,
          647.6,
          734.4
        ]
      }
    ]
  },
  "2026-10-05": {
    "date": "2026-10-05",
    "tracks": [
      {
        "chapterNumber": 25,
        "chapterTitle": "Faith And Praise",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/25-faith-and-praise.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/25-faith-and-praise",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          11.4,
          90.6,
          164.3,
          207.3,
          263.8,
          343.5,
          397.9,
          442.6,
          494.7,
          551.5,
          588.2,
          629.5,
          676.6,
          728.4
        ]
      }
    ]
  },
  "2026-10-06": {
    "date": "2026-10-06",
    "tracks": [
      {
        "chapterNumber": 26,
        "chapterTitle": "Crucifixion And Praise",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/26-crucifixion-and-praise.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/26-crucifixion-and-praise",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16
        ],
        "paragraphStartTimes": [
          0.0,
          17.5,
          51.9,
          95.4,
          142.8,
          184.0,
          195.5,
          222.1,
          240.6,
          288.1,
          365.1,
          408.1,
          444.5,
          506.1,
          580.7,
          645.6,
          727.1
        ]
      }
    ]
  },
  "2026-10-07": {
    "date": "2026-10-07",
    "tracks": [
      {
        "chapterNumber": 27,
        "chapterTitle": "Praise Drives Satan Out",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/27-praise-drives-satan-out.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/27-praise-drives-satan-out",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16
        ],
        "paragraphStartTimes": [
          0.0,
          9.4,
          67.3,
          122.3,
          160.0,
          199.6,
          245.3,
          306.5,
          367.4,
          437.3,
          492.0,
          547.4,
          584.7,
          627.3,
          670.5,
          705.5,
          732.0
        ]
      }
    ]
  },
  "2026-10-08": {
    "date": "2026-10-08",
    "tracks": [
      {
        "chapterNumber": 28,
        "chapterTitle": "The New Song Of Praise",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/28-the-new-song-of-praise.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/28-the-new-song-of-praise",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          14.7,
          57.6,
          90.7,
          240.8,
          303.6,
          346.3,
          396.7,
          447.2,
          497.9,
          529.9,
          570.7,
          632.7,
          708.5,
          738.8
        ]
      }
    ]
  },
  "2026-10-09": {
    "date": "2026-10-09",
    "tracks": [
      {
        "chapterNumber": 29,
        "chapterTitle": "Praise Brings Deliverance",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/29-praise-brings-deliverance.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/29-praise-brings-deliverance",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          11.1,
          58.9,
          102.0,
          161.3,
          223.1,
          313.9,
          355.7,
          403.4,
          454.3,
          505.4,
          574.2,
          606.2,
          679.3,
          716.1
        ]
      }
    ]
  },
  "2026-10-10": {
    "date": "2026-10-10",
    "tracks": [
      {
        "chapterNumber": 30,
        "chapterTitle": "Praise Opens Closed Doors",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/30-praise-opens-closed-doors.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/30-praise-opens-closed-doors",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16
        ],
        "paragraphStartTimes": [
          0.0,
          11.2,
          33.7,
          95.0,
          154.3,
          221.7,
          267.9,
          307.4,
          342.7,
          394.7,
          492.4,
          518.4,
          579.2,
          637.6,
          682.4,
          729.8,
          758.5
        ]
      }
    ]
  },
  "2026-10-12": {
    "date": "2026-10-12",
    "tracks": [
      {
        "chapterNumber": 31,
        "chapterTitle": "God\u2019s Purpose For Man",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/31-gods-purpose-for-man.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/31-gods-purpose-for-man",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          33.0,
          115.5,
          194.9,
          263.9,
          317.2,
          377.4,
          449.2,
          511.4,
          573.4,
          642.0,
          705.9,
          749.3
        ]
      }
    ]
  },
  "2026-10-13": {
    "date": "2026-10-13",
    "tracks": [
      {
        "chapterNumber": 32,
        "chapterTitle": "Humility In Jesus Coming To Earth",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/32-humility-in-jesus-coming-to-earth.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/32-humility-in-jesus-coming-to-earth",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          11.1,
          61.2,
          108.0,
          174.3,
          231.2,
          284.9,
          319.5,
          385.8,
          460.0,
          518.8,
          601.1,
          713.5
        ]
      }
    ]
  },
  "2026-10-14": {
    "date": "2026-10-14",
    "tracks": [
      {
        "chapterNumber": 33,
        "chapterTitle": "Humility In Jesus Earthly Life",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/33-humility-in-jesus-earthly-life.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/33-humility-in-jesus-earthly-life",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          16.3,
          89.3,
          133.0,
          213.1,
          272.6,
          306.5,
          357.5,
          417.8,
          465.2,
          520.1,
          595.5,
          673.7,
          708.4,
          764.8
        ]
      }
    ]
  },
  "2026-10-15": {
    "date": "2026-10-15",
    "tracks": [
      {
        "chapterNumber": 34,
        "chapterTitle": "Humility In Jesus Death",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/34-humility-in-jesus-death.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/34-humility-in-jesus-death",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16
        ],
        "paragraphStartTimes": [
          0.0,
          19.1,
          55.6,
          104.5,
          149.0,
          200.0,
          270.7,
          329.7,
          374.9,
          416.3,
          459.7,
          495.2,
          569.6,
          657.1,
          691.2,
          726.6,
          763.2
        ]
      }
    ]
  },
  "2026-10-16": {
    "date": "2026-10-16",
    "tracks": [
      {
        "chapterNumber": 35,
        "chapterTitle": "Jesus Overcame Sin",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/35-jesus-overcame-sin.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/35-jesus-overcame-sin",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          16.8,
          70.4,
          111.1,
          157.3,
          221.3,
          276.7,
          335.8,
          381.5,
          433.8,
          493.7,
          550.6,
          597.0,
          674.9,
          744.0,
          765.0
        ]
      }
    ]
  },
  "2026-10-17": {
    "date": "2026-10-17",
    "tracks": [
      {
        "chapterNumber": 36,
        "chapterTitle": "Jesus Did God's Will",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/36-jesus-did-gods-will.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/36-jesus-did-gods-will",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          13.4,
          61.7,
          105.8,
          143.3,
          190.5,
          263.2,
          328.1,
          363.4,
          418.3,
          475.0,
          521.4,
          596.2,
          635.7,
          681.3,
          738.8
        ]
      }
    ]
  },
  "2026-10-19": {
    "date": "2026-10-19",
    "tracks": [
      {
        "chapterNumber": 37,
        "chapterTitle": "Jesus Valued All People",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/37-jesus-valued-all-people.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/37-jesus-valued-all-people",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          23.2,
          74.9,
          142.1,
          205.9,
          270.0,
          319.2,
          368.5,
          419.7,
          486.9,
          554.1,
          590.7,
          635.7,
          675.3,
          749.7
        ]
      }
    ]
  },
  "2026-10-20": {
    "date": "2026-10-20",
    "tracks": [
      {
        "chapterNumber": 38,
        "chapterTitle": "Jesus Valued People More Than Things",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/38-jesus-valued-people-more-than-things.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/38-jesus-valued-people-more-than-things",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          28.4,
          62.7,
          111.1,
          152.4,
          210.8,
          269.1,
          331.6,
          385.1,
          433.9,
          481.7,
          539.9,
          590.7,
          661.9,
          712.5,
          755.8
        ]
      }
    ]
  },
  "2026-10-21": {
    "date": "2026-10-21",
    "tracks": [
      {
        "chapterNumber": 39,
        "chapterTitle": "Jesus Was Unpopular",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/39-jesus-was-unpopular.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/39-jesus-was-unpopular",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          10.5,
          39.3,
          81.8,
          140.9,
          195.9,
          236.3,
          275.9,
          340.9,
          391.2,
          438.7,
          500.6,
          564.0,
          600.5,
          692.8,
          756.9
        ]
      }
    ]
  },
  "2026-10-22": {
    "date": "2026-10-22",
    "tracks": [
      {
        "chapterNumber": 40,
        "chapterTitle": "Jesus Obeyed The Father",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/40-jesus-obeyed-the-father.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/40-jesus-obeyed-the-father",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          32.3,
          99.0,
          145.8,
          207.4,
          272.6,
          337.3,
          418.5,
          515.6,
          577.7,
          686.1,
          747.2
        ]
      }
    ]
  },
  "2026-10-23": {
    "date": "2026-10-23",
    "tracks": [
      {
        "chapterNumber": 41,
        "chapterTitle": "Jesus\u2019 speech was always loving",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/41-jesus-speech-was-always-loving.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/41-jesus-speech-was-always-loving",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16
        ],
        "paragraphStartTimes": [
          0.0,
          14.3,
          81.8,
          124.5,
          161.4,
          205.1,
          256.2,
          298.0,
          336.5,
          385.0,
          433.8,
          483.6,
          530.7,
          571.4,
          628.9,
          670.5,
          723.5
        ]
      }
    ]
  },
  "2026-10-24": {
    "date": "2026-10-24",
    "tracks": [
      {
        "chapterNumber": 42,
        "chapterTitle": "Jesus\u2019 Gentleness and Goodness",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/42-jesus-gentleness-and-goodness.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/42-jesus-gentleness-and-goodness",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          19.1,
          78.6,
          132.2,
          180.2,
          231.5,
          284.5,
          348.1,
          418.6,
          496.0,
          556.2,
          611.2,
          636.8,
          707.0,
          752.5
        ]
      }
    ]
  },
  "2026-10-26": {
    "date": "2026-10-26",
    "tracks": [
      {
        "chapterNumber": 43,
        "chapterTitle": "Finding Security In God As A Father",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/43-finding-security-in-god-as-a-father.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/43-finding-security-in-god-as-a-father",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          11.9,
          81.5,
          156.8,
          211.6,
          253.3,
          321.4,
          373.3,
          440.2,
          483.9,
          526.6,
          576.4,
          619.3,
          669.1,
          722.6
        ]
      }
    ]
  },
  "2026-10-27": {
    "date": "2026-10-27",
    "tracks": [
      {
        "chapterNumber": 44,
        "chapterTitle": "God Can Give You Wisdom",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/44-god-can-give-you-wisdom.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/44-god-can-give-you-wisdom",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16
        ],
        "paragraphStartTimes": [
          0.0,
          17.9,
          58.2,
          123.6,
          172.8,
          204.2,
          265.7,
          314.0,
          361.5,
          438.6,
          466.8,
          510.2,
          543.5,
          590.3,
          640.3,
          681.5,
          731.2
        ]
      }
    ]
  },
  "2026-10-28": {
    "date": "2026-10-28",
    "tracks": [
      {
        "chapterNumber": 45,
        "chapterTitle": "God And Money Are Opposites",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/45-god-and-money-are-opposites.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/45-god-and-money-are-opposites",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "paragraphStartTimes": [
          0.0,
          15.3,
          81.9,
          153.2,
          221.0,
          271.7,
          334.5,
          378.3,
          425.6,
          465.2,
          523.1,
          571.7,
          627.2,
          670.5,
          699.6,
          748.6
        ]
      }
    ]
  },
  "2026-10-29": {
    "date": "2026-10-29",
    "tracks": [
      {
        "chapterNumber": 46,
        "chapterTitle": "The Love Of Money Is Evil",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/46-the-love-of-money-is-evil.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/46-the-love-of-money-is-evil",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          12.2,
          71.6,
          127.1,
          189.4,
          233.8,
          273.2,
          340.8,
          394.7,
          450.6,
          494.0,
          536.3,
          572.0,
          659.8,
          749.1
        ]
      }
    ]
  },
  "2026-10-30": {
    "date": "2026-10-30",
    "tracks": [
      {
        "chapterNumber": 47,
        "chapterTitle": "Give Back What Belongs To Others",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/47-give-back-what-belongs-to-others.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/47-give-back-what-belongs-to-others",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13
        ],
        "paragraphStartTimes": [
          0.0,
          17.0,
          87.1,
          159.1,
          206.8,
          269.0,
          325.9,
          374.9,
          433.6,
          493.2,
          587.2,
          661.4,
          713.8,
          752.6
        ]
      }
    ]
  },
  "2026-10-31": {
    "date": "2026-10-31",
    "tracks": [
      {
        "chapterNumber": 48,
        "chapterTitle": "Giving Everything To God",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/48-giving-everything-to-god.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/48-giving-everything-to-god",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          11.9,
          83.0,
          141.5,
          208.6,
          271.2,
          343.8,
          377.0,
          427.3,
          490.4,
          586.5,
          674.0,
          745.1
        ]
      }
    ]
  },
  "2026-11-02": {
    "date": "2026-11-02",
    "tracks": [
      {
        "chapterNumber": 49,
        "chapterTitle": "God Binds Husband And Wife Together",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/49-god-binds-husband-and-wife-together.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/49-god-binds-husband-and-wife-together",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13
        ],
        "paragraphStartTimes": [
          0.0,
          15.3,
          50.7,
          102.2,
          152.1,
          215.4,
          273.7,
          329.5,
          380.5,
          438.0,
          507.0,
          580.5,
          633.7,
          730.7
        ]
      }
    ]
  },
  "2026-11-03": {
    "date": "2026-11-03",
    "tracks": [
      {
        "chapterNumber": 50,
        "chapterTitle": "Responsibilities Of Husband And Wife",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/50-responsibilities-of-husband-and-wife.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/50-responsibilities-of-husband-and-wife",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          13.1,
          66.9,
          109.6,
          176.4,
          215.8,
          310.0,
          366.0,
          431.7,
          495.1,
          548.1,
          666.4,
          731.2
        ]
      }
    ]
  },
  "2026-11-04": {
    "date": "2026-11-04",
    "tracks": [
      {
        "chapterNumber": 51,
        "chapterTitle": "Bringing Up Godly Children",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/51-bringing-up-godly-children.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/51-bringing-up-godly-children",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13
        ],
        "paragraphStartTimes": [
          0.0,
          28.0,
          66.4,
          108.8,
          167.1,
          232.5,
          310.2,
          389.4,
          412.9,
          495.4,
          570.6,
          623.6,
          682.5,
          757.2
        ]
      }
    ]
  },
  "2026-11-05": {
    "date": "2026-11-05",
    "tracks": [
      {
        "chapterNumber": 52,
        "chapterTitle": "Responsibilities Of Parents And Children",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/52-responsibilities-of-parents-and-children.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/52-responsibilities-of-parents-and-children",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          23.8,
          100.4,
          153.3,
          204.6,
          265.9,
          314.0,
          366.0,
          416.3,
          490.6,
          531.1,
          598.1,
          674.4,
          710.2,
          756.7
        ]
      }
    ]
  },
  "2026-11-06": {
    "date": "2026-11-06",
    "tracks": [
      {
        "chapterNumber": 53,
        "chapterTitle": "Not Praying As Hypocrites Do",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/53-not-praying-as-hypocrites-do.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/53-not-praying-as-hypocrites-do",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          71.2,
          139.5,
          242.9,
          317.5,
          389.5,
          465.8,
          503.4,
          565.7,
          618.4,
          668.2,
          721.6
        ]
      }
    ]
  },
  "2026-11-07": {
    "date": "2026-11-07",
    "tracks": [
      {
        "chapterNumber": 54,
        "chapterTitle": "Not Praying With Meaningless Repetition",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/54-not-praying-with-meaningless-repetition.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/54-not-praying-with-meaningless-repetition",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          35.8,
          89.6,
          153.6,
          236.2,
          295.2,
          368.8,
          433.6,
          508.4,
          570.8,
          672.2,
          726.2
        ]
      }
    ]
  },
  "2026-11-09": {
    "date": "2026-11-09",
    "tracks": [
      {
        "chapterNumber": 55,
        "chapterTitle": "Praying Putting God First",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/55-praying-putting-god-first.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/55-praying-putting-god-first",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          22.9,
          76.3,
          158.7,
          219.3,
          316.1,
          388.2,
          456.8,
          519.5,
          601.1,
          686.1,
          769.6
        ]
      }
    ]
  },
  "2026-11-10": {
    "date": "2026-11-10",
    "tracks": [
      {
        "chapterNumber": 56,
        "chapterTitle": "Praying About God\u2019s Interests",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/56-praying-about-gods-interests.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/56-praying-about-gods-interests",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          17.7,
          72.2,
          171.4,
          251.6,
          307.2,
          368.6,
          405.1,
          479.7,
          539.4,
          590.1,
          647.8,
          730.7
        ]
      }
    ]
  },
  "2026-11-11": {
    "date": "2026-11-11",
    "tracks": [
      {
        "chapterNumber": 57,
        "chapterTitle": "Praying For Our Material Needs",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/57-praying-for-our-material-needs.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/57-praying-for-our-material-needs",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          15.1,
          84.5,
          150.0,
          230.6,
          299.0,
          365.0,
          440.5,
          520.8,
          593.1,
          650.2,
          707.0,
          772.9
        ]
      }
    ]
  },
  "2026-11-12": {
    "date": "2026-11-12",
    "tracks": [
      {
        "chapterNumber": 58,
        "chapterTitle": "Praying For Our Spiritual Needs",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/58-praying-for-our-spiritual-needs.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/58-praying-for-our-spiritual-needs",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14
        ],
        "paragraphStartTimes": [
          0.0,
          14.7,
          64.2,
          124.6,
          177.7,
          239.3,
          285.3,
          338.6,
          386.2,
          456.3,
          521.2,
          614.4,
          667.8,
          725.8,
          751.0
        ]
      }
    ]
  },
  "2026-11-13": {
    "date": "2026-11-13",
    "tracks": [
      {
        "chapterNumber": 59,
        "chapterTitle": "Hypocrisy",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/59-hypocrisy.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/59-hypocrisy",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ],
        "paragraphStartTimes": [
          0.0,
          20.2,
          93.1,
          168.6,
          252.6,
          346.4,
          401.6,
          512.2,
          598.9,
          716.4
        ]
      }
    ]
  },
  "2026-11-14": {
    "date": "2026-11-14",
    "tracks": [
      {
        "chapterNumber": 60,
        "chapterTitle": "Pride",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/60-pride.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/60-pride",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          23.3,
          68.2,
          129.9,
          159.2,
          247.4,
          313.9,
          364.4,
          433.0,
          509.4,
          589.8,
          678.9,
          740.6
        ]
      }
    ]
  },
  "2026-11-16": {
    "date": "2026-11-16",
    "tracks": [
      {
        "chapterNumber": 61,
        "chapterTitle": "Selfishness",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/61-selfishness.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/61-selfishness",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10
        ],
        "paragraphStartTimes": [
          0.0,
          19.1,
          105.8,
          212.1,
          266.2,
          324.6,
          428.0,
          527.5,
          610.2,
          653.5,
          738.3
        ]
      }
    ]
  },
  "2026-11-17": {
    "date": "2026-11-17",
    "tracks": [
      {
        "chapterNumber": 62,
        "chapterTitle": "Hatred",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/62-hatred.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/62-hatred",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10
        ],
        "paragraphStartTimes": [
          0.0,
          19.0,
          71.7,
          153.2,
          252.5,
          337.9,
          432.4,
          534.9,
          612.5,
          663.8,
          703.4
        ]
      }
    ]
  },
  "2026-11-18": {
    "date": "2026-11-18",
    "tracks": [
      {
        "chapterNumber": 63,
        "chapterTitle": "Unbelief",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/63-unbelief.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/63-unbelief",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          21.4,
          82.0,
          162.8,
          236.0,
          283.8,
          398.7,
          459.6,
          519.4,
          595.6,
          685.2,
          749.4
        ]
      }
    ]
  },
  "2026-11-19": {
    "date": "2026-11-19",
    "tracks": [
      {
        "chapterNumber": 64,
        "chapterTitle": "Unforgiveness And Bitterness",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/64-unforgiveness-and-bitterness.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/64-unforgiveness-and-bitterness",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10
        ],
        "paragraphStartTimes": [
          0.0,
          25.7,
          106.9,
          183.7,
          266.7,
          354.7,
          435.2,
          523.7,
          619.6,
          682.6,
          757.9
        ]
      }
    ]
  },
  "2026-11-20": {
    "date": "2026-11-20",
    "tracks": [
      {
        "chapterNumber": 65,
        "chapterTitle": "Lying",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/65-lying.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/65-lying",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8
        ],
        "paragraphStartTimes": [
          0.0,
          31.6,
          109.3,
          214.7,
          285.9,
          401.6,
          520.6,
          638.3,
          744.9
        ]
      }
    ]
  },
  "2026-11-21": {
    "date": "2026-11-21",
    "tracks": [
      {
        "chapterNumber": 66,
        "chapterTitle": "Don\u2019t Believe Satan\u2019s Lies",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/66-dont-believe-satans-lies.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/66-dont-believe-satans-lies",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ],
        "paragraphStartTimes": [
          0.0,
          21.0,
          114.0,
          204.0,
          339.3,
          394.2,
          483.6,
          572.6,
          680.4,
          764.4
        ]
      }
    ]
  },
  "2026-11-23": {
    "date": "2026-11-23",
    "tracks": [
      {
        "chapterNumber": 67,
        "chapterTitle": "Anger",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/67-anger.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/67-anger",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ],
        "paragraphStartTimes": [
          0.0,
          28.8,
          131.4,
          195.2,
          277.2,
          378.6,
          449.9,
          528.5,
          618.2,
          747.6
        ]
      }
    ]
  },
  "2026-11-24": {
    "date": "2026-11-24",
    "tracks": [
      {
        "chapterNumber": 68,
        "chapterTitle": "Proving God\u2019s Perfect Will (1)",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/68-proving-gods-perfect-will.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/68-proving-gods-perfect-will",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21
        ],
        "paragraphStartTimes": [
          0.0,
          12.2,
          110.7,
          189.0,
          314.3,
          418.6,
          428.9,
          450.5,
          455.0,
          459.2,
          463.8,
          467.2,
          472.0,
          478.7,
          486.2,
          491.1,
          499.5,
          505.3,
          508.8,
          518.9,
          606.3,
          721.9
        ]
      }
    ]
  },
  "2026-11-25": {
    "date": "2026-11-25",
    "tracks": [
      {
        "chapterNumber": 69,
        "chapterTitle": "Proving God\u2019s Perfect Will (2)",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/69-proving-gods-perfect-will.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/69-proving-gods-perfect-will",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          21.1,
          103.9,
          190.1,
          249.3,
          300.0,
          387.3,
          445.3,
          536.6,
          603.6,
          657.6,
          743.9
        ]
      }
    ]
  },
  "2026-11-26": {
    "date": "2026-11-26",
    "tracks": [
      {
        "chapterNumber": 70,
        "chapterTitle": "Proving God\u2019s Perfect Will (3)",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/70-proving-gods-perfect-will.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/70-proving-gods-perfect-will",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21
        ],
        "paragraphStartTimes": [
          0.0,
          24.1,
          67.3,
          140.1,
          262.4,
          383.0,
          481.3,
          610.4,
          659.9,
          678.2,
          691.3,
          696.1,
          700.5,
          705.3,
          709.0,
          714.0,
          721.2,
          729.0,
          733.8,
          742.6,
          748.7,
          752.5
        ]
      }
    ]
  },
  "2026-11-27": {
    "date": "2026-11-27",
    "tracks": [
      {
        "chapterNumber": 71,
        "chapterTitle": "Submission To Authority",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/71-submission-to-authority.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/71-submission-to-authority",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "paragraphStartTimes": [
          0.0,
          24.1,
          106.7,
          203.3,
          261.1,
          307.5,
          421.5,
          512.6,
          574.6,
          641.6,
          691.1,
          768.1
        ]
      }
    ]
  },
  "2026-11-28": {
    "date": "2026-11-28",
    "tracks": [
      {
        "chapterNumber": 72,
        "chapterTitle": "God\u2019s Plan For Those Who Have Failed",
        "audioUrl": "https://www.cfcindia.org/resources/en/study-series/basic-christian-teachings/72-gods-plan-for-those-who-have-failed.mp3",
        "studyUrl": "https://cfcindia.com/basic-christian-teachings/72-gods-plan-for-those-who-have-failed",
        "startOffsetSec": 0.0,
        "endOffsetSec": 780.0,
        "paragraphIndices": [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ],
        "paragraphStartTimes": [
          0.0,
          23.4,
          69.9,
          160.0,
          249.6,
          319.5,
          367.7,
          406.1,
          466.8,
          546.5,
          625.0,
          714.0,
          753.3
        ]
      }
    ]
  }
};
