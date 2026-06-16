// Initialize EmailJS - Replace with your actual Public Key from EmailJS
// Get your Public Key from: https://dashboard.emailjs.com/admin/account
const EMAILJS_PUBLIC_KEY = "lSiqGF8eFfpk0a7tf";
const EMAILJS_SERVICE_ID = "service_ovj1dng";
const EMAILJS_TEMPLATE_ID = "template_xka0b3z";

// Initialize EmailJS - wrapped in try-catch
try {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log("EmailJS initialized successfully with Public Key:", EMAILJS_PUBLIC_KEY);
    } else {
        console.warn("EmailJS library not found. The CDN script may not have loaded.");
    }
} catch (error) {
    console.error("EmailJS initialization error:", error);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation controls
    (function () {
        try {
            const controls = document.querySelectorAll(".control");
            if (controls && controls.length > 0) {
                [...controls].forEach(button => {
                    button.addEventListener("click", function() {
                        const activeBtnCurrent = document.querySelector(".active-btn");
                        const activeSectionCurrent = document.querySelector(".active");
                        const targetSection = document.getElementById(button.dataset.id);
                        
                        if (activeBtnCurrent) activeBtnCurrent.classList.remove("active-btn");
                        if (activeSectionCurrent) activeSectionCurrent.classList.remove("active");
                        
                        this.classList.add("active-btn");
                        if (targetSection) targetSection.classList.add("active");
                    })
                });
            }
            
            const themeBtn = document.querySelector(".theme-btn");
            if (themeBtn) {
                themeBtn.addEventListener("click", () => {
                    document.body.classList.toggle("light-mode");
                })
            }
        } catch (error) {
            console.error("Navigation control error:", error);
        }
    })();

    // Form submission handler
    try {
        const contactForm = document.getElementById("contactForm");
        if (contactForm) {
            contactForm.addEventListener("submit", async function(e) {
                e.preventDefault();

                try {
                    // Get form values
                    const name = document.getElementById("name")?.value || "";
                    const email = document.getElementById("email")?.value || "";
                    const subject = document.getElementById("subject")?.value || "";
                    const message = document.getElementById("message")?.value || "";
                    const submitBtn = document.getElementById("submitBtn");

                    // Hide previous messages
                    hideMessages();

                    // Validate form
                    if (!validateForm(name, email, subject, message)) {
                        return;
                    }

                    // Check if EmailJS is properly configured
                    if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID.trim() === "") {
                        showError("EmailJS Service ID is not configured. Please contact the site owner.");
                        return;
                    }

                    // Check if EmailJS library is loaded
                    if (typeof emailjs === 'undefined') {
                        showError("EmailJS library failed to load. Please refresh the page and try again.");
                        console.error("EmailJS library not loaded");
                        return;
                    }

                    // Show loading state
                    showLoading();
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.style.opacity = "0.6";
                        submitBtn.style.cursor = "not-allowed";
                    }

                    try {
                        // Send email using EmailJS
                        console.log("Sending email with:", {
                            service: EMAILJS_SERVICE_ID,
                            template: EMAILJS_TEMPLATE_ID,
                            params: {
                                from_name: name,
                                from_email: email,
                                subject: subject,
                                message: message,
                                reply_to: email
                            }
                        });

                        const response = await emailjs.send(
                            EMAILJS_SERVICE_ID,
                            EMAILJS_TEMPLATE_ID,
                            {
                                from_name: name,
                                from_email: email,
                                subject: subject,
                                message: message,
                                reply_to: email
                            }
                        );

                        console.log("EmailJS Response:", response);

                        if (response.status === 200) {
                            // Success
                            showSuccess();
                            contactForm.reset();
                        } else {
                            showError("Failed to send message. Please try again.");
                        }
                    } catch (error) {
                        console.error("EmailJS Error Details:", {
                            message: error.message,
                            status: error.status,
                            text: error.text,
                            fullError: error
                        });
                        showError("Failed to send message. Please try again later.");
                    } finally {
                        // Re-enable submit button
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.style.opacity = "1";
                            submitBtn.style.cursor = "pointer";
                        }
                    }
                } catch (error) {
                    console.error("Form submission error:", error);
                    showError("An unexpected error occurred. Please try again.");
                }
            });
        }
    } catch (error) {
        console.error("Form handler setup error:", error);
    }
});

// Form validation
function validateForm(name, email, subject, message) {
    // Name validation
    if (!name.trim()) {
        showError("Please enter your name.");
        return false;
    }
    if (name.trim().length < 2) {
        showError("Name must be at least 2 characters long.");
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError("Please enter a valid email address.");
        return false;
    }

    // Subject validation
    if (!subject.trim()) {
        showError("Please enter a subject.");
        return false;
    }
    if (subject.trim().length < 3) {
        showError("Subject must be at least 3 characters long.");
        return false;
    }

    // Message validation
    if (!message.trim()) {
        showError("Please enter your message.");
        return false;
    }
    if (message.trim().length < 10) {
        showError("Message must be at least 10 characters long.");
        return false;
    }

    return true;
}

// Show error message
function showError(message) {
    const errorMsg = document.getElementById("errorMessage");
    const successMsg = document.getElementById("successMessage");
    const loadingMsg = document.getElementById("loadingMessage");
    
    if (errorMsg) {
        errorMsg.textContent = "❌ " + message;
        errorMsg.style.display = "block";
    }
    if (successMsg) successMsg.style.display = "none";
    if (loadingMsg) loadingMsg.style.display = "none";

    if (errorMsg) {
        setTimeout(() => {
            errorMsg.style.display = "none";
        }, 5000);
    }
}

// Show success message
function showSuccess() {
    const successMsg = document.getElementById("successMessage");
    const errorMsg = document.getElementById("errorMessage");
    const loadingMsg = document.getElementById("loadingMessage");
    
    if (loadingMsg) loadingMsg.style.display = "none";
    if (errorMsg) errorMsg.style.display = "none";
    if (successMsg) {
        successMsg.style.display = "block";
        setTimeout(() => {
            successMsg.style.display = "none";
        }, 5000);
    }
}

// Show loading message
function showLoading() {
    const loadingMsg = document.getElementById("loadingMessage");
    const errorMsg = document.getElementById("errorMessage");
    const successMsg = document.getElementById("successMessage");
    
    if (loadingMsg) loadingMsg.style.display = "block";
    if (errorMsg) errorMsg.style.display = "none";
    if (successMsg) successMsg.style.display = "none";
}

// Hide all messages
function hideMessages() {
    const loadingMsg = document.getElementById("loadingMessage");
    const errorMsg = document.getElementById("errorMessage");
    const successMsg = document.getElementById("successMessage");
    
    if (loadingMsg) loadingMsg.style.display = "none";
    if (errorMsg) errorMsg.style.display = "none";
    if (successMsg) successMsg.style.display = "none";
}

// All handlers are set up in DOMContentLoaded

