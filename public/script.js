// public/script.js - Client-Side Interaction and Forced DM Redirect (FINAL)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('collaborationForm');
    const submitButton = document.getElementById('submitBtn');
    const loadingMessage = document.getElementById('loading-message');

    // *** FINAL DM Link ***
    const DM_REDIRECT_URL = 'https://www.instagram.com/direct/t/17846435883382229/'; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        // Form Validation Check
        if (!form.checkValidity()) {
            form.reportValidity(); 
            return;
        }

        // 1. Loading State Activate karo
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>🚀 Processing Transmission...</span>';
        loadingMessage.classList.add('visible');

        // Form Data ko URL-encoded format mein convert karo
        const formData = new URLSearchParams(new FormData(form)).toString();
        
        try {
            // 2. Server (Node.js) par asynchronous POST request bhejkar data log karo
            const response = await fetch('/submit-collaboration-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },
                body: formData
            });

            if (response.ok) {
                // 3. Server se 200 OK milne ke baad: Final Success State
                submitButton.innerHTML = '<span>✅ Connection Successful! Redirecting...</span>';

                // 2 second ka final delay, taaki client animation dekh sake
                setTimeout(() => {
                    // Browser ko seedhe DM Link par bhej do (Forced Client-Side Redirect)
                    window.location.href = DM_REDIRECT_URL;
                }, 2000); 
                
            } else {
                // Server se error aane par
                alert('Server submission failed. Please check server console for logs.');
                // Reset State
                submitButton.disabled = false;
                submitButton.innerHTML = 'INITIATE CONTACT & GOTO @xfahadofficial';
                loadingMessage.classList.remove('visible');
            }

        } catch (error) {
            // Network error ya server down hone par
            console.error('Network Error:', error);
            alert('A network error occurred. Please ensure the server is running on localhost:3000.');
            // Reset State
            submitButton.disabled = false;
            submitButton.innerHTML = 'INITIATE CONTACT & GOTO @xfahadofficial';
            loadingMessage.classList.remove('visible');
        }
    });
});