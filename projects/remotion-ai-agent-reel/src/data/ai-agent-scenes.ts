import type {Scene} from '../types';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const scenes: Scene[] = [
  {
    id: '01-hook',
    type: 'hook',
    duration: 3.5,
    narration: 'AI is changing again.',
    headline: 'AI is changing',
    highlight: 'again.',
    captions: [
      {start: 0.0, end: 1.8, text: 'AI is changing', highlight: ['AI']},
      {start: 1.8, end: 3.5, text: 'again.', highlight: ['again.']}
    ]
  },
  {
    id: '02-not-chatbot',
    type: 'kinetic',
    duration: 4.0,
    narration: "And this time, it’s not about getting a smarter chatbot.",
    headline: 'NOT JUST A',
    highlight: 'SMARTER CHATBOT',
    captions: [
      {start: 0.0, end: 1.1, text: 'And this time,'},
      {start: 1.1, end: 2.6, text: 'it’s not about getting'},
      {start: 2.6, end: 4.0, text: 'a smarter chatbot.', highlight: ['smarter', 'chatbot.']}
    ]
  },
  {
    id: '03-agent',
    type: 'number',
    duration: 4.0,
    narration: 'The next big thing is called an AI agent.',
    headline: 'THE NEXT BIG THING',
    highlight: 'AI AGENT',
    captions: [
      {start: 0.0, end: 2.0, text: 'The next big thing'},
      {start: 2.0, end: 4.0, text: 'is called an AI agent.', highlight: ['AI', 'agent.']}
    ]
  },
  {
    id: '04-do-work',
    type: 'diagram',
    duration: 4.5,
    narration: 'Instead of waiting for you to ask a question, it can actually do the work for you.',
    headline: 'ASK → ACT → FINISH',
    labels: ['You', 'Agent', 'Task complete'],
    captions: [
      {start: 0.0, end: 1.3, text: 'Instead of waiting for you'},
      {start: 1.3, end: 2.4, text: 'to ask a question,'},
      {start: 2.4, end: 3.4, text: 'it can actually do', highlight: ['actually', 'do']},
      {start: 3.4, end: 4.5, text: 'the work for you.', highlight: ['work']}
    ]
  },
  {
    id: '05-prompt',
    type: 'prompt',
    duration: 5.0,
    narration: 'Imagine telling AI: “Research the best laptop under $1,500.”',
    headline: 'Give AI a goal',
    quote: 'Research the best laptop under $1,500.',
    highlight: '$1,500',
    captions: [
      {start: 0.0, end: 1.8, text: 'Imagine telling AI:'},
      {start: 1.8, end: 3.5, text: '“Research the best laptop'},
      {start: 3.5, end: 5.0, text: 'under $1,500.”', highlight: ['$1,500.”']}
    ]
  },
  {
    id: '06-browser-workflow',
    type: 'browser',
    duration: 7.0,
    narration: 'Instead of just giving you advice, it can browse websites, compare products, organise the results and prepare everything for you.',
    headline: 'One request. Multiple actions.',
    items: ['Browse websites', 'Compare products', 'Organise results', 'Prepare shortlist'],
    captions: [
      {start: 0.0, end: 2.0, text: 'Instead of just giving you advice,'},
      {start: 2.0, end: 3.3, text: 'it can browse websites,', highlight: ['browse']},
      {start: 3.3, end: 5.2, text: 'compare products, organise the results', highlight: ['compare']},
      {start: 5.2, end: 7.0, text: 'and prepare everything for you.', highlight: ['prepare']}
    ]
  },
  {
    id: '07-already-here',
    type: 'kinetic',
    duration: 3.0,
    narration: 'And we’re already seeing this happen.',
    headline: 'THIS IS NOT FUTURE TECH',
    highlight: 'IT IS ALREADY HAPPENING',
    captions: [
      {start: 0.0, end: 1.4, text: 'And we’re already', highlight: ['already']},
      {start: 1.4, end: 3.0, text: 'seeing this happen.', highlight: ['happen.']}
    ]
  },
  {
    id: '08-openai',
    type: 'app-window',
    duration: 4.0,
    narration: 'OpenAI is building always-on agents.',
    headline: 'ALWAYS-ON AGENTS',
    subheadline: 'Observe • plan • act • continue',
    captions: [
      {start: 0.0, end: 2.0, text: 'OpenAI is building', highlight: ['OpenAI']},
      {start: 2.0, end: 4.0, text: 'always-on agents.', highlight: ['agents.']}
    ]
  },
  {
    id: '09-microsoft',
    type: 'app-window',
    duration: 4.5,
    narration: 'Microsoft is turning Copilot into something closer to an operating system for work.',
    headline: 'COPILOT → WORK LAYER',
    subheadline: 'Apps • files • meetings • actions',
    captions: [
      {start: 0.0, end: 1.8, text: 'Microsoft is turning Copilot', highlight: ['Copilot']},
      {start: 1.8, end: 2.8, text: 'into something closer'},
      {start: 2.8, end: 3.8, text: 'to an operating system'},
      {start: 3.8, end: 4.5, text: 'for work.', highlight: ['work.']}
    ]
  },
  {
    id: '10-race',
    type: 'diagram',
    duration: 3.5,
    narration: 'And almost every major AI company is racing in the same direction.',
    headline: 'THE RACE',
    labels: ['Models', 'Tools', 'Agents'],
    captions: [
      {start: 0.0, end: 1.9, text: 'And almost every major AI company', highlight: ['AI']},
      {start: 1.9, end: 3.5, text: 'is racing in the same direction.', highlight: ['racing']}
    ]
  },
  {
    id: '11-comparison',
    type: 'comparison',
    duration: 5.0,
    narration: 'The important difference is simple: Chatbots answer questions. Agents complete tasks.',
    headline: 'THE DIFFERENCE',
    labels: ['CHATBOT', 'AGENT'],
    items: ['Answers questions', 'Completes tasks'],
    captions: [
      {start: 0.0, end: 1.7, text: 'The important difference is simple:'},
      {start: 1.7, end: 3.3, text: 'Chatbots answer questions.', highlight: ['Chatbots']},
      {start: 3.3, end: 5.0, text: 'Agents complete tasks.', highlight: ['Agents', 'tasks.']}
    ]
  },
  {
    id: '12-features',
    type: 'feature-list',
    duration: 5.0,
    narration: 'Coding. Research. Emails. Documents. Scheduling. Data analysis. Even controlling software.',
    headline: 'WHAT AGENTS CAN HANDLE',
    items: ['Coding', 'Research', 'Emails', 'Documents', 'Scheduling', 'Data analysis', 'Software control'],
    captions: [
      {start: 0.0, end: 1.8, text: 'Coding. Research. Emails. Documents.', highlight: ['Coding.']},
      {start: 1.8, end: 3.3, text: 'Scheduling. Data analysis.', highlight: ['Data']},
      {start: 3.3, end: 5.0, text: 'Even controlling software.', highlight: ['software.']}
    ]
  },
  {
    id: '13-one-command',
    type: 'diagram',
    duration: 4.0,
    narration: 'Soon, you might not open ten different apps to complete a job. You’ll simply tell your AI what you want finished.',
    headline: '10 APPS → 1 REQUEST',
    labels: ['Mail', 'Docs', 'Browser', 'Calendar', 'Code', 'AI'],
    captions: [
      {start: 0.0, end: 0.9, text: 'Soon, you might not open'},
      {start: 0.9, end: 1.7, text: 'ten different apps', highlight: ['ten']},
      {start: 1.7, end: 2.4, text: 'to complete a job.'},
      {start: 2.4, end: 3.3, text: 'You’ll simply tell your AI', highlight: ['AI']},
      {start: 3.3, end: 4.0, text: 'what you want finished.', highlight: ['finished.']}
    ]
  },
  {
    id: '14-outro',
    type: 'outro',
    duration: 3.0,
    narration: 'The chatbot era was only the beginning. The AI agent era is here.',
    headline: 'THE CHATBOT ERA',
    subheadline: 'was only the beginning.',
    highlight: 'THE AGENT ERA IS HERE',
    captions: [
      {start: 0.0, end: 0.9, text: 'The chatbot era', highlight: ['chatbot']},
      {start: 0.9, end: 1.7, text: 'was only the beginning.', highlight: ['beginning.']},
      {start: 1.7, end: 3.0, text: 'The AI agent era is here.', highlight: ['AI', 'agent', 'here.']}
    ]
  }
];

export const totalDurationSeconds = scenes.reduce((sum, scene) => sum + scene.duration, 0);
export const totalDurationInFrames = Math.round(totalDurationSeconds * FPS);
