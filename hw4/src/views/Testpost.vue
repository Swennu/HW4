<template>
  <div class="posts-page">
    <h1>POSTS</h1>

    <div v-if="!isLoggedIn">
      <p>You must be logged in to see posts.</p>
    </div>

    <div v-else>
  <button v-if="posts.length" @click="deleteAllPosts" class="delete-all">
    Delete All Posts
  </button>

      <div v-if="posts.length === 0">
        <p>No posts yet.</p>
      </div>

      <ul v-else>
        <li v-for="post in posts" :key="post.id">
          <router-link :to="`/posts/${post.id}`" class="post-link">
            <p>{{ post.body }}</p>
            <small>{{ formatDate(post.date) }}</small>
    </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "PostsPage",
  computed: {
    posts() {
      return this.$store.state.posts; // get posts from Vuex
    },
    isLoggedIn() {
      return this.$store.state.authenticated;
    }
  },
  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString();
    }
  },
  created() {
    // Optional: fetch posts from backend
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const res = await fetch("http://localhost:3000/posts", {
          credentials: "include"
        });
        const data = await res.json();
        if (data.posts) {
          this.$store.commit("SET_POSTS", data.posts);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },

    async deleteAllPosts() {
    if (!confirm("Are you sure you want to delete all posts?")) return;
    try {
      const res = await fetch("http://localhost:3000/posts", {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      alert(data.message || "All posts deleted");

      // Clear posts in Vuex state
      this.$store.commit("SET_POSTS", []);
    } catch (err) {
      alert("Failed to delete all posts: " + err.message);
    }
  }
  }
};
</script>
<style scoped>
.posts-page {
  max-width: 600px;
  margin: 50px auto;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #f0f8ff;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 10px;
}

small {
  color: gray;
  font-size: 12px;
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.post-link:hover {
  background-color: #e0f7ff;
}

.delete-all {
  padding: 10px 15px;
  margin-bottom: 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.delete-all:hover {
  background-color: darkred;
}
</style>
