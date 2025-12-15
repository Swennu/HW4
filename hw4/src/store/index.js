import { createStore } from 'vuex'

export default createStore({
  state: {
    signupErrors: [],
    authenticated: false,
     posts: []
  },
  getters: {
    signupErrors: (state) => state.signupErrors,
    posts: (state) => state.posts
  },
  mutations: {
    SET_SIGNUP_ERRORS(state,errors) {
      state.signupErrors = errors;
    },
    SET_AUTH(state, value) {
      state.authenticated = value;
    },
    ADD_POST(state, post) {
      state.posts.push(post);
    },
    SET_POSTS(state, posts) { 
      state.posts = posts;
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
  },

  async addPost({ commit }, post) {
      try {
        // Optionally send to backend:
        const response = await fetch('http://localhost:3000/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(post)
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to add post');
        }

        // On success, add to local state
        commit('ADD_POST', post);
        return true;
      } catch (err) {
        throw err;
      }
    },

    async fetchPost({ commit }, id) {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}`, {
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch post");
      return data.post;
    } catch (err) {
      throw err;
    }
  },

  async updatePost({ commit }, post) {
  const res = await fetch(`http://localhost:3000/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ body: post.body })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update post");
  return data.post;
},

async deletePost({ commit }, id) {
  const res = await fetch(`http://localhost:3000/posts/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete post");
  return data.message;
},

async deleteAllPosts({ commit }) {
    try {
      const res = await fetch("http://localhost:3000/posts", {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete all posts");

      commit("SET_POSTS", []); // clear local state
      return data.message;
    } catch (err) {
      throw err;
    }
  }
  },
  modules: {
  }
})
