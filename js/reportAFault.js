// REPORT A FAULT

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('form');
  const result = document.getElementById('result');

  // Time-based bot detection
  const formLoadedAtInput = document.getElementById('form_loaded_at');
  formLoadedAtInput.value = Date.now();

  // JS-enabled detection
  const jsEnabledInput = form.querySelector('input[name="js_enabled"]');
  jsEnabledInput.value = "true";

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Stop default HTML submission

    result.style.display = "block";
    result.innerHTML = "Please wait...";

    const formData = new FormData(form);

    // 🪤 Honeypot check
    if (formData.get("company")) {
      result.innerHTML = "Form submitted successfully!";
      form.reset();
      setTimeout(() => (result.style.display = "none"), 3000);
      return;
    }

    // ⏱️ Time-based check
    const elapsed = Date.now() - Number(formLoadedAtInput.value);
    if (elapsed < 1000) { // reduced for testing
      result.innerHTML = "Form submitted successfully!";
      form.reset();
      return;
    }

    // Convert FormData to JSON
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // ✅ Submit via JS fetch
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: json
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200) {
          result.innerHTML = data.message;

          // Optional redirect after success
          // window.location.href = "success.html";
        } else {
          result.innerHTML = data.message || "Submission failed.";
        }
      })
      .catch(() => {
        result.innerHTML = "Something went wrong!";
      })
      .finally(() => {
        form.reset();
        setTimeout(() => (result.style.display = "none"), 3000);
      });
  });
});
