document.addEventListener('DOMContentLoaded', function () {
    let dataStore = [];

    fetch('lookups.json')
        .then(response => response.json())
        .then(data => {
            dataStore = data;
            populateFilters(data);
            populateEvents(data);
            updateResultCount(data.length);  // Initialize the result count with the total number of results
        })
        .catch(error => console.error('Error fetching the JSON data:', error));

    const categoryContainer = document.getElementById('categoryContainer');
    const keywordContainer = document.getElementById('keywordContainer');
    const cityContainer = document.getElementById('cityContainer');
    const monthContainer = document.getElementById('monthContainer');
    const contentContainer = document.getElementById('content');
    const resultCountElement = document.getElementById('resultCount');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let selectedCategories = new Set();
    let selectedKeywords = new Set();
    let selectedCities = new Set();
    let selectedMonths = new Set();

    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function populateFilters(data) {
        const categories = new Set();
        const keywordFrequency = {};
        const cities = new Set();
        const months = new Set();

        data.forEach(item => {
            categories.add(item.category);
            item.keywords.forEach(keyword => {
                if (keywordFrequency[keyword]) {
                    keywordFrequency[keyword]++;
                } else {
                    keywordFrequency[keyword] = 1;
                }
            });
            cities.add(item.city);
            months.add(item.month);
        });

        addSelectors(Array.from(categories).sort(), categoryContainer, selectedCategories);

        const sortedKeywords = Object.keys(keywordFrequency).sort((a, b) => keywordFrequency[b] - keywordFrequency[a]);
        addSelectors(sortedKeywords, keywordContainer, selectedKeywords);

        addSelectors(Array.from(cities).sort(), cityContainer, selectedCities);

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
        const filteredData = dataStore.filter(item => {
            const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(item.category);
            const keywordMatch = selectedKeywords.size === 0 || item.keywords.some(keyword => selectedKeywords.has(keyword));
            const cityMatch = selectedCities.size === 0 || selectedCities.has(item.city);
            const monthMatch = selectedMonths.size === 0 || selectedMonths.has(item.month);
            return categoryMatch && keywordMatch && cityMatch && monthMatch;
        });
        populateEvents(filteredData);
        updateResultCount(filteredData.length);
    }

    function populateEvents(data) {
        contentContainer.innerHTML = '';
        data.forEach(item => {
            const box = document.createElement('div');
            box.className = 'box';

            box.innerHTML = `
                <em>${item.category}</em>
                <h2>${item.name}</h2>
                <h3>${item.city}, ${item.zip_code}</h3>
                <p>${item.description}</p>
                <span>${item.keywords.map(keyword => `<keyword>${keyword}</keyword>`).join(' ')}</span>
                <span>
                    <h3>Socials</h3>
                    <social>
                        <a href="${item.social_media.instagram}" target="_blank">Instagram</a>
                        <a href="${item.social_media.threads}" target="_blank">Threads</a>
                        <a href="${item.social_media.facebook}" target="_blank">Facebook</a>
                        <a href="${item.social_media.twitter}" target="_blank">Twitter</a>
                        <a href="${item.website}" target="_blank">Website</a>
                    </social>
                </span>
            `;

            contentContainer.appendChild(box);
        });
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
