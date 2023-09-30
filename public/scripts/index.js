(() => {
  const imageInput = document.getElementById("image");
  const imageLink = document.getElementById("image-link");
  const imageChooser = document.getElementById("image-chooser-label");
  const imagePreview = document.getElementById("image-preview");
  const imageOptionCheckbox = document.getElementById("image-option");
  const imageLinkSection = document.getElementById("image-link-section");
  const formSubmit = document.getElementById("newsForm");
  const imageContent = { "url-link": "", "url-base64": "" };
  const REQUEST_URL = "/api/news/";

  //Ao mudar a imagem
  imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imageContent["url-base64"] = e.target.result;
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        console.log("Recebido o Batman");
      };
      reader.readAsDataURL(file);
    } else {
      imageContent["url-base64"] = "";
      imagePreview.src = "#";
      imagePreview.style.display = "none";
    }
  });

  //Ao introduzir uma url no campo de link
  imageLink.addEventListener("input", (event) => {
    if (this.value !== "") {
      imageContent["url-link"] = imageLink.value;
      imagePreview.src = imageLink.value;
      imagePreview.style.display = "block";
    } else {
      imageContent["url-link"] = "";
      imagePreview.src = "#";
      imagePreview.style.display = "none";
    }
  });

  //Ao mudar entre link e ficheiro local
  imageOptionCheckbox.addEventListener("change", function () {
    if (this.checked) {
      imagePreview.src = "#";
      imagePreview.style.display = "none";
      imageLinkSection.style.display = "block";
      imageChooser.style.display = "none";
    } else {
      imagePreview.src = "#";
      imagePreview.style.display = "none";
      imageLinkSection.style.display = "none";
      imageChooser.style.display = "block";
    }
  });

  //Ao submeter o form no servidor
  formSubmit.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateFields()) {
      const titleField = document.getElementById("title");
      const authorField = document.getElementById("author");
      const publishDateField = document.getElementById("publish-date");
      const contentPreviewField = document.getElementById("content-preview");
      const contentField = document.getElementById("content");
      const categoryField = document.getElementById("category");

      fetch(REQUEST_URL,{
        headers: {"Content-Type": "application/json"},
        method:"POST",
        body: JSON.stringify({
            "title": titleField.value,
            "author": authorField.value,
            "publish-date": publishDateField.value,
            "content-preview": contentPreviewField.value,
            "content": contentField.value,
            "category": categoryField.value,
            "image-cover": imageContent
        })
      }).then((response) =>response.json()).then((data)=>{
        console.log(data);
      }).catch((error) =>{
        console.log(error)
      });
    }
  });

  function validateFields() {

    console.log("Validating Image Field");
    //Validating ImageField
    if (imageOptionCheckbox.checked) {
      if (imageContent["url-link"] === "") return false;
    } else {
      if (imageContent["url-base64"] === "") return false;
    }

    return true;
  }
})();
