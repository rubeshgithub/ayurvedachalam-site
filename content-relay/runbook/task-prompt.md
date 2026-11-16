# Scheduled task prompt

Paste as the task's instruction. Runs Monday, Wednesday and Friday at 09:00 America/Edmonton.

```
Article run for ayurvedachalam.com. One article per run.

Read first, in this order, from this project's docs:
1. runbook/rules.md      — wording, legal and article rules. R1, R2, R3, R4 and R8 are binding.
2. runbook/product.md    — the practice, services, URLs.
3. github-token note     — repo name and the verified git commands. Never print the token.
Then clone the site repo (rubeshgithub/ayurvedachalam-site), work ONLY inside content-relay/, and read content-relay/queue.md.

Do exactly this:
1. Take the first queue row whose Status is "Pending". If its "Links to" page is not live
   yet (check the row notes), take the next Pending row and note the swap. If none are
   Pending, propose five new topics from the categories in the runbook and stop.
2. Research with web search. Every fee, rule, date, statistic and safety fact must come
   from a primary source opened in this run (Health Canada, Statistics Canada, Alberta,
   a regulator, a peer-reviewed paper). Record title, URL, publisher and today's date.
3. Write the article to R4: 1,000–1,800 words, answer in the first two sentences, 4–7 H2s
   with at least three as questions, FAQ of 3–5, sources, the required notice, a closing
   call to action linking to one service page and /book/. Voice per R5. Wording per R1.3.
   Tie to Calgary or Canada where natural. Use the seo-content-engine skill's article
   template for on-page structure if it is available.
4. Self-check: title ≤60 characters, meta ≤155, one H1, no banned words (R1.3), no "Dr.",
   no disease-treatment claims, every number sourced, 2+ internal links that exist, primary
   keyword not used elsewhere in queue.md or the page map. Fix what fails. If something
   cannot be fixed without changing the topic, set needs_human true and say why.
5. Build the payload JSON (schema 1) as content-relay/inbox/<slug>.json. Set needs_human true when the
   queue row's Mode is "review".
6. Commit ONLY files under content-relay/ to main and push. Wait up to 5 minutes for the relay's cleanup commit
   ("relay: delivered <slug>"). At most two push attempts.
7. On success: set the row's Status to "Delivered <date>" in queue.md, commit, push.
   Report: title, slug, status returned by the relay, and what the practitioner should
   look at during the hold. Remind the owner the article can be edited or rejected at
   https://ayurvedachalam.com/cms before it goes live.
8. On failure: save the article and payload as files, send them to the owner, explain what
   failed, stop. Never call ayurvedachalam.com directly. Never change any file outside content-relay/.
```
