document.addEventListener('DOMContentLoaded', function () {
    // Select all event boxes
    const allBoxes = document.querySelectorAll('.box');
    
    // Get filter containers
    const categoryContainer = document.getElementById('categoryContainer');
    const keywordContainer = document.getElementById('keywordContainer');
    const cityContainer = document.getElementById('cityContainer');
    const monthContainer = document.getElementById('monthContainer');
    const resultCountElement = document.getElementById('resultCount');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // Sets to track selected filters
    let selectedCategories = new Set();
    let selectedKeywords = new Set();
    let selectedCities = new Set();
    let selectedMonths = new Set();

    // Initialize filters
    initializeFilters();
    updateResultCount(allBoxes.length); // Initialize with all boxes visible

    function initializeFilters() {
        // Extract unique categories
        const categories = new Set();
        const cities = new Set();
        const months = new Set();
        const keywordFrequency = {};

        // Loop through each box to extract filter data
        allBoxes.forEach(box => {
            // Get category
            const category = box.querySelector('.event_category').textContent;
            categories.add(category);
            
            // Get city
            const locationText = box.querySelector('.event_location').textContent;
            const city = locationText.split(',')[0].trim();
            cities.add(city);
            
            // Get month
            const monthText = box.querySelector('.event_month').textContent;
            const month = monthText.replace('Usually in ', '').trim();
            months.add(month);
            
            // Get keywords
            const keywordElements = box.querySelectorAll('.event_keywords keyword');
            keywordElements.forEach(el => {
                const keyword = el.textContent;
                if (keywordFrequency[keyword]) {
                    keywordFrequency[keyword]++;
                } else {
                    keywordFrequency[keyword] = 1;
                }
            });
        });

        // Add category selectors
        addSelectors(Array.from(categories).sort(), categoryContainer, selectedCategories);

        // Add keyword selectors sorted by frequency
        const sortedKeywords = Object.keys(keywordFrequency).sort((a, b) => keywordFrequency[b] - keywordFrequency[a]);
        addSelectors(sortedKeywords, keywordContainer, selectedKeywords);

        // Add city selectors
        addSelectors(Array.from(cities).sort(), cityContainer, selectedCities);

        // Add month selectors in calendar order
        const monthOrder = ["January", "February", "March", "April", "May", "June", 
                           "July", "August", "September", "October", "November", "December"];
        const sortedMonths = monthOrder.filter(month => months.has(month));
        addSelectors(sortedMonths, monthContainer, selectedMonths);
    }

    function addSelectors(items, container, selectedSet) {
        container.innerHTML = '';
        items.forEach(item => {
            const element = document.createElement('span');
            element.className = 'selectorItem';
            element.textContent = item;
            element.addEventListener('click', () => {
                if (selectedSet.has(item)) {
                    selectedSet.delete(item);
                    element.classList.remove('selected');
                } else {
                    selectedSet.add(item);
                    element.classList.add('selected');
                }
                filterEvents();
            });
            container.appendChild(element);
        });
    }

    function filterEvents() {
        let visibleCount = 0;
        
        allBoxes.forEach(box => {
            // Get values for this box
            const category = box.querySelector('.event_category').textContent;
            
            const locationText = box.querySelector('.event_location').textContent;
            const city = locationText.split(',')[0].trim();
            
            const monthText = box.querySelector('.event_month').textContent;
            const month = monthText.replace('Usually in ', '').trim();
            
            const keywordElements = box.querySelectorAll('.event_keywords keyword');
            const keywords = Array.from(keywordElements).map(el => el.textContent);
            
            // Check if this box matches all selected filters
            const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(category);
            const keywordMatch = selectedKeywords.size === 0 || keywords.some(keyword => selectedKeywords.has(keyword));
            const cityMatch = selectedCities.size === 0 || selectedCities.has(city);
            const monthMatch = selectedMonths.size === 0 || selectedMonths.has(month);
            
            const isVisible = categoryMatch && keywordMatch && cityMatch && monthMatch;
            
            // Update visibility
            box.style.display = isVisible ? 'block' : 'none';
            
            if (isVisible) {
                visibleCount++;
            }
        });
        
        updateResultCount(visibleCount);
    }

    function updateResultCount(count) {
        resultCountElement.textContent = `Results: ${count}`;
        if (count === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
});