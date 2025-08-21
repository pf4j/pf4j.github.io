// Jekyll Search - optimized for jekyll-docs-template
// To be placed in _includes/search.js

(function() {
    'use strict';

    class JekyllSearch {
        constructor() {
            this.searchData = null;
            this.isLoaded = false;
            this.cache = new Map();
            this.searchInput = null;
            this.searchResults = null;
            this.searchClear = null;
            this.searchTimeout = null;
            this.selectedIndex = -1;
            
            // Configuration constants
            this.CACHE_LIMIT = 20;
            this.DEBOUNCE_DELAY = 200;
            this.SCORES = {
                TITLE_EXACT: 2000,
                CONTENT_EXACT: 1000,
                EXCERPT_EXACT: 500,
                TITLE_STARTS: 400,
                TITLE_CONTAINS: 200,
                CONTENT_FREQUENCY: 20,
                EXCERPT_CONTAINS: 100
            };
        }

        async initialize() {
            console.log('Search initializing...');
            
            // Initialize DOM elements
            this.searchInput = document.getElementById('search-input');
            this.searchResults = document.getElementById('search-results');
            this.searchClear = document.getElementById('search-clear');
            
            if (!this.searchInput || !this.searchResults) {
                console.warn('Search elements not found');
                return;
            }

            // Load search data
            await this.loadSearchData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            console.log('Search initialized with', this.searchData?.length || 0, 'items');
        }

        async loadSearchData() {
            try {
                // Load search-data.json
                const response = await fetch('{{ "/search-data.json" | relative_url }}');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                this.searchData = data.items || data;
                this.isLoaded = true;
                console.log('Loaded search data from JSON with', this.searchData.length, 'items');
            } catch (error) {
                console.error('Failed to load search data:', error);
                this.searchData = [];
                this.isLoaded = false;
            }
        }

        setupEventListeners() {
            // Search input
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });

            this.searchInput.addEventListener('focus', () => {
                if (this.searchInput.value.trim().length >= 2) {
                    this.showResults();
                }
            });

            // Clear button
            if (this.searchClear) {
                this.searchClear.addEventListener('click', () => {
                    this.clearSearch();
                });
            }

            // Keyboard navigation
            this.searchInput.addEventListener('keydown', (e) => {
                this.handleKeyNavigation(e);
            });

            // Click outside to close
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    this.hideResults();
                }
            });
        }

        handleSearchInput(query) {
            clearTimeout(this.searchTimeout);
            
            // Show/hide clear button
            if (this.searchClear) {
                this.searchClear.style.display = query.length > 0 ? 'inline-block' : 'none';
            }

            if (query.trim().length < 2) {
                this.hideResults();
                return;
            }

            // Debounce search
            this.searchTimeout = setTimeout(() => {
                this.performSearch(query.trim());
            }, this.DEBOUNCE_DELAY);
        }

        performSearch(query) {
            if (!this.isLoaded || !this.searchData) {
                console.warn('Search not ready');
                return;
            }

            // Better cache key handling
            const cacheKey = query.toLowerCase().trim();
            if (this.cache.has(cacheKey)) {
                this.displayResults(this.cache.get(cacheKey), query);
                return;
            }

            // Perform fresh search
            const results = this.search(query);
            
            // DEBUG: Uncomment for detailed scoring analysis
            /*
            console.log('Fresh search results for:', query);
            const allResults = this.searchData
                .map(item => {
                    const score = this.calculateScore(item, query.toLowerCase(), query.toLowerCase().match(/\b\w+\b/g) || []);
                    return { title: item.title, score, url: item.url };
                })
                .sort((a, b) => b.score - a.score);
            
            allResults.forEach((result, index) => {
                if (result.score > 0) {
                    console.log(`${index + 1}. "${result.title}" - Score: ${result.score} - ${result.url}`);
                }
            });
            */
            
            // Cache results with better key
            this.cache.set(cacheKey, results);
            
            // Limit cache size
            if (this.cache.size > this.CACHE_LIMIT) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }

            this.displayResults(results, query);
        }

        search(query) {
            const queryLower = query.toLowerCase();
            const words = queryLower.match(/\b\w+\b/g) || [];
            
            return this.searchData
                .map(item => {
                    const score = this.calculateScore(item, queryLower, words);
                    return { ...item, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score);
                // REMOVED: .slice(0, 12) - now shows ALL results
        }

        calculateScore(item, query, words) {
            const title = (item.title || '').toLowerCase();
            const content = (item.content || '').toLowerCase();
            const excerpt = (item.excerpt || '').toLowerCase();
            
            let score = 0;

            // Exact phrase matches (highest priority)
            if (title.includes(query)) score += this.SCORES.TITLE_EXACT;
            if (content.includes(query)) score += this.SCORES.CONTENT_EXACT;
            if (excerpt.includes(query)) score += this.SCORES.EXCERPT_EXACT;

            // Individual word matches - cache regex for better performance
            words.forEach(word => {
                // Title matches
                if (title.includes(word)) {
                    if (title.startsWith(word)) {
                        score += this.SCORES.TITLE_STARTS;
                    } else {
                        score += this.SCORES.TITLE_CONTAINS;
                    }
                }
                
                // Content frequency matches - use cached regex
                const wordRegex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi');
                const contentMatches = (content.match(wordRegex) || []).length;
                score += contentMatches * this.SCORES.CONTENT_FREQUENCY;
                
                // Excerpt matches
                if (excerpt.includes(word)) {
                    score += this.SCORES.EXCERPT_CONTAINS;
                }
            });

            return score;
        }

        displayResults(results, query) {
            this.selectedIndex = -1;

            if (results.length === 0) {
                this.searchResults.innerHTML = `
                    <div class="search-no-results">
                        No results found for "${this.escapeHtml(query)}"
                    </div>
                `;
            } else {
                const html = results.map((result, index) => {
                    return `
                        <div class="search-result" data-index="${index}">
                            <a href="${result.url}">
                                <div class="result-title">${this.highlightMatches(result.title, query)}</div>
                                <div class="result-category">${result.category || 'Documentation'}</div>
                                <div class="result-preview">${this.highlightMatches(this.createPreview(result.content || result.excerpt, query), query)}</div>
                            </a>
                        </div>
                    `;
                }).join('');
                
                this.searchResults.innerHTML = html;
            }

            this.showResults();
        }

        createPreview(content, query) {
            if (!content) return '';
            
            const queryPos = content.toLowerCase().indexOf(query.toLowerCase());
            if (queryPos !== -1) {
                const start = Math.max(0, queryPos - 40);
                const end = Math.min(content.length, queryPos + query.length + 60);
                let preview = content.substring(start, end);
                
                if (start > 0) preview = '...' + preview;
                if (end < content.length) preview = preview + '...';
                
                return preview;
            }
            
            return content.substring(0, 100) + (content.length > 100 ? '...' : '');
        }

        highlightMatches(text, query) {
            if (!text || !query) return text;
            
            const words = query.match(/\b\w+\b/g) || [];
            let result = this.escapeHtml(text);
            
            words.forEach(word => {
                const regex = new RegExp(`\\b(${this.escapeRegex(word)})\\b`, 'gi');
                result = result.replace(regex, '<strong>$1</strong>');
            });
            
            return result;
        }

        handleKeyNavigation(e) {
            const results = this.searchResults.querySelectorAll('.search-result');
            
            switch(e.keyCode) {
                case 40: // Down arrow
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
                    this.updateSelection(results);
                    break;
                    
                case 38: // Up arrow
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                    this.updateSelection(results);
                    break;
                    
                case 13: // Enter
                    e.preventDefault();
                    if (this.selectedIndex >= 0 && this.selectedIndex < results.length) {
                        const link = results[this.selectedIndex].querySelector('a');
                        if (link) window.location.href = link.href;
                    }
                    break;
                    
                case 27: // Escape
                    this.hideResults();
                    this.searchInput.blur();
                    break;
            }
        }

        updateSelection(results) {
            results.forEach((result, index) => {
                result.classList.toggle('selected', index === this.selectedIndex);
            });
        }

        showResults() {
            this.searchResults.style.display = 'block';
        }

        hideResults() {
            this.searchResults.style.display = 'none';
            this.selectedIndex = -1;
        }

        clearSearch() {
            this.searchInput.value = '';
            this.hideResults();
            if (this.searchClear) {
                this.searchClear.style.display = 'none';
            }
            this.searchInput.focus();
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSearch);
    } else {
        initializeSearch();
    }

    function initializeSearch() {
        // Only initialize if search elements exist
        if (document.getElementById('search-input')) {
            const search = new JekyllSearch();
            search.initialize().catch(error => {
                console.error('Search initialization failed:', error);
            });
            
            // Make search available globally for debugging
            window.jekyllSearch = search;
        }
    }

})();
