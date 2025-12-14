import { createStore } from 'vuex'

export default createStore({
  state: {
    signupErrors: [],
    authenticated: false
  },
  getters: {
    signupErrors: (state) => state.signupErrors
  },
  mutations: {
    SET_SIGNUP_ERRORS(state,errors) {
      state.signupErrors = errors;
    },
    SET_AUTH(state, value) {
      state.authenticated = value;
    }
  },
  actions: {
    async signup({ commit }, { email, password, router }) {
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
        try {
          const response = await fetch("http://localhost:3000/auth/signup", 
          { method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({email, password})
          });
          const data = await response.json()

          if (response.ok) {
            alert(`Signup successful! User ID: ${data.user_id}`);
            router.push('/posts');
            commit("SET_SIGNUP_ERRORS", []); // clear previous errors
            commit("SET_AUTH", true);
          } else {
          // Backend returned an error
          commit("SET_SIGNUP_ERRORS", [data.error || "Signup failed"]);
          }
        } catch (err) {
          commit("SET_SIGNUP_ERRORS", [err.message]);
        }
      }
    },
    async checkAuth({commit}) {
      try {
        const res = await fetch('http://localhost:3000/auth/check', {
          credentials: 'include'
        });
        const data = await res.json();
        commit('SET_AUTH', data.authenticated);
    } catch {
        commit('SET_AUTH', false);
    }
    },
    async logout({ commit }) {
      try {
        await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
        commit('SET_AUTH', false);
      } catch {}
    },

    async login({ commit }, { email, password, router }) {
      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password })
        });

      const data = await response.json();

      if (response.ok) {
        commit("SET_SIGNUP_ERRORS", []);
        commit("SET_AUTH", true);
        router.push('/posts'); // redirect after login
      } else {
        commit("SET_SIGNUP_ERRORS", [data.error || "Login failed"]);
      }
    } catch (err) {
      commit("SET_SIGNUP_ERRORS", [err.message]);
    }
  }
  },
  modules: {
  }
})
