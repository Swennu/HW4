import { createStore } from 'vuex'

export default createStore({
  state: {
    signupErrors: []
  },
  getters: {
    signupErrors: (state) => state.signupErrors
  },
  mutations: {
    SET_SIGNUP_ERRORS(state,errors) {
      state.signupErrors = errors;
    }
  },
  actions: {
    signup({ commit }, { email, password }) {
      const errors = [];

      // Password validation
      if (password.length < 8 || password.length > 15) {
        errors.push("Password must be 8–15 characters long.");
      }

      if (!/^[A-Z]/.test(password)) {
        errors.push("Password must start with an uppercase letter.");
      }

      if (!/[A-Z]/.test(password)) {
        errors.push("Includes at least one uppercase alphabet character.");
      }

      const lowercaseMatches = password.match(/[a-z]/g);
      if (!lowercaseMatches || lowercaseMatches.length < 2) {
        errors.push("Includes at least two lowercase alphabet characters.");
      }

      if (!/[0-9]/.test(password)) {
        errors.push("Includes at least one numeric value.");
      }

      if (!password.includes("_")) {
        errors.push('Password must include the character "_"');
      }

      // Save errors to state
      commit("SET_SIGNUP_ERRORS", errors);

      // If no errors → pretend signup success
      if (errors.length === 0) {
        // Later: API call goes here
        alert("Signup successful!");
      }
    }
  },
  modules: {
  }
})
