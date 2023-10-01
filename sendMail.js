window.onload = function(){
document.getElementById('wyslij').addEventListener('click', wySliJJ);
console.log("im running");
document.getElementById('menu_angielski').addEventListener('click',expAng)}

function wySliJJ (){
    let form = document.querySelector(".kontakt3_1");
emailjs.send("service_pqniaal","template_zazqo39",{
from_name: flname.value,
to_name: "Aleksandra Knabel",
message: tressc.value,
reply_to: maiilen.value
});
console.log("it run")
}

  function expAng() {
    console.log("i en run");
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "inline") {
      content.style.display = "none";
    } else {
      content.style.display = "inline";
    }
  }