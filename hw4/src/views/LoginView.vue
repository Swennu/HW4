<template>
  <div class="signup-page">
    <div class="form-container">
      <form @submit.prevent="handleSignup">
        <div>
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>

        <div>
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <div class="buttons">
          <button type="submit" @click="handleAuth('signup')">Signup</button>
          <button type="submit" @click="handleAuth('login')">Login</button>
        </div>
        <!-- Validation Errors -->
        <p v-if="errorMessages.length > 0" class="error">
          The password is not valid:
          <ul>
            <li v-for="(msg, index) in errorMessages" :key="index">{{ msg }}</li>
          </ul>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupPage",

  data() {
    return {
      email: "",
      password: ""
    };
  },

  computed: {
    errorMessages() {
      return this.$store.getters.signupErrors;
    }
  },

  methods: {
    handleAuth(mode) {
      if (mode === "signup") {
        this.$store.dispatch("signup", {
          email: this.email,
          password: this.password,
          router: this.$router
        });
      }
      else if (mode === "login"){
        this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
          router: this.$router
        });
      }
    }
  }
};
</script>

<style scoped>
.signup-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form-container {
  margin: 20px;
  padding: 30px;
  background: #efd3f5;
  border-radius: 15px;
  max-width: 400px;
  width: 100%;
}

form div {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
    min-width: 100px;
  }

input {
  width: 100%;
  border-radius: 15px;
  padding: 12px;
  font-size: 16px;
}
input:focus {
    outline: none;
    border-color: #4caf50;  /* Green focus color */
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);  /* Subtle glow */
  }
.buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
button {
    width: 40%;
    border-radius: 20px;
    padding: 12px;
    margin-bottom: 10px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    background-color: rgb(181, 245, 224);
  }
.error {
  margin-top: 10px;
  color: red;
}
</style>