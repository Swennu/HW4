<template>
  <div class="signup-page">

    <!-- Signup Form -->
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

        <button type="submit">Signup</button>

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
    handleSignup() {
      this.$store.dispatch("signup", {
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>

<style scoped>
.signup-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  margin: 20px;
  padding: 20px;
  background: #eef4e8;
  border-radius: 10px;
}

form div {
  margin-bottom: 12px;
}

.error {
  margin-top: 10px;
  color: red;
}
</style>