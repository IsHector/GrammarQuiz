"""Interactive high-school grammar and SAT/ACT preparation quiz."""

from datetime import datetime
from pathlib import Path


LESSONS = [
    {
        "title": "Adjectives",
        "definition": (
            "An adjective describes or modifies a noun or pronoun. It can tell "
            "which one, what kind, or how many."
        ),
        "tip": (
            "On the SAT and ACT, adjectives often appear near the nouns they "
            "describe. Watch for misplaced modifiers: a descriptive phrase "
            "should clearly modify the noun that follows it."
        ),
        "questions": [
            ("Identify the adjective: The ancient bridge crossed the narrow river.", "ancient"),
            ("Identify the adjective: Maya solved three difficult problems.", "difficult"),
            ("Identify the adjective: That careful student checked every answer.", "careful"),
            ("Identify the adjective: The bright stars filled the winter sky.", "bright"),
            ("Identify the adjective: We visited a peaceful coastal town.", "peaceful"),
        ],
    },
    {
        "title": "Verbs",
        "definition": (
            "A verb expresses an action, an occurrence, or a state of being. "
            "Every complete sentence needs a verb."
        ),
        "tip": (
            "Standardized tests frequently check subject-verb agreement and verb "
            "tense. Find the true subject, ignore interrupting phrases, and keep "
            "the verb's time consistent."
        ),
        "questions": [
            ("Identify the verb: The scientist measured the temperature.", "measured"),
            ("Identify the verb: The students are preparing for the exam.", "are preparing"),
            ("Identify the verb: The old theater remains remarkably beautiful.", "remains"),
            ("Identify the verb: Jordan will revise the essay tonight.", "will revise"),
            ("Identify the verb: Rain fell throughout the afternoon.", "fell"),
        ],
    },
    {
        "title": "Adverbs",
        "definition": (
            "An adverb modifies a verb, adjective, or another adverb. It often "
            "explains how, when, where, or to what degree."
        ),
        "tip": (
            "Many adverbs end in -ly, but not all do. In test questions, ask "
            "which word gives more information about the action or description."
        ),
        "questions": [
            ("Identify the adverb: The runner finished quickly.", "quickly"),
            ("Identify the adverb: The orchestra played extremely well.", "extremely"),
            ("Identify the adverb: We searched everywhere for the missing key.", "everywhere"),
            ("Identify the adverb: The speaker answered the question confidently.", "confidently"),
            ("Identify the adverb: The train arrived early.", "early"),
        ],
    },
]

MIXED_QUESTIONS = [
    ("Identify the adjective: The determined team practiced daily.", "determined", "adjective"),
    ("Identify the verb: The committee approved the proposal.", "approved", "verb"),
    ("Identify the adverb: The author wrote remarkably clearly.", "remarkably", "adverb"),
    ("Identify the adjective: Several complex ideas appeared in the passage.", "complex", "adjective"),
    ("Identify the verb: The evidence supports the main conclusion.", "supports", "verb"),
]


def ask_question(number, total, prompt, answer):
    """Ask one question and return whether the response is correct."""
    print(f"\nQuestion {number} of {total}")
    print(prompt)
    response = input("Your answer: ").strip().lower()
    expected = answer.lower()
    correct = response == expected
    if correct:
        print("Correct!")
    else:
        print(f"Not quite. The answer is: {answer}")
    return correct


def run_lesson(lesson, results):
    """Teach one grammar topic, then administer its five-question test."""
    print("\n" + "=" * 72)
    print(f"LESSON: {lesson['title'].upper()}")
    print("=" * 72)
    print(f"Definition: {lesson['definition']}")
    print(f"Test tip: {lesson['tip']}")
    input("\nPress Enter when you are ready for the five questions...")

    lesson_score = 0
    for number, (prompt, answer) in enumerate(lesson["questions"], start=1):
        correct = ask_question(number, 5, prompt, answer)
        lesson_score += int(correct)
        results.append({
            "section": lesson["title"],
            "prompt": prompt,
            "answer": answer,
            "correct": correct,
        })
    print(f"{lesson['title']} score: {lesson_score}/5")


def run_mixed_test(results):
    """Administer the final mixed grammar test."""
    print("\n" + "=" * 72)
    print("MIXED GRAMMAR REVIEW")
    print("=" * 72)
    print("Identify the requested part of speech in each sentence.")
    input("Press Enter when you are ready for the five mixed questions...")

    for number, (prompt, answer, topic) in enumerate(MIXED_QUESTIONS, start=1):
        correct = ask_question(number, 5, prompt, answer)
        results.append({
            "section": "Mixed Review",
            "prompt": prompt,
            "answer": answer,
            "correct": correct,
            "topic": topic,
        })


def build_report(results):
    """Create a plain-text report suitable for printing or saving."""
    total = len(results)
    correct = sum(result["correct"] for result in results)
    percentage = correct / total * 100 if total else 0
    report = [
        "HIGH SCHOOL GRAMMAR | SAT/ACT PREPARATION RESULTS",
        "=" * 56,
        f"Completed: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}",
        f"Total score: {correct}/{total} ({percentage:.0f}%)",
        "",
        "SECTION SCORES",
    ]

    sections = ["Adjectives", "Verbs", "Adverbs", "Mixed Review"]
    for section in sections:
        section_results = [item for item in results if item["section"] == section]
        section_correct = sum(item["correct"] for item in section_results)
        report.append(f"{section}: {section_correct}/{len(section_results)}")

    report.extend(["", "QUESTION REVIEW", "-"])
    for number, result in enumerate(results, start=1):
        status = "Correct" if result["correct"] else "Review"
        report.append(f"{number:>2}. [{status}] {result['section']}: {result['answer']}")

    report.extend([
        "",
        "STUDY NEXT",
        "- 90-100%: Continue to sentence boundaries, clauses, and rhetoric.",
        "- 70-89%: Review the sections marked Review and retake them.",
        "- Below 70%: Reread each definition, then practice one topic at a time.",
    ])
    return "\n".join(report)


def main():
    print("HIGH SCHOOL GRAMMAR AND SAT/ACT PREP")
    print("Learn a topic, answer five questions, and track your progress.")
    results = []

    for lesson in LESSONS:
        run_lesson(lesson, results)
    run_mixed_test(results)

    report = build_report(results)
    print("\n" + "\n" + report)
    report_path = Path.cwd() / "grammar_quiz_results.txt"
    report_path.write_text(report + "\n", encoding="utf-8")
    print(f"\nA printable copy was saved to: {report_path}")


if __name__ == "__main__":
    main()
