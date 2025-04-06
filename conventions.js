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

            // Make sure social_media exists to avoid errors
            const socialMedia = item.social_media || {};
            
            const socialLinks = [
                { url: socialMedia.instagram, name: 'Instagram' },
                { url: socialMedia.threads, name: 'Threads' },
                { url: socialMedia.facebook, name: 'Facebook' },
                { url: socialMedia.twitter, name: 'Twitter' },
                { url: socialMedia.reddit, name: 'Reddit' },
                { url: socialMedia.tiktok, name: 'Tiktok' },
                { url: socialMedia.youtube, name: 'YouTube' },
                { url: item.website, name: 'Website' }
            ].filter(link => link.url && typeof link.url === 'string' && link.url.trim() !== '')
            .map(link => 
                `<a href="${addUTMParams(link.url, link.name.toLowerCase())}" target="_blank">${link.name}</a>`
            ).join('<br>');

            box.innerHTML = `
                <em class="event_category">${item.category}</em>
                <h2 class="event_name">${item.name}</h2>
                <h3 class="event_location">${item.city}, TX ${item.zip_code || ''}</h3>
                <p class="event_month">Usually in ${item.month}</p>
                <p class="event_desc">${item.description || ''}</p>
                <span class="event_keywords">${(item.keywords || []).map(keyword => `<keyword>${keyword}</keyword>`).join(' ')}</span>
                <span class="event_socials">
                    <h3>Socials</h3>
                    <social class="flexContainer">
                        ${socialLinks}
                    </social>
                </span>
            `;
            // Add the data-uid attribute to the box
            box.dataset.uid = item.uid;

            contentContainer.appendChild(box);
        });
    }

    function addUTMParams(url, content) {
        // Safety check to ensure url is valid
        if (!url || typeof url !== 'string') {
            return '#'; // Return a safe default
        }

        try {
            const utmSource = 'texascomicon';
            const utmMedium = 'website';
            const utmCampaign = 'comicon_event';
            const utmContent = content;

            const params = new URLSearchParams({
                utm_source: utmSource,
                utm_medium: utmMedium,
                utm_campaign: utmCampaign,
                utm_content: utmContent
            });

            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}${params.toString()}`;
        } catch (error) {
            console.error('Error adding UTM parameters:', error);
            return url; // Return original URL if there's an error
        }
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