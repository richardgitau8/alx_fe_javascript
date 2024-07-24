// Array to store quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Good, better, best. Never let it rest. 'Til your good is better and your better is best.", category: "Inspiration" }
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filteredQuotes = getFilteredQuotes();
  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>Category: ${randomQuote.category}</em></p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// Function to create the add quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById('addQuoteFormContainer');
  formContainer.innerHTML = '';

  const formDiv = document.createElement('div');
  formDiv.className = 'form-container';

  const inputText = document.createElement('input');
  inputText.id = 'newQuoteText';
  inputText.type = 'text';
  inputText.placeholder = 'Enter a new quote';
  formDiv.appendChild(inputText);

  const inputCategory = document.createElement('input');
  inputCategory.id = 'newQuoteCategory';
  inputCategory.type = 'text';
  inputCategory.placeholder = 'Enter quote category';
  formDiv.appendChild(inputCategory);

  const addButton = document.createElement('button');
  addButton.onclick = addQuote;
  addButton.textContent = 'Add Quote';
  formDiv.appendChild(addButton);

  formContainer.appendChild(formDiv);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategoryFilter();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategoryFilter();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to get unique categories from quotes
function getUniqueCategories() {
  const categories = quotes.map(quote => quote.category);
  return [...new Set(categories)];
}

// Function to populate the category filter dropdown
function populateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = getUniqueCategories();
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = selectedCategory;
}

// Function to get quotes based on the selected category
function getFilteredQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === 'all') {
    return quotes;
  }
  return quotes.filter(quote => quote.category === selectedCategory);
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length > 0) {
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>Category: ${randomQuote.category}</em></p>`;
  } else {
    quoteDisplay.innerHTML = '<p>No quotes available for the selected category.</p>';
  }
  localStorage.setItem('selectedCategory', categoryFilter.value);
}

// Load last viewed quote and selected category from storage
window.onload = function() {
  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${lastQuote.text}</p><p><em>Category: ${lastQuote.category}</em></p>`;
  }
  populateCategoryFilter();
  const selectedCategory = localStorage.getItem('selectedCategory');
  if (selectedCategory) {
    document.getElementById('categoryFilter').value = selectedCategory;
  }
  filterQuotes();

  // Add event listeners to buttons
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('createQuoteFormButton').addEventListener('click', createAddQuoteForm);
  document.getElementById('exportQuotesButton').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
};
