#!/bin/bash

# Semantic Search Demo - Quick Start Script
# Usage: bash setup.sh

set -e

echo "🚀 Semantic Search Demo - Setup"
echo "================================"

# Check Python version
echo "✓ Checking Python installation..."
python3 --version

# Create virtual environment
echo "✓ Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "✓ Installing dependencies..."
pip install -q -r requirements.txt

# Check for .env file
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found"
    echo "Create .env with your OpenAI API key:"
    echo ""
    echo "  OPENAI_API_KEY=sk-..."
    echo ""
    read -p "Enter your OpenAI API key: " api_key
    echo "OPENAI_API_KEY=$api_key" > .env
    echo "✓ .env created"
fi

echo ""
echo "================================"
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend (Terminal 1):"
echo "   source venv/bin/activate"
echo "   python semantic_search_backend.py"
echo ""
echo "2. Start the frontend (Terminal 2):"
echo "   source venv/bin/activate"
echo "   streamlit run streamlit_app.py"
echo ""
echo "3. Open in browser:"
echo "   http://localhost:8501"
echo ""
