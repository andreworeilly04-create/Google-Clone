const input = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');

function searchResults(){
    const query = document.getElementById('search-input').value.trim();

    if (query.trim() !== ""){
        saveRecentSearch(query)
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
     } else{
        alert("Please Enter Something to Search");
        }
    }
    
    function saveRecentSearch(query){
        let searches = JSON.parse(localStorage.getItem('recentSearches')) || []

        searches = searches.filter(item => item !== query);

        searches.unshift(query)

        if (searches.length > 5) 
            searches.pop()
        localStorage.setItem('recentSearches', JSON.stringify(searches))
    }


input.addEventListener('focus', () => {
    const query = input.value;
    if (query.length === 0){
        showRecentSearches();
    }
})

function showRecentSearches(){
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    if (searches.length > 0){
        const html = searches.map((item, index) => { const safeItem = item.replace(/'/g, "\\'"); return `<li class="recent-item" onclick="selectSuggestion('${safeItem}')"> <div class="recent-content"> <span> ${item} </span> </div> <span class="remove-btn" onclick="removeRecentSearch(event, ${index})">X</span> </li>
        `}).join('')

        suggestionsList.innerHTML = `<li class="recent-header">Recent Searches</li>` + html
        suggestionsList.style.display = 'block';
        suggestionsList.style.border = "1px solid #dfe1e5";
        suggestionsList.style.borderTop = "none";
    }
}


const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keypress', function (e){
    if (e.key === "Enter") {
        searchResults();
    }
})


function feelingLucky(){
    const query = document.getElementById('search-input').value;
    if (query.trim() !== ""){
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
    }
}




input.addEventListener('input', () => {
    const query = input.value;
    if (query.length > 0){
         const script = document.createElement('script');
         script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${query}&callback=handleGoogleData`;

         document.body.appendChild(script);

         script.onload = () => 
            document.body.removeChild(script);
    } else {
        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none";

        suggestionsList.style.border = "none";
        showRecentSearches();
    }
});

window.handleGoogleData = function(data)
{
    const suggestions = data[1];
    displaySuggestions(suggestions)
}

function selectSuggestion(value){
        document.getElementById('search-input');
        input.value = value;

        const suggestionsList = document.getElementById('suggestions-list');
    
        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none";
        searchResults();
    }


function displaySuggestions(list){
    const html = list.map(item => `<li onclick="selectSuggestion('${item.replace(/'/g, "\\'")}')">${item}</li>`).join('');
    suggestionsList.innerHTML = html;

    suggestionsList.style.display = "block";

    suggestionsList.style.border = "1px solid #dfe1e5";

    suggestionsList.style.borderTop = "none";
}
    

function removeRecentSearch(event, index)
{
    event.stopPropagation();

    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    searches.splice(index, 1);

    localStorage.setItem('recentSearches', JSON.stringify(searches));

    showRecentSearches();

    if (searches.length === 0){
        suggestionsList.style.display = "none";
    }
}