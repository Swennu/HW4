<template>
  <div v-if="!isLoggedIn">
    <p>You must be logged in to view this page.</p>
  </div>

  <div v-else class="post-page">
    <h1>Post Details</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="post">
    <textarea v-model="post.body"></textarea>
    <p><small>{{ formatDate(post.date) }}</small></p>

  <button @click="updatePost">Update</button>
  <button @click="deletePost">Delete</button>
  <p v-if="successMessage" class="success">{{ successMessage }}</p>
  <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
</div>
  </div>
</template>

<script>
export default {
  name: "PostPage",
  data() {
    return {
      post: null,
      loading: true,
      error: null,
      successMessage: "",
      errorMessage: ""
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.authenticated;
    }
  },
  created() {
    this.fetchPost();
  },
  methods: {
    async fetchPost() {
      const id = this.$route.params.id; // assuming route: /posts/:id
      try {
        this.post = await this.$store.dispatch("fetchPost", id);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async updatePost() {
      try {
        const updated = await this.$store.dispatch("updatePost", this.post);
        this.post = updated;
        this.successMessage = "Post updated!";
        this.errorMessage = "";
      } catch (err) {
        this.errorMessage = err.message;
        this.successMessage = "";
      }
    },
    async deletePost() {
      if (!confirm("Are you sure you want to delete this post?")) return;
      try {
        await this.$store.dispatch("deletePost", this.post.id);
        this.successMessage = "Post deleted!";
        this.errorMessage = "";
        this.$router.push("/posts"); // go back to homepage
      } catch (err) {
        this.errorMessage = err.message;
        this.successMessage = "";
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    }
  }
};
</script>

<style scoped>
textarea {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
  margin-bottom: 10px;
}
button {
  margin-right: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.success { color: green; }
.error { color: red; }
</style>
