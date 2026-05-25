"""
Streamlit Frontend for Semantic Search
Lightweight alternative to React - perfect for quick demos and prototyping
Run with: streamlit run streamlit_app.py
"""

import streamlit as st
import requests
import json
from typing import Optional

st.set_page_config(
    page_title="Semantic Search",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS
st.markdown("""
    <style>
        .main {
            max-width: 900px;
            margin: 0 auto;
        }
        .metric-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 10px 0;
        }
        .result-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .relevance-score {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: bold;
            color: #667eea;
        }
    </style>
""", unsafe_allow_html=True)

# Initialize session state
if 'initialized' not in st.session_state:
    st.session_state.initialized = False
if 'documents' not in st.session_state:
    st.session_state.documents = []

API_BASE = "http://localhost:8000"

# Sample interview data
SAMPLE_INTERVIEWS = [
    {
        "id": "int-001",
        "text": "I love using your product, but the onboarding process is really confusing. I had to call support three times just to get started. Once I got past that, everything was smooth.",
        "source": "Customer Interview - Sarah M."
    },
    {
        "id": "int-002",
        "text": "The pricing is a bit steep compared to competitors, but the feature set justifies it. What really frustrates me is the lack of API documentation for custom integrations.",
        "source": "Customer Interview - James P."
    },
    {
        "id": "int-003",
        "text": "I switched from the competitor because of customer support. Your team responds within hours, and they actually understand my use case. That made all the difference.",
        "source": "Customer Interview - Lisa T."
    },
    {
        "id": "int-004",
        "text": "The reporting features are fantastic. I can drill down into any metric and understand what's happening. It saves me hours every week compared to manual reporting.",
        "source": "Customer Interview - Marcus L."
    },
    {
        "id": "int-005",
        "text": "Mobile app experience needs work. Most of my team uses it on the go, but the interface is cramped and some features are missing. Desktop version is perfect though.",
        "source": "Customer Interview - Priya K."
    },
    {
        "id": "int-006",
        "text": "The AI-powered insights are mind-blowing. It automatically flags anomalies I would have missed. This is why we renewed our contract for another year.",
        "source": "Customer Interview - David Z."
    },
    {
        "id": "int-007",
        "text": "Integration with our existing tools was seamless. Zapier support made everything plug-and-play. We had it running in production within a day.",
        "source": "Customer Interview - Amanda R."
    },
    {
        "id": "int-008",
        "text": "Performance under load is a concern. When we have 100+ concurrent users, queries slow down significantly. We need better scaling or architecture improvements.",
        "source": "Customer Interview - Robert C."
    },
    {
        "id": "int-009",
        "text": "The dashboard is beautiful and intuitive. Even non-technical team members can navigate it without training. That's rare in enterprise software.",
        "source": "Customer Interview - Jennifer H."
    },
    {
        "id": "int-010",
        "text": "Data export options are limited. We need CSV, Parquet, and API access to move data to our data warehouse. Right now we're blocked on that.",
        "source": "Customer Interview - Alex M."
    }
]

def initialize_index():
    """Initialize FAISS index with sample documents"""
    try:
        response = requests.post(
            f"{API_BASE}/initialize",
            json=SAMPLE_INTERVIEWS,
            timeout=30
        )
        if response.status_code == 200:
            st.session_state.initialized = True
            st.session_state.documents = SAMPLE_INTERVIEWS
            return True, "Index initialized successfully!"
        else:
            return False, f"Error: {response.text}"
    except requests.exceptions.ConnectionError:
        return False, "❌ Backend not running. Start it with: python semantic_search_backend.py"
    except Exception as e:
        return False, f"Error: {str(e)}"

def search_semantically(query: str, top_k: int = 5):
    """Perform semantic search"""
    try:
        response = requests.post(
            f"{API_BASE}/search",
            json={"query": query, "top_k": top_k},
            timeout=30
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Search failed: {response.text}"}
    except requests.exceptions.ConnectionError:
        return {"error": "❌ Backend not running"}
    except Exception as e:
        return {"error": f"Error: {str(e)}"}

# Header
st.markdown("""
    <div style="text-align: center; padding: 2rem 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; margin: -2rem -2rem 2rem; padding: 2rem 1rem;">
        <h1 style="margin: 0; font-size: 2.5rem;">🔍 Semantic Search</h1>
        <p style="margin: 0.5rem 0 0; opacity: 0.95;">Search across interview transcripts using AI-powered semantic understanding</p>
    </div>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.title("Settings")
    top_k = st.slider("Results to show", min_value=1, max_value=10, value=5)
    
    st.divider()
    
    if st.button("🔄 Reload Backend Status", use_container_width=True):
        st.rerun()

# Main content
if not st.session_state.initialized:
    # Initialization section
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("### Get Started")
        st.markdown("Load sample interview data to begin semantic searching.")
        
        if st.button("📚 Load Sample Interviews", use_container_width=True, type="primary"):
            with st.spinner("Initializing index..."):
                success, message = initialize_index()
                if success:
                    st.success(message)
                    st.rerun()
                else:
                    st.error(message)
        
        st.caption("10 customer interview transcripts • ~500 tokens total • Uses OpenAI embeddings")

else:
    # Search interface
    st.markdown("### 🎯 Search Interviews")
    
    col1, col2 = st.columns([4, 1])
    with col1:
        query = st.text_input(
            "Ask a question about customer feedback...",
            placeholder="What do customers say about onboarding?",
            label_visibility="collapsed"
        )
    with col2:
        search_button = st.button("Search", use_container_width=True, type="primary")
    
    # Example queries
    if not query:
        st.markdown("#### Try these sample questions:")
        col1, col2 = st.columns(2)
        
        example_queries = [
            "What do customers say about onboarding?",
            "Which features get the most positive feedback?",
            "What are the main pain points?",
            "How do customers feel about customer support?"
        ]
        
        for i, q in enumerate(example_queries):
            col = col1 if i % 2 == 0 else col2
            with col:
                if st.button(q, use_container_width=True):
                    query = q
                    search_button = True
    
    # Perform search
    if search_button and query:
        with st.spinner("Searching..."):
            results = search_semantically(query, top_k)
        
        if "error" in results:
            st.error(results["error"])
        else:
            # Display results
            st.markdown(f"### Results for: *\"{query}\"*")
            st.markdown(f"Found **{results['total_results']}** relevant responses")
            
            for idx, result in enumerate(results['results'], 1):
                with st.container(border=True):
                    col1, col2, col3 = st.columns([1, 3, 1])
                    
                    with col1:
                        st.markdown(f"**#{idx}**")
                    
                    with col2:
                        st.markdown(f"*{result['text']}*")
                    
                    with col3:
                        score_pct = result['relevance_score'] * 100
                        st.metric(
                            "Match",
                            f"{score_pct:.1f}%",
                            delta=None,
                            delta_color="off",
                            label_visibility="collapsed"
                        )
                    
                    st.caption(result['source'])
    
    # Footer
    st.divider()
    st.markdown("""
        <p style="text-align: center; color: #999; font-size: 0.85rem; margin-top: 2rem;">
            Built with FastAPI + OpenAI embeddings + FAISS vector search
        </p>
    """, unsafe_allow_html=True)
