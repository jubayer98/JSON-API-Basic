// Load categories from API and display them
const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then(response => response.json())
    .then(data => {
        if (data.status && data.categories) {
            displayCategories(data.categories);
        } else {
            console.error("Failed to load categories:", data.message);
        }
    })
    .catch(error => console.error("Error fetching the categories:", error));
}

let petsData = [];
// Load all pets from API
const loadPets = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then(response => response.json())
    .then(data => {
        if (data.status && data.pets) {
            petsData = data.pets;
            displayPets(petsData);
        } else {
            console.error("Failed to load pets:", petsData.message);
        }
    })
    .catch(error => console.error("Error fetching the pets:", error));
}

// Load pets by a specific category
const loadPetsByCategory = category => {
    const apiUrl = `https://openapi.programming-hero.com/api/peddy/category/${category}`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.status && data.data) {
            petsData = data.data;
            displayPets(petsData);
        } else {
            console.error("Failed to load pets:", petsData.message);
        }
    })
    .catch(error => console.error("Error fetching the pets:", error));
}

// Display categories in the UI
const displayCategories = categories => {
    const container = document.getElementById("categories-container");
    container.innerHTML = ""; // Clear existing content

    categories.forEach(category => {
        const div = document.createElement("div");
        div.className = "category flex border-2 rounded-xl px-24 py-2 items-center space-x-5 cursor-pointer";
        div.innerHTML = `
            <img src="${category.category_icon}" alt="${category.category} Icon" class="w-12 h-12">
            <span class="font-bold text-xl">${category.category}</span>
        `;
        container.appendChild(div);

        // Attach event to toggle background color when category is clicked
        div.addEventListener("click", () => {
            // First, remove the bg-cyan-200 class from all categories
            document.querySelectorAll(".category").forEach(cat => {
                cat.classList.remove("bg-cyan-200");
            });
            // Then, add the class to the clicked category
            div.classList.add("bg-cyan-200");

            loadPetsByCategory(category.category.toLowerCase());
        });
    });
}

// Display pets in the UI
const displayPets = pets => {
    const container = document.getElementById("pets_container");
    container.innerHTML = ""; // Clear existing content

    if (pets.length === 0) {
        // Display a message and image if no pets are found
        const noDataDiv = document.createElement("div");
        noDataDiv.className = "hero bg-base-200 w-11/12 mx-auto";
        noDataDiv.innerHTML = `
            <div class="hero-content w-screen">
                <div class="max-w-md mx-auto flex flex-col justify-center items-center space-y-3">
                    <div class="flex justify-center items-center">
                        <img src="./images/error.webp">
                    </div>
                    <div class="text-center">
                        <h2 class="font-bold text-xl">No Information Available</h2>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using that it has a.</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(noDataDiv);
        // Remove grid classes when there are no pets
        container.className = "";
    } else {
        // Apply grid classes and display pets
        container.className = "w-[70%] grid grid-cols-3 gap-1";
        pets.forEach(pet => {
            const div = document.createElement("div");
            div.className = "border-2 rounded p-2 mb-2 mr-2";
            div.innerHTML = `
                <img src="${displayValue(pet.image)}" class="object-cover w-fit rounded pet-image" alt="">
                <p class="font-bold">${displayValue(pet.pet_name)}</p>
                <div class="text-xs text-gray-500">
                    <p><i class="fa-solid fa-table-cells-large"></i> Breed: ${displayValue(pet.breed)}</p>
                    <p><i class="fa-solid fa-calendar-days"></i> Birth: ${displayValue(pet.date_of_birth)}</p>
                    <p><i class="fa-solid fa-mercury"></i> Gender: ${displayValue(pet.gender)}</p>
                    <p><i class="fa-solid fa-tag"></i> Price: $${displayValue(pet.price)}</p>
                </div>
                <hr class="mt-1">
                <div class="flex space-x-2 justify-center items-center text-xs mt-2">
                    <p class="border-2 px-2 text-cyan-700 cursor-pointer thumbs-up"><i class="fa-solid fa-thumbs-up"></i></p>
                    <p class="border-2 px-2 text-cyan-700">Adopt</p>
                    <p class="border-2 px-2 text-cyan-700">Details</p>
                </div>
            `;
            container.appendChild(div);
        });
    }

    document.querySelectorAll(".thumbs-up").forEach(item => {
        item.addEventListener("click", function() {
            const petImage = this.parentNode.parentNode.querySelector(".pet-image").src;
            const favContainer = document.querySelector(".fav-container");
            const img = document.createElement("img");
            img.src = petImage;
            img.className = "object-cover h-48 w-48 rounded-xl p-2";
            favContainer.appendChild(img);

            if (favContainer.children.length > 0) {
                favContainer.classList.remove("hidden-border");
                favContainer.classList.add("border-2");
            }
        });
    });
}

// Helper function to handle possibly undefined or null values
const displayValue = value => value ? value : "Not Available";

// Sort descending order function
document.getElementById("sortDE").addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor click behavior

    // Sort the pets by price in descending order
    petsData.sort((a, b) => b.price - a.price);

    // Display the sorted pets
    displayPets(petsData);
});


// Initialize categories and pets on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadPets();
});