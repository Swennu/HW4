<template>
  <div class="add-post-page" v-if="isLoggedIn">
    <div class="form-container">
      <h2>Add Post</h2>
      <form @submit.prevent="handleAddPost">
        <div>
          <label for="body">Body</label>
          <input id="body" v-model="body" type="text" placeholder="body" required />
        </div>
        <button type="submit">Add</button>
      </form>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
  <div v-else class="not-logged-in">
    <p>You must be logged in to add a post.</p>
  </div>
</template>

<script>
export default {
  name: "AddPostPage",
  data() {
    return {
      body: "",
      successMessage: "",
      errorMessage: ""
    };
  },
  computed: {
    isLoggedIn() {
      // Assume your Vuex store tracks auth state
      return this.$store.state.authenticated;
    }
  },
  methods: {
    handleAddPost() {
      if (!this.body) return;

      const post = {
        body: this.body,
        date: new Date().toISOString() // auto-add current date
      };

      this.$store.dispatch("addPost", post)
        .then(() => {
          this.successMessage = "Post added successfully!";
          this.body = ""; // clear input
        })
        .catch(err => {
          this.errorMessage = "Failed to add post: " + err.message;
        });
    }
  }
};
</script>

<style scoped>
.add-post-page, .not-logged-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

.form-container {
  padding: 30px;
  background: #f0f8ff;
  border-radius: 15px;
  max-width: 400px;
  width: 100%;
}

form div {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 15px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background-color: rgb(181, 245, 224);
  font-weight: 600;
  cursor: pointer;
}

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
