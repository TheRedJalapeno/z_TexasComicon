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
    updateFilterAvailability(); // Initial check for filter availability

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
                // Only toggle if not zero results
                if (!element.classList.contains('zeroResults')) {
                    if (selectedSet.has(item)) {
                        selectedSet.delete(item);
                        element.classList.remove('selected');
                    } else {
                        selectedSet.add(item);
                        element.classList.add('selected');
                    }
                    filterEvents();
                }
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
        updateFilterAvailability(); // Update filter availability after filtering
    }

    function updateResultCount(count) {
        resultCountElement.textContent = `Results: ${count}`;
        if (count === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }

    // New function to update filter availability
    function updateFilterAvailability() {
        updateCategoryAvailability();
        updateKeywordAvailability();
        updateCityAvailability();
        updateMonthAvailability();
    }

    // Helper functions to check each filter type
    function updateCategoryAvailability() {
        const categoryItems = categoryContainer.querySelectorAll('.selectorItem');
        categoryItems.forEach(item => {
            if (!item.classList.contains('selected')) {
                const category = item.textContent;
                const wouldHaveResults = checkFilterResults('category', category);
                
                if (!wouldHaveResults) {
                    item.classList.add('zeroResults');
                } else {
                    item.classList.remove('zeroResults');
                }
            }
        });
    }

    function updateKeywordAvailability() {
        const keywordItems = keywordContainer.querySelectorAll('.selectorItem');
        keywordItems.forEach(item => {
            if (!item.classList.contains('selected')) {
                const keyword = item.textContent;
                const wouldHaveResults = checkFilterResults('keyword', keyword);
                
                if (!wouldHaveResults) {
                    item.classList.add('zeroResults');
                } else {
                    item.classList.remove('zeroResults');
                }
            }
        });
    }

    function updateCityAvailability() {
        const cityItems = cityContainer.querySelectorAll('.selectorItem');
        cityItems.forEach(item => {
            if (!item.classList.contains('selected')) {
                const city = item.textContent;
                const wouldHaveResults = checkFilterResults('city', city);
                
                if (!wouldHaveResults) {
                    item.classList.add('zeroResults');
                } else {
                    item.classList.remove('zeroResults');
                }
            }
        });
    }

    function updateMonthAvailability() {
        const monthItems = monthContainer.querySelectorAll('.selectorItem');
        monthItems.forEach(item => {
            if (!item.classList.contains('selected')) {
                const month = item.textContent;
                const wouldHaveResults = checkFilterResults('month', month);
                
                if (!wouldHaveResults) {
                    item.classList.add('zeroResults');
                } else {
                    item.classList.remove('zeroResults');
                }
            }
        });
    }

    // Check if selecting this filter would result in any matches
    function checkFilterResults(filterType, filterValue) {
        let hasResults = false;
        
        allBoxes.forEach(box => {
            // Get values for this box
            const category = box.querySelector('.event_category').textContent;
            const locationText = box.querySelector('.event_location').textContent;
            const city = locationText.split(',')[0].trim();
            const monthText = box.querySelector('.event_month').textContent;
            const month = monthText.replace('Usually in ', '').trim();
            const keywordElements = box.querySelectorAll('.event_keywords keyword');
            const keywords = Array.from(keywordElements).map(el => el.textContent);
            
            // Check if currently displayed based on current filters
            const currentCategoryMatch = selectedCategories.size === 0 || selectedCategories.has(category);
            const currentKeywordMatch = selectedKeywords.size === 0 || keywords.some(keyword => selectedKeywords.has(keyword));
            const currentCityMatch = selectedCities.size === 0 || selectedCities.has(city);
            const currentMonthMatch = selectedMonths.size === 0 || selectedMonths.has(month);
            
            // Skip if the box is not currently visible based on other filters
            if (!currentCategoryMatch || !currentKeywordMatch || !currentCityMatch || !currentMonthMatch) {
                return;
            }
            
            // Check if this box would be visible if we added the new filter
            let newFilterMatch = false;
            
            switch (filterType) {
                case 'category':
                    newFilterMatch = category === filterValue;
                    break;
                case 'keyword':
                    newFilterMatch = keywords.includes(filterValue);
                    break;
                case 'city':
                    newFilterMatch = city === filterValue;
                    break;
                case 'month':
                    newFilterMatch = month === filterValue;
                    break;
            }
            
            if (newFilterMatch) {
                hasResults = true;
            }
        });
        
        return hasResults;
    }
});