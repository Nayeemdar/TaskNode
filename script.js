document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = document.getElementById('productForm');
    const formData = new FormData(form);

    try {
        const response = await fetch('/register-product', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register product. Please try again.');
    }
});
