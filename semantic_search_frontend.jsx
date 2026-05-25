import React, { useState, useEffect } from 'react';

export default function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [topK, setTopK] = useState(5);
  const [error, setError] = useState('');
  const [fileInput, setFileInput] = useState('');

  const API_BASE = 'https://great-question.onrender.com';

  // Sample interview data for demo
  const SAMPLE_INTERVIEWS = [
    {
      id: 'int-001',
      text: 'I love using your product, but the onboarding process is really confusing. I had to call support three times just to get started. Once I got past that, everything was smooth.',
      source: 'Customer Interview - Sarah M.'
    },
    {
      id: 'int-002',
      text: 'The pricing is a bit steep compared to competitors, but the feature set justifies it. What really frustrates me is the lack of API documentation for custom integrations.',
      source: 'Customer Interview - James P.'
    },
    {
      id: 'int-003',
      text: 'I switched from the competitor because of customer support. Your team responds within hours, and they actually understand my use case. That made all the difference.',
      source: 'Customer Interview - Lisa T.'
    },
    {
      id: 'int-004',
      text: 'The reporting features are fantastic. I can drill down into any metric and understand what\'s happening. It saves me hours every week compared to manual reporting.',
      source: 'Customer Interview - Marcus L.'
    },
    {
      id: 'int-005',
      text: 'Mobile app experience needs work. Most of my team uses it on the go, but the interface is cramped and some features are missing. Desktop version is perfect though.',
      source: 'Customer Interview - Priya K.'
    },
    {
      id: 'int-006',
      text: 'The AI-powered insights are mind-blowing. It automatically flags anomalies I would have missed. This is why we renewed our contract for another year.',
      source: 'Customer Interview - David Z.'
    },
    {
      id: 'int-007',
      text: 'Integration with our existing tools was seamless. Zapier support made everything plug-and-play. We had it running in production within a day.',
      source: 'Customer Interview - Amanda R.'
    },
    {
      id: 'int-008',
      text: 'Performance under load is a concern. When we have 100+ concurrent users, queries slow down significantly. We need better scaling or architecture improvements.',
      source: 'Customer Interview - Robert C.'
    },
    {
      id: 'int-009',
      text: 'The dashboard is beautiful and intuitive. Even non-technical team members can navigate it without training. That\'s rare in enterprise software.',
      source: 'Customer Interview - Jennifer H.'
    },
    {
      id: 'int-010',
      text: 'Data export options are limited. We need CSV, Parquet, and API access to move data to our data warehouse. Right now we\'re blocked on that.',
      source: 'Customer Interview - Alex M.'
    }
  ];

  // Initialize with sample data
  const initializeWithSamples = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(SAMPLE_INTERVIEWS)
      });

      if (!response.ok) throw new Error('Failed to initialize');
      
      setInitialized(true);
      setDocuments(SAMPLE_INTERVIEWS);
    } catch (err) {
      setError(`Initialization failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Perform semantic search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || !initialized) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: topK })
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check backend health
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .catch(() => {
        setError('Backend not running. Start with: python semantic_search_backend.py');
      });
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Semantic Search</h1>
          <p style={styles.subtitle}>Search across interview transcripts using AI-powered semantic understanding</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {!initialized ? (
          // Initialization State
          <div style={styles.initSection}>
            <div style={styles.initCard}>
              <h2 style={styles.sectionTitle}>Get Started</h2>
              <p style={styles.sectionDesc}>
                Load sample interview data to begin semantic searching.
              </p>
              <button
                onClick={initializeWithSamples}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading && styles.buttonDisabled)
                }}
              >
                {loading ? 'Loading...' : 'Load Sample Interviews'}
              </button>
              <p style={styles.hint}>
                10 customer interview transcripts • ~500 tokens total • Uses OpenAI embeddings
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <form onSubmit={handleSearch} style={styles.searchForm}>
              <div style={styles.searchInputGroup}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about customer feedback..."
                  style={styles.searchInput}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  style={{
                    ...styles.searchButton,
                    ...(loading && styles.buttonDisabled)
                  }}
                >
                  {loading ? '...' : '→'}
                </button>
              </div>

              {/* Controls */}
              <div style={styles.controls}>
                <label style={styles.controlLabel}>
                  Results to show:
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={topK}
                    onChange={(e) => setTopK(parseInt(e.target.value))}
                    style={styles.slider}
                  />
                  <span style={styles.sliderValue}>{topK}</span>
                </label>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠</span>
                {error}
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div style={styles.resultsSection}>
                <h2 style={styles.resultsTitle}>
                  Found {results.length} relevant responses
                </h2>
                <div style={styles.resultsList}>
                  {results.map((result, idx) => (
                    <div key={result.id} style={styles.resultCard}>
                      <div style={styles.resultHeader}>
                        <span style={styles.resultNumber}>#{idx + 1}</span>
                        <div style={styles.resultScore}>
                          <span style={styles.scoreLabel}>Match strength</span>
                          <div style={styles.scoreBar}>
                            <div
                              style={{
                                ...styles.scoreBarFill,
                                width: `${(result.relevance_score * 100).toFixed(1)}%`
                              }}
                            />
                          </div>
                          <span style={styles.scoreValue}>
                            {(result.relevance_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <p style={styles.resultText}>{result.text}</p>
                      <p style={styles.resultSource}>{result.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && results.length === 0 && query && (
              <div style={styles.emptyState}>
                <p>No results found. Try rephrasing your question.</p>
              </div>
            )}

            {/* Welcome Message */}
            {!query && (
              <div style={styles.welcomeSection}>
                <h3 style={styles.welcomeTitle}>Try these sample questions:</h3>
                <div style={styles.exampleQueries}>
                  {[
                    'What do customers say about onboarding?',
                    'Which features get the most positive feedback?',
                    'What are the main pain points?',
                    'How do customers feel about customer support?'
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuery(q)}
                      style={styles.exampleButton}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Built with FastAPI + OpenAI embeddings + FAISS vector search
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#1a1a1a'
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '3rem 1rem',
    textAlign: 'center'
  },
  headerContent: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.95,
    margin: 0,
    fontWeight: '400'
  },
  main: {
    maxWidth: '900px',
    margin: '-3rem auto 0',
    padding: '0 1rem 2rem',
    position: 'relative',
    zIndex: 10
  },
  initSection: {
    display: 'flex',
    justifyContent: 'center'
  },
  initCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.1)',
    textAlign: 'center',
    maxWidth: '450px',
    width: '100%'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: '600',
    margin: '0 0 1rem',
    color: '#667eea'
  },
  sectionDesc: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 1.5rem',
    lineHeight: 1.6
  },
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    marginBottom: '1rem'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  hint: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0,
    marginTop: '1rem'
  },
  searchForm: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  searchInputGroup: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  searchInput: {
    flex: 1,
    padding: '0.875rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  searchButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.875rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    minWidth: '50px'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  controlLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.95rem',
    color: '#666'
  },
  slider: {
    width: '120px',
    cursor: 'pointer'
  },
  sliderValue: {
    background: '#f0f0f0',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center'
  },
  errorBox: {
    background: '#fee',
    border: '1px solid #fcc',
    color: '#c33',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    display: 'flex',
    gap: '0.5rem'
  },
  errorIcon: {
    fontSize: '1.2rem'
  },
  resultsSection: {
    marginBottom: '2rem'
  },
  resultsTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: '0 0 1.5rem',
    color: '#1a1a1a'
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  resultCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '1.25rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
    gap: '1rem'
  },
  resultNumber: {
    background: '#f0f0f0',
    color: '#667eea',
    fontWeight: '700',
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },
  resultScore: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  scoreLabel: {
    fontSize: '0.8rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  scoreBar: {
    height: '6px',
    background: '#f0f0f0',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  scoreBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s'
  },
  scoreValue: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#667eea'
  },
  resultText: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#1a1a1a',
    margin: '0.75rem 0',
    fontStyle: 'italic'
  },
  resultSource: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0
  },
  emptyState: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    color: '#999',
    marginBottom: '2rem'
  },
  welcomeSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  welcomeTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: '0 0 1rem',
    color: '#1a1a1a'
  },
  exampleQueries: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem'
  },
  exampleButton: {
    padding: '0.75rem 1rem',
    background: '#f5f7fa',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    textAlign: 'left',
    color: '#667eea',
    fontWeight: '500'
  },
  footer: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#999',
    fontSize: '0.85rem'
  },
  footerText: {
    margin: 0
  }
};
