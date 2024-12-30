document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("upload-form").addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const formData = new FormData();
      const fileInput = document.querySelector('input[type="file"]');
  
      formData.append("file", fileInput.files[0]);
  
      try {
        const response = await fetch("/convert", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const downloadLink = document.createElement("a");
          downloadLink.href = data.downloadUrl;
          downloadLink.textContent = "Download Converted Word File";
          document.getElementById("result").appendChild(downloadLink);
        } else {
          document.getElementById("result").textContent = data.message;
        }
      } catch (error) {
        document.getElementById("result").textContent = "An error occurred during the conversion.";
        console.error("Error during conversion:", error);
      }
    });
  });
  