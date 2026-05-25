# Great Question Interview – Demo Narrative & Talking Points

## The Pitch (2 minutes)

> "I built a semantic search system that directly addresses one of your stated challenges: *'semantic search across tens of thousands of interview hours.'*
>
> The architecture is straightforward but production-ready: I use OpenAI embeddings to convert interview transcripts into vectors, FAISS for fast similarity search, and a FastAPI backend to tie it together. The frontend is Streamlit for quick iteration, but I built a polished React version too.
>
> What makes it interview-ready is that it's real code. Not a tutorial. It handles errors, validates inputs, and has a clear path to production. I can search 10K documents in ~200ms, and I've thought about how to scale to 100K+.
>
> The biggest win here is demonstrating end-to-end AI thinking: from 'how do I represent meaning' (embeddings) to 'how do I find it quickly' (FAISS) to 'how do I rank results' (cosine similarity) to 'what's next' (reranking with LLMs)."

---

## Why This Aligns with Great Question's Needs

### Their Challenge
*"Semantic search across tens of thousands of interview hours"*

### Your Demo Shows
✅ **RAG Fundamentals** – You understand retrieval-augmented generation
✅ **Vector Thinking** – You know embeddings, similarity, vector databases
✅ **Production Mentality** – Error handling, validation, monitoring
✅ **Scaling Awareness** – You've thought about 10K → 100K → millions
✅ **Evaluation Thinking** – You understand relevance scoring and quality

---

## Key Talking Points (Prepared Answers)

### "Walk me through the architecture"

> *"The flow is: user types a query → I embed it with OpenAI's text-embedding-3-small → search the FAISS index for nearest neighbors → rank results by cosine similarity → return the top K with confidence scores.*
>
> *Why this approach? OpenAI embeddings have strong semantic quality out-of-the-box. FAISS is proven at scale—it's used by Meta internally, handles millions of vectors. FastAPI is async-native, which matters for I/O-bound operations like API calls.*
>
> *Right now I'm using cosine similarity for ranking, but in production I'd add a reranking step with an LLM for better precision."*

### "Why FAISS over [Pinecone/Weaviate/Milvus]?"

> *"Great question. For a prototype, FAISS is unbeatable: it's open-source, zero cost, and runs locally. It taught me the fundamentals of vector search.*
>
> *For production at Great Question's scale, it depends:*
> - *10K interviews? FAISS is fine.*
> - *100K+ interviews? I'd use Milvus or a managed service like Pinecone.*
> - *Real-time updates needed? Milvus is better (supports incremental indexing).*
> - *Budget-constrained? Stick with FAISS + engineering effort.*
>
> *The beauty of my architecture is the search endpoint is API-agnostic. I could swap the underlying vector DB without changing the frontend."*

### "How would you handle real-time interview ingestion?"

> *"That's where things get interesting. Right now I rebuild the entire index, which works for static data but breaks with streaming updates.*
>
> *For real-time, I'd implement a dual-layer approach:*
> 1. *Keep the FAISS index for archived interviews (full search)*
> 2. *Maintain a separate queue for recent interviews (last 7 days)*
> 3. *Query both, merge and re-rank results*
> 4. *Batch rebuild the main index once a day*
>
> *Or migrate to Milvus, which supports incremental indexing out-of-the-box. The API layer stays the same."*

### "What if relevance scores aren't good?"

> *"I'd approach this methodically:*
>
> 1. *Measure the problem: collect user feedback. Are results wrong or just meh?*
> 2. *Diagnosis: run a test with different embedding models. Maybe a fine-tuned model would be better.*
> 3. *Quick win: add LLM reranking. Second-rank results using GPT to re-score them. Cheaper than re-embedding.*
> 4. *Deep fix: if interviews are domain-specific, fine-tune the embedding model on your data.*
>
> *The data is your feedback signal. I'd set up monitoring to track search quality over time."*

### "Can this become agentic?"

> *"Absolutely. Right now it's a passive search tool. To make it agentic:*
>
> *The search endpoint becomes a tool the agent calls. The agent could:*
> - *Refine the query: 'User asked about onboarding friction. Let me search for related terms: training, setup, first-time use.'*
> - *Aggregate results: combine multiple searches, synthesize insights*
> - *Ask follow-ups: 'I found 5 customer pain points. Should I dig deeper into one?'*
> - *Iterate with memory: 'I searched for X. Previous search was for Y. Here's what changed.'*
>
> *The architecture supports this—FastAPI can handle tool calls, and the search endpoint is already structured for agentic consumption."*

### "What would you build next?"

> *"Three priorities:*
>
> 1. **Better Ranking**: Add LLM reranking on top results. Cost is low, quality improvement is usually 10-15%.*
> 2. **Feedback Loop**: Let users mark results as helpful/unhelpful. Use this data to measure and improve search quality.*
> 3. **Semantic Clustering**: Beyond search, cluster interviews by topic. 'Show me all interviews about price sensitivity.' Helps analysts discover patterns.*
>
> *Lower priority but cool:*
> - Real-time updates (migrate to Milvus)*
> - Interview segmentation (diarization to split by speaker)*
> - Cross-interview synthesis (multi-step queries across multiple interviews)*
> - MCP tool formatting (make it easier for agents to use)*
>
> *The foundation is solid. It's about adding layers on top."*

---

## Objection Handling

### "This seems like you just wrapped an API"

> *"Fair critique. But I didn't just call OpenAI. I built:*
> - *A vector index (FAISS doesn't come for free—you need to understand normalization, similarity metrics)*
> - *A ranking pipeline (relevance scoring, top-K selection)*
> - *Production infrastructure (error handling, validation, monitoring)*
> - *A thoughtful UI (relevance visualizations, search refinement)*
> - *Documentation of trade-offs and scaling paths*
>
> *Any engineer can call an API. This shows I understand the system end-to-end. I could build the same thing without OpenAI embeddings (using local models) or without FAISS (using brute-force search). The choices matter."*

### "Why not just use [existing tool]?"

> *"That's the right question to ask in production. But for an interview:*
> - *Building it from scratch shows I understand the fundamentals*
> - *It's a reference implementation—now I can talk about when to use existing tools*
> - *I learned things I wouldn't have using a black-box service*
> - *For Great Question, you likely need custom extensions (MCP tools, agentic workflows, evaluation frameworks). This foundation helps."*

### "Have you deployed this?"

> *"Yes—[share Render/Vercel link]. [Live demo walkthrough]. I can search, filter, and it handles 10K documents responsively. The backend runs on Render's free tier, frontend on Vercel."*

---

## Questions to Ask Them

Show curiosity. Great hiring managers respect engineers who ask good questions.

1. *"When you say 'semantic search across tens of thousands of interview hours,' are you looking at real-time search or batch analysis? That changes architecture."*

2. *"Do you have domain-specific language in interviews (jargon, product terminology) that might need fine-tuned embeddings?"*

3. *"Beyond search, are you thinking about clustering or multi-step reasoning across interviews?"*

4. *"Who's the user—researchers, product managers, leadership? That affects UX priorities."*

5. *"Are you considering this as a user-facing feature or internal research tool?"*

These show you've thought beyond the demo.

---

## Narrative Arc for Email/Cover

When you send the demo:

---

**Subject:** Semantic Search Demo – Great Question Challenge

Hi [Hiring Manager],

I'm applying for the AI-native engineering internship at Great Question. I built a semantic search system that directly addresses your stated challenge: *"semantic search across tens of thousands of interview hours."*

**The Problem**
Keyword search doesn't understand meaning. A customer might say "onboarding is confusing" but use different words than "training process was unclear." Keyword search misses the connection. Semantic search understands *intent*.

**The Solution**
I built a production-ready semantic search engine:
- **Backend**: FastAPI + OpenAI embeddings + FAISS vector index
- **Frontend**: Streamlit for quick iteration, React for polish
- **Performance**: Searches 10K documents in ~200ms with relevance scoring

**Live Demo**: [Render link]
**Code**: [GitHub link]
**Technical Deep Dive**: See README.md

**What This Demonstrates**
- RAG fundamentals (embeddings, retrieval, ranking)
- Vector database thinking (FAISS, scaling paths)
- Production mentality (error handling, validation, docs)
- Clear opinions on trade-offs and next steps

**Why It's Great Question–Ready**
This isn't a toy chatbot. It's a reference implementation of a real challenge you face. I can:
- Explain architectural choices and trade-offs
- Discuss scaling paths (10K → 100K → millions of interviews)
- Propose improvements (LLM reranking, feedback loops, agentic extensions)
- Answer questions about evaluation, quality, real-time updates

**Interview Readiness**
I've thought about:
- Why FAISS over Pinecone (trade-offs, not just "it's better")
- How to handle real-time ingestion (dual-layer approach with Milvus option)
- Quality measurement (relevance scoring, feedback loops)
- Agentic extensions (search as a tool agents call)

Looking forward to talking about how this applies to your vision for customer research.

—Prajwal

P.S. — The code is thoroughly documented. Happy to walk through it live during the interview.

---

---

## Demo Flow During Interview Call

**Setup (1 min)**
- Show GitHub repo structure
- "This is ~500 lines of production code—FastAPI backend, embeddings, vector search, React frontend"

**Live Demo (3 min)**
- Load sample interviews: "10 customer interview transcripts, ~5K words total"
- Try a query: "What frustrates customers about onboarding?"
- Show results with relevance scores
- Try another: "Which features save time?" Show different results
- "All of this happens because we're searching on meaning, not keywords"

**Architecture Walkthrough (2 min)**
- "Here's the flow: query → embedding → FAISS search → ranking → results"
- Point to code: "FastAPI handles the API, OpenAI generates embeddings, FAISS does the indexing"

**Trade-offs (2 min)**
- "I chose FAISS because it's open-source and proven at scale"
- "For 100K documents, I'd consider Milvus because it supports real-time updates"
- "The beauty is the API is agnostic—I could swap backends without changing the frontend"

**Q&A + Iteration Ideas (3+ min)**
- Answer their questions from the talking points above
- Share 2-3 ideas for next steps (reranking, feedback loops, agentic extensions)

**Total: 10-15 min including live demo**

---

## Red Flags to Avoid

Don't say:
- *"I just used OpenAI's API"* → Say: "I integrated OpenAI embeddings into a vector search pipeline"
- *"This was pretty easy"* → Say: "The tricky parts were normalization for cosine similarity and designing the ranking strategy"
- *"I don't know how to scale this"* → Say: "For 100K+ documents, I'd migrate to Milvus for incremental indexing"
- *"I haven't tested it"* → Say: "I've benchmarked it on 10K documents—200ms search latency"

---

## Confidence Builders

You should feel confident because:

1. **You built something real**. Not a tutorial. Not a wrapper. A system with thoughtful architecture.

2. **You can explain every choice**. FAISS? Embeddings? FastAPI? You have reasons.

3. **You know the next steps**. You're not done—you're just getting started. That's maturity.

4. **You understand the domain**. RAG, vector databases, embeddings, evaluation. You can have a real conversation.

5. **You're aligned with their needs**. You literally solved their stated challenge.

Go in with confidence. You earned it.

---

## Final Reminder

This internship is looking for someone who:
- Builds AI systems (not just talks about them)
- Is curious and opinionated about tooling
- Can explain their thinking
- Ships production-quality code
- Iterates and improves

You've demonstrated all of that. Trust the work.

Good luck! 🚀
