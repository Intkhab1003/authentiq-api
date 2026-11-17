document.addEventListener('DOMContentLoaded', () => {
  // 1. Grab DOM elements
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeOpenIcon = document.getElementById('eyeOpenIcon');
  const eyeClosedIcon = document.getElementById('eyeClosedIcon');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const authAlert = document.getElementById('authAlert');
  const statusBadge = document.getElementById('statusBadge');
  const responseOutput = document.getElementById('responseOutput');
  const copyJsonBtn = document.getElementById('copyJsonBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const holoStage = document.getElementById('holoStage');
  const holoCard = document.getElementById('holoCard');

  // 2. Show / Hide Password Toggle
  togglePasswordBtn.addEventListener('click', () => {
    const isPasswordHidden = passwordInput.type === 'password';
    passwordInput.type = isPasswordHidden ? 'text' : 'password';

    eyeOpenIcon.classList.toggle('hidden', isPasswordHidden);
    eyeClosedIcon.classList.toggle('hidden', !isPasswordHidden);
    togglePasswordBtn.setAttribute(
      'aria-label',
      isPasswordHidden ? 'Hide password' : 'Show password'
    );
  });

  // 3. Subtle 3D Mouse Tilt on the Holographic Security Shield
  if (holoStage && holoCard) {
    holoStage.addEventListener('mousemove', (e) => {
      const rect = holoStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotateY = (x * 22).toFixed(2);
      const rotateX = (-y * 22).toFixed(2);
      holoCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    holoStage.addEventListener('mouseleave', () => {
      holoCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  // Helper: Toggle loading state on the Sign-In button
  function setLoadingState(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.textContent = isLoading ? 'Verifying Credentials...' : 'Authenticate Session';
    btnSpinner.classList.toggle('hidden', !isLoading);
  }

  // Helper: Display notification banner
  function showAlert(type, message) {
    authAlert.className = 'auth-alert';
    if (type === 'success') authAlert.classList.add('alert-success');
    if (type === 'warning') authAlert.classList.add('alert-warning');
    if (type === 'error') authAlert.classList.add('alert-error');
    authAlert.textContent = message;
  }

  // Helper: Update Live API Response Viewer & HTTP Status Badge
  function renderApiResponse(httpStatus, payload) {
    statusBadge.className = 'http-badge';

    if (httpStatus === 200) {
      statusBadge.classList.add('badge-200');
      statusBadge.textContent = '200 OK';
    } else if (httpStatus === 400) {
      statusBadge.classList.add('badge-400');
      statusBadge.textContent = '400 BAD REQUEST';
    } else if (httpStatus === 401) {
      statusBadge.classList.add('badge-401');
      statusBadge.textContent = '401 UNAUTHORIZED';
    } else {
      statusBadge.classList.add('badge-401');
      statusBadge.textContent = `${httpStatus} ERROR`;
    }

    // Format JSON cleanly (password is never present in payload)
    responseOutput.textContent = JSON.stringify(payload, null, 2);
  }

  // 4. Handle Login Form Submission via fetch()
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoadingState(true);

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      renderApiResponse(response.status, data);

      if (response.status === 200) {
        showAlert('success', `Access Granted: Welcome back, ${data.data.username}.`);
      } else if (response.status === 400) {
        showAlert('warning', `Validation Error (400): ${data.message}`);
      } else {
        showAlert('error', `Authentication Failed (${response.status}): ${data.message}`);
      }
    } catch (error) {
      renderApiResponse(503, {
        success: false,
        error: 'Network Error',
        message: 'Unable to reach the Express backend server. Ensure npm run dev is running.'
      });
      showAlert('error', 'Connection error: Could not reach /api/login.');
    } finally {
      setLoadingState(false);
    }
  });

  // 5. Copy JSON Response Button
  copyJsonBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(responseOutput.textContent);
      copyBtnText.textContent = 'Copied!';
      setTimeout(() => {
        copyBtnText.textContent = 'Copy JSON';
      }, 1800);
    } catch (err) {
      copyBtnText.textContent = 'Copy Failed';
      setTimeout(() => {
        copyBtnText.textContent = 'Copy JSON';
      }, 1800);
    }
  });
});