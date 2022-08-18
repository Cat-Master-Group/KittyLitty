const afterLoaded = async () => {
  const accept = document.getElementById("accept");
  const rejection = document.getElementById("decline");
  const current = document.getElementById("currentUser");

  let fetchList;
  try {
    fetchList = await axios.get("/api/user/available");
  } catch (error) {}

  if (fetchList.data) {
    const matchList = fetchList.data;

    console.log(matchList);
    let currentIndex = 0;

    if (current) {
      let potentialMatch = matchList[currentIndex];

      accept.addEventListener("click", (event) => {
        event.preventDefault();
        console.log(potentialMatch);
      });
    }

    console.log(matchList);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afterLoaded);
} else {
  afterLoaded();
}
