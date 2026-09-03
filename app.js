const LESSONS = [
  {
    title: 'Adjectives',
    definition:
      'An adjective describes or modifies a noun or pronoun. It can tell which one, what kind, or how many.',
    tip:
      'On the SAT and ACT, adjectives often appear near the nouns they describe. Watch for misplaced modifiers: a descriptive phrase should clearly modify the noun that follows it.',
    questions: [
      ['Identify the adjective: The ancient bridge crossed the narrow river.', 'ancient'],
      ['Identify the adjective: Maya solved three difficult problems.', 'difficult'],
      ['Identify the adjective: That careful student checked every answer.', 'careful'],
      ['Identify the adjective: The bright stars filled the winter sky.', 'bright'],
      ['Identify the adjective: We visited a peaceful coastal town.', 'peaceful'],
    ],
  },
  {
    title: 'Verbs',
    definition:
      'A verb expresses an action, an occurrence, or a state of being. Every complete sentence needs a verb.',
    tip:
      'Standardized tests frequently check subject-verb agreement and verb tense. Find the true subject, ignore interrupting phrases, and keep the verb\'s time consistent.',
    questions: [
      ['Identify the verb: The scientist measured the temperature.', 'measured'],
      ['Identify the verb: The students are preparing for the exam.', 'are preparing'],
      ['Identify the verb: The old theater remains remarkably beautiful.', 'remains'],
      ['Identify the verb: Jordan will revise the essay tonight.', 'will revise'],
      ['Identify the verb: Rain fell throughout the afternoon.', 'fell'],
    ],
  },
  {
    title: 'Adverbs',
    definition:
      'An adverb modifies a verb, adjective, or another adverb. It often explains how, when, where, or to what degree.',
    tip:
      'Many adverbs end in -ly, but not all do. In test questions, ask which word gives more information about the action or description.',
    questions: [
      ['Identify the adverb: The runner finished quickly.', 'quickly'],
      ['Identify the adverb: The orchestra played extremely well.', 'extremely'],
      ['Identify the adverb: We searched everywhere for the missing key.', 'everywhere'],
      ['Identify the adverb: The speaker answered the question confidently.', 'confidently'],
      ['Identify the adverb: The train arrived early.', 'early'],
    ],
  },
];

const MIXED_QUESTIONS = [
  ['Identify the adjective: The determined team practiced daily.', 'determined', 'adjective'],
  ['Identify the verb: The committee approved the proposal.', 'approved', 'verb'],
  ['Identify the adverb: The author wrote remarkably clearly.', 'remarkably', 'adverb'],
  ['Identify the adjective: Several complex ideas appeared in the passage.', 'complex', 'adjective'],
  ['Identify the verb: The evidence supports the main conclusion.', 'supports', 'verb'],
];

const app = document.getElementById('app');
const state = {
  currentLesson: 0,
  currentQuestion: 0,
  results: [],
  mixedResults: [],
  phase: 'start',
};

function render() {
  if (state.phase === 'start') {
    renderStart();
    return;
  }

  if (state.phase === 'lessonIntro') {
    renderLessonIntro(LESSONS[state.currentLesson]);
    return;
  }

  if (state.phase === 'question') {
    renderQuestion(LESSONS[state.currentLesson].questions[state.currentQuestion][0], state.currentQuestion + 1, 5);
    return;
  }

  if (state.phase === 'lessonSummary') {
    renderLessonSummary();
    return;
  }

  if (state.phase === 'mixedIntro') {
    renderMixedIntro();
    return;
  }

  if (state.phase === 'mixedQuestion') {
    renderMixedQuestion();
    return;
  }

  if (state.phase === 'results') {
    renderResults();
  }
}

function renderStart() {
  const html = `
    <section class="card hero">
      <h2>High-school grammar and SAT/ACT prep</h2>
      <p class="subtitle">
        Learn a topic, answer five questions, and track your progress. This version is mobile-friendly for phones and tablets.
      </p>
      <div class="lesson-list">
        ${LESSONS.map((lesson, index) => `
          <button class="lesson-button" data-lesson="${index}">
            ${index + 1}. ${lesson.title}
          </button>
        `).join('')}
      </div>
      <button class="primary-button" id="start-all">Start all lessons</button>
    </section>
  `;

  app.innerHTML = html;

  document.querySelectorAll('[data-lesson]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.lesson);
      state.currentLesson = index;
      state.phase = 'lessonIntro';
      render();
    });
  });

  document.getElementById('start-all').addEventListener('click', () => {
    state.currentLesson = 0;
    state.currentQuestion = 0;
    state.phase = 'lessonIntro';
    render();
  });
}

function renderLessonIntro(lesson) {
  const html = `
    <section class="card lesson-card">
      <h3 class="lesson-heading">${lesson.title}</h3>
      <p class="definition"><strong>Definition:</strong> ${lesson.definition}</p>
      <p class="tip"><strong>Test tip:</strong> ${lesson.tip}</p>
      <button class="primary-button" id="begin-lesson">Begin ${lesson.title} quiz</button>
    </section>
  `;

  app.innerHTML = html;
  document.getElementById('begin-lesson').addEventListener('click', () => {
    state.currentQuestion = 0;
    state.phase = 'question';
    render();
  });
}

function renderQuestion(prompt, questionNumber, total) {
  const currentLesson = LESSONS[state.currentLesson];
  const [actualPrompt, answer] = currentLesson.questions[state.currentQuestion];

  const html = `
    <section class="card question-card">
      <h3 class="question-heading">Question ${questionNumber} of ${total}</h3>
      <p class="meta">Lesson: ${currentLesson.title}</p>
      <p class="question-text">${actualPrompt}</p>
      <div class="form-row">
        <input id="answer-input" class="answer-input" type="text" placeholder="Type your answer" autocomplete="off" />
        <button class="answer-button" id="submit-answer">Submit answer</button>
      </div>
      <div id="feedback" class="feedback" aria-live="polite"></div>
    </section>
  `;

  app.innerHTML = html;

  const input = document.getElementById('answer-input');
  input.focus();

  document.getElementById('submit-answer').addEventListener('click', () => {
    const response = input.value.trim().toLowerCase();
    const expected = answer.toLowerCase();
    const correct = response === expected;

    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
    feedback.textContent = correct
      ? 'Correct!'
      : `Not quite. The answer is: ${answer}`;

    state.results.push({
      section: currentLesson.title,
      prompt: actualPrompt,
      answer,
      correct,
    });

    const next = () => {
      state.currentQuestion += 1;
      if (state.currentQuestion >= currentLesson.questions.length) {
        state.phase = 'lessonSummary';
      } else {
        state.phase = 'question';
      }
      render();
    };

    setTimeout(next, 900);
  });
}

function renderLessonSummary() {
  const lesson = LESSONS[state.currentLesson];
  const sectionResults = state.results.filter((result) => result.section === lesson.title);
  const score = sectionResults.filter((result) => result.correct).length;

  const html = `
    <section class="card results-card">
      <h3 class="lesson-heading">${lesson.title} complete</h3>
      <div class="score-box">
        <strong>Score:</strong> ${score}/5
      </div>
      <div class="nav-row">
        <button class="secondary-button" id="review-lessons">Back to lessons</button>
        <button class="primary-button" id="next-step">Continue</button>
      </div>
    </section>
  `;

  app.innerHTML = html;

  document.getElementById('review-lessons').addEventListener('click', () => {
    state.phase = 'start';
    render();
  });

  document.getElementById('next-step').addEventListener('click', () => {
    state.currentLesson += 1;
    if (state.currentLesson < LESSONS.length) {
      state.phase = 'lessonIntro';
    } else {
      state.phase = 'mixedIntro';
    }
    render();
  });
}

function renderMixedIntro() {
  const html = `
    <section class="card lesson-card">
      <h3 class="lesson-heading">Mixed grammar review</h3>
      <p class="definition">Identify the requested part of speech in each sentence.</p>
      <button class="primary-button" id="begin-mixed">Start mixed review</button>
    </section>
  `;

  app.innerHTML = html;
  document.getElementById('begin-mixed').addEventListener('click', () => {
    state.currentQuestion = 0;
    state.phase = 'mixedQuestion';
    render();
  });
}

function renderMixedQuestion() {
  const [prompt, answer, topic] = MIXED_QUESTIONS[state.currentQuestion];
  const html = `
    <section class="card question-card">
      <h3 class="question-heading">Mixed review question ${state.currentQuestion + 1} of ${MIXED_QUESTIONS.length}</h3>
      <p class="meta">Part of speech: ${topic}</p>
      <p class="question-text">${prompt}</p>
      <div class="form-row">
        <input id="mixed-answer" class="answer-input" type="text" placeholder="Type your answer" autocomplete="off" />
        <button class="answer-button" id="submit-mixed">Submit answer</button>
      </div>
      <div id="mixed-feedback" class="feedback" aria-live="polite"></div>
    </section>
  `;

  app.innerHTML = html;
  document.getElementById('mixed-answer').focus();

  document.getElementById('submit-mixed').addEventListener('click', () => {
    const response = document.getElementById('mixed-answer').value.trim().toLowerCase();
    const expected = answer.toLowerCase();
    const correct = response === expected;
    const feedback = document.getElementById('mixed-feedback');

    feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
    feedback.textContent = correct
      ? 'Correct!'
      : `Not quite. The answer is: ${answer}`;

    state.mixedResults.push({
      section: 'Mixed Review',
      prompt,
      answer,
      correct,
      topic,
    });

    setTimeout(() => {
      state.currentQuestion += 1;
      if (state.currentQuestion >= MIXED_QUESTIONS.length) {
        state.phase = 'results';
      } else {
        state.phase = 'mixedQuestion';
      }
      render();
    }, 900);
  });
}

function renderResults() {
  const allResults = [...state.results, ...state.mixedResults];
  const total = allResults.length;
  const correct = allResults.filter((result) => result.correct).length;
  const percentage = total ? Math.round((correct / total) * 100) : 0;

  const sectionData = ['Adjectives', 'Verbs', 'Adverbs', 'Mixed Review']
    .map((section) => {
      const sectionResults = allResults.filter((result) => result.section === section);
      const sectionCorrect = sectionResults.filter((result) => result.correct).length;
      return { section, correct: sectionCorrect, total: sectionResults.length };
    })
    .filter((item) => item.total > 0);

  const html = `
    <section class="card results-card">
      <h3 class="lesson-heading">Results</h3>
      <div class="score-box">
        <strong>Total score:</strong> ${correct}/${total} (${percentage}%)
      </div>

      <div class="stats-grid">
        ${sectionData
          .map(
            (item) => `
              <div class="stat">
                <span class="stat-label">${item.section}</span>
                <span class="stat-value">${item.correct}/${item.total}</span>
              </div>
            `
          )
          .join('')}
      </div>

      <div class="final-report">
        <h4>Review notes</h4>
        <ol class="review-list">
          ${allResults
            .map((result) => `
              <li>
                ${result.correct ? 'Correct' : 'Review'} — ${result.section}: ${result.answer}
              </li>
            `)
            .join('')}
        </ol>
      </div>

      <div class="nav-row">
        <button class="secondary-button" id="restart">Start again</button>
        <a class="dl-button" id="download-results">Download report</a>
      </div>
    </section>
  `;

  app.innerHTML = html;

  document.getElementById('restart').addEventListener('click', () => {
    state.currentLesson = 0;
    state.currentQuestion = 0;
    state.results = [];
    state.mixedResults = [];
    state.phase = 'start';
    render();
  });

  const reportText = buildReport(allResults);
  document.getElementById('download-results').setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText)
  );
  document.getElementById('download-results').setAttribute('download', 'grammar_quiz_results.txt');
}

function buildReport(results) {
  const total = results.length;
  const correct = results.filter((result) => result.correct).length;
  const percentage = total ? Math.round((correct / total) * 100) : 0;

  const lines = [
    'HIGH SCHOOL GRAMMAR | SAT/ACT PREPARATION RESULTS',
    '=============================================',
    `Total score: ${correct}/${total} (${percentage}%)`,
    '',
    'SECTION SCORES',
  ];

  ['Adjectives', 'Verbs', 'Adverbs', 'Mixed Review'].forEach((section) => {
    const sectionResults = results.filter((result) => result.section === section);
    const sectionCorrect = sectionResults.filter((result) => result.correct).length;
    lines.push(`${section}: ${sectionCorrect}/${sectionResults.length}`);
  });

  lines.push('', 'QUESTION REVIEW');
  results.forEach((result, index) => {
    lines.push(`${index + 1}. [${result.correct ? 'Correct' : 'Review'}] ${result.section}: ${result.answer}`);
  });

  return lines.join('\n');
}

render();
