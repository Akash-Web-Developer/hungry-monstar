// Catch All ID by get Element Id
const search = document.getElementById("search");
  submit = document.getElementById("submit");
  random = document.getElementById("random");
  mealsEl = document.getElementById("meals");
  resultHeading = document.getElementById("result-heading");
  single_mealEl = document.getElementById("single-meal");

//Search Meal by write Meal Name
function searchMeal(e) {
  e.preventDefault();
  single_mealEl.innerHTML = "";
  const term = search.value;
  console.log(term);
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h3 style="color: black">Search results for '${term}':</h3>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<p style="color: black">There are no search results. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealID="${meal.idMeal}">
            <h3>${meal.strMeal}</h3></div>
            </div>`
            )
            .join("");
        }
      });
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

//API Use for every meal ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
function getMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  
  //After Click to get Ingredients
  single_mealEl.innerHTML = `
  <div class="single-meal">    
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div style="text-align: left; color: black" class="main">
        <h3>${meal.strMeal}</h3> <br>        
        <h5>Ingredients</h5>        
            ${ingredients.map((ing) => `<p><ul>${ing}</ul></p>`).join("")}        
    </div>
  </div>`;
}

//Event Listener Add
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});