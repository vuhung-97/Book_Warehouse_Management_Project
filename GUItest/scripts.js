document.addEventListener("DOMContentLoaded", () => {
    const a = document.querySelector("button.a");
    const b = document.querySelector(".b");
    const c = document.querySelector(".c");
    const left = document.querySelector(".left");
    const mid = document.querySelector(".mid");

    a.addEventListener("click", () => {
        left.style.width = left.style.width === "5%" ? "20%" : "5%";
    console.log("click a");
    });
});