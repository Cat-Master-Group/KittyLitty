const afterLoaded = () => {
  const adjustForm = document.getElementById("adjustCat");
  const catName = document.getElementById("catName");
  const catGender = document.getElementById("catGender");
  const catAge = document.getElementById("catAge");
  const catBreed = document.getElementById("catBreed");
  const catIsAltered = document.getElementById("catIsAltered");
  const catGallery = document.getElementById("catGallery");
  const userBio = document.getElementById("userBio");

  if (adjustForm) {
    adjustForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const payLoad = {};
      if (catName.value.trim()) {
        payLoad.catName = catName.value.trim();
      }
      if (catGender.value.trim()) {
        payLoad.catGender = catGender.value.trim();
      }
      if (Number(catAge.value) !== NaN) {
        payLoad.catAge = Number(catAge.value);
      }
      if (catBreed.value.trim()) {
        payLoad.catBreed = catBreed.value.trim();
      }
      if (catIsAltered.value.trim()) {
        payLoad.catIsAltered = catIsAltered.value.trim();
      }
      if (catGallery.value.trim()) {
        payLoad.catGallery = catGallery.value.trim();
      }
      if (userBio.value.trim()) {
        payLoad.userBio = userBio.value.trim();
      }
      const adjustData = axios.patch("/api/user/adjust", payLoad);
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afterLoaded);
} else {
  afterLoaded();
}
