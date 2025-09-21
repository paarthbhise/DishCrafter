const searchForm = document.querySelector('form');
const searchInput = document.querySelector('#search');
const resultsList = document.querySelector('#results');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
})
const apiKey = '95ffc1b28b4240068bb31880ab7cba74'; 
async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    // Replace 'YOUR_SPOONACULAR_API_KEY' with your actual Spoonacular API key
    
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${searchValue}&apiKey=${apiKey}&number=10`);
    const data = await response.json();
    console.log("Spoonacular API response:", data); // Log the API response
    displayRecipes(data.results);
}

async function displayRecipes(recipes) {
    let html = '';
    for (const recipe of recipes) {
        // Fetch full recipe information using the recipe ID
        const recipeInfoResponse = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`);
        const recipeInfo = await recipeInfoResponse.json();

        let ingredientsHtml = '';
        if (recipeInfo.extendedIngredients) {
            ingredientsHtml = recipeInfo.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('');
        }

        let instructionsHtml = '';
        if (recipeInfo.instructions) {
            instructionsHtml = `<p>${recipeInfo.instructions}</p>`;
        } else if (recipeInfo.analyzedInstructions && recipeInfo.analyzedInstructions.length > 0) {
            instructionsHtml = recipeInfo.analyzedInstructions[0].steps.map(step => `<p>${step.step}</p>`).join('');
        }

        html += `
        <div>
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <h4>Ingredients:</h4>
            <ul>
                ${ingredientsHtml}
            </ul>
            <h4>Instructions:</h4>
            ${instructionsHtml}
            <a href="${recipeInfo.sourceUrl}" target="_blank">View Full Recipe</a>
        </div> 
        `;
    }
    resultsList.innerHTML = html;
}