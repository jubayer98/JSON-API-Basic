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
            // Show spinner
            document.getElementById('spinner').classList.remove('hidden');
            // Hide pets container
            document.getElementById('pets_container').classList.add('hidden');
            // First, remove the bg-cyan-200 class from all categories
            document.querySelectorAll(".category").forEach(cat => {
                cat.classList.remove("bg-cyan-200");
            });
            // Then, add the class to the clicked category
            div.classList.add("bg-cyan-200");

            setTimeout(() => {
                div.classList.add("bg-cyan-200");
                // Hide spinner after 2 seconds
                document.getElementById('spinner').classList.add('hidden');
                // Show pets container
                document.getElementById('pets_container').classList.remove('hidden');
                loadPetsByCategory(category.category.toLowerCase());
            }, 2000); // Wait for 2 seconds before showing the category
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
            <div class="hero-content lg:w-screen w-fit">
                <div class="max-w-md mx-auto flex flex-col justify-center items-center space-y-3">
                    <div class="flex justify-center items-center">
                        <img src="./images/error.webp">
                    </div>
                    <div class="text-center">
                        <h2 class="font-bold text-xl">No Information Available</h2>
                        <p>"No Information Available" highlights the lack of data or details, emphasizing the need for further research or clarification on the subject.</p>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(noDataDiv);
        // Remove grid classes when there are no pets
        container.className = "";
    } else {
        // Apply grid classes and display pets
        container.className = "lg:w-[70%] w-full lg:grid lg:grid-cols-3 lg:gap-1";
        pets.forEach(pet => {
            const div = document.createElement("div");
            div.className = "border-2 rounded p-2 mb-2 lg:mr-2";
            div.innerHTML = `
                <img src="${displayValue(pet.image)}" class="object-cover lg:w-fit w-full rounded pet-image" alt="">
                <p class="font-bold">${displayValue(pet.pet_name)}</p>
                <div class="text-xs text-gray-500">
                    <p><i class="fa-solid fa-table-cells-large"></i> Breed: ${displayValue(pet.breed)}</p>
                    <p><i class="fa-solid fa-calendar-days"></i> Birth: ${displayValue(pet.date_of_birth)}</p>
                    <p><i class="fa-solid fa-mercury"></i> Gender: ${displayValue(pet.gender)}</p>
                    <p><i class="fa-solid fa-tag"></i> Price: $${displayValue(pet.price)}</p>
                </div>
                <hr class="mt-1">
                <div class="flex space-x-2 justify-center items-center text-xs mt-2">
                    <p class="border-2 px-2 text-cyan-700 hover:bg-cyan-700 hover:text-white thumbs-up"><i class="fa-solid fa-thumbs-up"></i></p>
                    <p class="border-2 px-2 text-cyan-700 hover:bg-cyan-700 hover:text-white adopt-button" data-adopted="false" data-pet-id="${displayValue(pet.id)}">Adopt</p>
                    <p class="border-2 px-2 text-cyan-700 hover:bg-cyan-700 hover:text-white details-button" data-pet-id="${displayValue(pet.petId)}">Details</p>
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

    document.querySelectorAll(".details-button").forEach(button => {
        button.addEventListener("click", function() {
            const petId = this.getAttribute("data-pet-id");
            fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
                .then(response => response.json())
                .then(data => {
                    const pet = data.petData;
                    updateModalContent(pet);
                    const modal = document.getElementById("my_modal_1");
                    modal.showModal();
                })
                .catch(error => console.error('Error fetching pet details:', error));
        });
    });
    
    function updateModalContent(pet) {
        const modalBox = document.querySelector("#my_modal_1 .modal-box");
        modalBox.innerHTML = `
            <img src="${displayValue(pet.image)}" alt="${pet.pet_name}" class="w-screen object-fit:cover">
            <p class="font-bold">${displayValue(pet.pet_name)}</p>
            <div class="text-xs text-gray-500">
                <p><i class="fa-solid fa-table-cells-large"></i> Breed: ${displayValue(pet.breed)}</p>
                <p><i class="fa-solid fa-calendar-days"></i> Birth: ${displayValue(pet.date_of_birth)}</p>
                <p><i class="fa-solid fa-mercury"></i> Gender: ${displayValue(pet.gender)}</p>
                <p><i class="fa-solid fa-tag"></i> Vaccinated: ${displayValue(pet.vaccinated_status)}</p>
            </div>
            <hr class="mt-1">
            <p class="font-bold py-4">Detail Information</p>
            <p>${displayValue(pet.pet_details)}</p>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn">Close</button>
                </form>
            </div>
        `;
    }

    document.querySelectorAll(".adopt-button").forEach(button => {
        button.addEventListener("click", function() {
            if (this.getAttribute("data-adopted") === "false") {
                const modal = document.getElementById("my_modal_1");
                const modalBox = modal.querySelector(".modal-box");
                modal.showModal();
                
                let countdown = 3;
                modalBox.innerHTML = `
                    <h3 class="text-2xl text-center font-bold">Congratulations</h3>
                    <p class="text-center text-md">Adoption process is starting for your pet</p>
                    <div class="flex justify-center items-center" style="height: 100%;">
                        <p class="countdown text-5xl">${countdown}</p>
                    </div>
                `;
    
                const interval = setInterval(() => {
                    countdown--;
                    if (countdown === 0) {
                        clearInterval(interval);
                        modal.close();
                        this.textContent = "Adopted";
                        this.classList.remove("hover:bg-cyan-700", "hover:text-white");
                        this.classList.add("bg-gray-500", "text-gray-200");
                        this.setAttribute("data-adopted", "true");
                        this.disabled = true;
                    } else {
                        modal.querySelector(".countdown").textContent = `${countdown}`;
                    }
                }, 1000);
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