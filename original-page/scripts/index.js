(() => {
  const imageInput = document.getElementById("image");
  const imageLink = document.getElementById("image-link");
  const imageChooser = document.getElementById("image-chooser-label");
  const imagePreview = document.getElementById("image-preview");
  const imageOptionCheckbox = document.getElementById("image-option");
  const imageLinkSection = document.getElementById("image-link-section");
  const formSubmit = document.getElementById("newsForm");
  const imageContent = { "url-link": "", "url-base64": "" };
  const REQUEST_URL = "http://localhost:3000/api/create";

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
      }).then((response) =>{
        console.log(response)
      }).catch((error) =>{
        console.log(error)
      });
    }
  });

  function validateFields() {
    const titleField = document.getElementById("title");
    const authorField = document.getElementById("author");
    const publishDateField = document.getElementById("publish-date");
    const contentPreviewField = document.getElementById("content-preview");
    const contentField = document.getElementById("content");
    const categoryField = document.getElementById("category");
    const imageLinkField = document.getElementById("image-link");
    const imageField = document.getElementById("image");

    //Validating Title Field
    if (titleField.value === "") return false;
    if (titleField.value.length < 4) return false;

    //Validating Author Field
    if (authorField.value === "") return false;
    if (authorField.value.length < 4) return false;

    //Validating Publish Date Field
    if (publishDateField.value === "") return false;
    if (publishDateField.value.length < 4) return false;

    //Validating Content Preview Field
    if (contentPreviewField.value === "") return false;
    if (contentPreviewField.value.length < 4) return false;

    //Validating Content Field
    if (contentField.value === "") return false;
    if (contentField.value.length < 4) return false;

    //Validating Category Field
    if (categoryField.value === "") return false;
    if (categoryField.value.length < 4) return false;

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
