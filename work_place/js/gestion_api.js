const apiUrl = "http://localhost:3001/products"

function checkResponse(res){
    if(!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json()
}

// get 
async function show() {
    try {
        const res = await fetch(apiUrl);
        const data = await checkResponse(res);
        console.log("Products:",data)
    } catch (e) {
        console.error("Error showing:", e.message);
    }
}

//post
async function create(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    try{
        const res =  await fetch(apiUrl, {
            method: "POST",
            headers:{"content-Type": "aplication/json"},
            body: JSON.stringify({name, price})
        });
        const data = await checkResponse(res)
        console.log("Book created:", data);
    } catch (e) {
        console.log("ERROR creating the book", e.message);
        
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const myForm = document.getElementById('form'); // Get the form element by its ID

    myForm.addEventListener('submit', (event) => create(event));
});

// put
const form_dos = document.getElementById("update-form");
const message_dos = document.getElementById("message");

form_dos.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameToUpdate = document.getElementById("productName").value.trim().toLowerCase();
    const newName = document.getElementById("newName").value.trim();
    const newPriceRaw = document.getElementById("newPrice").value.trim();

  // Convert price to float
    const newPrice = parseFloat(newPriceRaw);

  // Validation
    if (!nameToUpdate) {
        message_dos.textContent = "Please enter the name of the product to update.";
        return;
    }

    if (!newName) {
        message_dos.textContent = "Please enter the new name for the product.";
        return;
    }

    if (!newPriceRaw || isNaN(newPrice)) {
        message_dos.textContent = "Please enter a valid numeric price.";
        return;
    }

    try {
        // Step 1: Fetch all products and find the one matching by name
        const res = await fetch(apiUrl);
        const products = await res.json();

        const product = products.find(
        (p) => p.name.toLowerCase() === nameToUpdate
        );

        if (!product) {
        message_dos.textContent = "Product not found.";
        return;
        }

    // Step 2: PUT request to update the product
        const updateRes = await fetch(`${apiUrl}/${product.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: newName,
            price: newPrice,
        }),
    });

    if (updateRes.ok) {
        message_dos.textContent = `Product "${product.name}" was successfully updated to "${newName}" with price $${newPrice}.`;
    } else {
        message_dos.textContent = "Error updating the product.";
    }
    } catch (error) {
        console.error(error);
        message_dos.textContent = "Error with the server connection.";
    }
});




//delete

const form = document.getElementById("delete-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameToDelete = document.getElementById("productName").value.trim();

    try {
        // step 1: look the product by its name
        const res = await fetch(`http://localhost:3001/products?name=${encodeURIComponent(nameToDelete)}`);
        const products = await res.json();

    if (products.length === 0) {
        message.textContent = "Product not found.";
        return;
    }

    const productId = products[0].id;

    // step 2: delete product by id
    const deleteRes = await fetch(`http://localhost:3001/products/${productId}`, {
        method: "DELETE"
    });

    if (deleteRes.ok) {
        message.textContent = `Product "${nameToDelete}" successfully deleted.`;
    } else {
        message.textContent = "Error deleting the product.";
    }
} catch (error) {
    console.error(error);
    message.textContent = "Error with the server conection.";
}
});

