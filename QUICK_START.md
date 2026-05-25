# 🚀 Semantic Search Demo – Quick Reference

## 5-Minute Setup

```bash
bash setup.sh
source venv/bin/activate

# Terminal 1: Backend
python semantic_search_backend.py

# Terminal 2: Frontend
streamlit run streamlit_app.py
```

Visit: http://localhost:8501

---

## What You're Demoing

A **semantic search engine** for customer interview data that understands meaning, not just keywords.

**Example:**
- Query: "What frustrates customers about onboarding?"
- System finds interview excerpts that match semantically
- Shows relevance scores (how similar to your query)
- Works at scale (100K+ documents in seconds)

---

## Key Files

| File | Purpose |
|------|---------|
| `semantic_search_backend.py` | FastAPI server + FAISS indexing |
| `streamlit_app.py` | Simple UI (best for quick demo) |
| `semantic_search_frontend.jsx` | Polished React UI (production) |
| `README.md` | Full technical docs |
| `requirements.txt` | Python dependencies |

---

## Interview Talking Points

### 1. "Why FAISS?"
> Open-source vector database. Proven at millions of documents. Fast similarity search. Easy to integrate.

### 2. "How does it scale?"
> FAISS can handle 10K docs easily. For 100K+, switch to GPU FAISS. For millions, use Milvus/Pinecone. API layer unchanged.

### 3. "What about quality?"
> Relevance scores are cosine similarity. For better ranking, add LLM reranking. Collect user feedback to improve.

### 4. "How is this agentic?"
> The search endpoint could be a tool an LLM agent calls. Agent could refine queries or combine multiple searches.

### 5. "What's next?"
> Real-time document updates. Feedback loops for quality. Semantic clustering. MCP tool integration.

---

## Architecture in 30 Seconds

```
User Query
    ↓
Embed with OpenAI
    ↓
Search FAISS index
    ↓
Rank by relevance
    ↓
Return top 5 + scores
```

---

## Tech Stack

**Backend:** FastAPI + OpenAI API + FAISS
**Frontend:** Streamlit (simple) or React (polished)
**Deployment:** Render, Vercel, or AWS

---

## Example Queries to Try

1. "What do customers love about this product?"
2. "What frustrates them most?"
3. "How is customer support?"
4. "Which features save time?"
5. "What's missing or broken?"

---

## Pro Tips

- **Show iteration thinking**: "Here's v1, here's what I'd improve in v2"
- **Mention trade-offs**: "I chose FAISS over Pinecone because..."
- **Connect to Great Question**: "This solves your stated challenge..."
- **Be specific**: "FAISS does L2 normalization for cosine similarity"
- **Have opinions**: "I'd add LLM reranking next because..."

---

## Troubleshooting

**"Backend not running"**
→ Check terminal: `python semantic_search_backend.py`

**"OPENAI_API_KEY not found"**
→ Create `.env`: `OPENAI_API_KEY=sk-...`

**"FAISS index not initialized"**
→ Click "Load Sample Interviews" button

---

## GitHub Setup

```bash
git init
git add .
git commit -m "Semantic search demo for Great Question"
git remote add origin https://github.com/YOUR_USERNAME/semantic-search
git push -u origin main
```

Share the GitHub link + deployed app link with Great Question.

---

## Deployment Checklist

- [ ] Backend runs locally
- [ ] Frontend loads and searches work
- [ ] All queries return relevant results
- [ ] Deploy to Render (backend) or Vercel (frontend)
- [ ] Test deployed version
- [ ] Share links with Great Question

---

## Questions to Prepare For

**Q: How would you handle 100K interviews?**
> Use GPU FAISS or Milvus. Same API, better infrastructure.

**Q: What if results aren't good?**
> Add LLM reranking, collect feedback, try different embedding models.

**Q: Can this be real-time?**
> Yes—streaming updates with message queues, incremental indexing.

**Q: How does this relate to agentic AI?**
> It's a tool an agent could call. Agent refines queries, aggregates results.

---

## Success Metrics

By the time you send this to Great Question, you should be able to:

✅ Run the demo locally in under 1 minute
✅ Explain why each tech choice (FAISS, FastAPI, OpenAI)
✅ Discuss 2+ ways to improve it
✅ Deploy it publicly (Render, Streamlit Cloud, etc.)
✅ Answer questions about scaling, quality, real-time updates

---

## Your Edge Over Other Candidates

Most demos:
- "Here's a chatbot I made"
- Talks about calling OpenAI API

Your demo:
- "Here's a production semantic search system"
- Shows you understand RAG, vector databases, evaluation, scaling
- Production code with error handling + docs
- Clear opinions on trade-offs

---

## Time Estimate

- Setup & local test: **10 minutes**
- Deploy: **20 minutes**
- Preparation & talking points: **30 minutes**
- **Total: ~1 hour to full readiness**

---

Good luck! 🚀

This is a genuine, polished demo that shows you can build real AI systems.

Show them what you're capable of.
