# Progress tracking

The dashboard at https://sparsh1402.github.io/NOTES/progress/ compares my interview prep against the SDE-2 hiring bar. It reads two files in this folder:

- `areas.json` holds the skill areas, the SDE-2 bar for each (0-10) and how much each area weighs. Edit it to change the benchmark.
- `sessions.json` holds one entry per scored practice session. Claude in my other prep projects adds to it.

## Instructions for Claude in a prep project

After every mock interview or practice round, score me and add one entry to the `sessions` array in `progress/sessions.json`, then commit with the message `Log progress: <title>` and push to `main`.

```json
{
  "date": "2026-10-24",
  "area": "dsa",
  "score": 6.5,
  "title": "Mock round: sliding window + LRU cache",
  "source": "DSA prep project",
  "strengths": ["Found the O(n) approach without hints"],
  "gaps": ["Missed the empty-input edge case", "Took 35 min, target is 25"]
}
```

- `area` must be one of: `dsa`, `lld`, `hld`, `cs`, `lang`, `prod`, `behavioral`, `ai`.
- `score` is 0-10 against what an SDE-2 interviewer at a product company expects: 6-7 means SDE-2 level, 4-5 SDE-1 level.
- Keep `gaps` specific enough to act on. They feed the dashboard's "Focus next" list.
- Append to the array. Never edit or delete earlier entries.
- Also tell me the score and gaps in chat.

## After every HLD (system design) round: write the solution note

Besides logging the session, add the full model answer to the HLD tab of the notes site:

1. Create `notes/hld/NN_<Problem_Name>.md` (next number in sequence). Follow the structure of `notes/hld/01_Price_Drop_Alerts.md`:
   prompt, Quick Revision table, clarifying questions, requirements (functional + NFR with numbers), capacity estimation worked out step by step,
   API design, data model with keys derived from the access patterns, architecture diagram (```mermaid flowchart TB```), sequence diagram of the main flow,
   2–4 deep dives, bottlenecks and failure handling table, trade-offs and alternatives, **15+ follow-up questions with answers**, concepts glossary,
   "My mock vs a strong answer" table using the round's actual gaps, and a 45-minute game plan.
2. Register it in `app.js` under `notesData.hld.sections['case-studies']` as `{ id: 'hld-NN', title: '...', file: 'notes/hld/NN_....md' }`.
3. Bump the `app.js?v=` cache-buster in `index.html`.
4. Mermaid diagrams render on the site. Avoid `#` inside sequence-diagram messages (Mermaid treats it as an entity code).
5. Commit as `Add HLD notes: <problem>` together with or after the `Log progress:` commit, and push to `main`.
