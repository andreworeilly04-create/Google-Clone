const input = document.getElementById('search-input') as HTMLInputElement;
const suggestionsList = document.getElementById('suggestions-list') as HTMLInputElement;

function searchResults(): void {
    const query = input?.value.trim();

    if (query && query !== ""){
        saveRecentSearch(query)
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
     } else{
        alert("Please Enter Something to Search");
        }
    }
    
    function saveRecentSearch(query: string): void {
        const storedSearches = localStorage.getItem('recentSearches');

       let searches: string[] = storedSearches ? JSON.parse(storedSearches) : [];

        searches = searches.filter((item: string) => item !== query);

        searches.unshift(query);

        if (searches.length > 5) {
            searches.pop()
        }
        localStorage.setItem('recentSearches', JSON.stringify(searches))
    }


input?.addEventListener('focus', () => {
    const query = input.value;
    if (query.length === 0){
        showRecentSearches();
    }
})

function showRecentSearches(): void {
    const storedSearches = localStorage.getItem('recentSearches');
    let searches: string [] = storedSearches ? JSON.parse(storedSearches) : []

    if (searches.length > 0 && suggestionsList){
        const html = searches.map((item: string, index: number) => { const safeItem = item.replace(/'/g, "\\'"); return `<li class="recent-item" onclick="selectSuggestion('${safeItem}')"> <div class="recent-content"> <span> ${item} </span> </div> <span class="remove-btn" onclick="removeRecentSearch(event, ${index})">X</span> </li>
        `}).join('')

        suggestionsList.innerHTML = `<li class="recent-header">Recent Searches</li>` + html
        suggestionsList.style.display = 'block';
        suggestionsList.style.border = "1px solid #dfe1e5";
        suggestionsList.style.borderTop = "none";
    }
}


const searchInput = document.getElementById('search-input') as HTMLInputElement;

searchInput?.addEventListener('keypress', function (e: KeyboardEvent){
    if (e.key === "Enter") {
        searchResults();
        
    }
})


function feelingLucky(): void {
    const query = searchInput?.value.trim();
  
    if (query && query !== ""){
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
    }
}




searchInput?.addEventListener('input', () => {
    const query = searchInput.value;

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

(window as any).handleGoogleData = function(data: any[]): void {

    const suggestions = data[1];
    displaySuggestions(suggestions)
}

function selectSuggestion(value:string): void{
       const input = document.getElementById('search-input') as HTMLInputElement;

       if (input){
        input.value = value;

       }


        const suggestionsList = document.getElementById('suggestions-list') as HTMLElement;
        if (suggestionsList){
    
        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none";
        }
        searchResults();
    }


function displaySuggestions(list: string[]): void {
    const html = list.map((item: string) => { return `<li onclick="selectSuggestion('${item.replace(/'/g, "\\'")}')">${item}</li>`}).join('');

    const suggestionsList = document.getElementById('suggestions-list') as HTMLElement;
    if (suggestionsList){
    suggestionsList.innerHTML = html;

    suggestionsList.style.display = "block";

    suggestionsList.style.border = "1px solid #dfe1e5";

    suggestionsList.style.borderTop = "none";
}
}
    

function removeRecentSearch(event: Event, index: number): void {

    event.stopPropagation();

    const storedSearches = localStorage.getItem('recentSearches');
    const searches: string[] = storedSearches ? JSON.parse(storedSearches) : []

    
    searches.splice(index, 1);

    localStorage.setItem('recentSearches', JSON.stringify(searches));

    showRecentSearches();

    const suggestionsList = document.getElementById('suggestions-list') as HTMLElement;

    if (searches.length === 0 && suggestionsList){
        suggestionsList.style.display = "none";
    }
}