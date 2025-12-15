<template>
  <div>
    <nav>
        <ul>
          <li v-if="authenticated">
          <router-link to="/posts" class="nav-item">Posts</router-link>
          <router-link to="/addpost" class="nav-item">Add Post</router-link>
          </li>
          <li><router-link to="/login" class="nav-item">Login</router-link></li>
          <li><router-link to="/about" class="nav-item">About</router-link></li>
        </ul>
          <div v-if="authenticated" class = "logout">
            <button @click="handleLogout" class="nav-item">Logout</button>
          </div>
        
      </nav>
    </div>

</template>
<script>
  import { mapState, mapActions } from 'vuex';
  export default {
  name: "Navbar",
  computed: {
    ...mapState(['authenticated'])
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();          
      this.$router.push('/login'); 
    }
  },
  mounted() {
    // Check authentication status when navbar loads
    this.$store.dispatch('checkAuth');
  }
};

</script>
<style scoped>

/* Navigation bar */
nav ul {
  display: flex;
  gap: 30px;
  list-style: none;
  background: #cecccc;
  padding: 1rem;
  margin: 0;
}
.nav-item {
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  color: black;
}
.nav-item:hover {
  background-color: #9c9a9a; 
}

  nav {
    background-color: #ccc;
    display: flex;
    justify-content: space-between;  /* keeps menu on left and profile on right */
    align-items: center;
    padding: 10px 20px;
  }

  nav a {
    text-decoration: none;
    color: #000;
    font-weight: bold;
  }
  
  .logout {
    position: right;
  }
</style>