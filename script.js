fetch("http://localhost:5000/hello")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("backend-message").textContent = data.message;
  })
  .catch((err) => {
    document.getElementById("backend-message").textContent =
      "Failed to fetch from backend.";
  });
