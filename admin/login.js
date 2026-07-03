import { auth } from "../js/firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

loginButton.addEventListener("click", async () => {

    try {

        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        window.location.href = "dashboard.html";

    } catch (error) {

        message.textContent = "メールアドレスまたはパスワードが違います。";

    }

});